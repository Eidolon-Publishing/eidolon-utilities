import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";
import { getInterpolator, listInterpolationModes } from "../color-interpolation.js";

/**
 * Validate light-color tween parameters.
 * @param {object} params
 * @param {string|string[]} params.uuid  AmbientLight document UUID(s)
 * @param {string} params.toColor Target CSS color (e.g. "#ff0000")
 * @param {string} [params.mode]  Interpolation mode: "hsl", "rgb", "oklch"
 */
function validate(params) {
	const uuids = Array.isArray(params.uuid) ? params.uuid : [params.uuid];
	if (uuids.length === 0 || uuids.some((id) => !id || typeof id !== "string")) {
		throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
	}
	if (!params.toColor || typeof params.toColor !== "string") {
		throw new Error("light-color tween: 'toColor' is required (CSS color string).");
	}
	const testColor = foundry.utils.Color.fromString(params.toColor);
	if (!testColor.valid) {
		throw new Error(`light-color tween: invalid target color "${params.toColor}".`);
	}
	if (params.mode && !listInterpolationModes().includes(params.mode)) {
		throw new Error(
			`light-color tween: unknown mode "${params.mode}". Available: ${listInterpolationModes().join(", ")}`
		);
	}
}

/**
 * Animate one or more AmbientLight colors from current value to `toColor`.
 * Uses CanvasAnimation with local-only updateSource per frame;
 * the DB is only written once at the end if `commit` is true.
 *
 * @param {object} params
 * @param {string|string[]} params.uuid
 * @param {string} params.toColor
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

	const { uuid, toColor, mode = "oklch" } = params;
	const uuids = Array.isArray(uuid) ? uuid : [uuid];
	const {
		durationMS = 2000,
		easing = "easeInOutCosine",
		commit = true,
		startEpochMS = null,
	} = opts;

	const easingFn = resolveEasing(easing);
	const interpolate = getInterpolator(mode);
	const toC = Color.fromString(toColor);
	if (!toC.valid) throw new Error(`light-color tween: invalid target color "${toColor}".`);

	async function animateOne(id) {
		const doc = await fromUuid(id);
		if (!doc) return false;

		const light = doc.object;
		if (!light) return false;

		// Read current color
		const fromC = doc.config?.color;
		if (!fromC?.valid) {
			console.warn(`light-color tween: source color invalid on ${id}, using white.`);
		}
		const sourceColor = fromC?.valid ? fromC : Color.fromString("#ffffff");

		const state = { t: 0 };
		const name = `ambient-hue-tween:${id}`;
		CanvasAnimation.terminateAnimation(name);

		// Fast-forward if we joined late (synchronized start)
		const timeOffset =
			typeof startEpochMS === "number"
				? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
				: 0;

		const applyLocalColor = (css) => {
			doc.updateSource({ config: { color: css } });
			light.initializeLightSource();
		};

		// Seed initial frame for fast-forward
		if (timeOffset > 0) {
			state.t = timeOffset / durationMS;
			applyLocalColor(interpolate(sourceColor, toC, state.t));
		}

		const completed = await CanvasAnimation.animate(
			[{ parent: state, attribute: "t", to: 1 }],
			{
				name,
				duration: durationMS,
				easing: easingFn,
				time: timeOffset,
				ontick: () => {
					applyLocalColor(interpolate(sourceColor, toC, state.t));
				},
			}
		);

		// Ensure exact target color after animation (all clients).
		// CanvasAnimation may not fire ontick at exactly t=1, so the last
		// interpolated frame could be slightly off from the target hex.
		if (completed !== false) {
			applyLocalColor(toC.toHTML());
		}

		// Persist once at the end (GM only, opt-in)
		// completed is false if terminated early, undefined/true if finished
		if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
			// Reset source to original so Foundry detects a real diff for the DB write.
			// updateSource() during animation mutated the local source to match the target.
			doc.updateSource({ config: { color: sourceColor.toHTML() } });
			await doc.update({ "config.color": toC.toHTML() });
		}

		return completed !== false;
	}

	const results = await Promise.all(uuids.map(animateOne));
	return results.every(Boolean);
}

export function registerLightColorTween() {
	registerTweenType({ type: "light-color", execute, validate });
}
