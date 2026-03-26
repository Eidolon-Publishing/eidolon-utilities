import { touchesTokenOccluderState } from "./core/flag-utils.js";
import {
	debugSelectedTokenOccluders,
	evaluateTokenOcclusion,
	getOriginalTokenVisibility,
	getTokenOccluderDebugState,
	inspectWallIntersection,
	patchTokenVisibilityGetter,
	refreshTokenOccluders,
	setTokenOccluderDebug,
} from "./core/runtime.js";
import { renderTokenOccluderWallConfig } from "./ui/wall-config.js";

const MODULE_ID = "eidolon-utilities";
let tokenOccluderHooksRegistered = false;

function onCanvasReady() {
	patchTokenVisibilityGetter();
	refreshTokenOccluders();
}

function onWallMutation(wallDoc, changes = null) {
	if (!canvas?.ready) return;
	if (wallDoc?.parent?.id !== canvas.scene?.id) return;
	if (changes && !touchesTokenOccluderState(changes)) return;
	refreshTokenOccluders();
}

function onRenderWallConfig(app, html) {
	renderTokenOccluderWallConfig(app, html);
}

function registerApi() {
	const mod = game.modules.get(MODULE_ID);
	if (!mod) return;
	if (!mod.api) mod.api = {};
	mod.api.tokenOccluders = {
		refresh: refreshTokenOccluders,
		setDebug: setTokenOccluderDebug,
		getDebugState: getTokenOccluderDebugState,
		debugSelection: debugSelectedTokenOccluders,
		evaluateToken: (token) => evaluateTokenOcclusion(resolveToken(token)),
		inspectWallIntersection: (wall, source, target) => inspectWallIntersection(resolveWall(wall), source, target),
		getOriginalVisibility: (token) => getOriginalTokenVisibility(resolveToken(token)),
	};
}

export function registerTokenOccluderHooks() {
	if (tokenOccluderHooksRegistered) return;
	tokenOccluderHooksRegistered = true;

	Hooks.on("canvasReady", onCanvasReady);
	Hooks.on("renderWallConfig", onRenderWallConfig);
	Hooks.on("createWall", (wallDoc) => onWallMutation(wallDoc));
	Hooks.on("deleteWall", (wallDoc) => onWallMutation(wallDoc));
	Hooks.on("updateWall", onWallMutation);
	Hooks.once("ready", () => {
		patchTokenVisibilityGetter();
		registerApi();
	});

	if (game.ready) {
		patchTokenVisibilityGetter();
		registerApi();
	}
}

function resolveToken(tokenRef) {
	if (!tokenRef) return null;
	if (tokenRef.document) return tokenRef;
	return canvas?.tokens?.get?.(tokenRef) ?? canvas?.tokens?.placeables?.find((token) => token.document?.id === tokenRef) ?? null;
}

function resolveWall(wallRef) {
	if (!wallRef) return null;
	if (wallRef.document) return wallRef;
	return canvas?.walls?.get?.(wallRef) ?? canvas?.walls?.placeables?.find((wall) => wall.document?.id === wallRef) ?? null;
}
