/**
 * Canvas highlight utilities — adds/removes visual highlights on placeables.
 *
 * Two highlight modes:
 *   - **hover**: bright tinted sprite overlay + border (temporary, one at a time)
 *   - **selected**: subtle tinted overlay + pulsing border (persistent, multiple)
 *
 * Sprite overlays are added to canvas.controls.debug (non-destructive).
 * Border graphics are added as children of the placeable (auto-move).
 *
 * Tinted sprite technique inspired by tile-sort by theripper93:
 * https://github.com/theripper93/tile-sort
 */

/** WeakMap: placeable → { border, sprite, pulseData, mode } */
const highlightMap = new WeakMap();

/** All active pulse ticker functions for bulk cleanup. */
const activePulses = new Set();

/** All sprite overlays we've added to canvas.controls.debug, for cleanup. */
const activeSprites = new Set();

// ── Highlight presets ────────────────────────────────────────────────────

const PRESETS = {
	hover: {
		borderColor: 0x00CED1,
		borderAlpha: 0.9,
		borderWidth: 3,
		spriteTint: 0x00CED1,
		spriteAlpha: 0.35,
		pulse: false,
	},
	selected: {
		borderColor: 0xD9A441,
		borderAlpha: 0.8,
		borderWidth: 3,
		spriteTint: 0xD9A441,
		spriteAlpha: 0.18,
		pulse: true,
	},
	pick: {
		borderColor: 0x00FF88,
		borderAlpha: 0.7,
		borderWidth: 2,
		spriteTint: 0x00FF88,
		spriteAlpha: 0.25,
		pulse: false,
	},
	interactive: {
		borderColor: 0x44DDFF,
		borderAlpha: 0.85,
		borderWidth: 3,
		spriteTint: 0x44DDFF,
		spriteAlpha: 0.22,
		pulse: true,
	},
	interactiveHover: {
		borderColor: 0xFFFFFF,
		borderAlpha: 1.0,
		borderWidth: 4,
		spriteTint: 0xFFFFFF,
		spriteAlpha: 0.35,
		pulse: false,
	},
};

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Add a highlight to a placeable.
 *
 * @param {PlaceableObject} placeable
 * @param {{ mode?: "hover"|"selected"|"pick", color?: number, alpha?: number, pulse?: boolean }} [options]
 * @returns {boolean} true if highlight was added
 */
export function addHighlight(placeable, options = {}) {
	if (!placeable) return false;

	// Remove any existing highlight on this placeable first
	removeHighlight(placeable);

	const mode = options.mode ?? (options.color != null ? "custom" : "hover");
	const preset = PRESETS[mode] ?? PRESETS.hover;

	const borderColor = options.color ?? preset.borderColor;
	const borderAlpha = options.alpha ?? preset.borderAlpha;
	const spriteTint = options.color ?? preset.spriteTint;
	const spriteAlpha = preset.spriteAlpha;
	const pulse = options.pulse ?? preset.pulse;

	const entry = { border: null, sprite: null, pulseData: null, mode };

	// ── Border (child of placeable — auto-moves) ──────────────────────
	const w = placeable.document?.width ?? placeable.w ?? 100;
	const h = placeable.document?.height ?? placeable.h ?? 100;

	const border = new PIXI.Graphics();
	border.lineStyle(preset.borderWidth, borderColor, borderAlpha);
	border.drawRect(0, 0, w, h);
	placeable.addChild(border);
	entry.border = border;

	// ── Tinted sprite overlay (on canvas.controls.debug) ──────────────
	const sprite = createTintSprite(placeable, spriteTint, spriteAlpha);
	if (sprite) {
		canvas.controls.debug.addChild(sprite);
		activeSprites.add(sprite);
		entry.sprite = sprite;
	}

	// ── Pulse animation ───────────────────────────────────────────────
	if (pulse && canvas.app?.ticker) {
		const pulseData = {
			elapsed: 0,
			fn: (dt) => {
				pulseData.elapsed += dt;
				const t = (Math.sin(pulseData.elapsed * 0.05) + 1) / 2;
				// Pulse the border alpha
				if (entry.border) entry.border.alpha = borderAlpha * (0.4 + 0.6 * t);
				// Subtle pulse on the sprite too
				if (entry.sprite) entry.sprite.alpha = spriteAlpha * (0.5 + 0.5 * t);
			},
		};
		canvas.app.ticker.add(pulseData.fn);
		entry.pulseData = pulseData;
		activePulses.add(pulseData);
	}

	highlightMap.set(placeable, entry);
	return true;
}

/**
 * Remove highlight from a placeable.
 *
 * @param {PlaceableObject} placeable
 */
export function removeHighlight(placeable) {
	if (!placeable) return;

	const entry = highlightMap.get(placeable);
	if (!entry) return;

	// Remove pulse ticker
	if (entry.pulseData) {
		canvas.app?.ticker?.remove(entry.pulseData.fn);
		activePulses.delete(entry.pulseData);
	}

	// Remove border graphic
	if (entry.border) {
		if (entry.border.parent) entry.border.parent.removeChild(entry.border);
		entry.border.destroy({ children: true });
	}

	// Remove sprite overlay
	if (entry.sprite) {
		if (entry.sprite.parent) entry.sprite.parent.removeChild(entry.sprite);
		entry.sprite.destroy({ children: true });
		activeSprites.delete(entry.sprite);
	}

	highlightMap.delete(placeable);
}

/**
 * Check if a placeable has a highlight.
 *
 * @param {PlaceableObject} placeable
 * @returns {boolean}
 */
export function hasHighlight(placeable) {
	return highlightMap.has(placeable);
}

/**
 * Remove all picker highlights from the canvas.
 */
export function clearAllHighlights() {
	// Clean up all pulse tickers
	for (const pulseData of activePulses) {
		canvas.app?.ticker?.remove(pulseData.fn);
	}
	activePulses.clear();

	// Clean up all sprite overlays
	for (const sprite of activeSprites) {
		if (sprite.parent) sprite.parent.removeChild(sprite);
		sprite.destroy({ children: true });
	}
	activeSprites.clear();

	// Clean up all border graphics
	const layers = [
		canvas.tiles?.placeables,
		canvas.tokens?.placeables,
		canvas.lighting?.placeables,
		canvas.drawings?.placeables,
		canvas.sounds?.placeables,
	];

	for (const placeables of layers) {
		if (!placeables) continue;
		for (const p of placeables) {
			const entry = highlightMap.get(p);
			if (!entry) continue;
			if (entry.border) {
				if (entry.border.parent) entry.border.parent.removeChild(entry.border);
				entry.border.destroy({ children: true });
			}
			highlightMap.delete(p);
		}
	}
}

// ── Internal: Sprite creation ────────────────────────────────────────────

/**
 * Create a tinted PIXI Sprite from a placeable's mesh texture.
 * Placed at the tile's position on canvas.controls.debug (non-destructive).
 *
 * Inspired by tile-sort's createHighlight approach.
 *
 * @param {PlaceableObject} placeable
 * @param {number} tint  Tint color
 * @param {number} alpha  Sprite alpha
 * @returns {PIXI.Sprite | null}
 */
function createTintSprite(placeable, tint, alpha) {
	const mesh = placeable.mesh;
	if (!mesh?.texture?.baseTexture) return null;

	const sprite = PIXI.Sprite.from(mesh.texture);
	sprite.isSprite = true;
	sprite.anchor.set(mesh.anchor.x, mesh.anchor.y);
	sprite.width = mesh.width;
	sprite.height = mesh.height;
	sprite.scale = mesh.scale;
	sprite.position = placeable.center;
	sprite.angle = mesh.angle;
	sprite.alpha = alpha;
	sprite.tint = tint;
	sprite.name = "eidolonPickerHighlight";

	return sprite;
}
