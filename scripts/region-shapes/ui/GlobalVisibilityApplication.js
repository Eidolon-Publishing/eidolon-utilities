/**
 * GlobalVisibilityApplication — ApplicationV2 window for batch-setting region visibility.
 *
 * Displays a dropdown with the three REGION_VISIBILITY options and applies the
 * selected value to every region on the current scene.
 */

import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";

export default class GlobalVisibilityApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	static APP_ID = `${MODULE_ID}-global-visibility`;

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: GlobalVisibilityApplication.APP_ID,
			classes: Array.from(
				new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "eidolon-global-visibility-window", "themed"]),
			),
			tag: "section",
			window: {
				title: "Global Region Visibility",
				icon: "fa-solid fa-eye",
				resizable: false,
			},
			position: {
				width: 320,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/global-visibility.html`,
		},
	};

	// ── Context ───────────────────────────────────────────────────────────

	async _prepareContext() {
		const V = CONST.REGION_VISIBILITY;
		const regions = canvas.scene?.regions?.contents ?? [];

		// Determine the most common current visibility as the default selection
		const counts = {};
		for (const r of regions) {
			const v = r.visibility ?? V.LAYER;
			counts[v] = (counts[v] ?? 0) + 1;
		}
		const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
		const defaultValue = mostCommon != null ? Number(mostCommon) : V.GAMEMASTER;

		return {
			options: Object.entries(V).map(([key, value]) => ({
				value,
				label: game.i18n.localize(`REGION.VISIBILITY.${key}.label`),
				selected: value === defaultValue,
			})),
		};
	}

	// ── Render & Events ───────────────────────────────────────────────────

	_onRender(context, options) {
		super._onRender(context, options);
		this.#bindEvents();
	}

	#bindEvents() {
		const root = this.element;
		if (!(root instanceof HTMLElement)) return;

		root.querySelector("[data-action='apply']")?.addEventListener("click", () => this.#doApply());
		root.querySelector("[data-action='cancel']")?.addEventListener("click", () => this.close());
	}

	// ── Apply action ────────────────────────────────────────────────────

	async #doApply() {
		const root = this.element;
		const select = root.querySelector("[data-role='visibility-select']");
		const value = Number(select.value);

		const regions = canvas.scene?.regions?.contents ?? [];
		if (regions.length === 0) {
			ui.notifications.info("No regions on this scene.");
			this.close();
			return;
		}

		// Only update regions whose visibility differs
		const updates = regions
			.filter((r) => r.visibility !== value)
			.map((r) => ({ _id: r.id, visibility: value }));

		if (updates.length === 0) {
			ui.notifications.info("All regions already have the selected visibility.");
			this.close();
			return;
		}

		await canvas.scene.updateEmbeddedDocuments("Region", updates);

		const V = CONST.REGION_VISIBILITY;
		const label = game.i18n.localize(
			`REGION.VISIBILITY.${Object.entries(V).find(([, v]) => v === value)?.[0]}.label`,
		);
		ui.notifications.info(`Set visibility to "${label}" on ${updates.length} region(s).`);
		this.close();
	}

	// ── Static opener ────────────────────────────────────────────────────

	static open() {
		const regions = canvas.scene?.regions?.contents ?? [];
		if (regions.length === 0) {
			ui.notifications.info("No regions on this scene.");
			return;
		}

		const app = new GlobalVisibilityApplication();
		app.render(true);
	}
}
