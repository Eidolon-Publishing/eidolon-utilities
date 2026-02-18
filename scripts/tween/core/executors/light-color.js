import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";
import { getInterpolator, listInterpolationModes } from "../color-interpolation.js";

/**
 * Validate light-color tween parameters.
 * @param {object} params
 * @param {string|string[]} params.uuid  AmbientLight document UUID(s)
 * @param {string} [params.toColor] Target CSS color (e.g. "#ff0000")
 * @param {number} [params.toAlpha] Target alpha (0–1)
 * @param {string} [params.mode]  Interpolation mode: "hsl", "rgb", "oklch"
 */
function validate(params) {
	const uuids = Array.isArray(params.uuid) ? params.uuid : [params.uuid];
	if (uuids.some((id) => !id || typeof id !== "string")) {
		throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
	}
	if (params.toColor == null && params.toAlpha == null) {
		throw new Error("light-color tween: at least one of 'toColor' or 'toAlpha' is required.");
	}
	if (params.toColor != null) {
		if (typeof params.toColor !== "string") {
			throw new Error("light-color tween: 'toColor' must be a CSS color string.");
		}
		const testColor = foundry.utils.Color.fromString(params.toColor);
		if (!testColor.valid) {
			throw new Error(`light-color tween: invalid target color "${params.toColor}".`);
		}
	}
	if (params.toAlpha != null) {
		if (typeof params.toAlpha !== "number" || params.toAlpha < 0 || params.toAlpha > 1) {
			throw new Error("light-color tween: 'toAlpha' must be a number between 0 and 1.");
		}
	}
	if (params.mode && !listInterpolationModes().includes(params.mode)) {
		throw new Error(
			`light-color tween: unknown mode "${params.mode}". Available: ${listInterpolationModes().join(", ")}`
		);
	}
}

/**
 * Animate one or more AmbientLight colors and/or alpha from current value
 * to the target(s). At least one of `toColor` or `toAlpha` must be provided.
 * Uses CanvasAnimation with local-only updateSource per frame;
 * the DB is only written once at the end if `commit` is true.
 *
 * @param {object} params
 * @param {string|string[]} params.uuid
 * @param {string} [params.toColor]
 * @param {number} [params.toAlpha] Target alpha (0–1)
 * @param {string} [params.mode="oklch"]  Interpolation: "hsl", "rgb", "oklch"
 * @param {object} opts
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing="easeInOutCosine"]
 * @param {boolean} [opts.commit=true]
 * @param {number|null} [opts.startEpochMS=null]
 * @returns {Promise<boolean>} true if all animations completed (none terminated early)
 */
async function execute(params, opts = {}) {
	const { CanvasAnimation } = foundry.canvas.animation;
	const { Color } = foundry.utils;

	const { uuid, toColor, toAlpha, mode = "oklch" } = params;
	const uuids = Array.isArray(uuid) ? uuid : [uuid];
	if (uuids.length === 0) {
		console.warn("light-color tween: empty uuid array, nothing to animate.");
		return true;
	}
	const {
		durationMS = 2000,
		easing = "easeInOutCosine",
		commit = true,
		startEpochMS = null,
	} = opts;

	const easingFn = resolveEasing(easing);
	const animateColor = toColor != null;
	const animateAlpha = toAlpha != null;

	const interpolate = animateColor ? getInterpolator(mode) : null;
	const toC = animateColor ? Color.fromString(toColor) : null;
	if (animateColor && !toC.valid) throw new Error(`light-color tween: invalid target color "${toColor}".`);

	async function animateOne(id) {
		const doc = await fromUuid(id);
		if (!doc) return false;

		const light = doc.object;
		if (!light) return false;

		// Capture source values
		let sourceColor;
		if (animateColor) {
			const fromC = doc.config?.color;
			if (!fromC?.valid) {
				console.warn(`light-color tween: source color invalid on ${id}, using white.`);
			}
			sourceColor = fromC?.valid ? fromC : Color.fromString("#ffffff");
		}

		const sourceAlpha = animateAlpha ? (doc._source.config?.alpha ?? 0.5) : null;

		const state = { t: 0 };
		const name = `ambient-hue-tween:${id}`;
		CanvasAnimation.terminateAnimation(name);

		// Fast-forward if we joined late (synchronized start)
		const timeOffset =
			typeof startEpochMS === "number"
				? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
				: 0;

		const applyFrame = (t) => {
			const configPatch = {};
			if (animateColor) configPatch.color = interpolate(sourceColor, toC, t);
			if (animateAlpha) configPatch.alpha = sourceAlpha + (toAlpha - sourceAlpha) * t;
			doc.updateSource({ config: configPatch });
			light.initializeLightSource();
		};

		// Seed initial frame for fast-forward
		if (timeOffset > 0) {
			state.t = timeOffset / durationMS;
			applyFrame(state.t);
		}

		const completed = await CanvasAnimation.animate(
			[{ parent: state, attribute: "t", to: 1 }],
			{
				name,
				duration: durationMS,
				easing: easingFn,
				time: timeOffset,
				ontick: () => applyFrame(state.t),
			}
		);

		// Ensure exact target values after animation.
		// CanvasAnimation may not fire ontick at exactly t=1.
		if (completed !== false) {
			const finalPatch = {};
			if (animateColor) finalPatch.color = toC.toHTML();
			if (animateAlpha) finalPatch.alpha = toAlpha;
			doc.updateSource({ config: finalPatch });
			light.initializeLightSource();
		}

		// Persist once at the end (GM only, opt-in)
		if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
			// Reset source to original so Foundry detects a real diff for the DB write.
			const resetPatch = {};
			const commitPatch = {};
			if (animateColor) {
				resetPatch.color = sourceColor.toHTML();
				commitPatch["config.color"] = toC.toHTML();
			}
			if (animateAlpha) {
				resetPatch.alpha = sourceAlpha;
				commitPatch["config.alpha"] = toAlpha;
			}
			doc.updateSource({ config: resetPatch });
			await doc.update(commitPatch);
		}

		return completed !== false;
	}

	const results = await Promise.all(uuids.map(animateOne));
	return results.every(Boolean);
}

export function registerLightColorTween() {
	registerTweenType({ type: "light-color", execute, validate });
}
