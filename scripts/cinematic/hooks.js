import { MODULE_ID } from "../time-triggers/core/constants.js";
import { resolveAllTargets, applyState, buildTimeline, captureSnapshot, gatherAllStateMaps, stopAllCinematicSounds } from "./runtime.js";
import CinematicEditorApplication from "./ui/CinematicEditorApplication.js";
import { TileAnimator, registerBehaviour, getBehaviour } from "./tile-animator.js";

const CINEMATIC_FLAG = "cinematic";
const CURRENT_VERSION = 3;

/** Handle for the currently running cinematic timeline (if any). */
let activeCinematicHandle = null;

/** Pre-cinematic snapshot for revert. */
let preCinematicSnapshot = null;

/** Pre-cinematic resolved targets for revert. */
let preCinematicTargets = null;

/** Generation counter to detect superseded onCanvasReady invocations. */
let canvasReadyGeneration = 0;

/** Pending cross-scene cinematic transition (set by transitionTo, consumed by canvasReady). */
let pendingCinematic = null;

/** Progress flag key prefix for mid-refresh recovery. */
function progressFlagKey(sceneId, cinematicName = "default") {
	return `cinematic-progress-${sceneId}-${cinematicName}`;
}

/** Debounce counter for progress saves. */
let stepsSinceLastSave = 0;

/**
 * Save cinematic progress to user flag (debounced: every 3 steps).
 * @param {string} sceneId
 * @param {string} cinematicName
 * @param {number} stepIndex
 */
function saveProgress(sceneId, cinematicName, stepIndex) {
	stepsSinceLastSave++;
	if (stepsSinceLastSave < 3) return;
	stepsSinceLastSave = 0;
	game.user.setFlag(MODULE_ID, progressFlagKey(sceneId, cinematicName), {
		step: stepIndex,
		timestamp: Date.now(),
	}).catch(() => {});
}

/**
 * Clear cinematic progress flag.
 * @param {string} sceneId
 * @param {string} cinematicName
 */
function clearProgress(sceneId, cinematicName = "default") {
	stepsSinceLastSave = 0;
	game.user.unsetFlag(MODULE_ID, progressFlagKey(sceneId, cinematicName)).catch(() => {});
}

/**
 * Get saved progress for a scene cinematic (if recent enough).
 * @param {string} sceneId
 * @param {string} cinematicName
 * @param {number} [maxAgeMs=300000]  Max age in ms (default: 5 min)
 * @returns {{ step: number, timestamp: number } | null}
 */
function getSavedProgress(sceneId, cinematicName = "default", maxAgeMs = 300000) {
	const progress = game.user.getFlag(MODULE_ID, progressFlagKey(sceneId, cinematicName));
	if (!progress || typeof progress.step !== "number" || typeof progress.timestamp !== "number") return null;
	if (Date.now() - progress.timestamp > maxAgeMs) return null;
	return progress;
}

/**
 * Get the per-user "seen" flag key for a scene cinematic.
 * @param {string} sceneId
 * @param {string} cinematicName
 * @returns {string}
 */
function seenFlagKey(sceneId, cinematicName = "default") {
	return `cinematic-seen-${sceneId}-${cinematicName}`;
}

/**
 * Check if the current user has already seen this scene's cinematic.
 * @param {string} sceneId
 * @param {string} cinematicName
 * @returns {boolean}
 */
function hasSeenCinematic(sceneId, cinematicName = "default") {
	return !!game.user.getFlag(MODULE_ID, seenFlagKey(sceneId, cinematicName));
}

// ── v3 Data Access ──────────────────────────────────────────────────────

/**
 * Validate a single cinematic entry's shape.
 * @param {*} data  Raw cinematic data
 * @param {string} label  Label for warnings
 * @returns {object|null}
 */
function validateSingleCinematic(data, label) {
	if (data == null) return null;
	if (typeof data !== "object" || Array.isArray(data)) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid data for ${label} (expected object). Ignoring.`);
		return null;
	}
	if (data.trigger !== undefined && typeof data.trigger !== "string") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'trigger' on ${label} (expected string). Ignoring.`);
		return null;
	}
	if (data.tracking !== undefined && typeof data.tracking !== "boolean") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'tracking' on ${label} (expected boolean). Ignoring.`);
		return null;
	}
	if (data.synchronized !== undefined && typeof data.synchronized !== "boolean") {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'synchronized' on ${label} (expected boolean). Ignoring.`);
		return null;
	}
	if (data.setup !== undefined && (typeof data.setup !== "object" || data.setup === null || Array.isArray(data.setup))) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'setup' on ${label} (expected object). Ignoring.`);
		return null;
	}
	if (data.landing !== undefined && (typeof data.landing !== "object" || data.landing === null || Array.isArray(data.landing))) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'landing' on ${label} (expected object). Ignoring.`);
		return null;
	}
	if (data.timeline !== undefined && !Array.isArray(data.timeline)) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'timeline' on ${label} (expected array). Ignoring.`);
		return null;
	}
	// Filter out malformed timeline entries
	if (data.timeline?.length) {
		data.timeline = data.timeline.filter((entry, i) => {
			if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
				console.warn(`[${MODULE_ID}] Cinematic: timeline[${i}] on ${label} is not a valid object, removing.`);
				return false;
			}
			return true;
		});
	}
	return data;
}

/**
 * Get the full v3 cinematic wrapper from a scene's flags (with inline v2→v3 migration).
 * @param {string} [sceneId]
 * @returns {object|null}  The v3 wrapper: { version, cinematics: { name: data, ... } }
 */
function getCinematicData(sceneId) {
	const scene = sceneId ? game.scenes.get(sceneId) : canvas.scene;
	let raw = scene?.getFlag(MODULE_ID, CINEMATIC_FLAG) ?? null;
	if (raw == null) return null;

	if (typeof raw !== "object" || Array.isArray(raw)) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid flag data on scene ${scene?.id} (expected object). Ignoring.`);
		return null;
	}

	// v2→v3 migration
	if ((raw.version ?? 1) < 3) {
		const { version, ...rest } = raw;
		raw = { version: CURRENT_VERSION, cinematics: { "default": rest } };
	}

	// Version check
	if (raw.version > CURRENT_VERSION) {
		console.warn(`[${MODULE_ID}] Cinematic: scene ${scene?.id} has version ${raw.version}, runtime supports up to ${CURRENT_VERSION}. Skipping.`);
		return null;
	}

	if (!raw.cinematics || typeof raw.cinematics !== "object") {
		console.warn(`[${MODULE_ID}] Cinematic: no 'cinematics' map on scene ${scene?.id}. Ignoring.`);
		return null;
	}

	// Validate each cinematic entry
	for (const [name, data] of Object.entries(raw.cinematics)) {
		const validated = validateSingleCinematic(data, `scene ${scene?.id} cinematic "${name}"`);
		if (!validated) {
			delete raw.cinematics[name];
		} else {
			raw.cinematics[name] = validated;
		}
	}

	if (Object.keys(raw.cinematics).length === 0) return null;

	return raw;
}

/**
 * Get a specific named cinematic's data from a scene.
 * @param {string} sceneId
 * @param {string} cinematicName
 * @returns {object|null}
 */
function getNamedCinematic(sceneId, cinematicName = "default") {
	const wrapper = getCinematicData(sceneId);
	return wrapper?.cinematics?.[cinematicName] ?? null;
}

/**
 * List all cinematic names on a scene.
 * @param {string} sceneId
 * @returns {string[]}
 */
function listCinematicNames(sceneId) {
	const wrapper = getCinematicData(sceneId);
	return wrapper ? Object.keys(wrapper.cinematics) : [];
}

// ── Async Helpers ─────────────────────────────────────────────────────────

/**
 * Wait for the game to be fully ready.
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

// ── Playback ──────────────────────────────────────────────────────────────

/**
 * Play a cinematic on the current (or specified) scene.
 * Ignores tracking — always plays. Used by the public API for re-watch.
 *
 * @param {string} [sceneId]  Defaults to current canvas scene
 * @param {string} [cinematicName="default"]  Which cinematic to play
 * @param {Set<string>} [_visitedChain]  Internal: circular transition detection
 */
async function playCinematic(sceneId, cinematicName = "default", _visitedChain = null) {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;

	// Circular transition detection
	const chainKey = `${id}:${cinematicName}`;
	if (!_visitedChain) _visitedChain = new Set();
	if (_visitedChain.has(chainKey)) {
		console.warn(`[${MODULE_ID}] Cinematic: circular transition detected at "${chainKey}". Stopping chain.`);
		ui.notifications?.warn?.("Cinematic: circular transition detected, stopping.");
		return;
	}
	_visitedChain.add(chainKey);

	// Cancel any in-flight cinematic before starting a new one
	if (activeCinematicHandle?.status === "running") {
		activeCinematicHandle.cancel("replaced");
	}
	activeCinematicHandle = null;

	const data = getNamedCinematic(id, cinematicName);
	if (!data) {
		console.warn(`[${MODULE_ID}] Cinematic: no cinematic "${cinematicName}" on scene ${id}.`);
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
	console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": resolved ${targets.size} targets:`, [...targets.entries()].map(([k, v]) => `${k} → ${v?.document?.uuid ?? v?.constructor?.name ?? "?"}`));
	if (unresolved.length) {
		console.warn(`[${MODULE_ID}] Cinematic "${cinematicName}": skipping ${unresolved.length} unresolved: ${unresolved.join(", ")}`);
	}
	if (targets.size === 0) {
		console.warn(`[${MODULE_ID}] Cinematic "${cinematicName}": no targets could be resolved on scene ${id}.`);
		return;
	}

	// Capture pre-cinematic snapshot for revert API
	const allStateMaps = gatherAllStateMaps(data);
	preCinematicSnapshot = captureSnapshot(allStateMaps, targets);
	preCinematicTargets = targets;

	// Check for saved progress from a mid-refresh recovery
	const savedProgress = getSavedProgress(id, cinematicName);
	const skipToStep = savedProgress ? savedProgress.step : undefined;
	if (skipToStep != null) {
		console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": resuming from step ${skipToStep} (saved ${Date.now() - savedProgress.timestamp}ms ago)`);
	}

	const { tl, transitionTo } = buildTimeline(data, targets, Timeline, {
		skipToStep,
		onStepComplete: (stepIndex) => saveProgress(id, cinematicName, stepIndex),
		timelineName: `cinematic-${id}-${cinematicName}`,
	});
	console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": timeline built, JSON:`, JSON.stringify(tl.toJSON()));

	tl.onComplete(async () => {
		activeCinematicHandle = null;
		preCinematicSnapshot = null;
		preCinematicTargets = null;
		clearProgress(id, cinematicName);
		stopAllCinematicSounds();

		// Apply landing state so tiles end up in their final position
		if (data.landing) {
			try {
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${cinematicName}": error applying landing state on complete for scene ${id}:`, err);
			}
		}
		if (data.tracking !== false) {
			await game.user.setFlag(MODULE_ID, seenFlagKey(id, cinematicName), true);
		}
		console.log(`[${MODULE_ID}] Cinematic "${cinematicName}" complete on scene ${id}.`);

		// Handle transition
		if (transitionTo) {
			const targetCinematic = transitionTo.cinematic;
			const targetScene = transitionTo.scene;
			if (!targetCinematic) {
				console.warn(`[${MODULE_ID}] Cinematic "${cinematicName}": transitionTo has no cinematic name, ignoring.`);
			} else if (!targetScene || targetScene === id) {
				// Same-scene transition
				console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": transitioning to "${targetCinematic}" on same scene.`);
				playCinematic(id, targetCinematic, _visitedChain);
			} else {
				// Cross-scene transition
				console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": transitioning to "${targetCinematic}" on scene ${targetScene}.`);
				pendingCinematic = { sceneId: targetScene, cinematicName: targetCinematic, visitedChain: _visitedChain };
				const scene = game.scenes.get(targetScene);
				if (scene) {
					scene.view();
				} else {
					console.warn(`[${MODULE_ID}] Cinematic: cross-scene transition target scene "${targetScene}" not found.`);
					pendingCinematic = null;
				}
			}
		}
	});

	tl.onCancel(() => {
		activeCinematicHandle = null;
		preCinematicSnapshot = null;
		preCinematicTargets = null;
		clearProgress(id, cinematicName);
		stopAllCinematicSounds();
		console.log(`[${MODULE_ID}] Cinematic "${cinematicName}" cancelled on scene ${id}.`);
		if (data.landing) {
			try {
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${cinematicName}": error applying landing state after cancel on scene ${id}:`, err);
			}
		}
	});

	tl.onError((outcome) => {
		activeCinematicHandle = null;
		preCinematicSnapshot = null;
		preCinematicTargets = null;
		clearProgress(id, cinematicName);
		stopAllCinematicSounds();
		console.error(`[${MODULE_ID}] Cinematic "${cinematicName}" error on scene ${id}:`, outcome);
		if (data.landing) {
			try {
				applyState(data.landing, targets);
				canvas.perception.update({ refreshLighting: true, refreshVision: true });
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${cinematicName}": error applying landing state after error on scene ${id}:`, err);
			}
		}
	});

	const isSynchronized = data.synchronized === true && game.user.isGM;
	activeCinematicHandle = tl.run({
		broadcast: isSynchronized,
		commit: isSynchronized,
	});
	console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": timeline started, handle status: ${activeCinematicHandle.status}`);
}

/**
 * Clear the "seen" flag for the current user on a scene cinematic.
 * @param {string} [sceneId]
 * @param {string} [cinematicName="default"]
 */
async function resetCinematic(sceneId, cinematicName = "default") {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;
	await game.user.unsetFlag(MODULE_ID, seenFlagKey(id, cinematicName));
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for "${cinematicName}" on scene ${id}.`);
}

/**
 * Clear the "seen" flag for a specific user on a scene cinematic. GM only.
 * @param {string} [sceneId]
 * @param {string} userId
 * @param {string} [cinematicName="default"]
 */
async function resetCinematicForUser(sceneId, userId, cinematicName = "default") {
	if (!game.user.isGM) return;
	const id = sceneId ?? canvas.scene?.id;
	if (!id || !userId) return;
	const user = game.users.get(userId);
	if (!user) return;
	await user.unsetFlag(MODULE_ID, seenFlagKey(id, cinematicName));
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for user ${user.name} on "${cinematicName}" scene ${id}.`);
}

/**
 * Clear the "seen" flag for ALL users on a scene cinematic. GM only.
 * @param {string} [sceneId]
 * @param {string} [cinematicName="default"]
 */
async function resetCinematicForAll(sceneId, cinematicName = "default") {
	if (!game.user.isGM) return;
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;
	const key = seenFlagKey(id, cinematicName);
	const promises = game.users.map((u) => {
		if (u.getFlag(MODULE_ID, key)) return u.unsetFlag(MODULE_ID, key);
		return Promise.resolve();
	});
	await Promise.all(promises);
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for all users on "${cinematicName}" scene ${id}.`);
}

/**
 * Get the "seen" status for all users on a scene cinematic.
 * @param {string} [sceneId]
 * @param {string} [cinematicName="default"]
 * @returns {Array<{ userId: string, name: string, color: string, isGM: boolean, seen: boolean }>}
 */
function getSeenStatus(sceneId, cinematicName = "default") {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return [];
	const key = seenFlagKey(id, cinematicName);
	return game.users.map((u) => ({
		userId: u.id,
		name: u.name,
		color: u.color ?? "#888888",
		isGM: u.isGM,
		seen: !!u.getFlag(MODULE_ID, key),
	}));
}

/**
 * Check if a scene has cinematic data (optionally for a specific name).
 * @param {string} [sceneId]
 * @param {string} [cinematicName]
 * @returns {boolean}
 */
function hasCinematic(sceneId, cinematicName) {
	const id = sceneId ?? canvas.scene?.id;
	if (cinematicName) {
		return getNamedCinematic(id, cinematicName) != null;
	}
	return getCinematicData(id) != null;
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

	// Ensure game is fully ready
	await waitForReady();
	if (gen !== canvasReadyGeneration) return;
	console.log(`[${MODULE_ID}] Cinematic: game is ready`);

	const scene = canvas.scene;
	if (!scene) { console.log(`[${MODULE_ID}] Cinematic: no canvas.scene, exiting`); return; }

	// Check for pending cross-scene cinematic transition first
	if (pendingCinematic && pendingCinematic.sceneId === scene.id) {
		const pending = pendingCinematic;
		pendingCinematic = null;
		console.log(`[${MODULE_ID}] Cinematic: picking up pending transition to "${pending.cinematicName}" on scene ${scene.id}`);
		try {
			await playCinematic(scene.id, pending.cinematicName, pending.visitedChain);
		} catch (err) {
			console.error(`[${MODULE_ID}] Cinematic: error during pending transition playback on scene ${scene.id}:`, err);
		}
		return;
	}
	pendingCinematic = null; // Clear stale pending if scene doesn't match

	const wrapper = getCinematicData(scene.id);
	if (!wrapper) { console.log(`[${MODULE_ID}] Cinematic: no cinematic flag on scene ${scene.id}, exiting`); return; }
	console.log(`[${MODULE_ID}] Cinematic: found ${Object.keys(wrapper.cinematics).length} cinematic(s) on scene ${scene.id}`);

	// Find canvasReady-triggered cinematics
	const canvasReadyCinematics = [];
	for (const [name, data] of Object.entries(wrapper.cinematics)) {
		if (!data.trigger || data.trigger === "canvasReady") {
			canvasReadyCinematics.push({ name, data });
		}
	}

	if (canvasReadyCinematics.length === 0) {
		console.log(`[${MODULE_ID}] Cinematic: no canvasReady cinematics on scene ${scene.id}, exiting`);
		return;
	}

	// Check for mid-refresh recovery on any cinematic
	for (const { name } of canvasReadyCinematics) {
		const savedProgress = getSavedProgress(scene.id, name);
		if (gen !== canvasReadyGeneration) return;
		if (savedProgress) {
			console.log(`[${MODULE_ID}] Cinematic "${name}": found saved progress at step ${savedProgress.step}, resuming...`);
			try {
				await playCinematic(scene.id, name);
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${name}": error during resumed playback on scene ${scene.id}:`, err);
			}
			return;
		}
	}

	// Find first unseen canvasReady cinematic
	let firstUnseen = null;
	for (const { name, data } of canvasReadyCinematics) {
		const seen = data.tracking !== false && hasSeenCinematic(scene.id, name);
		if (!seen) {
			firstUnseen = { name, data };
			break;
		}
	}

	if (!firstUnseen) {
		// All seen — apply landing states for all canvasReady cinematics
		console.log(`[${MODULE_ID}] Cinematic: all canvasReady cinematics already seen on scene ${scene.id}`);
		clearAllCanvasReadyProgress(scene.id, canvasReadyCinematics);

		// Cancel any in-flight cinematic
		if (activeCinematicHandle?.status === "running") {
			activeCinematicHandle.cancel("already-seen");
		}
		activeCinematicHandle = null;

		await waitForTagger();
		if (gen !== canvasReadyGeneration) return;

		for (const { name, data } of canvasReadyCinematics) {
			if (data.landing) {
				try {
					const { targets } = resolveAllTargets(data);
					applyState(data.landing, targets);
				} catch (err) {
					console.error(`[${MODULE_ID}] Cinematic "${name}": error applying landing state (already seen) on scene ${scene.id}:`, err);
				}
			}
		}
		canvas.perception.update({ refreshLighting: true, refreshVision: true });
		return;
	}

	if (gen !== canvasReadyGeneration) return;

	// Play the first unseen cinematic
	console.log(`[${MODULE_ID}] Cinematic: playing first unseen cinematic "${firstUnseen.name}"...`);

	// Apply landing states for all seen cinematics first
	await waitForTagger();
	if (gen !== canvasReadyGeneration) return;

	for (const { name, data } of canvasReadyCinematics) {
		if (name === firstUnseen.name) continue; // skip the one we're about to play
		const seen = data.tracking !== false && hasSeenCinematic(scene.id, name);
		if (seen && data.landing) {
			try {
				const { targets } = resolveAllTargets(data);
				applyState(data.landing, targets);
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${name}": error applying landing state (already seen) on scene ${scene.id}:`, err);
			}
		}
	}

	try {
		await playCinematic(scene.id, firstUnseen.name);
	} catch (err) {
		console.error(`[${MODULE_ID}] Cinematic "${firstUnseen.name}": error during playback on scene ${scene.id}:`, err);
	}
}

function clearAllCanvasReadyProgress(sceneId, cinematics) {
	for (const { name } of cinematics) {
		clearProgress(sceneId, name);
	}
}

/**
 * Clean up stale cinematic progress flags on game.user.
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
			get: getNamedCinematic,
			list: listCinematicNames,
			revert: revertCinematic,
			TileAnimator,
			registerBehaviour,
			getBehaviour,
			trigger: async (triggerName, sceneId, cinematicName = "default") => {
				const id = sceneId ?? canvas.scene?.id;
				if (!id) return;
				const data = getNamedCinematic(id, cinematicName);
				if (!data) return;
				if (data.trigger && data.trigger !== triggerName) return;
				await playCinematic(id, cinematicName);
			},
		};

		console.log(`[${MODULE_ID}] Cinematic API registered (v3).`);
	});
}
