/**
 * Registry for door-link behaviors.
 *
 * Each behavior defines how linked walls respond when a door opens or closes.
 * Third-party modules can register additional behaviors via the public API.
 */

/** @type {Map<string, BehaviorDefinition>} */
const registry = new Map();

/**
 * @typedef {object} BehaviorDefinition
 * @property {string} label           UI display name
 * @property {string} icon            FontAwesome icon class
 * @property {string} description     Tooltip/description text
 * @property {number} highlightColor  Hex color for canvas highlights
 * @property {(wallDoc: object, defaultState: object) => object} apply   Compute wall props when door opens
 * @property {(wallDoc: object, defaultState: object) => object} revert  Compute wall props when door closes
 */

/**
 * Register a behavior definition.
 * @param {string} name  Unique behavior name (e.g. "reflect", "passthru")
 * @param {BehaviorDefinition} definition
 */
export function registerBehavior(name, definition) {
	if (registry.has(name)) {
		console.warn(`[eidolon-utilities] Door-link behavior "${name}" is already registered. Overwriting.`);
	}
	registry.set(name, definition);
}

/**
 * Get a behavior definition by name.
 * @param {string} name
 * @returns {BehaviorDefinition|undefined}
 */
export function getBehavior(name) {
	return registry.get(name);
}

/**
 * Get all registered behaviors as [name, definition] entries.
 * @returns {Map<string, BehaviorDefinition>}
 */
export function getAllBehaviors() {
	return registry;
}
