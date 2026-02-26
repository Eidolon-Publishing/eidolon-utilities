import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";

/**
 * Validate tile-prop tween parameters.
 * @param {object} params
 * @param {string|string[]} params.uuid  Tile document UUID(s)
 * @param {string} params.attribute  Dot-path to a numeric property (e.g. "alpha", "rotation")
 * @param {number} params.value  Target value to animate to
 */
function validate(params) {
	const uuids = Array.isArray(params.uuid) ? params.uuid : [params.uuid];
	if (uuids.some((id) => !id || typeof id !== "string")) {
		throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
	}
	if (!params.attribute || typeof params.attribute !== "string") {
		throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
	}
	if (typeof params.value !== "number") {
		throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
	}
}

/**
 * Animate a numeric property on one or more Tiles from their current value
 * to a target. Uses CanvasAnimation with local-only updateSource per frame;
 * the DB is only written once at the end if `commit` is true.
 *
 * @param {object} params
 * @param {string|string[]} params.uuid
 * @param {string} params.attribute  Dot-path to numeric property
 * @param {number} params.value  Target value
 * @param {object} opts
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing="easeInOutCosine"]
 * @param {boolean} [opts.commit=true]
 * @param {number|null} [opts.startEpochMS=null]
 * @param {AbortSignal|null} [opts.signal=null]
 * @returns {Promise<boolean>} true if all animations completed (none terminated early)
 */
async function execute(params, opts = {}) {
	const { CanvasAnimation } = foundry.canvas.animation;

	const { uuid, attribute, value: targetValue } = params;
	const uuids = Array.isArray(uuid) ? uuid : [uuid];
	if (uuids.length === 0) {
		console.warn("tile-prop tween: empty uuid array, nothing to animate.");
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

	async function animateOne(id) {
		if (signal?.aborted) return false;
		const doc = await fromUuid(id);
		if (!doc) return false;

		const tile = doc.object;
		if (!tile) return false;

		// Read current value from source data
		const sourceValue = foundry.utils.getProperty(doc._source, attribute);
		if (typeof sourceValue !== "number") {
			console.warn(`tile-prop tween: source value at '${attribute}' on ${id} is not a number (got ${typeof sourceValue}). Skipping.`);
			return false;
		}

		// Include attribute in name so concurrent tweens on different properties don't cancel each other
		const name = `tile-prop-tween:${attribute}:${id}`;
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
			const current = sourceValue + (targetValue - sourceValue) * t;
			doc.updateSource(foundry.utils.expandObject({ [attribute]: current }));
			tile.refresh();
		};

		const state = { t: 0 };

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

		// Ensure exact target value after animation.
		// CanvasAnimation may not fire ontick at exactly t=1.
		if (completed !== false) {
			if (signal?.aborted) return false;
			doc.updateSource(foundry.utils.expandObject({ [attribute]: targetValue }));
			tile.refresh();
		}

		// Persist once at the end (GM only, opt-in)
		if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
			if (signal?.aborted) return false;
			// Reset source to original so Foundry detects a real diff for the DB write.
			doc.updateSource(foundry.utils.expandObject({ [attribute]: sourceValue }));
			await doc.update({ [attribute]: targetValue });
		}

		return completed !== false;
	}

	const results = await Promise.all(uuids.map(animateOne));
	return results.every(Boolean);
}

export function registerTilePropTween() {
	registerTweenType({ type: "tile-prop", execute, validate });
}
