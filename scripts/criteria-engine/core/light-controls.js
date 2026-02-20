/**
 * Build the list of light ids hidden by checkbox tiles.
 *
 * This mirrors the Map UI Presets checkbox behavior so criteria resolution
 * keeps the same light visibility semantics.
 */
export function buildLightControlsMap() {
  if (!globalThis.Tagger) return [];

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

