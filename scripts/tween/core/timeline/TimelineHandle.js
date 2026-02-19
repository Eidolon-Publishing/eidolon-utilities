/**
 * Handle returned by TweenTimeline.run(). Wraps an AbortController
 * and a completion promise for external cancellation and await.
 */
export class TimelineHandle {
	#controller;
	#resolve;
	#finished;

	/**
	 * @param {AbortController} controller
	 */
	constructor(controller) {
		this.#controller = controller;
		this.#finished = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}

	/** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled). */
	get finished() {
		return this.#finished;
	}

	/** @returns {boolean} */
	get cancelled() {
		return this.#controller.signal.aborted;
	}

	/** @returns {AbortSignal} */
	get signal() {
		return this.#controller.signal;
	}

	/** Abort the timeline, triggering onCancel callbacks. */
	cancel() {
		if (!this.#controller.signal.aborted) {
			this.#controller.abort();
		}
	}

	/**
	 * Called internally by the execution engine when the timeline finishes.
	 * @param {boolean} completed - true if all steps ran, false if cancelled
	 */
	_resolve(completed) {
		this.#resolve(completed);
	}
}
