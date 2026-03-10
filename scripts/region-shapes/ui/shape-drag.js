// ── Region shape drag & drop ────────────────────────────────────────────────
//
// Injects drag handles onto RegionConfig "Shapes" tab fieldsets.
// Uses HTML5 dataTransfer to serialize shape data as JSON, enabling
// cross-window drops between two open RegionConfig instances.
//
// Default operation: copy shape to target region.
// Ctrl held during drop: move (removes from source region).
// Same region: reorder within the shapes array.

import { asHTMLElement } from "../../common/ui/foundry-compat.js";

const MIME_TYPE = "application/x-foundry-region-shape";

/** @type {Map<string, { app: object, container: HTMLElement }>} */
const openRegionConfigs = new Map();

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Remove all drag indicator classes from every tracked container. */
function clearAllIndicators() {
	for (const el of document.querySelectorAll(
		".rs-shape--insert-before, .rs-shape--insert-after",
	)) {
		el.classList.remove("rs-shape--insert-before", "rs-shape--insert-after");
	}
}

/** Toggle drag-active highlight on all tracked drop zones. */
function setAllDragActive(active) {
	for (const entry of openRegionConfigs.values()) {
		entry.container?.classList.toggle("rs-drag-active", active);
	}
}

/** Clean up every drag-related class globally. */
function globalCleanup() {
	clearAllIndicators();
	setAllDragActive(false);
	for (const el of document.querySelectorAll(
		".is-dragging, .rs-drop-over",
	)) {
		el.classList.remove("is-dragging", "rs-drop-over");
	}
}

// ── Drop handler ────────────────────────────────────────────────────────────

/**
 * Handle a shape drop onto a target region.
 * @param {DragEvent} e
 * @param {object} targetRegion - The Foundry RegionDocument
 * @param {number} insertIndex - Index to insert before (-1 = append)
 */
async function handleShapeDrop(e, targetRegion, insertIndex) {
	const raw = e.dataTransfer.getData(MIME_TYPE);
	if (!raw) return;

	let payload;
	try {
		payload = JSON.parse(raw);
	} catch {
		return;
	}

	const { shape, sourceRegionUuid, sourceIndex } = payload;
	if (!shape || sourceRegionUuid == null) return;

	const isMove = e.ctrlKey || e.metaKey;
	const isSameRegion = sourceRegionUuid === targetRegion.uuid;

	// Same region, same position → no-op
	if (isSameRegion && !isMove) {
		const effectiveInsert =
			insertIndex === -1 ? targetRegion.shapes.length : insertIndex;
		if (effectiveInsert === sourceIndex || effectiveInsert === sourceIndex + 1)
			return;
	}

	const clonedShape = foundry.utils.deepClone(shape);

	if (isSameRegion) {
		// Reorder within the same region
		const shapes = foundry.utils.deepClone(targetRegion.shapes);
		shapes.splice(sourceIndex, 1);
		const effectiveInsert =
			insertIndex === -1 ? shapes.length : insertIndex;
		const adjustedIndex =
			sourceIndex < effectiveInsert ? effectiveInsert - 1 : effectiveInsert;
		shapes.splice(adjustedIndex, 0, clonedShape);
		await targetRegion.update({ shapes });
	} else {
		// Cross-region: insert into target
		const targetShapes = foundry.utils.deepClone(targetRegion.shapes);
		const effectiveInsert =
			insertIndex === -1 ? targetShapes.length : insertIndex;
		targetShapes.splice(effectiveInsert, 0, clonedShape);
		await targetRegion.update({ shapes: targetShapes });

		// If move, remove from source
		if (isMove) {
			const sourceRegion = await fromUuid(sourceRegionUuid);
			if (sourceRegion) {
				const sourceShapes = foundry.utils.deepClone(sourceRegion.shapes);
				sourceShapes.splice(sourceIndex, 1);
				await sourceRegion.update({ shapes: sourceShapes });
			}
		}
	}
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Inject drag handles onto shape fieldsets in a RegionConfig's Shapes tab.
 * @param {object} app - The RegionConfig application instance
 * @param {HTMLElement|object} html - The render hook html parameter
 */
export function injectShapeDragHandles(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	const region = app.document;
	if (!region) return;

	// Find shapes tab content section (not the nav <a> link which also has data-tab)
	const shapesTab = root.querySelector('section.tab[data-tab="shapes"]');
	if (!shapesTab) return;

	// The tab section itself is the drop container (no separate scrollable wrapper)
	const container = shapesTab;

	// Find shape fieldsets
	const fieldsets = container.querySelectorAll("fieldset[data-shape-index]");

	for (const fieldset of fieldsets) {
		const shapeIndex = Number(fieldset.dataset.shapeIndex);

		// Prepend grip icon before the shape name span
		if (!fieldset.querySelector(".rs-drag-handle")) {
			const grip = document.createElement("i");
			grip.className = "fa-solid fa-grip-vertical rs-drag-handle";
			grip.title = "Drag to reorder or copy to another region";
			fieldset.prepend(grip);
		}

		// Make the fieldset draggable
		fieldset.setAttribute("draggable", "true");
		fieldset.classList.add("rs-shape-fieldset");

		// Track whether drag started on the handle
		let startedOnHandle = false;
		fieldset.addEventListener("pointerdown", (e) => {
			startedOnHandle = !!e.target.closest(".rs-drag-handle");
		});

		fieldset.addEventListener("dragstart", (e) => {
			if (!startedOnHandle) {
				e.preventDefault();
				return;
			}

			const shapeData = foundry.utils.deepClone(region.shapes[shapeIndex]);
			const payload = JSON.stringify({
				shape: shapeData,
				sourceRegionUuid: region.uuid,
				sourceIndex: shapeIndex,
			});

			e.dataTransfer.setData(MIME_TYPE, payload);
			e.dataTransfer.effectAllowed = "copyMove";

			fieldset.classList.add("is-dragging");
			setAllDragActive(true);
		});

		fieldset.addEventListener("dragover", (e) => {
			if (!e.dataTransfer.types.includes(MIME_TYPE)) return;
			e.preventDefault();

			e.dataTransfer.dropEffect =
				e.ctrlKey || e.metaKey ? "move" : "copy";

			// Calculate insert position
			const rect = fieldset.getBoundingClientRect();
			const midY = rect.top + rect.height / 2;
			const mode = e.clientY < midY ? "before" : "after";

			clearAllIndicators();
			fieldset.classList.add(
				mode === "before"
					? "rs-shape--insert-before"
					: "rs-shape--insert-after",
			);
		});

		fieldset.addEventListener("dragleave", () => {
			fieldset.classList.remove(
				"rs-shape--insert-before",
				"rs-shape--insert-after",
			);
		});

		fieldset.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();
			clearAllIndicators();

			if (!e.dataTransfer.types.includes(MIME_TYPE)) return;

			const mode = (() => {
				const rect = fieldset.getBoundingClientRect();
				const midY = rect.top + rect.height / 2;
				return e.clientY < midY ? "before" : "after";
			})();

			const insertIndex =
				mode === "before" ? shapeIndex : shapeIndex + 1;
			handleShapeDrop(e, region, insertIndex);
		});

		fieldset.addEventListener("dragend", () => {
			globalCleanup();
		});
	}

	// Make the tab section itself a drop zone (for empty regions / appending)
	container.classList.add("rs-drop-container");

	container.addEventListener("dragover", (e) => {
		if (!e.dataTransfer.types.includes(MIME_TYPE)) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = e.ctrlKey || e.metaKey ? "move" : "copy";
	});

	container.addEventListener("dragenter", (e) => {
		if (!e.dataTransfer.types.includes(MIME_TYPE)) return;
		e.preventDefault();
		container.classList.add("rs-drop-over");
	});

	container.addEventListener("dragleave", (e) => {
		if (e.relatedTarget && container.contains(e.relatedTarget)) return;
		container.classList.remove("rs-drop-over");
	});

	container.addEventListener("drop", (e) => {
		e.preventDefault();
		container.classList.remove("rs-drop-over");
		if (!e.dataTransfer.types.includes(MIME_TYPE)) return;

		// Append to end
		handleShapeDrop(e, region, -1);
	});

	// Track this config in the open map
	openRegionConfigs.set(region.uuid, { app, container });
}

/**
 * Remove a RegionConfig from tracking when it closes.
 * @param {object} app - The RegionConfig application instance
 */
export function cleanupShapeDrag(app) {
	const region = app.document;
	if (!region) return;
	openRegionConfigs.delete(region.uuid);
}
