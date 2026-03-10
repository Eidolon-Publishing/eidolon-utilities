/**
 * OverlapResolverApplication — ApplicationV2 window for resolving region overlaps.
 *
 * Displays overlapping regions in a drag-reorderable list. The user sets priority
 * order (top = highest priority, kept intact) then clicks "Remove Overlap" to
 * cookie-cut lower-priority regions using ClipperLib subtraction.
 */

import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { findOverlappingRegions, resolveOverlaps } from "../core/overlap-resolver.js";

export default class OverlapResolverApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	static APP_ID = `${MODULE_ID}-overlap-resolver`;

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: OverlapResolverApplication.APP_ID,
			classes: Array.from(
				new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "eidolon-overlap-resolver-window", "themed"]),
			),
			tag: "section",
			window: {
				title: "Overlap Resolver",
				icon: "fa-solid fa-scissors",
				resizable: false,
			},
			position: {
				width: 360,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/overlap-resolver.html`,
		},
	};

	/** @type {object[]} Ordered region documents. */
	#regions = [];

	/** @type {Set<string>} IDs of regions excluded from resolution. */
	#excluded = new Set();

	/** @type {number|null} Index of the item currently being dragged. */
	#dragIndex = null;

	/**
	 * @param {object} options
	 * @param {object[]} [options.regions]  Pre-filtered overlapping regions
	 */
	constructor(options = {}) {
		super(options);
		this.#regions = [...(options.regions ?? [])];
	}

	// ── Context ───────────────────────────────────────────────────────────

	async _prepareContext() {
		return {
			regions: this.#regions.map((r) => ({
				id: r.id,
				name: r.name,
				color: r.color ?? "#999999",
				shapeCount: (r.shapes ?? []).length,
				isSingle: (r.shapes ?? []).length === 1,
				excluded: this.#excluded.has(r.id),
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

		// Drag reorder on list items
		const list = root.querySelector("[data-role='region-list']");
		if (list) this.#bindDragReorder(list);

		// Eye toggles
		for (const btn of root.querySelectorAll("[data-action='toggle-exclude']")) {
			btn.addEventListener("click", (e) => {
				e.stopPropagation();
				const idx = Number(btn.dataset.index);
				const region = this.#regions[idx];
				if (!region) return;
				if (this.#excluded.has(region.id)) {
					this.#excluded.delete(region.id);
				} else {
					this.#excluded.add(region.id);
				}
				this.render({ force: true });
			});
		}

		// Footer buttons
		root.querySelector("[data-action='resolve']")?.addEventListener("click", () => this.#doResolve());
		root.querySelector("[data-action='cancel']")?.addEventListener("click", () => this.close());
	}

	// ── Drag reorder ─────────────────────────────────────────────────────

	#bindDragReorder(list) {
		const items = list.querySelectorAll(".overlap-resolver__item");

		for (const item of items) {
			item.addEventListener("dragstart", (e) => {
				this.#dragIndex = Number(item.dataset.index);
				e.dataTransfer.effectAllowed = "move";
				// Minimal data — we track state internally
				e.dataTransfer.setData("text/plain", String(this.#dragIndex));
				requestAnimationFrame(() => item.classList.add("is-dragging"));
			});

			item.addEventListener("dragover", (e) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";

				// Show insert indicator
				const rect = item.getBoundingClientRect();
				const midY = rect.top + rect.height / 2;
				const before = e.clientY < midY;

				// Clear all indicators first
				for (const el of list.querySelectorAll(".overlap-resolver__item")) {
					el.classList.remove("or--insert-before", "or--insert-after");
				}
				item.classList.add(before ? "or--insert-before" : "or--insert-after");
			});

			item.addEventListener("dragleave", () => {
				item.classList.remove("or--insert-before", "or--insert-after");
			});

			item.addEventListener("drop", (e) => {
				e.preventDefault();
				// Clear indicators
				for (const el of list.querySelectorAll(".overlap-resolver__item")) {
					el.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
				}

				if (this.#dragIndex == null) return;

				const targetIndex = Number(item.dataset.index);
				const rect = item.getBoundingClientRect();
				const midY = rect.top + rect.height / 2;
				let insertAt = e.clientY < midY ? targetIndex : targetIndex + 1;

				// Reorder the internal array
				const sourceIndex = this.#dragIndex;
				if (sourceIndex === insertAt || sourceIndex + 1 === insertAt) {
					this.#dragIndex = null;
					return; // No-op
				}

				const [moved] = this.#regions.splice(sourceIndex, 1);
				if (sourceIndex < insertAt) insertAt--;
				this.#regions.splice(insertAt, 0, moved);

				this.#dragIndex = null;
				this.render({ force: true });
			});

			item.addEventListener("dragend", () => {
				this.#dragIndex = null;
				for (const el of list.querySelectorAll(".overlap-resolver__item")) {
					el.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
				}
			});
		}
	}

	// ── Resolve action ───────────────────────────────────────────────────

	async #doResolve() {
		const included = this.#regions.filter((r) => !this.#excluded.has(r.id));
		const changes = resolveOverlaps(included, ClipperLib);
		if (changes.length === 0) {
			ui.notifications.info("No overlaps found after applying priority order.");
			this.close();
			return;
		}

		// Batch update all changed regions
		const updates = changes.map(({ region, newShapes }) => ({
			_id: region.id,
			shapes: newShapes,
		}));

		await canvas.scene.updateEmbeddedDocuments("Region", updates);

		const names = changes.map(({ region }) => region.name).join(", ");
		ui.notifications.info(`Resolved overlaps: updated ${changes.length} region(s) (${names}).`);
		this.close();
	}

	// ── Static opener ────────────────────────────────────────────────────

	/**
	 * Open the resolver. Detects overlapping regions first; if none overlap,
	 * shows a notification and does not open.
	 */
	static open() {
		const allRegions = canvas.scene?.regions?.contents ?? [];
		if (allRegions.length < 2) {
			ui.notifications.info("Need at least 2 regions to check for overlaps.");
			return;
		}

		const overlapping = findOverlappingRegions(allRegions, ClipperLib);
		if (overlapping.length === 0) {
			ui.notifications.info("No overlapping regions found on this scene.");
			return;
		}

		const app = new OverlapResolverApplication({ regions: overlapping });
		app.render(true);
	}
}
