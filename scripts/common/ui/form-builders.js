/**
 * Shared DOM builder utilities for Foundry config forms.
 * Used by idle-animations and tile-interactions UI sections.
 */

/**
 * Build a <select> form group.
 * @param {string} label
 * @param {string} className  CSS class for the <select>
 * @param {Array<{ value: string, label: string, selected?: boolean }>} options
 * @returns {HTMLDivElement}
 */
export function buildSelectGroup(label, className, options) {
	const group = document.createElement("div");
	group.classList.add("form-group");
	const lbl = document.createElement("label");
	lbl.textContent = label;
	const select = document.createElement("select");
	select.classList.add(className);
	for (const opt of options) {
		const el = document.createElement("option");
		el.value = opt.value;
		el.textContent = opt.label;
		if (opt.selected) el.selected = true;
		select.appendChild(el);
	}
	group.append(lbl, select);
	return group;
}

/**
 * Build a <input type="number"> form group.
 * @param {string} label
 * @param {string} className  CSS class for the <input>
 * @param {number} value
 * @param {Record<string, string>} [attrs]  Extra attributes (step, min, max, etc.)
 * @returns {HTMLDivElement}
 */
export function buildNumberGroup(label, className, value, attrs = {}) {
	const group = document.createElement("div");
	group.classList.add("form-group");
	const lbl = document.createElement("label");
	lbl.textContent = label;
	const input = document.createElement("input");
	input.type = "number";
	input.classList.add(className);
	input.value = String(value);
	for (const [k, v] of Object.entries(attrs)) input.setAttribute(k, v);
	group.append(lbl, input);
	return group;
}

/**
 * Build a color picker form group (color input + text input, synced).
 * @param {string} label
 * @param {string} className  CSS class prefix for inputs
 * @param {string} value  Hex color string
 * @returns {HTMLDivElement}
 */
export function buildColorGroup(label, className, value) {
	const group = document.createElement("div");
	group.classList.add("form-group");
	const lbl = document.createElement("label");
	lbl.textContent = label;
	const wrapper = document.createElement("div");
	wrapper.classList.add("idle-anim__color-wrapper");
	const colorInput = document.createElement("input");
	colorInput.type = "color";
	colorInput.classList.add(className);
	colorInput.value = value;
	const textInput = document.createElement("input");
	textInput.type = "text";
	textInput.classList.add(`${className}-text`);
	textInput.value = value;
	textInput.maxLength = 7;
	// Sync color <-> text
	colorInput.addEventListener("input", () => { textInput.value = colorInput.value; });
	textInput.addEventListener("change", () => {
		if (/^#[0-9a-f]{6}$/i.test(textInput.value)) colorInput.value = textInput.value;
	});
	wrapper.append(colorInput, textInput);
	group.append(lbl, wrapper);
	return group;
}
