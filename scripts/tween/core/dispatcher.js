import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { emitSocket } from "../../common/socket.js";
import { SOCKET_TYPE_TWEEN } from "./constants.js";
import { getTweenType, listTweenTypes } from "./registry.js";

/**
 * Dispatch a tween: validate, broadcast to other clients, and execute locally.
 *
 * @param {string} type        Registered tween type name (e.g. "light-color")
 * @param {object} params      Type-specific parameters (e.g. { uuid, toColor })
 * @param {object} [opts]
 * @param {number} [opts.durationMS=2000]
 * @param {string} [opts.easing="easeInOutCosine"]
 * @param {boolean} [opts.commit=true]  Whether the GM persists the final state
 * @returns {Promise<boolean>} Whether the local animation completed
 */
export async function dispatchTween(type, params, opts = {}) {
	if (!game.user.isGM) {
		ui.notifications.warn("Only the GM can dispatch tweens.");
		return false;
	}

	const tweenDef = getTweenType(type);
	if (!tweenDef) {
		throw new Error(`Unknown tween type: "${type}". Registered types: ${listTweenTypes().join(", ")}`);
	}

	// Validate parameters
	tweenDef.validate(params);

	const { durationMS = 2000, easing = "easeInOutCosine", commit = true } = opts;
	const startEpochMS = Date.now();

	// Broadcast to other clients (they always run with commit: false)
	emitSocket(SOCKET_TYPE_TWEEN, {
		type,
		params,
		durationMS,
		easing,
		startEpochMS,
		commit: false,
	});

	// Execute locally with the caller's commit preference
	return tweenDef.execute(params, { durationMS, easing, commit, startEpochMS });
}

/**
 * Handle an incoming tween socket message (from another client).
 * @param {object} message  The payload from the socket envelope
 */
export function handleTweenSocketMessage(message) {
	const { type, params, durationMS, easing, startEpochMS, commit } = message ?? {};

	const tweenDef = getTweenType(type);
	if (!tweenDef) {
		console.warn(`[${MODULE_ID}] Received unknown tween type over socket: "${type}"`);
		return;
	}

	// Remote clients never commit - the GM handles persistence
	tweenDef.execute(params, {
		durationMS,
		easing,
		commit: commit ?? false,
		startEpochMS,
	});
}
