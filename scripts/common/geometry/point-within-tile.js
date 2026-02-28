/**
 * Test whether a point (in canvas coordinates) falls within a tile's bounds.
 * Handles tile rotation. Simplified from MATT's `TileDocument.prototype.pointWithin`.
 *
 * @param {TileDocument} tileDoc  The tile document
 * @param {{ x: number, y: number }} point  Canvas-space point
 * @returns {boolean}
 */
export function pointWithinTile(tileDoc, point) {
	const w = Math.abs(tileDoc.width);
	const h = Math.abs(tileDoc.height);
	const cX = w / 2;
	const cY = h / 2;

	// Translate point relative to tile center
	let px = point.x - (tileDoc.x + cX);
	let py = point.y - (tileDoc.y + cY);

	// Counter-rotate if tile is rotated
	if (tileDoc.rotation !== 0) {
		const rad = Math.toRadians(tileDoc.rotation);
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		const rx = (cos * px) + (sin * py);
		const ry = (cos * py) - (sin * px);
		px = rx;
		py = ry;
	}

	// Translate back to tile-local coordinates (origin at top-left)
	px += cX;
	py += cY;

	return px >= 0 && px <= w && py >= 0 && py <= h;
}
