import { getTweenType } from "../registry.js";
import { emitSocket } from "../../../common/socket.js";
import { ErrorPolicy, SOCKET_TYPE_SEQUENCE, SOCKET_TYPE_SEQUENCE_CANCEL } from "./constants.js";
import { TimelineHandle } from "./TimelineHandle.js";

// ── Named timeline registry ────────────────────────────────────────────

/** @type {Map<string, TimelineHandle>} */
const namedTimelines = new Map();

/**
 * Register a named timeline handle. If one already exists with the same
 * name, it is cancelled first (matches CanvasAnimation.terminateAnimation pattern).
 * Auto-cleans on finish.
 * @param {string} name
 * @param {TimelineHandle} handle
 */
export function registerTimeline(name, handle) {
	const existing = namedTimelines.get(name);
	if (existing && !existing.cancelled) {
		existing.cancel();
	}
	namedTimelines.set(name, handle);
	handle.finished.then(() => {
		// Only delete if this handle is still the registered one
		if (namedTimelines.get(name) === handle) {
			namedTimelines.delete(name);
		}
	});
}

/**
 * Cancel a named timeline.
 * @param {string} name
 * @returns {boolean} Whether a timeline was found and cancelled
 */
export function cancelTimeline(name) {
	const handle = namedTimelines.get(name);
	if (handle && !handle.cancelled) {
		handle.cancel();
		return true;
	}
	return false;
}

/**
 * Look up a named timeline handle for status checking.
 * @param {string} name
 * @returns {TimelineHandle | undefined}
 */
export function getTimeline(name) {
	return namedTimelines.get(name);
}

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Returns a promise that resolves after `ms` milliseconds, or rejects
 * if the signal is aborted before then.
 * @param {number} ms
 * @param {AbortSignal} signal
 * @returns {Promise<void>}
 */
function cancellableDelay(ms, signal) {
	if (ms <= 0) return Promise.resolve();
	return new Promise((resolve, reject) => {
		if (signal.aborted) return reject(signal.reason);
		const timer = setTimeout(resolve, ms);
		signal.addEventListener("abort", () => {
			clearTimeout(timer);
			reject(signal.reason);
		}, { once: true });
	});
}

// ── StepBuilder ─────────────────────────────────────────────────────────

/**
 * Builder for a single step within a TweenTimeline.
 * Not exported — accessed via TweenTimeline.step().
 */
class StepBuilder {
	/** @type {TweenTimeline} */
	#timeline;
	/** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
	#entries = [];
	/** @type {Function|null} */
	#before = null;
	/** @type {Function|null} */
	#after = null;

	constructor(timeline) {
		this.#timeline = timeline;
	}

	/**
	 * Add a tween entry to this step.
	 * @param {string} type  Registered tween type name
	 * @param {object} params  Type-specific parameters
	 * @param {object} [opts]  Options (durationMS, easing, etc.)
	 * @returns {StepBuilder} this
	 */
	add(type, params, opts) {
		this.#entries.push({ type, params, opts: opts ?? {}, detach: false });
		return this;
	}

	/**
	 * Mark the last entry as fire-and-forget (does not block step progression).
	 * @returns {StepBuilder} this
	 */
	detach() {
		if (this.#entries.length === 0) {
			throw new Error("StepBuilder.detach(): no entry to detach.");
		}
		this.#entries[this.#entries.length - 1].detach = true;
		return this;
	}

	/**
	 * Callback invoked before this step's tweens start.
	 * @param {Function} fn
	 * @returns {StepBuilder} this
	 */
	before(fn) {
		this.#before = fn;
		return this;
	}

	/**
	 * Callback invoked after this step's awaited tweens complete.
	 * @param {Function} fn
	 * @returns {StepBuilder} this
	 */
	after(fn) {
		this.#after = fn;
		return this;
	}

	// ── Delegation to parent TweenTimeline for fluent chaining ──

	/** Start a new step (finalizes this one). */
	step() { return this.#timeline.step(); }
	/** Insert a delay between steps. */
	delay(ms) { return this.#timeline.delay(ms); }
	/** Register onComplete callback. */
	onComplete(fn) { return this.#timeline.onComplete(fn); }
	/** Register onCancel callback. */
	onCancel(fn) { return this.#timeline.onCancel(fn); }
	/** Execute the timeline. */
	run(opts) { return this.#timeline.run(opts); }
	/** Serialize the timeline. */
	toJSON() { return this.#timeline.toJSON(); }

	// ── Internal access ──

	/** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
	_finalize() {
		return {
			entries: this.#entries,
			before: this.#before,
			after: this.#after,
		};
	}
}

// ── TweenTimeline ───────────────────────────────────────────────────────

export class TweenTimeline {
	/** @type {string|null} */
	#name = null;
	/** @type {string} */
	#errorPolicy = ErrorPolicy.ABORT;
	/** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
	#segments = [];
	/** @type {StepBuilder|null} */
	#currentStep = null;
	/** @type {Function|null} */
	#beforeAll = null;
	/** @type {Function|null} */
	#onComplete = null;
	/** @type {Function|null} */
	#onCancel = null;

	/**
	 * Register this timeline in the named registry. Starting a new
	 * timeline with the same name cancels the previous one.
	 * @param {string} name
	 * @returns {TweenTimeline} this
	 */
	name(name) {
		this.#name = name;
		return this;
	}

	/**
	 * Set the error policy for step execution.
	 * @param {"abort"|"continue"} policy
	 * @returns {TweenTimeline} this
	 */
	errorPolicy(policy) {
		if (policy !== ErrorPolicy.ABORT && policy !== ErrorPolicy.CONTINUE) {
			throw new Error(`Invalid error policy: "${policy}". Use "abort" or "continue".`);
		}
		this.#errorPolicy = policy;
		return this;
	}

	/**
	 * Start a new step. Finalizes the previous step if one is open.
	 * @returns {StepBuilder}
	 */
	step() {
		this.#finalizeCurrentStep();
		this.#currentStep = new StepBuilder(this);
		return this.#currentStep;
	}

	/**
	 * Insert a delay (in ms) between the previous step and the next.
	 * @param {number} ms
	 * @returns {TweenTimeline} this
	 */
	delay(ms) {
		this.#finalizeCurrentStep();
		this.#segments.push({ kind: "delay", ms });
		return this;
	}

	/**
	 * Callback invoked before the first step runs.
	 * @param {Function} fn
	 * @returns {TweenTimeline} this
	 */
	beforeAll(fn) {
		this.#beforeAll = fn;
		return this;
	}

	/**
	 * Callback invoked on successful completion.
	 * @param {Function} fn
	 * @returns {TweenTimeline} this
	 */
	onComplete(fn) {
		this.#onComplete = fn;
		return this;
	}

	/**
	 * Callback invoked on cancellation (mutually exclusive with onComplete).
	 * @param {Function} fn
	 * @returns {TweenTimeline} this
	 */
	onCancel(fn) {
		this.#onCancel = fn;
		return this;
	}

	/**
	 * Execute the timeline.
	 * @param {object} [opts]
	 * @param {boolean} [opts.commit]     Default true for GM, false for socket receivers
	 * @param {number}  [opts.startEpochMS]  For socket sync
	 * @param {boolean} [opts.broadcast]  Default game.user.isGM, gates socket emission
	 * @returns {TimelineHandle}
	 */
	run(opts = {}) {
		this.#finalizeCurrentStep();

		const controller = new AbortController();
		const handle = new TimelineHandle(controller);

		// Register named timeline (cancels previous with same name)
		if (this.#name) {
			registerTimeline(this.#name, handle);
		}

		const broadcast = opts.broadcast ?? game.user.isGM;
		const commit = opts.commit ?? game.user.isGM;
		const startEpochMS = opts.startEpochMS ?? Date.now();

		// Broadcast to other clients before local execution
		if (broadcast && this.#name) {
			emitSocket(SOCKET_TYPE_SEQUENCE, {
				name: this.#name,
				data: this.toJSON(),
				startEpochMS,
			});
		}

		// Launch execution (non-blocking — the handle is returned immediately)
		this.#execute(handle, { commit, startEpochMS }).then((completed) => {
			handle._resolve(completed);
			if (completed) {
				this.#onComplete?.();
			} else {
				this.#onCancel?.();
				// Broadcast cancellation if we're the authority
				if (broadcast && this.#name) {
					emitSocket(SOCKET_TYPE_SEQUENCE_CANCEL, { name: this.#name });
				}
			}
		});

		return handle;
	}

	/**
	 * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
	 * @returns {object}
	 */
	toJSON() {
		this.#finalizeCurrentStep();

		const timeline = [];
		for (const segment of this.#segments) {
			if (segment.kind === "delay") {
				timeline.push({ delay: segment.ms });
			} else {
				const stepEntries = segment.data.entries.map((e) => {
					const entry = { type: e.type, params: e.params };
					if (Object.keys(e.opts).length > 0) entry.opts = e.opts;
					if (e.detach) entry.detach = true;
					return entry;
				});
				timeline.push(stepEntries);
			}
		}

		const result = { timeline };
		if (this.#name) result.name = this.#name;
		if (this.#errorPolicy !== ErrorPolicy.ABORT) result.errorPolicy = this.#errorPolicy;
		return result;
	}

	// ── Private ─────────────────────────────────────────────────────────

	#finalizeCurrentStep() {
		if (this.#currentStep) {
			this.#segments.push({ kind: "step", data: this.#currentStep._finalize() });
			this.#currentStep = null;
		}
	}

	/**
	 * Core execution engine. Iterates segments sequentially.
	 * @param {TimelineHandle} handle
	 * @param {{ commit: boolean, startEpochMS: number }} opts
	 * @returns {Promise<boolean>} true if completed, false if cancelled/aborted
	 */
	async #execute(handle, { commit, startEpochMS }) {
		const signal = handle.signal;

		try {
			if (signal.aborted) return false;
			await this.#beforeAll?.();

			let cumulativeOffsetMS = 0;
			const detachedPromises = [];

			for (const segment of this.#segments) {
				if (signal.aborted) return false;

				if (segment.kind === "delay") {
					await cancellableDelay(segment.ms, signal);
					cumulativeOffsetMS += segment.ms;
					continue;
				}

				// Step segment
				const { entries, before, after } = segment.data;

				await before?.();
				if (signal.aborted) return false;

				// Dispatch all entries in this step in parallel
				const stepPromises = [];
				let maxAwaitedDurationMS = 0;

				for (const entry of entries) {
					const tweenDef = getTweenType(entry.type);
					if (!tweenDef) {
						const msg = `TweenTimeline: unknown tween type "${entry.type}"`;
						if (this.#errorPolicy === ErrorPolicy.ABORT) throw new Error(msg);
						console.warn(msg);
						continue;
					}

					const entryOpts = {
						...entry.opts,
						commit,
						startEpochMS: startEpochMS + cumulativeOffsetMS,
					};
					const durationMS = entryOpts.durationMS ?? 2000;

					const promise = tweenDef.execute(entry.params, entryOpts).catch((err) => {
						if (this.#errorPolicy === ErrorPolicy.ABORT) throw err;
						console.warn(`TweenTimeline: entry "${entry.type}" failed:`, err);
						return false;
					});

					if (entry.detach) {
						detachedPromises.push(promise);
					} else {
						stepPromises.push(promise);
						maxAwaitedDurationMS = Math.max(maxAwaitedDurationMS, durationMS);
					}
				}

				// Wait for all non-detached entries
				const results = await Promise.all(stepPromises);

				if (this.#errorPolicy === ErrorPolicy.ABORT && results.some((r) => r === false)) {
					throw new Error("TweenTimeline: a step entry returned false (abort policy).");
				}

				await after?.();
				if (signal.aborted) return false;

				cumulativeOffsetMS += maxAwaitedDurationMS;
			}

			// Wait for any detached tweens still running (for cleanup, not blocking steps)
			await Promise.allSettled(detachedPromises);

			return !signal.aborted;
		} catch (err) {
			if (signal.aborted) return false;
			// Re-throw non-abort errors — they'll be caught by .run()'s .then() as a rejection
			console.error("TweenTimeline execution error:", err);
			return false;
		}
	}
}
