import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Foundry globals
globalThis.foundry = {
	utils: {
		deepClone: (o) => JSON.parse(JSON.stringify(o)),
		objectsEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
	},
};

vi.mock("../../scripts/time-triggers/core/constants.js", () => ({
	MODULE_ID: "eidolon-utilities",
}));

const { CinematicState } = await import("../../scripts/cinematic/ui/cinematic-state.js");

describe("CinematicState", () => {
	// ── Empty state shape ───────────────────────────────────────────────

	describe("empty state", () => {
		it("returns the correct empty shape", () => {
			const empty = CinematicState.empty();
			expect(empty).toEqual({
				version: 2,
				trigger: "canvasReady",
				tracking: true,
				setup: {},
				landing: {},
				timeline: [],
			});
		});

		it("creates a state with empty data when constructed with null", () => {
			const state = new CinematicState(null);
			expect(state.isEmpty).toBe(true);
			expect(state.trigger).toBe("canvasReady");
			expect(state.tracking).toBe(true);
			expect(state.setup).toEqual({});
			expect(state.landing).toEqual({});
			expect(state.timeline).toEqual([]);
		});
	});

	// ── addStep ──────────────────────────────────────────────────────────

	describe("addStep", () => {
		it("appends a step entry to empty timeline", () => {
			const state = new CinematicState(null);
			const next = state.addStep();
			expect(next.timeline).toHaveLength(1);
			expect(next.timeline[0]).toEqual({ tweens: [] });
		});

		it("inserts at specific index", () => {
			let state = new CinematicState(null);
			state = state.addStep(); // index 0
			state = state.addDelay(-1, 500); // index 1
			state = state.addStep(1); // insert at index 1
			expect(state.timeline).toHaveLength(3);
			expect(state.timeline[1]).toEqual({ tweens: [] });
			expect(state.timeline[2]).toEqual({ delay: 500 });
		});
	});

	// ── addDelay ─────────────────────────────────────────────────────────

	describe("addDelay", () => {
		it("appends a delay entry with default 1000ms", () => {
			const state = new CinematicState(null);
			const next = state.addDelay();
			expect(next.timeline).toHaveLength(1);
			expect(next.timeline[0]).toEqual({ delay: 1000 });
		});

		it("uses custom ms value", () => {
			const state = new CinematicState(null);
			const next = state.addDelay(-1, 2500);
			expect(next.timeline[0].delay).toBe(2500);
		});
	});

	// ── addAwait ─────────────────────────────────────────────────────────

	describe("addAwait", () => {
		it("appends an await entry with default click config", () => {
			const state = new CinematicState(null);
			const next = state.addAwait();
			expect(next.timeline).toHaveLength(1);
			expect(next.timeline[0]).toEqual({ await: { event: "click" } });
		});

		it("uses custom config", () => {
			const state = new CinematicState(null);
			const next = state.addAwait(-1, { event: "signal", name: "fog-done" });
			expect(next.timeline[0].await).toEqual({ event: "signal", name: "fog-done" });
		});
	});

	// ── addEmit ──────────────────────────────────────────────────────────

	describe("addEmit", () => {
		it("appends an emit entry", () => {
			const state = new CinematicState(null);
			const next = state.addEmit(-1, "my-signal");
			expect(next.timeline).toHaveLength(1);
			expect(next.timeline[0]).toEqual({ emit: "my-signal" });
		});
	});

	// ── addParallel ──────────────────────────────────────────────────────

	describe("addParallel", () => {
		it("appends a parallel entry with 2 empty branches", () => {
			const state = new CinematicState(null);
			const next = state.addParallel();
			expect(next.timeline).toHaveLength(1);
			expect(next.timeline[0].parallel).toEqual({
				branches: [[], []],
				join: "all",
				overflow: "detach",
			});
		});
	});

	// ── moveEntry ────────────────────────────────────────────────────────

	describe("moveEntry", () => {
		it("moves an entry from one position to another", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			state = state.addDelay(-1, 500);
			state = state.addEmit(-1, "sig");
			// Move delay (index 1) to index 0
			state = state.moveEntry(1, 0);
			expect(state.timeline[0]).toEqual({ delay: 500 });
			expect(state.timeline[1]).toEqual({ tweens: [] });
		});

		it("returns same state for identical indices", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			const same = state.moveEntry(0, 0);
			expect(same).toBe(state);
		});

		it("returns same state for out-of-bounds indices", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			const same = state.moveEntry(-1, 0);
			expect(same).toBe(state);
		});
	});

	// ── removeEntry ──────────────────────────────────────────────────────

	describe("removeEntry", () => {
		it("removes entry at given index", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			state = state.addDelay();
			state = state.removeEntry(0);
			expect(state.timeline).toHaveLength(1);
			expect(state.timeline[0]).toEqual({ delay: 1000 });
		});

		it("returns same state for out-of-bounds index", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			const same = state.removeEntry(5);
			expect(same).toBe(state);
		});
	});

	// ── updateEntry ──────────────────────────────────────────────────────

	describe("updateEntry", () => {
		it("patches an existing entry", () => {
			let state = new CinematicState(null);
			state = state.addDelay(-1, 500);
			state = state.updateEntry(0, { delay: 2000 });
			expect(state.timeline[0].delay).toBe(2000);
		});
	});

	// ── addTween / updateTween / removeTween ─────────────────────────────

	describe("tween mutations", () => {
		let state;
		beforeEach(() => {
			state = new CinematicState(null);
			state = state.addStep();
		});

		it("addTween adds a default tween", () => {
			state = state.addTween(0);
			expect(state.timeline[0].tweens).toHaveLength(1);
			expect(state.timeline[0].tweens[0].type).toBe("tile-prop");
		});

		it("addTween with custom tween", () => {
			const custom = { type: "light-color", target: "tag:Torch", toColor: "#ff0000", duration: 3000 };
			state = state.addTween(0, custom);
			expect(state.timeline[0].tweens[0]).toEqual(custom);
		});

		it("updateTween patches a tween", () => {
			state = state.addTween(0);
			state = state.updateTween(0, 0, { duration: 5000 });
			expect(state.timeline[0].tweens[0].duration).toBe(5000);
		});

		it("removeTween removes a tween", () => {
			state = state.addTween(0);
			state = state.addTween(0);
			expect(state.timeline[0].tweens).toHaveLength(2);
			state = state.removeTween(0, 0);
			expect(state.timeline[0].tweens).toHaveLength(1);
		});
	});

	// ── Immutability ─────────────────────────────────────────────────────

	describe("immutability", () => {
		it("mutations return a new CinematicState", () => {
			const state = new CinematicState(null);
			const next = state.addStep();
			expect(next).not.toBe(state);
			expect(state.timeline).toHaveLength(0);
			expect(next.timeline).toHaveLength(1);
		});

		it("original data is not mutated after addTween", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			const original = state.timeline[0];
			state.addTween(0);
			expect(original.tweens).toHaveLength(0);
		});
	});

	// ── setTrigger / setTracking ─────────────────────────────────────────

	describe("setTrigger", () => {
		it("changes trigger", () => {
			const state = new CinematicState(null);
			const next = state.setTrigger("manual");
			expect(next.trigger).toBe("manual");
			expect(state.trigger).toBe("canvasReady");
		});
	});

	describe("setTracking", () => {
		it("changes tracking", () => {
			const state = new CinematicState(null);
			const next = state.setTracking(false);
			expect(next.tracking).toBe(false);
			expect(state.tracking).toBe(true);
		});
	});

	// ── setSetup / setLanding ────────────────────────────────────────────

	describe("setSetup", () => {
		it("replaces setup", () => {
			const state = new CinematicState(null);
			const next = state.setSetup({ "tag:Map": { alpha: 0 } });
			expect(next.setup).toEqual({ "tag:Map": { alpha: 0 } });
		});
	});

	describe("setLanding", () => {
		it("replaces landing", () => {
			const state = new CinematicState(null);
			const next = state.setLanding({ "tag:Map": { alpha: 1 } });
			expect(next.landing).toEqual({ "tag:Map": { alpha: 1 } });
		});
	});

	// ── toJSON ───────────────────────────────────────────────────────────

	describe("toJSON", () => {
		it("returns a deep clone of internal data", () => {
			let state = new CinematicState(null);
			state = state.addStep();
			const json = state.toJSON();
			json.timeline.push({ delay: 999 });
			expect(state.timeline).toHaveLength(1);
		});
	});
});
