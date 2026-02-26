import { describe, it, expect, vi } from "vitest";
import { registerTweenType } from "../../scripts/tween/core/registry.js";
import { TweenTimeline } from "../../scripts/tween/core/timeline/TweenTimeline.js";
import {
	validateSequenceJSON,
	validateSequenceSemantics,
	compileSequence,
} from "../../scripts/tween/core/timeline/schema.js";
import { registerAwaitProvider } from "../../scripts/tween/core/timeline/await-providers.js";

// ── Test helpers ──────────────────────────────────────────────────────────

let nextTypeId = 0;
function uniqueType(prefix) {
	nextTypeId += 1;
	return `${prefix}-${nextTypeId}`;
}

/** Register a tween type that tracks execution order and supports signal-based completion. */
function registerTrackingType(typeName) {
	const calls = [];
	registerTweenType({
		type: typeName,
		validate: () => {},
		execute: async (_params, opts = {}) => {
			const durationMS = opts.durationMS ?? 50;
			return new Promise((resolve) => {
				const timer = setTimeout(() => {
					calls.push(typeName);
					resolve(true);
				}, durationMS);
				opts.signal?.addEventListener("abort", () => {
					clearTimeout(timer);
					resolve(false);
				}, { once: true });
			});
		},
	});
	return calls;
}

// ── Emit / Signal tests ──────────────────────────────────────────────────

describe("emit and await(signal)", () => {
	it("emit fires signal that await(signal) receives across parallel branches", async () => {
		const type = uniqueType("sig-test");
		const calls = registerTrackingType(type);

		// Sticky signals: emit branch can fire before the await branch
		// registers its listener — waitFor resolves immediately.
		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => {
						sub.emit("ready");
					},
					(sub) => {
						sub.await({ event: "signal", name: "ready" });
						sub.step().add(type, {}, { durationMS: 10 });
					},
				],
				{ join: "all", overflow: "detach" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(calls).toContain(type);
	});

	it("emit as a standalone segment is non-blocking", async () => {
		const type = uniqueType("emit-standalone");
		const calls = registerTrackingType(type);

		const outcome = await new TweenTimeline()
			.emit("some-signal")
			.step().add(type, {}, { durationMS: 10 })
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(calls.length).toBe(1);
	});
});

// ── Await tests ──────────────────────────────────────────────────────────

describe("await segments", () => {
	it("await(signal) blocks until signal is emitted", async () => {
		const type = uniqueType("await-sig");
		const calls = registerTrackingType(type);

		// Emit comes from a parallel branch, await in the other.
		// Sticky signals ensure order-independence.
		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => {
						sub.emit("go");
					},
					(sub) => {
						sub.await({ event: "signal", name: "go" });
						sub.step().add(type, {}, { durationMS: 10 });
					},
				],
				{ join: "all" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(calls).toContain(type);
	});

	it("await aborts cleanly when timeline is cancelled", async () => {
		// Register a custom provider that never resolves on its own
		registerAwaitProvider("__test-never", (_config, ctx) => {
			return new Promise((_resolve, reject) => {
				ctx.signal.addEventListener("abort", () => reject(ctx.signal.reason), { once: true });
			});
		});

		const handle = new TweenTimeline()
			.await({ event: "__test-never" })
			.run({ broadcast: false, commit: false });

		// Cancel after a short delay
		setTimeout(() => handle.cancel("test-cancel"), 20);

		const outcome = await handle.result;
		expect(outcome.status).toBe("cancelled");
		expect(outcome.reason).toBe("test-cancel");
	});
});

// ── Parallel tests ───────────────────────────────────────────────────────

describe("parallel segments", () => {
	it("join:all waits for all branches to complete", async () => {
		const fast = uniqueType("fast");
		const slow = uniqueType("slow");
		const fastCalls = registerTrackingType(fast);
		const slowCalls = registerTrackingType(slow);

		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => sub.step().add(fast, {}, { durationMS: 10 }),
					(sub) => sub.step().add(slow, {}, { durationMS: 50 }),
				],
				{ join: "all" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(fastCalls.length).toBe(1);
		expect(slowCalls.length).toBe(1);
	});

	it("join:any completes when first branch finishes", async () => {
		const fast = uniqueType("any-fast");
		const fastCalls = registerTrackingType(fast);

		const slowType = uniqueType("any-slow");
		registerTweenType({
			type: slowType,
			validate: () => {},
			execute: async (_params, opts = {}) => {
				return new Promise((resolve) => {
					const timer = setTimeout(() => resolve(true), 5000);
					opts.signal?.addEventListener("abort", () => {
						clearTimeout(timer);
						resolve(false);
					}, { once: true });
				});
			},
		});

		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => sub.step().add(fast, {}, { durationMS: 10 }),
					(sub) => sub.step().add(slowType, {}, { durationMS: 5000 }),
				],
				{ join: "any", overflow: "cancel" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(fastCalls.length).toBe(1);
	});

	it("join:N waits for N branches", async () => {
		const type1 = uniqueType("n1");
		const type2 = uniqueType("n2");
		const calls1 = registerTrackingType(type1);
		const calls2 = registerTrackingType(type2);

		const slowType = uniqueType("n-slow");
		registerTweenType({
			type: slowType,
			validate: () => {},
			execute: async (_params, opts = {}) => {
				return new Promise((resolve) => {
					const timer = setTimeout(() => resolve(true), 5000);
					opts.signal?.addEventListener("abort", () => {
						clearTimeout(timer);
						resolve(false);
					}, { once: true });
				});
			},
		});

		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => sub.step().add(type1, {}, { durationMS: 10 }),
					(sub) => sub.step().add(type2, {}, { durationMS: 20 }),
					(sub) => sub.step().add(slowType, {}, { durationMS: 5000 }),
				],
				{ join: 2, overflow: "cancel" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(calls1.length).toBe(1);
		expect(calls2.length).toBe(1);
	});

	it("overflow:cancel aborts un-joined branches", async () => {
		const fast = uniqueType("cancel-fast");
		registerTrackingType(fast);

		let slowAborted = false;
		const slowType = uniqueType("cancel-slow");
		registerTweenType({
			type: slowType,
			validate: () => {},
			execute: async (_params, opts = {}) => {
				return new Promise((resolve) => {
					const timer = setTimeout(() => resolve(true), 5000);
					opts.signal?.addEventListener("abort", () => {
						clearTimeout(timer);
						slowAborted = true;
						resolve(false);
					}, { once: true });
				});
			},
		});

		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => sub.step().add(fast, {}, { durationMS: 10 }),
					(sub) => sub.step().add(slowType, {}, { durationMS: 5000 }),
				],
				{ join: "any", overflow: "cancel" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		// Give a tick for the abort to propagate
		await new Promise((r) => setTimeout(r, 50));
		expect(slowAborted).toBe(true);
	});

	it("nested parallel works", async () => {
		const type = uniqueType("nested");
		const calls = registerTrackingType(type);

		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => {
						sub.parallel(
							[
								(inner) => inner.step().add(type, {}, { durationMS: 10 }),
								(inner) => inner.step().add(type, {}, { durationMS: 10 }),
							],
							{ join: "all" }
						);
					},
					(sub) => sub.step().add(type, {}, { durationMS: 10 }),
				],
				{ join: "all" }
			)
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(calls.length).toBe(3);
	});
});

// ── Serialization round-trip ─────────────────────────────────────────────

describe("toJSON / compileSequence round-trip", () => {
	it("round-trips a timeline with await, emit, and parallel", () => {
		const type = uniqueType("rt");
		registerTweenType({ type, validate: () => {}, execute: async () => true });

		const original = new TweenTimeline()
			.step().add(type, { x: 1 }, { durationMS: 500 })
			.await({ event: "click" })
			.emit("flash-done")
			.parallel(
				[
					(sub) => {
						sub.step().add(type, { x: 2 }, { durationMS: 100 });
						sub.emit("branch-a-done");
					},
					(sub) => {
						sub.await({ event: "signal", name: "branch-a-done" });
						sub.step().add(type, { x: 3 });
					},
				],
				{ join: "all", overflow: "detach" }
			)
			.delay(200)
			.toJSON();

		// Compile from JSON
		const compiled = compileSequence(original);
		const reJSON = compiled.toJSON();

		// Timeline arrays should match structurally
		expect(reJSON.timeline.length).toBe(original.timeline.length);

		// Step
		expect(reJSON.timeline[0]).toEqual(original.timeline[0]);

		// Await
		expect(reJSON.timeline[1]).toEqual(original.timeline[1]);

		// Emit
		expect(reJSON.timeline[2]).toEqual(original.timeline[2]);

		// Parallel
		expect(reJSON.timeline[3].parallel.join).toBe("all");
		expect(reJSON.timeline[3].parallel.overflow).toBe("detach");
		expect(reJSON.timeline[3].parallel.branches.length).toBe(2);

		// Delay
		expect(reJSON.timeline[4]).toEqual({ delay: 200 });
	});
});

// ── Schema validation ────────────────────────────────────────────────────

describe("validateSequenceJSON v2 segments", () => {
	it("accepts await segment", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ await: { event: "click" } }],
		})).not.toThrow();
	});

	it("accepts signal await with name", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ await: { event: "signal", name: "foo" } }],
		})).not.toThrow();
	});

	it("rejects signal await without name", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ await: { event: "signal" } }],
		})).toThrow(/name/);
	});

	it("accepts emit segment", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ emit: "done" }],
		})).not.toThrow();
	});

	it("rejects empty emit", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ emit: "" }],
		})).toThrow(/non-empty/);
	});

	it("accepts parallel segment", () => {
		expect(() => validateSequenceJSON({
			timeline: [{
				parallel: {
					branches: [
						[{ delay: 100 }],
						[{ emit: "x" }],
					],
					join: "all",
					overflow: "detach",
				},
			}],
		})).not.toThrow();
	});

	it("rejects parallel with empty branches", () => {
		expect(() => validateSequenceJSON({
			timeline: [{
				parallel: { branches: [], join: "all" },
			}],
		})).toThrow(/non-empty/);
	});

	it("rejects parallel with invalid join", () => {
		expect(() => validateSequenceJSON({
			timeline: [{
				parallel: { branches: [[]], join: 5 },
			}],
		})).toThrow(/join/);
	});

	it("rejects parallel with invalid overflow", () => {
		expect(() => validateSequenceJSON({
			timeline: [{
				parallel: { branches: [[]], join: "all", overflow: "explode" },
			}],
		})).toThrow(/overflow/);
	});

	it("validates nested parallel branches recursively", () => {
		expect(() => validateSequenceJSON({
			timeline: [{
				parallel: {
					branches: [
						[{ await: { event: "signal" } }], // missing name
					],
					join: "all",
				},
			}],
		})).toThrow(/name/);
	});
});

// ── Builder validation ──────────────────────────────────────────────────

describe("TweenTimeline builder validation", () => {
	it("rejects parallel with join > branches.length", () => {
		expect(() => {
			new TweenTimeline().parallel(
				[(sub) => {}, (sub) => {}],
				{ join: 5 }
			);
		}).toThrow(/join/);
	});

	it("rejects parallel with invalid overflow", () => {
		expect(() => {
			new TweenTimeline().parallel(
				[(sub) => {}],
				{ overflow: "explode" }
			);
		}).toThrow(/overflow/);
	});
});

// ── Await timeout tests ─────────────────────────────────────────────────

describe("await timeout", () => {
	it("await with timeout resolves after timeout if event never fires", async () => {
		// Register a provider that never resolves
		registerAwaitProvider("__test-hang", (_config, ctx) => {
			return new Promise((_resolve, reject) => {
				ctx.signal.addEventListener("abort", () => reject(ctx.signal.reason), { once: true });
			});
		});

		const type = uniqueType("after-timeout");
		const calls = registerTrackingType(type);

		const outcome = await new TweenTimeline()
			.await({ event: "__test-hang", timeout: 50 })
			.step().add(type, {}, { durationMS: 10 })
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(calls).toContain(type);
	});

	it("await with timeout resolves early if event fires before timeout", async () => {
		const type = uniqueType("early-resolve");
		const calls = registerTrackingType(type);

		const start = Date.now();
		const outcome = await new TweenTimeline()
			.parallel(
				[
					(sub) => {
						sub.emit("fast");
					},
					(sub) => {
						sub.await({ event: "signal", name: "fast", timeout: 5000 });
						sub.step().add(type, {}, { durationMS: 10 });
					},
				],
				{ join: "all" }
			)
			.run({ broadcast: false, commit: false }).result;

		const elapsed = Date.now() - start;
		expect(outcome.status).toBe("completed");
		expect(calls).toContain(type);
		expect(elapsed).toBeLessThan(1000); // should not wait 5s
	});

	it("rejects await with non-positive timeout in schema", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ await: { event: "click", timeout: 0 } }],
		})).toThrow(/timeout.*positive/);

		expect(() => validateSequenceJSON({
			timeline: [{ await: { event: "click", timeout: -100 } }],
		})).toThrow(/timeout.*positive/);
	});

	it("accepts await with valid timeout in schema", () => {
		expect(() => validateSequenceJSON({
			timeline: [{ await: { event: "click", timeout: 5000 } }],
		})).not.toThrow();
	});
});

// ── Parallel depth guard ─────────────────────────────────────────────────

describe("parallel depth guard", () => {
	it("rejects parallel nesting deeper than 8", () => {
		// Build 9 levels of nesting
		function buildNested(depth) {
			if (depth === 0) return [{ delay: 10 }];
			return [{
				parallel: {
					branches: [buildNested(depth - 1)],
					join: "all",
				},
			}];
		}

		// 8 levels should pass
		expect(() => validateSequenceJSON({
			timeline: buildNested(8),
		})).not.toThrow();

		// 9 levels should fail
		expect(() => validateSequenceJSON({
			timeline: buildNested(9),
		})).toThrow(/maximum parallel nesting depth/);
	});
});
