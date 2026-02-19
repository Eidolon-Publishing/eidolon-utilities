import { MODULE_ID } from "../time-triggers/core/constants.js";
import { registerSocketHandler, initializeSocket } from "../common/socket.js";
import { SOCKET_TYPE_TWEEN } from "./core/constants.js";
import { SOCKET_TYPE_SEQUENCE, SOCKET_TYPE_SEQUENCE_CANCEL, ErrorPolicy } from "./core/timeline/constants.js";
import { registerLightColorTween } from "./core/executors/light-color.js";
import { registerLightStateTween } from "./core/executors/light-state.js";
import { registerSequenceTween } from "./core/executors/sequence.js";
import { dispatchTween, handleTweenSocketMessage } from "./core/dispatcher.js";
import { listTweenTypes } from "./core/registry.js";
import { TweenTimeline, cancelTimeline, getTimeline } from "./core/timeline/TweenTimeline.js";
import { compileSequence } from "./core/timeline/schema.js";

// Register tween types synchronously at module load time
registerLightColorTween();
registerLightStateTween();
registerSequenceTween();

// Register socket handlers
registerSocketHandler(SOCKET_TYPE_TWEEN, handleTweenSocketMessage);
registerSocketHandler(SOCKET_TYPE_SEQUENCE, handleSequenceSocketMessage);
registerSocketHandler(SOCKET_TYPE_SEQUENCE_CANCEL, handleSequenceCancelMessage);

/**
 * Handle an incoming sequence socket message (from GM to non-GM clients).
 * Compiles the JSON and runs locally without commit or re-broadcast.
 * @param {object} msg
 */
function handleSequenceSocketMessage(msg) {
	const { data, startEpochMS } = msg ?? {};
	if (!data) {
		console.warn(`[${MODULE_ID}] Received empty tween-sequence socket message.`);
		return;
	}

	try {
		const tl = compileSequence(data);
		tl.run({ commit: false, startEpochMS, broadcast: false });
	} catch (err) {
		console.error(`[${MODULE_ID}] Failed to run received tween sequence:`, err);
	}
}

/**
 * Handle a sequence cancellation message.
 * @param {object} msg
 */
function handleSequenceCancelMessage(msg) {
	const { name } = msg ?? {};
	if (name) {
		cancelTimeline(name);
	}
}

export function registerTweenHooks() {
	Hooks.once("ready", () => {
		// Initialize the shared socket infrastructure
		initializeSocket();

		// Expose the public API on the module
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.tween = {
			dispatch: dispatchTween,
			types: listTweenTypes,
			Timeline: TweenTimeline,
			ErrorPolicy,
			compileSequence,
			cancelTimeline,
			getTimeline,
		};

		console.log(`[${MODULE_ID}] Tween API registered. Types: ${listTweenTypes().join(", ")}`);
	});
}
