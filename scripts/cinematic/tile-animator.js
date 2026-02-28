/**
 * Configurable tile animation system for cinematic await providers.
 *
 * Provides a behaviour registry (Map-based, matching existing tween/await patterns)
 * and a TileAnimator class that manages per-tile animation lifecycles with
 * state transitions (idle/hover/dim).
 *
 * Animation config lives in the cinematic await entry:
 *   { await: { event: "tile-click", target: "tag:door-icon", animation: { idle: ["float", "glow"], hover: ["scale"] } } }
 *
 * Each behaviour is a factory: (placeable, opts) => { update(dt), detach() }
 */

import { resolveEasing } from "../tween/core/easing.js";

// ── Behaviour Registry ───────────────────────────────────────────────────

/** @type {Map<string, (placeable: PlaceableObject, opts?: object) => { update(dt: number): void, detach(): void }>} */
const behaviourRegistry = new Map();

/**
 * Register a named animation behaviour factory.
 * @param {string} name
 * @param {(placeable: PlaceableObject, opts?: object) => { update(dt: number): void, detach(): void }} factory
 */
export function registerBehaviour(name, factory) {
	behaviourRegistry.set(name, factory);
}

/**
 * Get a registered behaviour factory by name.
 * @param {string} name
 * @returns {((placeable: PlaceableObject, opts?: object) => { update(dt: number): void, detach(): void }) | undefined}
 */
export function getBehaviour(name) {
	return behaviourRegistry.get(name);
}

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Convert HSL (h in [0,1], s in [0,1], l in [0,1]) to a 0xRRGGBB integer.
 */
function hslToInt(h, s, l) {
	let r, g, b;
	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return ((Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255));
}

// ── Built-in Behaviours ──────────────────────────────────────────────────

/**
 * float — sinusoidal Y bobble on the tile's mesh.
 * Params: speed (default 0.04), amplitude (default 3px)
 */
registerBehaviour("float", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const speed = opts.speed ?? 0.04;
	const amplitude = opts.amplitude ?? 3;
	const originalY = mesh.position.y;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			mesh.position.y = originalY + Math.sin(elapsed * speed) * amplitude;
		},
		detach() {
			mesh.position.y = originalY;
		},
	};
});

/**
 * pulse — alpha oscillation on the tile's mesh.
 * Params: minAlpha (0.6), maxAlpha (1.0), speed (0.05)
 */
registerBehaviour("pulse", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const minAlpha = opts.minAlpha ?? 0.6;
	const maxAlpha = opts.maxAlpha ?? 1.0;
	const speed = opts.speed ?? 0.05;
	const originalAlpha = mesh.alpha;
	let phase = Math.PI / 2; // start at peak so first frame = maxAlpha

	return {
		update(dt) {
			phase += dt * speed;
			const t = (Math.sin(phase) + 1) / 2;
			mesh.alpha = minAlpha + (maxAlpha - minAlpha) * t;
		},
		detach() {
			mesh.alpha = originalAlpha;
		},
	};
});

/**
 * scale — smooth eased scale transition toward a target factor.
 * Params: factor (1.12), durationFrames (15), easing ("easeOutCubic")
 */
registerBehaviour("scale", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const factor = opts.factor ?? 1.12;
	const durationFrames = opts.durationFrames ?? 15;
	const easingFn = resolveEasing(opts.easing ?? "easeOutCubic");

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const targetScaleX = originalScaleX * factor;
	const targetScaleY = originalScaleY * factor;
	let frame = 0;

	return {
		update(dt) {
			if (frame < durationFrames) {
				frame += dt;
				const progress = Math.min(frame / durationFrames, 1);
				const eased = easingFn(progress);
				mesh.scale.x = originalScaleX + (targetScaleX - originalScaleX) * eased;
				mesh.scale.y = originalScaleY + (targetScaleY - originalScaleY) * eased;
			}
		},
		detach() {
			mesh.scale.x = originalScaleX;
			mesh.scale.y = originalScaleY;
		},
	};
});

/**
 * glow — blurred sprite behind the tile with gentle alpha pulse.
 * Creates a PIXI.Sprite from the tile's mesh texture, applies blur filter,
 * tinted, inserted behind the mesh in the placeable's child list.
 * Params: color (0x44DDFF), alpha (0.5), blur (8), pulseSpeed (0.03)
 */
registerBehaviour("glow", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh?.texture?.baseTexture) return { update() {}, detach() {} };

	const doc = placeable.document;
	const color = opts.color ?? 0x44DDFF;
	const alpha = opts.alpha ?? 0.5;
	const blurStrength = opts.blur ?? 8;
	const pulseSpeed = opts.pulseSpeed ?? 0.03;

	// The mesh lives on canvas.primary (special render pipeline), not on the
	// placeable container. We add the glow to the placeable (canvas.tiles layer,
	// rendered above primary) as a highlight overlay. Position in placeable-local
	// coords: the placeable origin is the tile's (x, y), so (0,0) is tile top-left.
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);

	const glow = PIXI.Sprite.from(mesh.texture);
	glow.anchor.set(0.5, 0.5);
	glow.width = w;
	glow.height = h;
	glow.position.set(w / 2, h / 2);
	glow.angle = doc.rotation ?? 0;
	glow.alpha = alpha;
	glow.tint = color;

	// Apply blur filter
	const BlurFilter = PIXI.BlurFilter ?? PIXI.filters?.BlurFilter;
	const blurFilter = new BlurFilter(blurStrength);
	glow.filters = [blurFilter];

	placeable.addChildAt(glow, 0);

	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			const t = (Math.sin(elapsed * pulseSpeed) + 1) / 2;
			glow.visible = mesh.visible !== false;
			glow.alpha = alpha * (0.5 + 0.5 * t) * (mesh.alpha ?? 1);
		},
		detach() {
			if (glow.parent) glow.parent.removeChild(glow);
			glow.destroy({ children: true });
		},
	};
});

/**
 * wobble — rapid rotation oscillation.
 * Params: speed (0.15), angle (2.5°)
 */
registerBehaviour("wobble", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const speed = opts.speed ?? 0.15;
	const angle = opts.angle ?? 2.5;
	const originalAngle = mesh.angle;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			mesh.angle = originalAngle + Math.sin(elapsed * speed) * angle;
		},
		detach() {
			mesh.angle = originalAngle;
		},
	};
});

/**
 * colorCycle — continuous hue rotation on the mesh tint.
 * Params: speed (0.005), saturation (0.6), lightness (0.6)
 */
registerBehaviour("colorCycle", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const speed = opts.speed ?? 0.005;
	const saturation = opts.saturation ?? 0.6;
	const lightness = opts.lightness ?? 0.6;
	const originalTint = mesh.tint;
	let hue = 0;

	return {
		update(dt) {
			hue = (hue + dt * speed) % 1;
			mesh.tint = hslToInt(hue, saturation, lightness);
		},
		detach() {
			mesh.tint = originalTint;
		},
	};
});

/**
 * spin — continuous rotation at constant angular velocity.
 * Params: speed (0.5 deg/frame-tick)
 */
registerBehaviour("spin", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const speed = opts.speed ?? 0.5;
	const originalAngle = mesh.angle;

	return {
		update(dt) {
			mesh.angle += dt * speed;
		},
		detach() {
			mesh.angle = originalAngle;
		},
	};
});

/**
 * bounce — float with easeOutBounce easing.
 * Params: speed (0.02), amplitude (6px)
 */
registerBehaviour("bounce", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const speed = opts.speed ?? 0.02;
	const amplitude = opts.amplitude ?? 6;
	const easingFn = resolveEasing("easeOutBounce");
	const originalY = mesh.position.y;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			// Triangle wave 0→1→0 mapped through bounce easing
			const t = Math.abs(((elapsed * speed) % 2) - 1);
			mesh.position.y = originalY + easingFn(t) * amplitude;
		},
		detach() {
			mesh.position.y = originalY;
		},
	};
});

/**
 * borderTrace — glowing dot tracing the tile perimeter.
 * Params: speed (1.5 px/frame), length (60px), color (0x44DDFF), alpha (0.8), lineWidth (2)
 */
registerBehaviour("borderTrace", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const doc = placeable.document;
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);
	const perimeter = 2 * (w + h);

	const speed = opts.speed ?? 1.5;
	const length = opts.length ?? 60;
	const color = opts.color ?? 0x44DDFF;
	const alpha = opts.alpha ?? 0.8;
	const lineWidth = opts.lineWidth ?? 2;

	const gfx = new PIXI.Graphics();
	gfx.alpha = alpha;
	placeable.addChildAt(gfx, 0);

	let offset = 0;

	function perimeterPoint(d) {
		d = ((d % perimeter) + perimeter) % perimeter;
		if (d < w) return { x: d, y: 0 };
		d -= w;
		if (d < h) return { x: w, y: d };
		d -= h;
		if (d < w) return { x: w - d, y: h };
		d -= w;
		return { x: 0, y: h - d };
	}

	return {
		update(dt) {
			offset = (offset + dt * speed) % perimeter;
			gfx.visible = mesh.visible !== false;
			gfx.alpha = alpha * (mesh.alpha ?? 1);
			gfx.clear();
			gfx.lineStyle(lineWidth, color, 1);

			const segments = 16;
			const segLen = length / segments;
			const start = perimeterPoint(offset);
			gfx.moveTo(start.x, start.y);
			for (let i = 1; i <= segments; i++) {
				const pt = perimeterPoint(offset + i * segLen);
				gfx.lineTo(pt.x, pt.y);
			}
		},
		detach() {
			if (gfx.parent) gfx.parent.removeChild(gfx);
			gfx.destroy({ children: true });
		},
	};
});

/**
 * shimmer — diagonal shine sweep across the tile.
 * Params: speed (1.0), bandWidth (40px), alpha (0.15), pause (120 frame-ticks)
 */
registerBehaviour("shimmer", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const doc = placeable.document;
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);

	const speed = opts.speed ?? 1.0;
	const bandWidth = opts.bandWidth ?? 40;
	const alpha = opts.alpha ?? 0.15;
	const pause = opts.pause ?? 120;

	const diagonal = w + h + bandWidth;
	const cycleLength = diagonal + pause * speed;

	const gfx = new PIXI.Graphics();
	gfx.alpha = alpha;

	const mask = new PIXI.Graphics();
	mask.beginFill(0xffffff);
	mask.drawRect(0, 0, w, h);
	mask.endFill();
	placeable.addChild(mask);
	gfx.mask = mask;
	placeable.addChild(gfx);

	let offset = 0;

	return {
		update(dt) {
			offset = (offset + dt * speed) % cycleLength;
			gfx.visible = mesh.visible !== false;
			gfx.alpha = alpha * (mesh.alpha ?? 1);
			gfx.clear();

			if (offset < diagonal) {
				const pos = offset - bandWidth;
				gfx.beginFill(0xffffff, 1);
				gfx.moveTo(pos, 0);
				gfx.lineTo(pos + bandWidth, 0);
				gfx.lineTo(pos + bandWidth - h, h);
				gfx.lineTo(pos - h, h);
				gfx.closePath();
				gfx.endFill();
			}
		},
		detach() {
			gfx.mask = null;
			if (mask.parent) mask.parent.removeChild(mask);
			mask.destroy({ children: true });
			if (gfx.parent) gfx.parent.removeChild(gfx);
			gfx.destroy({ children: true });
		},
	};
});

/**
 * none — no-op behaviour (explicit opt-out for a state).
 */
registerBehaviour("none", () => {
	return { update() {}, detach() {} };
});

// ── Config Normalization ─────────────────────────────────────────────────

const DEFAULT_CONFIG = {
	idle: ["float", "glow"],
	hover: ["scale"],
	dim: ["none"],
};

/**
 * Normalize animation config from various shorthand forms into a consistent
 * { idle: string[], hover: string[], dim: string[] } shape.
 *
 * Accepts:
 *   - undefined/null → defaults
 *   - { idle: "float", hover: ["scale", "glow"] } → arrays per state
 *   - { idle: ["float"] } → missing states get defaults
 *   - { idle: [{ name: "pulse", minAlpha: 0.3 }] } → parameterized behaviours
 *
 * @param {object|undefined} raw
 * @returns {{ idle: Array<string|object>, hover: Array<string|object>, dim: Array<string|object> }}
 */
export function normalizeConfig(raw) {
	if (!raw) return { ...DEFAULT_CONFIG };

	const normalize = (val, fallback) => {
		if (val === undefined) return fallback;
		if (typeof val === "string") return [val];
		if (typeof val === "object" && !Array.isArray(val) && val.name) return [val];
		if (Array.isArray(val)) return val;
		return fallback;
	};

	return {
		idle: normalize(raw.idle, DEFAULT_CONFIG.idle),
		hover: normalize(raw.hover, DEFAULT_CONFIG.hover),
		dim: normalize(raw.dim, DEFAULT_CONFIG.dim),
	};
}

// ── TileAnimator ─────────────────────────────────────────────────────────

/**
 * Manages one tile's animation lifecycle across states.
 *
 * Holds current state (idle/hover/dim), active behaviour instances,
 * and a single PIXI ticker callback.
 */
export class TileAnimator {
	#placeable;
	#config;
	#currentState = null;
	#activeBehaviours = [];
	#tickerFn = null;

	/**
	 * @param {PlaceableObject} placeable
	 * @param {object|undefined} animationConfig  Raw animation config from the await entry
	 */
	constructor(placeable, animationConfig) {
		this.#placeable = placeable;
		this.#config = normalizeConfig(animationConfig);
	}

	/** Current animation state name. */
	get state() {
		return this.#currentState;
	}

	/**
	 * Start animating in the given state.
	 * @param {string} [state="idle"]
	 */
	start(state = "idle") {
		this.#attachBehaviours(state);
		this.#tickerFn = (dt) => {
			for (const b of this.#activeBehaviours) b.update(dt);
		};
		canvas.app.ticker.add(this.#tickerFn);
	}

	/**
	 * Transition to a new state. Detaches current behaviours, attaches new ones.
	 * No-op if already in the requested state.
	 * @param {string} state
	 */
	setState(state) {
		if (state === this.#currentState) return;
		this.#detachBehaviours();
		this.#attachBehaviours(state);
	}

	/**
	 * Full cleanup — detach all behaviours and remove ticker.
	 */
	detach() {
		this.#detachBehaviours();
		if (this.#tickerFn) {
			canvas.app?.ticker?.remove(this.#tickerFn);
			this.#tickerFn = null;
		}
	}

	// ── Private ──────────────────────────────────────────────────────────

	#attachBehaviours(state) {
		this.#currentState = state;
		const entries = this.#config[state] ?? this.#config.idle ?? ["none"];
		for (const entry of entries) {
			const name = typeof entry === "string" ? entry : entry.name;
			const opts = typeof entry === "string" ? undefined : entry;
			const factory = getBehaviour(name);
			if (!factory) {
				console.warn(`TileAnimator: unknown behaviour "${name}"`);
				continue;
			}
			this.#activeBehaviours.push(factory(this.#placeable, opts));
		}
	}

	#detachBehaviours() {
		for (const b of this.#activeBehaviours) b.detach();
		this.#activeBehaviours = [];
	}
}
