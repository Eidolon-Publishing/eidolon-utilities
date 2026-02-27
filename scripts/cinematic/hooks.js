import { MODULE_ID } from "../time-triggers/core/constants.js";
import { resolveAllTargets, applyState, buildTimeline, captureSnapshot, gatherAllStateMaps, stopAllCinematicSounds } from "./runtime.js";
import { createAwaitPromise } from "../tween/core/timeline/await-providers.js";
import CinematicEditorApplication from "./ui/CinematicEditorApplication.js";
import { CinematicState } from "./ui/cinematic-state.js";
import { TileAnimator, registerBehaviour, getBehaviour } from "./tile-animator.js";
import { computeTotalDuration } from "./ui/swimlane-layout.js";

const CINEMATIC_FLAG = "cinematic";
const CURRENT_VERSION = 5;

// ── Playback Progress Event Bus ──────────────────────────────────────────

const playbackListeners = new Set();

function emitPlaybackEvent(event) {
	for (const fn of playbackListeners) {
		try { fn(event); } catch (err) {
			console.error("[cinematic] playback listener error:", err);
		}
	}
}

/**
 * Subscribe to playback progress events emitted during playCinematic().
 * @param {(event: object) => void} fn  Listener function
 * @returns {() => void}  Unsubscribe function
 */
export function onPlaybackProgress(fn) {
	playbackListeners.add(fn);
	return () => playbackListeners.delete(fn);
}

/** Handle for the currently running cinematic timeline (if any). */
let activeCinematicHandle = null;

/** AbortController for the currently running segment walker. */
let activeWalkerAbort = null;

/** Pre-cinematic snapshot for revert. */
let preCinematicSnapshot = null;

/** Pre-cinematic resolved targets for revert. */
let preCinematicTargets = null;

/** Generation counter to detect superseded onCanvasReady invocations. */
let canvasReadyGeneration = 0;

/** Pending cross-scene cinematic transition (set by segment next, consumed by canvasReady). */
let pendingCinematic = null;

// ── Progress tracking ────────────────────────────────────────────────────

/** Progress flag key prefix for mid-refresh recovery. */
function progressFlagKey(sceneId, cinematicName = "default") {
	return `cinematic-progress-${sceneId}-${cinematicName}`;
}

/**
 * Save segment-based cinematic progress to user flag.
 * @param {string} sceneId
 * @param {string} cinematicName
 * @param {string} currentSegment
 * @param {string[]} completedSegments
 */
function saveSegmentProgress(sceneId, cinematicName, currentSegment, completedSegments) {
	game.user.setFlag(MODULE_ID, progressFlagKey(sceneId, cinematicName), {
		currentSegment,
		completedSegments: [...completedSegments],
		timestamp: Date.now(),
	}).catch(() => {});
}

/**
 * Clear cinematic progress flag.
 * @param {string} sceneId
 * @param {string} cinematicName
 */
function clearProgress(sceneId, cinematicName = "default") {
	game.user.unsetFlag(MODULE_ID, progressFlagKey(sceneId, cinematicName)).catch(() => {});
}

/**
 * Get saved progress for a scene cinematic (if recent enough).
 * @param {string} sceneId
 * @param {string} cinematicName
 * @param {number} [maxAgeMs=300000]  Max age in ms (default: 5 min)
 * @returns {{ currentSegment: string, completedSegments: string[], timestamp: number } | null}
 */
function getSavedProgress(sceneId, cinematicName = "default", maxAgeMs = 300000) {
	const progress = game.user.getFlag(MODULE_ID, progressFlagKey(sceneId, cinematicName));
	if (!progress || typeof progress.timestamp !== "number") return null;
	if (Date.now() - progress.timestamp > maxAgeMs) return null;
	// Support both old step-based and new segment-based progress
	if (progress.currentSegment) return progress;
	return null;
}

/**
 * Get the per-user "seen" flag key for a scene cinematic.
 */
function seenFlagKey(sceneId, cinematicName = "default") {
	return `cinematic-seen-${sceneId}-${cinematicName}`;
}

/**
 * Check if the current user has already seen this scene's cinematic.
 */
function hasSeenCinematic(sceneId, cinematicName = "default") {
	return !!game.user.getFlag(MODULE_ID, seenFlagKey(sceneId, cinematicName));
}

// ── v4 Data Access ──────────────────────────────────────────────────────

/**
 * Validate a single cinematic entry's shape (v4 segment-based).
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
	// v4: validate segments
	if (data.segments) {
		if (typeof data.segments !== "object" || Array.isArray(data.segments)) {
			console.warn(`[${MODULE_ID}] Cinematic: invalid 'segments' on ${label} (expected object). Ignoring.`);
			return null;
		}
		for (const [segName, seg] of Object.entries(data.segments)) {
			if (!seg || typeof seg !== "object" || Array.isArray(seg)) {
				console.warn(`[${MODULE_ID}] Cinematic: invalid segment "${segName}" on ${label}. Removing.`);
				delete data.segments[segName];
				continue;
			}
			if (seg.timeline !== undefined && !Array.isArray(seg.timeline)) {
				console.warn(`[${MODULE_ID}] Cinematic: invalid timeline on segment "${segName}" of ${label}. Removing.`);
				delete data.segments[segName];
				continue;
			}
			// Filter out malformed timeline entries
			if (seg.timeline?.length) {
				seg.timeline = seg.timeline.filter((entry, i) => {
					if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
						console.warn(`[${MODULE_ID}] Cinematic: segment "${segName}" timeline[${i}] on ${label} is not a valid object, removing.`);
						return false;
					}
					return true;
				});
			}
		}
		if (Object.keys(data.segments).length === 0) {
			console.warn(`[${MODULE_ID}] Cinematic: no valid segments on ${label}. Ignoring.`);
			return null;
		}
	}
	// Legacy v3 flat validation
	if (data.timeline !== undefined && !Array.isArray(data.timeline)) {
		console.warn(`[${MODULE_ID}] Cinematic: invalid 'timeline' on ${label} (expected array). Ignoring.`);
		return null;
	}
	return data;
}

/**
 * Get the full cinematic wrapper from a scene's flags (with inline v2→v3→v4 migration).
 * @param {string} [sceneId]
 * @returns {object|null}  The v4 wrapper: { version, cinematics: { name: data, ... } }
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
		raw = { version: 3, cinematics: { "default": rest } };
	}

	// v3→v4 migration
	if (raw.version === 3) {
		for (const [name, data] of Object.entries(raw.cinematics ?? {})) {
			raw.cinematics[name] = CinematicState.migrateV3toV4(data);
		}
		raw.version = 4;
	}

	// v4→v5 migration
	if (raw.version === 4) {
		for (const [name, data] of Object.entries(raw.cinematics ?? {})) {
			raw.cinematics[name] = CinematicState.migrateV4toV5(data);
		}
		raw.version = CURRENT_VERSION;
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
 */
function getNamedCinematic(sceneId, cinematicName = "default") {
	const wrapper = getCinematicData(sceneId);
	return wrapper?.cinematics?.[cinematicName] ?? null;
}

/**
 * List all cinematic names on a scene.
 */
function listCinematicNames(sceneId) {
	const wrapper = getCinematicData(sceneId);
	return wrapper ? Object.keys(wrapper.cinematics) : [];
}

// ── Async Helpers ─────────────────────────────────────────────────────────

function waitForReady() {
	if (game.ready) return Promise.resolve();
	return new Promise((resolve) => Hooks.once("ready", resolve));
}

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

// ── Gate Processing ──────────────────────────────────────────────────────

/**
 * Process a segment gate — waits for the interaction event before proceeding.
 *
 * @param {object} gate  Gate config: { event, target?, animation?, timeout? }
 * @param {Map<string, object>} targets  Resolved target map
 * @param {AbortController} abortController  Controller for cancellation
 * @returns {Promise<void>}
 */
async function processGate(gate, targets, abortController) {
	if (!gate || !gate.event) return;

	const config = { ...gate };
	console.log(`[${MODULE_ID}] Cinematic: waiting for gate: ${gate.event}`);

	// Set up tile animator for tile-click gates
	let animator = null;
	if (gate.event === "tile-click" && gate.target && gate.animation) {
		const resolved = targets.get(gate.target);
		if (resolved?.kind === "placeable" && resolved.placeable) {
			animator = new TileAnimator(resolved.placeable, gate.animation);
			animator.start();
		}
	}

	try {
		// Handle timeout if specified
		if (gate.timeout && gate.timeout > 0) {
			const timeoutPromise = new Promise((resolve) => setTimeout(resolve, gate.timeout));
			const gatePromise = createAwaitPromise(config, { signal: abortController.signal, eventBus: null });
			await Promise.race([gatePromise, timeoutPromise]);
		} else {
			await createAwaitPromise(config, { signal: abortController.signal, eventBus: null });
		}
	} finally {
		if (animator) animator.detach();
	}
}

// ── Segment Graph Walker ─────────────────────────────────────────────────

/**
 * Walk the segment graph in order from the entry, following next edges.
 * Returns segment names in execution order.
 *
 * @param {object} data  Cinematic data with segments and entry
 * @returns {string[]}  Ordered segment names
 */
function getSegmentOrder(data) {
	if (!data.segments) return [];
	const order = [];
	const visited = new Set();
	let current = data.entry;
	while (current && typeof current === "string" && data.segments[current]) {
		if (visited.has(current)) break; // cycle protection
		visited.add(current);
		order.push(current);
		current = data.segments[current].next;
	}
	return order;
}

/**
 * Apply landing states for all segments in order (used when cinematic already seen).
 */
function applyAllSegmentLandingStates(data, targets) {
	const order = getSegmentOrder(data);
	for (const name of order) {
		const seg = data.segments[name];
		if (seg.setup) {
			try { applyState(seg.setup, targets); } catch (err) {
				console.warn(`[${MODULE_ID}] Cinematic: error applying setup for segment "${name}":`, err);
			}
		}
		if (seg.landing) {
			try { applyState(seg.landing, targets); } catch (err) {
				console.warn(`[${MODULE_ID}] Cinematic: error applying landing for segment "${name}":`, err);
			}
		}
	}
	canvas.perception.update({ refreshLighting: true, refreshVision: true });
}

// ── Playback ──────────────────────────────────────────────────────────────

/**
 * Play a cinematic on the current (or specified) scene.
 * Ignores tracking — always plays. Used by the public API for re-watch.
 *
 * v4: walks the segment graph, processing gates and running timelines per segment.
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
	if (activeWalkerAbort) {
		activeWalkerAbort.abort("replaced");
		activeWalkerAbort = null;
	}

	const data = getNamedCinematic(id, cinematicName);
	if (!data) {
		console.warn(`[${MODULE_ID}] Cinematic: no cinematic "${cinematicName}" on scene ${id}.`);
		return;
	}

	const Timeline = await waitForTweenAPI();
	if (!Timeline) return;
	if (canvas.scene?.id !== id) return;

	await waitForTagger();
	if (canvas.scene?.id !== id) return;

	const { targets, unresolved } = resolveAllTargets(data);
	console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": resolved ${targets.size} targets`);
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

	// Check for saved segment progress from a mid-refresh recovery
	const savedProgress = getSavedProgress(id, cinematicName);

	const abortController = new AbortController();
	activeWalkerAbort = abortController;

	const isSynchronized = data.synchronized === true && game.user.isGM;

	// Determine segment execution order
	const segmentOrder = getSegmentOrder(data);
	if (segmentOrder.length === 0) {
		console.warn(`[${MODULE_ID}] Cinematic "${cinematicName}": no segments to execute.`);
		return;
	}

	// Determine starting point based on saved progress
	let startIdx = 0;
	const completedSegments = new Set();
	if (savedProgress) {
		const savedCompleted = savedProgress.completedSegments ?? [];
		for (const s of savedCompleted) completedSegments.add(s);
		const savedCurrentIdx = segmentOrder.indexOf(savedProgress.currentSegment);
		if (savedCurrentIdx >= 0) {
			startIdx = savedCurrentIdx;
			console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": resuming from segment "${savedProgress.currentSegment}" (${savedCompleted.length} completed)`);
		}
	}

	// Apply landing states for already-completed segments (from saved progress)
	for (let i = 0; i < startIdx; i++) {
		const segName = segmentOrder[i];
		const seg = data.segments[segName];
		if (seg.setup) {
			try { applyState(seg.setup, targets); } catch (err) {
				console.warn(`[${MODULE_ID}] Cinematic: error applying setup for completed segment "${segName}":`, err);
			}
		}
		if (seg.landing) {
			try { applyState(seg.landing, targets); } catch (err) {
				console.warn(`[${MODULE_ID}] Cinematic: error applying landing for completed segment "${segName}":`, err);
			}
		}
	}

	let cancelled = false;
	let errored = false;

	emitPlaybackEvent({ type: "playback-start", sceneName: canvas.scene?.name ?? id });

	try {
		// Walk segments sequentially
		for (let i = startIdx; i < segmentOrder.length; i++) {
			if (abortController.signal.aborted) { cancelled = true; break; }
			if (canvas.scene?.id !== id) { cancelled = true; break; }

			const segmentName = segmentOrder[i];
			const segment = data.segments[segmentName];
			console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": entering segment "${segmentName}"`);

			emitPlaybackEvent({ type: "segment-start", segmentName });

			// Save progress
			saveSegmentProgress(id, cinematicName, segmentName, [...completedSegments]);

			// Process gate (wait for interaction)
			if (segment.gate) {
				emitPlaybackEvent({ type: "gate-wait", segmentName, gate: segment.gate });
				try {
					await processGate(segment.gate, targets, abortController);
				} catch (err) {
					if (abortController.signal.aborted) { cancelled = true; break; }
					throw err;
				}
				emitPlaybackEvent({ type: "gate-resolved", segmentName });
			}

			if (abortController.signal.aborted) { cancelled = true; break; }

			// Apply segment setup
			if (segment.setup) {
				try {
					applyState(segment.setup, targets);
					canvas.perception.update({ refreshLighting: true, refreshVision: true });
				} catch (err) {
					console.error(`[${MODULE_ID}] Cinematic "${cinematicName}": error applying setup for segment "${segmentName}":`, err);
				}
			}

			// Build and run segment timeline
			if (segment.timeline?.length) {
				const durationMs = computeTotalDuration(segment.timeline);
				emitPlaybackEvent({ type: "timeline-start", segmentName, durationMs });

				const { tl } = buildTimeline(
					{ setup: {}, timeline: segment.timeline },
					targets, Timeline,
					{
						timelineName: `cinematic-${id}-${cinematicName}-${segmentName}`,
						onStepComplete: (stepIndex) => {
							emitPlaybackEvent({ type: "step-complete", segmentName, stepIndex });
						},
					},
				);

				const handle = tl.run({
					broadcast: isSynchronized,
					commit: isSynchronized,
				});
				activeCinematicHandle = handle;

				// Wait for timeline to finish
				try {
					await new Promise((resolve, reject) => {
						tl.onComplete(() => resolve());
						tl.onCancel(() => reject(new Error("cancelled")));
						tl.onError((outcome) => reject(new Error(`timeline error: ${outcome}`)));
						// Also abort if the walker is cancelled
						const onAbort = () => reject(new Error("cancelled"));
						abortController.signal.addEventListener("abort", onAbort, { once: true });
					});
				} catch (err) {
					if (err.message === "cancelled" || abortController.signal.aborted) {
						cancelled = true;
						break;
					}
					throw err;
				}
				emitPlaybackEvent({ type: "timeline-end", segmentName });
			}

			if (abortController.signal.aborted) { cancelled = true; break; }

			// Apply segment landing
			if (segment.landing) {
				try {
					applyState(segment.landing, targets);
					canvas.perception.update({ refreshLighting: true, refreshVision: true });
				} catch (err) {
					console.error(`[${MODULE_ID}] Cinematic "${cinematicName}": error applying landing for segment "${segmentName}":`, err);
				}
			}

			emitPlaybackEvent({ type: "segment-complete", segmentName });
			completedSegments.add(segmentName);

			// Check for cross-scene transition on next edge
			const nextEdge = segment.next;
			if (nextEdge && typeof nextEdge === "object" && nextEdge.scene) {
				// Cross-scene transition
				const targetScene = nextEdge.scene;
				const targetSegment = nextEdge.segment ?? data.entry;
				console.log(`[${MODULE_ID}] Cinematic "${cinematicName}": cross-scene transition to scene ${targetScene}, segment "${targetSegment}"`);
				// Clean up current cinematic
				activeCinematicHandle = null;
				activeWalkerAbort = null;
				clearProgress(id, cinematicName);
				stopAllCinematicSounds();
				if (data.tracking !== false) {
					await game.user.setFlag(MODULE_ID, seenFlagKey(id, cinematicName), true);
				}
				// Set pending and navigate
				pendingCinematic = { sceneId: targetScene, cinematicName, visitedChain: _visitedChain };
				const scene = game.scenes.get(targetScene);
				if (scene) {
					scene.view();
				} else {
					console.warn(`[${MODULE_ID}] Cinematic: cross-scene transition target scene "${targetScene}" not found.`);
					pendingCinematic = null;
				}
				return;
			}
		}
	} catch (err) {
		errored = true;
		console.error(`[${MODULE_ID}] Cinematic "${cinematicName}" error on scene ${id}:`, err);
	}

	// Cleanup
	activeCinematicHandle = null;
	activeWalkerAbort = null;
	clearProgress(id, cinematicName);
	stopAllCinematicSounds();
	preCinematicSnapshot = null;
	preCinematicTargets = null;
	emitPlaybackEvent({ type: "playback-end", cancelled: !!cancelled });

	if (cancelled) {
		console.log(`[${MODULE_ID}] Cinematic "${cinematicName}" cancelled on scene ${id}.`);
		// Apply all landing states on cancel so scene ends in final state
		applyAllSegmentLandingStates(data, targets);
		return;
	}

	if (errored) {
		// Apply landing on error too
		applyAllSegmentLandingStates(data, targets);
		return;
	}

	// Cinematic completed successfully
	if (data.tracking !== false) {
		await game.user.setFlag(MODULE_ID, seenFlagKey(id, cinematicName), true);
	}
	console.log(`[${MODULE_ID}] Cinematic "${cinematicName}" complete on scene ${id}.`);
}

/**
 * Clear the "seen" flag for the current user on a scene cinematic.
 */
async function resetCinematic(sceneId, cinematicName = "default") {
	const id = sceneId ?? canvas.scene?.id;
	if (!id) return;
	await game.user.unsetFlag(MODULE_ID, seenFlagKey(id, cinematicName));
	console.log(`[${MODULE_ID}] Cinematic: cleared seen flag for "${cinematicName}" on scene ${id}.`);
}

/**
 * Clear the "seen" flag for a specific user on a scene cinematic. GM only.
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

function hasCinematic(sceneId, cinematicName) {
	const id = sceneId ?? canvas.scene?.id;
	if (cinematicName) {
		return getNamedCinematic(id, cinematicName) != null;
	}
	return getCinematicData(id) != null;
}

/**
 * Revert the scene to its pre-cinematic state using the captured snapshot.
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
	if (activeWalkerAbort) {
		activeWalkerAbort.abort("reverted");
		activeWalkerAbort = null;
	}

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

async function onCanvasReady() {
	const gen = ++canvasReadyGeneration;
	console.log(`[${MODULE_ID}] Cinematic: canvasReady fired, gen=${gen}, game.ready=${game.ready}`);

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
	pendingCinematic = null;

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
			console.log(`[${MODULE_ID}] Cinematic "${name}": found saved progress at segment "${savedProgress.currentSegment}", resuming...`);
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

		if (activeCinematicHandle?.status === "running") {
			activeCinematicHandle.cancel("already-seen");
		}
		activeCinematicHandle = null;

		await waitForTagger();
		if (gen !== canvasReadyGeneration) return;

		for (const { name, data } of canvasReadyCinematics) {
			try {
				const { targets } = resolveAllTargets(data);
				applyAllSegmentLandingStates(data, targets);
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${name}": error applying landing states (already seen) on scene ${scene.id}:`, err);
			}
		}
		canvas.perception.update({ refreshLighting: true, refreshVision: true });
		return;
	}

	if (gen !== canvasReadyGeneration) return;

	console.log(`[${MODULE_ID}] Cinematic: playing first unseen cinematic "${firstUnseen.name}"...`);

	// Apply landing states for all seen cinematics first
	await waitForTagger();
	if (gen !== canvasReadyGeneration) return;

	for (const { name, data } of canvasReadyCinematics) {
		if (name === firstUnseen.name) continue;
		const seen = data.tracking !== false && hasSeenCinematic(scene.id, name);
		if (seen) {
			try {
				const { targets } = resolveAllTargets(data);
				applyAllSegmentLandingStates(data, targets);
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic "${name}": error applying landing states (already seen) on scene ${scene.id}:`, err);
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
			onPlaybackProgress,
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

		console.log(`[${MODULE_ID}] Cinematic API registered (v5).`);
	});
}
