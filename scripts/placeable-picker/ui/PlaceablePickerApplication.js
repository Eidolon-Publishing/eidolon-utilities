/**
 * PlaceablePickerApplication — ApplicationV2 window for selecting scene placeables.
 *
 * Provides three selection methods:
 *   1. Tag input with Match Any / Match All mode
 *   2. Canvas click-to-select (pick mode)
 *   3. Visual tile browser grid with thumbnails
 *
 * Returns an array of selector strings to the consumer via callback.
 */

import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { buildTagSelector, parseSelector } from "../core/selectors.js";
import { resolveSelector } from "../core/resolver.js";
import { addHighlight, removeHighlight, clearAllHighlights, hasHighlight } from "../core/canvas-highlight.js";
import { enterPickMode, cancelPickMode, isPickModeActive } from "./pick-mode.js";

export default class PlaceablePickerApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	static APP_ID = `${MODULE_ID}-placeable-picker`;

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: PlaceablePickerApplication.APP_ID,
			classes: Array.from(
				new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "eidolon-placeable-picker-window", "themed"])
			),
			tag: "section",
			window: {
				title: "Placeable Picker",
				icon: "fa-solid fa-crosshairs",
				resizable: true,
			},
			position: {
				width: 500,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/placeable-picker.html`,
		},
	};

	/** @type {string[]} Current selections (selector strings). */
	#selections = [];

	/** @type {boolean} Whether pick mode is active. */
	#pickModeActive = false;

	/** @type {string} Placeable type (Tile, Token, etc.). */
	#placeableType = "Tile";

	/** @type {string} Current tag match mode. */
	#tagMode = "any";

	/** @type {((selectors: string[]) => void) | null} */
	#onApply = null;

	/** @type {(() => void) | null} */
	#onCancel = null;

	/** @type {Promise resolve function for the open() API. */
	#promiseResolve = null;

	/** @type {PlaceableObject | null} Currently hovered tile in the browser. */
	#hoveredPlaceable = null;

	/**
	 * @param {object} options
	 * @param {string[]} [options.selections]  Initial selections
	 * @param {string} [options.placeableType]  "Tile", "Token", etc.
	 * @param {(selectors: string[]) => void} [options.onApply]
	 * @param {() => void} [options.onCancel]
	 */
	constructor(options = {}) {
		super(options);
		this.#selections = [...(options.selections ?? [])];
		this.#placeableType = options.placeableType ?? "Tile";
		this.#onApply = options.onApply ?? null;
		this.#onCancel = options.onCancel ?? null;
	}

	// ── Context ───────────────────────────────────────────────────────────

	async _prepareContext() {
		const selectedIds = this.#getSelectedIds();

		// Build tile browser data from canvas
		const tiles = (canvas.tiles?.placeables ?? []).map((tile, i) => {
			const doc = tile.document;
			const id = doc.id;
			const name = doc.texture?.src
				? doc.texture.src.split("/").pop().replace(/\.[^.]+$/, "")
				: `Tile ${i + 1}`;

			return {
				id,
				name: name.length > 20 ? name.slice(0, 18) + "..." : name,
				thumbnailSrc: doc.texture?.src ?? null,
				selected: selectedIds.has(id),
			};
		});

		return {
			selections: this.#selections,
			selectionCount: this.#selections.length,
			pickModeActive: this.#pickModeActive,
			tagModeIsAny: this.#tagMode === "any",
			tagModeIsAll: this.#tagMode === "all",
			tagPreviewCount: 0,
			tiles,
			tileCount: tiles.length,
		};
	}

	// ── Render & Events ───────────────────────────────────────────────────

	_onRender(context, options) {
		super._onRender(context, options);
		this.#bindEvents();
		this.#refreshSelectionHighlights();
	}

	async _onClose(options) {
		// Clean up pick mode if active
		if (this.#pickModeActive) {
			cancelPickMode();
			this.#pickModeActive = false;
		}

		// Clean up hover highlights
		clearAllHighlights();

		// If closed without Apply, treat as cancel
		if (this.#promiseResolve) {
			this.#promiseResolve(null);
			this.#promiseResolve = null;
		}

		return super._onClose(options);
	}

	#bindEvents() {
		const root = this.element;
		if (!(root instanceof HTMLElement)) return;

		// ── Tag input ──────────────────────────────────────────────────

		const tagInput = root.querySelector("[data-role='tag-input']");
		const tagModeSelect = root.querySelector("[data-role='tag-mode']");

		tagModeSelect?.addEventListener("change", (e) => {
			this.#tagMode = e.target.value;
		});

		// Live preview count on tag input
		tagInput?.addEventListener("input", () => {
			this.#updateTagPreview(root);
		});

		// Enter key in tag input adds the selector
		tagInput?.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				this.#addTagSelector(root);
			}
		});

		root.querySelector("[data-action='add-tag-selector']")?.addEventListener("click", () => {
			this.#addTagSelector(root);
		});

		// ── Pick mode ──────────────────────────────────────────────────

		root.querySelector("[data-action='toggle-pick-mode']")?.addEventListener("click", () => {
			if (this.#pickModeActive) {
				cancelPickMode();
				this.#pickModeActive = false;
			} else {
				this.#pickModeActive = true;
				enterPickMode({
					placeableType: this.#placeableType,
					onPick: (doc) => {
						this.#addIdSelector(doc.id);
					},
					onCancel: () => {
						this.#pickModeActive = false;
						this.render({ force: true });
					},
				});
			}
			this.render({ force: true });
		});

		// ── Tile browser ───────────────────────────────────────────────

		root.querySelectorAll("[data-action='toggle-tile']").forEach((el) => {
			// Click to toggle selection
			el.addEventListener("click", () => {
				const docId = el.dataset.docId;
				if (!docId) return;
				this.#toggleIdSelector(docId);
			});

			// Hover to highlight on canvas
			el.addEventListener("mouseenter", () => {
				const docId = el.dataset.docId;
				if (!docId) return;
				const tile = canvas.tiles?.placeables?.find((t) => t.document.id === docId);
				if (tile) {
					this.#hoveredPlaceable = tile;
					addHighlight(tile, { mode: "hover" });
				}
			});

			el.addEventListener("mouseleave", () => {
				if (this.#hoveredPlaceable) {
					removeHighlight(this.#hoveredPlaceable);
					this.#hoveredPlaceable = null;
					// Restore selected highlight if this tile is selected
					this.#refreshSelectionHighlights();
				}
			});
		});

		// ── Selection list ─────────────────────────────────────────────

		root.querySelectorAll("[data-action='remove-selection']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const idx = Number(btn.dataset.selectionIndex);
				if (Number.isNaN(idx)) return;
				this.#selections.splice(idx, 1);
				this.render({ force: true });
			});
		});

		// ── Footer ─────────────────────────────────────────────────────

		root.querySelector("[data-action='apply']")?.addEventListener("click", () => {
			this.#doApply();
		});

		root.querySelector("[data-action='cancel']")?.addEventListener("click", () => {
			this.#doCancel();
		});
	}

	// ── Tag helpers ───────────────────────────────────────────────────────

	#addTagSelector(root) {
		const input = root.querySelector("[data-role='tag-input']");
		const raw = input?.value?.trim();
		if (!raw) return;

		const tags = raw.split(",").map((s) => s.trim()).filter(Boolean);
		if (tags.length === 0) return;

		const selector = buildTagSelector(tags, this.#tagMode);
		if (selector && !this.#selections.includes(selector)) {
			this.#selections.push(selector);
		}

		// Clear input
		if (input) input.value = "";

		this.render({ force: true });
	}

	#updateTagPreview(root) {
		const input = root.querySelector("[data-role='tag-input']");
		const preview = root.querySelector("[data-role='tag-preview']");
		if (!input || !preview) return;

		const raw = input.value.trim();
		if (!raw) {
			preview.textContent = "";
			return;
		}

		const tags = raw.split(",").map((s) => s.trim()).filter(Boolean);
		if (tags.length === 0) {
			preview.textContent = "";
			return;
		}

		// Use Tagger to count matches
		const Tagger = window.Tagger ?? game.modules.get("tagger")?.api;
		if (!Tagger) {
			preview.textContent = "Tagger not available";
			return;
		}

		const matchAny = this.#tagMode === "any";
		const matches = Tagger.getByTag(tags, {
			sceneId: canvas.scene?.id,
			matchAny,
		});

		const count = matches?.length ?? 0;
		preview.textContent = `${count} matching placeable(s)`;
	}

	// ── ID selector helpers ──────────────────────────────────────────────

	#addIdSelector(docId) {
		const selector = `id:${docId}`;
		if (!this.#selections.includes(selector)) {
			this.#selections.push(selector);
			this.render({ force: true });
		}
	}

	#toggleIdSelector(docId) {
		const selector = `id:${docId}`;
		const idx = this.#selections.indexOf(selector);
		if (idx >= 0) {
			this.#selections.splice(idx, 1);
		} else {
			this.#selections.push(selector);
		}
		this.render({ force: true });
	}

	/**
	 * Get the set of document IDs that are currently selected across all selector types.
	 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
	 * @returns {Set<string>}
	 */
	#getSelectedIds() {
		const ids = new Set();
		for (const sel of this.#selections) {
			const parsed = parseSelector(sel);
			if (parsed.type === "id") {
				ids.add(parsed.value);
				continue;
			}
			// Resolve other selector types to get their matching document IDs
			const resolved = resolveSelector(sel);
			if (resolved?.placeables) {
				for (const { doc } of resolved.placeables) {
					if (doc?.id) ids.add(doc.id);
				}
			}
		}
		return ids;
	}

	// ── Canvas selection highlights ──────────────────────────────────────

	/**
	 * Maintain "selected" highlights on canvas tiles that are in the selection list.
	 * Clears stale highlights and adds missing ones (skipping the hovered tile).
	 */
	#refreshSelectionHighlights() {
		const selectedIds = this.#getSelectedIds();
		const tiles = canvas.tiles?.placeables ?? [];

		for (const tile of tiles) {
			const docId = tile.document?.id;
			if (!docId) continue;

			const isSelected = selectedIds.has(docId);
			const isHovered = tile === this.#hoveredPlaceable;
			const highlighted = hasHighlight(tile);

			if (isSelected && !isHovered && !highlighted) {
				// Add selected highlight
				addHighlight(tile, { mode: "selected" });
			} else if (!isSelected && highlighted && !isHovered) {
				// Remove stale selected highlight
				removeHighlight(tile);
			}
		}
	}

	// ── Apply / Cancel ──────────────────────────────────────────────────

	#doApply() {
		// Clean up pick mode
		if (this.#pickModeActive) {
			cancelPickMode();
			this.#pickModeActive = false;
		}
		clearAllHighlights();

		const result = [...this.#selections];

		this.#onApply?.(result);
		if (this.#promiseResolve) {
			this.#promiseResolve(result);
			this.#promiseResolve = null;
		}

		this.close({ force: true });
	}

	#doCancel() {
		// Clean up pick mode
		if (this.#pickModeActive) {
			cancelPickMode();
			this.#pickModeActive = false;
		}
		clearAllHighlights();

		this.#onCancel?.();
		if (this.#promiseResolve) {
			this.#promiseResolve(null);
			this.#promiseResolve = null;
		}

		this.close({ force: true });
	}

	// ── Promise-based API ────────────────────────────────────────────────

	/**
	 * Open the picker and return a Promise that resolves with the selected
	 * selector strings (or null if cancelled).
	 *
	 * @param {object} [options]
	 * @param {string[]} [options.selections]  Initial selections
	 * @param {string} [options.placeableType]  Placeable type filter
	 * @returns {Promise<string[] | null>}
	 */
	static open(options = {}) {
		return new Promise((resolve) => {
			const picker = new PlaceablePickerApplication({
				...options,
				onApply: (selectors) => resolve(selectors),
				onCancel: () => resolve(null),
			});
			picker.#promiseResolve = resolve;
			picker.render(true);
		});
	}
}
