// ── Region Legend header buttons ─────────────────────────────────────────────
//
// Injects header-control buttons into the Region Legend window header:
//   - Scissors: opens the Overlap Resolver window
//   - Union: batch-merges shapes within every region on the scene

import { asHTMLElement } from "../../common/ui/foundry-compat.js";
import { mergeShapes } from "../core/merge-shapes.js";
import GlobalVisibilityApplication from "./GlobalVisibilityApplication.js";
import OverlapResolverApplication from "./OverlapResolverApplication.js";

/**
 * Inject header buttons into the Region Legend.
 * @param {object} app  The RegionLegend application instance
 * @param {HTMLElement|object} html  The render hook html parameter
 */
export function injectRegionLegendButtons(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	// Find the window header — AppV2 uses <header class="window-header">
	const header = root.querySelector("header.window-header") ?? root.closest("section")?.querySelector("header.window-header");
	if (!header) return;

	// Don't inject twice
	if (header.querySelector('[data-action="openGlobalVisibility"]')) return;

	// Insert before the close button (last header control)
	const closeBtn = header.querySelector("button.close") ?? header.querySelector('[data-action="close"]');
	const insertBefore = (el) => (closeBtn ? closeBtn.before(el) : header.append(el));

	// ── Merge All button ────────────────────────────────────────────
	const mergeBtn = document.createElement("button");
	mergeBtn.type = "button";
	mergeBtn.className = "header-control fa-solid fa-object-union";
	mergeBtn.dataset.action = "mergeAllRegionShapes";
	mergeBtn.dataset.tooltip = "Merge shapes in all regions";
	mergeBtn.setAttribute("aria-label", "Merge shapes in all regions");

	mergeBtn.addEventListener("click", async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const regions = canvas.scene?.regions?.contents ?? [];
		if (regions.length === 0) {
			ui.notifications.info("No regions on this scene.");
			return;
		}

		const updates = [];
		for (const region of regions) {
			const shapeData = (region.shapes ?? []).map((s) => foundry.utils.deepClone(s));
			const merged = mergeShapes(shapeData, ClipperLib);
			if (!merged) continue;
			// Skip if total shape count didn't decrease — catches both polygon
			// unions (fewer non-holes) and hole absorption (holes baked into
			// polygon boundaries as notches, eliminating separate hole shapes).
			if (merged.length >= shapeData.length) continue;
			updates.push({ _id: region.id, shapes: merged });
		}

		if (updates.length === 0) {
			ui.notifications.info("Nothing to merge — all regions already have simple shapes.");
			return;
		}

		await canvas.scene.updateEmbeddedDocuments("Region", updates);
		const total = updates.reduce((sum, u) => sum + u.shapes.length, 0);
		ui.notifications.info(`Merged shapes in ${updates.length} region(s) (${total} shapes total).`);
	});

	insertBefore(mergeBtn);

	// ── Global Visibility button ────────────────────────────────────
	const visibilityBtn = document.createElement("button");
	visibilityBtn.type = "button";
	visibilityBtn.className = "header-control fa-solid fa-eye";
	visibilityBtn.dataset.action = "openGlobalVisibility";
	visibilityBtn.dataset.tooltip = "Global Region Visibility";
	visibilityBtn.setAttribute("aria-label", "Set visibility for all regions");

	visibilityBtn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		GlobalVisibilityApplication.open();
	});

	insertBefore(visibilityBtn);

	// ── Overlap Resolver button ─────────────────────────────────────
	const resolveBtn = document.createElement("button");
	resolveBtn.type = "button";
	resolveBtn.className = "header-control fa-solid fa-scissors";
	resolveBtn.dataset.action = "openOverlapResolver";
	resolveBtn.dataset.tooltip = "Overlap Resolver";
	resolveBtn.setAttribute("aria-label", "Open overlap resolver");

	resolveBtn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		OverlapResolverApplication.open();
	});

	insertBefore(resolveBtn);
}
