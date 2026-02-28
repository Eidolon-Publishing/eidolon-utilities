/**
 * OptionList — a content factory for CanvasPopup.
 *
 * Creates a sectioned list of selectable options with active-state tracking.
 * Returns { element, on, off, destroy }.
 */

const PREFIX = "canvas-popup-options";

/**
 * Create an option list element with sections and selectable items.
 *
 * @param {object} options
 * @param {{ label: string, key: string, items: { value: string, label: string, active?: boolean }[] }[]} options.sections
 * @returns {{ element: HTMLElement, on: (event: string, fn: Function) => void, off: (event: string, fn: Function) => void, destroy: () => void }}
 */
export function createOptionList({ sections = [] } = {}) {
	const listeners = new Map();
	const root = document.createElement("div");
	root.className = PREFIX;

	for (const section of sections) {
		const sectionEl = document.createElement("div");
		sectionEl.className = `${PREFIX}__section`;

		// Section header
		const header = document.createElement("div");
		header.className = `${PREFIX}__header`;
		header.textContent = section.label;
		sectionEl.appendChild(header);

		// Items
		for (const item of section.items) {
			const itemEl = document.createElement("div");
			itemEl.className = `${PREFIX}__item`;
			if (item.active) itemEl.classList.add(`${PREFIX}__item--active`);
			itemEl.dataset.key = section.key;
			itemEl.dataset.value = item.value;

			const dot = document.createElement("span");
			dot.className = `${PREFIX}__dot`;
			itemEl.appendChild(dot);

			const label = document.createElement("span");
			label.className = `${PREFIX}__label`;
			label.textContent = item.label;
			itemEl.appendChild(label);

			// Click → select
			itemEl.addEventListener("click", (e) => {
				emit("select", section.key, item.value, item, e);
			});

			// Hover events
			itemEl.addEventListener("mouseenter", () => {
				emit("hover", section.key, item.value, item);
			});
			itemEl.addEventListener("mouseleave", () => {
				emit("hoverEnd", section.key, item.value, item);
			});

			sectionEl.appendChild(itemEl);
		}

		root.appendChild(sectionEl);
	}

	function emit(event, ...args) {
		const fns = listeners.get(event);
		if (!fns) return;
		for (const fn of fns) {
			try {
				fn(...args);
			} catch (err) {
				console.error(`[OptionList] Error in '${event}' listener:`, err);
			}
		}
	}

	function on(event, fn) {
		if (!listeners.has(event)) listeners.set(event, new Set());
		listeners.get(event).add(fn);
	}

	function off(event, fn) {
		listeners.get(event)?.delete(fn);
	}

	function destroy() {
		listeners.clear();
		root.remove();
	}

	return { element: root, on, off, destroy };
}
