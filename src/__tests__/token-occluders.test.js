import { describe, expect, it } from "vitest";

import { getTokenOccluderConfig, isTokenOccluderActive } from "../../scripts/token-occluders/core/flag-utils.js";
import { getTokenTestPoints, inspectWallIntersection, wallBlocksSegment } from "../../scripts/token-occluders/core/runtime.js";

globalThis.foundry = {
	utils: {
		lineLineIntersection(a0, a1, b0, b1, { t1 } = {}) {
			const r = { x: a1.x - a0.x, y: a1.y - a0.y };
			const s = { x: b1.x - b0.x, y: b1.y - b0.y };
			const denom = (r.x * s.y) - (r.y * s.x);
			const delta = { x: b0.x - a0.x, y: b0.y - a0.y };
			const epsilon = 1e-8;
			if (Math.abs(denom) < epsilon) return null;

			const ta = ((delta.x * s.y) - (delta.y * s.x)) / denom;
			const tb = ((delta.x * r.y) - (delta.y * r.x)) / denom;
			if (ta <= epsilon || ta >= 1 - epsilon) return null;
			if (tb <= epsilon || tb >= 1 - epsilon) return null;

			return {
				x: a0.x + (ta * r.x),
				y: a0.y + (ta * r.y),
				t0: ta,
				...(t1 ? { t1: tb } : {}),
			};
		},
	},
	canvas: {
		edges: {
			Edge: class Edge {},
			PolygonVertex: {
				fromPoint(point) {
					return point;
				},
			},
		},
	},
};

describe("getTokenOccluderConfig", () => {
	it("defaults door gating on when linked door metadata exists", () => {
		const wallDoc = {
			flags: {
				"map-ui-presets": {
					links: {
						doors: ["door-a"],
					},
				},
			},
		};

		expect(getTokenOccluderConfig(wallDoc)).toEqual({ enabled: false, gateByLinkedDoors: true });
	});

	it("respects explicit flag overrides", () => {
		const wallDoc = {
			getFlag: () => ({ enabled: true, gateByLinkedDoors: false }),
			flags: {
				"map-ui-presets": {
					links: {
						doors: ["door-a"],
					},
				},
			},
		};

		expect(getTokenOccluderConfig(wallDoc)).toEqual({ enabled: true, gateByLinkedDoors: false });
	});
});

describe("isTokenOccluderActive", () => {
	it("activates when a linked door is closed or locked", () => {
		const wallDoc = {
			parent: {
				walls: new Map([
					["door-open", { door: 1, ds: 1 }],
					["door-locked", { door: 1, ds: 2 }],
				]),
			},
			getFlag: () => ({ enabled: true, gateByLinkedDoors: true }),
			flags: {
				"map-ui-presets": {
					links: {
						doors: ["door-open", "door-locked"],
					},
				},
			},
		};

		expect(isTokenOccluderActive(wallDoc)).toBe(true);
	});

	it("deactivates when all linked doors are open", () => {
		const wallDoc = {
			parent: {
				walls: new Map([
					["door-open-a", { door: 1, ds: 1 }],
					["door-open-b", { door: 1, ds: 1 }],
				]),
			},
			getFlag: () => ({ enabled: true, gateByLinkedDoors: true }),
			flags: {
				"map-ui-presets": {
					links: {
						doors: ["door-open-a", "door-open-b"],
					},
				},
			},
		};

		expect(isTokenOccluderActive(wallDoc)).toBe(false);
	});
});

describe("getTokenTestPoints", () => {
	it("samples the center and inset corners of a token footprint", () => {
		const points = getTokenTestPoints({ x: 100, y: 200, w: 80, h: 120 });

		expect(points).toEqual([
			{ x: 140, y: 260 },
			{ x: 120, y: 230 },
			{ x: 160, y: 230 },
			{ x: 120, y: 290 },
			{ x: 160, y: 290 },
		]);
	});

	it("deduplicates points for tiny footprints", () => {
		const points = getTokenTestPoints({ x: 10, y: 20, w: 2, h: 2 });

		expect(points).toEqual([
			{ x: 11, y: 21 },
		]);
	});
});

describe("inspectWallIntersection", () => {
	it("uses a wall edge intersection when available", () => {
		const wall = {
			document: { id: "wall-a", c: [5, -5, 5, 5] },
			edge: {
				getIntersection: () => ({ x: 5, y: 0, t1: 0.5 }),
			},
			canRayIntersect: ({ angle }) => angle > 0,
		};

		const result = inspectWallIntersection(wall, { x: 0, y: 0 }, { x: 10, y: 1 });

		expect(result.blocks).toBe(true);
		expect(result.intersectionRatio).toBe(0.5);
		expect(result.reason).toBe("intersects-and-direction-allows");
	});

	it("falls back to geometry helpers when no wall edge exists", () => {
		const wall = {
			document: { id: "wall-b", c: [5, -5, 5, 5] },
			canRayIntersect: ({ angle }) => angle > 0,
		};

		const result = inspectWallIntersection(wall, { x: 0, y: 0 }, { x: 10, y: 1 });

		expect(result.blocks).toBe(true);
		expect(result.intersectionRatio).toBeCloseTo(0.5);
	});
});

describe("wallBlocksSegment", () => {
	it("uses Foundry directional checks when available", () => {
		const wall = {
			document: { c: [5, -5, 5, 5] },
			canRayIntersect: ({ angle }) => angle > 0,
		};

		expect(wallBlocksSegment(wall, { x: 0, y: 0 }, { x: 10, y: 1 })).toBe(true);
		expect(wallBlocksSegment(wall, { x: 0, y: 0 }, { x: 10, y: -1 })).toBe(false);
	});
});
