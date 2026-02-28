/**
 * Checkbox tile → hidden light provider.
 *
 * Mirrors Map UI Presets checkbox behavior so criteria resolution
 * keeps the same light visibility semantics.
 *
 * Self-registers as a hidden light provider via the hooks registry.
 */
import { registerHiddenLightProvider } from "../core/hooks-registry.js";

const CHECKBOX_TAGS = ["Checkbox", "Tile", "Settings", "Toggleable Lights"];
const IGNORE_TAGS = [
	"Checkbox",
	"Tile",
	"Settings",
	"Toggleable Lights",
	"Checked",
	"Unchecked",
	"Individual"
];

function buildLightControlsMap() {
	if (!globalThis.Tagger) return [];

	const checkboxTiles = Tagger.getByTag(CHECKBOX_TAGS) ?? [];
	const hiddenIds = [];

	for (const tile of checkboxTiles) {
		if (tile.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;

		const lightTags = (Tagger.getTags(tile) ?? []).filter((tag) => !IGNORE_TAGS.includes(tag));
		const ignore = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []);
		const lights = Tagger.getByTag(lightTags, { ignore }) ?? [];

		for (const light of lights) {
			if (light?._id) hiddenIds.push(light._id);
		}
	}

	return hiddenIds;
}

/**
 * Register the checkbox light provider with the hooks registry.
 * Called once during module initialization.
 */
export function registerCheckboxLightProvider() {
	registerHiddenLightProvider(buildLightControlsMap);
}

// Also export for backward compatibility
export { buildLightControlsMap };
