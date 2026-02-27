import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";
import { getInterpolator, listInterpolationModes } from "../color-interpolation.js";

/**
 * Validate tile-tint tween parameters.
 * @param {object} params
 * @param {string|string[]} params.uuid  Tile document UUID(s)
 * @param {string} params.toColor  Target CSS color string (e.g. "#ffcc88")
 * @param {string} [params.mode]  Interpolation mode: "hsl", "rgb", "oklch"
 */
function validate(params) {
	const uuids = Array.isArray(params.uuid) ? params.uuid : [params.uuid];
	if (uuids.some((id) => !id || typeof id !== "string")) {
		throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
	}
	if (params.toColor == null || typeof params.toColor !== "string") {
		throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
	}
	const testColor = foundry.utils.Color.fromString(params.toColor);
	if (!testColor.valid) {
		throw new Error(`tile-tint tween: invalid target color "${params.toColor}".`);
	}
	if (params.mode && !listInterpolationModes().includes(params.mode)) {
		throw new Error(
			`tile-tint tween: unknown mode "${params.mode}". Available: ${listInterpolationModes().join(", ")}`
		);
	}
}

/**
 * Animate the texture tint on one or more Tiles from their current tint
 * to a target color. Uses CanvasAnimation with local-only updateSource per
 * frame; the DB is only written once at the end if `commit` is true.
 *
 * @param {object} params
 * @param {string|string[]} params.uuid
 * @param {string} params.toColor  Target CSS color
 * @param {string} [params.mode="oklch"]  Interpolation: "hsl", "rgb", "oklch"
 * @param {object} opts
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing="easeInOutCosine"]
 * @param {boolean} [opts.commit=true]
 * @param {number|null} [opts.startEpochMS=null]
 * @param {AbortSignal|null} [opts.signal=null]
 * @returns {Promise<boolean>} true if all animations completed
 */
async function execute(params, opts = {}) {
	const { CanvasAnimation } = foundry.canvas.animation;
	const { Color } = foundry.utils;

	const { uuid, toColor, mode = "oklch" } = params;
	const uuids = Array.isArray(uuid) ? uuid : [uuid];
	if (uuids.length === 0) {
		console.warn("tile-tint tween: empty uuid array, nothing to animate.");
		return true;
	}
	const {
		durationMS = 2000,
		easing = "easeInOutCosine",
		commit = true,
		startEpochMS = null,
		signal = null,
	} = opts;

	const easingFn = resolveEasing(easing);
	const interpolate = getInterpolator(mode);
	const toC = Color.fromString(toColor);
	if (!toC.valid) throw new Error(`tile-tint tween: invalid target color "${toColor}".`);

	async function animateOne(id) {
		if (signal?.aborted) return false;
		const doc = await fromUuid(id);
		if (!doc) return false;

		const tile = doc.object;
		if (!tile) return false;

		// Read current tint from source data (defaults to white if absent)
		const sourceTintStr = doc._source?.texture?.tint ?? "#ffffff";
		const sourceColor = Color.fromString(sourceTintStr);
		if (!sourceColor.valid) {
			console.warn(`tile-tint tween: source tint invalid on ${id}, using white.`);
		}
		const fromC = sourceColor.valid ? sourceColor : Color.fromString("#ffffff");

		const state = { t: 0 };
		const name = `tile-tint-tween:${id}`;
		CanvasAnimation.terminateAnimation(name);

		if (signal) {
			signal.addEventListener("abort", () => {
				CanvasAnimation.terminateAnimation(name);
			}, { once: true });
		}

		// Fast-forward if we joined late (synchronized start)
		const timeOffset =
			typeof startEpochMS === "number"
				? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
				: 0;

		const applyFrame = (t) => {
			const hex = interpolate(fromC, toC, t);
			doc.updateSource({ texture: { tint: hex } });
			tile.refresh();
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

		// Ensure exact target value after animation
		if (completed !== false) {
			if (signal?.aborted) return false;
			doc.updateSource({ texture: { tint: toC.toHTML() } });
			tile.refresh();
		}

		// Persist once at the end (GM only, opt-in)
		if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
			if (signal?.aborted) return false;
			// Reset source to original so Foundry detects a real diff
			doc.updateSource({ texture: { tint: fromC.toHTML() } });
			await doc.update({ "texture.tint": toC.toHTML() });
		}

		return completed !== false;
	}

	const results = await Promise.all(uuids.map(animateOne));
	return results.every(Boolean);
}

export function registerTileTintTween() {
	registerTweenType({ type: "tile-tint", execute, validate });
}
