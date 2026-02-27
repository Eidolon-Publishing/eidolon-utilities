// ── Segment detail event handlers (gate config, setup/landing) ────────────────

import { showEditJsonDialog } from "../editor-dialogs.js";

/**
 * Bind events for segment-level detail configuration.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindSegmentDetailEvents(root, ctx) {
	// Gate event type change
	root.querySelector("[data-action='change-gate-event']")?.addEventListener("change", (e) => {
		const value = e.target.value;
		if (!value) {
			// Clear gate
			ctx.setSegmentGate(null);
		} else {
			const currentGate = ctx.state.activeSegment?.gate ?? {};
			ctx.setSegmentGate({ ...currentGate, event: value });
		}
	});

	// Gate target change
	root.querySelector("[data-action='change-gate-target']")?.addEventListener("change", (e) => {
		const currentGate = ctx.state.activeSegment?.gate;
		if (!currentGate) return;
		ctx.setSegmentGate({ ...currentGate, target: e.target.value || undefined });
	});

	// Gate target picker
	root.querySelector("[data-action='pick-gate-target']")?.addEventListener("click", async () => {
		const currentGate = ctx.state.activeSegment?.gate;
		if (!currentGate) return;
		const { enterPickMode } = await import("../../../placeable-picker/ui/pick-mode.js");
		enterPickMode({
			placeableType: "Tile",
			onPick: (doc) => {
				const tags = doc.flags?.tagger?.tags;
				const selector = tags?.length ? `tag:${tags[0]}` : `id:${doc.id}`;
				ctx.setSegmentGate({ ...currentGate, target: selector });
			},
		});
	});

	// Gate animation fields (idle/hover/dim)
	for (const [action, key] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]]) {
		root.querySelector(`[data-action='${action}']`)?.addEventListener("change", (e) => {
			const currentGate = ctx.state.activeSegment?.gate;
			if (!currentGate) return;
			const raw = e.target.value.trim();
			const names = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
			const animation = { ...(currentGate.animation ?? {}) };
			if (names?.length) animation[key] = names.length === 1 ? names[0] : names;
			else delete animation[key];
			const gate = { ...currentGate, animation: Object.keys(animation).length ? animation : undefined };
			if (!gate.animation) delete gate.animation;
			ctx.setSegmentGate(gate);
		});
	}

	// Segment next edge change
	root.querySelector("[data-action='change-segment-next']")?.addEventListener("change", (e) => {
		const value = e.target.value;
		ctx.setSegmentNext(value || null);
	});

	// Edit segment setup JSON
	root.querySelector("[data-action='edit-segment-setup']")?.addEventListener("click", () => {
		showEditJsonDialog("setup", { state: ctx.state, mutate: ctx.mutate });
	});

	// Edit segment landing JSON
	root.querySelector("[data-action='edit-segment-landing']")?.addEventListener("click", () => {
		showEditJsonDialog("landing", { state: ctx.state, mutate: ctx.mutate });
	});
}
