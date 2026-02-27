// ── Special entry event handlers (emit, parallel) ───────────────────────────
// Note: await and transitionTo are no longer timeline-level entries in v4.
// Gates live on segment boundaries; transitions use segment `next` edges.
// Signal-await in parallel branches is still handled via branch entry editing.

import { showEditParallelJsonDialog } from "../editor-dialogs.js";

/**
 * Bind events for special entry types: emit, parallel.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindSpecialEntryEvents(root, ctx) {
	// ── Emit detail ──────────────────────────────────────────────────────

	root.querySelector("[data-action='change-emit-signal']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { emit: e.target.value }));
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
