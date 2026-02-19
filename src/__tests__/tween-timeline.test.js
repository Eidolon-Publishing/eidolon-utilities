import { describe, it, expect } from "vitest";
import { registerTweenType } from "../../scripts/tween/core/registry.js";
import { TweenTimeline } from "../../scripts/tween/core/timeline/TweenTimeline.js";
import {
	validateSequenceJSON,
	validateSequenceSemantics,
	compileSequence,
} from "../../scripts/tween/core/timeline/schema.js";

let nextTypeId = 0;
function uniqueType(prefix) {
	nextTypeId += 1;
	return `${prefix}-${nextTypeId}`;
}

describe("TweenTimeline outcomes and cancellation", () => {
	it("returns cancelled outcome quickly when aborted mid-step", async () => {
		const type = uniqueType("test-long");
		registerTweenType({
			type,
			validate: () => {},
			execute: async (_params, opts = {}) => {
				return new Promise((resolve) => {
					const timer = setTimeout(() => resolve(true), 250);
					opts.signal?.addEventListener("abort", () => {
						clearTimeout(timer);
						resolve(false);
					}, { once: true });
				});
			},
		});

		const handle = new TweenTimeline()
			.step()
			.add(type, {})
			.run({ broadcast: false, commit: false });

		handle.cancel("unit-test-cancel");

		const outcome = await handle.result;
		expect(outcome.status).toBe("cancelled");
		expect(outcome.reason).toBe("unit-test-cancel");
		expect(await handle.finished).toBe(false);
	});

	it("continues through hook failures when errorPolicy is continue", async () => {
		const type = uniqueType("test-ok");
		let executions = 0;
		registerTweenType({
			type,
			validate: () => {},
			execute: async () => {
				executions += 1;
				return true;
			},
		});

		const outcome = await new TweenTimeline()
			.errorPolicy("continue")
			.beforeAll(() => {
				throw new Error("beforeAll failure");
			})
			.step()
			.before(() => {
				throw new Error("step before failure");
			})
			.add(type, {})
			.step()
			.add(type, {})
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("completed");
		expect(executions).toBe(1);
		expect(Array.isArray(outcome.errors)).toBe(true);
		expect(outcome.errors.length).toBeGreaterThanOrEqual(2);
	});

	it("returns failed outcome for unknown tween type under abort policy", async () => {
		const outcome = await new TweenTimeline()
			.step()
			.add(uniqueType("missing-type"), {})
			.run({ broadcast: false, commit: false }).result;

		expect(outcome.status).toBe("failed");
		expect(outcome.phase).toBe("entry");
	});
});

describe("Sequence semantic validation", () => {
	it("rejects invalid tween params during semantic validation", () => {
		const type = uniqueType("test-validated");
		registerTweenType({
			type,
			validate: (params) => {
				if (typeof params.level !== "number") {
					throw new Error("level must be a number");
				}
			},
			execute: async () => true,
		});

		const payload = {
			timeline: [
				[{ type, params: { level: "bad" } }],
			],
		};

		expect(() => validateSequenceJSON(payload)).not.toThrow();
		expect(() => validateSequenceSemantics(payload)).toThrow(/timeline\[0\]\[0\]/);
		expect(() => compileSequence(payload, { validateSemantics: true })).toThrow();
	});
});

