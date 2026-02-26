import { MODULE_ID } from "../../time-triggers/core/constants.js";

const CURRENT_VERSION = 2;

/**
 * Immutable state wrapper for cinematic flag data.
 * Every mutation returns a new CinematicState, making undo trivial later.
 */
export class CinematicState {
	#data;
	#loadedHash;

	constructor(data = null, { loadedHash = null } = {}) {
		this.#data = data ?? CinematicState.empty();
		this.#loadedHash = loadedHash;
	}

	static empty() {
		return { version: CURRENT_VERSION, trigger: "canvasReady", tracking: true, setup: {}, landing: {}, timeline: [] };
	}

	static fromScene(scene) {
		const flag = scene?.getFlag(MODULE_ID, "cinematic");
		const cloned = flag ? foundry.utils.deepClone(flag) : null;
		const hash = flag ? CinematicState.#computeHash(flag) : null;
		return new CinematicState(cloned, { loadedHash: hash });
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

	// ── Read ──────────────────────────────────────────────────────────────

	get data() { return this.#data; }
	get timeline() { return this.#data.timeline; }
	get trigger() { return this.#data.trigger; }
	get tracking() { return this.#data.tracking; }
	get setup() { return this.#data.setup; }
	get landing() { return this.#data.landing; }
	get isEmpty() { return !this.#data.timeline?.length; }
	get synchronized() { return this.#data.synchronized ?? false; }

	// ── Top-level mutations ───────────────────────────────────────────────

	setTrigger(trigger) { return this.#clone({ trigger }); }
	setTracking(tracking) { return this.#clone({ tracking }); }
	setSynchronized(synchronized) { return this.#clone({ synchronized }); }
	setSetup(setup) { return this.#clone({ setup }); }
	setLanding(landing) { return this.#clone({ landing }); }

	// ── Timeline entry mutations ──────────────────────────────────────────

	addStep(index = -1) {
		const timeline = [...this.#data.timeline];
		const entry = { tweens: [] };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#clone({ timeline });
	}

	addDelay(index = -1, ms = 1000) {
		const timeline = [...this.#data.timeline];
		const entry = { delay: ms };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#clone({ timeline });
	}

	addAwait(index = -1, config = null) {
		const timeline = [...this.#data.timeline];
		const entry = { await: config ?? { event: "click" } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#clone({ timeline });
	}

	addEmit(index = -1, signal = "") {
		const timeline = [...this.#data.timeline];
		const entry = { emit: signal };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#clone({ timeline });
	}

	addParallel(index = -1) {
		const timeline = [...this.#data.timeline];
		const entry = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
		if (index < 0 || index >= timeline.length) {
			timeline.push(entry);
		} else {
			timeline.splice(index, 0, entry);
		}
		return this.#clone({ timeline });
	}

	moveEntry(fromIndex, toIndex) {
		if (fromIndex === toIndex) return this;
		const timeline = [...this.#data.timeline];
		if (fromIndex < 0 || fromIndex >= timeline.length) return this;
		if (toIndex < 0 || toIndex >= timeline.length) return this;
		const [entry] = timeline.splice(fromIndex, 1);
		timeline.splice(toIndex, 0, entry);
		return this.#clone({ timeline });
	}

	removeEntry(index) {
		const timeline = [...this.#data.timeline];
		if (index < 0 || index >= timeline.length) return this;
		timeline.splice(index, 1);
		return this.#clone({ timeline });
	}

	updateEntry(index, patch) {
		const timeline = this.#data.timeline.map((entry, i) => {
			if (i !== index) return entry;
			return { ...foundry.utils.deepClone(entry), ...patch };
		});
		return this.#clone({ timeline });
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
		const data = { ...this.#data, version: CURRENT_VERSION };
		await scene.setFlag(MODULE_ID, "cinematic", data);
	}

	toJSON() {
		return foundry.utils.deepClone(this.#data);
	}

	// ── Internal ─────────────────────────────────────────────────────────

	#clone(patch) {
		return new CinematicState({ ...foundry.utils.deepClone(this.#data), ...patch }, { loadedHash: this.#loadedHash });
	}

	#mutateEntry(index, fn) {
		if (index < 0 || index >= this.#data.timeline.length) return this;
		const timeline = this.#data.timeline.map((entry, i) => {
			if (i !== index) return entry;
			return fn(foundry.utils.deepClone(entry));
		});
		return this.#clone({ timeline });
	}
}
