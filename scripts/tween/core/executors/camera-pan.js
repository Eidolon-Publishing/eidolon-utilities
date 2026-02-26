import { registerTweenType } from "../registry.js";

/**
 * Validate camera-pan tween parameters.
 * @param {object} params
 * @param {number} [params.x]  Target X coordinate
 * @param {number} [params.y]  Target Y coordinate
 * @param {number} [params.scale]  Target zoom scale (must be > 0)
 */
function validate(params) {
	if (params.x == null && params.y == null && params.scale == null) {
		throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
	}
	if (params.x != null && typeof params.x !== "number") {
		throw new Error("camera-pan tween: 'x' must be a number.");
	}
	if (params.y != null && typeof params.y !== "number") {
		throw new Error("camera-pan tween: 'y' must be a number.");
	}
	if (params.scale != null && (typeof params.scale !== "number" || params.scale <= 0)) {
		throw new Error("camera-pan tween: 'scale' must be a positive number.");
	}
}

/**
 * Animate the canvas camera (pan/zoom).
 * Wraps canvas.animatePan() with AbortSignal race and startEpochMS fast-forward.
 * Visual-only — no database commit needed.
 *
 * @param {object} params
 * @param {number} [params.x]
 * @param {number} [params.y]
 * @param {number} [params.scale]
 * @param {object} opts
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing]  Not used by canvas.animatePan (it has its own easing)
 * @param {number|null} [opts.startEpochMS=null]
 * @param {AbortSignal|null} [opts.signal=null]
 * @returns {Promise<boolean>} true if animation completed
 */
async function execute(params, opts = {}) {
	const {
		durationMS = 2000,
		startEpochMS = null,
		signal = null,
	} = opts;

	if (signal?.aborted) return false;

	// Fast-forward: reduce remaining duration if we started late
	const timeOffset =
		typeof startEpochMS === "number"
			? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
			: 0;
	const remainingDuration = Math.max(0, durationMS - timeOffset);

	const panOpts = { duration: remainingDuration };
	if (params.x != null) panOpts.x = params.x;
	if (params.y != null) panOpts.y = params.y;
	if (params.scale != null) panOpts.scale = params.scale;

	// If fully fast-forwarded, snap directly
	if (remainingDuration <= 0) {
		await canvas.animatePan({ ...panOpts, duration: 0 });
		return true;
	}

	// Race between the pan animation and abort signal
	const panPromise = canvas.animatePan(panOpts);

	if (!signal) {
		await panPromise;
		return true;
	}

	return new Promise((resolve) => {
		const onAbort = () => {
			// canvas.animatePan doesn't have a cancel API, but we resolve false
			resolve(false);
		};
		signal.addEventListener("abort", onAbort, { once: true });

		panPromise.then(() => {
			signal.removeEventListener("abort", onAbort);
			resolve(!signal.aborted);
		}).catch(() => {
			signal.removeEventListener("abort", onAbort);
			resolve(false);
		});
	});
}

export function registerCameraPanTween() {
	registerTweenType({ type: "camera-pan", execute, validate });
}
