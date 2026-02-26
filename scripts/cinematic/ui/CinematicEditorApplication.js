import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { escapeHtml } from "../../time-triggers/core/utils.js";
import { CinematicState } from "./cinematic-state.js";
import { discoverTargets } from "./target-discovery.js";
import { listEasingNames } from "../../tween/core/easing.js";
import { resolveAllTargets, validateCinematicDeep } from "../runtime.js";

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
				width: 700,
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
	#selectedIndex = null;
	#targets = [];
	#dirty = false;
	#changeTimer = null;
	#pendingChanges = null;
	#changeDebounceMs = 120;
	#history = [];
	#historyIndex = -1;
	#maxHistory = 50;
	#keydownHandler = null;

	constructor(options = {}) {
		super(options);
		this.#scene = options.scene ?? canvas.scene ?? null;
		this.#state = CinematicState.fromScene(this.#scene);
		this.#targets = this.#scene ? discoverTargets(this.#scene) : [];
	}

	// ── Context ───────────────────────────────────────────────────────────

	async _prepareContext() {
		const totalDuration = this.#computeTotalDuration();
		let stepCounter = 0;

		const timelineEntries = this.#state.timeline.map((entry, i) => {
			const isDelay = entry.delay != null;
			const isAwait = entry.await != null;
			const isEmit = entry.emit != null;
			const isParallel = entry.parallel != null;
			const isStep = !isDelay && !isAwait && !isEmit && !isParallel;
			if (isStep) stepCounter++;

			let label, sub, blockClass, duration;
			if (isDelay) {
				label = `${entry.delay}ms`;
				sub = "delay";
				blockClass = "cinematic-editor__block--delay";
				duration = entry.delay;
			} else if (isAwait) {
				label = "Await";
				sub = entry.await?.event ?? "click";
				blockClass = "cinematic-editor__block--await";
				duration = 500; // fixed visual width
			} else if (isEmit) {
				label = "Emit";
				sub = entry.emit || "(unnamed)";
				blockClass = "cinematic-editor__block--emit";
				duration = 500;
			} else if (isParallel) {
				const branchCount = entry.parallel?.branches?.length ?? 0;
				label = "Parallel";
				sub = `${branchCount} branch${branchCount !== 1 ? "es" : ""}`;
				blockClass = "cinematic-editor__block--parallel";
				duration = 500;
			} else {
				const tweenCount = entry.tweens?.length ?? 0;
				label = `Step ${stepCounter}`;
				sub = `${tweenCount} tween${tweenCount !== 1 ? "s" : ""}`;
				blockClass = "cinematic-editor__block--step";
				duration = this.#maxTweenDuration(entry);
			}

			return {
				index: i,
				isDelay, isAwait, isEmit, isParallel, isStep,
				selected: i === this.#selectedIndex,
				duration,
				label, sub, blockClass,
				flexBasis: totalDuration > 0 ? `${(duration / totalDuration) * 100}%` : "1",
			};
		});

		const detail = this.#selectedIndex != null ? this.#buildDetail(this.#selectedIndex) : null;

		return {
			sceneName: this.#scene?.name ?? "No scene",
			trigger: this.#state.trigger,
			tracking: this.#state.tracking,
			synchronized: this.#state.synchronized,
			triggerOptions: TRIGGER_OPTIONS.map((opt) => ({
				...opt,
				selected: opt.value === this.#state.trigger,
			})),
			timelineEntries,
			detail,
			setupCount: Object.keys(this.#state.setup ?? {}).length,
			landingCount: Object.keys(this.#state.landing ?? {}).length,
			dirty: this.#dirty,
			totalDuration,
			entryCount: this.#state.timeline.length,
			targetCount: this.#countUniqueTargets(),
			canUndo: this.#canUndo,
			canRedo: this.#canRedo,
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
		// Flush any pending debounced tween changes before prompting
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

	#bindEvents() {
		const root = this.element;
		if (!(root instanceof HTMLElement)) return;

		// Timeline block selection
		root.querySelectorAll("[data-action='select-entry']").forEach((el) => {
			el.addEventListener("click", () => {
				const idx = Number(el.dataset.index);
				this.#selectedIndex = this.#selectedIndex === idx ? null : idx;
				this.render({ force: true });
			});
		});

		// Drag-to-reorder timeline blocks
		let dragSourceIndex = null;
		root.querySelectorAll("[data-action='select-entry']").forEach((el) => {
			el.addEventListener("dragstart", (e) => {
				dragSourceIndex = Number(el.dataset.index);
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
				const targetIndex = Number(el.dataset.index);
				if (dragSourceIndex != null && dragSourceIndex !== targetIndex) {
					// Update selectedIndex to follow the moved entry
					if (this.#selectedIndex === dragSourceIndex) {
						this.#selectedIndex = targetIndex;
					} else if (this.#selectedIndex != null) {
						// Adjust selection if it shifted due to the move
						if (dragSourceIndex < this.#selectedIndex && targetIndex >= this.#selectedIndex) {
							this.#selectedIndex--;
						} else if (dragSourceIndex > this.#selectedIndex && targetIndex <= this.#selectedIndex) {
							this.#selectedIndex++;
						}
					}
					this.#mutate((s) => s.moveEntry(dragSourceIndex, targetIndex));
				}
				dragSourceIndex = null;
			});
			el.addEventListener("dragend", () => {
				el.classList.remove("dragging");
				dragSourceIndex = null;
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

		// Config bar
		root.querySelector("[data-action='change-trigger']")?.addEventListener("change", (e) => {
			this.#mutate((s) => s.setTrigger(e.target.value));
		});
		root.querySelector("[data-action='change-tracking']")?.addEventListener("change", (e) => {
			this.#mutate((s) => s.setTracking(e.target.checked));
		});
		root.querySelector("[data-action='change-synchronized']")?.addEventListener("change", (e) => {
			this.#mutate((s) => s.setSynchronized(e.target.checked));
		});

		// Timeline add buttons
		root.querySelector("[data-action='add-step']")?.addEventListener("click", () => {
			this.#mutate((s) => s.addStep());
		});
		root.querySelector("[data-action='add-delay']")?.addEventListener("click", () => {
			this.#mutate((s) => s.addDelay());
		});
		root.querySelector("[data-action='add-await']")?.addEventListener("click", () => {
			this.#mutate((s) => s.addAwait());
		});
		root.querySelector("[data-action='add-emit']")?.addEventListener("click", () => {
			this.#mutate((s) => s.addEmit());
		});
		root.querySelector("[data-action='add-parallel']")?.addEventListener("click", () => {
			this.#mutate((s) => s.addParallel());
		});

		// Detail panel actions
		root.querySelector("[data-action='delete-entry']")?.addEventListener("click", () => {
			if (this.#selectedIndex == null) return;
			this.#mutate((s) => s.removeEntry(this.#selectedIndex));
			this.#selectedIndex = null;
		});

		root.querySelector("[data-action='add-tween']")?.addEventListener("click", () => {
			if (this.#selectedIndex == null) return;
			this.#mutate((s) => s.addTween(this.#selectedIndex));
		});

		// Delay input
		root.querySelector("[data-action='change-delay']")?.addEventListener("change", (e) => {
			if (this.#selectedIndex == null) return;
			this.#mutate((s) => s.updateEntry(this.#selectedIndex, { delay: Number(e.target.value) || 0 }));
		});

		// Tween row actions
		root.querySelectorAll("[data-action='delete-tween']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const tweenIdx = Number(btn.dataset.tweenIndex);
				if (this.#selectedIndex == null || Number.isNaN(tweenIdx)) return;
				this.#mutate((s) => s.removeTween(this.#selectedIndex, tweenIdx));
			});
		});

		// Tween field changes (debounced)
		root.querySelectorAll(".cinematic-editor__tween-row").forEach((row) => {
			const tweenIdx = Number(row.dataset.tweenIndex);

			row.querySelectorAll("[data-field]").forEach((input) => {
				const field = input.dataset.field;
				const eventType = input.tagName === "SELECT" ? "change" : input.type === "checkbox" ? "change" : "input";

				input.addEventListener(eventType, (e) => {
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
			if (this.#selectedIndex == null) return;
			const entry = this.#state.timeline[this.#selectedIndex];
			if (!entry?.await) return;
			this.#mutate((s) => s.updateEntry(this.#selectedIndex, { await: { ...entry.await, event: e.target.value } }));
		});
		root.querySelector("[data-action='change-await-signal']")?.addEventListener("change", (e) => {
			if (this.#selectedIndex == null) return;
			const entry = this.#state.timeline[this.#selectedIndex];
			if (!entry?.await) return;
			this.#mutate((s) => s.updateEntry(this.#selectedIndex, { await: { ...entry.await, signal: e.target.value } }));
		});

		// Emit detail
		root.querySelector("[data-action='change-emit-signal']")?.addEventListener("change", (e) => {
			if (this.#selectedIndex == null) return;
			this.#mutate((s) => s.updateEntry(this.#selectedIndex, { emit: e.target.value }));
		});

		// Parallel detail
		root.querySelector("[data-action='change-parallel-join']")?.addEventListener("change", (e) => {
			if (this.#selectedIndex == null) return;
			const entry = this.#state.timeline[this.#selectedIndex];
			if (!entry?.parallel) return;
			this.#mutate((s) => s.updateEntry(this.#selectedIndex, { parallel: { ...entry.parallel, join: e.target.value } }));
		});
		root.querySelector("[data-action='change-parallel-overflow']")?.addEventListener("change", (e) => {
			if (this.#selectedIndex == null) return;
			const entry = this.#state.timeline[this.#selectedIndex];
			if (!entry?.parallel) return;
			this.#mutate((s) => s.updateEntry(this.#selectedIndex, { parallel: { ...entry.parallel, overflow: e.target.value } }));
		});
		root.querySelector("[data-action='edit-parallel-json']")?.addEventListener("click", () => this.#onEditParallelJSON());

		// Parallel branch actions
		root.querySelector("[data-action='add-branch']")?.addEventListener("click", () => {
			if (this.#selectedIndex == null) return;
			this.#mutate((s) => s.addBranch(this.#selectedIndex));
		});
		root.querySelectorAll("[data-action='remove-branch']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				if (this.#selectedIndex == null || Number.isNaN(bi)) return;
				this.#mutate((s) => s.removeBranch(this.#selectedIndex, bi));
			});
		});
		root.querySelectorAll("[data-action='add-branch-step']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				if (this.#selectedIndex == null || Number.isNaN(bi)) return;
				this.#mutate((s) => s.addBranchEntry(this.#selectedIndex, bi, { tweens: [] }));
			});
		});
		root.querySelectorAll("[data-action='add-branch-delay']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				if (this.#selectedIndex == null || Number.isNaN(bi)) return;
				this.#mutate((s) => s.addBranchEntry(this.#selectedIndex, bi, { delay: 1000 }));
			});
		});
		root.querySelectorAll("[data-action='remove-branch-entry']").forEach((btn) => {
			btn.addEventListener("click", () => {
				const bi = Number(btn.dataset.branchIndex);
				const bei = Number(btn.dataset.branchEntryIndex);
				if (this.#selectedIndex == null || Number.isNaN(bi) || Number.isNaN(bei)) return;
				this.#mutate((s) => s.removeBranchEntry(this.#selectedIndex, bi, bei));
			});
		});
	}

	// ── State mutation ────────────────────────────────────────────────────

	#mutate(fn) {
		// Push current state onto history, trim forward history
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
		// Save current state for redo
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
		if (this.#selectedIndex == null) return;

		this.#pendingChanges = {
			...(this.#pendingChanges ?? {}),
			entryIndex: this.#selectedIndex,
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
		const { entryIndex, tweenIndex, patch } = this.#pendingChanges;
		this.#pendingChanges = null;

		this.#state = this.#state.updateTween(entryIndex, tweenIndex, patch);
		this.#dirty = true;
		// Don't re-render — user is typing. Status bar update is deferred to next render.
	}

	// ── Toolbar handlers ──────────────────────────────────────────────────

	async #onSave() {
		if (!this.#scene) return;

		// Flush any pending tween changes first
		if (this.#pendingChanges) this.#flushTweenChanges();

		// Check for external modifications
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
			// Refresh the loaded hash after successful save
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
			// Fallback: show in a dialog
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

		// Prepend unresolved target warnings
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
		if (this.#selectedIndex == null) return;
		const entry = this.#state.timeline[this.#selectedIndex];
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
							this.#mutate((s) => s.updateEntry(this.#selectedIndex, { [key]: parsed }));
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
		if (this.#selectedIndex == null) return;
		const entry = this.#state.timeline[this.#selectedIndex];
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
							const parsed = JSON.parse(raw);
							if (!Array.isArray(parsed)) throw new Error("Expected an array of branches");
							this.#mutate((s) => s.updateEntry(this.#selectedIndex, {
								parallel: { ...entry.parallel, branches: parsed },
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

	// ── Helpers ────────────────────────────────────────────────────────────

	#maxTweenDuration(entry) {
		if (!entry.tweens?.length) return 500; // minimum visual width
		return Math.max(500, ...entry.tweens.map((t) => t.duration ?? 0));
	}

	#computeTotalDuration() {
		return this.#state.timeline.reduce((sum, entry) => {
			if (entry.delay != null) return sum + entry.delay;
			if (entry.await != null || entry.emit != null || entry.parallel != null) return sum + 500;
			return sum + this.#maxTweenDuration(entry);
		}, 0);
	}

	#stepNumber(index) {
		let count = 0;
		for (let i = 0; i <= index; i++) {
			const e = this.#state.timeline[i];
			if (e && e.delay == null && e.await == null && e.emit == null && e.parallel == null) count++;
		}
		return count;
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
		}
		return selectors.size;
	}

	#buildDetail(index) {
		const entry = this.#state.timeline[index];
		if (!entry) return null;

		if (entry.delay != null) {
			return { type: "delay", isDelay: true, delay: entry.delay };
		}

		if (entry.await != null) {
			const event = entry.await?.event ?? "click";
			return {
				type: "await",
				isAwait: true,
				event,
				signal: entry.await?.signal ?? "",
				eventIsClick: event === "click",
				eventIsKeypress: event === "keypress",
				eventIsSignal: event === "signal",
			};
		}

		if (entry.emit != null) {
			return { type: "emit", isEmit: true, signal: entry.emit };
		}

		if (entry.parallel != null) {
			const par = entry.parallel;
			const join = par.join ?? "all";
			const overflow = par.overflow ?? "detach";

			// Build branch data for visual editor
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
				branchesJSON: JSON.stringify(par.branches ?? [], null, 2),
			};
		}

		// Step entry
		const easingNames = listEasingNames();
		const tweens = (entry.tweens ?? []).map((tw, i) => ({
			tweenIndex: i,
			type: tw.type ?? "tile-prop",
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
			targetOptions: this.#targets.map((t) => ({
				...t,
				selected: t.selector === (tw.target ?? ""),
			})),
			easingOptions: [
				{ value: "", label: "(default)", selected: !tw.easing },
				...easingNames.map((name) => ({
					value: name,
					label: name,
					selected: tw.easing === name,
				})),
			],
		}));

		const maxDuration = this.#maxTweenDuration(entry);
		const beforeKeys = Object.keys(entry.before ?? {});
		const afterKeys = Object.keys(entry.after ?? {});

		return {
			type: "step",
			isDelay: false,
			stepNumber: this.#stepNumber(index),
			maxDuration,
			tweens,
			targets: this.#targets,
			beforeSummary: beforeKeys.length ? `${beforeKeys.length} target${beforeKeys.length !== 1 ? "s" : ""}` : "(none)",
			afterSummary: afterKeys.length ? `${afterKeys.length} target${afterKeys.length !== 1 ? "s" : ""}` : "(none)",
		};
	}
}
