/**
 * Resolve an easing name to a CanvasAnimation static method.
 * Looked up at call time (not module load) since canvas isn't ready during ES module parsing.
 * @param {string} [name]
 * @returns {(pt: number) => number}
 */
export function resolveEasing(name) {
	const CA = foundry.canvas.animation.CanvasAnimation;
	const map = {
		linear: CA.easeLinear,
		easeInOutCosine: CA.easeInOutCosine,
	};
	return map[name] ?? CA.easeInOutCosine;
}
