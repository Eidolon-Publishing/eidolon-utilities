import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";

/**
 * Validate light-state tween parameters.
 * @param {object} params
 * @param {string|string[]} params.uuid  AmbientLight document UUID(s)
 * @param {boolean} params.enabled Target state: true = fade in (unhide), false = fade out (hide)
 */
function validate(params) {
	const uuids = Array.isArray(params.uuid) ? params.uuid : [params.uuid];
	if (uuids.length === 0 || uuids.some((id) => !id || typeof id !== "string")) {
		throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
	}
	if (typeof params.enabled !== "boolean") {
		throw new Error("light-state tween: 'enabled' (boolean) is required.");
	}
}

/**
 * Fade one or more lights' alpha between 0 and their configured value,
 * toggling the `hidden` flag only at commit time.
 *
 * All local visual changes use updateSource + initializeLightSource (no doc.update
 * during animation, which would trigger a full Foundry refresh and kill the tween).
 *
 * @param {object} params
 * @param {string|string[]} params.uuid
 * @param {boolean} params.enabled
 * @param {object} opts
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing="easeInOutCosine"]
 * @param {boolean} [opts.commit=true]
 * @param {number|null} [opts.startEpochMS=null]
 * @returns {Promise<boolean>} true if all animations completed (none terminated early)
 */
async function execute(params, opts = {}) {
	const { CanvasAnimation } = foundry.canvas.animation;

	const { uuid, enabled } = params;
	const uuids = Array.isArray(uuid) ? uuid : [uuid];
	const {
		durationMS = 2000,
		easing = "easeInOutCosine",
		commit = true,
		startEpochMS = null,
	} = opts;

	const easingFn = resolveEasing(easing);

	async function animateOne(id) {
		const doc = await fromUuid(id);
		if (!doc) return false;

		const light = doc.object;
		if (!light) return false;

		// Already in the target state — nothing to animate
		if (enabled && !doc.hidden) return true;
		if (!enabled && doc.hidden) return true;

		const targetAlpha = doc.config.alpha ?? 0.5;

		const name = `ambient-state-tween:${id}`;
		CanvasAnimation.terminateAnimation(name);

		const timeOffset =
			typeof startEpochMS === "number"
				? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
				: 0;

		// All per-frame changes are local only (updateSource + initializeLightSource).
		// Never call doc.update() during animation — it triggers a full Foundry refresh.
		const applyLocal = (alpha, hidden) => {
			doc.updateSource({ hidden, config: { alpha } });
			light.initializeLightSource();
		};

		if (enabled) {
			// Fade in: unhide at alpha=0 locally, then ramp up
			applyLocal(0, false);

			const state = { t: 0 };

			if (timeOffset > 0) {
				state.t = timeOffset / durationMS;
				applyLocal(targetAlpha * state.t, false);
			}

			const completed = await CanvasAnimation.animate(
				[{ parent: state, attribute: "t", to: 1 }],
				{
					name,
					duration: durationMS,
					easing: easingFn,
					time: timeOffset,
					ontick: () => applyLocal(targetAlpha * state.t, false),
				}
			);

			// Commit: persist hidden=false + original alpha to DB
			if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
				// Reset source to hidden so Foundry detects a diff
				doc.updateSource({ hidden: true, config: { alpha: targetAlpha } });
				await doc.update({ hidden: false, "config.alpha": targetAlpha });
			}

			return completed !== false;
		} else {
			// Fade out: ramp alpha down, then hide
			const state = { t: 0 };

			if (timeOffset > 0) {
				state.t = timeOffset / durationMS;
				applyLocal(targetAlpha * (1 - state.t), false);
			}

			const completed = await CanvasAnimation.animate(
				[{ parent: state, attribute: "t", to: 1 }],
				{
					name,
					duration: durationMS,
					easing: easingFn,
					time: timeOffset,
					ontick: () => applyLocal(targetAlpha * (1 - state.t), false),
				}
			);

			// Commit: persist hidden=true + original alpha to DB
			if (commit && completed !== false && doc.canUserModify(game.user, "update")) {
				// Reset source to visible so Foundry detects a diff
				doc.updateSource({ hidden: false, config: { alpha: targetAlpha } });
				await doc.update({ hidden: true, "config.alpha": targetAlpha });
			} else {
				// Non-commit: set final visual state locally
				applyLocal(targetAlpha, true);
			}

			return completed !== false;
		}
	}

	const results = await Promise.all(uuids.map(animateOne));
	return results.every(Boolean);
}

export function registerLightStateTween() {
	registerTweenType({ type: "light-state", execute, validate });
}
