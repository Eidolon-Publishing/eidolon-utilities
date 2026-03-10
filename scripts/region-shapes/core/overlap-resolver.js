// ── Region overlap resolver (pure logic) ────────────────────────────────────
//
// Detects overlapping regions and resolves them by priority-based subtraction.
// Higher-priority regions (lower index) keep their full shape; lower-priority
// regions have the higher-priority shapes cookie-cut out of them.
//
// ClipperLib is dependency-injected for testability, same as merge-shapes.js.

import { shapeToClipperPath, clipperPathToPolygonShape } from "./merge-shapes.js";

/** Default scaling factor — matches Region.CLIPPER_SCALING_FACTOR. */
const DEFAULT_SCALING_FACTOR = 100;

/** Default number of vertices for circle/ellipse approximation. */
const DEFAULT_VERTEX_COUNT = 32;

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute an axis-aligned bounding box for a region's non-hole shapes.
 * @param {object[]} shapes  Array of shape data from region.shapes
 * @returns {{minX: number, minY: number, maxX: number, maxY: number} | null}
 */
function regionBBox(shapes) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	let hasPoints = false;

	for (const shape of shapes) {
		if (shape.hole) continue;
		switch (shape.type) {
			case "polygon":
				for (let i = 0; i < shape.points.length; i += 2) {
					const x = shape.points[i];
					const y = shape.points[i + 1];
					if (x < minX) minX = x;
					if (y < minY) minY = y;
					if (x > maxX) maxX = x;
					if (y > maxY) maxY = y;
					hasPoints = true;
				}
				break;
			case "rectangle": {
				const corners = [
					[shape.x, shape.y],
					[shape.x + shape.width, shape.y],
					[shape.x + shape.width, shape.y + shape.height],
					[shape.x, shape.y + shape.height],
				];
				if (shape.rotation) {
					const cx = shape.x + shape.width / 2;
					const cy = shape.y + shape.height / 2;
					const angle = (shape.rotation * Math.PI) / 180;
					const cos = Math.cos(angle);
					const sin = Math.sin(angle);
					for (const [ox, oy] of corners) {
						const dx = ox - cx;
						const dy = oy - cy;
						const rx = cos * dx - sin * dy + cx;
						const ry = sin * dx + cos * dy + cy;
						if (rx < minX) minX = rx;
						if (ry < minY) minY = ry;
						if (rx > maxX) maxX = rx;
						if (ry > maxY) maxY = ry;
						hasPoints = true;
					}
				} else {
					for (const [x, y] of corners) {
						if (x < minX) minX = x;
						if (y < minY) minY = y;
						if (x > maxX) maxX = x;
						if (y > maxY) maxY = y;
						hasPoints = true;
					}
				}
				break;
			}
			case "circle": {
				const r = shape.radius;
				if (shape.x - r < minX) minX = shape.x - r;
				if (shape.y - r < minY) minY = shape.y - r;
				if (shape.x + r > maxX) maxX = shape.x + r;
				if (shape.y + r > maxY) maxY = shape.y + r;
				hasPoints = true;
				break;
			}
			case "ellipse": {
				// Conservative bbox — ignores rotation for speed
				const rx = shape.radiusX;
				const ry = shape.radiusY;
				if (shape.x - rx < minX) minX = shape.x - rx;
				if (shape.y - ry < minY) minY = shape.y - ry;
				if (shape.x + rx > maxX) maxX = shape.x + rx;
				if (shape.y + ry > maxY) maxY = shape.y + ry;
				hasPoints = true;
				break;
			}
		}
	}

	return hasPoints ? { minX, minY, maxX, maxY } : null;
}

/**
 * Check whether two axis-aligned bounding boxes overlap.
 */
function bboxOverlaps(a, b) {
	return a.maxX > b.minX && a.minX < b.maxX && a.maxY > b.minY && a.minY < b.maxY;
}

/**
 * Get ClipperLib paths for all non-hole shapes in a region.
 * @param {object[]} shapes  Region shape data
 * @param {number} sf        Scaling factor
 * @param {object} CL        ClipperLib namespace
 * @param {number} vc        Vertex count for curves
 * @returns {object[][]}     Array of ClipperLib IntPoint paths
 */
function nonHolePaths(shapes, sf, CL, vc) {
	const paths = [];
	for (const shape of shapes) {
		if (shape.hole) continue;
		paths.push(shapeToClipperPath(shape, sf, CL, { vertexCount: vc }));
	}
	return paths;
}

/**
 * Union an array of ClipperLib paths into a single solution.
 * @param {object[][]} paths  Array of IntPoint paths
 * @param {object} CL        ClipperLib namespace
 * @returns {object[][]}     Unioned paths (from Solutions, not PolyTree)
 */
function unionPaths(paths, CL) {
	if (paths.length === 0) return [];
	if (paths.length === 1) return [paths[0]];
	const clipper = new CL.Clipper();
	clipper.AddPaths(paths, CL.PolyType.ptSubject, true);
	const solution = new CL.Paths();
	clipper.Execute(CL.ClipType.ctUnion, solution, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
	return solution;
}

/**
 * Test whether two sets of paths have any geometric intersection.
 * @param {object[][]} pathsA
 * @param {object[][]} pathsB
 * @param {object} CL  ClipperLib namespace
 * @param {number} sf   Scaling factor (used to compute area threshold)
 * @returns {boolean}
 */
function pathsIntersect(pathsA, pathsB, CL, sf) {
	const clipper = new CL.Clipper();
	clipper.AddPaths(pathsA, CL.PolyType.ptSubject, true);
	clipper.AddPaths(pathsB, CL.PolyType.ptClip, true);
	const solution = new CL.Paths();
	clipper.Execute(CL.ClipType.ctIntersection, solution, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
	// Filter degenerate intersections (shared edges / rounding slivers).
	// Shared edges produce thin slivers with tiny but non-zero area.
	// Threshold: 4 real pixels² = 4 * sf² in Clipper-scaled coordinates.
	const minArea = 4 * sf * sf;
	return solution.some((path) => Math.abs(CL.Clipper.Area(path)) > minArea);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Find regions that geometrically overlap with at least one other region.
 *
 * @param {object[]} regions  Array of region documents (must have `.shapes`)
 * @param {object} CL        ClipperLib namespace (injected)
 * @param {object} [options]
 * @param {number} [options.scalingFactor=100]
 * @param {number} [options.vertexCount=32]
 * @returns {object[]}        Subset of regions that overlap with at least one other
 */
export function findOverlappingRegions(regions, CL, options = {}) {
	const sf = options.scalingFactor ?? DEFAULT_SCALING_FACTOR;
	const vc = options.vertexCount ?? DEFAULT_VERTEX_COUNT;

	// Pre-compute bboxes and clipper paths for each region
	const entries = [];
	for (const region of regions) {
		const shapes = region.shapes ?? [];
		const bbox = regionBBox(shapes);
		if (!bbox) continue; // Skip regions with no geometry
		const paths = nonHolePaths(shapes, sf, CL, vc);
		if (paths.length === 0) continue;
		entries.push({ region, bbox, paths });
	}

	// Track which entries overlap with at least one other
	const overlapping = new Set();

	for (let i = 0; i < entries.length; i++) {
		for (let j = i + 1; j < entries.length; j++) {
			// Quick bbox rejection
			if (!bboxOverlaps(entries[i].bbox, entries[j].bbox)) continue;
			// Precise intersection test
			if (pathsIntersect(entries[i].paths, entries[j].paths, CL, sf)) {
				overlapping.add(entries[i].region);
				overlapping.add(entries[j].region);
			}
		}
	}

	return [...overlapping];
}

/**
 * Resolve overlaps by priority-based subtraction.
 *
 * Index 0 = highest priority (kept intact). Each subsequent region has the
 * union of all higher-priority regions' non-hole shapes subtracted from it.
 *
 * @param {object[]} orderedRegions  Array of region documents, priority-ordered
 * @param {object} CL               ClipperLib namespace (injected)
 * @param {object} [options]
 * @param {number} [options.scalingFactor=100]
 * @param {number} [options.vertexCount=32]
 * @returns {Array<{region: object, newShapes: object[]}>}  Only regions whose shapes changed
 */
export function resolveOverlaps(orderedRegions, CL, options = {}) {
	const sf = options.scalingFactor ?? DEFAULT_SCALING_FACTOR;
	const vc = options.vertexCount ?? DEFAULT_VERTEX_COUNT;

	// Build cumulative union of higher-priority shapes as we go
	let cumulativePaths = [];
	const results = [];

	for (let i = 0; i < orderedRegions.length; i++) {
		const region = orderedRegions[i];
		const shapes = region.shapes ?? [];
		const paths = nonHolePaths(shapes, sf, CL, vc);

		if (i === 0) {
			// Highest priority — keep intact, seed the cumulative union
			cumulativePaths = unionPaths(paths, CL);
			continue;
		}

		if (paths.length === 0) continue;

		// Subtract cumulative union from this region's non-hole shapes
		const clipper = new CL.Clipper();
		clipper.AddPaths(paths, CL.PolyType.ptSubject, true);
		clipper.AddPaths(cumulativePaths, CL.PolyType.ptClip, true);
		const polyTree = new CL.PolyTree();
		clipper.Execute(CL.ClipType.ctDifference, polyTree, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);

		// Walk the PolyTree to extract contours and holes
		const newShapes = [];
		const stack = [];
		const children = polyTree.Childs();
		for (let c = children.length - 1; c >= 0; c--) stack.push(children[c]);
		while (stack.length > 0) {
			const node = stack.pop();
			newShapes.push(clipperPathToPolygonShape(node.Contour(), sf, node.IsHole()));
			const nodeChildren = node.Childs();
			for (let c = nodeChildren.length - 1; c >= 0; c--) stack.push(nodeChildren[c]);
		}

		// Preserve any original hole shapes (they were excluded from the subtraction)
		for (const shape of shapes) {
			if (shape.hole) newShapes.push(foundry.utils.deepClone(shape));
		}

		results.push({ region, newShapes });

		// Add this region's original paths to cumulative union
		// (we use the original paths, not the subtracted result, so that
		// the cookie-cut is always against the original intended coverage)
		const combined = [...cumulativePaths, ...paths];
		cumulativePaths = unionPaths(combined, CL);
	}

	return results;
}
