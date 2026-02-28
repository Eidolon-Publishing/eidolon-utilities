// ── Drag & drop reorder for slot-based UI cards ──────────────────────────────
//
// Shared by idle-animation slots and tile-interaction slots.
// Uses native HTML5 drag API (same pattern as cinematic swimlane drag).
//
// After any drop, a "slot-reorder" CustomEvent is dispatched on each affected
// container so that makeDropContainer's onDrop callback runs regardless of
// whether the drop landed on a card or on empty container space.

/** @type {{ card: HTMLElement, sourceContainer: HTMLElement, group: string, insertMode: 'before' | 'after' | null, insertTarget: HTMLElement | null } | null} */
let dragState = null;

/**
 * Remove insertion indicator classes from all cards.
 */
function clearInsertIndicators() {
	for (const el of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after")) {
		el.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
	}
}

/**
 * Add/remove the drag-active class on all slot containers.
 * @param {boolean} active
 */
function setDragActive(active) {
	for (const el of document.querySelectorAll(".idle-anim__slots")) {
		el.classList.toggle("idle-anim__slots--drag-active", active);
	}
}

/**
 * Notify a container that its children changed due to drag/drop.
 * @param {HTMLElement} container
 * @param {HTMLElement} movedCard
 */
function notifyReorder(container, movedCard) {
	container.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: movedCard } }));
}

/**
 * Make a slot card draggable within (and optionally across) containers
 * that share the same `dropGroup`.
 *
 * @param {HTMLElement} card       - The `.idle-anim__slot` card element
 * @param {object}      options
 * @param {string}      options.dropGroup   - Cards can only be dropped on targets with the same group
 * @param {string}      [options.handleSelector=".idle-anim__slot-header"] - Drag handle CSS selector
 */
export function makeDraggable(card, { dropGroup, handleSelector = ".idle-anim__slot-header" }) {
	card.setAttribute("draggable", "true");

	// Track whether the mousedown originated on the handle.
	// dragstart's e.target is always the draggable element (the card),
	// so we can't check the click origin there — use pointerdown instead.
	let startedOnHandle = false;
	card.addEventListener("pointerdown", (e) => {
		startedOnHandle = !!e.target.closest(handleSelector);
	});

	card.addEventListener("dragstart", (e) => {
		if (!startedOnHandle) {
			e.preventDefault();
			return;
		}
		dragState = { card, sourceContainer: card.parentElement, group: dropGroup, insertMode: null, insertTarget: null };
		card.classList.add("is-dragging");
		setDragActive(true);
		e.dataTransfer.effectAllowed = "move";
		// Needed for Firefox
		e.dataTransfer.setData("text/plain", "");
	});

	card.addEventListener("dragover", (e) => {
		if (!dragState || dragState.group !== dropGroup || dragState.card === card) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";

		// Determine insert-before vs insert-after based on cursor position
		const rect = card.getBoundingClientRect();
		const midY = rect.top + rect.height / 2;
		const mode = e.clientY < midY ? "before" : "after";

		// Only update DOM if the indicator changed
		if (dragState.insertTarget !== card || dragState.insertMode !== mode) {
			clearInsertIndicators();
			card.classList.add(mode === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after");
			dragState.insertTarget = card;
			dragState.insertMode = mode;
		}
	});

	card.addEventListener("dragleave", () => {
		card.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
		if (dragState?.insertTarget === card) {
			dragState.insertTarget = null;
			dragState.insertMode = null;
		}
	});

	card.addEventListener("drop", (e) => {
		e.preventDefault();
		e.stopPropagation(); // prevent container-level drop from also firing
		clearInsertIndicators();
		if (!dragState || dragState.group !== dropGroup || dragState.card === card) return;

		const src = dragState.card;
		const srcContainer = dragState.sourceContainer;
		const targetContainer = card.parentElement;

		// Use the insertion indicator to decide placement
		if (dragState.insertMode === "after") {
			targetContainer.insertBefore(src, card.nextSibling);
		} else {
			targetContainer.insertBefore(src, card);
		}

		// Notify affected containers
		notifyReorder(targetContainer, src);
		if (srcContainer !== targetContainer) {
			notifyReorder(srcContainer, src);
		}

		dragState = null;
	});

	card.addEventListener("dragend", () => {
		card.classList.remove("is-dragging");
		clearInsertIndicators();
		setDragActive(false);
		// Clean up any stale container highlights
		for (const el of document.querySelectorAll(".idle-anim__slots--drag-over")) {
			el.classList.remove("idle-anim__slots--drag-over");
		}
		dragState = null;
	});
}

/**
 * Make a container accept drops (for dropping into empty containers
 * or at the end of a list).
 *
 * @param {HTMLElement} container  - The `.idle-anim__slots` container
 * @param {object}      options
 * @param {string}      options.dropGroup      - Must match the card's dropGroup
 * @param {function}    [options.onDrop]        - Called after a card is moved into/within this container: (card, container) => void
 */
export function makeDropContainer(container, { dropGroup, onDrop }) {
	container.addEventListener("dragover", (e) => {
		if (!dragState || dragState.group !== dropGroup) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	});

	container.addEventListener("dragenter", (e) => {
		if (!dragState || dragState.group !== dropGroup) return;
		e.preventDefault();
		container.classList.add("idle-anim__slots--drag-over");
	});

	container.addEventListener("dragleave", (e) => {
		// Only remove highlight when leaving the container itself, not child elements
		if (e.relatedTarget && container.contains(e.relatedTarget)) return;
		container.classList.remove("idle-anim__slots--drag-over");
	});

	// Container-level drop: appends to end when dropping on empty space
	container.addEventListener("drop", (e) => {
		e.preventDefault();
		container.classList.remove("idle-anim__slots--drag-over");
		if (!dragState || dragState.group !== dropGroup) return;

		const src = dragState.card;
		const srcContainer = dragState.sourceContainer;
		container.appendChild(src);

		notifyReorder(container, src);
		if (srcContainer !== container) {
			notifyReorder(srcContainer, src);
		}

		dragState = null;
	});

	// Listen for the custom event dispatched by card-level drops too
	container.addEventListener("slot-reorder", (e) => {
		onDrop?.(e.detail.card, container);
	});
}
