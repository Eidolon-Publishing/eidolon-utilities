/**
 * Color interpolation strategies for tween animations.
 *
 * Each interpolator takes two Foundry Color objects and a progress value (0–1),
 * returning a CSS hex string for the interpolated color.
 *
 * OKLab/OKLCH conversion matrices from Björn Ottosson's OKLab color space.
 * @see https://bottosson.github.io/posts/oklab/
 */

// ─── sRGB ↔ Linear RGB ────────────────────────────────────────────

/** sRGB component (0–1) → linear */
function srgbToLinear(c) {
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Linear → sRGB component (0–1) */
function linearToSrgb(c) {
	return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

// ─── Linear RGB ↔ OKLab ───────────────────────────────────────────

/** Convert linear RGB to OKLab [L, a, b]. */
function linearRgbToOklab(r, g, b) {
	const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
	const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
	const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

	const l = Math.cbrt(l_);
	const m = Math.cbrt(m_);
	const s = Math.cbrt(s_);

	return [
		0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
	];
}

/** Convert OKLab [L, a, b] back to linear RGB. */
function oklabToLinearRgb(L, a, b) {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;

	return [
		+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
	];
}

// ─── OKLab ↔ OKLCH ────────────────────────────────────────────────

function oklabToOklch(L, a, b) {
	const C = Math.sqrt(a * a + b * b);
	const h = Math.atan2(b, a); // radians
	return [L, C, h];
}

function oklchToOklab(L, C, h) {
	return [L, C * Math.cos(h), C * Math.sin(h)];
}

// ─── Foundry Color → components ────────────────────────────────────

/** Extract [r, g, b] as 0–1 floats from a Foundry Color. */
function colorToRgb(color) {
	return [color.r, color.g, color.b];
}

/** Build CSS hex from 0–1 float RGB (clamped). */
function rgbToHex(r, g, b) {
	const clamp = (v) => Math.max(0, Math.min(1, v));
	const toHex = (v) => Math.round(clamp(v) * 255).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─── Interpolators ─────────────────────────────────────────────────

/**
 * HSL interpolation with shortest-path hue.
 * Uses Foundry's built-in HSL conversion.
 */
function interpolateHsl(fromColor, toColor, t) {
	if (t <= 0) return fromColor.toHTML();
	if (t >= 1) return toColor.toHTML();

	const Color = foundry.utils.Color;
	const [h0, s0, l0] = fromColor.hsl;
	const [h1, s1, l1] = toColor.hsl;

	// Shortest-path hue on the unit circle
	const dh = ((h1 - h0 + 0.5) % 1) - 0.5;

	const h = (h0 + dh * t + 1) % 1;
	const s = s0 + (s1 - s0) * t;
	const l = l0 + (l1 - l0) * t;

	return Color.fromHSL([h, s, l]).toHTML();
}

/**
 * Linear RGB interpolation.
 * Interpolates in linear light (gamma-decoded), then re-encodes to sRGB.
 * Avoids the mid-transition darkening of naive sRGB lerp.
 */
function interpolateRgb(fromColor, toColor, t) {
	if (t <= 0) return fromColor.toHTML();
	if (t >= 1) return toColor.toHTML();

	const [r0, g0, b0] = colorToRgb(fromColor).map(srgbToLinear);
	const [r1, g1, b1] = colorToRgb(toColor).map(srgbToLinear);

	const r = linearToSrgb(r0 + (r1 - r0) * t);
	const g = linearToSrgb(g0 + (g1 - g0) * t);
	const b = linearToSrgb(b0 + (b1 - b0) * t);

	return rgbToHex(r, g, b);
}

/**
 * OKLCH interpolation with shortest-path hue.
 * Perceptually uniform — equal distances in OKLCH correspond to
 * equal perceived color difference, unlike HSL or RGB.
 * Interpolates lightness + chroma linearly, hue via shortest arc.
 *
 * Special handling for achromatic colors (C ≈ 0): hue is undefined, so we
 * interpolate in OKLab (Cartesian) instead of OKLCH (polar) to avoid hue jumps.
 */
function interpolateOklch(fromColor, toColor, t) {
	if (t <= 0) return fromColor.toHTML();
	if (t >= 1) return toColor.toHTML();

	const [r0, g0, b0] = colorToRgb(fromColor).map(srgbToLinear);
	const [r1, g1, b1] = colorToRgb(toColor).map(srgbToLinear);

	const [fL, fa, fb] = linearRgbToOklab(r0, g0, b0);
	const [tL, ta, tb] = linearRgbToOklab(r1, g1, b1);

	const ACHROMATIC = 0.02;
	const fC = Math.sqrt(fa * fa + fb * fb);
	const tC = Math.sqrt(ta * ta + tb * tb);

	let L, a, b;

	if (fC < ACHROMATIC || tC < ACHROMATIC) {
		// One or both colors are achromatic — interpolate in OKLab (Cartesian)
		L = fL + (tL - fL) * t;
		a = fa + (ta - fa) * t;
		b = fb + (tb - fb) * t;
	} else {
		// Both chromatic — interpolate in OKLCH (polar) with shortest-path hue
		const fH = Math.atan2(fb, fa);
		const tH = Math.atan2(tb, ta);

		let dh = tH - fH;
		if (dh > Math.PI) dh -= 2 * Math.PI;
		if (dh < -Math.PI) dh += 2 * Math.PI;

		L = fL + (tL - fL) * t;
		const C = fC + (tC - fC) * t;
		const h = fH + dh * t;

		a = C * Math.cos(h);
		b = C * Math.sin(h);
	}

	const [lR, lG, lB] = oklabToLinearRgb(L, a, b);

	return rgbToHex(linearToSrgb(lR), linearToSrgb(lG), linearToSrgb(lB));
}

// ─── Public API ────────────────────────────────────────────────────

const INTERPOLATORS = {
	hsl: interpolateHsl,
	rgb: interpolateRgb,
	oklch: interpolateOklch,
};

/**
 * Get an interpolation function by mode name.
 * @param {string} [mode="hsl"] One of "hsl", "rgb", "oklch"
 * @returns {(fromColor: Color, toColor: Color, t: number) => string}
 */
export function getInterpolator(mode = "hsl") {
	return INTERPOLATORS[mode] ?? INTERPOLATORS.hsl;
}

/** List available interpolation mode names. */
export function listInterpolationModes() {
	return Object.keys(INTERPOLATORS);
}
