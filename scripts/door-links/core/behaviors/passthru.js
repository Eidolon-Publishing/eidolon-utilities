/**
 * Pass-thru behavior — wall allows movement but retains other restrictions.
 *
 * Only the `move` property is set to 0 (none) when the door opens.
 * Light, sight, and sound restrictions remain at their default values.
 * On close, all properties are restored to defaults.
 */
export const passthru = {
	label: "Pass-thru",
	icon: "fa-solid fa-person-walking-dashed-line-arrow-right",
	description: "Wall allows movement when door opens, keeps other restrictions.",
	highlightColor: 0xD9A441,

	apply(_wallDoc, defaultState) {
		return { light: defaultState.light, move: 0, sight: defaultState.sight, sound: defaultState.sound };
	},

	revert(_wallDoc, defaultState) {
		return { ...defaultState };
	},
};
