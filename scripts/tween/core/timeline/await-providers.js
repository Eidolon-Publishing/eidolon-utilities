/**
 * Extensible provider registry for await event types.
 *
 * Each provider is a function that receives a config object and a context,
 * and returns a Promise that resolves when the event occurs.
 *
 * Context: { signal: AbortSignal, eventBus: EventBus }
 */

/** @type {Map<string, (config: object, ctx: object) => Promise<void>>} */
const providers = new Map();

/**
 * Register an await event provider.
 * @param {string} eventName  The event type string (e.g. "signal", "click", "keypress")
 * @param {(config: object, ctx: { signal: AbortSignal, eventBus: import("./EventBus.js").EventBus }) => Promise<void>} handler
 */
export function registerAwaitProvider(eventName, handler) {
	providers.set(eventName, handler);
}

/**
 * Create a promise for an await config using the registered provider.
 * @param {object} config  The await config (e.g. { event: "click" } or { event: "signal", name: "fog-done" })
 * @param {{ signal: AbortSignal, eventBus: import("./EventBus.js").EventBus }} ctx
 * @returns {Promise<void>}
 */
export function createAwaitPromise(config, ctx) {
	const handler = providers.get(config.event);
	if (!handler) {
		return Promise.reject(new Error(`Unknown await event type: "${config.event}"`));
	}
	return handler(config, ctx);
}

// ── Built-in providers ──────────────────────────────────────────────────

// Signal — resolves when a named signal is emitted on the EventBus
registerAwaitProvider("signal", (config, ctx) => {
	if (!config.name) return Promise.reject(new Error('await signal: "name" is required'));
	return ctx.eventBus.waitFor(config.name, ctx.signal);
});

// Click — resolves on any document click (or specified selector)
registerAwaitProvider("click", (_config, ctx) => {
	return new Promise((resolve, reject) => {
		if (ctx.signal.aborted) return reject(ctx.signal.reason ?? "aborted");

		const onClick = () => {
			cleanup();
			resolve();
		};

		const onAbort = () => {
			cleanup();
			reject(ctx.signal.reason ?? "aborted");
		};

		const cleanup = () => {
			document.removeEventListener("click", onClick);
			ctx.signal.removeEventListener("abort", onAbort);
		};

		document.addEventListener("click", onClick, { once: true });
		ctx.signal.addEventListener("abort", onAbort, { once: true });
	});
});

// Keypress — resolves on a keypress event, optionally filtered by key name
registerAwaitProvider("keypress", (config, ctx) => {
	return new Promise((resolve, reject) => {
		if (ctx.signal.aborted) return reject(ctx.signal.reason ?? "aborted");

		const onKey = (e) => {
			if (config.key && e.key !== config.key) return;
			cleanup();
			resolve();
		};

		const onAbort = () => {
			cleanup();
			reject(ctx.signal.reason ?? "aborted");
		};

		const cleanup = () => {
			document.removeEventListener("keydown", onKey);
			ctx.signal.removeEventListener("abort", onAbort);
		};

		document.addEventListener("keydown", onKey);
		ctx.signal.addEventListener("abort", onAbort, { once: true });
	});
});
