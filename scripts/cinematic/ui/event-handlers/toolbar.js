// ── Toolbar event handlers ───────────────────────────────────────────────────

import CinematicTrackingApplication from "../CinematicTrackingApplication.js";

/**
 * Bind toolbar button events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindToolbarEvents(root, ctx) {
	root.querySelector("[data-action='save']")?.addEventListener("click", () => ctx.save());
	root.querySelector("[data-action='play-preview']")?.addEventListener("click", () => ctx.play());
	root.querySelector("[data-action='reset-tracking']")?.addEventListener("click", () => ctx.resetTracking());
	root.querySelector("[data-action='export-json']")?.addEventListener("click", () => ctx.exportJSON());
	root.querySelector("[data-action='undo']")?.addEventListener("click", () => ctx.undo());
	root.querySelector("[data-action='redo']")?.addEventListener("click", () => ctx.redo());
	root.querySelector("[data-action='validate']")?.addEventListener("click", () => ctx.validate());
	root.querySelector("[data-action='import-json']")?.addEventListener("click", () => ctx.importJSON());
	root.querySelector("[data-action='open-tracking']")?.addEventListener("click", () => {
		new CinematicTrackingApplication({ scene: ctx.scene }).render(true);
	});
}
