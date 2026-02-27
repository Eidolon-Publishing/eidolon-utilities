import { MODULE_ID } from "../../time-triggers/core/constants.js";

const CURRENT_VERSION = 5;

/** Interaction gate event types that trigger segment splits during migration. */
const INTERACTION_GATES = new Set(["click", "tile-click", "keypress"]);

/**
 * Immutable state wrapper for cinematic flag data.
 * Every mutation returns a new CinematicState, making undo trivial later.
 *
 * v4 flag shape:
 * {
 *   version: 4,
 *   cinematics: {
 *     "intro": {
 *       trigger, tracking, synchronized,
 *       entry: "main",
 *       segments: {
 *         "main": { gate?, setup?, landing?, timeline, next? }
 *       }
 *     }
 *   }
 * }
 */
export class CinematicState {
	#data;
	#activeCinematicName;
	#activeSegmentName;
	#loadedHash;

	constructor(data = null, { loadedHash = null, cinematicName = "default", segmentName = null } = {}) {
		this.#data = data ?? CinematicState.empty();
		this.#activeCinematicName = cinematicName;
		this.#loadedHash = loadedHash;
		// Default to entry segment if none specified
		const cinematic = this.#data.cinematics?.[this.#activeCinematicName];
		this.#activeSegmentName = segmentName ?? cinematic?.entry ?? "main";
	}

	static empty() {
		return {
			version: CURRENT_VERSION,
			cinematics: {
				"default": CinematicState.emptyCinematic(),
			},
		};
	}

	static emptyCinematic() {
		return {
			trigger: "canvasReady",
			tracking: true,
			entry: "main",
			segments: {
				"main": CinematicState.emptySegment(),
			},
		};
	}

	static emptySegment() {
		return { timeline: [] };
	}

	/**
	 * Migrate a v3 single cinematic object to v4 segment structure.
	 * Splits flat timeline at interaction gate boundaries.
	 *
	 * @param {object} v3Data  A single cinematic: { trigger, tracking, synchronized?, setup?, landing?, timeline }
	 * @returns {object}  v4 cinematic: { trigger, tracking, synchronized?, entry, segments }
	 */
	static migrateV3toV4(v3Data) {
		const { trigger, tracking, synchronized, setup, landing, timeline = [] } = v3Data;

		// Check if timeline has any interaction gates (non-signal awaits at the top level)
		const hasGates = timeline.some((entry) =>
			entry.await != null && INTERACTION_GATES.has(entry.await?.event ?? "click")
		);

		if (!hasGates) {
			// No gates → single segment named "main"
			// Filter out any transitionTo entries and capture them as next edges
			const filtered = timeline.filter((e) => e.transitionTo == null);
			const transitionEntry = timeline.find((e) => e.transitionTo != null);
			const segment = { timeline: filtered };
			if (setup && Object.keys(setup).length) segment.setup = setup;
			if (landing && Object.keys(landing).length) segment.landing = landing;
			if (transitionEntry) {
				const tt = transitionEntry.transitionTo;
				if (tt.scene && tt.cinematic) {
					segment.next = { segment: tt.cinematic, scene: tt.scene };
				} else if (tt.cinematic) {
					// Cross-cinematic transition (same scene) — can't map to segment, leave as-is
					// This becomes a dead end; user will need to re-configure
				}
			}
			return {
				trigger, tracking,
				...(synchronized ? { synchronized } : {}),
				entry: "main",
				segments: { "main": segment },
			};
		}

		// Split timeline at interaction gates
		const segments = {};
		let currentEntries = [];
		let segmentCounter = 1;
		let currentGate = null;
		const segmentOrder = [];

		function flushSegment() {
			const name = `segment-${segmentCounter++}`;
			const seg = { timeline: [...currentEntries] };
			if (currentGate) seg.gate = currentGate;
			segments[name] = seg;
			segmentOrder.push(name);
			currentEntries = [];
			currentGate = null;
			return name;
		}

		for (const entry of timeline) {
			// TransitionTo: capture and skip (will become next edge on final segment)
			if (entry.transitionTo != null) continue;

			// Interaction gate: flush current entries as a segment, start new one
			if (entry.await != null && INTERACTION_GATES.has(entry.await?.event ?? "click")) {
				flushSegment();
				// The gate applies to the NEXT segment
				currentGate = { ...entry.await };
				delete currentGate.event; // will be re-added below
				currentGate = { event: entry.await.event ?? "click", ...currentGate };
				continue;
			}

			currentEntries.push(entry);
		}

		// Flush remaining entries
		if (currentEntries.length > 0 || currentGate) {
			flushSegment();
		}

		// Wire up next edges (linear chain)
		for (let i = 0; i < segmentOrder.length - 1; i++) {
			segments[segmentOrder[i]].next = segmentOrder[i + 1];
		}

		// First segment gets setup, last gets landing
		if (segmentOrder.length > 0) {
			if (setup && Object.keys(setup).length) {
				segments[segmentOrder[0]].setup = setup;
			}
			if (landing && Object.keys(landing).length) {
				segments[segmentOrder[segmentOrder.length - 1]].landing = landing;
			}
		}

		// Handle transitionTo from original timeline as next on final segment
		const transitionEntry = timeline.find((e) => e.transitionTo != null);
		if (transitionEntry && segmentOrder.length > 0) {
			const tt = transitionEntry.transitionTo;
			const lastSeg = segments[segmentOrder[segmentOrder.length - 1]];
			if (tt.scene && tt.cinematic) {
				lastSeg.next = { segment: tt.cinematic, scene: tt.scene };
			}
		}

		return {
			trigger, tracking,
			...(synchronized ? { synchronized } : {}),
			entry: segmentOrder[0] ?? "main",
			segments,
		};
	}

	/**
	 * Migrate a v4 cinematic to v5 step-level duration model.
	 * Lifts per-tween duration to the step, removes detach field.
	 * Steps with detached tweens become parallel entries.
	 *
	 * @param {object} v4Data  A single v4 cinematic
	 * @returns {object}  v5 cinematic (same shape, timeline entries transformed)
	 */
	static migrateV4toV5(v4Data) {
		if (!v4Data.segments) return v4Data;

		const migrated = foundry.utils.deepClone(v4Data);
		for (const seg of Object.values(migrated.segments)) {
			if (seg.timeline?.length) {
				seg.timeline = CinematicState.#migrateTimelineV5(seg.timeline);
			}
		}
		return migrated;
	}

	/**
	 * Strip duration/detach from a tween, returning a clean v5 tween.
	 */
	static #stripTween(tw) {
		const { duration, detach, ...rest } = tw;
		return rest;
	}

	/**
	 * Migrate a timeline entry array from v4 to v5.
	 * Recursively handles parallel branches.
	 */
	static #migrateTimelineV5(entries) {
		const result = [];
		for (const entry of entries) {
			// Non-step entries pass through unchanged (except parallel which recurses)
			if (entry.delay != null || entry.await != null || entry.emit != null
				|| entry.transitionTo != null || entry.sound != null || entry.stopSound != null) {
				result.push(entry);
				continue;
			}

			if (entry.parallel?.branches) {
				const migratedBranches = entry.parallel.branches.map(
					(branch) => CinematicState.#migrateTimelineV5(branch),
				);
				result.push({ ...entry, parallel: { ...entry.parallel, branches: migratedBranches } });
				continue;
			}

			// Step entry — has tweens
			if (!entry.tweens?.length) {
				result.push({ duration: 500, ...entry });
				continue;
			}

			const attached = [];
			const detached = [];
			for (const tw of entry.tweens) {
				if (tw.detach) detached.push(tw);
				else attached.push(tw);
			}

			if (detached.length === 0) {
				// No detach — lift max duration to step level
				const maxDur = Math.max(500, ...entry.tweens.map((t) => t.duration ?? 0));
				const { tweens, ...rest } = entry;
				result.push({
					...rest,
					duration: maxDur,
					tweens: tweens.map(CinematicState.#stripTween),
				});
			} else if (attached.length === 0) {
				// All detached — still becomes a regular step (fire-and-forget semantics lost,
				// but this is an edge case; wrap in parallel to preserve intent)
				const maxDur = Math.max(500, ...detached.map((t) => t.duration ?? 0));
				const { tweens, ...rest } = entry;
				result.push({
					...rest,
					duration: maxDur,
					tweens: detached.map(CinematicState.#stripTween),
				});
			} else {
				// Mixed: convert to parallel with two branches
				const maxAttached = Math.max(500, ...attached.map((t) => t.duration ?? 0));
				const maxDetached = Math.max(500, ...detached.map((t) => t.duration ?? 0));
				const { tweens, ...rest } = entry;
				result.push({
					parallel: {
						branches: [
							[{ ...rest, duration: maxAttached, tweens: attached.map(CinematicState.#stripTween) }],
							[{ duration: maxDetached, tweens: detached.map(CinematicState.#stripTween) }],
						],
						join: "all",
						overflow: "detach",
					},
				});
			}
		}
		return result;
	}

	static fromScene(scene, cinematicName = "default") {
		const flag = scene?.getFlag(MODULE_ID, "cinematic");
		let cloned = flag ? foundry.utils.deepClone(flag) : null;
		const hash = flag ? CinematicState.#computeHash(flag) : null;

		// v2→v3 migration
		if (cloned && (cloned.version ?? 1) < 3) {
			const { version, ...rest } = cloned;
			cloned = { version: 3, cinematics: { "default": rest } };
		}

		// v3→v4 migration
		if (cloned && cloned.version === 3) {
			for (const [name, data] of Object.entries(cloned.cinematics ?? {})) {
				cloned.cinematics[name] = CinematicState.migrateV3toV4(data);
			}
			cloned.version = 4;
		}

		// v4→v5 migration
		if (cloned && cloned.version === 4) {
			for (const [name, data] of Object.entries(cloned.cinematics ?? {})) {
				cloned.cinematics[name] = CinematicState.migrateV4toV5(data);
			}
			cloned.version = CURRENT_VERSION;
		}

		return new CinematicState(cloned, { loadedHash: hash, cinematicName });
	}

	static #computeHash(data) {
		return foundry.utils.deepClone(data);
	}

	/**
	 * Check if the scene's cinematic flag has been modified since this state was loaded.
	 * @param {object} scene  The Foundry scene document
	 * @returns {boolean} true if scene data differs from what was loaded
	 */
	isStale(scene) {
		if (!this.#loadedHash) return false;
		const currentFlag = scene?.getFlag(MODULE_ID, "cinematic");
		if (!currentFlag) return false;
		return !foundry.utils.objectsEqual(currentFlag, this.#loadedHash);
	}

	// ── Active cinematic accessor ─────────────────────────────────────────

	get #active() {
		return this.#data.cinematics[this.#activeCinematicName];
	}

	// ── Read ──────────────────────────────────────────────────────────────

	get data() { return this.#data; }
	get trigger() { return this.#active.trigger; }
	get tracking() { return this.#active.tracking; }
	get synchronized() { return this.#active.synchronized ?? false; }
	get activeCinematicName() { return this.#activeCinematicName; }

	// ── Segment accessors ────────────────────────────────────────────────

	get segments() { return this.#active.segments; }
	get entry() { return this.#active.entry; }
	get activeSegmentName() { return this.#activeSegmentName; }

	get activeSegment() {
		return this.#active.segments?.[this.#activeSegmentName] ?? null;
	}

	// ── Compatibility bridge: route through active segment ───────────────

	get timeline() { return this.activeSegment?.timeline ?? []; }
	get setup() { return this.activeSegment?.setup ?? {}; }
	get landing() { return this.activeSegment?.landing ?? {}; }
	get isEmpty() { return !this.activeSegment?.timeline?.length; }

	// ── Multi-cinematic management ────────────────────────────────────────

	listCinematicNames() {
		return Object.keys(this.#data.cinematics);
	}

	switchCinematic(name) {
		if (!this.#data.cinematics[name]) return this;
		const cinematic = this.#data.cinematics[name];
		return new CinematicState(foundry.utils.deepClone(this.#data), {
			loadedHash: this.#loadedHash,
			cinematicName: name,
			segmentName: cinematic.entry ?? "main",
		});
	}

	addCinematic(name) {
		if (!name || this.#data.cinematics[name]) return this;
		const newData = foundry.utils.deepClone(this.#data);
		newData.cinematics[name] = CinematicState.emptyCinematic();
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: name,
			segmentName: "main",
		});
	}

	removeCinematic(name) {
		const names = Object.keys(this.#data.cinematics);
		if (names.length <= 1) return this; // must keep at least 1
		if (!this.#data.cinematics[name]) return this;
		const newData = foundry.utils.deepClone(this.#data);
		delete newData.cinematics[name];
		// If we deleted the active cinematic, switch to the first remaining one
		const newActive = this.#activeCinematicName === name
			? Object.keys(newData.cinematics)[0]
			: this.#activeCinematicName;
		const cin = newData.cinematics[newActive];
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: newActive,
			segmentName: cin?.entry ?? "main",
		});
	}

	renameCinematic(oldName, newName) {
		if (!oldName || !newName || oldName === newName) return this;
		if (!this.#data.cinematics[oldName]) return this;
		if (this.#data.cinematics[newName]) return this; // target name exists
		const newData = foundry.utils.deepClone(this.#data);
		// Rebuild cinematics object preserving key order
		const rebuilt = {};
		for (const [k, v] of Object.entries(newData.cinematics)) {
			rebuilt[k === oldName ? newName : k] = v;
		}
		newData.cinematics = rebuilt;
		const newActive = this.#activeCinematicName === oldName ? newName : this.#activeCinematicName;
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: newActive,
			segmentName: this.#activeSegmentName,
		});
	}

	// ── Cinematic-level mutations ─────────────────────────────────────────

	setTrigger(trigger) { return this.#cloneActive({ trigger }); }
	setTracking(tracking) { return this.#cloneActive({ tracking }); }
	setSynchronized(synchronized) { return this.#cloneActive({ synchronized }); }

	// ── Segment-level mutations (setup/landing now live on segments) ──────

	setSetup(setup) { return this.#cloneActiveSegment({ setup }); }
	setLanding(landing) { return this.#cloneActiveSegment({ landing }); }

	// ── Segment management methods ────────────────────────────────────────

	switchSegment(name) {
		if (!this.#active.segments?.[name]) return this;
		return new CinematicState(foundry.utils.deepClone(this.#data), {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
			segmentName: name,
		});
	}

	addSegment(name, afterSegmentName = null) {
		if (!name || this.#active.segments?.[name]) return this;
		const newData = foundry.utils.deepClone(this.#data);
		const cin = newData.cinematics[this.#activeCinematicName];
		cin.segments[name] = CinematicState.emptySegment();

		// Wire next from afterSegmentName if provided
		if (afterSegmentName && cin.segments[afterSegmentName]) {
			const oldNext = cin.segments[afterSegmentName].next;
			cin.segments[afterSegmentName].next = name;
			if (oldNext) {
				cin.segments[name].next = oldNext;
			}
		}

		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
			segmentName: name,
		});
	}

	removeSegment(name) {
		const segNames = Object.keys(this.#active.segments ?? {});
		if (segNames.length <= 1) return this; // must keep at least 1
		if (!this.#active.segments?.[name]) return this;

		const newData = foundry.utils.deepClone(this.#data);
		const cin = newData.cinematics[this.#activeCinematicName];
		const removedNext = cin.segments[name].next;

		// Re-wire: any segment pointing to the removed one should point to its next
		for (const [, seg] of Object.entries(cin.segments)) {
			if (seg.next === name) {
				seg.next = removedNext ?? undefined;
				if (!seg.next) delete seg.next;
			} else if (typeof seg.next === "object" && seg.next?.segment === name) {
				seg.next = removedNext ?? undefined;
				if (!seg.next) delete seg.next;
			}
		}

		delete cin.segments[name];

		// Update entry if it pointed to the removed segment
		if (cin.entry === name) {
			cin.entry = Object.keys(cin.segments)[0];
		}

		const newSegName = this.#activeSegmentName === name
			? cin.entry
			: this.#activeSegmentName;

		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
			segmentName: newSegName,
		});
	}

	renameSegment(oldName, newName) {
		if (!oldName || !newName || oldName === newName) return this;
		if (!this.#active.segments?.[oldName]) return this;
		if (this.#active.segments?.[newName]) return this;

		const newData = foundry.utils.deepClone(this.#data);
		const cin = newData.cinematics[this.#activeCinematicName];

		// Rebuild segments preserving order
		const rebuilt = {};
		for (const [k, v] of Object.entries(cin.segments)) {
			rebuilt[k === oldName ? newName : k] = v;
		}
		cin.segments = rebuilt;

		// Update all next references
		for (const [, seg] of Object.entries(cin.segments)) {
			if (seg.next === oldName) seg.next = newName;
			else if (typeof seg.next === "object" && seg.next?.segment === oldName) {
				seg.next.segment = newName;
			}
		}

		// Update entry
		if (cin.entry === oldName) cin.entry = newName;

		const newSegName = this.#activeSegmentName === oldName ? newName : this.#activeSegmentName;

		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
			segmentName: newSegName,
		});
	}

	setSegmentGate(gate) {
		return this.#cloneActiveSegment({ gate: gate ?? undefined });
	}

	setSegmentNext(next) {
		return this.#cloneActiveSegment({ next: next ?? undefined });
	}

	setSegmentSetup(setup) {
		return this.#cloneActiveSegment({ setup });
	}

	setSegmentLanding(landing) {
		return this.#cloneActiveSegment({ landing });
	}

	listSegmentNames() {
		return Object.keys(this.#active.segments ?? {});
	}

	// ── Timeline entry mutations (scoped to active segment) ──────────────

	addStep(index = -1) {
		const timeline = [...this.activeSegment.timeline];
		const entry = { duration: 1000, tweens: [] };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActiveSegment({ timeline });
	}

	addDelay(index = -1, ms = 1000) {
		const timeline = [...this.activeSegment.timeline];
		const entry = { delay: ms };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActiveSegment({ timeline });
	}

	addAwait(index = -1, config = null) {
		console.warn(`[${MODULE_ID}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`);
		return this;
	}

	addEmit(index = -1, signal = "") {
		const timeline = [...this.activeSegment.timeline];
		const entry = { emit: signal };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActiveSegment({ timeline });
	}

	addParallel(index = -1) {
		const timeline = [...this.activeSegment.timeline];
		const entry = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActiveSegment({ timeline });
	}

	addTransitionTo(index = -1, config = null) {
		console.warn(`[${MODULE_ID}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`);
		return this;
	}

	addSound(index = -1, config = null) {
		const timeline = [...this.activeSegment.timeline];
		const entry = { sound: config ?? { src: "", volume: 0.8, loop: false, duration: 0, fireAndForget: false } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActiveSegment({ timeline });
	}

	addStopSound(index = -1, id = "") {
		const timeline = [...this.activeSegment.timeline];
		const entry = { stopSound: id };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActiveSegment({ timeline });
	}

	moveEntry(fromIndex, toIndex) {
		if (fromIndex === toIndex) return this;
		const timeline = [...this.activeSegment.timeline];
		if (fromIndex < 0 || fromIndex >= timeline.length) return this;
		if (toIndex < 0 || toIndex >= timeline.length) return this;
		const [entry] = timeline.splice(fromIndex, 1);
		timeline.splice(toIndex, 0, entry);
		return this.#cloneActiveSegment({ timeline });
	}

	removeEntry(index) {
		const timeline = [...this.activeSegment.timeline];
		if (index < 0 || index >= timeline.length) return this;
		timeline.splice(index, 1);
		return this.#cloneActiveSegment({ timeline });
	}

	updateEntry(index, patch) {
		const timeline = this.activeSegment.timeline.map((entry, i) => {
			if (i !== index) return entry;
			return { ...foundry.utils.deepClone(entry), ...patch };
		});
		return this.#cloneActiveSegment({ timeline });
	}

	// ── Tween mutations ──────────────────────────────────────────────────

	addTween(entryIndex, tween = null) {
		const defaultTween = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
		return this.#mutateEntry(entryIndex, (entry) => {
			const tweens = [...(entry.tweens ?? []), tween ?? defaultTween];
			return { ...entry, tweens };
		});
	}

	updateTween(entryIndex, tweenIndex, patch) {
		return this.#mutateEntry(entryIndex, (entry) => {
			const tweens = (entry.tweens ?? []).map((tw, i) => {
				if (i !== tweenIndex) return tw;
				return { ...tw, ...patch };
			});
			return { ...entry, tweens };
		});
	}

	removeTween(entryIndex, tweenIndex) {
		return this.#mutateEntry(entryIndex, (entry) => {
			const tweens = (entry.tweens ?? []).filter((_, i) => i !== tweenIndex);
			return { ...entry, tweens };
		});
	}

	updateStepDuration(entryIndex, duration) {
		return this.#mutateEntry(entryIndex, (entry) => ({ ...entry, duration: Math.max(0, duration) }));
	}

	// ── Parallel branch mutations ────────────────────────────────────────

	addBranch(entryIndex) {
		return this.#mutateEntry(entryIndex, (entry) => {
			if (!entry.parallel) return entry;
			const branches = [...entry.parallel.branches, []];
			return { ...entry, parallel: { ...entry.parallel, branches } };
		});
	}

	removeBranch(entryIndex, branchIndex) {
		return this.#mutateEntry(entryIndex, (entry) => {
			if (!entry.parallel) return entry;
			const branches = entry.parallel.branches.filter((_, i) => i !== branchIndex);
			if (branches.length < 1) return entry; // must keep at least 1 branch
			return { ...entry, parallel: { ...entry.parallel, branches } };
		});
	}

	addBranchEntry(entryIndex, branchIndex, branchEntry = null) {
		const defaultEntry = { duration: 1000, tweens: [] };
		return this.#mutateEntry(entryIndex, (entry) => {
			if (!entry.parallel) return entry;
			const branches = entry.parallel.branches.map((branch, i) => {
				if (i !== branchIndex) return branch;
				return [...branch, branchEntry ?? defaultEntry];
			});
			return { ...entry, parallel: { ...entry.parallel, branches } };
		});
	}

	removeBranchEntry(entryIndex, branchIndex, branchEntryIndex) {
		return this.#mutateEntry(entryIndex, (entry) => {
			if (!entry.parallel) return entry;
			const branches = entry.parallel.branches.map((branch, i) => {
				if (i !== branchIndex) return branch;
				return branch.filter((_, j) => j !== branchEntryIndex);
			});
			return { ...entry, parallel: { ...entry.parallel, branches } };
		});
	}

	updateBranchEntry(entryIndex, branchIndex, branchEntryIndex, patch) {
		return this.#mutateEntry(entryIndex, (entry) => {
			if (!entry.parallel) return entry;
			const branches = entry.parallel.branches.map((branch, i) => {
				if (i !== branchIndex) return branch;
				return branch.map((be, j) => {
					if (j !== branchEntryIndex) return be;
					return { ...foundry.utils.deepClone(be), ...patch };
				});
			});
			return { ...entry, parallel: { ...entry.parallel, branches } };
		});
	}

	moveBranchEntry(entryIndex, branchIndex, fromIndex, toIndex) {
		if (fromIndex === toIndex) return this;
		return this.#mutateEntry(entryIndex, (entry) => {
			if (!entry.parallel) return entry;
			const branches = entry.parallel.branches.map((branch, i) => {
				if (i !== branchIndex) return branch;
				const newBranch = [...branch];
				if (fromIndex < 0 || fromIndex >= newBranch.length) return branch;
				if (toIndex < 0 || toIndex >= newBranch.length) return branch;
				const [item] = newBranch.splice(fromIndex, 1);
				newBranch.splice(toIndex, 0, item);
				return newBranch;
			});
			return { ...entry, parallel: { ...entry.parallel, branches } };
		});
	}

	// ── Persistence ──────────────────────────────────────────────────────

	async save(scene) {
		const data = { ...foundry.utils.deepClone(this.#data), version: CURRENT_VERSION };
		await scene.setFlag(MODULE_ID, "cinematic", data);
	}

	/** Returns the active cinematic's data (for validation/export). */
	toJSON() {
		return foundry.utils.deepClone(this.#active);
	}

	/** Returns the entire v4 flag structure. */
	toFullJSON() {
		return foundry.utils.deepClone(this.#data);
	}

	// ── Internal ─────────────────────────────────────────────────────────

	/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
	#cloneActive(patch) {
		const newData = foundry.utils.deepClone(this.#data);
		Object.assign(newData.cinematics[this.#activeCinematicName], patch);
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
			segmentName: this.#activeSegmentName,
		});
	}

	/** Clone the full state with a patch to the active segment within the active cinematic. */
	#cloneActiveSegment(patch) {
		const newData = foundry.utils.deepClone(this.#data);
		const seg = newData.cinematics[this.#activeCinematicName].segments[this.#activeSegmentName];
		if (!seg) return this;
		Object.assign(seg, patch);
		// Clean up undefined values from patches like { gate: undefined }
		for (const [k, v] of Object.entries(seg)) {
			if (v === undefined) delete seg[k];
		}
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
			segmentName: this.#activeSegmentName,
		});
	}

	/** Mutate a single timeline entry within the active segment. */
	#mutateEntry(index, fn) {
		const seg = this.activeSegment;
		if (!seg || index < 0 || index >= seg.timeline.length) return this;
		const timeline = seg.timeline.map((entry, i) => {
			if (i !== index) return entry;
			return fn(foundry.utils.deepClone(entry));
		});
		return this.#cloneActiveSegment({ timeline });
	}
}
