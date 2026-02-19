/**
 * Handle returned by TweenTimeline.run(). Wraps an AbortController
 * and a completion promise for external cancellation and await.
 */
export class TimelineHandle {
	#controller;
	#resolveFinished;
	#resolveResult;
	#finished;
	#result;
	#settled = false;
	#outcome = null;

	/**
	 * @param {AbortController} controller
	 */
	constructor(controller) {
		this.#controller = controller;
		this.#finished = new Promise((resolve) => {
			this.#resolveFinished = resolve;
		});
		this.#result = new Promise((resolve) => {
			this.#resolveResult = resolve;
		});
	}

	/** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
	get finished() {
		return this.#finished;
	}

	/** @returns {Promise<{status: string, [k: string]: unknown}>} */
	get result() {
		return this.#result;
	}

	/** @returns {boolean} */
	get cancelled() {
		return this.#controller.signal.aborted;
	}

	/** @returns {AbortSignal} */
	get signal() {
		return this.#controller.signal;
	}

	/** @returns {string} */
	get status() {
		if (this.#outcome) return this.#outcome.status;
		return this.cancelled ? "cancelled" : "running";
	}

	/** Abort the timeline, triggering onCancel callbacks. */
	cancel(reason = "cancelled") {
		if (!this.#controller.signal.aborted) {
			this.#controller.abort(reason);
		}
	}

	/**
	 * Called internally by the execution engine when the timeline finishes.
	 * @param {boolean} completed - true if all steps ran, false if cancelled
	 */
	_resolve(outcomeOrCompleted) {
		if (this.#settled) return;
		this.#settled = true;

		const outcome =
			typeof outcomeOrCompleted === "boolean"
				? { status: outcomeOrCompleted ? "completed" : "cancelled" }
				: (outcomeOrCompleted ?? { status: "cancelled" });

		this.#outcome = outcome;
		this.#resolveFinished(outcome.status === "completed");
		this.#resolveResult(outcome);
	}
}
