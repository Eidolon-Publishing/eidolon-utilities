import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { escapeHtml } from "../../time-triggers/core/utils.js";
import { CinematicState } from "./cinematic-state.js";
import { resolveAllTargets, validateCinematicDeep } from "../runtime.js";

import { TRIGGER_OPTIONS } from "./editor-constants.js";
import { computeLanes } from "./swimlane-layout.js";
import { buildDetail, parseEntryPath, getEntryAtPath, countUniqueTargets } from "./detail-builder.js";
import { showImportDialog } from "./editor-dialogs.js";

import { bindToolbarEvents } from "./event-handlers/toolbar.js";
import { bindCinematicSelectorEvents } from "./event-handlers/cinematic-selector.js";
import { bindSwimlaneEvents } from "./event-handlers/swimlane.js";
import { bindDetailPanelEvents } from "./event-handlers/detail-panel.js";
import { bindTweenFieldEvents } from "./event-handlers/tween-fields.js";
import { bindSoundFieldEvents } from "./event-handlers/sound-fields.js";
import { bindSpecialEntryEvents } from "./event-handlers/special-entries.js";

export default class CinematicEditorApplication extends HandlebarsApplicationMixin(ApplicationV2) {
	static APP_ID = `${MODULE_ID}-cinematic-editor`;

	static DEFAULT_OPTIONS = foundry.utils.mergeObject(
		super.DEFAULT_OPTIONS,
		{
			id: CinematicEditorApplication.APP_ID,
			classes: Array.from(
				new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "eidolon-cinematic-editor-window", "themed"])
			),
			tag: "section",
			window: {
				title: "Cinematic Editor",
				icon: "fa-solid fa-film",
				resizable: true,
			},
			position: {
				width: 1100,
				height: "auto",
			},
		},
		{ inplace: false },
	);

	static PARTS = {
		content: {
			template: `modules/${MODULE_ID}/templates/cinematic-editor.html`,
		},
	};

	#scene = null;
	#state = null;
	#selectedPath = null;
	#expandedTweens = new Set();
	#dirty = false;
	#changeTimer = null;
	#pendingChanges = null;
	#changeDebounceMs = 120;
	#history = [];
	#historyIndex = -1;
	#maxHistory = 50;
	#keydownHandler = null;
	#insertMenuState = null;

	constructor(options = {}) {
		super(options);
		this.#scene = options.scene ?? canvas.scene ?? null;
		this.#state = CinematicState.fromScene(this.#scene);
	}

	// ── Context ───────────────────────────────────────────────────────────

	async _prepareContext() {
		const lanes = computeLanes(this.#state.timeline, {
			selectedPath: this.#selectedPath,
			windowWidth: this.position?.width ?? 1100,
		});
		const detail = this.#selectedPath != null ? buildDetail(this.#selectedPath, { state: this.#state, expandedTweens: this.#expandedTweens }) : null;

		const cinematicNames = this.#state.listCinematicNames();
		const activeName = this.#state.activeCinematicName;

		return {
			// Toolbar
			sceneName: this.#scene?.name ?? "No scene",
			dirty: this.#dirty,
			canUndo: this.#canUndo,
			canRedo: this.#canRedo,

			// Cinematic selector
			cinematicNames,
			activeCinematicName: activeName,
			cinematicOptions: cinematicNames.map((name) => ({
				value: name,
				label: name,
				selected: name === activeName,
			})),
			hasMultipleCinematics: cinematicNames.length > 1,

			// Swimlane
			timeMarkers: lanes.timeMarkers,
			mainBlocks: lanes.mainBlocks,
			subLanes: lanes.subLanes,
			signalArcs: lanes.signalArcs,
			fafConnectors: lanes.fafConnectors,
			totalWidthPx: lanes.totalWidthPx,
			swimlaneHeightPx: lanes.swimlaneHeightPx,
			insertionPoints: lanes.insertionPoints,

			// Detail
			detail,

			// Footer
			trigger: this.#state.trigger,
			tracking: this.#state.tracking,
			synchronized: this.#state.synchronized,
			triggerOptions: TRIGGER_OPTIONS.map((opt) => ({
				...opt,
				selected: opt.value === this.#state.trigger,
			})),
			entryCount: this.#state.timeline.length,
			totalDuration: lanes.totalDurationMs,
			targetCount: countUniqueTargets(this.#state),
			setupCount: Object.keys(this.#state.setup ?? {}).length,
			landingCount: Object.keys(this.#state.landing ?? {}).length,
		};
	}

	// ── Render & Events ───────────────────────────────────────────────────

	_onRender(context, options) {
		super._onRender(context, options);
		this.#bindEvents();

		// Register keyboard shortcuts (once)
		if (!this.#keydownHandler) {
			this.#keydownHandler = (e) => {
				if (!e.ctrlKey && !e.metaKey) return;
				if (e.key === "z" && !e.shiftKey) {
					e.preventDefault();
					this.#undo();
				} else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
					e.preventDefault();
					this.#redo();
				}
			};
			document.addEventListener("keydown", this.#keydownHandler);
		}
	}

	async close(options = {}) {
		if (this.#pendingChanges) this.#flushTweenChanges();

		if (this.#dirty && !options.force) {
			const action = await new Promise((resolve) => {
				new Dialog({
					title: "Unsaved Changes",
					content: "<p>You have unsaved cinematic changes.</p>",
					buttons: {
						save: { label: "Save & Close", icon: '<i class="fas fa-save"></i>', callback: () => resolve("save") },
						discard: { label: "Discard", icon: '<i class="fas fa-trash"></i>', callback: () => resolve("discard") },
						cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: () => resolve("cancel") },
					},
					default: "cancel",
					close: () => resolve("cancel"),
				}).render(true);
			});
			if (action === "cancel") return;
			if (action === "save") await this.#onSave();
		}
		return super.close(options);
	}

	async _onClose(options) {
		if (this.#changeTimer !== null) {
			clearTimeout(this.#changeTimer);
			this.#changeTimer = null;
		}
		if (this.#keydownHandler) {
			document.removeEventListener("keydown", this.#keydownHandler);
			this.#keydownHandler = null;
		}
		return super._onClose(options);
	}

	// ── Event binding ─────────────────────────────────────────────────────

	#bindEvents() {
		const root = this.element;
		if (!(root instanceof HTMLElement)) return;

		const ctx = this.#createEventContext();
		bindToolbarEvents(root, ctx);
		bindCinematicSelectorEvents(root, ctx);
		bindSwimlaneEvents(root, ctx);
		bindDetailPanelEvents(root, ctx);
		bindTweenFieldEvents(root, ctx);
		bindSoundFieldEvents(root, ctx);
		bindSpecialEntryEvents(root, ctx);
	}

	#createEventContext() {
		const self = this;
		return {
			// State access (read-only getters — closures over `self` for private field access)
			get state() { return self.#state; },
			get selectedPath() { return self.#selectedPath; },
			get scene() { return self.#scene; },
			get expandedTweens() { return self.#expandedTweens; },
			get insertMenuState() { return self.#insertMenuState; },

			// Mutations
			mutate: (fn) => this.#mutate(fn),
			setSelectedPath: (p) => { this.#selectedPath = p; this.render({ force: true }); },
			render: () => this.render({ force: true }),

			// Cinematic switching (needs full state swap + clear)
			switchCinematic: (name) => {
				if (this.#pendingChanges) this.#flushTweenChanges();
				this.#state = this.#state.switchCinematic(name);
				this.#selectedPath = null;
				this.#expandedTweens.clear();
				this.render({ force: true });
			},

			// Tween debouncing
			queueTweenChange: (idx, patch) => this.#queueTweenChange(idx, patch),
			flushTweenChanges: () => { if (this.#pendingChanges) this.#flushTweenChanges(); },
			flushTweenChangesImmediate: () => {
				if (this.#changeTimer !== null) clearTimeout(this.#changeTimer);
				this.#changeTimer = null;
				this.#flushTweenChanges();
			},

			// Path utilities
			parseEntryPath,
			getEntryAtPath: (p) => getEntryAtPath(p, this.#state),

			// Insert menu
			showInsertMenu: (el, idx, lane) => this.#showInsertMenu(el, idx, lane),
			hideInsertMenu: () => this.#hideInsertMenu(),

			// Toolbar actions
			save: () => this.#onSave(),
			play: () => this.#onPlay(),
			resetTracking: () => this.#onResetTracking(),
			exportJSON: () => this.#onExportJSON(),
			validate: () => this.#onValidate(),
			importJSON: () => showImportDialog({ state: this.#state, mutate: (fn) => this.#mutate(fn) }),
			undo: () => this.#undo(),
			redo: () => this.#redo(),
		};
	}

	// ── Insert menu ───────────────────────────────────────────────────────

	#showInsertMenu(el, insertIndex, lane) {
		const menu = this.element?.querySelector(".cinematic-editor__insert-menu");
		if (!menu) return;

		const elRect = el.getBoundingClientRect();

		// Reparent to document.body to escape all ancestor overflow clipping
		document.body.appendChild(menu);
		menu.style.display = "";
		menu.style.position = "fixed";
		menu.style.left = `${elRect.left}px`;

		// Flip upward if menu would go off-screen
		const menuHeight = menu.offsetHeight || 200;
		if (elRect.bottom + 4 + menuHeight > window.innerHeight) {
			menu.style.top = `${elRect.top - menuHeight - 4}px`;
		} else {
			menu.style.top = `${elRect.bottom + 4}px`;
		}

		this.#insertMenuState = { insertIndex, lane };
	}

	#hideInsertMenu() {
		// Menu may be on document.body — find it there or in our element
		const menu = document.body.querySelector(".cinematic-editor__insert-menu")
			?? this.element?.querySelector(".cinematic-editor__insert-menu");
		if (menu) {
			menu.style.display = "none";
			// Move back into our element so it gets cleaned up on re-render
			const root = this.element?.querySelector(".cinematic-editor");
			if (root && menu.parentNode !== root) root.appendChild(menu);
		}
		this.#insertMenuState = null;
	}

	// ── State mutation ────────────────────────────────────────────────────

	#mutate(fn) {
		this.#history = this.#history.slice(0, this.#historyIndex + 1);
		this.#history.push(this.#state);
		if (this.#history.length > this.#maxHistory) this.#history.shift();
		this.#historyIndex = this.#history.length - 1;

		this.#state = fn(this.#state);
		this.#dirty = true;
		this.render({ force: true });
	}

	get #canUndo() { return this.#historyIndex >= 0; }
	get #canRedo() { return this.#historyIndex < this.#history.length - 1; }

	#undo() {
		if (!this.#canUndo) return;
		if (this.#historyIndex === this.#history.length - 1) {
			this.#history.push(this.#state);
		}
		this.#state = this.#history[this.#historyIndex];
		this.#historyIndex--;
		this.#dirty = true;
		this.render({ force: true });
	}

	#redo() {
		if (!this.#canRedo) return;
		this.#historyIndex++;
		this.#state = this.#history[this.#historyIndex + 1];
		this.#dirty = true;
		this.render({ force: true });
	}

	#queueTweenChange(tweenIdx, patch) {
		if (this.#selectedPath == null) return;

		this.#pendingChanges = {
			...(this.#pendingChanges ?? {}),
			entryPath: this.#selectedPath,
			tweenIndex: tweenIdx,
			patch: { ...(this.#pendingChanges?.patch ?? {}), ...patch },
		};

		if (this.#changeTimer !== null) clearTimeout(this.#changeTimer);

		this.#changeTimer = setTimeout(() => {
			this.#changeTimer = null;
			this.#flushTweenChanges();
		}, this.#changeDebounceMs);
	}

	#flushTweenChanges() {
		if (!this.#pendingChanges) return;
		const { entryPath, tweenIndex, patch } = this.#pendingChanges;
		this.#pendingChanges = null;

		const parsed = parseEntryPath(entryPath);
		if (!parsed) return;

		if (parsed.type === "timeline") {
			this.#state = this.#state.updateTween(parsed.index, tweenIndex, patch);
		} else if (parsed.type === "branch") {
			const entry = getEntryAtPath(entryPath, this.#state);
			if (entry) {
				const tweens = (entry.tweens ?? []).map((tw, i) => i === tweenIndex ? { ...tw, ...patch } : tw);
				this.#state = this.#state.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens });
			}
		}
		this.#dirty = true;
	}

	// ── Toolbar handlers ──────────────────────────────────────────────────

	async #onSave() {
		if (!this.#scene) return;

		if (this.#pendingChanges) this.#flushTweenChanges();

		if (this.#state.isStale(this.#scene)) {
			const overwrite = await new Promise((resolve) => {
				new Dialog({
					title: "External Changes Detected",
					content: "<p>The scene's cinematic data was modified externally. Overwrite with your changes?</p>",
					buttons: {
						overwrite: { label: "Overwrite", icon: '<i class="fas fa-save"></i>', callback: () => resolve(true) },
						reload: { label: "Reload", icon: '<i class="fas fa-sync"></i>', callback: () => resolve("reload") },
						cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: () => resolve(false) },
					},
					default: "cancel",
					close: () => resolve(false),
				}).render(true);
			});
			if (overwrite === "reload") {
				this.#state = CinematicState.fromScene(this.#scene, this.#state.activeCinematicName);
				this.#dirty = false;
				this.#history = [];
				this.#historyIndex = -1;
				this.render({ force: true });
				ui.notifications?.info?.("Cinematic reloaded from scene.");
				return;
			}
			if (!overwrite) return;
		}

		try {
			await this.#state.save(this.#scene);
			this.#state = CinematicState.fromScene(this.#scene, this.#state.activeCinematicName);
			this.#dirty = false;
			ui.notifications?.info?.("Cinematic saved.");
			this.render({ force: true });
		} catch (err) {
			console.error(`${MODULE_ID} | Cinematic save failed`, err);
			ui.notifications?.error?.("Failed to save cinematic data.");
		}
	}

	async #onPlay() {
		const api = game.modules.get(MODULE_ID)?.api?.cinematic;
		if (!api?.play) {
			ui.notifications?.warn?.("Cinematic API not available.");
			return;
		}
		await api.play(this.#scene?.id, this.#state.activeCinematicName);
	}

	async #onResetTracking() {
		const api = game.modules.get(MODULE_ID)?.api?.cinematic;
		if (!api?.reset) return;
		await api.reset(this.#scene?.id, this.#state.activeCinematicName);
		ui.notifications?.info?.("Cinematic tracking reset.");
	}

	async #onExportJSON() {
		const json = JSON.stringify(this.#state.toJSON(), null, 2);
		try {
			await navigator.clipboard.writeText(json);
			ui.notifications?.info?.("Cinematic JSON copied to clipboard.");
		} catch {
			new Dialog({
				title: "Cinematic JSON",
				content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${escapeHtml(json)}</textarea>`,
				buttons: { ok: { label: "Close" } },
			}).render(true);
		}
	}

	#onValidate() {
		const data = this.#state.toJSON();
		const { targets, unresolved } = resolveAllTargets(data);
		const diagnostics = validateCinematicDeep(data, targets);

		const allIssues = [
			...unresolved.map((sel) => ({ path: "targets", level: "warn", message: `Unresolved target: "${sel}"` })),
			...diagnostics,
		];

		if (allIssues.length === 0) {
			ui.notifications?.info?.("Cinematic validation passed — no issues found.");
			return;
		}

		const lines = allIssues.map((d) => {
			const icon = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation";
			const color = d.level === "error" ? "#e74c3c" : "#f39c12";
			return `<li style="margin:0.3rem 0"><i class="fa-solid ${icon}" style="color:${color};margin-right:0.3rem"></i><strong>${escapeHtml(d.path)}</strong>: ${escapeHtml(d.message)}</li>`;
		});

		new Dialog({
			title: "Cinematic Validation",
			content: `<p>${allIssues.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${lines.join("")}</ul>`,
			buttons: { ok: { label: "Close" } },
		}).render(true);
	}
}
