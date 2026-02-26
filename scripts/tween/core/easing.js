// ── Custom easing functions (Robert Penner curves) ──────────────────────

const customEasings = {
	easeInQuad: (t) => t * t,
	easeOutQuad: (t) => t * (2 - t),
	easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

	easeInCubic: (t) => t * t * t,
	easeOutCubic: (t) => { const t1 = t - 1; return t1 * t1 * t1 + 1; },
	easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

	easeOutBounce: (t) => {
		if (t < 1 / 2.75) return 7.5625 * t * t;
		if (t < 2 / 2.75) { const t2 = t - 1.5 / 2.75; return 7.5625 * t2 * t2 + 0.75; }
		if (t < 2.5 / 2.75) { const t2 = t - 2.25 / 2.75; return 7.5625 * t2 * t2 + 0.9375; }
		const t2 = t - 2.625 / 2.75;
		return 7.5625 * t2 * t2 + 0.984375;
	},
	easeInBounce: (t) => 1 - customEasings.easeOutBounce(1 - t),
	easeInOutBounce: (t) => (t < 0.5
		? (1 - customEasings.easeOutBounce(1 - 2 * t)) / 2
		: (1 + customEasings.easeOutBounce(2 * t - 1)) / 2),

	easeInElastic: (t) => {
		if (t === 0 || t === 1) return t;
		return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
	},
	easeOutElastic: (t) => {
		if (t === 0 || t === 1) return t;
		return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
	},
};

/**
 * Resolve an easing name to a function.
 * Checks custom easings first, then Foundry built-ins, then falls back to easeInOutCosine.
 * @param {string} [name]
 * @returns {(pt: number) => number}
 */
export function resolveEasing(name) {
	// Check custom easings first
	if (name && customEasings[name]) {
		return customEasings[name];
	}

	// Foundry built-ins
	const CA = foundry.canvas.animation.CanvasAnimation;
	const builtins = {
		linear: CA.easeLinear,
		easeInOutCosine: CA.easeInOutCosine,
	};

	return builtins[name] ?? CA.easeInOutCosine;
}

/**
 * List all available easing function names (custom + Foundry built-ins).
 * @returns {string[]}
 */
export function listEasingNames() {
	return ["linear", "easeInOutCosine", ...Object.keys(customEasings)];
}
