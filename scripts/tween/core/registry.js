const tweenTypes = new Map();

/**
 * Register a tween type with its executor and optional validator.
 * @param {object} def
 * @param {string} def.type       Unique tween type name (e.g. "light-color")
 * @param {(params: object, opts: object) => Promise<boolean>} def.execute
 * @param {(params: object) => void} [def.validate]  Throws on invalid params
 */
export function registerTweenType({ type, execute, validate }) {
	if (tweenTypes.has(type)) {
		console.warn(`[tween-registry] Type "${type}" already registered, overwriting.`);
	}
	tweenTypes.set(type, { type, execute, validate: validate ?? (() => {}) });
}

/**
 * Lookup a registered tween type.
 * @param {string} type
 * @returns {{ type: string, execute: Function, validate: Function } | undefined}
 */
export function getTweenType(type) {
	return tweenTypes.get(type);
}

/**
 * List all registered tween type names.
 * @returns {string[]}
 */
export function listTweenTypes() {
	return [...tweenTypes.keys()];
}
