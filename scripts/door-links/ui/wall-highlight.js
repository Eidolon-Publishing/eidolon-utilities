/**
 * Wall highlight utilities — adds/removes visual highlights on wall segments.
 *
 * Walls are PIXI.Graphics lines, not sprites. This draws a thickened colored
 * line along the wall's coordinates as a child of the wall's PIXI container.
 */

/** WeakMap: wallPlaceable → { gfx, pulseData } */
const wallHighlightMap = new WeakMap();

/** All active wall pulse tickers for bulk cleanup. */
const activeWallPulses = new Set();

/**
 * Add a highlight to a wall placeable.
 *
 * @param {object} wallPlaceable  The Wall placeable object on the canvas
 * @param {{ color?: number, alpha?: number, width?: number, pulse?: boolean }} [options]
 * @returns {boolean}
 */
export function highlightWall(wallPlaceable, options = {}) {
	if (!wallPlaceable?.document) return false;

	// Remove existing highlight first
	removeWallHighlight(wallPlaceable);

	const color = options.color ?? 0xFF6B2B;
	const alpha = options.alpha ?? 0.85;
	const lineWidth = options.width ?? 3;
	const pulse = options.pulse ?? true;

	const [x1, y1, x2, y2] = wallPlaceable.document.c;
	const lx = x1 - wallPlaceable.x;
	const ly = y1 - wallPlaceable.y;
	const lx2 = x2 - wallPlaceable.x;
	const ly2 = y2 - wallPlaceable.y;

	const gfx = new PIXI.Graphics();

	// Outer glow layers — progressively wider and more transparent
	const glowLayers = [
		{ w: lineWidth + 24, a: alpha * 0.08 },
		{ w: lineWidth + 18, a: alpha * 0.14 },
		{ w: lineWidth + 12, a: alpha * 0.25 },
		{ w: lineWidth + 6, a: alpha * 0.4 },
	];
	for (const layer of glowLayers) {
		gfx.lineStyle(layer.w, color, layer.a);
		gfx.moveTo(lx, ly);
		gfx.lineTo(lx2, ly2);
	}

	// Core line
	gfx.lineStyle(lineWidth, color, alpha);
	gfx.moveTo(lx, ly);
	gfx.lineTo(lx2, ly2);

	gfx.name = "eidolonDoorLinkHighlight";

	wallPlaceable.addChild(gfx);

	const entry = { gfx, pulseData: null };

	// Optional pulse animation
	if (pulse && canvas.app?.ticker) {
		const pulseData = {
			elapsed: 0,
			fn: (dt) => {
				pulseData.elapsed += dt;
				const t = (Math.sin(pulseData.elapsed * 0.05) + 1) / 2;
				gfx.alpha = alpha * (0.4 + 0.6 * t);
			},
		};
		canvas.app.ticker.add(pulseData.fn);
		entry.pulseData = pulseData;
		activeWallPulses.add(pulseData);
	}

	wallHighlightMap.set(wallPlaceable, entry);
	return true;
}

/**
 * Remove highlight from a wall placeable.
 *
 * @param {object} wallPlaceable
 */
export function removeWallHighlight(wallPlaceable) {
	if (!wallPlaceable) return;

	const entry = wallHighlightMap.get(wallPlaceable);
	if (!entry) return;

	if (entry.pulseData) {
		canvas.app?.ticker?.remove(entry.pulseData.fn);
		activeWallPulses.delete(entry.pulseData);
	}

	if (entry.gfx) {
		if (entry.gfx.parent) entry.gfx.parent.removeChild(entry.gfx);
		entry.gfx.destroy({ children: true });
	}

	wallHighlightMap.delete(wallPlaceable);
}

/**
 * Check if a wall placeable has a highlight.
 *
 * @param {object} wallPlaceable
 * @returns {boolean}
 */
export function hasWallHighlight(wallPlaceable) {
	return wallHighlightMap.has(wallPlaceable);
}

/**
 * Remove all wall highlights from the canvas.
 */
export function clearWallHighlights() {
	// Clean up all pulse tickers
	for (const pulseData of activeWallPulses) {
		canvas.app?.ticker?.remove(pulseData.fn);
	}
	activeWallPulses.clear();

	// Clean up all highlight graphics on wall placeables
	const walls = canvas.walls?.placeables;
	if (!walls) return;

	for (const wall of walls) {
		const entry = wallHighlightMap.get(wall);
		if (!entry) continue;
		if (entry.gfx) {
			if (entry.gfx.parent) entry.gfx.parent.removeChild(entry.gfx);
			entry.gfx.destroy({ children: true });
		}
		wallHighlightMap.delete(wall);
	}
}
