import { MODULE_ID } from "../time-triggers/core/constants.js";

const handlers = new Map();
let initialized = false;

/**
 * Register a handler for a socket message type.
 * @param {string} type  Message type key (e.g. "tween")
 * @param {(payload: object) => void} handler
 */
export function registerSocketHandler(type, handler) {
	if (handlers.has(type)) {
		console.warn(`[${MODULE_ID}] Socket handler for type "${type}" already registered, overwriting.`);
	}
	handlers.set(type, handler);
}

/**
 * Emit a message to all other connected clients.
 * @param {string} type  Message type key
 * @param {object} payload
 */
export function emitSocket(type, payload) {
	if (!initialized) {
		console.error(`[${MODULE_ID}] Socket not initialized. Call initializeSocket() first.`);
		return;
	}
	game.socket.emit(`module.${MODULE_ID}`, { type, payload });
}

/**
 * Bind the socket listener. Call once on `ready`.
 */
export function initializeSocket() {
	if (initialized) return;

	game.socket.on(`module.${MODULE_ID}`, (message) => {
		const { type, payload } = message ?? {};
		const handler = handlers.get(type);
		if (handler) {
			handler(payload);
		} else {
			console.warn(`[${MODULE_ID}] No socket handler for type "${type}"`);
		}
	});

	initialized = true;
	console.log(`[${MODULE_ID}] Socket initialized on channel module.${MODULE_ID}`);
}
