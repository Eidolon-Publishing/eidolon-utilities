import { MODULE_ID } from "../time-triggers/core/constants.js";
import { resolveAllTargets, applyState, buildTimeline, captureSnapshot, gatherAllStateMaps } from "./runtime.js";
import CinematicEditorApplication from "./ui/CinematicEditorApplication.js";
import { TileAnimator, registerBehaviour, getBehaviour } from "./tile-animator.js";

const CINEMATIC_FLAG = "cinematic";
const CURRENT_VERSION = 2;

/** Handle for the currently running cinematic timeline (if any). */
let activeCinematicHandle = null;

/** Pre-cinematic snapshot for revert. */
let preCinematicSnapshot = null;

/** Pre-cinematic resolved targets for revert. */
let preCinematicTargets = null;

/** Generation counter to detect superseded onCanvasReady invocations. */
let canvasReadyGeneration = 0;

/** Progress flag key prefix for mid-refresh recovery. */
function progressFlagKey(sceneId) {
	return `cinematic-progress-${sceneId}`;
}

/** Debounce counter for progress saves. */
let stepsSinceLastSave = 0;

/**
 * Save cinematic progress to user flag (debounced: every 3 steps).
 * @param {string} sceneId
 * @param {number} stepIndex
 */
function saveProgress(sceneId, stepIndex) {
	stepsSinceLastSave++;
	if (stepsSinceLastSave < 3) return;
	stepsSinceLastSave = 0;
	game.user.setFlag(MODULE_ID, progressFlagKey(sceneId), {
		step: stepIndex,
		timestamp: Date.now(),
	}).catch(() => {});
}

/**
 * Clear cinematic progress flag.
 * @param {string} sceneId
 */
function clearProgress(sceneId) {
	stepsSinceLastSave = 0;
	game.user.unsetFlag(MODULE_ID, progressFlagKey(sceneId)).catch(() => {});
}

/**
 * Get saved progress for a scene (if recent enough).
 * @param {string} sceneId
 * @param {number} [maxAgeMs=300000]  Max age in ms (default: 5 min)
 * @returns {{ step: number, timestamp: number } | null}
 */
function getSavedProgress(sceneId, maxAgeMs = 300000) {
	const progress = game.user.getFlag(MODULE_ID, progressFlagKey(sceneId));
	if (!progress || typeof progress.step !== "number" || typeof progress.timestamp !== "number") return null;
	if (Date.now() - progress.timestamp > maxAgeMs) return null;
	return progress;
}

/**
 * Validate the shape of cinematic flag data. Returns data if valid, null if not.
 * @param {*} data  Raw flag value
 * @param {string} sceneId  Scene ID for warning messages
 * @returns {object|null}
 */
function validateCinematicData(data, sceneId) {
	if (data == null) return null;
	if (typeof data !== "object" || Array.isArray(data)) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid flag data on scene ${sceneId} (expected object, got ${Array.isArray(data) ? "array" : typeof data}). Ignoring.`);
		return null;
	}
	if (data.version !== undefined && typeof data.version !== "number") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'version' on scene ${sceneId} (expected number). Ignoring.`);
		return null;
	}
	if (data.trigger !== undefined && typeof data.trigger !== "string") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'trigger' on scene ${sceneId} (expected string). Ignoring.`);
		return null;
	}
	if (data.tracking !== undefined && typeof data.tracking !== "boolean") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'tracking' on scene ${sceneId} (expected boolean). Ignoring.`);
		return null;
	}
	if (data.synchronized !== undefined && typeof data.synchronized !== "boolean") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'synchronized' on scene ${sceneId} (expected boolean). Ignoring.`);
		return null;
	}
	if (data.setup !== undefined && (typeof data.setup !== "object" || data.setup === null || Array.isArray(data.setup))) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'setup' on scene ${sceneId} (expected object). Ignoring.`);
		return null;
	}
	if (data.landing !== undefined && (typeof data.landing !== "object" || data.landing === null || Array.isArray(data.landing))) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'landing' on scene ${sceneId} (expected object). Ignoring.`);
		return null;
	}
	if (data.timeline !== undefined && !Array.isArray(data.timeline)) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'timeline' on scene ${sceneId} (expected array). Ignoring.`);
		return null;
	}
	// Validate individual timeline entries — filter out malformed ones
	if (data.timeline?.length) {
		data.timeline = data.timeline.filter((entry, i) => {
			if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}] on scene ${sceneId} is not a valid object, removing.`);
				return false;
			}
			if (entry.delay != null && typeof entry.delay !== "number") {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}].delay on scene ${sceneId} is not a number, removing entry.`);
				return false;
			}
			if (entry.await != null && (typeof entry.await !== "object" || entry.await === null)) {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}].await on scene ${sceneId} is not an object, removing entry.`);
				return false;
			}
			if (entry.emit != null && typeof entry.emit !== "string") {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}].emit on scene ${sceneId} is not a string, removing entry.`);
				return false;
			}
			if (entry.parallel != null && (!entry.parallel.branches || !Array.isArray(entry.parallel.branches))) {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}].parallel.branches on scene ${sceneId} is not an array, removing entry.`);
				return false;
			}
			if (entry.tweens != null && !Array.isArray(entry.tweens)) {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}].tweens on scene ${sceneId} is not an array, removing entry.`);
				return false;
			}
			return true;
		});
	}
	return data;
}

/**
 * Get the cinematic data from a scene's flags.
 * @param {string} [sceneId]
 * @returns {object|null}
 */
function getCinematicData(sceneId) {
	const scene = sceneId ? game.scenes.get(sceneId) : canvas.scene;
	const raw = scene?.getFlag(MODULE_ID, CINEMATIC_FLAG) ?? null;
	return validateCinematicData(raw, scene?.id ?? sceneId ?? "unknown");
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
		let notified = false;
		const notifyTimer = setTimeout(() => {
			notified = true;
			ui.notifications?.info?.(`[${MODULE_ID}] Cinematic: waiting for tween engine...`);
		}, 2000);
		const interval = setInterval(() => {
			const api = game.modules.get(MODULE_ID)?.api?.tween;
			if (api?.Timeline) {
				clearInterval(interval);
				clearTimeout(notifyTimer);
				resolve(api.Timeline);
			} else if (Date.now() - start > timeoutMs) {
				clearInterval(interval);
				clearTimeout(notifyTimer);
				console.warn(`[${MODULE_ID}] Cinematic: tween API not available after ${timeoutMs}ms.`);
				ui.notifications?.warn?.(`[${MODULE_ID}] Cinematic: tween engine unavailable — cinematic cannot play.`);
				resolve(null);
			}
		}, 200);
	});
}

/**
 * Wait for the Tagger API to become available.
 * @param {number} [timeoutMs=5000]
 * @returns {Promise<boolean>} true if Tagger is available
 */
async function waitForTagger(timeoutMs = 5000) {
	if (window.Tagger ?? game.modules.get("tagger")?.api) return true;

	return new Promise((resolve) => {
		const start = Date.now();
		const interval = setInterval(() => {
			if (window.Tagger ?? game.modules.get("tagger")?.api) {
				clearInterval(interval);
				resolve(true);
			} else if (Date.now() - start > timeoutMs) {
				clearInterval(interval);
				console.warn(`[${MODULE_ID}] Cinematic: Tagger API not available after ${timeoutMs}ms.`);
				resolve(false);
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

	// Cancel any in-flight cinematic before starting a new one
	if (activeCinematicHandle?.status === "running") {
		activeCinematicHandle.cancel("replaced");
	}
	activeCinematicHandle = null;

	const data = getCinematicData(id);
	if (!data) {
		console.warn(`[${MODULE_ID}] Cinematic: no cinematic data on scene ${id}.`);
		return;
	}

	const Timeline = await waitForTweenAPI();
	if (!Timeline) return;

	// Scene may have changed during async wait
	if (canvas.scene?.id !== id) return;

	// Ensure Tagger is ready before resolving tag-based targets
	await waitForTagger();

	// Scene may have changed during async wait
	if (canvas.scene?.id !== id) return;

	const { targets, unresolved } = resolveAllTargets(data);
	console.log(`[${MODULE_ID}] Cinematic: resolved ${targets.size} targets:`, [...targets.entries()].map(([k, v]) => `${k} → ${v?.document?.uuid ?? v?.constructor?.name ?? "?"}`));
	if (unresolved.length) {
		console.warn(`[${MODULE_ID}] Cinematic: skipping ${unresolved.length} unresolved: ${unresolved.join(", ")}`);
	}
	if (targets.size === 0) {
		console.warn(`[${MODULE_ID}] Cinematic: no targets could be resolved on scene ${id}.`);
		return;
	}

	// Capture pre-cinematic snapshot for revert API
	const allStateMaps = gatherAllStateMaps(data);
	preCinematicSnapshot = captureSnapshot(allStateMaps, targets);
	preCinematicTargets = targets;

	// Check for saved progress from a mid-refresh recovery
	const savedProgress = getSavedProgress(id);
	const skipToStep = savedProgress ? savedProgress.step : undefined;
	if (skipToStep != null) {
		console.log(`[${MODULE_ID}] Cinematic: resuming from step ${skipToStep} (saved ${Date.now() - savedProgress.timestamp}ms ago)`);
	}

	const tl = buildTimeline(data, targets, Timeline, {
		skipToStep,
		onStepComplete: (stepIndex) => saveProgress(id, stepIndex),
	});
	console.log(`[${MODULE_ID}] Cinematic: timeline built, JSON:`, JSON.stringify(tl.toJSON()));

	tl.onComplete(async () => {
		activeCinematicHandle = null;
		preCinematicSnapshot = null;
		preCinematicTargets = null;
		clearProgress(id);
		// Apply landing state so tiles end up in their final position
		if (data.landing) {
			try {
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic: error applying landing state on complete for scene ${id}:`, err);
			}
		}
		if (data.tracking !== false) {
			await game.user.setFlag(MODULE_ID, seenFlagKey(id), true);
		}
		console.log(`[${MODULE_ID}] Cinematic complete on scene ${id}.`);
	});

	tl.onCancel(() => {
		activeCinematicHandle = null;
		preCinematicSnapshot = null;
		preCinematicTargets = null;
		clearProgress(id);
		console.log(`[${MODULE_ID}] Cinematic cancelled on scene ${id}.`);
		if (data.landing) {
			try {
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic: error applying landing state after cancel on scene ${id}:`, err);
			}
		}
	});

	tl.onError((outcome) => {
		activeCinematicHandle = null;
		preCinematicSnapshot = null;
		preCinematicTargets = null;
		clearProgress(id);
		console.error(`[${MODULE_ID}] Cinematic error on scene ${id}:`, outcome);
		if (data.landing) {
			try {
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic: error applying landing state after error on scene ${id}:`, err);
			}
		}
	});

	const isSynchronized = data.synchronized === true && game.user.isGM;
	activeCinematicHandle = tl.run({
		broadcast: isSynchronized,
		commit: isSynchronized,
	});
	console.log(`[${MODULE_ID}] Cinematic: timeline started, handle status: ${activeCinematicHandle.status}`);
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
 * Clear the "seen" flag for a specific user on a scene. GM only.
 * @param {string} [sceneId]
 * @param {string} userId
 */
async function resetCinematicForUser(sceneId, userId) {
	if (!game.user.isGM) return;
	const id = sceneId ?? canvas.scene?.id;
	if (!id || !userId) return;
	const user = game.users.get(userId);
	if (!user) return;
	await user.unsetFlag(MODULE_ID, seenFlagKey(id));
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for user ${user.name} on scene ${id}.`);
}

/**
 * Clear the "seen" flag for ALL users on a scene. GM only.
 * @param {string} [sceneId]
 */
async function resetCinematicForAll(sceneId) {
	if (!game.user.isGM) return;
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;
	const key = seenFlagKey(id);
	const promises = game.users.map((u) => {
		if (u.getFlag(MODULE_ID, key)) return u.unsetFlag(MODULE_ID, key);
		return Promise.resolve();
	});
	await Promise.all(promises);
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for all users on scene ${id}.`);
}

/**
 * Get the "seen" status for all users on a scene.
 * @param {string} [sceneId]
 * @returns {Array<{ userId: string, name: string, color: string, isGM: boolean, seen: boolean }>}
 */
function getSeenStatus(sceneId) {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return [];
	const key = seenFlagKey(id);
	return game.users.map((u) => ({
		userId: u.id,
		name: u.name,
		color: u.color ?? "#888888",
		isGM: u.isGM,
		seen: !!u.getFlag(MODULE_ID, key),
	}));
}

/**
 * Check if a scene has cinematic data.
 * @param {string} [sceneId]
 * @returns {boolean}
 */
function hasCinematic(sceneId) {
	return getCinematicData(sceneId ?? canvas.scene?.id) != null;
}

/**
 * Revert the scene to its pre-cinematic state using the captured snapshot.
 * Only works if a snapshot was captured from a recent playCinematic call.
 */
function revertCinematic() {
	if (!preCinematicSnapshot || !preCinematicTargets) {
		console.warn(`[${MODULE_ID}] Cinematic: no snapshot available for revert.`);
		return;
	}

	// Cancel any running cinematic first
	if (activeCinematicHandle?.status === "running") {
		activeCinematicHandle.cancel("reverted");
	}
	activeCinematicHandle = null;

	try {
		applyState(preCinematicSnapshot, preCinematicTargets);
		canvas.perception.update({ refreshLighting: true, refreshVision: true });
		console.log(`[${MODULE_ID}] Cinematic: reverted to pre-cinematic state.`);
	} catch (err) {
		console.error(`[${MODULE_ID}] Cinematic: error during revert:`, err);
	}

	preCinematicSnapshot = null;
	preCinematicTargets = null;
}

// ── canvasReady Handler ──────────────────────────────────────────────────

/**
 * Main handler: fires on every canvas ready, checks for cinematic data,
 * handles tracking, applies setup/landing, and runs timeline.
 */
async function onCanvasReady() {
	const gen = ++canvasReadyGeneration;
	console.log(`[${MODULE_ID}] Cinematic: canvasReady fired, gen=${gen}, game.ready=${game.ready}`);

	// Ensure game is fully ready — canvasReady can fire before ready in some
	// Foundry configurations, and modules like Tagger won't have their APIs yet.
	await waitForReady();
	if (gen !== canvasReadyGeneration) return; // superseded
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

	// Check for mid-refresh recovery — if there's saved progress, force play
	const savedProgress = getSavedProgress(scene.id);
	if (gen !== canvasReadyGeneration) return; // superseded
	if (savedProgress) {
		console.log(`[${MODULE_ID}] Cinematic: found saved progress at step ${savedProgress.step}, resuming...`);
		try {
			await playCinematic(scene.id);
		} catch (err) {
			console.error(`[${MODULE_ID}] Cinematic: unhandled error during resumed playback on scene ${scene.id}:`, err);
		}
		return;
	}

	// Tracking: skip if already seen
	const seen = data.tracking !== false && hasSeenCinematic(scene.id);
	console.log(`[${MODULE_ID}] Cinematic: tracking=${data.tracking}, seen=${seen}`);
	if (seen) {
		// Clean up any stale progress for this scene
		clearProgress(scene.id);

		// Cancel any in-flight cinematic before applying landing state
		if (activeCinematicHandle?.status === "running") {
			activeCinematicHandle.cancel("already-seen");
		}
		activeCinematicHandle = null;

		// Apply landing state so tiles are in their final position
		if (data.landing) {
			console.log(`[${MODULE_ID}] Cinematic: applying landing state (already seen)`);
			await waitForTagger();
			if (gen !== canvasReadyGeneration) return; // superseded
			try {
				const { targets } = resolveAllTargets(data);
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic: error applying landing state (already seen) on scene ${scene.id}:`, err);
			}
		}
		return;
	}

	if (gen !== canvasReadyGeneration) return; // superseded

	// Play the cinematic
	console.log(`[${MODULE_ID}] Cinematic: playing cinematic...`);
	try {
		await playCinematic(scene.id);
	} catch (err) {
		console.error(`[${MODULE_ID}] Cinematic: unhandled error during playback on scene ${scene.id}:`, err);
	}
}

/**
 * Clean up stale cinematic progress flags on game.user.
 * Removes any cinematic-progress-* flags older than maxAge.
 * @param {number} [maxAgeMs=300000]
 */
function cleanupStaleProgressFlags(maxAgeMs = 300000) {
	const flags = game.user.flags?.[MODULE_ID];
	if (!flags) return;
	const now = Date.now();
	for (const key of Object.keys(flags)) {
		if (!key.startsWith("cinematic-progress-")) continue;
		const progress = flags[key];
		if (!progress || typeof progress.timestamp !== "number") {
			game.user.unsetFlag(MODULE_ID, key).catch(() => {});
			continue;
		}
		if (now - progress.timestamp > maxAgeMs) {
			console.log(`[${MODULE_ID}] Cinematic: cleaning up stale progress flag "${key}" (age: ${now - progress.timestamp}ms)`);
			game.user.unsetFlag(MODULE_ID, key).catch(() => {});
		}
	}
}

// ── Scene Control Button ─────────────────────────────────────────────────

function registerEditorButton() {
	Hooks.on("getSceneControlButtons", (controls) => {
		if (!game.user.isGM) return;

		const list = Array.isArray(controls) ? controls : controls instanceof Map ? Array.from(controls.values()) : Object.values(controls);
		if (!list.length) return;

		const target = list.find((c) => c?.name === "tiles") ?? list.find((c) => c?.name === "tokens" || c?.name === "token") ?? list[0];
		if (!target) return;

		const tools = target.tools;
		const toolName = "eidolonCinematicEditor";

		// Check if already registered
		if (Array.isArray(tools) && tools.some((t) => t?.name === toolName)) return;
		if (tools instanceof Map && tools.has(toolName)) return;

		const tool = {
			name: toolName,
			title: "Cinematic Editor",
			icon: "fa-solid fa-film",
			button: true,
			toggle: false,
			visible: true,
			onClick: () => {
				new CinematicEditorApplication({ scene: canvas.scene }).render(true);
			},
		};

		if (Array.isArray(tools)) tools.push(tool);
		else if (tools instanceof Map) tools.set(toolName, tool);
		else if (tools && typeof tools === "object") tools[toolName] = tool;
		else target.tools = [tool];
	});
}

// ── Hook Registration ────────────────────────────────────────────────────

export function registerCinematicHooks() {
	Hooks.on("canvasReady", onCanvasReady);
	registerEditorButton();

	Hooks.once("ready", () => {
		cleanupStaleProgressFlags();

		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.cinematic = {
			play: playCinematic,
			reset: resetCinematic,
			resetForUser: resetCinematicForUser,
			resetForAll: resetCinematicForAll,
			getSeenStatus: getSeenStatus,
			has: hasCinematic,
			get: getCinematicData,
			revert: revertCinematic,
			TileAnimator,
			registerBehaviour,
			getBehaviour,
			trigger: async (triggerName, sceneId) => {
				const id = sceneId ?? canvas.scene?.id;
				if (!id) return;
				const data = getCinematicData(id);
				if (!data) return;
				if (data.trigger && data.trigger !== triggerName) return;
				await playCinematic(id);
			},
		};

		console.log(`[${MODULE_ID}] Cinematic API registered.`);
	});
}
