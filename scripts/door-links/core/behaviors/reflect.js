/**
 * Reflect behavior — wall fully disappears when door opens.
 *
 * All restriction properties (light, move, sight, sound) are set to 0 (none)
 * when the door opens, and restored to the captured defaults when it closes.
 */
export const reflect = {
	label: "Reflect",
	icon: "fa-solid fa-arrows-left-right",
	description: "Wall fully disappears when door opens.",
	highlightColor: 0xFF6B2B,

	apply() {
		return { light: 0, move: 0, sight: 0, sound: 0 };
	},

	revert(_wallDoc, defaultState) {
		return { ...defaultState };
	},
};
