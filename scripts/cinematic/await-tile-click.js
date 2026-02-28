/**
 * Tile-click await provider for the cinematic timeline.
 *
 * Pauses cinematic execution until the player clicks a specific tile.
 * While waiting, target tiles are animated via TileAnimator with configurable
 * behaviours per state (idle/hover/dim).
 *
 * Config: { event: "tile-click", target: "tag:my-button", animation: { idle: ["float", "glow"], hover: ["scale"] } }
 *   - target: selector string (tag:X, id:X, tags-any:A,B, etc.)
 *   - animation: optional behaviour config per state (defaults: idle=float+glow, hover=scale, dim=none)
 *
 * Click detection approach inspired by Monks Active Tiles (MATT) by ironmonk88:
 *   - Listens for pointerdown on the canvas board element
 *   - Converts screen coords → canvas coords via `canvas.activeLayer.toLocal()`
 *   - Hit-tests against target tile bounds (respecting rotation)
 * See: https://github.com/ironmonk88/monks-active-tiles
 *
 * This avoids patching canvas layer prototypes — instead we attach a
 * temporary capture-phase listener on `#board` for the duration of the await.
 */

import { registerAwaitProvider } from "../tween/core/timeline/await-providers.js";
import { resolveSelector } from "../placeable-picker/core/resolver.js";
import { pointWithinTile } from "../common/geometry/point-within-tile.js";
import { TileAnimator } from "./tile-animator.js";

registerAwaitProvider("tile-click", (config, ctx) => {
	if (!config.target) {
		return Promise.reject(new Error('await tile-click: "target" is required'));
	}

	return new Promise((resolve, reject) => {
		if (ctx.signal.aborted) return reject(ctx.signal.reason ?? "aborted");

		// Resolve selector to placeables
		const resolved = resolveSelector(config.target);
		if (!resolved?.placeables?.length) {
			return reject(new Error(`await tile-click: no placeables found for "${config.target}"`));
		}

		const targets = resolved.placeables; // [{ placeable, doc }]

		// Create animators for each target tile
		const animators = [];
		for (const { placeable } of targets) {
			const animator = new TileAnimator(placeable, config.animation);
			animator.start("idle");
			animators.push({ placeable, animator });
		}

		const board = document.getElementById("board");
		let savedCursor = null;

		// ── Hover detection via pointermove ───────────────────────────────
		const onPointerMove = (event) => {
			const layer = canvas.activeLayer;
			if (!layer) return;

			const pt = layer.toLocal(event);
			if (!pt || isNaN(pt.x) || isNaN(pt.y)) return;

			let anyHovered = false;
			for (const { placeable, animator } of animators) {
				const isOver = pointWithinTile(placeable.document, pt);
				if (isOver) {
					anyHovered = true;
					if (animator.state !== "hover") animator.setState("hover");
				} else {
					if (animator.state === "hover") animator.setState("idle");
				}
			}

			// Cursor management
			if (anyHovered) {
				if (savedCursor === null) {
					savedCursor = document.body.style.cursor;
					document.body.style.cursor = "pointer";
				}
			} else if (savedCursor !== null) {
				document.body.style.cursor = savedCursor;
				savedCursor = null;
			}
		};

		board?.addEventListener("pointermove", onPointerMove);

		// ── Click detection ──────────────────────────────────────────────
		/**
		 * Pointerdown handler on #board — converts screen coords to canvas coords
		 * and hit-tests against target tiles.
		 *
		 * Approach adapted from MATT's canvasClick + checkClick pipeline:
		 * screen event → canvas.activeLayer.toLocal(event) → pointWithin(pt)
		 */
		const onPointerDown = (event) => {
			// Only respond to primary button (left click)
			if (event.button !== 0) return;

			const layer = canvas.activeLayer;
			if (!layer) return;

			// Convert screen coords to canvas coords (same as MATT's canvasClick)
			const pt = layer.toLocal(event);
			if (isNaN(pt.x) || isNaN(pt.y)) return;

			// Hit-test against all target tiles (highest sort first)
			const hit = targets
				.filter(({ doc }) => pointWithinTile(doc, pt))
				.sort((a, b) => (b.doc.sort ?? 0) - (a.doc.sort ?? 0))[0];

			if (!hit) return;

			// Consume the event so it doesn't propagate to other handlers
			event.stopPropagation();
			event.preventDefault();

			cleanup();
			resolve();
		};

		// Capture-phase listener on #board — fires before Foundry's own handlers
		board?.addEventListener("pointerdown", onPointerDown, { capture: true });

		// Abort handler
		const onAbort = () => {
			cleanup();
			reject(ctx.signal.reason ?? "aborted");
		};
		ctx.signal.addEventListener("abort", onAbort, { once: true });

		function cleanup() {
			board?.removeEventListener("pointerdown", onPointerDown, { capture: true });
			board?.removeEventListener("pointermove", onPointerMove);
			ctx.signal.removeEventListener("abort", onAbort);

			// Detach all animators
			for (const { animator } of animators) {
				animator.detach();
			}

			// Restore cursor
			if (savedCursor !== null) {
				document.body.style.cursor = savedCursor;
				savedCursor = null;
			} else {
				document.body.style.cursor = "";
			}
		}
	});
});
