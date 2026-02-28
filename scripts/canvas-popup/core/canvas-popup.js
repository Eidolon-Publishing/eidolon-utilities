/**
 * CanvasPopup — a canvas-anchored HTML popup primitive.
 *
 * Positions a DOM element relative to a canvas coordinate, placeable, or document.
 * Tracks pan/zoom via the canvasPan hook and scales with the canvas.
 * Dismisses on click-outside or Escape by default.
 *
 * This is a generic container — it has zero knowledge of its content.
 */

import { CSS_PREFIX, Z_INDEX } from "./constants.js";
import { canvasToScreen, getZoom, resolveUnit } from "./position.js";
import { attachClickOutside, attachRightClickOutside, attachEscape } from "./dismissal.js";

/** @type {Set<CanvasPopup>} All mounted instances. */
const instances = new Set();

const VIEWPORT_MARGIN = 8;
const POSITION_TOLERANCE = 0.5;

export class CanvasPopup {
	/**
	 * @param {object} options
	 * @param {{ x: number, y: number } | { placeable: PlaceableObject } | { document: object }} options.anchor
	 * @param {{ x?: number, y?: number }} [options.offset]
	 * @param {"left" | "center" | "right"} [options.anchorX]
	 * @param {"top" | "center" | "bottom"} [options.anchorY]
	 * @param {"grid" | "canvas" | "screen"} [options.sizeUnit]
	 * @param {{ clickOutside?: boolean, rightClickOutside?: boolean, escape?: boolean }} [options.dismiss]
	 * @param {string} [options.cssClass]
	 * @param {boolean} [options.animate]
	 * @param {number | "anchor"} [options.width]
	 * @param {boolean} [options.clampToViewport]
	 * @param {HTMLElement | string} [options.content]
	 */
	constructor(options = {}) {
		this._anchor = this._resolveAnchor(options.anchor);
		this._offset = { x: options.offset?.x ?? 0, y: options.offset?.y ?? 0 };
		this._anchorX = options.anchorX ?? "left";
		this._anchorY = options.anchorY ?? "top";
		this._sizeUnit = options.sizeUnit ?? "grid";
		this._dismiss = {
			clickOutside: options.dismiss?.clickOutside ?? true,
			rightClickOutside: options.dismiss?.rightClickOutside ?? false,
			escape: options.dismiss?.escape ?? true,
		};
		this._cssClass = options.cssClass ?? "";
		this._animate = options.animate ?? true;
		this._width = options.width ?? null;
		this._clampToViewport = options.clampToViewport ?? true;
		this._initialContent = options.content ?? null;

		/** @type {HTMLElement | null} */
		this.element = null;

		/** @type {boolean} */
		this.isOpen = false;

		this._cleanups = [];
		this._listeners = new Map();
		this._hookId = null;
		this._tickerFn = null;
		this._lastScreenPos = { x: -99999, y: -99999 };
	}

	// ── Public API ────────────────────────────────────────────────────────

	/**
	 * Append popup to the DOM and start tracking.
	 * @returns {this}
	 */
	mount() {
		if (this.isOpen) return this;

		// Build DOM
		const root = document.createElement("div");
		root.className = CSS_PREFIX;
		if (this._cssClass) root.classList.add(...this._cssClass.split(/\s+/));
		root.style.position = "fixed";
		root.style.zIndex = Z_INDEX;

		const contentWrap = document.createElement("div");
		contentWrap.className = `${CSS_PREFIX}__content`;
		root.appendChild(contentWrap);

		this.element = root;
		this._contentWrap = contentWrap;

		// Apply explicit width
		const resolvedWidth = this._resolveWidth();
		if (resolvedWidth != null) {
			contentWrap.style.width = `${resolvedWidth}px`;
			contentWrap.style.minWidth = "0";
			contentWrap.style.boxSizing = "border-box";
		}

		// Initial content
		if (this._initialContent) {
			this.setContent(this._initialContent);
		}

		// Append to DOM
		document.body.appendChild(root);

		// Initial position (before visible, so no flash)
		this.reposition();

		// Animate in
		if (this._animate) {
			requestAnimationFrame(() => {
				if (this.element) this.element.classList.add(`${CSS_PREFIX}--visible`);
			});
		} else {
			root.classList.add(`${CSS_PREFIX}--visible`);
		}

		// Pan/zoom tracking
		this._hookId = Hooks.on("canvasPan", () => this.reposition());

		// Placeable movement tracking via ticker
		if (this._anchor.placeable && canvas.app?.ticker) {
			this._tickerFn = () => this.reposition();
			canvas.app.ticker.add(this._tickerFn);
		}

		// Dismissal handlers
		const dismissFn = (reason) => {
			this._emit("dismiss", reason);
			this.destroy();
		};

		if (this._dismiss.clickOutside) {
			this._cleanups.push(attachClickOutside(root, () => dismissFn("clickOutside")));
		}
		if (this._dismiss.rightClickOutside) {
			this._cleanups.push(attachRightClickOutside(root, () => dismissFn("rightClickOutside")));
		}
		if (this._dismiss.escape) {
			this._cleanups.push(attachEscape(root, () => dismissFn("escape")));
		}

		this.isOpen = true;
		instances.add(this);
		this._emit("open");

		return this;
	}

	/**
	 * Remove from DOM and clean up everything. Idempotent.
	 */
	destroy() {
		if (!this.isOpen) return;
		this.isOpen = false;
		instances.delete(this);

		// Cleanup dismissal handlers
		for (const fn of this._cleanups) fn();
		this._cleanups.length = 0;

		// Cleanup pan hook
		if (this._hookId != null) {
			Hooks.off("canvasPan", this._hookId);
			this._hookId = null;
		}

		// Cleanup ticker
		if (this._tickerFn && canvas.app?.ticker) {
			canvas.app.ticker.remove(this._tickerFn);
			this._tickerFn = null;
		}

		const el = this.element;
		if (!el) return;

		if (this._animate) {
			el.classList.remove(`${CSS_PREFIX}--visible`);
			const onEnd = () => {
				el.removeEventListener("transitionend", onEnd);
				el.remove();
			};
			el.addEventListener("transitionend", onEnd);
			// Fallback if transitionend doesn't fire
			setTimeout(() => el.remove(), 200);
		} else {
			el.remove();
		}

		this.element = null;
		this._contentWrap = null;
		this._emit("close");
	}

	/**
	 * Replace inner content.
	 * @param {HTMLElement | string} content
	 */
	setContent(content) {
		if (!this._contentWrap) {
			this._initialContent = content;
			return;
		}
		this._contentWrap.innerHTML = "";
		if (typeof content === "string") {
			this._contentWrap.innerHTML = content;
		} else if (content instanceof HTMLElement) {
			this._contentWrap.appendChild(content);
		}
	}

	/**
	 * Change the anchor point.
	 * @param {{ x: number, y: number } | { placeable: PlaceableObject } | { document: object }} newAnchor
	 */
	setAnchor(newAnchor) {
		// Clean up old ticker if switching away from placeable
		const hadPlaceable = !!this._anchor.placeable;
		this._anchor = this._resolveAnchor(newAnchor);
		const hasPlaceable = !!this._anchor.placeable;

		if (hadPlaceable && !hasPlaceable && this._tickerFn && canvas.app?.ticker) {
			canvas.app.ticker.remove(this._tickerFn);
			this._tickerFn = null;
		} else if (!hadPlaceable && hasPlaceable && this.isOpen && canvas.app?.ticker && !this._tickerFn) {
			this._tickerFn = () => this.reposition();
			canvas.app.ticker.add(this._tickerFn);
		}

		this._lastScreenPos = { x: -99999, y: -99999 };
		this.reposition();
	}

	/**
	 * Force recalculate position. Auto-called on canvasPan and ticker.
	 */
	reposition() {
		if (!this.element) return;

		const anchor = this._getAnchorCanvasPoint();
		if (!anchor) return;

		const zoom = getZoom();
		const useScale = this._sizeUnit !== "screen";

		// Resolve offset in canvas pixels
		const offsetX = resolveUnit(this._offset.x, this._sizeUnit);
		const offsetY = resolveUnit(this._offset.y, this._sizeUnit);

		// Canvas point with offset applied
		const canvasPoint = {
			x: anchor.x + offsetX,
			y: anchor.y + offsetY,
		};

		// Convert to screen
		const screen = canvasToScreen(canvasPoint);

		// Early exit if position hasn't meaningfully changed (ticker optimization)
		if (
			Math.abs(screen.x - this._lastScreenPos.x) < POSITION_TOLERANCE &&
			Math.abs(screen.y - this._lastScreenPos.y) < POSITION_TOLERANCE
		) {
			return;
		}
		this._lastScreenPos = { x: screen.x, y: screen.y };

		// Apply anchor origin offset (after scale)
		const el = this.element;
		const scale = useScale ? zoom : 1;

		// Set scale first so we can measure with correct dimensions
		if (useScale) {
			el.style.transformOrigin = `${this._anchorX} ${this._anchorY}`;
			el.style.transform = `scale(${scale})`;
		} else {
			el.style.transform = "";
			el.style.transformOrigin = "";
		}

		// Compute origin offset based on rendered size
		let originX = 0;
		let originY = 0;
		const rect = el.getBoundingClientRect();
		// rect already includes scale, so use it directly
		if (this._anchorX === "center") originX = -rect.width / 2;
		else if (this._anchorX === "right") originX = -rect.width;
		if (this._anchorY === "center") originY = -rect.height / 2;
		else if (this._anchorY === "bottom") originY = -rect.height;

		let finalX = screen.x + originX;
		let finalY = screen.y + originY;

		// Viewport clamping
		if (this._clampToViewport) {
			const maxX = window.innerWidth - rect.width - VIEWPORT_MARGIN;
			const maxY = window.innerHeight - rect.height - VIEWPORT_MARGIN;
			finalX = Math.max(VIEWPORT_MARGIN, Math.min(finalX, maxX));
			finalY = Math.max(VIEWPORT_MARGIN, Math.min(finalY, maxY));
		}

		el.style.left = `${finalX}px`;
		el.style.top = `${finalY}px`;

		this._emit("reposition", { x: finalX, y: finalY });
	}

	// ── Event emitter ─────────────────────────────────────────────────────

	/**
	 * Register a lifecycle callback.
	 * @param {"open" | "close" | "dismiss" | "reposition"} event
	 * @param {Function} fn
	 * @returns {this}
	 */
	on(event, fn) {
		if (!this._listeners.has(event)) this._listeners.set(event, new Set());
		this._listeners.get(event).add(fn);
		return this;
	}

	/**
	 * Unregister a lifecycle callback.
	 * @param {"open" | "close" | "dismiss" | "reposition"} event
	 * @param {Function} fn
	 * @returns {this}
	 */
	off(event, fn) {
		this._listeners.get(event)?.delete(fn);
		return this;
	}

	// ── Static ────────────────────────────────────────────────────────────

	/**
	 * Destroy all mounted popup instances.
	 */
	static destroyAll() {
		for (const popup of [...instances]) {
			popup.destroy();
		}
	}

	// ── Internal ──────────────────────────────────────────────────────────

	/**
	 * Normalize anchor input to a consistent internal shape.
	 * @param {object} anchor
	 * @returns {{ x?: number, y?: number, placeable?: PlaceableObject }}
	 */
	_resolveAnchor(anchor) {
		if (!anchor) throw new Error("CanvasPopup: anchor is required");
		if (anchor.placeable) return { placeable: anchor.placeable };
		if (anchor.document) {
			const obj = anchor.document.object;
			if (obj) return { placeable: obj };
			throw new Error("CanvasPopup: anchor.document has no rendered object on the canvas");
		}
		if (anchor.x != null && anchor.y != null) return { x: anchor.x, y: anchor.y };
		throw new Error("CanvasPopup: anchor must be { x, y }, { placeable }, or { document }");
	}

	/**
	 * Resolve the width option to canvas pixels.
	 * @returns {number | null}
	 */
	_resolveWidth() {
		if (this._width == null) return null;
		if (this._width === "anchor") return this._getAnchorSize().width;
		return resolveUnit(this._width, this._sizeUnit);
	}

	/**
	 * Get the anchor placeable's canvas-pixel size.
	 * Works across tiles, drawings, tokens, etc.
	 * @returns {{ width: number, height: number }}
	 */
	_getAnchorSize() {
		const p = this._anchor.placeable;
		if (!p) return { width: 0, height: 0 };
		const doc = p.document;
		// Drawings use shape.width/height
		if (doc?.shape?.width != null) return { width: doc.shape.width, height: doc.shape.height };
		// Tiles use document.width/height directly (canvas pixels)
		if (doc?.width != null) return { width: doc.width, height: doc.height };
		// Tokens: width/height are in grid units
		if (doc?.width != null) return { width: doc.width * (canvas.grid?.size ?? 100), height: doc.height * (canvas.grid?.size ?? 100) };
		return { width: 0, height: 0 };
	}

	/**
	 * Get the current canvas-space anchor point.
	 * @returns {{ x: number, y: number } | null}
	 */
	_getAnchorCanvasPoint() {
		if (this._anchor.placeable) {
			const p = this._anchor.placeable;
			// Use document position (more reliable during animations)
			const doc = p.document;
			if (doc) return { x: doc.x ?? p.x ?? 0, y: doc.y ?? p.y ?? 0 };
			return { x: p.x ?? 0, y: p.y ?? 0 };
		}
		return { x: this._anchor.x, y: this._anchor.y };
	}

	/**
	 * Emit a lifecycle event.
	 * @param {string} event
	 * @param  {...any} args
	 */
	_emit(event, ...args) {
		const fns = this._listeners.get(event);
		if (!fns) return;
		for (const fn of fns) {
			try {
				fn(this, ...args);
			} catch (err) {
				console.error(`[CanvasPopup] Error in '${event}' listener:`, err);
			}
		}
	}
}
