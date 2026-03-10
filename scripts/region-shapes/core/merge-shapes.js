// ── Region shape merge (pure logic) ──────────────────────────────────────────
//
// Unions all overlapping non-hole shapes into merged polygons using ClipperLib.
// ClipperLib is dependency-injected so the module can be unit-tested with the
// npm `clipper-lib` package (same library Foundry bundles as window.ClipperLib).
//
// The algorithm mirrors Foundry's own Region#_createClipperPolyTree pipeline:
// convert each shape → ClipperLib IntPoint paths, union with ctUnion, walk the
// resulting PolyTree to extract outer contours and any inner holes created by
// the union (e.g. donut shapes).

/** Default scaling factor — matches Region.CLIPPER_SCALING_FACTOR. */
const DEFAULT_SCALING_FACTOR = 100;

/** Default number of vertices for circle/ellipse approximation. */
const DEFAULT_VERTEX_COUNT = 32;

// ── Shape → ClipperLib path conversion ───────────────────────────────────────

/**
 * Convert a polygon shape's flat points array to a ClipperLib IntPoint path.
 * @param {number[]} points  Flat [x0, y0, x1, y1, ...] array
 * @param {number} sf        Scaling factor
 * @param {object} CL        ClipperLib namespace
 * @returns {object[]}       Array of IntPoint {X, Y}
 */
function polygonToPath(points, sf, CL) {
	const path = [];
	for (let i = 0; i < points.length; i += 2) {
		path.push(new CL.IntPoint(Math.round(points[i] * sf), Math.round(points[i + 1] * sf)));
	}
	// Ensure counter-clockwise orientation (positive area) for non-hole polygons
	if (!CL.Clipper.Orientation(path)) path.reverse();
	return path;
}

/**
 * Convert a rectangle shape to a 4-point ClipperLib IntPoint path.
 * Supports rotation around the rectangle's center.
 * @param {object} data  {x, y, width, height, rotation}
 * @param {number} sf    Scaling factor
 * @param {object} CL    ClipperLib namespace
 * @returns {object[]}   Array of 4 IntPoints
 */
function rectangleToPath(data, sf, CL) {
	const { x, y, width, height, rotation } = data;
	let x0 = x * sf;
	let y0 = y * sf;
	let x1 = (x + width) * sf;
	let y1 = (y + height) * sf;

	if (!rotation) {
		x0 = Math.round(x0);
		y0 = Math.round(y0);
		x1 = Math.round(x1);
		y1 = Math.round(y1);
		return [new CL.IntPoint(x0, y0), new CL.IntPoint(x1, y0), new CL.IntPoint(x1, y1), new CL.IntPoint(x0, y1)];
	}

	const tx = (x0 + x1) / 2;
	const ty = (y0 + y1) / 2;
	x0 -= tx;
	y0 -= ty;
	x1 -= tx;
	y1 -= ty;
	const angle = (rotation * Math.PI) / 180;
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);

	return [
		new CL.IntPoint(Math.round(cos * x0 - sin * y0 + tx), Math.round(sin * x0 + cos * y0 + ty)),
		new CL.IntPoint(Math.round(cos * x1 - sin * y0 + tx), Math.round(sin * x1 + cos * y0 + ty)),
		new CL.IntPoint(Math.round(cos * x1 - sin * y1 + tx), Math.round(sin * x1 + cos * y1 + ty)),
		new CL.IntPoint(Math.round(cos * x0 - sin * y1 + tx), Math.round(sin * x0 + cos * y1 + ty)),
	];
}

/**
 * Convert a circle shape to a polygon approximation as a ClipperLib IntPoint path.
 * @param {object} data       {x, y, radius}
 * @param {number} sf         Scaling factor
 * @param {object} CL         ClipperLib namespace
 * @param {number} vertices   Number of vertices for the approximation
 * @returns {object[]}        Array of IntPoints
 */
function circleToPath(data, sf, CL, vertices) {
	const { x, y, radius } = data;
	const cx = x * sf;
	const cy = y * sf;
	const r = radius * sf;
	const path = [];
	for (let i = 0; i < vertices; i++) {
		const angle = (2 * Math.PI * i) / vertices;
		path.push(new CL.IntPoint(Math.round(cx + Math.cos(angle) * r), Math.round(cy + Math.sin(angle) * r)));
	}
	return path;
}

/**
 * Convert an ellipse shape to a polygon approximation as a ClipperLib IntPoint path.
 * Supports rotation around the ellipse center.
 * @param {object} data       {x, y, radiusX, radiusY, rotation}
 * @param {number} sf         Scaling factor
 * @param {object} CL         ClipperLib namespace
 * @param {number} vertices   Number of vertices for the approximation
 * @returns {object[]}        Array of IntPoints
 */
function ellipseToPath(data, sf, CL, vertices) {
	const { x, y, radiusX, radiusY, rotation } = data;
	const cx = x * sf;
	const cy = y * sf;
	const rx = radiusX * sf;
	const ry = radiusY * sf;
	const rot = ((rotation || 0) * Math.PI) / 180;
	const cos = Math.cos(rot);
	const sin = Math.sin(rot);
	const path = [];
	for (let i = 0; i < vertices; i++) {
		const angle = (2 * Math.PI * i) / vertices;
		const dx = Math.cos(angle) * rx;
		const dy = Math.sin(angle) * ry;
		path.push(new CL.IntPoint(Math.round(cx + cos * dx - sin * dy), Math.round(cy + sin * dx + cos * dy)));
	}
	return path;
}

/**
 * Convert any region shape to a ClipperLib IntPoint path.
 * @param {object} shape          Shape data ({type, ...})
 * @param {number} scalingFactor  Scaling factor for integer conversion
 * @param {object} ClipperLib     The ClipperLib namespace (injected)
 * @param {object} [options]
 * @param {number} [options.vertexCount=32]  Vertices for circle/ellipse approximation
 * @returns {object[]}            ClipperLib IntPoint path
 */
export function shapeToClipperPath(shape, scalingFactor, ClipperLib, options = {}) {
	const vertices = options.vertexCount ?? DEFAULT_VERTEX_COUNT;
	switch (shape.type) {
		case "polygon":
			return polygonToPath(shape.points, scalingFactor, ClipperLib);
		case "rectangle":
			return rectangleToPath(shape, scalingFactor, ClipperLib);
		case "circle":
			return circleToPath(shape, scalingFactor, ClipperLib, vertices);
		case "ellipse":
			return ellipseToPath(shape, scalingFactor, ClipperLib, vertices);
		default:
			throw new Error(`Unknown shape type: ${shape.type}`);
	}
}

/**
 * Convert a ClipperLib IntPoint path back to a polygon shape data object.
 * @param {object[]} path          Array of {X, Y} IntPoints
 * @param {number} scalingFactor   Scaling factor to divide by
 * @param {boolean} hole           Whether this polygon is a hole
 * @returns {object}               {type: "polygon", points: [...], hole}
 */
export function clipperPathToPolygonShape(path, scalingFactor, hole) {
	const points = [];
	for (const pt of path) {
		points.push(pt.X / scalingFactor, pt.Y / scalingFactor);
	}
	return { type: "polygon", points, hole };
}

// ── Main merge function ──────────────────────────────────────────────────────

/**
 * Walk a ClipperLib PolyTree and extract all contour paths with their hole status.
 * @param {object} polyTree  ClipperLib PolyTree
 * @returns {Array<{path: object[], hole: boolean}>}
 */
function walkPolyTree(polyTree) {
	const results = [];
	const stack = [];

	// PolyTree's direct children are the top-level contours
	const children = polyTree.Childs();
	for (let i = children.length - 1; i >= 0; i--) {
		stack.push(children[i]);
	}

	while (stack.length > 0) {
		const node = stack.pop();
		results.push({ path: node.Contour(), hole: node.IsHole() });
		const nodeChildren = node.Childs();
		for (let i = nodeChildren.length - 1; i >= 0; i--) {
			stack.push(nodeChildren[i]);
		}
	}

	return results;
}

/**
 * Merge all overlapping non-hole shapes into unified polygons using ClipperLib,
 * then subtract holes from the result.
 *
 * Holes that are fully interior become inner contours (preserved as holes).
 * Holes that breach the perimeter reshape the outer boundary.
 *
 * @param {object[]} shapes          Array of shape data objects from region.shapes
 * @param {object} CL               ClipperLib namespace (injected)
 * @param {object} [options]
 * @param {number} [options.scalingFactor=100]  Integer scaling factor
 * @param {number} [options.vertexCount=32]     Vertices for circle/ellipse approximation
 * @returns {object[]|null}          Merged shapes array, or null if nothing to merge
 */
export function mergeShapes(shapes, CL, options = {}) {
	const sf = options.scalingFactor ?? DEFAULT_SCALING_FACTOR;
	const vertexCount = options.vertexCount ?? DEFAULT_VERTEX_COUNT;

	// Partition into non-holes and holes
	const nonHoles = [];
	const holes = [];
	for (const shape of shapes) {
		if (shape.hole) {
			holes.push(shape);
		} else {
			nonHoles.push(shape);
		}
	}

	// Need at least 2 non-holes to merge, or 1+ non-holes with holes to subtract
	if (nonHoles.length <= 1 && holes.length === 0) return null;
	if (nonHoles.length === 0) return null;

	// Convert all non-hole shapes to ClipperLib paths
	const nonHolePaths = [];
	for (const shape of nonHoles) {
		nonHolePaths.push(shapeToClipperPath(shape, sf, CL, { vertexCount }));
	}

	// Step 1: Union non-hole shapes
	const unionClipper = new CL.Clipper();
	unionClipper.AddPaths(nonHolePaths, CL.PolyType.ptSubject, true);
	const unionTree = new CL.PolyTree();
	unionClipper.Execute(CL.ClipType.ctUnion, unionTree, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);

	// Step 2: If holes exist, subtract them from the union result
	let finalTree = unionTree;
	if (holes.length > 0) {
		// Extract outer contours only as subjects for the difference pass
		const unionOuters = [];
		for (const { path, hole } of walkPolyTree(unionTree)) {
			if (!hole) unionOuters.push(path);
		}

		// Union overlapping holes into clean combined cutouts
		const rawHolePaths = [];
		for (const shape of holes) {
			const path = shapeToClipperPath(shape, sf, CL, { vertexCount });
			// Ensure CCW for union pass (Clipper treats CCW as positive area)
			if (!CL.Clipper.Orientation(path)) path.reverse();
			rawHolePaths.push(path);
		}
		const holeUnionClipper = new CL.Clipper();
		holeUnionClipper.AddPaths(rawHolePaths, CL.PolyType.ptSubject, true);
		const holeUnionSolution = new CL.Paths();
		holeUnionClipper.Execute(CL.ClipType.ctUnion, holeUnionSolution, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);

		// Flip to CW for the difference pass
		const holePaths = [];
		for (const path of holeUnionSolution) {
			if (CL.Clipper.Orientation(path)) path.reverse();
			holePaths.push(path);
		}

		const diffClipper = new CL.Clipper();
		diffClipper.AddPaths(unionOuters, CL.PolyType.ptSubject, true);
		diffClipper.AddPaths(holePaths, CL.PolyType.ptClip, true);
		finalTree = new CL.PolyTree();
		diffClipper.Execute(CL.ClipType.ctDifference, finalTree, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
	}

	// Walk the final tree and convert back to polygon shapes
	const merged = [];
	for (const { path, hole } of walkPolyTree(finalTree)) {
		merged.push(clipperPathToPolygonShape(path, sf, hole));
	}
	return merged;
}
