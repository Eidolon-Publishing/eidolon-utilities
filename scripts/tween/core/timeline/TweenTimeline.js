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
import { EventBus } from "./EventBus.js";
import { createAwaitPromise } from "./await-providers.js";

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
	/** Insert an await segment. */
	await(config) { return this.#timeline.await(config); }
	/** Insert an emit segment. */
	emit(signal) { return this.#timeline.emit(signal); }
	/** Insert a parallel segment. */
	parallel(branchFns, opts) { return this.#timeline.parallel(branchFns, opts); }
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
	/** @type {Array<object>} */
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
	 * Pause execution until an event occurs.
	 * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
	 * @returns {TweenTimeline} this
	 */
	await(config) {
		this.#finalizeCurrentStep();
		this.#segments.push({ kind: "await", config });
		return this;
	}

	/**
	 * Fire a named signal (instant, non-blocking).
	 * @param {string} signal  Signal name
	 * @returns {TweenTimeline} this
	 */
	emit(signal) {
		this.#finalizeCurrentStep();
		this.#segments.push({ kind: "emit", signal });
		return this;
	}

	/**
	 * Fork N branches with a join strategy.
	 * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
	 * @param {object} [opts]
	 * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
	 * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
	 * @returns {TweenTimeline} this
	 */
	parallel(branchFns, opts = {}) {
		this.#finalizeCurrentStep();

		const join = opts.join ?? "all";
		const overflow = opts.overflow ?? "detach";

		// Validate join
		if (join !== "all" && join !== "any" && (typeof join !== "number" || join < 1 || join > branchFns.length)) {
			throw new Error(`parallel: join must be "all", "any", or 1..${branchFns.length}, got ${JSON.stringify(join)}`);
		}
		if (overflow !== "detach" && overflow !== "cancel") {
			throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(overflow)}`);
		}

		// Build each branch by running callback on a sub-timeline, then extracting segments
		const branches = branchFns.map((fn) => {
			const sub = new TweenTimeline();
			fn(sub);
			sub.#finalizeCurrentStep();
			return sub.#segments;
		});

		this.#segments.push({ kind: "parallel", branches, join, overflow });
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

		// Create shared execution context
		const eventBus = new EventBus();
		const ctx = {
			signal: handle.signal,
			commit,
			startEpochMS,
			eventBus,
			errors: [],
			detachedPromises: [],
		};

		// Launch execution (non-blocking — the handle is returned immediately)
		this.#execute(handle, ctx).then((outcome) => {
			eventBus.destroy();
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
	 * Serialize the timeline to a JSON-safe object.
	 * @returns {object}
	 */
	toJSON() {
		this.#finalizeCurrentStep();

		const timeline = TweenTimeline.#serializeSegments(this.#segments);

		const result = { timeline };
		if (this.#name) result.name = this.#name;
		if (this.#errorPolicy !== ErrorPolicy.ABORT) result.errorPolicy = this.#errorPolicy;
		return result;
	}

	/**
	 * Serialize a segment array to JSON-safe format.
	 * @param {Array<object>} segments
	 * @returns {Array}
	 */
	static #serializeSegments(segments) {
		const out = [];
		for (const segment of segments) {
			if (segment.kind === "delay") {
				out.push({ delay: segment.ms });
			} else if (segment.kind === "await") {
				out.push({ await: segment.config });
			} else if (segment.kind === "emit") {
				out.push({ emit: segment.signal });
			} else if (segment.kind === "parallel") {
				out.push({
					parallel: {
						branches: segment.branches.map((b) => TweenTimeline.#serializeSegments(b)),
						join: segment.join,
						overflow: segment.overflow,
					},
				});
			} else {
				// Step segment
				const stepEntries = segment.data.entries.map((e) => {
					const entry = { type: e.type, params: e.params };
					if (Object.keys(e.opts).length > 0) entry.opts = e.opts;
					if (e.detach) entry.detach = true;
					return entry;
				});
				out.push(stepEntries);
			}
		}
		return out;
	}

	// ── Private ─────────────────────────────────────────────────────────

	#finalizeCurrentStep() {
		if (this.#currentStep) {
			this.#segments.push({ kind: "step", data: this.#currentStep._finalize() });
			this.#currentStep = null;
		}
	}

	/**
	 * Drain detached promises fire-and-forget (suppress unhandled rejections).
	 * @param {Promise[]} promises
	 */
	static #drainDetached(promises) {
		if (promises.length === 0) return;
		Promise.allSettled(promises).catch(() => {});
	}

	/**
	 * Core execution engine. Sets up context and delegates to #executeSegments.
	 * @param {TimelineHandle} handle
	 * @param {object} ctx  Shared execution context
	 * @returns {Promise<object>} Timeline outcome
	 */
	async #execute(handle, ctx) {
		try {
			if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);

			const beforeAllFailure = await this.#runHook(this.#beforeAll, TimelineErrorPhase.BEFORE_ALL, null);
			if (beforeAllFailure) {
				if (this.#errorPolicy === ErrorPolicy.ABORT) return beforeAllFailure;
				ctx.errors.push(beforeAllFailure);
			}

			const result = await this.#executeSegments(this.#segments, ctx);
			if (result) {
				// Early termination (cancel or fatal error) — drain detached to prevent unhandled rejections
				TweenTimeline.#drainDetached(ctx.detachedPromises);
				return result;
			}

			// Wait for detached tweens only if we were not cancelled.
			if (!ctx.signal.aborted) {
				const detachedResults = await Promise.allSettled(ctx.detachedPromises);
				for (const dr of detachedResults) {
					if (dr.status === "rejected") {
						const failure = this.#failedOutcome(dr.reason, TimelineErrorPhase.ENTRY);
						if (this.#errorPolicy === ErrorPolicy.ABORT) return failure;
						ctx.errors.push(failure);
					}
				}
			}

			if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);
			return {
				status: TimelineStatus.COMPLETED,
				...(ctx.errors.length > 0 ? { errors: ctx.errors } : {}),
			};
		} catch (err) {
			TweenTimeline.#drainDetached(ctx.detachedPromises);
			if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);
			console.error("TweenTimeline execution error:", err);
			return this.#failedOutcome(err, TimelineErrorPhase.RUNTIME);
		}
	}

	/**
	 * Process a segment array sequentially.
	 * @param {Array<object>} segments
	 * @param {object} ctx  Execution context (signal, commit, startEpochMS, eventBus, errors, detachedPromises)
	 * @returns {Promise<object|null>}  null = success, object = early termination outcome
	 */
	async #executeSegments(segments, ctx) {
		let stepIndex = -1;
		let cumulativeOffsetMS = 0;

		for (const segment of segments) {
			if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);

			if (segment.kind === "delay") {
				try {
					await cancellableDelay(segment.ms, ctx.signal);
				} catch {
					return this.#cancelledOutcome(ctx.signal.reason);
				}
				cumulativeOffsetMS += segment.ms;
				continue;
			}

			if (segment.kind === "await") {
				try {
					let awaitPromise = createAwaitPromise(segment.config, {
						signal: ctx.signal,
						eventBus: ctx.eventBus,
					});
					const timeout = segment.config.timeout;
					if (typeof timeout === "number" && timeout > 0) {
						awaitPromise = Promise.race([
							awaitPromise,
							cancellableDelay(timeout, ctx.signal),
						]);
					}
					await awaitPromise;
				} catch (err) {
					if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);
					const failure = this.#failedOutcome(err, TimelineErrorPhase.AWAIT);
					if (this.#errorPolicy === ErrorPolicy.ABORT) return failure;
					ctx.errors.push(failure);
				}
				continue;
			}

			if (segment.kind === "emit") {
				try {
					ctx.eventBus.emit(segment.signal);
				} catch (err) {
					const failure = this.#failedOutcome(err, TimelineErrorPhase.EMIT);
					if (this.#errorPolicy === ErrorPolicy.ABORT) return failure;
					ctx.errors.push(failure);
				}
				continue;
			}

			if (segment.kind === "parallel") {
				const result = await this.#executeParallel(segment, ctx);
				if (result) return result;
				continue;
			}

			// Step segment
			stepIndex += 1;
			const { entries, before, after } = segment.data;

			const beforeFailure = await this.#runHook(before, TimelineErrorPhase.BEFORE_STEP, stepIndex);
			if (beforeFailure) {
				if (this.#errorPolicy === ErrorPolicy.ABORT) return beforeFailure;
				ctx.errors.push(beforeFailure);
				continue;
			}

			if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);

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
					ctx.errors.push(failure);
					console.warn(failure.error.message);
					continue;
				}

				const entryOpts = {
					...entry.opts,
					commit: ctx.commit,
					startEpochMS: ctx.startEpochMS + cumulativeOffsetMS,
					signal: ctx.signal,
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
					ctx.detachedPromises.push(promise);
				} else {
					stepPromises.push(promise);
					maxAwaitedDurationMS = Math.max(maxAwaitedDurationMS, durationMS);
				}
			}

			// Wait for all non-detached entries
			const results = await this.#waitForStep(stepPromises, ctx.signal);
			if (results === null) return this.#cancelledOutcome(ctx.signal.reason);

			for (const result of results) {
				if (result.ok) continue;
				if (this.#errorPolicy === ErrorPolicy.ABORT) return result.failure;
				ctx.errors.push(result.failure);
				console.warn(`TweenTimeline: entry failed:`, result.failure.error);
			}

			const afterFailure = await this.#runHook(after, TimelineErrorPhase.AFTER_STEP, stepIndex);
			if (afterFailure) {
				if (this.#errorPolicy === ErrorPolicy.ABORT) return afterFailure;
				ctx.errors.push(afterFailure);
			}

			if (ctx.signal.aborted) return this.#cancelledOutcome(ctx.signal.reason);

			cumulativeOffsetMS += maxAwaitedDurationMS;
		}

		return null; // success
	}

	/**
	 * Execute a parallel segment: spawn N branches, join per strategy, handle overflow.
	 * @param {object} segment  { kind: "parallel", branches, join, overflow }
	 * @param {object} ctx  Parent execution context
	 * @returns {Promise<object|null>}  null = success, object = early termination
	 */
	async #executeParallel(segment, ctx) {
		const { branches, join, overflow } = segment;
		const branchCount = branches.length;
		const joinTarget = join === "all" ? branchCount : join === "any" ? 1 : join;

		// Each branch gets its own AbortController linked to the parent signal
		const branchControllers = branches.map(() => {
			const bc = new AbortController();
			if (ctx.signal.aborted) {
				bc.abort(ctx.signal.reason ?? "parent-aborted");
			} else {
				ctx.signal.addEventListener("abort", () => {
					if (!bc.signal.aborted) bc.abort(ctx.signal.reason ?? "parent-aborted");
				}, { once: true });
			}
			return bc;
		});

		// Track branch results
		let completedCount = 0;
		let failedCount = 0;
		const branchResults = new Array(branchCount).fill(null);

		let branchPromises;

		return new Promise((resolveParallel) => {
			let joinResolved = false;

			const checkJoin = () => {
				if (joinResolved) return;

				// Join met?
				if (completedCount >= joinTarget) {
					joinResolved = true;
					applyOverflow();
					resolveParallel(null); // success
					return;
				}

				// Join impossible? (too many failures)
				const remaining = branchCount - completedCount - failedCount;
				if (completedCount + remaining < joinTarget) {
					joinResolved = true;
					applyOverflow();
					// Collect all branch errors
					const branchErrors = branchResults
						.filter((r) => r && r.status === TimelineStatus.FAILED)
						.map((r) => r);
					const failure = this.#failedOutcome(
						new Error(`parallel: join target ${joinTarget} impossible (${completedCount} completed, ${failedCount} failed)`),
						TimelineErrorPhase.PARALLEL
					);
					if (this.#errorPolicy === ErrorPolicy.ABORT) {
						resolveParallel(failure);
					} else {
						ctx.errors.push(failure);
						ctx.errors.push(...branchErrors);
						resolveParallel(null);
					}
				}
			};

			const applyOverflow = () => {
				if (overflow === "cancel") {
					// Abort all un-finished branches
					for (let i = 0; i < branchCount; i++) {
						if (!branchResults[i] && !branchControllers[i].signal.aborted) {
							branchControllers[i].abort("overflow-cancel");
						}
					}
				}
				// "detach" = do nothing, branches keep running
				// But we still need to track them for cleanup
				for (let i = 0; i < branchCount; i++) {
					if (!branchResults[i]) {
						// Still running — push its promise to detached
						ctx.detachedPromises.push(branchPromises[i]);
					}
				}
			};

			// Launch all branches
			branchPromises = branches.map((branchSegments, i) => {
				// Create a branch-local context sharing eventBus and errors but with own signal
				const branchCtx = {
					signal: branchControllers[i].signal,
					commit: ctx.commit,
					startEpochMS: ctx.startEpochMS,
					eventBus: ctx.eventBus, // shared
					errors: ctx.errors, // shared
					detachedPromises: ctx.detachedPromises, // shared
				};

				return this.#executeSegments(branchSegments, branchCtx).then((result) => {
					if (result) {
						// Early termination in branch
						if (result.status === TimelineStatus.CANCELLED) {
							// Don't count aborted-by-overflow as failure
							if (branchControllers[i].signal.aborted) {
								branchResults[i] = result;
								return;
							}
							// Parent was cancelled — propagate
							branchResults[i] = result;
							failedCount++;
						} else {
							branchResults[i] = result;
							failedCount++;
						}
					} else {
						branchResults[i] = { status: TimelineStatus.COMPLETED };
						completedCount++;
					}
					checkJoin();
				});
			});

			// If parent signal aborts, resolve immediately
			if (ctx.signal.aborted) {
				joinResolved = true;
				resolveParallel(this.#cancelledOutcome(ctx.signal.reason));
				return;
			}
			ctx.signal.addEventListener("abort", () => {
				if (!joinResolved) {
					joinResolved = true;
					resolveParallel(this.#cancelledOutcome(ctx.signal.reason));
				}
			}, { once: true });
		});
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
