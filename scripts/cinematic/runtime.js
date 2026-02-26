import { MODULE_ID } from "../time-triggers/core/constants.js";
import { getTweenType } from "../tween/core/registry.js";

// ── Target Resolution ────────────────────────────────────────────────────

/**
 * Normalize a Tagger/UUID result into a { placeable, doc } pair.
 * Tagger v13 returns TileDocument objects; older versions return Tile placeables.
 * We need both: the document for updateSource/uuid, the placeable for refresh.
 *
 * @param {object} result  A placeable or document object
 * @returns {{ placeable: object, doc: object } | null}
 */
function normalizePlaceable(result) {
	if (!result) return null;

	// If it's a document (has updateSource but no refresh), get its placeable
	if (result.documentName || result._source !== undefined) {
		const placeable = result.object;
		if (!placeable) return null;
		return { placeable, doc: result };
	}

	// It's a placeable (has document property)
	if (result.document) {
		return { placeable: result, doc: result.document };
	}

	return null;
}

/**
 * Resolve a target selector string to a normalized target.
 *
 * Supported selectors:
 *   - "tag:<name>"      → First tile matching Tagger tag on current scene
 *   - "$particles"      → canvas.particleeffects (FXMaster)
 *   - "Scene.x.Tile.y"  → Direct UUID lookup via fromUuid
 *
 * @param {string} selector
 * @returns {{ kind: "placeable", placeable: object, doc: object } | { kind: "particles", target: object } | null}
 */
function resolveTarget(selector) {
	if (selector === "$particles") {
		if (!game.modules.get("fxmaster")?.active) {
			console.warn(`[${MODULE_ID}] Cinematic: FXMaster module is not active — cannot resolve "$particles" target. Install and enable the FXMaster module to use particle effects.`);
			return null;
		}
		const target = canvas.particleeffects;
		return target ? { kind: "particles", target } : null;
	}

	if (selector.startsWith("tag-all:")) {
		const tagName = selector.slice(8);
		const TaggerAPI = window.Tagger ?? game.modules.get("tagger")?.api;
		if (!TaggerAPI) {
			console.warn(`[${MODULE_ID}] Cinematic: Tagger module not available, cannot resolve "${selector}".`);
			return null;
		}
		const matches = TaggerAPI.getByTag(tagName, { sceneId: canvas.scene.id });
		if (!matches?.length) return null;
		const placeables = [];
		for (const result of matches) {
			const normalized = normalizePlaceable(result);
			if (normalized) placeables.push(normalized);
		}
		if (placeables.length === 0) return null;
		return { kind: "multi-placeable", placeables };
	}

	if (selector.startsWith("tag:")) {
		const tagName = selector.slice(4);
		const TaggerAPI = window.Tagger ?? game.modules.get("tagger")?.api;
		if (!TaggerAPI) {
			console.warn(`[${MODULE_ID}] Cinematic: Tagger module not available, cannot resolve "${selector}".`);
			return null;
		}
		const matches = TaggerAPI.getByTag(tagName, { sceneId: canvas.scene.id });
		const result = matches?.[0] ?? null;
		if (!result) return null;
		const normalized = normalizePlaceable(result);
		return normalized ? { kind: "placeable", ...normalized } : null;
	}

	// Direct UUID — synchronous lookup via canvas collections
	const doc = fromUuidSync(selector);
	if (!doc) return null;
	const normalized = normalizePlaceable(doc);
	return normalized ? { kind: "placeable", ...normalized } : null;
}

/**
 * Resolve all unique target selectors found in the cinematic data.
 * Returns a Map of selector → resolved target plus a list of unresolved selectors.
 *
 * @param {object} cinematicData  The full cinematic flag data
 * @returns {{ targets: Map<string, object>, unresolved: string[] }}
 */
export function resolveAllTargets(cinematicData) {
	const selectors = new Set();

	// Collect from setup
	if (cinematicData.setup) {
		for (const sel of Object.keys(cinematicData.setup)) selectors.add(sel);
	}

	// Collect from landing
	if (cinematicData.landing) {
		for (const sel of Object.keys(cinematicData.landing)) selectors.add(sel);
	}

	// Collect from timeline
	if (cinematicData.timeline) {
		collectSelectorsFromEntries(cinematicData.timeline, selectors);
	}

	const targets = new Map();
	const unresolved = [];
	for (const sel of selectors) {
		const target = resolveTarget(sel);
		if (target) {
			targets.set(sel, target);
		} else {
			unresolved.push(sel);
		}
	}

	if (unresolved.length) {
		console.warn(`[${MODULE_ID}] Cinematic: ${unresolved.length} unresolved target(s): ${unresolved.join(", ")}`);
	}

	return { targets, unresolved };
}

// ── Snapshot & Revert ────────────────────────────────────────────────────

/**
 * Capture a snapshot of current values for all properties that a state map would overwrite.
 * Returns a same-shape map with current values instead of target values.
 *
 * @param {object} stateMap  selector → property overrides
 * @param {Map<string, object>} targets  resolved target map
 * @returns {object}  selector → current property values
 */
export function captureSnapshot(stateMap, targets) {
	if (!stateMap) return {};
	const snapshot = {};

	for (const [selector, overrides] of Object.entries(stateMap)) {
		const resolved = targets.get(selector);
		if (!resolved) continue;

		if (resolved.kind === "particles") {
			if (resolved.target.destroyed) continue;
			const props = {};
			for (const prop of Object.keys(overrides)) {
				props[prop] = resolved.target[prop];
			}
			snapshot[selector] = props;
		} else if (resolved.kind === "multi-placeable") {
			// For multi-placeable, snapshot the first placeable's values
			// (they're typically identical for state purposes)
			const first = resolved.placeables[0];
			if (!first?.doc) continue;
			const props = {};
			for (const prop of Object.keys(overrides)) {
				props[prop] = foundry.utils.getProperty(first.doc._source, prop);
			}
			snapshot[selector] = props;
		} else {
			if (!resolved.doc) continue;
			const props = {};
			for (const prop of Object.keys(overrides)) {
				props[prop] = foundry.utils.getProperty(resolved.doc._source, prop);
			}
			snapshot[selector] = props;
		}
	}

	return snapshot;
}

/**
 * Gather all state maps from cinematic data (setup + landing + all before/after from timeline).
 * Merges them into a single map keyed by selector.
 *
 * @param {object} cinematicData
 * @returns {object}  selector → merged property overrides
 */
export function gatherAllStateMaps(cinematicData) {
	const merged = {};

	function mergeMap(map) {
		if (!map) return;
		for (const [selector, overrides] of Object.entries(map)) {
			if (!merged[selector]) merged[selector] = {};
			Object.assign(merged[selector], overrides);
		}
	}

	mergeMap(cinematicData.setup);
	mergeMap(cinematicData.landing);

	if (cinematicData.timeline) {
		gatherFromEntries(cinematicData.timeline, merged, mergeMap);
	}

	return merged;
}

/**
 * Recursively gather state maps from timeline entries, including parallel branches
 * and tween-animated properties.
 *
 * @param {Array} entries  Timeline entries
 * @param {object} merged  Accumulator: selector → property overrides
 * @param {(map: object) => void} mergeMap  Helper to merge a state map into `merged`
 */
function gatherFromEntries(entries, merged, mergeMap) {
	for (const entry of entries) {
		if (entry.delay != null || entry.await != null || entry.emit != null) continue;

		if (entry.parallel?.branches) {
			for (const branch of entry.parallel.branches) {
				gatherFromEntries(branch, merged, mergeMap);
			}
			continue;
		}

		mergeMap(entry.before);
		mergeMap(entry.after);

		// Include tween-animated properties in snapshot scope
		if (entry.tweens) {
			for (const tw of entry.tweens) {
				if (tw.target && tw.attribute) {
					if (!merged[tw.target]) merged[tw.target] = {};
					merged[tw.target][tw.attribute] = "__snapshot__";
				}
			}
		}
	}
}

/**
 * Recursively collect target selectors from a timeline entry array.
 * Handles steps, delays, awaits, emits, and parallel branches.
 *
 * @param {Array} entries  Timeline entries
 * @param {Set<string>} selectors  Accumulator set
 */
function collectSelectorsFromEntries(entries, selectors) {
	for (const entry of entries) {
		if (entry.delay != null) continue;
		if (entry.await != null) continue;
		if (entry.emit != null) continue;

		// Parallel — recurse into branches
		if (entry.parallel) {
			const par = entry.parallel;
			if (par.branches) {
				for (const branch of par.branches) {
					collectSelectorsFromEntries(branch, selectors);
				}
			}
			continue;
		}

		// Step entry — has before/after states and tweens
		if (entry.before) {
			for (const sel of Object.keys(entry.before)) selectors.add(sel);
		}
		if (entry.after) {
			for (const sel of Object.keys(entry.after)) selectors.add(sel);
		}
		if (entry.tweens) {
			for (const tween of entry.tweens) {
				if (tween.target) selectors.add(tween.target);
			}
		}
	}
}

// ── Property Allowlists ──────────────────────────────────────────────────

/** Allowed properties per Foundry document type for applyState(). */
const ALLOWED_STATE_PROPS = {
	Tile: new Set([
		"alpha", "hidden", "rotation", "elevation", "x", "y",
		"width", "height", "sort", "z", "texture.src", "texture.scaleX",
		"texture.scaleY", "occlusion.alpha", "occlusion.mode", "tint",
	]),
	AmbientLight: new Set([
		"hidden", "config.color", "config.alpha",
		"config.dim", "config.bright", "config.luminosity",
		"config.angle", "config.rotation",
	]),
	Token: new Set([
		"alpha", "hidden", "rotation", "elevation", "x", "y",
		"width", "height", "texture.src", "texture.scaleX",
		"texture.scaleY", "tint",
	]),
	Drawing: new Set([
		"hidden", "x", "y", "rotation",
		"shape.width", "shape.height", "fillAlpha", "strokeAlpha",
	]),
	AmbientSound: new Set([
		"hidden", "x", "y", "radius", "volume",
	]),
};

/** Allowed properties for $particles (PIXI container). */
const ALLOWED_PARTICLES_PROPS = new Set([
	"alpha", "visible", "x", "y", "scale", "rotation",
]);

/**
 * Filter overrides against an allowlist, warning on blocked properties.
 * @param {object} overrides  key → value map
 * @param {Set<string>} allowed  allowed property names
 * @param {string} label  label for warning messages
 * @returns {object} filtered overrides
 */
function filterOverrides(overrides, allowed, label) {
	const filtered = {};
	for (const [prop, value] of Object.entries(overrides)) {
		if (allowed.has(prop)) {
			filtered[prop] = value;
		} else {
			console.warn(`[${MODULE_ID}] Cinematic: blocked property "${prop}" on ${label}.`);
		}
	}
	return filtered;
}

// ── State Application ────────────────────────────────────────────────────

/**
 * Apply a state map to resolved targets. Used for setup, landing, and
 * step before/after states.
 *
 * For tiles: calls doc.updateSource(overrides) + placeable.refresh()
 * For $particles: sets properties directly on the container object.
 *
 * @param {object} stateMap  selector → property overrides
 * @param {Map<string, object>} targets  resolved target map
 */
export function applyState(stateMap, targets) {
	if (!stateMap) return;

	const toRefresh = [];

	for (const [selector, overrides] of Object.entries(stateMap)) {
		const resolved = targets.get(selector);
		if (!resolved) continue;

		if (resolved.kind === "particles") {
			// Stale target guard — particles container may have been destroyed
			if (resolved.target.destroyed) continue;
			const filtered = filterOverrides(overrides, ALLOWED_PARTICLES_PROPS, `$particles`);
			for (const [prop, value] of Object.entries(filtered)) {
				resolved.target[prop] = value;
			}
		} else if (resolved.kind === "multi-placeable") {
			// Apply overrides to all matched placeables
			for (const { placeable, doc } of resolved.placeables) {
				if (!doc?.parent || !placeable?.scene) continue;
				const docType = doc.documentName;
				const allowed = ALLOWED_STATE_PROPS[docType];
				if (!allowed) {
					console.warn(`[${MODULE_ID}] Cinematic: no allowlist for document type "${docType}" on "${selector}", skipping.`);
					continue;
				}
				const filtered = filterOverrides(overrides, allowed, `${docType} "${selector}"`);
				doc.updateSource(filtered);
				toRefresh.push(placeable);
			}
		} else {
			// Stale target guard — placeable may have been removed from scene
			if (!resolved.doc?.parent || !resolved.placeable?.scene) continue;

			const docType = resolved.doc.documentName;
			const allowed = ALLOWED_STATE_PROPS[docType];
			if (!allowed) {
				console.warn(`[${MODULE_ID}] Cinematic: no allowlist for document type "${docType}" on "${selector}", skipping.`);
				continue;
			}
			const filtered = filterOverrides(overrides, allowed, `${docType} "${selector}"`);
			resolved.doc.updateSource(filtered);
			toRefresh.push(resolved.placeable);
		}
	}

	// Batch refresh all placeables after all updateSource calls
	for (const placeable of toRefresh) {
		placeable.refresh();
	}
}

/**
 * If any resolved target in a state map is an AmbientLight, trigger a
 * canvas perception refresh. Called after step before/after callbacks to
 * ensure lighting changes are visually applied.
 *
 * @param {object} stateMap  selector → property overrides
 * @param {Map<string, object>} targets  resolved target map
 */
function refreshPerceptionIfNeeded(stateMap, targets) {
	if (!stateMap) return;
	for (const selector of Object.keys(stateMap)) {
		const resolved = targets.get(selector);
		if (resolved?.kind === "placeable" && resolved.doc?.documentName === "AmbientLight") {
			canvas.perception.update({ refreshLighting: true, refreshVision: true });
			return; // one call is enough
		}
		if (resolved?.kind === "multi-placeable") {
			for (const { doc } of resolved.placeables) {
				if (doc?.documentName === "AmbientLight") {
					canvas.perception.update({ refreshLighting: true, refreshVision: true });
					return;
				}
			}
		}
	}
}

// ── Field Routing ────────────────────────────────────────────────────────

/**
 * Known params fields per tween type. Everything else goes to opts.
 * @type {Record<string, Set<string>>}
 */
const PARAMS_FIELDS = {
	"tile-prop": new Set(["uuid", "attribute", "value"]),
	"light-color": new Set(["uuid", "toColor", "toAlpha", "mode"]),
	"light-state": new Set(["uuid", "enabled"]),
	"particles-prop": new Set(["attribute", "value"]),
	"camera-pan": new Set(["x", "y", "scale"]),
	"token-prop": new Set(["uuid", "attribute", "value"]),
	"drawing-prop": new Set(["uuid", "attribute", "value"]),
	"sound-prop": new Set(["uuid", "attribute", "value"]),
};

/**
 * Fields that are always routed to opts regardless of tween type.
 */
const OPTS_FIELDS = new Set(["duration", "easing", "detach"]);

/**
 * Fields consumed by the cinematic compiler itself (not passed through).
 */
const META_FIELDS = new Set(["type", "target"]);

/**
 * Compile a single cinematic tween entry into Timeline .add() arguments.
 *
 * @param {object} tweenEntry  Flat cinematic tween (type, target, attribute, value, duration, ...)
 * @param {Map<string, object>} targets  Resolved target map
 * @returns {{ type: string, params: object, opts: object, detach: boolean } | null}
 */
export function compileTween(tweenEntry, targets) {
	const { type, target: selector, detach: shouldDetach = false, ...rest } = tweenEntry;

	if (!type) {
		console.warn(`[${MODULE_ID}] Cinematic: tween entry missing 'type', skipping.`);
		return null;
	}

	const params = {};
	const opts = {};
	const knownParams = PARAMS_FIELDS[type];

	// Resolve target → uuid for document-backed types
	if (selector === "$particles") {
		params.target = "$particles";
	} else if (selector) {
		const resolved = targets.get(selector);
		if (!resolved) return null; // unresolvable — already warned during resolution
		if (resolved.kind === "multi-placeable") {
			params.uuid = resolved.placeables.map((p) => p.doc.uuid);
		} else {
			params.uuid = resolved.doc.uuid;
		}
	}

	// Route remaining fields
	for (const [key, value] of Object.entries(rest)) {
		if (META_FIELDS.has(key)) continue;

		if (key === "duration") {
			// Map flat "duration" → Timeline's "durationMS"
			opts.durationMS = value;
		} else if (OPTS_FIELDS.has(key)) {
			opts[key] = value;
		} else if (knownParams?.has(key)) {
			params[key] = value;
		} else {
			// Unknown field — route to params as a best guess
			params[key] = value;
		}
	}

	return { type, params, opts, detach: shouldDetach };
}

// ── Timeline Compilation ─────────────────────────────────────────────────

/**
 * Build a TweenTimeline from cinematic flag data.
 *
 * @param {object} cinematicData  The cinematic flag data (setup, landing, timeline)
 * @param {Map<string, object>} targets  Resolved target map
 * @param {typeof import("../tween/core/timeline/TweenTimeline.js").TweenTimeline} Timeline  The Timeline class
 * @param {object} [opts]
 * @param {number} [opts.skipToStep]  Resume from this step index (apply prior states instantly)
 * @param {(stepIndex: number) => void} [opts.onStepComplete]  Callback after each step completes
 * @returns {import("../tween/core/timeline/TweenTimeline.js").TweenTimeline}
 */
export function buildTimeline(cinematicData, targets, Timeline, opts = {}) {
	const tl = new Timeline().name(`cinematic-${canvas.scene.id}`);
	const { skipToStep, onStepComplete } = opts;

	// Setup state applied as beforeAll
	tl.beforeAll(() => {
		try {
			applyState(cinematicData.setup, targets);
			canvas.perception.update({ refreshLighting: true, refreshVision: true });
		} catch (err) {
			console.error(`[${MODULE_ID}] Cinematic: error in beforeAll (setup state) on scene ${canvas.scene?.id}:`, err);
			throw err;
		}
	});

	compileCinematicEntries(cinematicData.timeline, tl, targets, { skipToStep, onStepComplete });

	return tl;
}

/**
 * Apply all nested before/after states from parallel branches during fast-forward.
 * Recurses into nested parallels.
 *
 * @param {Array} branches  Array of branch entry arrays
 * @param {Map<string, object>} targets  Resolved target map
 */
function applyParallelStatesForSkip(branches, targets) {
	if (!branches) return;
	for (const branch of branches) {
		for (const entry of branch) {
			if (entry.before) {
				try { applyState(entry.before, targets); refreshPerceptionIfNeeded(entry.before, targets); }
				catch (err) { console.warn(`[${MODULE_ID}] Cinematic: error in skipped parallel before:`, err); }
			}
			if (entry.after) {
				try { applyState(entry.after, targets); refreshPerceptionIfNeeded(entry.after, targets); }
				catch (err) { console.warn(`[${MODULE_ID}] Cinematic: error in skipped parallel after:`, err); }
			}
			if (entry.parallel?.branches) {
				applyParallelStatesForSkip(entry.parallel.branches, targets);
			}
		}
	}
}

/**
 * Compile cinematic timeline entries into a TweenTimeline.
 * Handles steps, delays, awaits, emits, and parallel branches recursively.
 *
 * @param {Array} entries  Cinematic timeline entries
 * @param {import("../tween/core/timeline/TweenTimeline.js").TweenTimeline} tl  Target timeline
 * @param {Map<string, object>} targets  Resolved target map
 * @param {object} [opts]
 * @param {number} [opts.skipToStep]  Skip entries before this step index (apply states instantly)
 * @param {(stepIndex: number) => void} [opts.onStepComplete]  Callback after each step
 */
function compileCinematicEntries(entries, tl, targets, opts = {}) {
	const { skipToStep, onStepComplete } = opts;
	let stepIndex = -1;

	for (const entry of entries) {
		// Delay entry
		if (entry.delay != null) {
			// Skip delays when fast-forwarding
			if (skipToStep != null && stepIndex < skipToStep) continue;
			tl.delay(entry.delay);
			continue;
		}

		// Await entry
		if (entry.await != null) {
			// Skip awaits when fast-forwarding
			if (skipToStep != null && stepIndex < skipToStep) continue;
			tl.await(entry.await);
			continue;
		}

		// Emit entry
		if (entry.emit != null) {
			// Skip emits when fast-forwarding
			if (skipToStep != null && stepIndex < skipToStep) continue;
			tl.emit(entry.emit);
			continue;
		}

		// Parallel entry
		if (entry.parallel) {
			if (skipToStep != null && stepIndex < skipToStep) {
				// Apply all nested before/after states from all branches
				applyParallelStatesForSkip(entry.parallel.branches, targets);
				continue;
			}
			const par = entry.parallel;
			const branchFns = par.branches.map((branchEntries) => {
				return (sub) => compileCinematicEntries(branchEntries, sub, targets);
			});
			tl.parallel(branchFns, {
				join: par.join ?? "all",
				overflow: par.overflow ?? "detach",
			});
			continue;
		}

		// Step entry — must have tweens array
		if (!entry.tweens || !Array.isArray(entry.tweens)) {
			console.warn(`[${MODULE_ID}] Cinematic: timeline entry has no tweens array, skipping.`);
			continue;
		}

		stepIndex++;

		// For skipped steps, apply before/after states instantly instead of animating
		if (skipToStep != null && stepIndex < skipToStep) {
			if (entry.before) {
				try {
					applyState(entry.before, targets);
					refreshPerceptionIfNeeded(entry.before, targets);
				} catch (err) {
					console.warn(`[${MODULE_ID}] Cinematic: error applying skipped step.before:`, err);
				}
			}
			if (entry.after) {
				try {
					applyState(entry.after, targets);
					refreshPerceptionIfNeeded(entry.after, targets);
				} catch (err) {
					console.warn(`[${MODULE_ID}] Cinematic: error applying skipped step.after:`, err);
				}
			}
			continue;
		}

		const currentStepIndex = stepIndex;
		const step = tl.step();

		// Step-level before callback
		if (entry.before) {
			step.before(() => {
				try {
					applyState(entry.before, targets);
					refreshPerceptionIfNeeded(entry.before, targets);
				} catch (err) {
					console.error(`[${MODULE_ID}] Cinematic: error in step.before callback on scene ${canvas.scene?.id}:`, err);
					throw err;
				}
			});
		}

		// Compile and add each tween
		for (const tweenEntry of entry.tweens) {
			const compiled = compileTween(tweenEntry, targets);
			if (!compiled) continue;

			step.add(compiled.type, compiled.params, compiled.opts);

			if (compiled.detach) {
				step.detach();
			}
		}

		// Step-level after callback (includes progress tracking)
		step.after(() => {
			try {
				if (entry.after) {
					applyState(entry.after, targets);
					refreshPerceptionIfNeeded(entry.after, targets);
				}
				onStepComplete?.(currentStepIndex);
			} catch (err) {
				console.error(`[${MODULE_ID}] Cinematic: error in step.after callback on scene ${canvas.scene?.id}:`, err);
				throw err;
			}
		});
	}
}

// ── Deep Validation ──────────────────────────────────────────────────────

/**
 * Validate a state map's structure: must be { selector: { prop: value } }.
 *
 * @param {*} map  The state map to validate
 * @param {string} path  Path for diagnostic messages
 * @param {Array} diagnostics  Accumulator
 */
function validateStateMap(map, path, diagnostics) {
	if (map == null) return;
	if (typeof map !== "object" || Array.isArray(map)) {
		diagnostics.push({ path, level: "error", message: `Expected object, got ${Array.isArray(map) ? "array" : typeof map}` });
		return;
	}
	for (const [selector, overrides] of Object.entries(map)) {
		if (typeof overrides !== "object" || overrides === null || Array.isArray(overrides)) {
			diagnostics.push({ path: `${path}["${selector}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(overrides) ? "array" : typeof overrides}` });
		}
	}
}

/**
 * Recursively validate timeline entries for tween correctness, state map
 * structure, and target resolution.
 *
 * @param {Array} entries  Timeline entries
 * @param {string} pathPrefix  Path prefix for diagnostics
 * @param {Map<string, object>|null} targets  Resolved targets (null to skip target checks)
 * @param {Array} diagnostics  Accumulator
 */
function validateEntries(entries, pathPrefix, targets, diagnostics) {
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		const path = `${pathPrefix}[${i}]`;

		if (entry.delay != null || entry.await != null || entry.emit != null) continue;

		if (entry.parallel?.branches) {
			for (let bi = 0; bi < entry.parallel.branches.length; bi++) {
				validateEntries(entry.parallel.branches[bi], `${path}.parallel.branches[${bi}]`, targets, diagnostics);
			}
			continue;
		}

		validateStateMap(entry.before, `${path}.before`, diagnostics);
		validateStateMap(entry.after, `${path}.after`, diagnostics);

		if (entry.tweens) {
			for (let ti = 0; ti < entry.tweens.length; ti++) {
				const tw = entry.tweens[ti];
				const twPath = `${path}.tweens[${ti}]`;

				if (!tw.type) {
					diagnostics.push({ path: twPath, level: "error", message: "Missing 'type' field" });
					continue;
				}

				// Check if tween type is registered
				const tweenDef = getTweenType(tw.type);
				if (!tweenDef) {
					diagnostics.push({ path: twPath, level: "error", message: `Unknown tween type: "${tw.type}"` });
					continue;
				}

				// Validate via registry
				if (targets) {
					try {
						const compiled = compileTween(tw, targets);
						if (compiled) {
							tweenDef.validate(compiled.params);
						} else if (tw.target) {
							diagnostics.push({ path: twPath, level: "warn", message: `Target "${tw.target}" could not be resolved for compilation` });
						}
					} catch (err) {
						diagnostics.push({ path: twPath, level: "error", message: err.message });
					}
				}

				// Check target resolution
				if (targets && tw.target && !targets.has(tw.target)) {
					diagnostics.push({ path: `${twPath}.target`, level: "warn", message: `Target "${tw.target}" is not resolved` });
				}
			}
		}
	}
}

/**
 * Deep-validate cinematic data without throwing. Returns an array of diagnostics.
 * Checks tween types against the registry, validates state map structure,
 * and optionally checks target resolution.
 *
 * @param {object} data  The cinematic flag data
 * @param {Map<string, object>} [targets]  Resolved targets map (optional — skips target checks if not provided)
 * @returns {Array<{ path: string, level: "error"|"warn", message: string }>}
 */
export function validateCinematicDeep(data, targets = null) {
	const diagnostics = [];

	if (!data || typeof data !== "object") {
		diagnostics.push({ path: "", level: "error", message: "Cinematic data is not an object" });
		return diagnostics;
	}

	validateStateMap(data.setup, "setup", diagnostics);
	validateStateMap(data.landing, "landing", diagnostics);

	if (data.timeline && Array.isArray(data.timeline)) {
		validateEntries(data.timeline, "timeline", targets, diagnostics);
	}

	return diagnostics;
}
