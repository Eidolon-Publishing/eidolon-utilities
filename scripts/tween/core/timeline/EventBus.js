/**
 * Scoped pub/sub event bus for intra-timeline signaling.
 * Created once per timeline run(), shared across all branches.
 */
export class EventBus {
	/** @type {Map<string, Set<Function>>} */
	#listeners = new Map();
	/** @type {Set<string>} Signals that have been emitted (sticky) */
	#emitted = new Set();
	#destroyed = false;

	/**
	 * Subscribe to a named signal.
	 * @param {string} signal
	 * @param {Function} listener
	 * @returns {() => void} Unsubscribe function
	 */
	on(signal, listener) {
		if (this.#destroyed) return () => {};
		let set = this.#listeners.get(signal);
		if (!set) {
			set = new Set();
			this.#listeners.set(signal, set);
		}
		set.add(listener);
		return () => set.delete(listener);
	}

	/**
	 * Fire a named signal synchronously. All registered listeners are invoked.
	 * The signal is recorded so that future waitFor() calls resolve immediately.
	 * @param {string} signal
	 */
	emit(signal) {
		if (this.#destroyed) return;
		this.#emitted.add(signal);
		const set = this.#listeners.get(signal);
		if (!set) return;
		for (const listener of set) {
			listener();
		}
	}

	/**
	 * Returns a promise that resolves when the signal fires, or rejects
	 * if the abort signal fires first.
	 * @param {string} signal
	 * @param {AbortSignal} [abortSignal]
	 * @returns {Promise<void>}
	 */
	waitFor(signal, abortSignal) {
		if (this.#destroyed) return Promise.reject(new Error("EventBus destroyed"));
		if (this.#emitted.has(signal)) return Promise.resolve();

		return new Promise((resolve, reject) => {
			if (abortSignal?.aborted) {
				return reject(abortSignal.reason ?? "aborted");
			}

			const unsub = this.on(signal, () => {
				unsub();
				onAbort && abortSignal?.removeEventListener("abort", onAbort);
				resolve();
			});

			let onAbort;
			if (abortSignal) {
				onAbort = () => {
					unsub();
					reject(abortSignal.reason ?? "aborted");
				};
				abortSignal.addEventListener("abort", onAbort, { once: true });
			}
		});
	}

	/**
	 * Tear down the bus, clearing all listeners.
	 */
	destroy() {
		this.#destroyed = true;
		this.#listeners.clear();
		this.#emitted.clear();
	}
}
