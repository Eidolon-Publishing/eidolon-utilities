# Custom Easing Curves — Future Feature

## Concept

Replace the easing dropdown in tween cards with a dual-mode control:

1. **Preset mode** (current): named easing dropdown (easeOutCubic, easeInOutSine, etc.)
2. **Custom mode**: inline cubic bezier curve editor with draggable control points

## Data Format

Currently:
```json
{ "easing": "easeOutCubic" }
```

Custom curve:
```json
{ "easing": [0.34, 1.56, 0.64, 1] }
```

Standard CSS `cubic-bezier(x1, y1, x2, y2)` format. Four numbers, all that's needed. Named presets remain strings — `resolveEasing()` checks the type and returns the appropriate function.

## Engine Change

In `resolveEasing()`:

```js
if (Array.isArray(nameOrPoints)) {
    const [x1, y1, x2, y2] = nameOrPoints;
    return cubicBezier(x1, y1, x2, y2);
}
```

The `cubicBezier()` function is a well-known ~20-line implementation (binary search on the X curve to find t, then evaluate Y). No dependencies needed.

## UI: Curve Editor Widget

A small `<canvas>` element (~160x120px) embedded in the tween card body, replacing or augmenting the easing dropdown.

### Elements
- **Curve canvas**: draws the bezier curve from (0,0) to (1,1)
- **Two control point handles**: draggable dots (P1 at start, P2 at end)
- **Guide lines**: dashed lines from endpoints to their control points
- **Preset toggle**: button or dropdown to switch back to named presets (populates the canvas with that preset's control points)

### Interactions
- Drag control points with mouse — curve redraws in real time
- Y values can exceed 0–1 range (overshoot/anticipation)
- X values clamped to 0–1 (time must be monotonic)
- Double-click a handle to reset it
- Optional: "Test" button plays a dot along the curve so you can feel the timing

### Serialization
- On change, write `[x1, y1, x2, y2]` to the tween's easing field
- On load, if easing is an array, populate the canvas; if string, show the dropdown

## Visual Reference

```
    1.0 ┤          ╭──●  P2=(0.64, 1.0)
        │        ╱
        │      ╱
        │    ╱
        │  ●        P1=(0.34, 1.56) — overshoot!
        │╱
    0.0 ┼──────────────
       0.0           1.0
```

## Implementation Scope

1. **`cubicBezier()` math** — add to `easing.js` (~20 lines)
2. **Array check in `resolveEasing()`** — 3 lines
3. **`CurveEditorWidget` class** — new file, ~150-200 lines
   - Canvas rendering (curve + handles + guides)
   - Mouse drag handling with clamping
   - Preset ↔ custom toggle
4. **Tween card integration** — swap easing `<select>` for the widget when custom mode active
5. **Serialization** — already handled by the array format

## Nice-to-haves

- Grid lines on the canvas (0.25 increments)
- Snap to common values
- Preview animation (ball sliding along the curve)
- Copy/paste curve values between tweens
- Preset library that saves custom curves by name
