/**
 * AppV2 dialog for editing a scene link's label.
 */

import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { localize } from "../../time-triggers/core/utils.js";
import { updateLinkLabel } from "../core/flag-utils.js";
import { resolveScene } from "../core/navigation.js";

const MODULE_ID = "eidolon-utilities";

export default class EditLinkApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	#scene = null;
	#link = null;
	#onComplete = null;

	constructor(options = {}) {
		const { scene, link, onComplete, ...rest } = options ?? {};
		super(rest);
		this.#scene = scene ?? null;
		this.#link = link ?? null;
		this.#onComplete = typeof onComplete === "function" ? onComplete : null;
	}

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: `${MODULE_ID}-edit-scene-link`,
			classes: Array.from(new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "standard-form", "themed"])),
			window: {
				title: localize("EIDOLON.SceneLinks.EditDialog.Title", "Edit Link Label"),
				resizable: false,
			},
			position: {
				width: 380,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/scene-links-edit.html`,
		},
	};

	async _prepareContext() {
		const targetScene = resolveScene(this.#link?.target);
		return {
			label: this.#link?.label ?? "",
			targetName: targetScene?.name ?? this.#link?.target ?? "",
			labels: {
				label: localize("EIDOLON.SceneLinks.Label", "Label"),
				save: localize("EIDOLON.SceneLinks.Save", "Save"),
				cancel: localize("EIDOLON.SceneLinks.Cancel", "Cancel"),
			},
		};
	}

	_onRender(context, options) {
		super._onRender(context, options);
		const root = this.element;
		if (!root) return;

		const form = root.querySelector("form");
		if (form) form.addEventListener("submit", this.#onSubmit);

		root.querySelector('[data-action="cancel"]')?.addEventListener("click", (e) => {
			e.preventDefault();
			this.close();
		});
	}

	#onSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;

		const newLabel = new FormData(form).get("label")?.toString().trim();
		if (!newLabel) return;

		await updateLinkLabel(this.#scene, this.#link.target, newLabel);
		if (this.#onComplete) this.#onComplete();
		this.close();
	};
}
