/**
 * Hook registration for the placeable picker feature.
 */

import { MODULE_ID } from "../time-triggers/core/constants.js";
import PlaceablePickerApplication from "./ui/PlaceablePickerApplication.js";
import { resolveSelector } from "./core/resolver.js";
import { parseSelector, buildSelector, buildTagSelector } from "./core/selectors.js";
import { addHighlight, removeHighlight, clearAllHighlights, hasHighlight } from "./core/canvas-highlight.js";

export function registerPlaceablePickerHooks() {
	Hooks.once("ready", () => {
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.picker = {
			/** Open the picker window. Returns Promise<string[] | null>. */
			open: (options) => PlaceablePickerApplication.open(options),

			/** Resolve a selector string to documents. */
			resolveSelector,

			/** Parse a selector string into { type, value }. */
			parseSelector,

			/** Build a selector string from { type, value }. */
			buildSelector,

			/** Build a tag selector from tags array + mode. */
			buildTagSelector,

			/** Canvas highlight utilities. */
			highlight: {
				add: addHighlight,
				remove: removeHighlight,
				has: hasHighlight,
				clearAll: clearAllHighlights,
			},
		};

		console.log(`[${MODULE_ID}] Placeable Picker API registered.`);
	});
}
