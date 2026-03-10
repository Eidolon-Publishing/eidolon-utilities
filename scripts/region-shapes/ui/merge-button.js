// ── Merge Shapes button for RegionConfig ─────────────────────────────────────
//
// Injects a "Merge shapes" button into the Shapes tab header of RegionConfig.
// Clicking it unions all non-hole shapes and subtracts holes from the result.
// Interior holes become inner contours; breaching holes reshape the perimeter.

import { asHTMLElement } from "../../common/ui/foundry-compat.js";
import { mergeShapes } from "../core/merge-shapes.js";

/**
 * Inject the merge button into a RegionConfig's Shapes tab header.
 * @param {object} app  The RegionConfig application instance
 * @param {HTMLElement|object} html  The render hook html parameter
 */
export function injectMergeButton(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	const region = app.document;
	if (!region) return;

	// Find the controls div in the shapes header
	const controls = root.querySelector("header.region-element.region-shape .region-element-controls");
	if (!controls) return;

	// Don't inject twice
	if (controls.querySelector('[data-action="shapeMergeOverlapping"]')) return;

	// Create button
	const btn = document.createElement("a");
	btn.className = "control";
	btn.dataset.action = "shapeMergeOverlapping";
	btn.dataset.tooltip = "Merge shapes & apply holes";
	btn.setAttribute("aria-label", "Merge shapes and apply holes");
	btn.innerHTML = '<i class="fa-solid fa-object-union fa-fw"></i>';

	// Disable if there's nothing to merge:
	// need 2+ non-hole shapes to union, or 1+ non-holes with holes to subtract
	const nonHoleCount = region.shapes.filter((s) => !s.hole).length;
	const holeCount = region.shapes.filter((s) => s.hole).length;
	if (nonHoleCount < 2 && (nonHoleCount === 0 || holeCount === 0)) {
		btn.classList.add("disabled");
		btn.dataset.tooltip = "Need 2+ shapes to merge, or shapes with holes to subtract";
	}

	btn.addEventListener("click", async (e) => {
		e.preventDefault();
		if (btn.classList.contains("disabled")) return;

		// Deep clone shape data for safety
		const shapeData = region.shapes.map((s) => foundry.utils.deepClone(s));
		const merged = mergeShapes(shapeData, ClipperLib);

		if (!merged) {
			ui.notifications.info("Nothing to merge — need 2+ shapes, or shapes with holes.");
			return;
		}

		await region.update({ shapes: merged });
		ui.notifications.info(`Merged ${shapeData.length} shapes into ${merged.length}.`);
	});

	// Insert before the first existing control (shapeCreateFromWalls)
	controls.prepend(btn);
}
