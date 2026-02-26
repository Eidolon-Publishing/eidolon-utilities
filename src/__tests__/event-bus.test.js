import { describe, it, expect, vi } from "vitest";
import { EventBus } from "../../scripts/tween/core/timeline/EventBus.js";

describe("EventBus", () => {
	it("delivers signals to listeners", () => {
		const bus = new EventBus();
		const fn = vi.fn();
		bus.on("test", fn);
		bus.emit("test");
		expect(fn).toHaveBeenCalledOnce();
		bus.destroy();
	});

	it("supports multiple listeners on the same signal", () => {
		const bus = new EventBus();
		const fn1 = vi.fn();
		const fn2 = vi.fn();
		bus.on("sig", fn1);
		bus.on("sig", fn2);
		bus.emit("sig");
		expect(fn1).toHaveBeenCalledOnce();
		expect(fn2).toHaveBeenCalledOnce();
		bus.destroy();
	});

	it("unsubscribe prevents further delivery", () => {
		const bus = new EventBus();
		const fn = vi.fn();
		const unsub = bus.on("sig", fn);
		unsub();
		bus.emit("sig");
		expect(fn).not.toHaveBeenCalled();
		bus.destroy();
	});

	it("does not deliver signals for different names", () => {
		const bus = new EventBus();
		const fn = vi.fn();
		bus.on("a", fn);
		bus.emit("b");
		expect(fn).not.toHaveBeenCalled();
		bus.destroy();
	});

	it("waitFor resolves when signal fires", async () => {
		const bus = new EventBus();
		const p = bus.waitFor("done");
		bus.emit("done");
		await expect(p).resolves.toBeUndefined();
		bus.destroy();
	});

	it("waitFor rejects when abort signal fires", async () => {
		const bus = new EventBus();
		const ac = new AbortController();
		const p = bus.waitFor("done", ac.signal);
		ac.abort("test-abort");
		await expect(p).rejects.toBe("test-abort");
		bus.destroy();
	});

	it("waitFor rejects immediately if already aborted", async () => {
		const bus = new EventBus();
		const ac = new AbortController();
		ac.abort("pre-aborted");
		const p = bus.waitFor("done", ac.signal);
		await expect(p).rejects.toBe("pre-aborted");
		bus.destroy();
	});

	it("destroy prevents further emissions", () => {
		const bus = new EventBus();
		const fn = vi.fn();
		bus.on("sig", fn);
		bus.destroy();
		bus.emit("sig");
		expect(fn).not.toHaveBeenCalled();
	});

	it("destroy causes waitFor to reject", async () => {
		const bus = new EventBus();
		bus.destroy();
		await expect(bus.waitFor("sig")).rejects.toThrow("EventBus destroyed");
	});

	it("waitFor resolves immediately if signal was already emitted", async () => {
		const bus = new EventBus();
		bus.emit("ready");
		// No listener was registered before emit — waitFor should still resolve
		await expect(bus.waitFor("ready")).resolves.toBeUndefined();
		bus.destroy();
	});
});
