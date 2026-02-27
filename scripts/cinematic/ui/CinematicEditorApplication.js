import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { escapeHtml } from "../../time-triggers/core/utils.js";
import { CinematicState } from "./cinematic-state.js";
import { listEasingNames } from "../../tween/core/easing.js";
import { resolveAllTargets, validateCinematicDeep } from "../runtime.js";
import PlaceablePickerApplication from "../../placeable-picker/ui/PlaceablePickerApplication.js";
import CinematicTrackingApplication from "./CinematicTrackingApplication.js";

const TWEEN_TYPES = [
	{ value: "tile-prop", label: "Tile Prop" },
	{ value: "light-color", label: "Light Color" },
	{ value: "light-state", label: "Light State" },
	{ value: "particles-prop", label: "Particles Prop" },
	{ value: "camera-pan", label: "Camera Pan" },
	{ value: "token-prop", label: "Token Prop" },
	{ value: "drawing-prop", label: "Drawing Prop" },
	{ value: "sound-prop", label: "Sound Prop" },
];

const TRIGGER_OPTIONS = [
	{ value: "canvasReady", label: "Canvas Ready" },
	{ value: "manual", label: "Manual Only" },
];

const LANE_HEIGHT = 40;
const RULER_HEIGHT = 24;
const SETUP_WIDTH = 50;
const LANDING_WIDTH = 50;
const FIXED_BLOCK_WIDTH = 60;
const MIN_STEP_WIDTH = 40;
const MIN_DELAY_WIDTH = 20;

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
		const lanes = this.#computeLanes();
		const detail = this.#selectedPath != null ? this.#buildDetail(this.#selectedPath) : null;

		return {
			// Toolbar
			sceneName: this.#scene?.name ?? "No scene",
			dirty: this.#dirty,
			canUndo: this.#canUndo,
			canRedo: this.#canRedo,

			// Swimlane
			timeMarkers: lanes.timeMarkers,
			mainBlocks: lanes.mainBlocks,
			subLanes: lanes.subLanes,
			signalArcs: lanes.signalArcs,
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
			targetCount: this.#countUniqueTargets(),
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

		// Block selection (swimlane)
		root.querySelectorAll("[data-action='select-block']").forEach((el) => {
			el.addEventListener("click", (e) => {
				// Don't select if clicking a button inside the block
				if (e.target.closest("button")) return;
				const path = el.dataset.entryPath;
				this.#selectedPath = this.#selectedPath === path ? null : path;
				this.render({ force: true });
			});
		});

		// Drag-to-reorder on main lane blocks
		let dragSourcePath = null;
		root.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((el) => {
			const path = el.dataset.entryPath;
			if (path === "setup" || path === "landing") return; // not draggable

			el.addEventListener("dragstart", (e) => {
				dragSourcePath = path;
				el.classList.add("dragging");
				e.dataTransfer.effectAllowed = "move";
			});
			el.addEventListener("dragover", (e) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
			});
			el.addEventListener("dragenter", (e) => {
				e.preventDefault();
				el.classList.add("cinematic-editor__block--drag-over");
			});
			el.addEventListener("dragleave", () => {
				el.classList.remove("cinematic-editor__block--drag-over");
			});
			el.addEventListener("drop", (e) => {
				e.preventDefault();
				el.classList.remove("cinematic-editor__block--drag-over");
				const targetPath = el.dataset.entryPath;
				if (dragSourcePath && dragSourcePath !== targetPath) {
					const fromIdx = this.#getTimelineIndexFromPath(dragSourcePath);
					const toIdx = this.#getTimelineIndexFromPath(targetPath);
					if (fromIdx != null && toIdx != null) {
						// Update selectedPath to follow the moved entry
						if (this.#selectedPath === dragSourcePath) {
							this.#selectedPath = targetPath;
						}
						this.#mutate((s) => s.moveEntry(fromIdx, toIdx));
					}
				}
				dragSourcePath = null;
			});
			el.addEventListener("dragend", () => {
				el.classList.remove("dragging");
				dragSourcePath = null;
			});
		});

		// Toolbar actions
		root.querySelector("[data-action='save']")?.addEventListener("click", () => this.#onSave());
		root.querySelector("[data-action='play-preview']")?.addEventListener("click", () => this.#onPlay());
		root.querySelector("[data-action='reset-tracking']")?.addEventListener("click", () => this.#onResetTracking());
		root.querySelector("[data-action='export-json']")?.addEventListener("click", () => this.#onExportJSON());
		root.querySelector("[data-action='undo']")?.addEventListener("click", () => this.#undo());
		root.querySelector("[data-action='redo']")?.addEventListener("click", () => this.#redo());
		root.querySelector("[data-action='validate']")?.addEventListener("click", () => this.#onValidate());
		root.querySelector("[data-action='import-json']")?.addEventListener("click", () => this.#onImportJSON());
		root.querySelector("[data-action='open-tracking']")?.addEventListener("click", () => {
			new CinematicTrackingApplication({ scene: this.#scene }).render(true);
		});

		// Footer config
		root.querySelector("[data-action='change-trigger']")?.addEventListener("change", (e) => {
			this.#mutate((s) => s.setTrigger(e.target.value));
		});
		root.querySelector("[data-action='change-tracking']")?.addEventListener("change", (e) => {
			this.#mutate((s) => s.setTracking(e.target.checked));
		});
		root.querySelector("[data-action='change-synchronized']")?.addEventListener("change", (e) => {
			this.#mutate((s) => s.setSynchronized(e.target.checked));
		});

		// Detail panel: Delete entry
		root.querySelector("[data-action='delete-entry']")?.addEventListener("click", () => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.removeEntry(parsed.index));
				this.#selectedPath = null;
			} else if (parsed.type === "branch") {
				this.#mutate((s) => s.removeBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex));
				this.#selectedPath = null;
			}
		});

		// Detail panel: Add tween
		root.querySelector("[data-action='add-tween']")?.addEventListener("click", () => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.addTween(parsed.index));
			} else if (parsed.type === "branch") {
				const entry = this.#getEntryAtPath(this.#selectedPath);
				if (!entry) return;
				const defaultTween = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1000 };
				const tweens = [...(entry.tweens ?? []), defaultTween];
				this.#mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens }));
			}
		});

		// Detail panel: Delay input
		root.querySelector("[data-action='change-delay']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			const val = Number(e.target.value) || 0;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.updateEntry(parsed.index, { delay: val }));
			} else if (parsed.type === "branch") {
				this.#mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { delay: val }));
			}
		});

		// Tween card toggle
		root.querySelectorAll("[data-action='toggle-tween-card']").forEach((el) => {
			el.addEventListener("click", (e) => {
				if (e.target.closest("[data-action='delete-tween']")) return;
				const tweenIdx = Number(el.dataset.tweenIndex);
				const key = `${this.#selectedPath}.tweens.${tweenIdx}`;
				if (this.#expandedTweens.has(key)) {
					this.#expandedTweens.delete(key);
				} else {
					this.#expandedTweens.add(key);
				}
				this.render({ force: true });
			});
		});

		// Tween pick target
		root.querySelectorAll("[data-action='pick-target']").forEach((btn) => {
			btn.addEventListener("click", async () => {
				const tweenIdx = Number(btn.dataset.tweenIndex);
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed || Number.isNaN(tweenIdx)) return;

				const entry = this.#getEntryAtPath(this.#selectedPath);
				const currentTarget = entry?.tweens?.[tweenIdx]?.target ?? "";
				const initial = currentTarget ? [currentTarget] : [];

				const result = await PlaceablePickerApplication.open({ selections: initial });
				if (result && result.length > 0) {
					if (parsed.type === "timeline") {
						this.#mutate((s) => s.updateTween(parsed.index, tweenIdx, { target: result[0] }));
					} else if (parsed.type === "branch") {
						const tweens = (entry.tweens ?? []).map((tw, i) => i === tweenIdx ? { ...tw, target: result[0] } : tw);
						this.#mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens }));
					}
				}
			});
		});

		// Tween delete
		root.querySelectorAll("[data-action='delete-tween']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const tweenIdx = Number(btn.dataset.tweenIndex);
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed || Number.isNaN(tweenIdx)) return;

				if (parsed.type === "timeline") {
					this.#mutate((s) => s.removeTween(parsed.index, tweenIdx));
				} else if (parsed.type === "branch") {
					const entry = this.#getEntryAtPath(this.#selectedPath);
					if (!entry) return;
					const tweens = (entry.tweens ?? []).filter((_, i) => i !== tweenIdx);
					this.#mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens }));
				}
			});
		});

		// Tween field changes (debounced) — inside expanded card bodies
		root.querySelectorAll(".cinematic-editor__tween-card-body").forEach((body) => {
			const tweenIdx = Number(body.dataset.tweenIndex);

			body.querySelectorAll("[data-field]").forEach((input) => {
				const field = input.dataset.field;
				const eventType = input.tagName === "SELECT" ? "change" : input.type === "checkbox" ? "change" : "input";

				input.addEventListener(eventType, () => {
					let value;
					if (input.type === "checkbox") {
						value = input.checked;
					} else if (field === "duration") {
						value = Number(input.value) || 0;
					} else if (field === "value" && !Number.isNaN(Number(input.value)) && input.value.trim() !== "") {
						value = Number(input.value);
					} else {
						value = input.value;
					}
					this.#queueTweenChange(tweenIdx, { [field]: value });
				});
			});
		});

		// Setup/Landing editors
		root.querySelector("[data-action='edit-setup']")?.addEventListener("click", () => this.#onEditJSON("setup"));
		root.querySelector("[data-action='edit-landing']")?.addEventListener("click", () => this.#onEditJSON("landing"));

		// Before/After editors
		root.querySelector("[data-action='edit-before']")?.addEventListener("click", () => this.#onEditStepState("before"));
		root.querySelector("[data-action='edit-after']")?.addEventListener("click", () => this.#onEditStepState("after"));

		// Await detail
		root.querySelector("[data-action='change-await-event']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			const entry = this.#getEntryAtPath(this.#selectedPath);
			if (!entry?.await) return;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, event: e.target.value } }));
			}
		});
		root.querySelector("[data-action='change-await-signal']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			const entry = this.#getEntryAtPath(this.#selectedPath);
			if (!entry?.await) return;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, signal: e.target.value } }));
			}
		});
		root.querySelector("[data-action='change-await-target']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			const entry = this.#getEntryAtPath(this.#selectedPath);
			if (!entry?.await) return;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, target: e.target.value } }));
			}
		});
		root.querySelector("[data-action='pick-await-target']")?.addEventListener("click", async () => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			const entry = this.#getEntryAtPath(this.#selectedPath);
			if (!entry?.await) return;
			const { enterPickMode } = await import("../../placeable-picker/ui/pick-mode.js");
			enterPickMode({
				placeableType: "Tile",
				onPick: (doc) => {
					const tags = doc.flags?.tagger?.tags;
					const selector = tags?.length ? `tag:${tags[0]}` : `id:${doc.id}`;
					if (parsed.type === "timeline") {
						this.#mutate((s) => s.updateEntry(parsed.index, { await: { ...entry.await, target: selector } }));
					}
				},
			});
		});

		// Animation config for tile-click await
		for (const [action, key] of [["change-anim-idle", "idle"], ["change-anim-hover", "hover"], ["change-anim-dim", "dim"]]) {
			root.querySelector(`[data-action='${action}']`)?.addEventListener("change", (e) => {
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed) return;
				const entry = this.#getEntryAtPath(this.#selectedPath);
				if (!entry?.await) return;
				const raw = e.target.value.trim();
				const names = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
				const animation = { ...(entry.await.animation ?? {}) };
				if (names?.length) animation[key] = names.length === 1 ? names[0] : names;
				else delete animation[key];
				const awaitObj = { ...entry.await, animation: Object.keys(animation).length ? animation : undefined };
				if (!awaitObj.animation) delete awaitObj.animation;
				if (parsed.type === "timeline") {
					this.#mutate((s) => s.updateEntry(parsed.index, { await: awaitObj }));
				}
			});
		}

		// Emit detail
		root.querySelector("[data-action='change-emit-signal']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed) return;
			if (parsed.type === "timeline") {
				this.#mutate((s) => s.updateEntry(parsed.index, { emit: e.target.value }));
			}
		});

		// Parallel detail
		root.querySelector("[data-action='change-parallel-join']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed || parsed.type !== "timeline") return;
			const entry = this.#state.timeline[parsed.index];
			if (!entry?.parallel) return;
			this.#mutate((s) => s.updateEntry(parsed.index, { parallel: { ...entry.parallel, join: e.target.value } }));
		});
		root.querySelector("[data-action='change-parallel-overflow']")?.addEventListener("change", (e) => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed || parsed.type !== "timeline") return;
			const entry = this.#state.timeline[parsed.index];
			if (!entry?.parallel) return;
			this.#mutate((s) => s.updateEntry(parsed.index, { parallel: { ...entry.parallel, overflow: e.target.value } }));
		});
		root.querySelector("[data-action='edit-parallel-json']")?.addEventListener("click", () => this.#onEditParallelJSON());

		// Parallel branch management
		root.querySelector("[data-action='add-branch']")?.addEventListener("click", () => {
			const parsed = this.#parseEntryPath(this.#selectedPath);
			if (!parsed || parsed.type !== "timeline") return;
			this.#mutate((s) => s.addBranch(parsed.index));
		});
		root.querySelectorAll("[data-action='remove-branch']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
				this.#mutate((s) => s.removeBranch(parsed.index, bi));
			});
		});
		root.querySelectorAll("[data-action='add-branch-step']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
				this.#mutate((s) => s.addBranchEntry(parsed.index, bi, { tweens: [] }));
			});
		});
		root.querySelectorAll("[data-action='add-branch-delay']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi)) return;
				this.#mutate((s) => s.addBranchEntry(parsed.index, bi, { delay: 1000 }));
			});
		});
		root.querySelectorAll("[data-action='remove-branch-entry']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				const bei = Number(btn.dataset.branchEntryIndex);
				const parsed = this.#parseEntryPath(this.#selectedPath);
				if (!parsed || parsed.type !== "timeline" || Number.isNaN(bi) || Number.isNaN(bei)) return;
				this.#mutate((s) => s.removeBranchEntry(parsed.index, bi, bei));
			});
		});

		// Insertion points
		root.querySelectorAll("[data-action='show-insert-menu']").forEach((el) => {
			el.addEventListener("click", (e) => {
				e.stopPropagation();
				const insertIndex = Number(el.dataset.insertIndex);
				const lane = el.dataset.lane;
				this.#showInsertMenu(el, insertIndex, lane);
			});
		});

		// Insert menu buttons
		root.querySelectorAll("[data-action='insert-entry']").forEach((btn) => {
			btn.addEventListener("click", () => {
				if (!this.#insertMenuState) return;
				const type = btn.dataset.insertType;
				const { insertIndex } = this.#insertMenuState;
				switch (type) {
					case "step": this.#mutate((s) => s.addStep(insertIndex)); break;
					case "delay": this.#mutate((s) => s.addDelay(insertIndex)); break;
					case "await": this.#mutate((s) => s.addAwait(insertIndex)); break;
					case "emit": this.#mutate((s) => s.addEmit(insertIndex)); break;
					case "parallel": this.#mutate((s) => s.addParallel(insertIndex)); break;
				}
				this.#hideInsertMenu();
			});
		});

		// Click outside insert menu to close
		root.addEventListener("click", (e) => {
			if (this.#insertMenuState && !e.target.closest(".cinematic-editor__insert-menu") && !e.target.closest("[data-action='show-insert-menu']")) {
				this.#hideInsertMenu();
			}
		});
	}

	// ── Insert menu ───────────────────────────────────────────────────────

	#showInsertMenu(el, insertIndex, lane) {
		const menu = this.element?.querySelector(".cinematic-editor__insert-menu");
		if (!menu) return;
		const swimlane = this.element?.querySelector(".cinematic-editor__swimlane");
		if (!swimlane) return;

		const elRect = el.getBoundingClientRect();
		const swimRect = swimlane.getBoundingClientRect();

		menu.style.display = "";
		menu.style.left = `${elRect.left - swimRect.left}px`;
		menu.style.top = `${elRect.bottom - swimRect.top + 4}px`;
		this.#insertMenuState = { insertIndex, lane };
	}

	#hideInsertMenu() {
		const menu = this.element?.querySelector(".cinematic-editor__insert-menu");
		if (menu) menu.style.display = "none";
		this.#insertMenuState = null;
	}

	// ── Lane computation ──────────────────────────────────────────────────

	#computeLanes() {
		const timeline = this.#state.timeline;
		const scale = this.#computeScale();

		const mainBlocks = [];
		const subLaneGroups = [];
		const signals = { emits: [], awaits: [] };

		// Setup bookend
		mainBlocks.push({
			type: "setup", leftPx: 0, widthPx: SETUP_WIDTH,
			label: "Setup", entryPath: "setup",
			selected: this.#selectedPath === "setup",
		});
		let cursorPx = SETUP_WIDTH;

		for (let i = 0; i < timeline.length; i++) {
			const entry = timeline[i];
			const entryPath = `timeline.${i}`;
			const isSelected = this.#selectedPath === entryPath;

			if (entry.delay != null) {
				const w = Math.max(MIN_DELAY_WIDTH, entry.delay * scale);
				mainBlocks.push({
					type: "delay", leftPx: cursorPx, widthPx: w,
					label: `${entry.delay}ms`, entryPath, selected: isSelected,
				});
				cursorPx += w;
			} else if (entry.await != null) {
				const awaitEvent = entry.await.event ?? "click";
				const awaitLabel = awaitEvent === "tile-click" ? "Tile Click" : "Await";
				mainBlocks.push({
					type: "await", leftPx: cursorPx, widthPx: FIXED_BLOCK_WIDTH,
					label: awaitLabel, entryPath, selected: isSelected,
				});
				if (entry.await.event === "signal") {
					signals.awaits.push({
						signal: entry.await.signal,
						centerPx: cursorPx + FIXED_BLOCK_WIDTH / 2,
						laneIndex: 0,
					});
				}
				cursorPx += FIXED_BLOCK_WIDTH;
			} else if (entry.emit != null) {
				mainBlocks.push({
					type: "emit", leftPx: cursorPx, widthPx: FIXED_BLOCK_WIDTH,
					label: `Emit`, entryPath, selected: isSelected,
				});
				signals.emits.push({
					signal: entry.emit,
					centerPx: cursorPx + FIXED_BLOCK_WIDTH / 2,
					laneIndex: 0,
				});
				cursorPx += FIXED_BLOCK_WIDTH;
			} else if (entry.parallel != null) {
				const branches = entry.parallel.branches ?? [];
				const parallelStartPx = cursorPx;
				const branchLanes = [];

				let maxBranchWidth = 0;
				for (let bi = 0; bi < branches.length; bi++) {
					const pathPrefix = `timeline.${i}.parallel.branches.${bi}`;
					const { blocks, width, emits, awaits: branchAwaits } = this.#computeBranchLane(branches[bi], parallelStartPx, scale, pathPrefix);
					branchLanes.push({ label: `Br ${bi + 1}`, blocks });
					maxBranchWidth = Math.max(maxBranchWidth, width);
					const slOffset = subLaneGroups.length * 10 + bi + 1;
					for (const e of emits) signals.emits.push({ ...e, laneIndex: slOffset });
					for (const a of branchAwaits) signals.awaits.push({ ...a, laneIndex: slOffset });
				}

				const parallelWidth = Math.max(FIXED_BLOCK_WIDTH, maxBranchWidth);
				mainBlocks.push({
					type: "parallel", leftPx: parallelStartPx, widthPx: parallelWidth,
					label: `${branches.length} br`, entryPath, selected: isSelected,
				});
				subLaneGroups.push({ parallelEntryIndex: i, startPx: parallelStartPx, lanes: branchLanes });
				cursorPx += parallelWidth;
			} else {
				// Step
				const { stepDuration, detachOverflow } = this.#computeStepDurations(entry);
				const stepW = Math.max(MIN_STEP_WIDTH, stepDuration * scale);
				const detachTailW = detachOverflow > 0 ? Math.max(4, detachOverflow * scale) : 0;
				const label = this.#deriveStepLabel(entry);

				mainBlocks.push({
					type: "step", leftPx: cursorPx, widthPx: stepW,
					detachTailPx: detachTailW, label, entryPath, selected: isSelected,
				});
				cursorPx += stepW;
			}
		}

		// Landing bookend
		mainBlocks.push({
			type: "landing", leftPx: cursorPx, widthPx: LANDING_WIDTH,
			label: "Landing", entryPath: "landing",
			selected: this.#selectedPath === "landing",
		});
		cursorPx += LANDING_WIDTH;

		// Flatten sub-lanes for rendering
		const subLanes = subLaneGroups.flatMap((g) => g.lanes);

		// Compute signal arcs
		const signalArcs = this.#computeSignalArcs(signals, subLanes.length);

		// Compute time markers
		const totalDurationMs = this.#computeTotalDuration();
		const timeMarkers = this.#computeTimeMarkers(totalDurationMs, scale);

		// Compute insertion points
		const insertionPoints = this.#computeInsertionPoints(mainBlocks);

		// Swimlane height: ruler + main lane + sub-lanes
		const swimlaneHeightPx = RULER_HEIGHT + (1 + subLanes.length) * LANE_HEIGHT;

		return {
			mainBlocks, subLanes, signalArcs, timeMarkers, insertionPoints,
			totalWidthPx: Math.max(cursorPx, 200),
			swimlaneHeightPx,
			totalDurationMs,
		};
	}

	#computeScale() {
		const availableWidth = (this.position?.width ?? 1100) - 70 - 100; // minus labels and padding
		const totalMs = this.#computeTotalDuration();
		if (totalMs <= 0) return 0.1; // 100px per second default
		const scale = availableWidth / totalMs;
		return Math.max(0.03, Math.min(0.5, scale));
	}

	#computeTotalDuration() {
		return this.#state.timeline.reduce((sum, entry) => {
			if (entry.delay != null) return sum + entry.delay;
			if (entry.await != null) return sum + 500;
			if (entry.emit != null) return sum + 500;
			if (entry.parallel != null) return sum + this.#computeParallelDuration(entry);
			return sum + this.#computeStepDurations(entry).stepDuration;
		}, 0);
	}

	#computeParallelDuration(entry) {
		const branches = entry.parallel?.branches ?? [];
		let maxDuration = 0;
		for (const branch of branches) {
			let branchDuration = 0;
			for (const be of branch) {
				if (be.delay != null) branchDuration += be.delay;
				else if (be.await != null) branchDuration += 500;
				else if (be.emit != null) branchDuration += 500;
				else branchDuration += this.#computeStepDurations(be).stepDuration;
			}
			maxDuration = Math.max(maxDuration, branchDuration);
		}
		return Math.max(500, maxDuration);
	}

	#computeStepDurations(entry) {
		const tweens = entry.tweens ?? [];
		if (tweens.length === 0) return { stepDuration: 500, detachOverflow: 0 };

		let maxAttached = 0;
		let maxDetached = 0;
		for (const tw of tweens) {
			const d = tw.duration ?? 0;
			if (tw.detach) {
				maxDetached = Math.max(maxDetached, d);
			} else {
				maxAttached = Math.max(maxAttached, d);
			}
		}

		const stepDuration = Math.max(500, maxAttached);
		const detachOverflow = Math.max(0, maxDetached - stepDuration);
		return { stepDuration, detachOverflow };
	}

	#computeBranchLane(branch, startPx, scale, pathPrefix) {
		const blocks = [];
		const emits = [];
		const awaits = [];
		let cursorPx = startPx;

		for (let k = 0; k < branch.length; k++) {
			const be = branch[k];
			const entryPath = `${pathPrefix}.${k}`;
			const isSelected = this.#selectedPath === entryPath;

			if (be.delay != null) {
				const w = Math.max(MIN_DELAY_WIDTH, be.delay * scale);
				blocks.push({ type: "delay", leftPx: cursorPx, widthPx: w, label: `${be.delay}ms`, entryPath, selected: isSelected });
				cursorPx += w;
			} else if (be.await != null) {
				blocks.push({ type: "await", leftPx: cursorPx, widthPx: FIXED_BLOCK_WIDTH, label: be.await?.event ?? "click", entryPath, selected: isSelected });
				if (be.await?.event === "signal") {
					awaits.push({ signal: be.await.signal, centerPx: cursorPx + FIXED_BLOCK_WIDTH / 2 });
				}
				cursorPx += FIXED_BLOCK_WIDTH;
			} else if (be.emit != null) {
				blocks.push({ type: "emit", leftPx: cursorPx, widthPx: FIXED_BLOCK_WIDTH, label: be.emit || "emit", entryPath, selected: isSelected });
				emits.push({ signal: be.emit, centerPx: cursorPx + FIXED_BLOCK_WIDTH / 2 });
				cursorPx += FIXED_BLOCK_WIDTH;
			} else {
				const { stepDuration } = this.#computeStepDurations(be);
				const w = Math.max(MIN_STEP_WIDTH, stepDuration * scale);
				const label = this.#deriveStepLabel(be);
				blocks.push({ type: "step", leftPx: cursorPx, widthPx: w, label, entryPath, selected: isSelected });
				cursorPx += w;
			}
		}

		return { blocks, width: cursorPx - startPx, emits, awaits };
	}

	#deriveStepLabel(entry) {
		const tweens = entry.tweens ?? [];
		if (tweens.length === 0) return "Empty";
		const first = tweens[0];
		const target = (first.target ?? "").replace(/^tag:/, "#");
		const attr = first.attribute ?? "";
		if (first.type === "camera-pan") return "Pan";
		if (attr === "alpha") return `Fade ${target}`;
		if (attr === "x" || attr === "y") return `Move ${target}`;
		if (first.type === "light-color") return `Light ${target}`;
		if (first.type === "sound-prop") return `Sound ${target}`;
		if (target) return `${target}`;
		return `Step`;
	}

	#computeSignalArcs(signals, subLaneCount) {
		const arcs = [];

		for (const emit of signals.emits) {
			for (const await_ of signals.awaits) {
				if (emit.signal !== await_.signal) continue;

				const x1 = emit.centerPx;
				const y1 = this.#laneIndexToY(emit.laneIndex) + LANE_HEIGHT / 2;
				const x2 = await_.centerPx;
				const y2 = this.#laneIndexToY(await_.laneIndex) + LANE_HEIGHT / 2;

				const dy = y2 - y1;
				const cx = (x1 + x2) / 2;
				const cy1 = y1 + Math.sign(dy || 1) * Math.min(40, Math.abs(dy) * 0.5 + 20);
				const cy2 = y2 - Math.sign(dy || 1) * Math.min(40, Math.abs(dy) * 0.5 + 20);

				arcs.push({
					pathD: `M ${x1} ${y1} C ${cx} ${cy1}, ${cx} ${cy2}, ${x2} ${y2}`,
					signal: emit.signal,
				});
			}
		}
		return arcs;
	}

	#laneIndexToY(laneIndex) {
		return RULER_HEIGHT + laneIndex * LANE_HEIGHT;
	}

	#computeTimeMarkers(totalDurationMs, scale) {
		const markers = [];
		if (totalDurationMs <= 0) return markers;

		const pxPerSec = scale * 1000;
		let intervalMs;
		if (pxPerSec >= 200) intervalMs = 500;
		else if (pxPerSec >= 80) intervalMs = 1000;
		else if (pxPerSec >= 40) intervalMs = 2000;
		else intervalMs = 5000;

		for (let t = 0; t <= totalDurationMs + intervalMs; t += intervalMs) {
			const label = t >= 1000 ? `${(t / 1000).toFixed(t % 1000 === 0 ? 0 : 1)}s` : `${t}ms`;
			markers.push({ px: SETUP_WIDTH + t * scale, label });
		}
		return markers;
	}

	#computeInsertionPoints(mainBlocks) {
		const points = [];

		for (let i = 0; i < mainBlocks.length - 1; i++) {
			const block = mainBlocks[i];
			const nextBlock = mainBlocks[i + 1];
			const leftPx = block.leftPx + block.widthPx + (nextBlock.leftPx - (block.leftPx + block.widthPx)) / 2;
			const topPx = RULER_HEIGHT + LANE_HEIGHT / 2;

			let insertIndex;
			if (block.entryPath === "setup") {
				insertIndex = 0;
			} else if (block.entryPath === "landing") {
				continue;
			} else if (block.entryPath.startsWith("timeline.")) {
				const parts = block.entryPath.split(".");
				insertIndex = Number(parts[1]) + 1;
			} else {
				continue;
			}

			const isEnd = nextBlock.entryPath === "landing";

			points.push({ leftPx, topPx, insertIndex, lane: "main", isEnd });
		}
		return points;
	}

	// ── Path-based addressing ─────────────────────────────────────────────

	#parseEntryPath(path) {
		if (!path) return null;
		if (path === "setup") return { type: "setup" };
		if (path === "landing") return { type: "landing" };

		const parts = path.split(".");
		if (parts[0] === "timeline") {
			const index = Number(parts[1]);
			if (parts.length === 2) return { type: "timeline", index };
			// timeline.N.parallel.branches.B.E
			if (parts[2] === "parallel" && parts[3] === "branches" && parts.length >= 6) {
				return {
					type: "branch",
					index,
					branchIndex: Number(parts[4]),
					branchEntryIndex: Number(parts[5]),
				};
			}
		}
		return null;
	}

	#getEntryAtPath(path) {
		const parsed = this.#parseEntryPath(path);
		if (!parsed) return null;
		if (parsed.type === "setup") return this.#state.setup;
		if (parsed.type === "landing") return this.#state.landing;
		if (parsed.type === "timeline") return this.#state.timeline[parsed.index];
		if (parsed.type === "branch") {
			return this.#state.timeline[parsed.index]?.parallel?.branches?.[parsed.branchIndex]?.[parsed.branchEntryIndex];
		}
		return null;
	}

	#getTimelineIndexFromPath(path) {
		const parsed = this.#parseEntryPath(path);
		if (!parsed || parsed.type !== "timeline") return null;
		return parsed.index;
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

		const parsed = this.#parseEntryPath(entryPath);
		if (!parsed) return;

		if (parsed.type === "timeline") {
			this.#state = this.#state.updateTween(parsed.index, tweenIndex, patch);
		} else if (parsed.type === "branch") {
			const entry = this.#getEntryAtPath(entryPath);
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
				this.#state = CinematicState.fromScene(this.#scene);
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
			this.#state = CinematicState.fromScene(this.#scene);
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
		await api.play(this.#scene?.id);
	}

	async #onResetTracking() {
		const api = game.modules.get(MODULE_ID)?.api?.cinematic;
		if (!api?.reset) return;
		await api.reset(this.#scene?.id);
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

	#onImportJSON() {
		new Dialog({
			title: "Import Cinematic JSON",
			content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">Paste cinematic JSON data below. This will replace the current editor state.</p>
				<textarea id="cinematic-import-json" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem" placeholder='{"version":2,"trigger":"canvasReady",...}'></textarea>
			`,
			buttons: {
				import: {
					label: "Import",
					icon: '<i class="fas fa-file-import"></i>',
					callback: (html) => {
						const raw = html.find("#cinematic-import-json").val();
						try {
							const parsed = JSON.parse(raw);
							if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
								throw new Error("Expected a JSON object");
							}
							if (parsed.timeline !== undefined && !Array.isArray(parsed.timeline)) {
								throw new Error("'timeline' must be an array");
							}
							this.#mutate(() => new CinematicState(parsed));
							ui.notifications?.info?.("Cinematic JSON imported.");
						} catch (err) {
							ui.notifications?.error?.(`Import failed: ${err.message}`);
						}
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "import",
		}).render(true);
	}

	// ── JSON editors ──────────────────────────────────────────────────────

	async #onEditJSON(key) {
		const current = key === "setup" ? this.#state.setup : this.#state.landing;
		const json = JSON.stringify(current ?? {}, null, 2);

		new Dialog({
			title: `Edit ${key.charAt(0).toUpperCase() + key.slice(1)}`,
			content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${escapeHtml(json)}</textarea>
			`,
			buttons: {
				save: {
					label: "Apply",
					callback: (html) => {
						const raw = html.find("#cinematic-json-edit").val();
						try {
							const parsed = JSON.parse(raw);
							if (key === "setup") {
								this.#mutate((s) => s.setSetup(parsed));
							} else {
								this.#mutate((s) => s.setLanding(parsed));
							}
						} catch (err) {
							ui.notifications?.error?.(`Invalid JSON: ${err.message}`);
						}
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "save",
		}).render(true);
	}

	async #onEditStepState(key) {
		const entry = this.#getEntryAtPath(this.#selectedPath);
		if (!entry || entry.delay != null) return;

		const current = entry[key] ?? {};
		const json = JSON.stringify(current, null, 2);

		new Dialog({
			title: `Edit Step ${key.charAt(0).toUpperCase() + key.slice(1)}`,
			content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${escapeHtml(json)}</textarea>
			`,
			buttons: {
				save: {
					label: "Apply",
					callback: (html) => {
						const raw = html.find("#cinematic-json-edit").val();
						try {
							const parsed = JSON.parse(raw);
							const p = this.#parseEntryPath(this.#selectedPath);
							if (p?.type === "timeline") {
								this.#mutate((s) => s.updateEntry(p.index, { [key]: parsed }));
							} else if (p?.type === "branch") {
								this.#mutate((s) => s.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { [key]: parsed }));
							}
						} catch (err) {
							ui.notifications?.error?.(`Invalid JSON: ${err.message}`);
						}
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "save",
		}).render(true);
	}

	async #onEditParallelJSON() {
		const parsed = this.#parseEntryPath(this.#selectedPath);
		if (!parsed || parsed.type !== "timeline") return;
		const entry = this.#state.timeline[parsed.index];
		if (!entry?.parallel) return;

		const json = JSON.stringify(entry.parallel.branches ?? [], null, 2);

		new Dialog({
			title: "Edit Parallel Branches",
			content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${escapeHtml(json)}</textarea>
			`,
			buttons: {
				save: {
					label: "Apply",
					callback: (html) => {
						const raw = html.find("#cinematic-json-edit").val();
						try {
							const parsedJSON = JSON.parse(raw);
							if (!Array.isArray(parsedJSON)) throw new Error("Expected an array of branches");
							this.#mutate((s) => s.updateEntry(parsed.index, {
								parallel: { ...entry.parallel, branches: parsedJSON },
							}));
						} catch (err) {
							ui.notifications?.error?.(`Invalid JSON: ${err.message}`);
						}
					},
				},
				cancel: { label: "Cancel" },
			},
			default: "save",
		}).render(true);
	}

	// ── Detail panel builder ──────────────────────────────────────────────

	#buildDetail(path) {
		const parsed = this.#parseEntryPath(path);
		if (!parsed) return null;

		// Setup detail
		if (parsed.type === "setup") {
			return {
				isSetup: true,
				targetCount: Object.keys(this.#state.setup ?? {}).length,
			};
		}

		// Landing detail
		if (parsed.type === "landing") {
			return {
				isLanding: true,
				targetCount: Object.keys(this.#state.landing ?? {}).length,
			};
		}

		// Get the entry
		const entry = this.#getEntryAtPath(path);
		if (!entry) return null;

		// Delay
		if (entry.delay != null) {
			return { type: "delay", isDelay: true, delay: entry.delay };
		}

		// Await
		if (entry.await != null) {
			const event = entry.await?.event ?? "click";
			const anim = entry.await?.animation;
			const toStr = (v) => Array.isArray(v) ? v.join(", ") : (v ?? "");
			return {
				type: "await",
				isAwait: true,
				event,
				signal: entry.await?.signal ?? "",
				target: entry.await?.target ?? "",
				eventIsClick: event === "click",
				eventIsKeypress: event === "keypress",
				eventIsSignal: event === "signal",
				eventIsTileClick: event === "tile-click",
				animIdle: toStr(anim?.idle),
				animHover: toStr(anim?.hover),
				animDim: toStr(anim?.dim),
			};
		}

		// Emit
		if (entry.emit != null) {
			return { type: "emit", isEmit: true, signal: entry.emit };
		}

		// Parallel (only for top-level timeline entries)
		if (entry.parallel != null && parsed.type === "timeline") {
			const par = entry.parallel;
			const join = par.join ?? "all";
			const overflow = par.overflow ?? "detach";

			const branches = (par.branches ?? []).map((branch, bi) => ({
				branchIndex: bi,
				label: `Branch ${bi + 1}`,
				entries: (branch ?? []).map((be, bei) => {
					const isDelay = be.delay != null;
					const isAwait = be.await != null;
					const isEmit = be.emit != null;
					const isStep = !isDelay && !isAwait && !isEmit;
					let label, sub;
					if (isDelay) { label = `${be.delay}ms`; sub = "delay"; }
					else if (isAwait) { label = "Await"; sub = be.await?.event ?? "click"; }
					else if (isEmit) { label = "Emit"; sub = be.emit || "(unnamed)"; }
					else { label = "Step"; sub = `${be.tweens?.length ?? 0} tweens`; }
					return { branchEntryIndex: bei, isDelay, isAwait, isEmit, isStep, label, sub };
				}),
			}));

			return {
				type: "parallel",
				isParallel: true,
				branchCount: par.branches?.length ?? 0,
				join,
				overflow,
				joinIsAll: join === "all",
				joinIsAny: join === "any",
				overflowIsDetach: overflow === "detach",
				overflowIsCancel: overflow === "cancel",
				branches,
			};
		}

		// Step (including branch entries that are steps)
		const easingNames = listEasingNames();
		const tweens = (entry.tweens ?? []).map((tw, i) => {
			const tweenKey = `${path}.tweens.${i}`;
			const isExpanded = this.#expandedTweens.has(tweenKey);
			const typeObj = TWEEN_TYPES.find((t) => t.value === (tw.type ?? "tile-prop"));

			return {
				tweenIndex: i,
				isExpanded,
				type: tw.type ?? "tile-prop",
				typeLabel: typeObj?.label ?? tw.type ?? "Tile Prop",
				target: tw.target ?? "",
				attribute: tw.attribute ?? "",
				value: tw.value ?? "",
				duration: tw.duration ?? 0,
				easing: tw.easing ?? "",
				detach: tw.detach ?? false,
				typeOptions: TWEEN_TYPES.map((opt) => ({
					...opt,
					selected: opt.value === (tw.type ?? "tile-prop"),
				})),
				easingOptions: [
					{ value: "", label: "(default)", selected: !tw.easing },
					...easingNames.map((name) => ({
						value: name,
						label: name,
						selected: tw.easing === name,
					})),
				],
			};
		});

		const maxDuration = this.#maxTweenDuration(entry);
		const beforeKeys = Object.keys(entry.before ?? {});
		const afterKeys = Object.keys(entry.after ?? {});

		return {
			type: "step",
			isStep: true,
			isDelay: false,
			stepNumber: this.#stepNumberForPath(path),
			maxDuration,
			tweens,
			beforeSummary: beforeKeys.length ? `${beforeKeys.length} target${beforeKeys.length !== 1 ? "s" : ""}` : "(none)",
			afterSummary: afterKeys.length ? `${afterKeys.length} target${afterKeys.length !== 1 ? "s" : ""}` : "(none)",
		};
	}

	// ── Helpers ────────────────────────────────────────────────────────────

	#maxTweenDuration(entry) {
		if (!entry.tweens?.length) return 500;
		return Math.max(500, ...entry.tweens.map((t) => t.duration ?? 0));
	}

	#stepNumberForPath(path) {
		const parsed = this.#parseEntryPath(path);
		if (!parsed) return 0;

		if (parsed.type === "timeline") {
			let count = 0;
			for (let i = 0; i <= parsed.index; i++) {
				const e = this.#state.timeline[i];
				if (e && e.delay == null && e.await == null && e.emit == null && e.parallel == null) count++;
			}
			return count;
		}

		if (parsed.type === "branch") {
			const branch = this.#state.timeline[parsed.index]?.parallel?.branches?.[parsed.branchIndex] ?? [];
			let count = 0;
			for (let j = 0; j <= parsed.branchEntryIndex; j++) {
				const be = branch[j];
				if (be && be.delay == null && be.await == null && be.emit == null) count++;
			}
			return count;
		}
		return 0;
	}

	#countUniqueTargets() {
		const selectors = new Set();
		const data = this.#state.data;
		if (data.setup) for (const sel of Object.keys(data.setup)) selectors.add(sel);
		if (data.landing) for (const sel of Object.keys(data.landing)) selectors.add(sel);
		for (const entry of data.timeline ?? []) {
			if (entry.tweens) {
				for (const tw of entry.tweens) {
					if (tw.target) selectors.add(tw.target);
				}
			}
			if (entry.before) for (const sel of Object.keys(entry.before)) selectors.add(sel);
			if (entry.after) for (const sel of Object.keys(entry.after)) selectors.add(sel);
			if (entry.parallel?.branches) {
				for (const branch of entry.parallel.branches) {
					for (const be of branch) {
						if (be.tweens) {
							for (const tw of be.tweens) {
								if (tw.target) selectors.add(tw.target);
							}
						}
					}
				}
			}
		}
		return selectors.size;
	}
}
