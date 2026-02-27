// ── Swimlane event handlers (block selection, drag-reorder, insert menu) ─────

import { getTimelineIndexFromPath } from "../detail-builder.js";

/**
 * Bind swimlane interaction events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindSwimlaneEvents(root, ctx) {
	// Block selection
	root.querySelectorAll("[data-action='select-block']").forEach((el) => {
		el.addEventListener("click", (e) => {
			if (e.target.closest("button")) return;
			const path = el.dataset.entryPath;
			ctx.setSelectedPath(ctx.selectedPath === path ? null : path);
		});
	});

	// Drag-to-reorder on main lane blocks
	let dragSourcePath = null;
	root.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((el) => {
		const path = el.dataset.entryPath;
		if (path === "setup" || path === "landing") return;

		el.addEventListener("dragstart", (e) => {
			dragSourcePath = path;
			el.classList.add("dragging");
			e.dataTransfer.effectAllowed = "move";
		});
		el.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
		});
		el.addEventListener("dragenter", (e) => {
			e.preventDefault();
			el.classList.add("cinematic-editor__block--drag-over");
		});
		el.addEventListener("dragleave", () => {
			el.classList.remove("cinematic-editor__block--drag-over");
		});
		el.addEventListener("drop", (e) => {
			e.preventDefault();
			el.classList.remove("cinematic-editor__block--drag-over");
			const targetPath = el.dataset.entryPath;
			if (dragSourcePath && dragSourcePath !== targetPath) {
				const fromIdx = getTimelineIndexFromPath(dragSourcePath);
				const toIdx = getTimelineIndexFromPath(targetPath);
				if (fromIdx != null && toIdx != null) {
					if (ctx.selectedPath === dragSourcePath) {
						ctx.setSelectedPath(targetPath);
					}
					ctx.mutate((s) => s.moveEntry(fromIdx, toIdx));
				}
			}
			dragSourcePath = null;
		});
		el.addEventListener("dragend", () => {
			el.classList.remove("dragging");
			dragSourcePath = null;
		});
	});

	// Insertion points
	root.querySelectorAll("[data-action='show-insert-menu']").forEach((el) => {
		el.addEventListener("click", (e) => {
			e.stopPropagation();
			const insertIndex = Number(el.dataset.insertIndex);
			const lane = el.dataset.lane;
			ctx.showInsertMenu(el, insertIndex, lane);
		});
	});

	// Insert menu buttons
	root.querySelectorAll("[data-action='insert-entry']").forEach((btn) => {
		btn.addEventListener("click", () => {
			if (!ctx.insertMenuState) return;
			const type = btn.dataset.insertType;
			const { insertIndex } = ctx.insertMenuState;
			switch (type) {
				case "step": ctx.mutate((s) => s.addStep(insertIndex)); break;
				case "delay": ctx.mutate((s) => s.addDelay(insertIndex)); break;
				case "await": ctx.mutate((s) => s.addAwait(insertIndex)); break;
				case "emit": ctx.mutate((s) => s.addEmit(insertIndex)); break;
				case "parallel": ctx.mutate((s) => s.addParallel(insertIndex)); break;
				case "transitionTo": ctx.mutate((s) => s.addTransitionTo(insertIndex)); break;
				case "sound": ctx.mutate((s) => s.addSound(insertIndex)); break;
				case "stopSound": ctx.mutate((s) => s.addStopSound(insertIndex)); break;
			}
			ctx.hideInsertMenu();
		});
	});

	// Click outside insert menu to close (listen on document since menu is reparented to body)
	document.addEventListener("click", (e) => {
		if (ctx.insertMenuState && !e.target.closest(".cinematic-editor__insert-menu") && !e.target.closest("[data-action='show-insert-menu']")) {
			ctx.hideInsertMenu();
		}
	});
}
