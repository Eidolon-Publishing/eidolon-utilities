// ── Detail panel event handlers (delete, add-tween, delay, before/after) ─────

import { showEditJsonDialog, showEditStepStateDialog } from "../editor-dialogs.js";

/**
 * Bind detail panel events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindDetailPanelEvents(root, ctx) {
	// Delete entry
	root.querySelector("[data-action='delete-entry']")?.addEventListener("click", () => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.removeEntry(parsed.index));
			ctx.setSelectedPath(null);
		} else if (parsed.type === "branch") {
			ctx.mutate((s) => s.removeBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex));
			ctx.setSelectedPath(null);
		}
	});

	// Step duration input
	root.querySelector("[data-action='step-duration']")?.addEventListener("input", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const val = Number(e.target.value) || 0;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateStepDuration(parsed.index, val));
		} else if (parsed.type === "branch") {
			ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { duration: Math.max(0, val) }));
		}
	});

	// Add tween
	root.querySelector("[data-action='add-tween']")?.addEventListener("click", () => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.addTween(parsed.index));
		} else if (parsed.type === "branch") {
			const entry = ctx.getEntryAtPath(ctx.selectedPath);
			if (!entry) return;
			const defaultTween = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
			const tweens = [...(entry.tweens ?? []), defaultTween];
			ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens }));
		}
	});

	// Delay input
	root.querySelector("[data-action='change-delay']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const val = Number(e.target.value) || 0;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { delay: val }));
		} else if (parsed.type === "branch") {
			ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { delay: val }));
		}
	});

	// Setup/Landing editors
	root.querySelector("[data-action='edit-setup']")?.addEventListener("click", () => {
		showEditJsonDialog("setup", { state: ctx.state, mutate: ctx.mutate });
	});
	root.querySelector("[data-action='edit-landing']")?.addEventListener("click", () => {
		showEditJsonDialog("landing", { state: ctx.state, mutate: ctx.mutate });
	});

	// Before/After editors
	root.querySelector("[data-action='edit-before']")?.addEventListener("click", () => {
		showEditStepStateDialog("before", { selectedPath: ctx.selectedPath, state: ctx.state, mutate: ctx.mutate });
	});
	root.querySelector("[data-action='edit-after']")?.addEventListener("click", () => {
		showEditStepStateDialog("after", { selectedPath: ctx.selectedPath, state: ctx.state, mutate: ctx.mutate });
	});

	// Footer config
	root.querySelector("[data-action='change-trigger']")?.addEventListener("change", (e) => {
		ctx.mutate((s) => s.setTrigger(e.target.value));
	});
	root.querySelector("[data-action='change-tracking']")?.addEventListener("change", (e) => {
		ctx.mutate((s) => s.setTracking(e.target.checked));
	});
	root.querySelector("[data-action='change-synchronized']")?.addEventListener("change", (e) => {
		ctx.mutate((s) => s.setSynchronized(e.target.checked));
	});
}
