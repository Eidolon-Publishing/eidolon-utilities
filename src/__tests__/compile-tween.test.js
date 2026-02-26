import { describe, it, expect, vi } from "vitest";

// Mock Foundry globals
globalThis.foundry = {
	utils: {
		deepClone: (o) => JSON.parse(JSON.stringify(o)),
	},
};

vi.mock("../../scripts/time-triggers/core/constants.js", () => ({
	MODULE_ID: "eidolon-utilities",
}));

const { compileTween } = await import("../../scripts/cinematic/runtime.js");

// Helper: create a targets map with a mock resolved target
function makeTargets(entries = {}) {
	const map = new Map();
	for (const [selector, uuid] of Object.entries(entries)) {
		map.set(selector, {
			kind: "placeable",
			placeable: {},
			doc: { uuid },
		});
	}
	return map;
}

describe("compileTween", () => {
	// ── Basic field routing ──────────────────────────────────────────────

	it("routes duration to opts.durationMS", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 1, duration: 3000 },
			targets,
		);
		expect(result.opts.durationMS).toBe(3000);
		expect(result.opts.duration).toBeUndefined();
	});

	it("routes attribute and value to params for tile-prop", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 0.5, duration: 1000 },
			targets,
		);
		expect(result.params.attribute).toBe("alpha");
		expect(result.params.value).toBe(0.5);
		expect(result.params.uuid).toBe("Scene.x.Tile.y");
	});

	it("routes easing to opts", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 1, duration: 1000, easing: "linear" },
			targets,
		);
		expect(result.opts.easing).toBe("linear");
	});

	// ── $particles target ───────────────────────────────────────────────

	it("sets params.target for $particles", () => {
		const targets = new Map();
		targets.set("$particles", { kind: "particles", target: {} });
		const result = compileTween(
			{ type: "particles-prop", target: "$particles", attribute: "alpha", value: 0, duration: 2000 },
			targets,
		);
		expect(result.params.target).toBe("$particles");
		expect(result.params.uuid).toBeUndefined();
	});

	// ── UUID resolution ─────────────────────────────────────────────────

	it("resolves tag target to uuid", () => {
		const targets = makeTargets({ "tag:Torch": "Scene.abc.AmbientLight.def" });
		const result = compileTween(
			{ type: "light-color", target: "tag:Torch", toColor: "#ff0000", duration: 1000 },
			targets,
		);
		expect(result.params.uuid).toBe("Scene.abc.AmbientLight.def");
	});

	it("returns null for unresolvable target", () => {
		const targets = makeTargets({});
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Missing", attribute: "alpha", value: 1, duration: 1000 },
			targets,
		);
		expect(result).toBeNull();
	});

	// ── Missing type ────────────────────────────────────────────────────

	it("returns null when type is missing", () => {
		const targets = makeTargets({});
		const result = compileTween(
			{ target: "tag:Map", attribute: "alpha", value: 1, duration: 1000 },
			targets,
		);
		expect(result).toBeNull();
	});

	// ── Detach flag ─────────────────────────────────────────────────────

	it("passes through detach flag", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 1, duration: 1000, detach: true },
			targets,
		);
		expect(result.detach).toBe(true);
	});

	it("defaults detach to false", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 1, duration: 1000 },
			targets,
		);
		expect(result.detach).toBe(false);
	});

	// ── Unknown fields route to params ──────────────────────────────────

	it("routes unknown fields to params as best guess", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 1, duration: 1000, customField: "hello" },
			targets,
		);
		expect(result.params.customField).toBe("hello");
	});

	// ── No target ───────────────────────────────────────────────────────

	it("handles empty target gracefully (no uuid set)", () => {
		const targets = makeTargets({});
		const result = compileTween(
			{ type: "tile-prop", attribute: "alpha", value: 1, duration: 1000 },
			targets,
		);
		expect(result.params.uuid).toBeUndefined();
		expect(result.type).toBe("tile-prop");
	});

	// ── light-color params routing ──────────────────────────────────────

	it("routes light-color params correctly", () => {
		const targets = makeTargets({ "tag:Torch": "Scene.abc.AmbientLight.def" });
		const result = compileTween(
			{ type: "light-color", target: "tag:Torch", toColor: "#ff0000", toAlpha: 0.8, mode: "oklch", duration: 2000 },
			targets,
		);
		expect(result.params.toColor).toBe("#ff0000");
		expect(result.params.toAlpha).toBe(0.8);
		expect(result.params.mode).toBe("oklch");
		expect(result.opts.durationMS).toBe(2000);
	});

	// ── light-state params routing ──────────────────────────────────────

	it("routes light-state params correctly", () => {
		const targets = makeTargets({ "tag:Torch": "Scene.abc.AmbientLight.def" });
		const result = compileTween(
			{ type: "light-state", target: "tag:Torch", enabled: true, duration: 1500 },
			targets,
		);
		expect(result.params.enabled).toBe(true);
		expect(result.opts.durationMS).toBe(1500);
	});

	// ── Return shape ────────────────────────────────────────────────────

	it("returns correct shape with type, params, opts, detach", () => {
		const targets = makeTargets({ "tag:Map": "Scene.x.Tile.y" });
		const result = compileTween(
			{ type: "tile-prop", target: "tag:Map", attribute: "alpha", value: 1, duration: 1000 },
			targets,
		);
		expect(result).toHaveProperty("type");
		expect(result).toHaveProperty("params");
		expect(result).toHaveProperty("opts");
		expect(result).toHaveProperty("detach");
	});
});
