// ── Cinematic selector event handlers ────────────────────────────────────────

import { escapeHtml } from "../../../time-triggers/core/utils.js";

/**
 * Bind cinematic selector (add/remove/rename/switch) events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindCinematicSelectorEvents(root, ctx) {
	root.querySelector("[data-action='change-cinematic']")?.addEventListener("change", (e) => {
		ctx.flushTweenChanges();
		ctx.switchCinematic(e.target.value);
	});

	root.querySelector("[data-action='add-cinematic']")?.addEventListener("click", () => {
		new Dialog({
			title: "New Cinematic",
			content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
			buttons: {
				ok: {
					label: "Create",
					callback: (html) => {
						const name = html.find("#cinematic-new-name").val()?.trim();
						if (!name) { ui.notifications?.warn?.("Name cannot be empty."); return; }
						if (/[.\s]/.test(name)) { ui.notifications?.warn?.("Name cannot contain dots or spaces."); return; }
						if (ctx.state.listCinematicNames().includes(name)) { ui.notifications?.warn?.("Name already exists."); return; }
						ctx.mutate((s) => s.addCinematic(name));
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "ok",
		}).render(true);
	});

	root.querySelector("[data-action='remove-cinematic']")?.addEventListener("click", () => {
		const names = ctx.state.listCinematicNames();
		if (names.length <= 1) { ui.notifications?.warn?.("Cannot remove the last cinematic."); return; }
		const active = ctx.state.activeCinematicName;
		new Dialog({
			title: "Remove Cinematic",
			content: `<p>Remove cinematic "${active}"? This cannot be undone after saving.</p>`,
			buttons: {
				ok: {
					label: "Remove",
					callback: () => {
						ctx.setSelectedPath(null);
						ctx.mutate((s) => s.removeCinematic(active));
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "cancel",
		}).render(true);
	});

	root.querySelector("[data-action='rename-cinematic']")?.addEventListener("click", () => {
		const active = ctx.state.activeCinematicName;
		new Dialog({
			title: "Rename Cinematic",
			content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${escapeHtml(active)}" /></label>`,
			buttons: {
				ok: {
					label: "Rename",
					callback: (html) => {
						const newName = html.find("#cinematic-rename").val()?.trim();
						if (!newName) { ui.notifications?.warn?.("Name cannot be empty."); return; }
						if (/[.\s]/.test(newName)) { ui.notifications?.warn?.("Name cannot contain dots or spaces."); return; }
						if (newName === active) return;
						if (ctx.state.listCinematicNames().includes(newName)) { ui.notifications?.warn?.("Name already exists."); return; }
						ctx.mutate((s) => s.renameCinematic(active, newName));
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "ok",
		}).render(true);
	});
}
