# Gates as Entry Conditions — Design Analysis

## Problem Statement

The current cinematic system allows gates (click, tile-click, keypress, signal) anywhere in a timeline. This creates a dishonest timing representation: the timeline view renders gates as 16px markers, but they represent potentially infinite waits for user interaction. The "timeline" metaphor breaks down because the total duration is indeterminate.

## Proposal

Restrict **interaction gates** (click, tile-click, keypress) to the start of a cinematic as an "entry condition" property, rather than allowing them as inline timeline steps. Use the existing `transitionTo` mechanism for chaining cinematics.

## Current vs Proposed

### Current: gates anywhere

```
Cinematic "intro":
  [step: fade-in] → [gate: click] → [step: reveal] → [gate: tile-click] → [step: finale]
```

One cinematic with indeterminate duration. Timeline view can't honestly represent timing.

### Proposed: gates as entry conditions

```
Cinematic "intro" (trigger: canvasReady):
  [step: fade-in] → transitionTo { cinematic: "reveal" }

Cinematic "reveal" (entryGate: click):
  [step: reveal] → transitionTo { cinematic: "finale" }

Cinematic "finale" (entryGate: tile-click):
  [step: finale]
```

Each cinematic has a deterministic, calculable duration. The timeline view is honest.

## The Signal/Emit Exception

The `EventBus` is scoped per `run()` invocation (TweenTimeline.js), meaning emit/await signals only coordinate within the same cinematic's parallel branches. That's fundamentally different from interaction gates which wait for external user input.

Proposed split:

| Type | Where allowed | Rationale |
|------|--------------|-----------|
| click, tile-click, keypress | Only as cinematic entry condition (`entryGate`) | External user interaction = flow control between cinematics |
| signal await | Still allowed in parallel branches | Internal coordination between concurrent animation branches |
| emit | Anywhere (non-blocking) | Just fires a signal, no timing impact |

This cleanly separates **user interaction** (graph edges between cinematics) from **internal orchestration** (parallel branch sync within a cinematic).

## Graph View

Once interaction gates live on the cinematic boundary, a graph-based view becomes natural:

- **Nodes** = cinematics (deterministic animation sequences with calculable duration)
- **Edges** = `transitionTo` links, annotated with the entry gate type
- **Visual**: `[canvasReady] → intro(2.5s) → [click] → reveal(4s) → [tile-click] → finale(3s)`

This is a **state machine** where each state is an animation sequence and transitions are user interactions. The graph makes the control flow explicit in a way that a linear timeline cannot.

The graph view and per-node timeline view complement each other: graph for flow, timeline for animation detail within a single node.

## Implementation Sketch

1. Add `entryGate` as a new optional property on the cinematic data model (alongside `trigger`, `tracking`, etc.):
   ```js
   {
     trigger: "manual",
     entryGate: { event: "tile-click", target: "tag:door-icon", animation: { idle: ["float", "glow"] } },
     tracking: true,
     setup: { ... },
     landing: { ... },
     timeline: [ ... ]
   }
   ```

2. In `playCinematic()` (hooks.js), check for `entryGate` and await it before executing the timeline. The tile-click animation setup from `await-tile-click.js` would run during this wait.

3. Keep `emit` / `await signal` allowed within `parallel` blocks for branch coordination.

4. Remove interaction gate types (click, tile-click, keypress) from `addAwait` in the top-level timeline. Signal await remains available for parallel branch use.

5. Build the graph view as a separate visualization from the timeline — the timeline shows internals of one cinematic node, the graph shows the overall inter-cinematic flow.

6. Progress tracking shifts from "step index within one cinematic" to "which cinematic in the chain has been completed" — each cinematic fully completes or doesn't.

## Trade-offs

### Costs

- **More cinematics per scene** — a 5-gate interactive sequence becomes 6 cinematics. Naming and managing them adds overhead.
- **`transitionTo` overhead** — each chained cinematic re-resolves all targets, captures new snapshots. Not huge, but not zero.
- **New data model field** — `entryGate` is a new concept alongside `trigger`. Need to define how they interact (e.g., `trigger: "manual"` + `entryGate: { event: "click" }` means "only plays when triggered by transitionTo, and waits for click before animating").
- **Migration** — existing cinematics with mid-timeline gates need to be split. Could be automated but needs care around setup/landing state propagation.

### Benefits

- **Honest timing** — each timeline has a calculable, deterministic duration.
- **Natural graph visualization** — cinematics as nodes, interactions as edges.
- **Simpler runtime per cinematic** — no mid-flow yielding to user input.
- **Easier debugging** — "player is waiting at the reveal cinematic's entry gate" vs "player is stuck somewhere in the middle of intro."
- **Replayability** — individual segments can be re-triggered independently.
- **Composability** — cinematics become reusable units that can be recombined.

## Status

**Design analysis only** — no implementation yet. Pending refactors in the cinematic system first.
