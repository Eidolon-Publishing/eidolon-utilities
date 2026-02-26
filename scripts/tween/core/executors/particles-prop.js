import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";

/**
 * Validate particles-prop tween parameters.
 * @param {object} params
 * @param {string} params.attribute  Property name on canvas.particleeffects (e.g. "alpha")
 * @param {number} params.value  Target value to animate to
 */
function validate(params) {
	if (!params.attribute || typeof params.attribute !== "string") {
		throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
	}
	if (typeof params.value !== "number") {
		throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
	}
}

/**
 * Animate a numeric property on canvas.particleeffects (FXMaster particle container).
 * Uses CanvasAnimation with direct property writes per frame — no Foundry document
 * involved, so no commit/updateSource pattern needed.
 *
 * @param {object} params
 * @param {string} params.attribute  Property name (e.g. "alpha")
 * @param {number} params.value  Target value
 * @param {object} opts
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing="easeInOutCosine"]
 * @param {number|null} [opts.startEpochMS=null]
 * @param {AbortSignal|null} [opts.signal=null]
 * @returns {Promise<boolean>} true if animation completed
 */
async function execute(params, opts = {}) {
	const { CanvasAnimation } = foundry.canvas.animation;

	const { attribute, value: targetValue } = params;
	const {
		durationMS = 2000,
		easing = "easeInOutCosine",
		startEpochMS = null,
		signal = null,
	} = opts;

	const target = canvas.particleeffects;
	if (!target) {
		console.warn("particles-prop tween: canvas.particleeffects not available.");
		return false;
	}

	const sourceValue = target[attribute];
	if (typeof sourceValue !== "number") {
		console.warn(`particles-prop tween: current value of '${attribute}' is not a number (got ${typeof sourceValue}). Skipping.`);
		return false;
	}

	const easingFn = resolveEasing(easing);
	const name = `particles-prop-tween:${attribute}`;
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
		target[attribute] = sourceValue + (targetValue - sourceValue) * t;
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

	// Ensure exact target value after animation
	if (completed !== false) {
		if (signal?.aborted) return false;
		target[attribute] = targetValue;
	}

	return completed !== false;
}

export function registerParticlesPropTween() {
	registerTweenType({ type: "particles-prop", execute, validate });
}
