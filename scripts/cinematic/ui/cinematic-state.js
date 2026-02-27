import { MODULE_ID } from "../../time-triggers/core/constants.js";

const CURRENT_VERSION = 3;

/**
 * Immutable state wrapper for cinematic flag data.
 * Every mutation returns a new CinematicState, making undo trivial later.
 *
 * v3 flag shape:
 * {
 *   version: 3,
 *   cinematics: {
 *     "intro": { trigger, tracking, synchronized, setup, landing, timeline },
 *     "reveal": { trigger, tracking, synchronized, setup, landing, timeline }
 *   }
 * }
 */
export class CinematicState {
	#data;
	#activeCinematicName;
	#loadedHash;

	constructor(data = null, { loadedHash = null, cinematicName = "default" } = {}) {
		this.#data = data ?? CinematicState.empty();
		this.#activeCinematicName = cinematicName;
		this.#loadedHash = loadedHash;
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
		return { trigger: "canvasReady", tracking: true, setup: {}, landing: {}, timeline: [] };
	}

	static fromScene(scene, cinematicName = "default") {
		const flag = scene?.getFlag(MODULE_ID, "cinematic");
		let cloned = flag ? foundry.utils.deepClone(flag) : null;
		const hash = flag ? CinematicState.#computeHash(flag) : null;

		// v2→v3 migration
		if (cloned && (cloned.version ?? 1) < 3) {
			const { version, ...rest } = cloned;
			cloned = { version: CURRENT_VERSION, cinematics: { "default": rest } };
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
	get timeline() { return this.#active.timeline; }
	get trigger() { return this.#active.trigger; }
	get tracking() { return this.#active.tracking; }
	get setup() { return this.#active.setup; }
	get landing() { return this.#active.landing; }
	get isEmpty() { return !this.#active.timeline?.length; }
	get synchronized() { return this.#active.synchronized ?? false; }
	get activeCinematicName() { return this.#activeCinematicName; }

	// ── Multi-cinematic management ────────────────────────────────────────

	listCinematicNames() {
		return Object.keys(this.#data.cinematics);
	}

	switchCinematic(name) {
		if (!this.#data.cinematics[name]) return this;
		return new CinematicState(foundry.utils.deepClone(this.#data), {
			loadedHash: this.#loadedHash,
			cinematicName: name,
		});
	}

	addCinematic(name) {
		if (!name || this.#data.cinematics[name]) return this;
		const newData = foundry.utils.deepClone(this.#data);
		newData.cinematics[name] = CinematicState.emptyCinematic();
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: name,
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
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: newActive,
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
		});
	}

	// ── Top-level mutations (scoped to active cinematic) ──────────────────

	setTrigger(trigger) { return this.#cloneActive({ trigger }); }
	setTracking(tracking) { return this.#cloneActive({ tracking }); }
	setSynchronized(synchronized) { return this.#cloneActive({ synchronized }); }
	setSetup(setup) { return this.#cloneActive({ setup }); }
	setLanding(landing) { return this.#cloneActive({ landing }); }

	// ── Timeline entry mutations ──────────────────────────────────────────

	addStep(index = -1) {
		const timeline = [...this.#active.timeline];
		const entry = { tweens: [] };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addDelay(index = -1, ms = 1000) {
		const timeline = [...this.#active.timeline];
		const entry = { delay: ms };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addAwait(index = -1, config = null) {
		const timeline = [...this.#active.timeline];
		const entry = { await: config ?? { event: "click" } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addEmit(index = -1, signal = "") {
		const timeline = [...this.#active.timeline];
		const entry = { emit: signal };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addParallel(index = -1) {
		const timeline = [...this.#active.timeline];
		const entry = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addTransitionTo(index = -1, config = null) {
		const timeline = [...this.#active.timeline];
		const entry = { transitionTo: config ?? { cinematic: "", scene: "" } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addSound(index = -1, config = null) {
		const timeline = [...this.#active.timeline];
		const entry = { sound: config ?? { src: "", volume: 0.8, loop: false, duration: 0, fireAndForget: false } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	addStopSound(index = -1, id = "") {
		const timeline = [...this.#active.timeline];
		const entry = { stopSound: id };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#cloneActive({ timeline });
	}

	moveEntry(fromIndex, toIndex) {
		if (fromIndex === toIndex) return this;
		const timeline = [...this.#active.timeline];
		if (fromIndex < 0 || fromIndex >= timeline.length) return this;
		if (toIndex < 0 || toIndex >= timeline.length) return this;
		const [entry] = timeline.splice(fromIndex, 1);
		timeline.splice(toIndex, 0, entry);
		return this.#cloneActive({ timeline });
	}

	removeEntry(index) {
		const timeline = [...this.#active.timeline];
		if (index < 0 || index >= timeline.length) return this;
		timeline.splice(index, 1);
		return this.#cloneActive({ timeline });
	}

	updateEntry(index, patch) {
		const timeline = this.#active.timeline.map((entry, i) => {
			if (i !== index) return entry;
			return { ...foundry.utils.deepClone(entry), ...patch };
		});
		return this.#cloneActive({ timeline });
	}

	// ── Tween mutations ──────────────────────────────────────────────────

	addTween(entryIndex, tween = null) {
		const defaultTween = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1000 };
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
		const defaultEntry = { tweens: [] };
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

	/** Returns the entire v3 flag structure. */
	toFullJSON() {
		return foundry.utils.deepClone(this.#data);
	}

	// ── Internal ─────────────────────────────────────────────────────────

	/** Clone the full state with a patch to the active cinematic. */
	#cloneActive(patch) {
		const newData = foundry.utils.deepClone(this.#data);
		Object.assign(newData.cinematics[this.#activeCinematicName], patch);
		return new CinematicState(newData, {
			loadedHash: this.#loadedHash,
			cinematicName: this.#activeCinematicName,
		});
	}

	/** Mutate a single timeline entry within the active cinematic. */
	#mutateEntry(index, fn) {
		if (index < 0 || index >= this.#active.timeline.length) return this;
		const timeline = this.#active.timeline.map((entry, i) => {
			if (i !== index) return entry;
			return fn(foundry.utils.deepClone(entry));
		});
		return this.#cloneActive({ timeline });
	}
}
