# Session State — Placeable Picker

## User's Original Request
Implement the Placeable Picker feature and integrate it into the cinematic editor, replacing the target dropdown entirely.

## Context/Why
The cinematic editor's target dropdown was limited to Tagger tags and required pre-tagging. The Placeable Picker adds visual browsing, click-to-select, canvas highlighting, and supports more selector types (id:, tags-any:, tags-all:).

## Current Status

### DONE — Placeable Picker (standalone)
- [x] `scripts/placeable-picker/core/selectors.js` — parseSelector(), buildSelector(), buildTagSelector()
- [x] `scripts/placeable-picker/core/resolver.js` — resolveSelector() with all selector types
- [x] `scripts/placeable-picker/core/canvas-highlight.js` — PIXI highlights with pulse animation
- [x] `scripts/placeable-picker/ui/pick-mode.js` — canvas click-to-select mode
- [x] `scripts/placeable-picker/ui/PlaceablePickerApplication.js` — full ApplicationV2 window
- [x] `templates/placeable-picker.html` — Handlebars template
- [x] `styles/placeable-picker.css` — all styles
- [x] `scripts/placeable-picker/hooks.js` — API registration
- [x] `scripts/placeable-picker/index.js` — entry point
- [x] `src/eidolon-utilities.entry.js` — updated with imports

### DONE — Enhanced Canvas Highlights
- [x] Rewrote `canvas-highlight.js` with three highlight modes: `hover`, `selected`, `pick`
- [x] Added tinted PIXI Sprite overlays on `canvas.controls.debug` (non-destructive, inspired by tile-sort)
- [x] Hover: cyan tint overlay + solid border
- [x] Selected: gold tint overlay + pulsing border (persists while picker is open)
- [x] Pick mode: green tint overlay + border
- [x] `#refreshSelectionHighlights()` in PlaceablePickerApplication maintains selected highlights across renders
- [x] Hover-leave restores selected highlight if tile is in selection list
- [x] Credited tile-sort (theripper93) in canvas-highlight.js header
- [x] `#getSelectedIds()` now resolves ALL selector types (tag, tags-any, tags-all, uuid) not just `id:`
- [x] Pre-existing tag selectors show matching tiles as selected in browser grid + highlighted on canvas

### DONE — Cinematic Editor Integration
- [x] Replaced target `<select>` dropdown with readonly text + pick button (crosshairs icon)
- [x] Pick button opens PlaceablePickerApplication, writes result back to tween target
- [x] Removed `discoverTargets()` import and `#targets` field from CinematicEditorApplication
- [x] Refactored `runtime.js` — replaced local `resolveTarget()` + `normalizePlaceable()` with shared `resolveSelector()` + `adaptResolved()` bridge
- [x] Deleted `scripts/cinematic/ui/target-discovery.js` (dead code)
- [x] Build successful — 86 modules, all code bundled

## Next Steps
1. Test in Foundry pprod — open cinematic editor, verify pick button works
2. Test standalone picker: `game.modules.get("eidolon-utilities").api.picker.open()`
3. Test cinematic playback still works (runtime refactor)

## Key Decisions Made
- Replace dropdown entirely rather than adding picker alongside it
- Shared `resolveSelector()` lives in `placeable-picker/core/` — single source of truth
- Thin `adaptResolved()` bridge in runtime.js converts shared resolver shape to cinematic runtime shape
- `target-discovery.js` removed entirely — no longer needed

## Files Modified
- `scripts/placeable-picker/` — 7 NEW files (core + ui + hooks + index)
- `templates/placeable-picker.html` — NEW
- `styles/placeable-picker.css` — NEW
- `src/eidolon-utilities.entry.js` — MODIFIED (added picker imports)
- `templates/cinematic-editor.html` — MODIFIED (target select → text + pick button)
- `styles/cinematic-editor.css` — MODIFIED (added target-group + pick-btn styles)
- `scripts/cinematic/ui/CinematicEditorApplication.js` — MODIFIED (removed discoverTargets, added picker integration)
- `scripts/cinematic/runtime.js` — MODIFIED (replaced local resolveTarget with shared resolveSelector)
- `scripts/cinematic/ui/target-discovery.js` — DELETED
