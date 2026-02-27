import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";

/**
 * Validate tile-scale tween parameters.
 * @param {object} params
 * @param {string|string[]} params.uuid       Tile document UUID(s)
 * @param {number}          params.toScale    Target scale factor (1.0 = original size)
 * @param {number}          params.baseWidth  Reference width (original tile width)
 * @param {number}          params.baseHeight Reference height (original tile height)
 * @param {number}          params.centerX    Reference center X (original x + width/2)
 * @param {number}          params.centerY    Reference center Y (original y + height/2)
 */
function validate(params) {
	const uuids = Array.isArray(params.uuid) ? params.uuid : [params.uuid];
	if (uuids.some((id) => !id || typeof id !== "string")) {
		throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
	}
	if (typeof params.toScale !== "number" || params.toScale <= 0) {
		throw new Error("tile-scale tween: 'toScale' must be a positive number.");
	}
	for (const key of ["baseWidth", "baseHeight", "centerX", "centerY"]) {
		if (typeof params[key] !== "number") {
			throw new Error(`tile-scale tween: '${key}' (number) is required.`);
		}
	}
}

/**
 * Animate a tile's scale around its center point. Tweens width, height, x, y
 * simultaneously so the tile grows/shrinks symmetrically.
 *
 * @param {object} params
 * @param {string|string[]} params.uuid
 * @param {number}          params.toScale     Target scale (1.0 = base size)
 * @param {number}          params.baseWidth   Original tile width
 * @param {number}          params.baseHeight  Original tile height
 * @param {number}          params.centerX     Original center X
 * @param {number}          params.centerY     Original center Y
 * @param {object} opts
 * @param {number}  [opts.durationMS=2000]
 * @param {string}  [opts.easing="easeInOutCosine"]
 * @param {boolean} [opts.commit=true]
 * @param {number|null}  [opts.startEpochMS=null]
 * @param {AbortSignal|null} [opts.signal=null]
 * @returns {Promise<boolean>}
 */
async function execute(params, opts = {}) {
	const { CanvasAnimation } = foundry.canvas.animation;

	const { uuid, toScale, baseWidth, baseHeight, centerX, centerY } = params;
	const uuids = Array.isArray(uuid) ? uuid : [uuid];
	if (uuids.length === 0) return true;

	const {
		durationMS = 2000,
		easing = "easeInOutCosine",
		commit = true,
		startEpochMS = null,
		signal = null,
	} = opts;

	const easingFn = resolveEasing(easing);

	// Target geometry
	const targetW = baseWidth * toScale;
	const targetH = baseHeight * toScale;
	const targetX = centerX - targetW / 2;
	const targetY = centerY - targetH / 2;

	async function animateOne(id) {
		if (signal?.aborted) return false;
		const doc = await fromUuid(id);
		if (!doc) return false;

		const tile = doc.object;
		if (!tile) return false;

		// Read current source values
		const srcW = doc._source.width;
		const srcH = doc._source.height;
		const srcX = doc._source.x;
		const srcY = doc._source.y;

		const name = `tile-scale-tween:${id}`;
		CanvasAnimation.terminateAnimation(name);

		if (signal) {
			signal.addEventListener("abort", () => {
				CanvasAnimation.terminateAnimation(name);
			}, { once: true });
		}

		const timeOffset =
			typeof startEpochMS === "number"
				? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
				: 0;

		const applyFrame = (t) => {
			const w = srcW + (targetW - srcW) * t;
			const h = srcH + (targetH - srcH) * t;
			const x = srcX + (targetX - srcX) * t;
			const y = srcY + (targetY - srcY) * t;
			doc.updateSource({ width: w, height: h, x, y });
			tile.refresh();
		};

		const state = { t: 0 };

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

		if (completed !== false) {
			if (signal?.aborted) return false;
			doc.updateSource({ width: targetW, height: targetH, x: targetX, y: targetY });
			tile.refresh();
		}

		if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
			if (signal?.aborted) return false;
			doc.updateSource({ width: srcW, height: srcH, x: srcX, y: srcY });
			await doc.update({ width: targetW, height: targetH, x: targetX, y: targetY });
		}

		return completed !== false;
	}

	const results = await Promise.all(uuids.map(animateOne));
	return results.every(Boolean);
}

export function registerTileScaleTween() {
	registerTweenType({ type: "tile-scale", execute, validate });
}
