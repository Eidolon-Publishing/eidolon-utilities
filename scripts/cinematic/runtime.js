import { MODULE_ID } from "../time-triggers/core/constants.js";

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
		const target = canvas.particleeffects;
		return target ? { kind: "particles", target } : null;
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
 * Returns a Map of selector → resolved target.
 *
 * @param {object} cinematicData  The full cinematic flag data
 * @returns {Map<string, object>}  selector → resolved target (null entries excluded)
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
		for (const entry of cinematicData.timeline) {
			if (entry.delay != null) continue;

			// Step-level before/after
			if (entry.before) {
				for (const sel of Object.keys(entry.before)) selectors.add(sel);
			}
			if (entry.after) {
				for (const sel of Object.keys(entry.after)) selectors.add(sel);
			}

			// Tweens
			if (entry.tweens) {
				for (const tween of entry.tweens) {
					if (tween.target) selectors.add(tween.target);
				}
			}
		}
	}

	const resolved = new Map();
	for (const sel of selectors) {
		const target = resolveTarget(sel);
		if (target) {
			resolved.set(sel, target);
		} else {
			console.warn(`[${MODULE_ID}] Cinematic: could not resolve target "${sel}", skipping.`);
		}
	}

	return resolved;
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

	for (const [selector, overrides] of Object.entries(stateMap)) {
		const resolved = targets.get(selector);
		if (!resolved) continue;

		if (resolved.kind === "particles") {
			// Direct property assignment on the PIXI container
			for (const [prop, value] of Object.entries(overrides)) {
				resolved.target[prop] = value;
			}
		} else {
			// Document-backed placeable (tile, light, etc.)
			resolved.doc.updateSource(overrides);
			resolved.placeable.refresh();
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
	if (selector && selector !== "$particles") {
		const resolved = targets.get(selector);
		if (!resolved) return null; // unresolvable — already warned during resolution
		params.uuid = resolved.doc.uuid;
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
 * @returns {import("../tween/core/timeline/TweenTimeline.js").TweenTimeline}
 */
export function buildTimeline(cinematicData, targets, Timeline) {
	const tl = new Timeline().name(`cinematic-${canvas.scene.id}`);

	// Setup state applied as beforeAll
	tl.beforeAll(() => {
		applyState(cinematicData.setup, targets);
		canvas.perception.update({ refreshLighting: true, refreshVision: true });
	});

	for (const entry of cinematicData.timeline) {
		// Delay entry
		if (entry.delay != null) {
			tl.delay(entry.delay);
			continue;
		}

		// Step entry — must have tweens array
		if (!entry.tweens || !Array.isArray(entry.tweens)) {
			console.warn(`[${MODULE_ID}] Cinematic: timeline entry has no tweens array, skipping.`);
			continue;
		}

		const step = tl.step();

		// Step-level before callback
		if (entry.before) {
			step.before(() => applyState(entry.before, targets));
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

		// Step-level after callback
		if (entry.after) {
			step.after(() => applyState(entry.after, targets));
		}
	}

	return tl;
}
