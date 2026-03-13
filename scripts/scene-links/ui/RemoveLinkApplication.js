/**
 * AppV2 dialog for removing a scene link, with optional reverse removal.
 */

import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { localize } from "../../time-triggers/core/utils.js";
import { getSceneLinks, removeSceneLink } from "../core/flag-utils.js";
import { resolveScene } from "../core/navigation.js";
import { removeBidirectionalLink } from "../core/sync.js";

const MODULE_ID = "eidolon-utilities";

export default class RemoveLinkApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	#scene = null;
	#target = null;
	#onComplete = null;

	constructor(options = {}) {
		const { scene, target, onComplete, ...rest } = options ?? {};
		super(rest);
		this.#scene = scene ?? null;
		this.#target = target ?? null;
		this.#onComplete = typeof onComplete === "function" ? onComplete : null;
	}

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: `${MODULE_ID}-remove-scene-link`,
			classes: Array.from(new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "standard-form", "themed"])),
			window: {
				title: localize("EIDOLON.SceneLinks.RemoveDialog.Title", "Remove Scene Link"),
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
			template: `modules/${MODULE_ID}/templates/scene-links-remove.html`,
		},
	};

	async _prepareContext() {
		const targetScene = resolveScene(this.#target);
		const hasReverseLink = targetScene
			? getSceneLinks(targetScene).some((l) => l.target === this.#scene?.id)
			: false;

		return {
			targetName: targetScene?.name ?? this.#target ?? "",
			hasReverseLink,
			labels: {
				alsoRemoveReverse: localize(
					"EIDOLON.SceneLinks.RemoveDialog.AlsoRemoveReverse",
					"Also remove the reverse link on the target scene?",
				),
				remove: localize("EIDOLON.SceneLinks.Remove", "Remove"),
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

		const removeReverse = form.querySelector('input[name="removeReverse"]')?.checked ?? false;
		const targetScene = resolveScene(this.#target);

		if (removeReverse && targetScene) {
			await removeBidirectionalLink(this.#scene, targetScene);
		} else {
			await removeSceneLink(this.#scene, this.#target);
		}

		if (this.#onComplete) this.#onComplete();
		this.close();
	};
}
