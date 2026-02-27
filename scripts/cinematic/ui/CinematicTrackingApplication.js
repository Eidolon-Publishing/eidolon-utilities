import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";

export default class CinematicTrackingApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	static APP_ID = `${MODULE_ID}-cinematic-tracking`;

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: CinematicTrackingApplication.APP_ID,
			classes: Array.from(
				new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "eidolon-cinematic-tracking-window", "themed"])
			),
			tag: "section",
			window: {
				title: "Cinematic Tracking",
				icon: "fa-solid fa-eye",
				resizable: true,
			},
			position: {
				width: 340,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/cinematic-tracking.html`,
		},
	};

	#scene = null;

	constructor(options = {}) {
		super(options);
		this.#scene = options.scene ?? canvas.scene ?? null;
	}

	get #api() {
		return game.modules.get(MODULE_ID)?.api?.cinematic;
	}

	async _prepareContext() {
		const api = this.#api;
		const users = api?.getSeenStatus?.(this.#scene?.id) ?? [];

		return {
			sceneName: this.#scene?.name ?? "No scene",
			users: users.map((u) => ({
				...u,
				statusLabel: u.seen ? "Seen" : "Not seen",
				statusClass: u.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen",
			})),
			hasAnyTracked: users.some((u) => u.seen),
		};
	}

	_onRender(context, options) {
		super._onRender(context, options);
		this.#bindEvents();
	}

	#bindEvents() {
		const root = this.element;
		if (!(root instanceof HTMLElement)) return;

		// Per-user reset buttons
		root.querySelectorAll("[data-action='reset-user']").forEach((btn) => {
			btn.addEventListener("click", async () => {
				const userId = btn.dataset.userId;
				if (!userId) return;
				const api = this.#api;
				if (!api?.resetForUser) return;
				await api.resetForUser(this.#scene?.id, userId);
				this.render({ force: true });
			});
		});

		// Reset all button
		root.querySelector("[data-action='reset-all']")?.addEventListener("click", async () => {
			const api = this.#api;
			if (!api?.resetForAll) return;
			await api.resetForAll(this.#scene?.id);
			this.render({ force: true });
		});

		// Refresh button
		root.querySelector("[data-action='refresh']")?.addEventListener("click", () => {
			this.render({ force: true });
		});
	}
}
