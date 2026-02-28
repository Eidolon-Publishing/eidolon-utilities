/**
 * Dismissal strategies for canvas popups.
 * Each function attaches a listener and returns a cleanup function.
 */

/**
 * Dismiss on left-click outside the popup element.
 * Deferred by one rAF so the opening click doesn't immediately dismiss.
 *
 * @param {HTMLElement} popupElement
 * @param {() => void} onDismiss
 * @returns {() => void} cleanup
 */
export function attachClickOutside(popupElement, onDismiss) {
	let armed = false;

	function handler(e) {
		if (!armed) return;
		// Only left-click (button 0)
		if (e.button !== 0) return;
		if (popupElement.contains(e.target)) return;
		onDismiss();
	}

	// Arm after one frame so the opening click doesn't trigger dismissal
	requestAnimationFrame(() => {
		armed = true;
	});

	document.addEventListener("pointerdown", handler, true);

	return () => {
		document.removeEventListener("pointerdown", handler, true);
	};
}

/**
 * Dismiss on right-click outside the popup element.
 *
 * @param {HTMLElement} popupElement
 * @param {() => void} onDismiss
 * @returns {() => void} cleanup
 */
export function attachRightClickOutside(popupElement, onDismiss) {
	let armed = false;

	function handler(e) {
		if (!armed) return;
		if (e.button !== 2) return;
		if (popupElement.contains(e.target)) return;
		onDismiss();
	}

	requestAnimationFrame(() => {
		armed = true;
	});

	document.addEventListener("pointerdown", handler, true);

	return () => {
		document.removeEventListener("pointerdown", handler, true);
	};
}

/**
 * Dismiss on Escape key.
 *
 * @param {HTMLElement} _popupElement  Unused, kept for consistent signature
 * @param {() => void} onDismiss
 * @returns {() => void} cleanup
 */
export function attachEscape(_popupElement, onDismiss) {
	function handler(e) {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			onDismiss();
		}
	}

	document.addEventListener("keydown", handler, true);

	return () => {
		document.removeEventListener("keydown", handler, true);
	};
}
