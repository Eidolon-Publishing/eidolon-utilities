/**
 * Hook registration for the region-shapes feature.
 *
 * Hooks:
 *   - renderRegionConfig:  Inject drag handles onto shape fieldsets
 *   - closeRegionConfig:   Remove from tracking map
 *   - renderRegionLegend:  Inject overlap resolver button
 */

import { injectShapeDragHandles, cleanupShapeDrag } from "./ui/shape-drag.js";
import { injectMergeButton } from "./ui/merge-button.js";
import { injectRegionLegendButtons } from "./ui/overlap-legend-button.js";

export function registerRegionShapeHooks() {
	Hooks.on("renderRegionConfig", (app, html) => {
		injectShapeDragHandles(app, html);
		injectMergeButton(app, html);
	});

	Hooks.on("closeRegionConfig", (app) => {
		cleanupShapeDrag(app);
	});

	Hooks.on("renderRegionLegend", (app, html) => {
		injectRegionLegendButtons(app, html);
	});
}
