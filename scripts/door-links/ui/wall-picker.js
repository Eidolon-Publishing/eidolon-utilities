/**
 * Wall pick mode — click walls on the canvas to add them as links.
 *
 * Adapted from the placeable-picker's pick-mode.js but specialized for walls.
 * Walls don't have the standard hover/control hooks, so we use the walls layer
 * directly and listen for pointer events on wall placeables.
 */

import { highlightWall, removeWallHighlight } from "./wall-highlight.js";

/** Currently active wall pick session, or null. */
let activeSession = null;

/**
 * Enter wall pick mode — clicks on walls call the callback.
 *
 * @param {{ onPick: (wallDoc: object) => void, onCancel?: () => void, excludeIds?: Set<string>, getExcludeIds?: () => Set<string> }} options
 * @returns {{ cancel: () => void }}
 */
export function enterWallPickMode(options) {
	if (activeSession) {
		activeSession.cancel();
	}

	const { onPick, onUnpick, onCancel, excludeIds, getExcludeIds, sourceDoorId } = options;
	let hoveredWall = null;

	// Switch to the walls layer so the user can interact with walls
	canvas.walls?.activate();

	// Release any already-controlled walls so clicking them fires the controlWall hook
	for (const wall of (canvas.walls?.controlled ?? [])) {
		wall.release?.();
	}

	/**
	 * Handle wall control (click).
	 */
	const onControl = (wallPlaceable, controlled) => {
		if (!controlled) return;

		const doc = wallPlaceable.document ?? wallPlaceable;

		// Don't pick the source door itself
		if (sourceDoorId && doc.id === sourceDoorId) {
			ui.notifications?.warn("Cannot link a door to itself.");
			return;
		}

		// Don't pick walls already linked — re-read each time to catch walls added during this session
		const currentExcluded = getExcludeIds ? getExcludeIds() : (excludeIds ?? new Set());
		if (currentExcluded.has(doc.id)) {
			wallPlaceable.release?.();
			onUnpick?.(doc);
			return;
		}

		wallPlaceable.release?.();
		onPick(doc);
	};

	/**
	 * Handle hover.
	 */
	const onHover = (wallPlaceable, hovered) => {
		if (hovered) {
			hoveredWall = wallPlaceable;
			highlightWall(wallPlaceable, { color: 0x00FF88, alpha: 0.7, width: 4, pulse: false });
		} else if (hoveredWall === wallPlaceable) {
			removeWallHighlight(wallPlaceable);
			hoveredWall = null;
		}
	};

	/**
	 * ESC to cancel.
	 */
	const onKeydown = (e) => {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			cancel();
		}
	};

	/**
	 * Right-click to cancel.
	 */
	const onContextMenu = (e) => {
		e.preventDefault();
		cancel();
	};

	// Register Foundry hooks for walls
	const controlHookId = Hooks.on("controlWall", onControl);
	const hoverHookId = Hooks.on("hoverWall", onHover);

	// Register keyboard/mouse handlers
	document.addEventListener("keydown", onKeydown, { capture: true });
	canvas.stage?.addEventListener("rightclick", onContextMenu);

	ui.notifications?.info("Pick mode active — click a wall segment on the canvas, or press ESC to cancel.", { permanent: false });

	function cancel() {
		if (!activeSession) return;
		activeSession = null;

		Hooks.off("controlWall", controlHookId);
		Hooks.off("hoverWall", hoverHookId);

		document.removeEventListener("keydown", onKeydown, { capture: true });
		canvas.stage?.removeEventListener("rightclick", onContextMenu);

		if (hoveredWall) {
			removeWallHighlight(hoveredWall);
			hoveredWall = null;
		}

		onCancel?.();
	}

	activeSession = { cancel };
	return { cancel };
}

/**
 * Cancel any active wall pick session.
 */
export function cancelWallPickMode() {
	if (activeSession) activeSession.cancel();
}
