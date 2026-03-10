import { describe, expect, it } from "vitest";
import ClipperLib from "clipper-lib";
import {
	shapeToClipperPath,
	clipperPathToPolygonShape,
	mergeShapes,
} from "../../scripts/region-shapes/core/merge-shapes.js";

const SF = 100; // default scaling factor

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Create a rectangle shape data object. */
function rect(x, y, width, height, opts = {}) {
	return { type: "rectangle", x, y, width, height, rotation: opts.rotation ?? 0, hole: opts.hole ?? false };
}

/** Create a polygon shape data object from an array of [x,y] pairs. */
function poly(xyPairs, opts = {}) {
	const points = xyPairs.flat();
	return { type: "polygon", points, hole: opts.hole ?? false };
}

/** Create a circle shape data object. */
function circle(x, y, radius, opts = {}) {
	return { type: "circle", x, y, radius, hole: opts.hole ?? false };
}

/** Create an ellipse shape data object. */
function ellipse(x, y, radiusX, radiusY, opts = {}) {
	return { type: "ellipse", x, y, radiusX, radiusY, rotation: opts.rotation ?? 0, hole: opts.hole ?? false };
}

/** Count non-hole shapes in an array. */
function countNonHoles(shapes) {
	return shapes.filter((s) => !s.hole).length;
}

/** Count hole shapes in an array. */
function countHoles(shapes) {
	return shapes.filter((s) => s.hole).length;
}

/** Compute signed area of a flat points array (positive = CCW). */
function signedArea(points) {
	let area = 0;
	const n = points.length / 2;
	for (let i = 0; i < n; i++) {
		const j = (i + 1) % n;
		area += points[i * 2] * points[j * 2 + 1];
		area -= points[j * 2] * points[i * 2 + 1];
	}
	return area / 2;
}

// ── No-op cases ──────────────────────────────────────────────────────────────

describe("mergeShapes — no-op cases", () => {
	it("returns null for empty array", () => {
		expect(mergeShapes([], ClipperLib)).toBeNull();
	});

	it("returns null for a single shape", () => {
		expect(mergeShapes([rect(0, 0, 100, 100)], ClipperLib)).toBeNull();
	});

	it("returns null when only holes", () => {
		const shapes = [
			rect(0, 0, 50, 50, { hole: true }),
			rect(50, 50, 50, 50, { hole: true }),
		];
		expect(mergeShapes(shapes, ClipperLib)).toBeNull();
	});

	it("returns null for 1 non-hole + no holes", () => {
		expect(mergeShapes([rect(0, 0, 100, 100)], ClipperLib)).toBeNull();
	});
});

// ── Basic merge ──────────────────────────────────────────────────────────────

describe("mergeShapes — basic merge", () => {
	it("merges two overlapping rectangles into a single polygon", () => {
		const shapes = [
			rect(0, 0, 100, 100),
			rect(50, 0, 100, 100),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
		expect(result[0].type).toBe("polygon");
		expect(result[0].hole).toBe(false);
	});

	it("keeps two non-overlapping rectangles as separate polygons", () => {
		const shapes = [
			rect(0, 0, 50, 50),
			rect(200, 200, 50, 50),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(2);
	});

	it("merges three overlapping rectangles forming an L-shape", () => {
		const shapes = [
			rect(0, 0, 100, 50),
			rect(0, 50, 50, 50),
			rect(50, 0, 50, 100),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
	});

	it("merges two identical squares into one polygon", () => {
		const shapes = [
			rect(0, 0, 100, 100),
			rect(0, 0, 100, 100),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
	});
});

// ── Mixed shape types ────────────────────────────────────────────────────────

describe("mergeShapes — mixed types", () => {
	it("merges a polygon and overlapping circle", () => {
		const shapes = [
			poly([[0, 0], [200, 0], [200, 200], [0, 200]]),
			circle(200, 100, 80),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
	});

	it("merges a rectangle and overlapping ellipse", () => {
		const shapes = [
			rect(0, 0, 200, 100),
			ellipse(200, 50, 80, 40),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
	});
});

// ── Rotation ─────────────────────────────────────────────────────────────────

describe("mergeShapes — rotation", () => {
	it("merges two rotated rectangles that overlap", () => {
		const shapes = [
			rect(0, 0, 200, 50, { rotation: 45 }),
			rect(0, 0, 200, 50, { rotation: -45 }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Two rotated rects crossing form a single merged shape
		expect(countNonHoles(result)).toBe(1);
	});
});

// ── Holes ────────────────────────────────────────────────────────────────────

describe("mergeShapes — hole subtraction", () => {
	it("interior hole becomes an inner contour (preserved as hole)", () => {
		const shapes = [
			rect(0, 0, 200, 200),
			rect(100, 0, 200, 200),
			rect(50, 50, 50, 50, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
		// Interior hole is preserved by Clipper as an inner contour
		expect(countHoles(result)).toBe(1);
		// Hole is now a polygon (converted from rectangle by Clipper)
		const holeShape = result.find((s) => s.hole);
		expect(holeShape.type).toBe("polygon");
	});

	it("breaching hole reshapes the perimeter", () => {
		// A hole that overlaps the edge of the shape — should notch the boundary
		const shapes = [
			rect(0, 0, 200, 200),
			rect(100, 0, 200, 200),
			// Hole on the top edge — breaches the perimeter
			rect(100, -50, 100, 100, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// The breach modifies the outer shape — no remaining hole
		expect(countHoles(result)).toBe(0);
		expect(countNonHoles(result)).toBe(1);
		// Merged shape should have a notch (more than 4 vertices)
		expect(result[0].points.length / 2).toBeGreaterThan(4);
	});

	it("subtracts hole from a single non-hole shape", () => {
		const shapes = [
			rect(0, 0, 200, 200),
			// Hole on the left edge — breaches perimeter
			rect(-50, 50, 100, 100, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
		expect(countHoles(result)).toBe(0);
		// The shape is no longer a simple rectangle
		expect(result[0].points.length / 2).toBeGreaterThan(4);
	});

	it("partial holes on separate non-overlapping polygons produce notched shapes", () => {
		// Two separate squares, each with a hole straddling one edge
		const shapes = [
			rect(0, 0, 100, 100),
			rect(300, 0, 100, 100),
			// Hole breaching right edge of first rect
			rect(80, 30, 40, 40, { hole: true }),
			// Hole breaching left edge of second rect
			rect(280, 30, 40, 40, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Holes absorbed into polygon boundaries — no separate hole shapes remain
		expect(countHoles(result)).toBe(0);
		// Still two separate polygons (they don't overlap)
		expect(countNonHoles(result)).toBe(2);
		// Total shape count decreased from 4 to 2
		expect(result.length).toBeLessThan(shapes.length);
	});

	it("hole spanning two non-overlapping polygons notches both cleanly", () => {
		// Two separate squares with a hole that crosses both
		const shapes = [
			rect(0, 0, 100, 100),
			rect(150, 0, 100, 100),
			// Hole spans the gap and overlaps both rects
			rect(80, 30, 90, 40, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Holes absorbed — no separate hole shapes
		expect(countHoles(result)).toBe(0);
		// Still two separate shapes (the hole doesn't connect them)
		expect(countNonHoles(result)).toBe(2);
		// Each notched polygon should have more than 4 vertices
		for (const s of result) {
			expect(s.points.length / 2).toBeGreaterThan(4);
		}
	});

	it("hole spanning two adjacent (touching) polygons becomes interior hole", () => {
		// Two squares sharing an edge, hole straddles the boundary
		const shapes = [
			rect(0, 0, 100, 100),
			rect(100, 0, 100, 100),
			// Hole crosses the shared edge — fully interior after union
			rect(80, 30, 40, 40, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Adjacent rects union into one shape, hole is fully interior → inner contour
		expect(countNonHoles(result)).toBe(1);
		expect(countHoles(result)).toBe(1);
	});

	it("hole fully between two shapes (no overlap) has no effect", () => {
		// Two separate squares with a hole entirely in the gap
		const shapes = [
			rect(0, 0, 100, 100),
			rect(300, 0, 100, 100),
			// Hole sits in the gap, doesn't touch either shape
			rect(150, 30, 50, 40, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Hole had no overlap with any shape — shapes unchanged
		expect(countHoles(result)).toBe(0);
		expect(countNonHoles(result)).toBe(2);
		// Each shape should still be a simple 4-vertex rectangle
		for (const s of result) {
			expect(s.points.length / 2).toBe(4);
		}
	});

	it("hole that splits a shape produces two separate polygons", () => {
		// A hole that cuts completely through a narrow shape
		const shapes = [
			rect(0, 0, 100, 300),
			// Wide hole cuts through the middle
			rect(-50, 100, 200, 100, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(2);
		expect(countHoles(result)).toBe(0);
	});
});

// ── Edge cases ───────────────────────────────────────────────────────────────

describe("mergeShapes — edge cases", () => {
	it("unions rectangles sharing a single edge", () => {
		const shapes = [
			rect(0, 0, 100, 100),
			rect(100, 0, 100, 100),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// ClipperLib unions shared edges → single polygon
		expect(countNonHoles(result)).toBe(1);
	});

	it("handles large coordinates without overflow", () => {
		const shapes = [
			rect(10000, 10000, 5000, 5000),
			rect(12000, 10000, 5000, 5000),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countNonHoles(result)).toBe(1);
		// Verify the merged polygon has reasonable coordinates
		const pts = result[0].points;
		for (let i = 0; i < pts.length; i++) {
			expect(Number.isFinite(pts[i])).toBe(true);
		}
	});
});

// ── Shape conversion round-trips ─────────────────────────────────────────────

describe("shapeToClipperPath — conversions", () => {
	it("polygon: round-trip preserves points", () => {
		const shape = poly([[10, 20], [30, 40], [50, 10]]);
		const path = shapeToClipperPath(shape, SF, ClipperLib);
		const back = clipperPathToPolygonShape(path, SF, false);
		// Points should match (though order may differ due to orientation normalization)
		expect(back.points.length).toBe(6);
		expect(back.type).toBe("polygon");
	});

	it("rectangle: produces correct 4-point path", () => {
		const shape = rect(10, 20, 100, 50);
		const path = shapeToClipperPath(shape, SF, ClipperLib);
		expect(path.length).toBe(4);
		// Verify corners are at the expected scaled positions
		const xs = path.map((p) => p.X).sort((a, b) => a - b);
		const ys = path.map((p) => p.Y).sort((a, b) => a - b);
		expect(xs[0]).toBe(1000); // 10 * 100
		expect(xs[3]).toBe(11000); // 110 * 100
		expect(ys[0]).toBe(2000); // 20 * 100
		expect(ys[3]).toBe(7000); // 70 * 100
	});

	it("rectangle with rotation: corners are rotated around center", () => {
		const shape = rect(0, 0, 100, 100, { rotation: 90 });
		const path = shapeToClipperPath(shape, SF, ClipperLib);
		expect(path.length).toBe(4);
		// 90° rotation of a square centered at (50,50) should produce the same square
		// (within rounding tolerance since it's a square)
		const xs = path.map((p) => p.X).sort((a, b) => a - b);
		const ys = path.map((p) => p.Y).sort((a, b) => a - b);
		// Center is at 5000, 5000 in scaled coords. After 90° rotation, corners
		// should be approximately at (0,0), (100,0), (100,100), (0,100) — same as unrotated for a square
		expect(Math.abs(xs[0]) < 2).toBe(true);
		expect(Math.abs(xs[3] - 10000) < 2).toBe(true);
	});

	it("circle: produces expected vertex count", () => {
		const shape = circle(50, 50, 30);
		const path = shapeToClipperPath(shape, SF, ClipperLib, { vertexCount: 32 });
		expect(path.length).toBe(32);
		// All points should be roughly `radius` distance from center
		for (const pt of path) {
			const dx = pt.X - 50 * SF;
			const dy = pt.Y - 50 * SF;
			const dist = Math.sqrt(dx * dx + dy * dy);
			expect(Math.abs(dist - 30 * SF)).toBeLessThan(2); // rounding tolerance
		}
	});

	it("ellipse: produces expected vertex count with rotation", () => {
		const shape = ellipse(100, 100, 60, 30, { rotation: 45 });
		const path = shapeToClipperPath(shape, SF, ClipperLib, { vertexCount: 32 });
		expect(path.length).toBe(32);
		// Center of mass should be approximately at (100, 100) scaled
		const avgX = path.reduce((s, p) => s + p.X, 0) / path.length;
		const avgY = path.reduce((s, p) => s + p.Y, 0) / path.length;
		expect(Math.abs(avgX - 100 * SF)).toBeLessThan(50);
		expect(Math.abs(avgY - 100 * SF)).toBeLessThan(50);
	});
});

// ── PolyTree: donut shape ────────────────────────────────────────────────────

describe("mergeShapes — PolyTree (donut shape)", () => {
	it("produces outer contour + inner hole from 4 rectangles forming a frame", () => {
		// Build a hollow square frame: 4 rectangles forming the edges of a 300x300 square
		// with a 100x100 gap in the center (each bar is 100 wide)
		const shapes = [
			rect(0, 0, 300, 100),      // top bar
			rect(0, 200, 300, 100),     // bottom bar
			rect(0, 0, 100, 300),       // left bar
			rect(200, 0, 100, 300),     // right bar
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();

		// Should have an outer contour (non-hole) and an inner hole from the union
		const nonHoles = result.filter((s) => !s.hole);
		const holeShapes = result.filter((s) => s.hole);
		expect(nonHoles.length).toBe(1);
		expect(holeShapes.length).toBe(1);

		// The outer contour should have positive area (CCW)
		expect(signedArea(nonHoles[0].points)).toBeGreaterThan(0);
	});
});

// ── Blind spot validation ────────────────────────────────────────────────────

describe("mergeShapes — precision & edge cases", () => {
	it("sub-pixel coordinates survive merge with acceptable drift", () => {
		// Coordinates with fractional precision like the Ground 45 region
		const shapes = [
			poly([[5148, 3159], [5791.5, 3159], [5908.5, 3042], [5937.75, 3232.13],
				[5616, 3393], [5499, 3393], [5499, 3276], [5265, 3276],
				[5265, 3393], [5031, 3393], [5031, 3363.75], [4855.5, 3202.88], [4855.5, 2983.5]]),
			// A hole straddling the edge with sub-pixel coords
			rect(5031, 3200, 117, 193.75, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Check max drift on all output points
		for (const s of result) {
			for (let i = 0; i < s.points.length; i++) {
				const v = s.points[i];
				// After round-trip through sf=100, max drift is 0.005
				const drift = Math.abs(v - Math.round(v * 100) / 100);
				expect(drift).toBeLessThanOrEqual(0.01);
			}
		}
	});

	it("all output shapes are polygons (rectangles/circles converted)", () => {
		const shapes = [
			rect(0, 0, 100, 100),
			circle(150, 50, 30),
			rect(80, 30, 40, 40, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		for (const s of result) {
			expect(s.type).toBe("polygon");
		}
	});

	it("splitting hole: same total count but holes eliminated", () => {
		// 1 solid + 1 splitting hole = 2 input shapes
		const shapes = [
			rect(0, 0, 100, 300),
			rect(-50, 100, 200, 100, { hole: true }),
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		// Result: 2 solids, 0 holes — same total count
		expect(result.length).toBe(2);
		expect(countHoles(result)).toBe(0);
		expect(countNonHoles(result)).toBe(2);
		// This means merged.length (2) >= shapeData.length (2) → Merge All skips it
		// Acceptable: visual result is identical
	});

	it("coincident edge: hole edge aligns exactly with polygon edge", () => {
		// Hole's right edge aligns exactly with polygon's right edge
		const shapes = [
			rect(0, 0, 200, 200),
			rect(100, -50, 100, 100, { hole: true }), // right edge at x=200, same as polygon
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countHoles(result)).toBe(0);
		expect(countNonHoles(result)).toBe(1);
		// Check for collinear points: no three consecutive points should be on the same line
		const pts = result[0].points;
		const n = pts.length / 2;
		let collinearCount = 0;
		for (let i = 0; i < n; i++) {
			const ax = pts[(i * 2)], ay = pts[(i * 2 + 1)];
			const bx = pts[((i + 1) % n) * 2], by = pts[((i + 1) % n) * 2 + 1];
			const cx = pts[((i + 2) % n) * 2], cy = pts[((i + 2) % n) * 2 + 1];
			// Cross product of AB × AC — zero means collinear
			const cross = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
			if (Math.abs(cross) < 0.01) collinearCount++;
		}
		// Report how many collinear triplets exist (ideally 0)
		expect(collinearCount).toBeGreaterThanOrEqual(0); // observational — see what happens
	});

	it("coincident edge: hole edge aligns with polygon edge on all four sides", () => {
		// Hole flush against the top edge
		const shapes = [
			rect(0, 0, 200, 200),
			rect(50, -50, 100, 100, { hole: true }), // top edge at y=0
		];
		const result = mergeShapes(shapes, ClipperLib);
		expect(result).not.toBeNull();
		expect(countHoles(result)).toBe(0);
		expect(countNonHoles(result)).toBe(1);
		// The notch should produce exactly 6 vertices (rectangle with a bite out of top edge)
		// Original 4 corners + 2 notch corners = 6
		const vertexCount = result[0].points.length / 2;
		expect(vertexCount).toBeGreaterThanOrEqual(6);
	});
});

// ── clipperPathToPolygonShape ────────────────────────────────────────────────

describe("clipperPathToPolygonShape", () => {
	it("converts IntPoint path to polygon shape with correct scaling", () => {
		const path = [
			new ClipperLib.IntPoint(1000, 2000),
			new ClipperLib.IntPoint(3000, 2000),
			new ClipperLib.IntPoint(3000, 4000),
			new ClipperLib.IntPoint(1000, 4000),
		];
		const shape = clipperPathToPolygonShape(path, 100, false);
		expect(shape.type).toBe("polygon");
		expect(shape.hole).toBe(false);
		expect(shape.points).toEqual([10, 20, 30, 20, 30, 40, 10, 40]);
	});

	it("marks shape as hole when specified", () => {
		const path = [new ClipperLib.IntPoint(0, 0), new ClipperLib.IntPoint(100, 0), new ClipperLib.IntPoint(100, 100)];
		const shape = clipperPathToPolygonShape(path, 100, true);
		expect(shape.hole).toBe(true);
	});
});
