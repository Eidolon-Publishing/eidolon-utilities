# Placeable Presets — Design Document

**Status:** Decisions complete — ready for implementation
**Scope:** Scene-level named presets for placeables (starting with AmbientLight)

---

## Problem

Currently, each light stores its own criteria mappings independently. If 20 torches should behave identically (same base, same No Lights behavior, same mood variants), each one must be configured individually. Changing the behavior means editing all 20.

## Goal

Introduce **named presets** at the scene level that placeables can reference. Change the preset once, all referencing placeables update. Individual placeables can still override or go fully standalone.

---

## Core Concepts

### 1. Preset

A named, reusable criteria configuration stored at the scene level.

```
"Goblin Torch" = {
  base: { config: { color: "#e01b24", dim: 40, bright: 20, ... }, hidden: false },
  mappings: [
    { criteria: { nolights: "No Lights" }, config: { hidden: true } },
    { criteria: { variant: "Goblin" }, config: { hidden: false } }
  ]
}
```

### 2. Placeable Reference Modes

Each placeable operates in one of three modes:

| Mode | Description | Storage |
|------|-------------|---------|
| **Preset** | Fully inherits a named preset | `presetId` only |
| **Preset + Override** | Inherits preset, with local deltas | `presetId` + `overrides` |
| **Standalone** | Fully custom (current behavior) | `base` + `mappings` (as today) |

### 3. Resolution Order

```
Final config = merge(preset.base, preset.mapping_delta, local.overrides)
```

For standalone lights, nothing changes from today.

---

## Open Questions

### Q1: Storage Location

**Option A — Scene flags only**
- `scene.flags.eidolon-utilities.presets.AmbientLight.{presetId}`
- Simple, per-scene. Each scene can have different presets.
- Downside: can't reuse across scenes without copy.

**Option B — World-level settings + scene overrides**
- World settings store "global" presets, scenes can override or extend.
- More powerful but more complex resolution.

**Option C — Compendium-based**
- Presets stored as JournalEntries or similar in a compendium.
- Maximum reuse, but heavy for simple use cases.

**Decision: Option A — Scene flags only.** Natural fit for module publication workflow. Adventures export cleanly. Cross-scene reuse can be added later via "copy presets from scene" without schema changes.

### Q2: Preset Scope — Lights Only or Multi-Type?

**Decision: Type-namespaced schema and generic CRUD/resolution, but only AmbientLight UI for now.** The `type` parameter costs nothing and avoids a migration when AmbientSound or others are added later.

```
scene.flags.eidolon-utilities.presets = {
  AmbientLight: { ... },
  // future: AmbientSound: { ... }, etc.
}
```

Per-type hook: each type provides its own `sanitizePayload` (e.g., lights allow `config`, `hidden`, `vision`).

### Q3: Delta vs Full Snapshot in Presets

**Decision: Delta for both layers.**

- **Preset mappings:** Delta from preset base. Base changes propagate to all mappings automatically.
- **Local overrides:** Delta from preset base, applied before mapping deltas. Base-only — no per-mapping overrides on individual placeables. If a light needs per-mapping divergence, use a different preset or go standalone.

Resolution: `final = merge(preset.base, local.base_override, matching_mapping_delta)`

### Q4: What Happens When a Preset Is Deleted?

**Decision: Detach with confirmation.** On delete, check for references. If none, delete immediately. If references exist, show dialog: "Used by N lights. Detach & Delete (bake current config into each light as standalone) or Cancel." Bake process: merge preset base + local override → standalone base; copy preset mappings as-is (they're already deltas).

### Q5: How Does the Criteria Engine Apply Presets?

**Decision: Inline expansion (Option A).** Add `expandPresetToEffectiveState(light, scene)` that normalizes preset-mode lights into the same shape as standalone lights before resolution. One code path, existing resolver unchanged.

Resolution flow:
1. Criteria change detected (or preset edited → triggers full re-resolve)
2. For each light: expand preset to effective state (standalone passes through unchanged)
3. Resolve as today: find matching mapping delta, merge, apply

Performance note: flag reads are in-memory, negligible cost. If hundreds-of-lights maps show issues, add a `Map<presetId, preset>` cache at cycle start (~10 lines, no schema change).

New trigger: preset edit → re-run full criteria resolve for the scene.

---

## Storage Schema (Draft)

### Scene-Level Presets

```jsonc
// scene.flags.eidolon-utilities.presets
{
  "AmbientLight": {
    "goblin-torch": {
      "id": "goblin-torch",
      "name": "Goblin Torch",
      "base": {
        "config": { "color": "#e01b24", "dim": 40, "bright": 20, "animation": { "type": "flame" } },
        "hidden": false,
        "vision": false
      },
      "mappings": [
        {
          "id": "m1",
          "key": "nolights:No Lights",
          "criteria": { "nolights": "No Lights" },
          "config": { "hidden": true }
        }
      ]
    }
  }
}
```

### Per-Light Flags

```jsonc
// Preset mode (pure reference):
// light.flags.eidolon-utilities.lightCriteria
{
  "mode": "preset",
  "presetId": "goblin-torch"
}

// Preset + base override (this torch is dimmer):
{
  "mode": "preset",
  "presetId": "goblin-torch",
  "overrides": {
    "base": { "config": { "dim": 30 } }
  }
}

// Standalone mode (backwards compatible with today):
// absent "mode" or mode: "standalone" — legacy data implies standalone
{
  "base": { ... },
  "mappings": [ ... ],
  "current": { ... }
}
```

---

## UI Design

### A. Preset Manager (Standalone Window)

**Decision:** Standalone `PresetManagerApplication` (ApplicationV2), not a Scene Config tab. Keeps Scene Config clean, gives room for a proper layout, follows existing pattern (light criteria manager is also a separate dialog).

**Entry points:**
- Button in the Scene Criteria section: "Manage Lighting Presets"
- Button in the lighting layer controls (left sidebar)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ⚡ Lighting Presets                    _ □ ✕    │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐        │
│  │ 🔴 Goblin Torch        2 mappings  │ [actions│
│  │     12 lights                       │        │
│  ├─────────────────────────────────────┤        │
│  │ 🟡 Wall Sconce         1 mapping   │ [actions│
│  │     8 lights                        │        │
│  └─────────────────────────────────────┘        │
│  [+ New Preset]                                 │
└─────────────────────────────────────────────────┘
```

Each row: color swatch, name, mapping count, reference count (computed on render by scanning scene lights), actions (Edit, Duplicate, Delete).

### B. Preset Editor (Hybrid: Inline + Capture)

**Decision:** Option D hybrid. Inline editing for common fields + "Capture from selected light" for full config including other modules' fields.

**Layout:**
```
┌──────────────────────────────────────────────────┐
│ Edit Preset: Goblin Torch                        │
├──────────────────────────────────────────────────┤
│  Base Configuration                              │
│  Color: [#e01b24] [■]   Dim: [40]  Bright: [20] │
│  Alpha: [0.1]  Animation: Flame  Speed: 5       │
│  Hidden: [ ]    Vision: [ ]                      │
│  [📷 Capture from selected light]                │
│                                                  │
│  Mappings                                        │
│  nolights: No Lights → hidden: true              │
│  mood: Night → color: #991100, bright: 10        │
│  [+ Add Mapping]                                 │
│                                                  │
│  [Cancel]                     [Save Preset]      │
└──────────────────────────────────────────────────┘
```

- Base fields: directly editable for common properties (color, dim, bright, alpha, animation, hidden, vision)
- "Capture from selected light": grabs full config from a canvas light (handles advanced fields from other modules)
- Mappings: summary of deltas. "Add Mapping" captures from light state or opens mini-form for delta fields
- Advanced config (lightmask, soft fade, etc.) only settable via capture

### C. Light Config — Preset Selector

**Decision:** Preset dropdown above/replacing the current criteria mapping switcher.

```
Preset: [None ▾] / [Goblin Torch ▾] / [Wall Sconce ▾]
```

- **Selecting a preset:** Sets `mode: "preset"`, hides criteria mapping section. Shows read-only summary of preset base + mappings. "Edit Preset" button opens editor.
- **Selecting "None":** Sets `mode: "standalone"`, shows current criteria mapping UI unchanged.
- **Override toggle:** When preset is selected, "Override base" button reveals compact override section for local delta adjustments.

90% flow: open light → select preset from dropdown → close.
10% flow: select preset → click Override → tweak dim radius → close.
One-offs: leave as None → use existing standalone criteria UI.

### D. Bulk Assignment

**Entry point:** Lighting layer controls or context menu when multiple lights are selected.

**Flow:**
1. Select lights on canvas
2. "Assign Preset" action → dropdown of available presets
3. Select → all lights get `mode: "preset", presetId: "..."`
4. Criteria engine re-resolves immediately

**Promote to Preset:** Select a standalone light → "Promote to Preset" → enter name → config becomes a new preset, light switches to preset mode. Then bulk-assign to similar lights.

---

## Migration

Existing lights with `lightCriteria` flags (no `mode` field) are treated as `mode: "standalone"`. No migration needed — new system is additive.

Optional: "Promote to Preset" action on a standalone light → extracts its config into a new named preset and converts the light to preset mode.

---

## Implementation Phases

### Phase 1 — Schema & Storage
- Define preset storage on scene flags
- CRUD functions for presets (create, read, update, delete)
- Reference resolution logic (preset + overrides → final config)
- Backward compatibility: absent `mode` = standalone

### Phase 2 — Criteria Engine Integration
- Update the criteria resolver to handle preset mode
- Detach logic when preset is deleted

### Phase 3 — UI: Scene Presets Manager
- Scene config tab/section for managing presets
- Preset editor dialog

### Phase 4 — UI: Light Config Integration
- Mode selector in light config
- Preset dropdown
- Override editor

### Phase 5 — Bulk Operations
- Multi-select → assign preset
- "Promote to preset" from existing standalone light

---

## Resolution — Detailed Spec

### Multi-Criteria Matching

When multiple criteria are active simultaneously (e.g., mood=Night AND weather=Rain), matching works the same as the current system:

- Each mapping has a `criteria` object (e.g., `{ mood: "Night" }` or `{ mood: "Night", weather: "Rain" }`).
- A mapping matches if ALL of its criteria are satisfied by the current scene criteria.
- More specific mappings (more criteria keys) take priority over less specific ones.
- If multiple mappings match at the same specificity, the last one wins (array order).
- Only the single best-matching mapping's delta is applied (not a merge of all matching deltas).

This is unchanged from the current `convertLightCriteriaStateToPresets` → resolver flow.

### `expandPresetToEffectiveState(lightDoc, scene)` — Spec

**Input:** An `AmbientLightDocument` and its parent `Scene`.
**Output:** A state object identical in shape to standalone `lightCriteria`:
```jsonc
{
  "base": { "config": {...}, "hidden": false, "vision": false },
  "mappings": [ { "id": "...", "key": "...", "criteria": {...}, "config": {...} }, ... ],
  "current": null  // preset mode doesn't track current — criteria engine determines active mapping at resolve time
}
```

**Logic:**
1. Read `light.flags.eidolon-utilities.lightCriteria`
2. If `mode` is absent or `"standalone"` → return the state as-is (backward compatible)
3. If `mode === "preset"`:
   a. Read `scene.flags.eidolon-utilities.presets.AmbientLight[state.presetId]`
   b. If preset not found → return `null` (orphaned reference — caller should skip or warn)
   c. `effectiveBase = foundry.utils.mergeObject(preset.base, state.overrides?.base ?? {}, { inplace: false })`
   d. `effectiveMappings = deepClone(preset.mappings)`
   e. Return `{ base: effectiveBase, mappings: effectiveMappings, current: null }`

**Interaction with existing functions:**
- `getLightCriteriaState()` continues to read the raw flags (unchanged)
- `expandPresetToEffectiveState()` is called by the criteria engine BEFORE passing to `convertLightCriteriaStateToPresets()`
- `setLightCriteriaState()` is NOT used for preset-mode writes — preset mode uses `setFlag` directly for `presetId`/`overrides`

### `current` Field in Preset Mode

Standalone lights track `current: { mappingId, categories }` to remember which mapping is active between resolve cycles. In preset mode, this is unnecessary:
- The active mapping is determined by scene criteria at resolve time
- Presets don't have a "currently selected mapping" concept in the UI
- The `current` field is omitted (set to `null`) in the expanded effective state

### Capture From Light — Detailed Flow

The "Capture from selected light" button in the preset editor:

1. Check `canvas.tokens.controlled` → no. Check `canvas.lighting.controlled` → get the first controlled `AmbientLight`.
2. If no light is selected → show notification: "Select a light on the canvas first."
3. Read `light.document.toObject()` and pass through `sanitizeLightConfigPayload()` (strips positional fields, keeps `config`, `hidden`, `vision`).
4. Populate the preset editor's base fields with the captured values.
5. For "Capture to Mapping": same flow, but compute the delta from current base → captured config, and store as a new mapping entry.

---

## File Structure — Where Code Lives

### New Files (Phase 1-2)

```
scripts/placeable-presets/
├── core/
│   ├── constants.js          # FLAG_PRESETS, PRESET_MODE_*, type sanitizer registry
│   ├── storage.js            # CRUD: createPreset, getPreset, updatePreset, deletePreset, listPresets
│   ├── resolver.js           # expandPresetToEffectiveState, detachPresetToStandalone
│   └── sanitizers.js         # Per-type payload sanitizers (re-export existing sanitizeLightConfigPayload)
├── ui/
│   ├── PresetManagerApplication.js   # Phase 3: list of presets
│   ├── PresetEditorApplication.js    # Phase 3: edit a single preset
│   ├── light-config-preset.js        # Phase 4: inject preset selector into AmbientLightConfig
│   └── bulk-assign.js                # Phase 5: multi-select assignment
├── hooks.js                  # Register all preset-related hooks
└── index.js                  # Feature entry point
```

### Existing Files Modified

| File | Change |
|------|--------|
| `src/eidolon-utilities.entry.js` | Import `scripts/placeable-presets/index.js` |
| `scripts/criteria-engine/hooks.js` | Call `expandPresetToEffectiveState` before resolution |
| `scripts/light-criteria/core/storage.js` | `sanitizeLightConfigPayload` already fixed (ALLOWED_KEYS) — no change needed |
| `scripts/light-criteria/ui/AmbientLightCriteriaControls.js` | Phase 4: add preset selector dropdown, conditionally hide standalone UI |
| `styles/` | New `placeable-presets.css` for manager/editor styling |
| `templates/` | New templates for manager list + editor form |

---

## Risks & Considerations

- **UX complexity**: The mode selector adds a concept users need to understand. Default should be the simplest path (standalone stays default, presets are opt-in).
- **Circular resolution**: Presets should NOT reference other presets (no chains).
- **Performance**: Resolution needs to be fast — called per-light per-criteria-change. Scene-level preset lookup is O(1) by ID, should be fine.
- **Undo/redo**: Foundry's undo stack works at the document level. Changing a preset affects N lights via re-resolve (not direct document updates to each light's flags). The preset change itself is a single scene flag update (undoable). The light config changes from re-resolve are `updateEmbeddedDocuments` calls (also undoable, but separately).
- **Orphaned presetIds**: If scene flags are manually edited or corrupted, lights may reference nonexistent presets. `expandPresetToEffectiveState` returns `null` for orphans — the criteria engine skips them and optionally warns.
