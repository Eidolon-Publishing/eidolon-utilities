import { getTweenType } from "../registry.js";
import { emitSocket } from "../../../common/socket.js";
import {
	ErrorPolicy,
	SOCKET_TYPE_SEQUENCE,
	SOCKET_TYPE_SEQUENCE_CANCEL,
	TimelineStatus,
	TimelineErrorPhase,
} from "./constants.js";
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
		existing.cancel("replaced-by-name");
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
		handle.cancel("cancelled-by-name");
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
	/** Register onError callback. */
	onError(fn) { return this.#timeline.onError(fn); }
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
	/** @type {Function|null} */
	#onError = null;

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
	 * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
	 * @param {(outcome: object) => void} fn
	 * @returns {TweenTimeline} this
	 */
	onError(fn) {
		this.#onError = fn;
		return this;
	}

	/**
	 * Execute the timeline.
	 * @param {object} [opts]
	 * @param {boolean} [opts.commit]     Default true for GM, false for socket receivers
	 * @param {number}  [opts.startEpochMS]  For socket sync
	 * @param {boolean} [opts.broadcast]  Default game.user.isGM, gates socket emission
	 * @param {AbortSignal} [opts.signal] Parent signal for nested timeline cancellation
	 * @returns {TimelineHandle}
	 */
	run(opts = {}) {
		this.#finalizeCurrentStep();

		const controller = new AbortController();
		if (opts.signal) {
			if (opts.signal.aborted) {
				controller.abort(opts.signal.reason ?? "parent-aborted");
			} else {
				opts.signal.addEventListener("abort", () => {
					if (!controller.signal.aborted) controller.abort(opts.signal.reason ?? "parent-aborted");
				}, { once: true });
			}
		}
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
		this.#execute(handle, { commit, startEpochMS }).then((outcome) => {
			handle._resolve(outcome);
			if (outcome.status === TimelineStatus.COMPLETED) {
				this.#onComplete?.();
			} else if (outcome.status === TimelineStatus.CANCELLED) {
				this.#onCancel?.();
				// Broadcast cancellation if we're the authority
				if (broadcast && this.#name) {
					emitSocket(SOCKET_TYPE_SEQUENCE_CANCEL, {
						name: this.#name,
						reason: outcome.reason,
					});
				}
			} else {
				this.#onError?.(outcome);
				if (broadcast && this.#name) {
					emitSocket(SOCKET_TYPE_SEQUENCE_CANCEL, {
						name: this.#name,
						reason: "failed",
					});
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
	 * @returns {Promise<object>} Timeline outcome
	 */
	async #execute(handle, { commit, startEpochMS }) {
		const signal = handle.signal;
		const errors = [];
		let stepIndex = -1;

		try {
			if (signal.aborted) return this.#cancelledOutcome(signal.reason);

			const beforeAllFailure = await this.#runHook(this.#beforeAll, TimelineErrorPhase.BEFORE_ALL, null);
			if (beforeAllFailure) {
				if (this.#errorPolicy === ErrorPolicy.ABORT) return beforeAllFailure;
				errors.push(beforeAllFailure);
			}

			let cumulativeOffsetMS = 0;
			const detachedPromises = [];

			for (const segment of this.#segments) {
				if (signal.aborted) return this.#cancelledOutcome(signal.reason);

				if (segment.kind === "delay") {
					try {
						await cancellableDelay(segment.ms, signal);
					} catch {
						return this.#cancelledOutcome(signal.reason);
					}
					cumulativeOffsetMS += segment.ms;
					continue;
				}

				stepIndex += 1;

				// Step segment
				const { entries, before, after } = segment.data;

				const beforeFailure = await this.#runHook(before, TimelineErrorPhase.BEFORE_STEP, stepIndex);
				if (beforeFailure) {
					if (this.#errorPolicy === ErrorPolicy.ABORT) return beforeFailure;
					errors.push(beforeFailure);
					continue;
				}

				if (signal.aborted) return this.#cancelledOutcome(signal.reason);

				// Dispatch all entries in this step in parallel
				const stepPromises = [];
				let maxAwaitedDurationMS = 0;

				for (const entry of entries) {
					const tweenDef = getTweenType(entry.type);
					if (!tweenDef) {
						const failure = this.#failedOutcome(
							new Error(`TweenTimeline: unknown tween type "${entry.type}"`),
							TimelineErrorPhase.ENTRY,
							stepIndex,
							entry.type
						);
						if (this.#errorPolicy === ErrorPolicy.ABORT) return failure;
						errors.push(failure);
						console.warn(failure.error.message);
						continue;
					}

					const entryOpts = {
						...entry.opts,
						commit,
						startEpochMS: startEpochMS + cumulativeOffsetMS,
						signal,
					};
					const durationMS = entryOpts.durationMS ?? 2000;

					const promise = Promise.resolve()
						.then(() => tweenDef.execute(entry.params, entryOpts))
						.then((result) => {
							if (result === false) {
								return {
									ok: false,
									failure: this.#failedOutcome(
										new Error("Tween entry returned false."),
										TimelineErrorPhase.ENTRY,
										stepIndex,
										entry.type
									),
								};
							}
							return { ok: true };
						})
						.catch((err) => ({
							ok: false,
							failure: this.#failedOutcome(err, TimelineErrorPhase.ENTRY, stepIndex, entry.type),
						}));

					if (entry.detach) {
						detachedPromises.push(promise);
					} else {
						stepPromises.push(promise);
						maxAwaitedDurationMS = Math.max(maxAwaitedDurationMS, durationMS);
					}
				}

				// Wait for all non-detached entries; abort does not block here.
				const results = await this.#waitForStep(stepPromises, signal);
				if (results === null) return this.#cancelledOutcome(signal.reason);

				for (const result of results) {
					if (result.ok) continue;
					if (this.#errorPolicy === ErrorPolicy.ABORT) return result.failure;
					errors.push(result.failure);
					console.warn(`TweenTimeline: entry failed:`, result.failure.error);
				}

				const afterFailure = await this.#runHook(after, TimelineErrorPhase.AFTER_STEP, stepIndex);
				if (afterFailure) {
					if (this.#errorPolicy === ErrorPolicy.ABORT) return afterFailure;
					errors.push(afterFailure);
				}

				if (signal.aborted) return this.#cancelledOutcome(signal.reason);

				cumulativeOffsetMS += maxAwaitedDurationMS;
			}

			// Wait for detached tweens only if we were not cancelled.
			if (!signal.aborted) {
				const detachedResults = await Promise.allSettled(detachedPromises);
				for (const result of detachedResults) {
					if (result.status === "rejected") {
						const failure = this.#failedOutcome(result.reason, TimelineErrorPhase.ENTRY, stepIndex);
						if (this.#errorPolicy === ErrorPolicy.ABORT) return failure;
						errors.push(failure);
					}
				}
			}

			if (signal.aborted) return this.#cancelledOutcome(signal.reason);
			return {
				status: TimelineStatus.COMPLETED,
				...(errors.length > 0 ? { errors } : {}),
			};
		} catch (err) {
			if (signal.aborted) return this.#cancelledOutcome(signal.reason);
			console.error("TweenTimeline execution error:", err);
			return this.#failedOutcome(err, TimelineErrorPhase.RUNTIME, stepIndex);
		}
	}

	/**
	 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
	 * @param {AbortSignal} signal
	 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
	 */
	#waitForStep(stepPromises, signal) {
		if (stepPromises.length === 0) return Promise.resolve([]);
		if (signal.aborted) return Promise.resolve(null);

		return new Promise((resolve, reject) => {
			const onAbort = () => resolve(null);
			signal.addEventListener("abort", onAbort, { once: true });

			Promise.all(stepPromises)
				.then((results) => {
					signal.removeEventListener("abort", onAbort);
					resolve(results);
				})
				.catch((err) => {
					signal.removeEventListener("abort", onAbort);
					reject(err);
				});
		});
	}

	/**
	 * @param {Function|null} hook
	 * @param {string} phase
	 * @param {number|null} stepIndex
	 * @returns {Promise<object|null>}
	 */
	async #runHook(hook, phase, stepIndex) {
		if (!hook) return null;
		try {
			await hook();
			return null;
		} catch (err) {
			const failure = this.#failedOutcome(err, phase, stepIndex ?? undefined);
			if (this.#errorPolicy === ErrorPolicy.CONTINUE) {
				console.warn(`TweenTimeline: hook failure in ${phase}:`, err);
			}
			return failure;
		}
	}

	/** @param {unknown} reason */
	#cancelledOutcome(reason) {
		let normalized;
		if (typeof reason === "string") normalized = reason;
		else if (reason instanceof Error) normalized = reason.message;
		return {
			status: TimelineStatus.CANCELLED,
			...(normalized ? { reason: normalized } : {}),
		};
	}

	/**
	 * @param {unknown} err
	 * @param {string} phase
	 * @param {number} [stepIndex]
	 * @param {string} [entryType]
	 */
	#failedOutcome(err, phase, stepIndex, entryType) {
		const error = err instanceof Error ? err : new Error(String(err));
		return {
			status: TimelineStatus.FAILED,
			error,
			phase,
			...(typeof stepIndex === "number" ? { stepIndex } : {}),
			...(entryType ? { entryType } : {}),
		};
	}
}
