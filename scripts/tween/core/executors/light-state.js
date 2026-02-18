import { registerTweenType } from "../registry.js";
import { resolveEasing } from "../easing.js";

/**
 * Snapshot of a light's DB state captured before animation starts.
 * Survives across concurrent tweens on the same document so a new tween
 * can restore clean state after terminating its predecessor.
 * @type {WeakMap<object, { hidden: boolean, alpha: number }>}
 */
const dbSnapshot = new WeakMap();

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
 * toggling the `hidden` flag only at commit time via doc.update().
 *
 * The commit ONLY changes `hidden` — never `config.alpha`. The light's
 * configured alpha is a user setting that the tween animates toward but
 * must not overwrite. Foundry v13's DataModel silently ignores dot-notation
 * updates to nested schema fields (e.g. "config.alpha"), which previously
 * caused alpha to collapse to 0 in the DB after a fade-out commit.
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

		const name = `ambient-state-tween:${id}`;
		CanvasAnimation.terminateAnimation(name);

		// DB truth: snapshot from a prior (terminated) tween, or current source.
		const snap = dbSnapshot.get(doc) ?? {
			hidden: doc._source.hidden,
			alpha: doc._source.config?.alpha ?? 0.5,
		};
		dbSnapshot.set(doc, snap);

		console.log(`[light-state] START ${enabled ? "ON" : "OFF"} | snap:`, JSON.stringify(snap),
			`| _source.hidden=${doc._source.hidden}, _source.config.alpha=${doc._source.config?.alpha}`,
			`| doc.hidden=${doc.hidden}, doc.config?.alpha=${doc.config?.alpha}`);

		// Already in target state? Nothing to animate.
		if (enabled && !snap.hidden) {
			dbSnapshot.delete(doc);
			return true;
		}
		if (!enabled && snap.hidden) {
			dbSnapshot.delete(doc);
			return true;
		}

		const targetAlpha = snap.alpha;
		console.log(`[light-state] targetAlpha=${targetAlpha}`);

		const timeOffset =
			typeof startEpochMS === "number"
				? Math.max(0, Math.min(durationMS, Date.now() - startEpochMS))
				: 0;

		// Per-frame: only animate config.alpha locally. Never touch hidden per-tick.
		const applyAlpha = (alpha) => {
			doc.updateSource({ config: { alpha } });
			light.initializeLightSource();
		};

		if (enabled) {
			// Fade in: unhide locally, start at alpha=0, ramp up to targetAlpha.
			doc.updateSource({ hidden: false, config: { alpha: 0 } });
			light.initializeLightSource();
			canvas.perception.update({ refreshLighting: true, refreshVision: true });

			const state = { t: 0 };

			if (timeOffset > 0) {
				state.t = timeOffset / durationMS;
				applyAlpha(targetAlpha * state.t);
			}

			let tickCount = 0;
			const completed = await CanvasAnimation.animate(
				[{ parent: state, attribute: "t", to: 1 }],
				{
					name,
					duration: durationMS,
					easing: easingFn,
					time: timeOffset,
					ontick: () => { tickCount++; applyAlpha(targetAlpha * state.t); },
				}
			);

			console.log(`[light-state] FADE-IN anim done. completed=${completed}, ticks=${tickCount}, state.t=${state.t}`);

			if (completed !== false && commit && doc.canUserModify(game.user, "update")) {
				console.log(`[light-state] FADE-IN pre-commit: _source.hidden=${doc._source.hidden}, _source.config.alpha=${doc._source.config?.alpha}`);
				doc.updateSource({ hidden: true, config: { alpha: targetAlpha } });
				console.log(`[light-state] FADE-IN post-updateSource: _source.hidden=${doc._source.hidden}, _source.config.alpha=${doc._source.config?.alpha}`);
				await doc.update({ hidden: false });
				console.log(`[light-state] FADE-IN post-commit: _source.hidden=${doc._source.hidden}, _source.config.alpha=${doc._source.config?.alpha}`);
				dbSnapshot.delete(doc);
			} else if (completed === false) {
				console.log(`[light-state] FADE-IN terminated`);
			} else {
				dbSnapshot.delete(doc);
			}

			return completed !== false;
		} else {
			// Fade out: source is visible at DB alpha. Ramp alpha down to 0.
			doc.updateSource({ hidden: false, config: { alpha: snap.alpha } });
			light.initializeLightSource();

			const state = { t: 0 };

			if (timeOffset > 0) {
				state.t = timeOffset / durationMS;
				applyAlpha(targetAlpha * (1 - state.t));
			}

			let tickCount = 0;
			const completed = await CanvasAnimation.animate(
				[{ parent: state, attribute: "t", to: 1 }],
				{
					name,
					duration: durationMS,
					easing: easingFn,
					time: timeOffset,
					ontick: () => { tickCount++; applyAlpha(targetAlpha * (1 - state.t)); },
				}
			);

			console.log(`[light-state] FADE-OUT anim done. completed=${completed}, ticks=${tickCount}`);

			if (completed !== false && commit && doc.canUserModify(game.user, "update")) {
				console.log(`[light-state] FADE-OUT pre-commit: _source.hidden=${doc._source.hidden}, _source.config.alpha=${doc._source.config?.alpha}`);
				await doc.update({ hidden: true });
				// doc.update only applied the hidden diff — alpha is still dirty from
				// the animation. Restore it so the next tween's snapshot reads correctly.
				doc.updateSource({ config: { alpha: targetAlpha } });
				light.initializeLightSource();
				console.log(`[light-state] FADE-OUT post-commit+restore: _source.hidden=${doc._source.hidden}, _source.config.alpha=${doc._source.config?.alpha}`);
				dbSnapshot.delete(doc);
			} else if (completed === false) {
				// Terminated by a new tween — leave snapshot for it to restore from
			} else {
				// Completed without commit: set final visual state locally
				doc.updateSource({ hidden: true, config: { alpha: targetAlpha } });
				light.initializeLightSource();
				dbSnapshot.delete(doc);
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
