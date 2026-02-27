/**
 * Canvas click-to-select mode for the placeable picker.
 *
 * Temporarily intercepts placeable control events so the user can
 * click a tile (or other placeable) on the canvas to select it.
 */

import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { addHighlight, removeHighlight } from "../core/canvas-highlight.js";

/** Currently active pick session, or null. */
let activeSession = null;

/**
 * Enter pick mode — clicks on placeables call the callback.
 *
 * @param {{ placeableType?: string, onPick: (doc: object) => void, onCancel?: () => void }} options
 * @returns {{ cancel: () => void }}
 */
export function enterPickMode(options) {
	// Cancel any existing session
	if (activeSession) {
		activeSession.cancel();
	}

	const { placeableType = "Tile", onPick, onCancel } = options;

	let hoveredPlaceable = null;

	// Hook name depends on placeable type
	const controlHook = `control${placeableType}`;
	const hoverHook = `hover${placeableType}`;

	/**
	 * Handle placeable control (click) — intercept and call onPick.
	 */
	const onControl = (placeable, controlled) => {
		if (!controlled) return; // Only care about "controlled" (clicked)
		const doc = placeable.document ?? placeable;

		// Deselect the placeable to avoid it staying "controlled"
		placeable.release?.();

		onPick(doc);
	};

	/**
	 * Handle hover in — add temporary highlight.
	 */
	const onHoverIn = (placeable, hovered) => {
		if (hovered) {
			hoveredPlaceable = placeable;
			addHighlight(placeable, { mode: "pick" });
		} else {
			if (hoveredPlaceable === placeable) {
				removeHighlight(placeable);
				hoveredPlaceable = null;
			}
		}
	};

	/**
	 * ESC key handler to cancel pick mode.
	 */
	const onKeydown = (e) => {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			cancel();
		}
	};

	/**
	 * Right-click handler to cancel pick mode.
	 */
	const onContextMenu = (e) => {
		e.preventDefault();
		cancel();
	};

	// Register hooks
	const controlHookId = Hooks.on(controlHook, onControl);
	const hoverHookId = Hooks.on(hoverHook, onHoverIn);

	// Register keyboard/mouse handlers
	document.addEventListener("keydown", onKeydown, { capture: true });
	canvas.stage?.addEventListener("rightclick", onContextMenu);

	// Show status notification
	ui.notifications?.info?.(`Pick mode active — click a ${placeableType.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: false });

	/**
	 * Cancel pick mode and clean up.
	 */
	function cancel() {
		if (!activeSession) return;
		activeSession = null;

		// Remove hooks
		Hooks.off(controlHook, controlHookId);
		Hooks.off(hoverHook, hoverHookId);

		// Remove listeners
		document.removeEventListener("keydown", onKeydown, { capture: true });
		canvas.stage?.removeEventListener("rightclick", onContextMenu);

		// Clean up hover highlight
		if (hoveredPlaceable) {
			removeHighlight(hoveredPlaceable);
			hoveredPlaceable = null;
		}

		onCancel?.();
	}

	activeSession = { cancel };
	return { cancel };
}

/**
 * Check if pick mode is currently active.
 * @returns {boolean}
 */
export function isPickModeActive() {
	return activeSession !== null;
}

/**
 * Cancel any active pick mode.
 */
export function cancelPickMode() {
	if (activeSession) activeSession.cancel();
}
