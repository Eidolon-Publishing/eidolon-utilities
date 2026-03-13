/**
 * AppV2 dialog for adding a scene link.
 *
 * Three picker modes:
 *   1. Browse — folder-grouped <select>
 *   2. UUID   — paste a scene ID / UUID
 *   3. Sidebar — click a scene in the Scenes directory sidebar
 */

import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { localize } from "../../time-triggers/core/utils.js";
import { addSceneLink } from "../core/flag-utils.js";
import { resolveScene } from "../core/navigation.js";
import { addBidirectionalLink } from "../core/sync.js";
import { sharedPathDepth } from "../../common/ui/foundry-compat.js";

const MODULE_ID = "eidolon-utilities";

export default class AddLinkApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	#scene = null;
	#onComplete = null;
	#activeMode = "browse";
	#sidebarCleanup = null;
	#selectedSidebarId = null;
	#pickerSelectedId = null;

	constructor(options = {}) {
		const { scene, onComplete, ...rest } = options ?? {};
		super(rest);
		this.#scene = scene ?? null;
		this.#onComplete = typeof onComplete === "function" ? onComplete : null;
	}

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: `${MODULE_ID}-add-scene-link`,
			classes: Array.from(new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "standard-form", "themed"])),
			window: {
				title: localize("EIDOLON.SceneLinks.AddDialog.Title", "Add Scene Link"),
				resizable: false,
			},
			position: {
				width: 420,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/scene-links-add.html`,
		},
	};

	async _prepareContext() {
		const scene = this.#scene;
		const groups = this.#buildSceneGroups();

		return {
			groups,
			hasScenes: groups.some((g) => g.scenes.length > 0),
			sceneName: scene?.name ?? "",
			labels: {
				target: localize("EIDOLON.SceneLinks.Target", "Target Scene"),
				label: localize("EIDOLON.SceneLinks.Label", "Label"),
				reverseLink: localize("EIDOLON.SceneLinks.AddDialog.ReverseLink", "Also add reverse link on target scene"),
				reverseLabel: localize("EIDOLON.SceneLinks.AddDialog.ReverseLabel", "Reverse label"),
				add: localize("EIDOLON.SceneLinks.AddLink", "Add Link"),
				cancel: localize("EIDOLON.SceneLinks.Cancel", "Cancel"),
				browseTitle: localize("EIDOLON.SceneLinks.Picker.Browse", "Browse scenes by folder"),
				uuidTitle: localize("EIDOLON.SceneLinks.Picker.UUID", "Enter scene ID or UUID"),
				sidebarTitle: localize("EIDOLON.SceneLinks.Picker.Sidebar", "Click a scene in the sidebar"),
				sidebarWaiting: localize("EIDOLON.SceneLinks.Picker.SidebarWaiting", "Click a scene in the Scenes sidebar\u2026"),
			},
		};
	}

	_onRender(context, options) {
		super._onRender(context, options);
		const root = this.element;
		if (!root) return;

		// Mode switching
		root.querySelectorAll("[data-picker-mode]").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				this.#switchMode(btn.dataset.pickerMode);
			});
		});

		const hiddenTarget = root.querySelector('input[name="target"]');

		// Browse: searchable scene picker
		this.#activateScenePicker(root, hiddenTarget);

		// UUID input → sync hidden target
		const uuidInput = root.querySelector('input[name="targetUuid"]');
		if (uuidInput) {
			uuidInput.addEventListener("input", () => {
				if (this.#activeMode !== "uuid") return;
				const raw = uuidInput.value.trim();
				hiddenTarget.value = raw.startsWith("Scene.") ? raw.slice(6) : raw;
			});
		}

		// Reverse link checkbox toggle
		const reverseCheckbox = root.querySelector('input[name="reverse"]');
		const reverseLabelGroup = root.querySelector("[data-reverse-label-group]");
		if (reverseCheckbox && reverseLabelGroup) {
			reverseCheckbox.addEventListener("change", () => {
				reverseLabelGroup.style.display = reverseCheckbox.checked ? "" : "none";
			});
		}

		// Form submit
		const form = root.querySelector("form");
		if (form) form.addEventListener("submit", this.#onSubmit);

		// Cancel button
		root.querySelector('[data-action="cancel"]')?.addEventListener("click", (e) => {
			e.preventDefault();
			this.close();
		});
	}

	_onClose(options) {
		this.#cleanupSidebar();
		super._onClose?.(options);
	}

	// ── Mode switching ───────────────────────────────────────────────────

	#switchMode(mode) {
		this.#activeMode = mode;
		const root = this.element;
		if (!root) return;

		root.querySelectorAll("[data-picker-mode]").forEach((btn) => btn.classList.toggle("active", btn.dataset.pickerMode === mode));
		root.querySelectorAll("[data-panel]").forEach((p) => (p.style.display = p.dataset.panel === mode ? "" : "none"));

		const hiddenTarget = root.querySelector('input[name="target"]');

		if (mode === "browse") {
			// Restore picker's selected value
			if (hiddenTarget && this.#pickerSelectedId) hiddenTarget.value = this.#pickerSelectedId;
			this.#cleanupSidebar();
		} else if (mode === "uuid") {
			const uuidInput = root.querySelector('input[name="targetUuid"]');
			if (uuidInput && hiddenTarget) {
				const raw = uuidInput.value.trim();
				hiddenTarget.value = raw.startsWith("Scene.") ? raw.slice(6) : raw;
			}
			this.#cleanupSidebar();
		} else if (mode === "sidebar") {
			this.#activateSidebarPicker();
		}
	}

	// ── Sidebar picker ───────────────────────────────────────────────────

	#activateSidebarPicker() {
		this.#cleanupSidebar();

		// Switch Foundry sidebar to Scenes tab
		const scenesTab = document.querySelector('#sidebar-tabs [data-tab="scenes"]');
		if (scenesTab) scenesTab.click();

		const sidebar = document.querySelector("#scenes");
		if (!sidebar) return;

		const excludeId = this.#scene?.id;
		const root = this.element;
		const hiddenTarget = root?.querySelector('input[name="target"]');
		const waitingEl = root?.querySelector(".scene-links-picker__sidebar-waiting");
		const selectedEl = root?.querySelector(".scene-links-picker__sidebar-selected");

		const clickHandler = (e) => {
			const entry = e.target.closest(".directory-item.document");
			if (!entry) return;
			const sceneId = entry.dataset.documentId ?? entry.dataset.entryId;
			if (!sceneId || sceneId === excludeId) return;

			const pickedScene = game.scenes.get(sceneId);
			if (!pickedScene) return;

			e.preventDefault();
			e.stopPropagation();

			this.#selectedSidebarId = sceneId;
			if (hiddenTarget) hiddenTarget.value = sceneId;
			if (waitingEl) waitingEl.style.display = "none";
			if (selectedEl) {
				selectedEl.textContent = pickedScene.name;
				selectedEl.style.display = "";
			}
		};

		sidebar.addEventListener("click", clickHandler, true);
		this.#sidebarCleanup = () => sidebar.removeEventListener("click", clickHandler, true);
	}

	#cleanupSidebar() {
		if (this.#sidebarCleanup) {
			this.#sidebarCleanup();
			this.#sidebarCleanup = null;
		}
	}

	// ── Scene picker (searchable browse) ─────────────────────────────────

	#activateScenePicker(root, hiddenTarget) {
		const container = root.querySelector(".eidutil-scene-picker");
		if (!container) return;

		const search = container.querySelector(".eidutil-scene-search");
		const clearBtn = container.querySelector(".eidutil-scene-clear");

		// Build dropdown on document.body so it overlays without affecting layout
		const template = root.querySelector(".eidutil-scene-dropdown-data");
		if (!search || !template) return;

		const dropdown = document.createElement("div");
		dropdown.classList.add("eidutil-scene-dropdown");
		dropdown.style.display = "none";
		dropdown.innerHTML = template.innerHTML;
		document.body.appendChild(dropdown);

		const allOptions = [...dropdown.querySelectorAll(".eidutil-scene-option")];
		const allGroups = [...dropdown.querySelectorAll(".eidutil-scene-group-label")];
		let selectedLabel = "";

		const currentFolder = this.#getFolderPath(this.#scene);

		/** Position the dropdown below the search input. */
		const positionDropdown = () => {
			const rect = search.getBoundingClientRect();
			dropdown.style.top = `${rect.bottom + 2}px`;
			dropdown.style.left = `${rect.left}px`;
			dropdown.style.width = `${rect.width}px`;
		};

		// Build a structured index from the flat DOM for sorting
		const groupIndex = [];
		for (const groupEl of allGroups) {
			const folderPath = groupEl.dataset.folder || "";
			const options = [];
			let sibling = groupEl.nextElementSibling;
			while (sibling && !sibling.classList.contains("eidutil-scene-group-label")) {
				if (sibling.classList.contains("eidutil-scene-option")) {
					options.push(sibling);
				}
				sibling = sibling.nextElementSibling;
			}
			groupIndex.push({ groupEl, folderPath, options });
		}

		const filter = (q) => {
			const query = (q || "").toLowerCase().trim();

			if (!query) {
				// No query: restore original order (alphabetical by folder), show all
				groupIndex.sort((a, b) => a.folderPath.localeCompare(b.folderPath));
				for (const g of groupIndex) {
					g.groupEl.style.display = "";
					dropdown.appendChild(g.groupEl);
					for (const opt of g.options) {
						opt.style.display = "";
						dropdown.appendChild(opt);
					}
				}
				return;
			}

			// Filter and sort by shared path depth with current folder (closest first)
			for (const g of groupIndex) {
				const groupText = g.folderPath.toLowerCase();
				let hasVisible = false;
				for (const opt of g.options) {
					const text = opt.textContent.toLowerCase();
					const visible = text.includes(query) || groupText.includes(query);
					opt.style.display = visible ? "" : "none";
					if (visible) hasVisible = true;
				}
				g.groupEl.style.display = hasVisible ? "" : "none";
				g._hasVisible = hasVisible;
			}

			// Sort visible groups: highest shared path depth first, then alphabetical
			const sorted = [...groupIndex].sort((a, b) => {
				// Hidden groups go to the end
				if (a._hasVisible !== b._hasVisible) return a._hasVisible ? -1 : 1;
				const depthA = sharedPathDepth(currentFolder, a.folderPath);
				const depthB = sharedPathDepth(currentFolder, b.folderPath);
				if (depthA !== depthB) return depthB - depthA;
				return a.folderPath.localeCompare(b.folderPath);
			});

			// Reorder DOM
			for (const g of sorted) {
				dropdown.appendChild(g.groupEl);
				for (const opt of g.options) {
					dropdown.appendChild(opt);
				}
			}
		};

		const scrollToCurrentFolder = () => {
			requestAnimationFrame(() => {
				const target = currentFolder
					? dropdown.querySelector(`.eidutil-scene-group-label[data-folder="${CSS.escape(currentFolder)}"]:not([style*="display: none"])`)
					: dropdown.querySelector('.eidutil-scene-group-label:not([style*="display: none"])');
				if (target) target.scrollIntoView({ block: "start" });
			});
		};

		const openDropdown = () => {
			filter(search.value === selectedLabel ? "" : search.value);
			positionDropdown();
			dropdown.style.display = "block";
			scrollToCurrentFolder();

			setTimeout(() => {
				const closeHandler = (ev) => {
					if (container.contains(ev.target) || dropdown.contains(ev.target)) return;
					closeDropdown();
					document.removeEventListener("pointerdown", closeHandler, true);
				};
				document.addEventListener("pointerdown", closeHandler, true);
			}, 0);
		};

		const closeDropdown = () => {
			dropdown.style.display = "none";
			search.value = selectedLabel;
		};

		const select = (id, label) => {
			this.#pickerSelectedId = id;
			if (hiddenTarget) hiddenTarget.value = id;
			selectedLabel = label;
			search.value = label;
			if (clearBtn) clearBtn.style.display = id ? "" : "none";
			dropdown.style.display = "none";
		};

		search.addEventListener("focus", () => {
			search.select();
			openDropdown();
		});

		search.addEventListener("input", () => {
			filter(search.value);
			positionDropdown();
			dropdown.style.display = "block";
			if (!search.value.trim()) scrollToCurrentFolder();
		});

		dropdown.addEventListener("pointerdown", (e) => {
			const opt = e.target.closest(".eidutil-scene-option");
			if (!opt) return;
			e.preventDefault();
			e.stopPropagation();
			select(opt.dataset.id, opt.textContent.trim());
		});

		if (clearBtn) {
			clearBtn.addEventListener("click", (e) => {
				e.preventDefault();
				select("", "");
				search.focus();
			});
		}

		search.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				closeDropdown();
				search.blur();
			} else if (e.key === "Enter") {
				e.preventDefault();
				const first = dropdown.querySelector('.eidutil-scene-option:not([style*="display: none"])');
				if (first) first.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
			}
		});

		// Cleanup: remove dropdown from body when dialog closes
		this.addEventListener("close", () => dropdown.remove(), { once: true });
	}

	// ── Submit ────────────────────────────────────────────────────────────

	#onSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;

		const formData = new FormData(form);
		const targetId = String(formData.get("target") ?? "").trim();
		const label = String(formData.get("label") ?? "").trim();
		const addReverse = form.querySelector('input[name="reverse"]')?.checked ?? false;
		const reverseLabel = String(formData.get("reverseLabel") ?? "").trim();

		if (!targetId || !label) {
			ui.notifications.warn("Target and label are required.");
			return;
		}

		const targetScene = resolveScene(targetId);
		if (!targetScene) {
			ui.notifications.warn(`Scene not found: ${targetId}`);
			return;
		}

		if (addReverse && reverseLabel) {
			await addBidirectionalLink(this.#scene, targetScene, label, reverseLabel);
		} else {
			await addSceneLink(this.#scene, { label, target: targetScene.id });
		}

		if (this.#onComplete) this.#onComplete();
		this.close();
	};

	// ── Helpers ───────────────────────────────────────────────────────────

	/** Build folder-grouped scene list, excluding the current scene. */
	#buildSceneGroups() {
		const groupMap = new Map();
		const excludeId = this.#scene?.id;

		for (const s of game.scenes) {
			if (s.id === excludeId) continue;
			const path = this.#getFolderPath(s) || "\u2014 No Folder \u2014";
			if (!groupMap.has(path)) groupMap.set(path, []);
			groupMap.get(path).push({ id: s.id, name: s.name });
		}

		return [...groupMap.keys()]
			.sort((a, b) => a.localeCompare(b))
			.map((path) => ({
				path,
				scenes: groupMap.get(path).sort((a, b) => a.name.localeCompare(b.name)),
			}));
	}

	#getFolderPath(scene) {
		const parts = [];
		let folder = scene.folder;
		while (folder) {
			parts.unshift(folder.name);
			folder = folder.folder;
		}
		return parts.join(" / ");
	}
}
