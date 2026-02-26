import { describe, it, expect, vi } from "vitest";

// Mock Foundry's CanvasAnimation easing (only linear and easeInOutCosine are built-in)
globalThis.foundry = {
	canvas: {
		animation: {
			CanvasAnimation: {
				easeLinear: (pt) => pt,
				easeInOutCosine: (pt) => (1 - Math.cos(Math.PI * pt)) / 2,
			},
		},
	},
};

vi.mock("../../scripts/time-triggers/core/constants.js", () => ({
	MODULE_ID: "eidolon-utilities",
}));

const { resolveEasing, listEasingNames } = await import("../../scripts/tween/core/easing.js");

describe("resolveEasing", () => {
	it("resolves 'linear' to a function returning t unchanged", () => {
		const fn = resolveEasing("linear");
		expect(fn(0)).toBe(0);
		expect(fn(0.5)).toBe(0.5);
		expect(fn(1)).toBe(1);
	});

	it("resolves 'easeInOutCosine' to the Foundry built-in", () => {
		const fn = resolveEasing("easeInOutCosine");
		expect(fn(0)).toBeCloseTo(0, 5);
		expect(fn(1)).toBeCloseTo(1, 5);
		expect(fn(0.5)).toBeCloseTo(0.5, 5);
	});

	it("falls back to easeInOutCosine for unknown names", () => {
		const fn = resolveEasing("nonexistent");
		const fallback = resolveEasing("easeInOutCosine");
		expect(fn(0.3)).toBeCloseTo(fallback(0.3), 10);
	});
});

describe("custom easing functions", () => {
	const customNames = [
		"easeInQuad", "easeOutQuad", "easeInOutQuad",
		"easeInCubic", "easeOutCubic", "easeInOutCubic",
		"easeOutBounce", "easeInBounce", "easeInOutBounce",
		"easeInElastic", "easeOutElastic",
	];

	for (const name of customNames) {
		describe(name, () => {
			it("returns 0 at t=0", () => {
				const fn = resolveEasing(name);
				expect(fn(0)).toBeCloseTo(0, 3);
			});

			it("returns 1 at t=1", () => {
				const fn = resolveEasing(name);
				expect(fn(1)).toBeCloseTo(1, 3);
			});

			it("returns a number at t=0.5", () => {
				const fn = resolveEasing(name);
				const mid = fn(0.5);
				expect(typeof mid).toBe("number");
				expect(Number.isFinite(mid)).toBe(true);
			});
		});
	}

	// Monotonicity tests for quad/cubic (known monotonic easings)
	const monotonic = [
		"easeInQuad", "easeOutQuad", "easeInOutQuad",
		"easeInCubic", "easeOutCubic", "easeInOutCubic",
	];

	for (const name of monotonic) {
		it(`${name} is monotonically non-decreasing`, () => {
			const fn = resolveEasing(name);
			let prev = fn(0);
			for (let t = 0.01; t <= 1.001; t += 0.01) {
				const clamped = Math.min(t, 1);
				const curr = fn(clamped);
				expect(curr).toBeGreaterThanOrEqual(prev - 1e-10);
				prev = curr;
			}
		});
	}
});

describe("listEasingNames", () => {
	it("returns an array of strings", () => {
		const names = listEasingNames();
		expect(Array.isArray(names)).toBe(true);
		expect(names.length).toBeGreaterThan(0);
		for (const n of names) {
			expect(typeof n).toBe("string");
		}
	});

	it("includes linear and easeInOutCosine", () => {
		const names = listEasingNames();
		expect(names).toContain("linear");
		expect(names).toContain("easeInOutCosine");
	});

	it("includes custom easings", () => {
		const names = listEasingNames();
		expect(names).toContain("easeInQuad");
		expect(names).toContain("easeOutBounce");
		expect(names).toContain("easeOutElastic");
	});
});
