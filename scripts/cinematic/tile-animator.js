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
import { getInterpolator } from "../tween/core/color-interpolation.js";

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

/**
 * List all registered behaviour names.
 * @returns {string[]}
 */
export function listBehaviourNames() {
	return [...behaviourRegistry.keys()];
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
	// Match mesh scale directly — the texture is smaller than doc dimensions
	// and mesh.scale bridges the gap. Using width/height would set an initial
	// scale that the update() ratio logic then overrides to 1.0.
	glow.scale.set(mesh.scale.x, mesh.scale.y);
	glow.position.set(w / 2, h / 2);
	glow.angle = doc.rotation ?? 0;
	glow.alpha = alpha;
	glow.tint = color;

	// Apply blur filter
	const BlurFilter = PIXI.BlurFilter ?? PIXI.filters?.BlurFilter;
	const blurFilter = new BlurFilter(blurStrength);
	glow.filters = [blurFilter];

	placeable.addChildAt(glow, 0);

	const originalAngle = mesh.angle;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			const t = (Math.sin(elapsed * pulseSpeed) + 1) / 2;
			glow.visible = mesh.visible !== false;
			glow.alpha = alpha * (0.5 + 0.5 * t) * (mesh.alpha ?? 1);
			glow.scale.set(mesh.scale.x, mesh.scale.y);
			glow.angle = (doc.rotation ?? 0) + (mesh.angle - originalAngle);
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
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			mesh.angle = originalAngle + elapsed * speed;
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
	gfx.pivot.set(w / 2, h / 2);
	gfx.position.set(w / 2, h / 2);
	placeable.addChildAt(gfx, 0);

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const originalAngle = mesh.angle;
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
			gfx.scale.set(mesh.scale.x / originalScaleX, mesh.scale.y / originalScaleY);
			gfx.angle = mesh.angle - originalAngle;
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

	const wrapper = new PIXI.Container();
	wrapper.pivot.set(w / 2, h / 2);
	wrapper.position.set(w / 2, h / 2);

	const gfx = new PIXI.Graphics();
	gfx.alpha = alpha;

	const mask = new PIXI.Graphics();
	mask.beginFill(0xffffff);
	mask.drawRect(0, 0, w, h);
	mask.endFill();
	wrapper.addChild(mask);
	gfx.mask = mask;
	wrapper.addChild(gfx);
	placeable.addChild(wrapper);

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const originalAngle = mesh.angle;
	let offset = 0;

	return {
		update(dt) {
			offset = (offset + dt * speed) % cycleLength;
			wrapper.visible = mesh.visible !== false;
			wrapper.scale.set(mesh.scale.x / originalScaleX, mesh.scale.y / originalScaleY);
			wrapper.angle = mesh.angle - originalAngle;
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
			if (wrapper.parent) wrapper.parent.removeChild(wrapper);
			wrapper.destroy({ children: true });
		},
	};
});

// ── Mesh-based Behaviours (game-UI) ─────────────────────────────────────

/**
 * breathe — slow, subtle scale oscillation so tiles feel "alive" at rest.
 * Gentler than `scale` (which targets a factor and stops).
 * Params: factor (1.03), speed (0.02)
 */
registerBehaviour("breathe", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const factor = opts.factor ?? 1.03;
	const speed = opts.speed ?? 0.02;
	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			const t = Math.sin(elapsed * speed);
			mesh.scale.x = originalScaleX * (1 + (factor - 1) * t);
			mesh.scale.y = originalScaleY * (1 + (factor - 1) * t);
		},
		detach() {
			mesh.scale.x = originalScaleX;
			mesh.scale.y = originalScaleY;
		},
	};
});

/**
 * tiltFollow — slight rotation toward cursor on hover for a 3D parallax feel.
 * Reads canvas.mousePosition each frame.
 * Params: maxAngle (3°), smoothing (0.15)
 */
registerBehaviour("tiltFollow", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const maxAngle = opts.maxAngle ?? 3;
	const smoothing = opts.smoothing ?? 0.15;
	const doc = placeable.document;
	const originalAngle = mesh.angle;
	let currentAngle = 0;

	return {
		update() {
			const mouse = canvas.mousePosition;
			if (!mouse) return;
			const w = Math.abs(doc.width);
			const centerX = doc.x + w / 2;
			const dx = mouse.x - centerX;
			const targetAngle = Math.max(-maxAngle, Math.min(maxAngle, (dx / (w / 2)) * maxAngle));
			currentAngle += (targetAngle - currentAngle) * smoothing;
			mesh.angle = originalAngle + currentAngle;
		},
		detach() {
			mesh.angle = originalAngle;
		},
	};
});

/**
 * slideReveal — tiles ease into position from an offset (cascading entrance).
 * Params: offsetX (0), offsetY (20), durationFrames (20), easing ("easeOutCubic"), delay (0)
 * Use `delay` for stagger: [{ name: "slideReveal", delay: 0 }, { name: "slideReveal", delay: 5 }]
 */
registerBehaviour("slideReveal", (placeable, opts = {}, canonical) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	// During state transitions, skip entrance — tile is already visible
	if (canonical) return { update() {}, detach() {} };

	const offsetX = opts.offsetX ?? 0;
	const offsetY = opts.offsetY ?? 20;
	const durationFrames = opts.durationFrames ?? 20;
	const easingFn = resolveEasing(opts.easing ?? "easeOutCubic");
	const delay = opts.delay ?? 0;

	const originalX = mesh.position.x;
	const originalY = mesh.position.y;
	const originalAlpha = mesh.alpha;

	// Immediately offset
	mesh.position.x = originalX + offsetX;
	mesh.position.y = originalY + offsetY;
	mesh.alpha = 0;

	let frame = -delay; // negative = waiting for delay

	return {
		update(dt) {
			frame += dt;
			if (frame < 0) return; // still in delay
			if (frame >= durationFrames) {
				mesh.position.x = originalX;
				mesh.position.y = originalY;
				mesh.alpha = originalAlpha;
				return;
			}
			const progress = Math.min(frame / durationFrames, 1);
			const eased = easingFn(progress);
			mesh.position.x = originalX + offsetX * (1 - eased);
			mesh.position.y = originalY + offsetY * (1 - eased);
			mesh.alpha = originalAlpha * eased;
		},
		detach() {
			mesh.position.x = originalX;
			mesh.position.y = originalY;
			mesh.alpha = originalAlpha;
		},
	};
});

// ── Overlay Behaviours (game-UI) ────────────────────────────────────────

/**
 * embers — tiny particles drifting up from the tile (gothic/firelit feel).
 * Uses a PIXI.Graphics child redrawn each frame (same pattern as borderTrace).
 * Params: count (12), speed (0.5), color (0xFF6600), alpha (0.6), size (2)
 */
registerBehaviour("embers", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const doc = placeable.document;
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);
	const count = opts.count ?? 12;
	const speed = opts.speed ?? 0.5;
	const color = opts.color ?? 0xFF6600;
	const alpha = opts.alpha ?? 0.6;
	const size = opts.size ?? 2;

	const wrapper = new PIXI.Container();
	wrapper.pivot.set(w / 2, h / 2);
	wrapper.position.set(w / 2, h / 2);
	const gfx = new PIXI.Graphics();
	wrapper.addChild(gfx);
	placeable.addChild(wrapper);

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const originalAngle = mesh.angle;
	const particles = [];

	function spawnParticle() {
		const edge = Math.random();
		let x, y;
		if (edge < 0.7) {
			x = Math.random() * w; y = h;
		} else if (edge < 0.85) {
			x = 0; y = h * 0.5 + Math.random() * h * 0.5;
		} else {
			x = w; y = h * 0.5 + Math.random() * h * 0.5;
		}
		return {
			x, y,
			vx: (Math.random() - 0.5) * 0.3,
			vy: -speed * (0.5 + Math.random() * 0.5),
			life: 0,
			maxLife: 40 + Math.random() * 60,
			size: size * (0.5 + Math.random() * 0.5),
		};
	}

	return {
		update(dt) {
			wrapper.visible = mesh.visible !== false;
			wrapper.scale.set(mesh.scale.x / originalScaleX, mesh.scale.y / originalScaleY);
			wrapper.angle = mesh.angle - originalAngle;

			// Spawn gradually (1 per tick) to avoid burst on attach
			if (particles.length < count) particles.push(spawnParticle());

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.life += dt;
				if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.vx += (Math.random() - 0.5) * 0.05 * dt;
			}

			gfx.clear();
			for (const p of particles) {
				const lifeRatio = 1 - p.life / p.maxLife;
				gfx.beginFill(color, alpha * lifeRatio * (mesh.alpha ?? 1));
				gfx.drawCircle(p.x, p.y, p.size);
				gfx.endFill();
			}
		},
		detach() {
			if (wrapper.parent) wrapper.parent.removeChild(wrapper);
			wrapper.destroy({ children: true });
		},
	};
});

/**
 * runeGlow — multiple glowing dots tracing the perimeter at different speeds.
 * Reuses the perimeterPoint() approach from borderTrace.
 * Params: dots (3), speed (1.2), color (0x44DDFF), color2 (0x8844FF), radius (3), alpha (0.7)
 */
registerBehaviour("runeGlow", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const doc = placeable.document;
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);
	const perimeter = 2 * (w + h);

	const dotCount = opts.dots ?? 3;
	const speed = opts.speed ?? 1.2;
	const color = opts.color ?? 0x44DDFF;
	const color2 = opts.color2 ?? 0x8844FF;
	const radius = opts.radius ?? 3;
	const alpha = opts.alpha ?? 0.7;

	const gfx = new PIXI.Graphics();
	gfx.pivot.set(w / 2, h / 2);
	gfx.position.set(w / 2, h / 2);
	placeable.addChildAt(gfx, 0);

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const originalAngle = mesh.angle;

	const dotConfigs = [];
	for (let i = 0; i < dotCount; i++) {
		dotConfigs.push({
			phase: (i / dotCount) * perimeter,
			speedMul: 0.7 + Math.random() * 0.6,
			color: i % 2 === 0 ? color : color2,
		});
	}

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

	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			gfx.visible = mesh.visible !== false;
			gfx.alpha = alpha * (mesh.alpha ?? 1);
			gfx.scale.set(mesh.scale.x / originalScaleX, mesh.scale.y / originalScaleY);
			gfx.angle = mesh.angle - originalAngle;
			gfx.clear();

			for (const dc of dotConfigs) {
				const pt = perimeterPoint(dc.phase + elapsed * speed * dc.speedMul);
				gfx.beginFill(dc.color, 1);
				gfx.drawCircle(pt.x, pt.y, radius);
				gfx.endFill();
			}
		},
		detach() {
			if (gfx.parent) gfx.parent.removeChild(gfx);
			gfx.destroy({ children: true });
		},
	};
});

/**
 * ripple — expanding concentric rings from center on attach.
 * Params: maxRadius (tile diagonal/2), rings (3), interval (30), speed (1.5),
 *         color (0x44DDFF), alpha (0.4), lineWidth (1.5)
 */
registerBehaviour("ripple", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const doc = placeable.document;
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);
	const maxRadius = opts.maxRadius ?? Math.sqrt(w * w + h * h) / 2;
	const maxRings = opts.rings ?? 3;
	const interval = opts.interval ?? 30;
	const speed = opts.speed ?? 1.5;
	const color = opts.color ?? 0x44DDFF;
	const alpha = opts.alpha ?? 0.4;
	const lineWidth = opts.lineWidth ?? 1.5;

	const wrapper = new PIXI.Container();
	wrapper.pivot.set(w / 2, h / 2);
	wrapper.position.set(w / 2, h / 2);
	const gfx = new PIXI.Graphics();
	wrapper.addChild(gfx);
	placeable.addChild(wrapper);

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const originalAngle = mesh.angle;
	const activeRings = [];
	let elapsed = 0;
	let nextSpawn = 0;

	return {
		update(dt) {
			elapsed += dt;
			wrapper.visible = mesh.visible !== false;
			wrapper.scale.set(mesh.scale.x / originalScaleX, mesh.scale.y / originalScaleY);
			wrapper.angle = mesh.angle - originalAngle;

			if (elapsed >= nextSpawn && activeRings.length < maxRings) {
				activeRings.push({ radius: 0, alpha: alpha });
				nextSpawn = elapsed + interval;
			}

			for (let i = activeRings.length - 1; i >= 0; i--) {
				const ring = activeRings[i];
				ring.radius += speed * dt;
				ring.alpha = alpha * (1 - ring.radius / maxRadius);
				if (ring.radius >= maxRadius) activeRings.splice(i, 1);
			}

			gfx.clear();
			const cx = w / 2;
			const cy = h / 2;
			for (const ring of activeRings) {
				gfx.lineStyle(lineWidth, color, ring.alpha * (mesh.alpha ?? 1));
				gfx.drawCircle(cx, cy, ring.radius);
			}
		},
		detach() {
			if (wrapper.parent) wrapper.parent.removeChild(wrapper);
			wrapper.destroy({ children: true });
		},
	};
});

/**
 * frostEdge — crystalline border growing inward from edges (Barovian cold theme).
 * Generates random crystal segments anchored to tile edges that grow toward targets,
 * then gently pulse alpha once fully grown.
 * Params: segments (20), maxLength (15), color (0xAADDFF), alpha (0.5), growSpeed (0.02)
 */
registerBehaviour("frostEdge", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const doc = placeable.document;
	const w = Math.abs(doc.width);
	const h = Math.abs(doc.height);
	const segmentCount = opts.segments ?? 20;
	const maxLength = opts.maxLength ?? 15;
	const color = opts.color ?? 0xAADDFF;
	const alpha = opts.alpha ?? 0.5;
	const growSpeed = opts.growSpeed ?? 0.02;

	const wrapper = new PIXI.Container();
	wrapper.pivot.set(w / 2, h / 2);
	wrapper.position.set(w / 2, h / 2);

	const gfx = new PIXI.Graphics();
	const mask = new PIXI.Graphics();
	mask.beginFill(0xffffff);
	mask.drawRect(0, 0, w, h);
	mask.endFill();
	wrapper.addChild(mask);
	gfx.mask = mask;
	wrapper.addChild(gfx);
	placeable.addChild(wrapper);

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	const originalAngle = mesh.angle;

	const segments = [];
	for (let i = 0; i < segmentCount; i++) {
		const edge = Math.floor(Math.random() * 4);
		let sx, sy, angle;
		switch (edge) {
			case 0: sx = Math.random() * w; sy = 0; angle = Math.PI / 2 + (Math.random() - 0.5) * 0.6; break;
			case 1: sx = w; sy = Math.random() * h; angle = Math.PI + (Math.random() - 0.5) * 0.6; break;
			case 2: sx = Math.random() * w; sy = h; angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6; break;
			default: sx = 0; sy = Math.random() * h; angle = (Math.random() - 0.5) * 0.6; break;
		}
		segments.push({ sx, sy, angle, targetLength: maxLength * (0.4 + Math.random() * 0.6), currentLength: 0, grown: false });
	}

	let allGrown = false;
	let pulsePhase = 0;

	return {
		update(dt) {
			wrapper.visible = mesh.visible !== false;
			wrapper.scale.set(mesh.scale.x / originalScaleX, mesh.scale.y / originalScaleY);
			wrapper.angle = mesh.angle - originalAngle;

			if (!allGrown) {
				allGrown = true;
				for (const seg of segments) {
					if (!seg.grown) {
						seg.currentLength += (seg.targetLength - seg.currentLength) * growSpeed * dt;
						if (seg.currentLength >= seg.targetLength * 0.99) {
							seg.currentLength = seg.targetLength;
							seg.grown = true;
						} else {
							allGrown = false;
						}
					}
				}
			} else {
				pulsePhase += dt * 0.03;
			}

			const pulseAlpha = allGrown ? alpha * (0.7 + 0.3 * Math.sin(pulsePhase)) : alpha;
			gfx.clear();
			gfx.lineStyle(1.5, color, pulseAlpha * (mesh.alpha ?? 1));
			for (const seg of segments) {
				if (seg.currentLength <= 0) continue;
				gfx.moveTo(seg.sx, seg.sy);
				gfx.lineTo(seg.sx + Math.cos(seg.angle) * seg.currentLength, seg.sy + Math.sin(seg.angle) * seg.currentLength);
			}
		},
		detach() {
			gfx.mask = null;
			if (wrapper.parent) wrapper.parent.removeChild(wrapper);
			wrapper.destroy({ children: true });
		},
	};
});

/**
 * shadowLift — drop shadow via DropShadowFilter on the mesh (button lifts off the page).
 * Uses a PIXI filter on canvas.primary so the shadow renders BELOW the tile content.
 * Params: offsetY (6), blur (6), alpha (0.35), color (0x000000), durationFrames (12), easing ("easeOutCubic")
 */
registerBehaviour("shadowLift", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const DropShadowFilter = PIXI.DropShadowFilter ?? PIXI.filters?.DropShadowFilter ?? globalThis.PIXI?.filters?.DropShadowFilter;
	if (!DropShadowFilter) {
		console.warn("shadowLift: DropShadowFilter not available in this PIXI build");
		return { update() {}, detach() {} };
	}

	const targetOffsetY = opts.offsetY ?? 6;
	const blurStrength = opts.blur ?? 6;
	const targetAlpha = opts.alpha ?? 0.35;
	const color = opts.color ?? 0x000000;
	const durationFrames = opts.durationFrames ?? 12;
	const easingFn = resolveEasing(opts.easing ?? "easeOutCubic");

	const filter = new DropShadowFilter();
	filter.blur = blurStrength;
	filter.alpha = 0;
	filter.color = color;
	filter.quality = 3;
	filter.distance = 0;
	filter.rotation = 90; // straight down

	// Append to existing filters (preserve any Foundry-applied filters)
	const existingFilters = mesh.filters ? [...mesh.filters] : [];
	mesh.filters = [...existingFilters, filter];

	let frame = 0;

	return {
		update(dt) {
			if (frame < durationFrames) {
				frame += dt;
				const progress = Math.min(frame / durationFrames, 1);
				const eased = easingFn(progress);
				filter.distance = targetOffsetY * eased;
				filter.alpha = targetAlpha * eased;
			}
		},
		detach() {
			// Remove just our filter, preserve others
			if (mesh.filters) {
				mesh.filters = mesh.filters.filter(f => f !== filter);
				if (mesh.filters.length === 0) mesh.filters = null;
			}
			filter.destroy();
		},
	};
});

/**
 * none — no-op behaviour (explicit opt-out for a state).
 */
registerBehaviour("none", () => {
	return { update() {}, detach() {} };
});

// ── Tween-as-Behaviour Wrappers ─────────────────────────────────────────

/**
 * tween-prop — ping-pong a mesh property between `from` and `to`.
 * Params: attribute ("alpha"|"rotation"), from, to, period (ms), easing
 */
registerBehaviour("tween-prop", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const attribute = opts.attribute ?? "alpha";
	const from = opts.from ?? 0.85;
	const to = opts.to ?? 1.0;
	const period = opts.period ?? 1500;
	const easingFn = resolveEasing(opts.easing ?? "easeInOutCosine");

	// Map attribute name to mesh property
	const propMap = { alpha: "alpha", rotation: "angle" };
	const meshProp = propMap[attribute] ?? attribute;

	const originalValue = mesh[meshProp];
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			// Triangle wave 0→1→0 over period (in frame ticks, ~16.67ms per tick)
			const periodTicks = period / 16.667;
			const t = Math.abs(((elapsed / periodTicks) % 2) - 1);
			const eased = easingFn(t);
			mesh[meshProp] = from + (to - from) * eased;
		},
		detach() {
			mesh[meshProp] = originalValue;
		},
	};
});

/**
 * tween-tint — ping-pong mesh.tint between two colors.
 * Params: fromColor, toColor, mode (oklch/hsl/rgb), period (ms), easing
 */
registerBehaviour("tween-tint", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const fromHex = opts.fromColor ?? "#ffffff";
	const toHex = opts.toColor ?? "#ffcc88";
	const mode = opts.mode ?? "oklch";
	const period = opts.period ?? 3000;
	const easingFn = resolveEasing(opts.easing ?? "easeInOutCosine");
	const interpolate = getInterpolator(mode);

	const Color = foundry.utils.Color;
	const fromColor = Color.from(fromHex);
	const toColor = Color.from(toHex);
	const originalTint = mesh.tint;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			const periodTicks = period / 16.667;
			const t = Math.abs(((elapsed / periodTicks) % 2) - 1);
			const eased = easingFn(t);
			const hex = interpolate(fromColor, toColor, eased);
			mesh.tint = Color.from(hex).valueOf();
		},
		detach() {
			mesh.tint = originalTint;
		},
	};
});

/**
 * tween-scale — ping-pong mesh.scale.x/y between two factors.
 * Params: fromScale, toScale, period (ms), easing
 */
registerBehaviour("tween-scale", (placeable, opts = {}) => {
	const mesh = placeable.mesh;
	if (!mesh) return { update() {}, detach() {} };

	const fromScale = opts.fromScale ?? 0.95;
	const toScale = opts.toScale ?? 1.05;
	const period = opts.period ?? 2000;
	const easingFn = resolveEasing(opts.easing ?? "easeInOutCosine");

	const originalScaleX = mesh.scale.x;
	const originalScaleY = mesh.scale.y;
	let elapsed = 0;

	return {
		update(dt) {
			elapsed += dt;
			const periodTicks = period / 16.667;
			const t = Math.abs(((elapsed / periodTicks) % 2) - 1);
			const eased = easingFn(t);
			const s = fromScale + (toScale - fromScale) * eased;
			mesh.scale.set(originalScaleX * s, originalScaleY * s);
		},
		detach() {
			mesh.scale.set(originalScaleX, originalScaleY);
		},
	};
});

// ── Config Normalization ─────────────────────────────────────────────────

const DEFAULT_CONFIG = {
	always: [],
	idle: ["float", "glow"],
	hover: ["scale"],
	dim: ["none"],
};

/**
 * Normalize animation config from various shorthand forms into a consistent
 * { always: Array, idle: Array, hover: Array, dim: Array } shape.
 *
 * Accepts:
 *   - undefined/null → defaults
 *   - { idle: "float", hover: ["scale", "glow"] } → arrays per state
 *   - { idle: ["float"] } → missing states get defaults
 *   - { idle: [{ name: "pulse", minAlpha: 0.3 }] } → parameterized behaviours
 *
 * @param {object|undefined} raw
 * @returns {{ always: Array<string|object>, idle: Array<string|object>, hover: Array<string|object>, dim: Array<string|object> }}
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
		always: normalize(raw.always, DEFAULT_CONFIG.always),
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
	#alwaysBehaviours = [];
	#tickerFn = null;
	#canonicalState = null;
	#blendFrom = null;
	#blendElapsed = 0;

	/** Frames over which state transitions are blended (easeOutCubic). */
	static BLEND_FRAMES = 8;

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
		this.#captureCanonical();
		const tileId = this.#placeable.document?.id ?? "?";
		const c = this.#canonicalState;
		if (c) console.log(`%c[TileAnimator ${tileId}] start("${state}") canonical: pos=(${c.x.toFixed(2)}, ${c.y.toFixed(2)}) scale=(${c.scaleX.toFixed(4)}, ${c.scaleY.toFixed(4)}) alpha=${c.alpha.toFixed(4)} angle=${c.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold");

		// Start always behaviours (persist across state transitions)
		this.#attachAlwaysBehaviours();

		this.#attachBehaviours(state);
		this.#tickerFn = (dt) => {
			// During blend: restore canonical before updates so behaviours
			// compute on a clean slate (prevents blend feedback loop)
			if (this.#blendFrom) this.#restoreCanonical();
			// Always behaviours run first, then state behaviours layer on top
			for (const b of this.#alwaysBehaviours) b.update(dt);
			for (const b of this.#activeBehaviours) b.update(dt);
			this.#applyBlend(dt);
		};
		canvas.app.ticker.add(this.#tickerFn);
	}

	/**
	 * Transition to a new state. Behaviours shared between old and new state
	 * (matched by name) are kept alive — only the diff is detached/attached.
	 * Mesh is restored to canonical before constructing new behaviours so they
	 * always capture clean "original" values (no drift). A short blend smooths
	 * the visual transition so the canonical restore isn't visible.
	 * No-op if already in the requested state.
	 * @param {string} state
	 */
	setState(state) {
		if (state === this.#currentState) return;

		const tileId = this.#placeable.document?.id ?? "?";
		const mesh = this.#placeable.mesh;
		const oldEntries = this.#config[this.#currentState] ?? this.#config.idle ?? ["none"];
		const newEntries = this.#config[state] ?? this.#config.idle ?? ["none"];

		const oldNames = oldEntries.map(e => typeof e === "string" ? e : e?.name);
		const newNames = newEntries.map(e => typeof e === "string" ? e : e?.name);
		console.log(`%c[TileAnimator ${tileId}] setState: ${this.#currentState} → ${state}`, "color: #44DDFF; font-weight: bold");
		console.log(`  old behaviours: [${oldNames.join(", ")}]  →  new: [${newNames.join(", ")}]`);
		if (mesh) {
			console.log(`  mesh BEFORE detach: pos=(${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)}) scale=(${mesh.scale.x.toFixed(4)}, ${mesh.scale.y.toFixed(4)}) alpha=${mesh.alpha.toFixed(4)} angle=${mesh.angle.toFixed(2)}`);
		}
		if (this.#canonicalState) {
			const c = this.#canonicalState;
			console.log(`  canonical: pos=(${c.x.toFixed(2)}, ${c.y.toFixed(2)}) scale=(${c.scaleX.toFixed(4)}, ${c.scaleY.toFixed(4)}) alpha=${c.alpha.toFixed(4)} angle=${c.angle.toFixed(2)}`);
		}

		// Map old behaviour names → running instances
		const oldByName = new Map();
		for (let i = 0; i < this.#activeBehaviours.length; i++) {
			const entry = oldEntries[i];
			const name = typeof entry === "string" ? entry : entry?.name;
			if (name) oldByName.set(name, this.#activeBehaviours[i]);
		}

		// Build new active list, reusing instances where names match
		const newActive = [];
		const reused = new Set();

		// First pass: identify which behaviours to reuse
		for (const entry of newEntries) {
			const name = typeof entry === "string" ? entry : entry.name;
			if (oldByName.has(name) && !reused.has(name)) {
				reused.add(name);
			}
		}

		console.log(`  reused: [${[...reused].join(", ")}]  detaching: [${[...oldByName.keys()].filter(n => !reused.has(n)).join(", ")}]`);

		// Capture current mesh state for blend BEFORE any detach/restore
		this.#captureBlendStart();

		// Detach non-reused old behaviours (overlay cleanup, etc.)
		for (const [name, instance] of oldByName) {
			if (!reused.has(name)) {
				instance.detach();
				if (mesh) console.log(`  mesh AFTER detach("${name}"): scale=(${mesh.scale.x.toFixed(4)}, ${mesh.scale.y.toFixed(4)}) alpha=${mesh.alpha.toFixed(4)}`);
			}
		}

		// Restore mesh to canonical state before creating new behaviours
		this.#restoreCanonical();
		if (mesh) console.log(`  mesh AFTER canonical restore: scale=(${mesh.scale.x.toFixed(4)}, ${mesh.scale.y.toFixed(4)}) alpha=${mesh.alpha.toFixed(4)}`);

		// Second pass: build new active list
		for (const entry of newEntries) {
			const name = typeof entry === "string" ? entry : entry.name;
			if (oldByName.has(name) && reused.has(name)) {
				newActive.push(oldByName.get(name));
				reused.delete(name); // consume to prevent duplicate reuse
				console.log(`  → reuse "${name}"`);
			} else {
				const opts = typeof entry === "string" ? undefined : entry;
				const factory = getBehaviour(name);
				if (!factory) {
					console.warn(`TileAnimator: unknown behaviour "${name}"`);
					continue;
				}
				newActive.push(factory(this.#placeable, opts, this.#canonicalState));
				if (mesh) console.log(`  → create "${name}" — mesh after factory: scale=(${mesh.scale.x.toFixed(4)}, ${mesh.scale.y.toFixed(4)}) alpha=${mesh.alpha.toFixed(4)} pos=(${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)})`);
			}
		}

		if (this.#blendFrom) {
			const f = this.#blendFrom;
			console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
		}

		this.#currentState = state;
		this.#activeBehaviours = newActive;
	}

	/**
	 * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
	 */
	detach() {
		this.#detachBehaviours();
		this.#detachAlwaysBehaviours();
		this.#restoreCanonical();
		this.#blendFrom = null;
		if (this.#tickerFn) {
			canvas.app?.ticker?.remove(this.#tickerFn);
			this.#tickerFn = null;
		}
	}

	// ── Private ──────────────────────────────────────────────────────────

	#captureCanonical() {
		const mesh = this.#placeable.mesh;
		if (!mesh) return;
		this.#canonicalState = {
			x: mesh.position.x,
			y: mesh.position.y,
			scaleX: mesh.scale.x,
			scaleY: mesh.scale.y,
			angle: mesh.angle,
			alpha: mesh.alpha,
			tint: mesh.tint,
		};
	}

	#restoreCanonical() {
		const mesh = this.#placeable.mesh;
		if (!mesh || !this.#canonicalState) return;
		const c = this.#canonicalState;
		mesh.position.x = c.x;
		mesh.position.y = c.y;
		mesh.scale.x = c.scaleX;
		mesh.scale.y = c.scaleY;
		mesh.angle = c.angle;
		mesh.alpha = c.alpha;
		mesh.tint = c.tint;
	}

	/**
	 * Snapshot the current (animated) mesh values so the transition blend
	 * can lerp FROM here toward the new state's computed values.
	 */
	#captureBlendStart() {
		const mesh = this.#placeable.mesh;
		if (!mesh) return;
		this.#blendFrom = {
			x: mesh.position.x,
			y: mesh.position.y,
			scaleX: mesh.scale.x,
			scaleY: mesh.scale.y,
			angle: mesh.angle,
			alpha: mesh.alpha,
		};
		this.#blendElapsed = 0;
	}

	/**
	 * After behaviours compute the new state's mesh values, blend from the
	 * pre-transition snapshot toward those values over BLEND_FRAMES using
	 * easeOutCubic. This hides the canonical-restore snap entirely.
	 */
	#applyBlend(dt) {
		if (!this.#blendFrom) return;
		this.#blendElapsed += dt;
		const t = Math.min(this.#blendElapsed / TileAnimator.BLEND_FRAMES, 1);
		if (t >= 1) {
			const tileId = this.#placeable.document?.id ?? "?";
			console.log(`%c[TileAnimator ${tileId}] blend complete`, "color: #88FF88");
			this.#blendFrom = null;
			return;
		}
		const eased = 1 - (1 - t) ** 3; // easeOutCubic
		const mesh = this.#placeable.mesh;
		if (!mesh) return;
		const f = this.#blendFrom;

		// Log first 3 frames of blend
		if (this.#blendElapsed <= dt * 3) {
			const tileId = this.#placeable.document?.id ?? "?";
			const frame = Math.round(this.#blendElapsed / dt);
			console.log(`  [blend ${tileId} f${frame}] t=${t.toFixed(3)} eased=${eased.toFixed(3)} | behaviour→scale=(${mesh.scale.x.toFixed(4)},${mesh.scale.y.toFixed(4)}) alpha=${mesh.alpha.toFixed(4)} | blendFrom→scale=(${f.scaleX.toFixed(4)},${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
		}

		mesh.position.x = f.x + (mesh.position.x - f.x) * eased;
		mesh.position.y = f.y + (mesh.position.y - f.y) * eased;
		mesh.scale.x = f.scaleX + (mesh.scale.x - f.scaleX) * eased;
		mesh.scale.y = f.scaleY + (mesh.scale.y - f.scaleY) * eased;
		mesh.angle = f.angle + (mesh.angle - f.angle) * eased;
		mesh.alpha = f.alpha + (mesh.alpha - f.alpha) * eased;

		// Log result for first 3 frames
		if (this.#blendElapsed <= dt * 3) {
			console.log(`  [blend result] scale=(${mesh.scale.x.toFixed(4)},${mesh.scale.y.toFixed(4)}) alpha=${mesh.alpha.toFixed(4)} pos=(${mesh.position.x.toFixed(2)},${mesh.position.y.toFixed(2)})`);
		}
	}

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

	#attachAlwaysBehaviours() {
		const entries = this.#config.always ?? [];
		for (const entry of entries) {
			const name = typeof entry === "string" ? entry : entry.name;
			const opts = typeof entry === "string" ? undefined : entry;
			const factory = getBehaviour(name);
			if (!factory) {
				console.warn(`TileAnimator: unknown always behaviour "${name}"`);
				continue;
			}
			this.#alwaysBehaviours.push(factory(this.#placeable, opts));
		}
	}

	#detachAlwaysBehaviours() {
		for (const b of this.#alwaysBehaviours) b.detach();
		this.#alwaysBehaviours = [];
	}
}
