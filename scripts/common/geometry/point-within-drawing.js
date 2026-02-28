/**
 * Test whether a point (in canvas coordinates) falls within a drawing's bounds.
 * Handles all four Foundry drawing shape types: rectangle, ellipse, polygon, freehand.
 *
 * @param {DrawingDocument} drawingDoc  The drawing document
 * @param {{ x: number, y: number }} point  Canvas-space point
 * @returns {boolean}
 */
export function pointWithinDrawing(drawingDoc, point) {
	const shape = drawingDoc.shape;
	if (!shape) return false;

	const dx = drawingDoc.x ?? 0;
	const dy = drawingDoc.y ?? 0;
	const sw = shape.width ?? 0;
	const sh = shape.height ?? 0;
	const rotation = drawingDoc.rotation ?? 0;

	// Translate point relative to drawing center
	const cx = dx + sw / 2;
	const cy = dy + sh / 2;
	let px = point.x - cx;
	let py = point.y - cy;

	// Counter-rotate if drawing is rotated
	if (rotation !== 0) {
		const rad = Math.toRadians(rotation);
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		const rx = (cos * px) + (sin * py);
		const ry = (cos * py) - (sin * px);
		px = rx;
		py = ry;
	}

	// Translate to drawing-local coords (origin = top-left)
	px += sw / 2;
	py += sh / 2;

	switch (shape.type) {
		case "r": // rectangle
			return px >= 0 && px <= sw && py >= 0 && py <= sh;

		case "e": { // ellipse
			const rx = sw / 2;
			const ry = sh / 2;
			if (rx <= 0 || ry <= 0) return false;
			const nx = (px - rx) / rx;
			const ny = (py - ry) / ry;
			return (nx * nx + ny * ny) <= 1;
		}

		case "p": { // polygon
			const points = shape.points;
			if (!Array.isArray(points) || points.length < 6) return false;
			return pointInPolygon(px, py, points);
		}

		case "f": { // freehand — use bounding box (matches Foundry's own click handling)
			return px >= 0 && px <= sw && py >= 0 && py <= sh;
		}

		default:
			return false;
	}
}

/**
 * Ray-casting point-in-polygon test.
 * Points is a flat array [x0, y0, x1, y1, ...].
 */
function pointInPolygon(px, py, points) {
	let inside = false;
	const n = points.length;
	for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
		const xi = points[i];
		const yi = points[i + 1];
		const xj = points[j];
		const yj = points[j + 1];

		if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
			inside = !inside;
		}
	}
	return inside;
}
