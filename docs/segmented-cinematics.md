# Segmented Cinematics — Design

Supersedes `gates-as-entry-conditions.md`.

## Problem

The current cinematic timeline is a flat array where interaction gates (`await: { event: "tile-click" }`) appear between animation steps. This creates three problems:

1. **Dishonest timing** — gates represent potentially infinite waits but render as 16px markers. Total duration is indeterminate.
2. **Fragile progress tracking** — "step 5 of 12" means nothing when step 4 is a gate that may never fire.
3. **No structural visibility** — the author can't see the flow at a glance. A 12-entry timeline might be 3 animation sequences separated by 2 gates, but nothing in the data or UI makes that structure explicit.

The previous proposal (gates-as-entry-conditions.md) solved this by splitting into separate cinematics connected by `transitionTo`. That's architecturally clean but has UX costs: a 5-gate interactive sequence becomes 6 cinematics to name, manage, and reason about independently.

## Proposal: Segments within one cinematic

A cinematic becomes an **ordered graph of segments**, stored as a single document. Each segment has a deterministic timeline. Gates live on the boundary between segments, not inside timelines.

### Data model

```js
{
  version: 4,
  cinematics: {
    "temple-entrance": {
      trigger: "canvasReady",
      tracking: true,
      synchronized: true,

      // Entry point — always the first segment to execute
      entry: "intro",

      segments: {
        "intro": {
          setup: { "tag:overlay": { alpha: 0 } },
          landing: { "tag:overlay": { alpha: 1 } },
          timeline: [
            { tweens: [{ type: "tile-prop", target: "tag:overlay", attribute: "alpha", value: 1, duration: 2000 }] }
          ],
          // Edge: where to go after this segment completes
          next: "reveal"
        },

        "reveal": {
          // Gate: what must happen before this segment's timeline runs
          gate: { event: "click" },
          timeline: [
            { tweens: [{ type: "camera", x: 1200, y: 800, scale: 1.5, duration: 3000 }] },
            { tweens: [{ type: "tile-prop", target: "tag:door-icon", attribute: "alpha", value: 0.6, duration: 1000 }] }
          ],
          next: "finale"
        },

        "finale": {
          gate: {
            event: "tile-click",
            target: "tag:door-icon",
            animation: { idle: [{ name: "pulse", minAlpha: 0.3, maxAlpha: 0.6 }], hover: ["scale"] }
          },
          timeline: [
            { tweens: [{ type: "tile-prop", target: "tag:door-icon", attribute: "alpha", value: 0, duration: 500 }] }
          ]
          // No next → cinematic ends
        }
      }
    }
  }
}
```

### Key properties

**Segment:**

| Field | Required | Description |
|-------|----------|-------------|
| `gate` | No | Entry condition — interaction gate that must fire before timeline runs. Only on non-entry segments. |
| `setup` | No | Instant state applied before timeline starts (same as current) |
| `landing` | No | Instant state applied after timeline completes (same as current) |
| `timeline` | Yes | Array of deterministic entries: steps, delays, parallels, sounds, emits. **No interaction awaits.** |
| `next` | No | ID of the next segment. Absent = cinematic ends after this segment. |

**Gate** (same shape as current await config):

| Field | Required | Description |
|-------|----------|-------------|
| `event` | Yes | `"click"`, `"tile-click"`, `"keypress"` |
| `target` | For tile-click | Selector string (`"tag:door-icon"`, `"id:abc123"`) |
| `animation` | No | TileAnimator config (`{ idle, hover, dim }`) — active while waiting |
| `timeout` | No | Auto-advance after N ms if gate doesn't fire |

### What's allowed where

| Entry type | In segment timeline | As gate | Notes |
|-----------|-------------------|---------|-------|
| Step (tweens) | Yes | — | Core animation unit |
| Delay | Yes | — | Deterministic pause |
| Parallel | Yes | — | Branch coordination within segment |
| Sound / StopSound | Yes | — | Audio |
| Emit (signal) | Yes | — | Non-blocking, intra-parallel coordination |
| Await (signal) | Yes, in parallel only | — | Intra-parallel branch sync |
| Click / Tile-click / Keypress | **No** | Yes | User interaction = segment boundary |
| TransitionTo | **Removed** | — | Replaced by `next` edges |

**Signal emit/await** stays in parallel branches for intra-segment coordination — that's a different concern from interaction gates (see original analysis in gates-as-entry-conditions.md).

**TransitionTo** is subsumed by the segment graph. Cross-scene transitions become a property on `next`:

```js
next: { segment: "arrival", scene: "Scene.abc123" }
// vs simple same-scene:
next: "arrival"
```

## Runtime

### Execution flow

```
playCinematic(sceneId, "temple-entrance")
  ├─ Resolve entry segment: "intro"
  ├─ captureSnapshot(allSegmentStateMaps)     // snapshot ALL segments up front
  │
  ├─ Segment "intro":
  │   ├─ No gate → proceed
  │   ├─ Apply setup
  │   ├─ TweenTimeline.run(intro.timeline)    // deterministic, calculable duration
  │   ├─ Apply landing
  │   ├─ Save progress: { segment: "intro", completed: true }
  │   └─ next: "reveal"
  │
  ├─ Segment "reveal":
  │   ├─ Gate: click → await click
  │   ├─ Apply setup
  │   ├─ TweenTimeline.run(reveal.timeline)
  │   ├─ Apply landing
  │   ├─ Save progress: { segment: "reveal", completed: true }
  │   └─ next: "finale"
  │
  └─ Segment "finale":
      ├─ Gate: tile-click → animate door-icon, await click
      ├─ Apply setup
      ├─ TweenTimeline.run(finale.timeline)
      ├─ Apply landing
      ├─ Save progress: { segment: "finale", completed: true }
      └─ No next → done, apply cinematic landing
```

### EventBus scope

One EventBus per **segment** execution (same as current per-`run()` scope). Signals don't leak between segments. Each `TweenTimeline.run()` call gets a fresh bus.

### Progress tracking

Current system tracks step index. New system tracks **segment completion**:

```js
// Saved to user flags:
{ cinematic: "temple-entrance", completedSegments: ["intro", "reveal"], currentSegment: "finale" }
```

On page refresh mid-cinematic:
1. Read progress
2. Skip completed segments (apply their landing states instantly)
3. Resume at `currentSegment`'s gate (or mid-timeline if no gate)

This is more resilient than step-index tracking — segment boundaries are natural checkpoints.

### Snapshot & revert

Snapshot captures state for **all** segments up front (merge all setup/landing/before/after across all segments). Revert restores to pre-cinematic state, same as current.

## Editor UX

### Graph overview (new)

Top of the editor shows a horizontal flow diagram:

```
  ┌─────────┐         ┌─────────┐         ┌─────────┐
  │  intro  │──────▶──│ reveal  │──────▶──│ finale  │
  │  2.0s   │  click  │  4.0s   │tile-click│  0.5s   │
  └─────────┘         └─────────┘         └─────────┘
```

- Nodes = segments with calculated duration
- Edge labels = gate type
- Click a node to select it → swimlane below shows that segment's timeline
- Selected node highlighted
- Add/remove/reorder segments via context menu or buttons

### Swimlane (existing, scoped to one segment)

The existing swimlane view renders **one segment's timeline**. No gates in the swimlane — it's always deterministic. All existing swimlane features work unchanged (drag reorder, insert menu, tween editing, parallel branches).

### Segment detail panel

When a segment node is selected in the graph:
- Name (editable)
- Gate configuration (event type, target, animation config)
- Setup / Landing editors (existing JSON dialogs)
- Timeline swimlane below

### Footer

Cinematic-level properties stay in the footer: `trigger`, `tracking`, `synchronized`.

## Migration (v3 → v4)

Automated migration splits a v3 flat timeline at gate boundaries:

```
v3: [step, step, await:click, step, await:tile-click, step, step]

v4 segments:
  "segment-1": { timeline: [step, step], next: "segment-2" }
  "segment-2": { gate: { event: "click" }, timeline: [step], next: "segment-3" }
  "segment-3": { gate: { event: "tile-click" }, timeline: [step, step] }
  entry: "segment-1"
```

Rules:
- Split at each interaction await (click, tile-click, keypress)
- Signal awaits within parallel blocks stay as-is (not gates)
- `transitionTo` entries become `next` edges (possibly cross-scene)
- `setup` goes to first segment, `landing` goes to last segment
- `before`/`after` on steps stay with their steps
- Auto-generated segment names: `"segment-1"`, `"segment-2"`, etc. (author can rename)

Cinematics with no interaction gates → single segment named `"main"`, no gates, no `next`. Effectively identical behavior.

## Open questions

1. **Branching**: Should `next` support multiple targets (conditional edges)? E.g., "if player clicked door A go to segment X, if door B go to segment Y." Current design is linear only. Branching could be added later without breaking the model.

2. **Parallel segments**: Should two segments be able to run concurrently? The current model is strictly sequential. Parallel execution within a segment (via `parallel` entries) already covers most use cases.

3. **Cross-cinematic segments**: Should segments be referenceable across cinematics? E.g., a shared "fade-to-black" segment used by multiple cinematics. Probably not worth the complexity yet.

4. **Segment-level emit**: Should completing a segment emit a signal that other cinematics can listen to? Would enable loose coupling between independent cinematic chains. Out of scope for now.

## Status

**Design phase** — pending review and approval before implementation.
