/**
 * Canvas-to-screen coordinate conversion and zoom utilities.
 */

/**
 * Convert a canvas-space point to screen-space (CSS pixels).
 * Uses the stage world transform directly — avoids PIXI Point allocation.
 *
 * @param {{ x: number, y: number }} point
 * @returns {{ x: number, y: number }}
 */
export function canvasToScreen(point) {
	const t = canvas.stage.worldTransform;
	// worldTransform gives coordinates relative to the PIXI renderer canvas,
	// not the viewport. Account for #board offset (sidebar, toolbars, etc.).
	const board = document.getElementById("board");
	const boardRect = board?.getBoundingClientRect();
	const ox = boardRect?.left ?? 0;
	const oy = boardRect?.top ?? 0;
	return {
		x: t.a * point.x + t.c * point.y + t.tx + ox,
		y: t.b * point.x + t.d * point.y + t.ty + oy,
	};
}

/**
 * Get the current canvas zoom level.
 *
 * @returns {number}
 */
export function getZoom() {
	return canvas.stage?.scale?.x ?? 1;
}

/**
 * Resolve a size value from the given sizeUnit to canvas pixels.
 *
 * - "grid": value × grid.size
 * - "canvas": raw canvas pixels (identity)
 * - "screen": not resolved here — handled by the popup (no scale transform)
 *
 * @param {number} value
 * @param {"grid" | "canvas" | "screen"} unit
 * @returns {number}
 */
export function resolveUnit(value, unit) {
	if (unit === "grid") return value * (canvas.grid?.size ?? 100);
	return value; // "canvas" and "screen" pass through
}
