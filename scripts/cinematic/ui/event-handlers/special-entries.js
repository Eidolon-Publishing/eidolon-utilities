// ── Special entry event handlers (await, emit, transitionTo, parallel) ───────

import { showEditParallelJsonDialog } from "../editor-dialogs.js";

/**
 * Bind events for special entry types: await, emit, transitionTo, parallel.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindSpecialEntryEvents(root, ctx) {
	// ── Await detail ─────────────────────────────────────────────────────

	root.querySelector("[data-action='change-await-event']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.await) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, event: e.target.value } }));
		}
	});

	root.querySelector("[data-action='change-await-signal']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.await) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, signal: e.target.value } }));
		}
	});

	root.querySelector("[data-action='change-await-target']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.await) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, target: e.target.value } }));
		}
	});

	root.querySelector("[data-action='pick-await-target']")?.addEventListener("click", async () => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.await) return;
		const { enterPickMode } = await import("../../../placeable-picker/ui/pick-mode.js");
		enterPickMode({
			placeableType: "Tile",
			onPick: (doc) => {
				const tags = doc.flags?.tagger?.tags;
				const selector = tags?.length ? `tag:${tags[0]}` : `id:${doc.id}`;
				if (parsed.type === "timeline") {
					ctx.mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, target: selector } }));
				}
			},
		});
	});

	// Animation config for tile-click await
	for (const [action, key] of [["change-anim-idle", "idle"], ["change-anim-hover", "hover"], ["change-anim-dim", "dim"]]) {
		root.querySelector(`[data-action='${action}']`)?.addEventListener("change", (e) => {
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed) return;
			const entry = ctx.getEntryAtPath(ctx.selectedPath);
			if (!entry?.await) return;
			const raw = e.target.value.trim();
			const names = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
			const animation = { ...(entry.await.animation ?? {}) };
			if (names?.length) animation[key] = names.length === 1 ? names[0] : names;
			else delete animation[key];
			const awaitObj = { ...entry.await, animation: Object.keys(animation).length ? animation : undefined };
			if (!awaitObj.animation) delete awaitObj.animation;
			if (parsed.type === "timeline") {
				ctx.mutate((s) => s.updateEntry(parsed.index, { await: awaitObj }));
			}
		});
	}

	// ── Emit detail ──────────────────────────────────────────────────────

	root.querySelector("[data-action='change-emit-signal']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { emit: e.target.value }));
		}
	});

	// ── TransitionTo detail ──────────────────────────────────────────────

	root.querySelector("[data-action='change-transition-cinematic']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.transitionTo) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { transitionTo: { ...entry.transitionTo, cinematic: e.target.value } }));
		}
	});

	root.querySelector("[data-action='change-transition-scene']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.transitionTo) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { transitionTo: { ...entry.transitionTo, scene: e.target.value } }));
		}
	});

	// ── Parallel detail ──────────────────────────────────────────────────

	root.querySelector("[data-action='change-parallel-join']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed || parsed.type !== "timeline") return;
		const entry = ctx.state.timeline[parsed.index];
		if (!entry?.parallel) return;
		ctx.mutate((s) => s.updateEntry(parsed.index, { parallel: { ...entry.parallel, join: e.target.value } }));
	});

	root.querySelector("[data-action='change-parallel-overflow']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed || parsed.type !== "timeline") return;
		const entry = ctx.state.timeline[parsed.index];
		if (!entry?.parallel) return;
		ctx.mutate((s) => s.updateEntry(parsed.index, { parallel: { ...entry.parallel, overflow: e.target.value } }));
	});

	root.querySelector("[data-action='edit-parallel-json']")?.addEventListener("click", () => {
		showEditParallelJsonDialog({ selectedPath: ctx.selectedPath, state: ctx.state, mutate: ctx.mutate });
	});

	// Parallel branch management
	root.querySelector("[data-action='add-branch']")?.addEventListener("click", () => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed || parsed.type !== "timeline") return;
		ctx.mutate((s) => s.addBranch(parsed.index));
	});

	root.querySelectorAll("[data-action='remove-branch']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const bi = Number(btn.dataset.branchIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
			ctx.mutate((s) => s.removeBranch(parsed.index, bi));
		});
	});

	root.querySelectorAll("[data-action='add-branch-step']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const bi = Number(btn.dataset.branchIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
			ctx.mutate((s) => s.addBranchEntry(parsed.index, bi, { tweens: [] }));
		});
	});

	root.querySelectorAll("[data-action='add-branch-delay']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const bi = Number(btn.dataset.branchIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
			ctx.mutate((s) => s.addBranchEntry(parsed.index, bi, { delay: 1000 }));
		});
	});

	root.querySelectorAll("[data-action='add-branch-sound']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const bi = Number(btn.dataset.branchIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
			ctx.mutate((s) => s.addBranchEntry(parsed.index, bi, { sound: { src: "", volume: 0.8, loop: false, duration: 0, fireAndForget: false } }));
		});
	});

	root.querySelectorAll("[data-action='add-branch-stopSound']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const bi = Number(btn.dataset.branchIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
			ctx.mutate((s) => s.addBranchEntry(parsed.index, bi, { stopSound: "" }));
		});
	});

	root.querySelectorAll("[data-action='remove-branch-entry']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const bi = Number(btn.dataset.branchIndex);
			const bei = Number(btn.dataset.branchEntryIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi) || Number.isNaN(bei)) return;
			ctx.mutate((s) => s.removeBranchEntry(parsed.index, bi, bei));
		});
	});
}
