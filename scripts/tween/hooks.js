import { MODULE_ID } from "../time-triggers/core/constants.js";
import { registerSocketHandler, initializeSocket } from "../common/socket.js";
import { SOCKET_TYPE_TWEEN } from "./core/constants.js";
import { registerLightColorTween } from "./core/executors/light-color.js";
import { registerLightStateTween } from "./core/executors/light-state.js";
import { dispatchTween, handleTweenSocketMessage } from "./core/dispatcher.js";
import { listTweenTypes } from "./core/registry.js";

// Register tween types synchronously at module load time
registerLightColorTween();
registerLightStateTween();

// Register the socket handler for tween messages
registerSocketHandler(SOCKET_TYPE_TWEEN, handleTweenSocketMessage);

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
		};

		console.log(`[${MODULE_ID}] Tween API registered. Types: ${listTweenTypes().join(", ")}`);
	});
}
