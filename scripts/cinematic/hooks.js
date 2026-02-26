import { MODULE_ID } from "../time-triggers/core/constants.js";
import { resolveAllTargets, applyState, buildTimeline } from "./runtime.js";

const CINEMATIC_FLAG = "cinematic";
const CURRENT_VERSION = 1;

/**
 * Get the cinematic data from a scene's flags.
 * @param {string} [sceneId]
 * @returns {object|null}
 */
function getCinematicData(sceneId) {
	const scene = sceneId ? game.scenes.get(sceneId) : canvas.scene;
	return scene?.getFlag(MODULE_ID, CINEMATIC_FLAG) ?? null;
}

/**
 * Get the per-user "seen" flag key for a scene.
 * @param {string} sceneId
 * @returns {string}
 */
function seenFlagKey(sceneId) {
	return `cinematic-seen-${sceneId}`;
}

/**
 * Check if the current user has already seen this scene's cinematic.
 * @param {string} sceneId
 * @returns {boolean}
 */
function hasSeenCinematic(sceneId) {
	return !!game.user.getFlag(MODULE_ID, seenFlagKey(sceneId));
}

/**
 * Wait for the game to be fully ready. In some Foundry configurations,
 * canvasReady can fire before the ready hook completes, so modules like
 * Tagger may not have their APIs registered yet.
 * @returns {Promise<void>}
 */
function waitForReady() {
	if (game.ready) return Promise.resolve();
	return new Promise((resolve) => Hooks.once("ready", resolve));
}

/**
 * Wait for the tween API to become available.
 * @param {number} [timeoutMs=10000]
 * @returns {Promise<typeof import("../tween/core/timeline/TweenTimeline.js").TweenTimeline | null>}
 */
async function waitForTweenAPI(timeoutMs = 10000) {
	const api = game.modules.get(MODULE_ID)?.api?.tween;
	if (api?.Timeline) return api.Timeline;

	return new Promise((resolve) => {
		const start = Date.now();
		const interval = setInterval(() => {
			const api = game.modules.get(MODULE_ID)?.api?.tween;
			if (api?.Timeline) {
				clearInterval(interval);
				resolve(api.Timeline);
			} else if (Date.now() - start > timeoutMs) {
				clearInterval(interval);
				console.warn(`[${MODULE_ID}] Cinematic: tween API not available after ${timeoutMs}ms.`);
				resolve(null);
			}
		}, 200);
	});
}

/**
 * Play a cinematic on the current (or specified) scene.
 * Ignores tracking — always plays. Used by the public API for re-watch.
 *
 * @param {string} [sceneId]  Defaults to current canvas scene
 */
async function playCinematic(sceneId) {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;

	const data = getCinematicData(id);
	if (!data) {
		console.warn(`[${MODULE_ID}] Cinematic: no cinematic data on scene ${id}.`);
		return;
	}

	const Timeline = await waitForTweenAPI();
	if (!Timeline) return;

	const targets = resolveAllTargets(data);
	console.log(`[${MODULE_ID}] Cinematic: resolved ${targets.size} targets:`, [...targets.entries()].map(([k, v]) => `${k} → ${v?.document?.uuid ?? v?.constructor?.name ?? "?"}`));
	if (targets.size === 0) {
		console.warn(`[${MODULE_ID}] Cinematic: no targets could be resolved on scene ${id}.`);
		return;
	}

	const tl = buildTimeline(data, targets, Timeline);
	console.log(`[${MODULE_ID}] Cinematic: timeline built, JSON:`, JSON.stringify(tl.toJSON()));

	tl.onComplete(async () => {
		if (data.tracking !== false) {
			await game.user.setFlag(MODULE_ID, seenFlagKey(id), true);
		}
		console.log(`[${MODULE_ID}] Cinematic complete on scene ${id}.`);
	});

	tl.onCancel(() => {
		console.log(`[${MODULE_ID}] Cinematic cancelled on scene ${id}.`);
	});

	tl.onError((outcome) => {
		console.error(`[${MODULE_ID}] Cinematic error on scene ${id}:`, outcome);
	});

	const handle = tl.run({ broadcast: false, commit: false });
	console.log(`[${MODULE_ID}] Cinematic: timeline started, handle status: ${handle.status}`);
}

/**
 * Clear the "seen" flag for the current user on a scene.
 * @param {string} [sceneId]
 */
async function resetCinematic(sceneId) {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;
	await game.user.unsetFlag(MODULE_ID, seenFlagKey(id));
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for scene ${id}.`);
}

/**
 * Check if a scene has cinematic data.
 * @param {string} [sceneId]
 * @returns {boolean}
 */
function hasCinematic(sceneId) {
	return getCinematicData(sceneId ?? canvas.scene?.id) != null;
}

// ── canvasReady Handler ──────────────────────────────────────────────────

/**
 * Main handler: fires on every canvas ready, checks for cinematic data,
 * handles tracking, applies setup/landing, and runs timeline.
 */
async function onCanvasReady() {
	console.log(`[${MODULE_ID}] Cinematic: canvasReady fired, game.ready=${game.ready}`);

	// Ensure game is fully ready — canvasReady can fire before ready in some
	// Foundry configurations, and modules like Tagger won't have their APIs yet.
	await waitForReady();
	console.log(`[${MODULE_ID}] Cinematic: game is ready`);

	const scene = canvas.scene;
	if (!scene) { console.log(`[${MODULE_ID}] Cinematic: no canvas.scene, exiting`); return; }

	const data = getCinematicData(scene.id);
	if (!data) { console.log(`[${MODULE_ID}] Cinematic: no cinematic flag on scene ${scene.id}, exiting`); return; }
	console.log(`[${MODULE_ID}] Cinematic: found flag data on scene ${scene.id}`);

	// Version check
	if (data.version && data.version > CURRENT_VERSION) {
		console.warn(`[${MODULE_ID}] Cinematic: scene ${scene.id} has version ${data.version}, runtime supports up to ${CURRENT_VERSION}. Skipping.`);
		return;
	}

	// Trigger check (v1 only supports canvasReady)
	if (data.trigger && data.trigger !== "canvasReady") { console.log(`[${MODULE_ID}] Cinematic: trigger "${data.trigger}" doesn't match, exiting`); return; }

	// Tracking: skip if already seen
	const seen = data.tracking !== false && hasSeenCinematic(scene.id);
	console.log(`[${MODULE_ID}] Cinematic: tracking=${data.tracking}, seen=${seen}`);
	if (seen) {
		// Apply landing state so tiles are in their final position
		if (data.landing) {
			console.log(`[${MODULE_ID}] Cinematic: applying landing state (already seen)`);
			const targets = resolveAllTargets(data);
			applyState(data.landing, targets);
			canvas.perception.update({ refreshLighting: true, refreshVision: true });
		}
		return;
	}

	// Play the cinematic
	console.log(`[${MODULE_ID}] Cinematic: playing cinematic...`);
	await playCinematic(scene.id);
}

// ── Hook Registration ────────────────────────────────────────────────────

export function registerCinematicHooks() {
	Hooks.on("canvasReady", onCanvasReady);

	Hooks.once("ready", () => {
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.cinematic = {
			play: playCinematic,
			reset: resetCinematic,
			has: hasCinematic,
		};

		console.log(`[${MODULE_ID}] Cinematic API registered.`);
	});
}
