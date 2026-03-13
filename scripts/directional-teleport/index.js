/**
 * Directional Teleport — a custom Region Behavior that teleports tokens
 * based on which direction they enter/exit the region.
 *
 * The `directions` field controls which sides of the SOURCE region trigger:
 * - Enter mode + "right": only triggers when the token enters from the right
 * - Exit mode + "right": only triggers when the token exits toward the right
 * - Empty set: triggers regardless of direction (same as "any")
 * - Multiple directions: triggers on any of them
 *
 * Token placement in the destination region is always random (same as core).
 */

import { escapeHTML as esc, sharedPathDepth } from "../common/ui/foundry-compat.js";

const MODULE_ID = "eidolon-utilities";
const BEHAVIOR_TYPE = "directionalTeleport";
const FULL_TYPE = `${MODULE_ID}.${BEHAVIOR_TYPE}`;
const LOG_PREFIX = `[${MODULE_ID}] Directional Teleport:`;

const ALL_DIRECTIONS = ["left", "right", "up", "down"];
const DIRECTION_LABELS = { left: "Left", right: "Right", up: "Up", down: "Down" };
// Exit/default: arrow matches the direction label. Enter/from: arrow shows movement direction (flipped).
const DIRECTION_ICONS = { left: "fa-arrow-left", right: "fa-arrow-right", up: "fa-arrow-up", down: "fa-arrow-down" };
const DIRECTION_ICONS_FROM = { left: "fa-arrow-right", right: "fa-arrow-left", up: "fa-arrow-down", down: "fa-arrow-up" };

Hooks.once("init", () => {
	const { RegionBehaviorType } = foundry.data.regionBehaviors;
	const { BooleanField, DocumentUUIDField, StringField } = foundry.data.fields;

	/* -------------------------------------------------- */
	/*  Custom pill-set field                              */
	/* -------------------------------------------------- */

	/**
	 * A StringField that stores a comma-separated set of directions
	 * and renders as interactive pills in the form.
	 *
	 * NOTE: _toInput returns static HTML only — Foundry's formGroup helper
	 * serializes via .outerHTML which strips event listeners. All interactivity
	 * is wired up in the renderRegionBehaviorConfig hook below.
	 */
	/**
	 * A StringField that stores a Region UUID and renders as a searchable
	 * combobox. Filters on region name, scene name, and folder path.
	 */
	class RegionPickerField extends StringField {
		/** @override */
		_toInput(config) {
			const uuid = config.value || "";
			let displayLabel = "";
			if (uuid) {
				try {
					const doc = fromUuidSync(uuid);
					if (doc) {
						const scene = doc.parent;
						displayLabel = `${doc.name} — ${scene?.name || "?"}`;
					} else {
						displayLabel = uuid;
					}
				} catch {
					displayLabel = uuid;
				}
			}

			const el = document.createElement("div");
			el.classList.add("eidutil-region-picker");
			el.dataset.uuid = uuid;
			el.innerHTML =
				`<input type="hidden" name="${config.name}" value="${esc(uuid)}">` +
				`<input type="text" class="eidutil-region-search" placeholder="Search regions…" autocomplete="off"` +
				` value="${esc(displayLabel)}">` +
				`<input type="text" class="eidutil-region-uuid" placeholder="Paste UUID… (Scene.x.Region.y)" autocomplete="off"` +
				` value="${esc(uuid)}" style="display:none">` +
				`<a class="eidutil-region-mode" title="Switch to UUID paste"><i class="fa-solid fa-keyboard"></i></a>` +
				`<a class="eidutil-region-clear" ${uuid ? "" : 'style="display:none"'}><i class="fa-solid fa-xmark"></i></a>` +
				`<div class="eidutil-region-dropdown" style="display:none"></div>`;
			return el;
		}
	}

	class DirectionPillField extends StringField {
		/** @override — returns static HTML, no event listeners */
		_toInput(config) {
			const currentValue = config.value || "";
			const selected = currentValue ? currentValue.split(",").filter((d) => ALL_DIRECTIONS.includes(d)) : [];

			const pillsHtml = selected
				.map(
					(dir) =>
						`<span class="eidutil-pill" data-value="${dir}">` +
						`<i class="fa-solid ${DIRECTION_ICONS[dir]}"></i> ` +
						`<span>${DIRECTION_LABELS[dir]}</span>` +
						`<a class="eidutil-pill-remove"><i class="fa-solid fa-xmark"></i></a>` +
						`</span>`,
				)
				.join("");

			const hintDisplay = selected.length > 0 ? ' style="display:none"' : "";
			const addDisplay = selected.length >= ALL_DIRECTIONS.length ? ' style="display:none"' : "";

			const optionsHtml = ALL_DIRECTIONS.map(
				(dir) =>
					`<a class="eidutil-pill-option" data-value="${dir}"` +
					(selected.includes(dir) ? ' style="display:none"' : "") +
					`><i class="fa-solid ${DIRECTION_ICONS[dir]}"></i> ${DIRECTION_LABELS[dir]}</a>`,
			).join("");

			const el = document.createElement("div");
			el.classList.add("eidutil-direction-pills");
			el.innerHTML =
				`<input type="hidden" name="${config.name}" value="${currentValue}">` +
				`<div class="eidutil-pill-box">` +
				`<span class="eidutil-pill-empty-hint"${hintDisplay}>Any direction</span>` +
				pillsHtml +
				`</div>` +
				`<div class="eidutil-pill-add-wrapper"${addDisplay}>` +
				`<a class="eidutil-pill-add"><i class="fa-solid fa-plus"></i></a>` +
				`<div class="eidutil-pill-dropdown" style="display:none">${optionsHtml}</div>` +
				`</div>`;
			return el;
		}
	}

	/**
	 * Wire up pill interactivity after the config sheet DOM is live.
	 */
	Hooks.on("renderRegionBehaviorConfig", (app, element) => {
		// Direction pills
		const containers = element.querySelectorAll(".eidutil-direction-pills");
		if (containers.length) {
			const eventSelect = element.querySelector('select[name="system.event"]');
			for (const container of containers) _activateDirectionPills(container, eventSelect);
		}
		// Region picker — pass the current scene for auto-scroll & proximity sorting
		const currentScene = app.document?.parent?.parent; // behavior → region → scene
		const currentSceneId = currentScene?.id;
		const currentSceneFolder = _folderPath(currentScene?.folder);
		const pickers = element.querySelectorAll(".eidutil-region-picker");
		for (const picker of pickers) _activateRegionPicker(picker, currentSceneId, currentSceneFolder);
	});

	/** Get the right icon map based on event mode. */
	function _iconMap(eventSelect) {
		return eventSelect?.value === "enter" ? DIRECTION_ICONS_FROM : DIRECTION_ICONS;
	}

	/** Refresh all pill and dropdown icons for the current event mode. */
	function _refreshIcons(container, eventSelect) {
		const icons = _iconMap(eventSelect);
		// Pills
		for (const pill of container.querySelectorAll(".eidutil-pill")) {
			const dir = pill.dataset.value;
			const i = pill.querySelector("i:first-child");
			if (i && icons[dir]) i.className = `fa-solid ${icons[dir]}`;
		}
		// Dropdown options
		for (const opt of container.querySelectorAll(".eidutil-pill-option")) {
			const dir = opt.dataset.value;
			const i = opt.querySelector("i");
			if (i && icons[dir]) i.className = `fa-solid ${icons[dir]}`;
		}
	}

	function _activateDirectionPills(container, eventSelect) {
		const hidden = container.querySelector('input[type="hidden"]');
		const pillBox = container.querySelector(".eidutil-pill-box");
		const hint = container.querySelector(".eidutil-pill-empty-hint");
		const addWrapper = container.querySelector(".eidutil-pill-add-wrapper");
		const addBtn = container.querySelector(".eidutil-pill-add");
		const dropdown = container.querySelector(".eidutil-pill-dropdown");
		if (!hidden || !pillBox || !addBtn || !dropdown) return;

		// Set initial icons based on current event mode
		_refreshIcons(container, eventSelect);

		// Re-sync icons when the event select changes
		if (eventSelect) {
			eventSelect.addEventListener("change", () => _refreshIcons(container, eventSelect));
		}

		const syncHidden = () => {
			const values = [...pillBox.querySelectorAll(".eidutil-pill")].map((p) => p.dataset.value);
			hidden.value = values.join(",");
		};

		const updateHint = () => {
			if (hint) hint.style.display = pillBox.querySelectorAll(".eidutil-pill").length > 0 ? "none" : "";
		};

		const updateAddButton = () => {
			const count = pillBox.querySelectorAll(".eidutil-pill").length;
			if (addWrapper) addWrapper.style.display = count >= ALL_DIRECTIONS.length ? "none" : "";
		};

		const updateDropdownOptions = () => {
			const current = new Set(hidden.value ? hidden.value.split(",") : []);
			for (const opt of dropdown.querySelectorAll(".eidutil-pill-option")) {
				opt.style.display = current.has(opt.dataset.value) ? "none" : "";
			}
		};

		const addPill = (dir) => {
			const icons = _iconMap(eventSelect);
			const pill = document.createElement("span");
			pill.classList.add("eidutil-pill");
			pill.dataset.value = dir;
			pill.innerHTML =
				`<i class="fa-solid ${icons[dir]}"></i> ` +
				`<span>${DIRECTION_LABELS[dir]}</span>` +
				`<a class="eidutil-pill-remove"><i class="fa-solid fa-xmark"></i></a>`;
			pillBox.appendChild(pill);
		};

		// Delegate: pill remove buttons
		pillBox.addEventListener("click", (e) => {
			const removeBtn = e.target.closest(".eidutil-pill-remove");
			if (!removeBtn) return;
			e.preventDefault();
			removeBtn.closest(".eidutil-pill").remove();
			syncHidden();
			updateHint();
			updateAddButton();
			updateDropdownOptions();
		});

		// + button: toggle dropdown
		addBtn.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			e.stopPropagation();
			updateDropdownOptions();
			const opening = dropdown.style.display === "none";
			dropdown.style.display = opening ? "block" : "none";
			if (opening) {
				setTimeout(() => {
					const closeHandler = (ev) => {
						if (dropdown.contains(ev.target)) return;
						dropdown.style.display = "none";
						document.removeEventListener("pointerdown", closeHandler, true);
					};
					document.addEventListener("pointerdown", closeHandler, true);
				}, 0);
			}
		});

		// Dropdown options: select a direction
		dropdown.addEventListener("pointerdown", (e) => {
			const opt = e.target.closest(".eidutil-pill-option");
			if (!opt) return;
			e.preventDefault();
			e.stopPropagation();
			addPill(opt.dataset.value);
			syncHidden();
			dropdown.style.display = "none";
			updateHint();
			updateAddButton();
		});
	}

	/* -------------------------------------------------- */
	/*  Region picker                                      */
	/* -------------------------------------------------- */

	/** Build a flat list of { uuid, sceneId, regionName, sceneName, folderPath, searchText }. */
	function _buildRegionIndex() {
		const entries = [];
		for (const scene of game.scenes) {
			const folderPath = _folderPath(scene.folder);
			for (const region of scene.regions) {
				const uuid = region.uuid;
				const regionName = region.name || "Unnamed Region";
				const sceneName = scene.name || "Unnamed Scene";
				const searchText = `${folderPath} ${sceneName} ${regionName}`.toLowerCase();
				entries.push({ uuid, sceneId: scene.id, regionName, sceneName, folderPath, searchText });
			}
		}
		return entries;
	}

	function _folderPath(folder) {
		if (!folder) return "";
		const parts = [];
		let f = folder;
		while (f) {
			parts.unshift(f.name);
			f = f.folder;
		}
		return parts.join(" / ");
	}

	/**
	 * Parse a Region UUID like "Scene.abc.Region.def" and resolve it
	 * by walking game.scenes → scene.regions (fromUuidSync doesn't work for embedded docs).
	 */
	function _resolveRegionUuid(uuid) {
		const m = uuid.match(/^Scene\.([^.]+)\.Region\.([^.]+)$/);
		if (!m) return null;
		const scene = game.scenes?.get(m[1]);
		if (!scene) return null;
		const region = scene.regions?.get(m[2]);
		return region ?? null;
	}

	function _activateRegionPicker(container, currentSceneId, currentSceneFolder) {
		const hidden = container.querySelector('input[type="hidden"]');
		const search = container.querySelector(".eidutil-region-search");
		const uuidInput = container.querySelector(".eidutil-region-uuid");
		const modeBtn = container.querySelector(".eidutil-region-mode");
		const clearBtn = container.querySelector(".eidutil-region-clear");
		const dropdown = container.querySelector(".eidutil-region-dropdown");
		if (!hidden || !search || !uuidInput || !modeBtn || !dropdown) return;

		let regions = null; // lazy-built
		let selectedLabel = search.value || "";
		let uuidMode = false;

		const ensureIndex = () => {
			if (!regions) regions = _buildRegionIndex();
			return regions;
		};

		const renderOptions = (filter) => {
			const idx = ensureIndex();
			const q = (filter || "").toLowerCase().trim();
			const matches = q ? idx.filter((r) => r.searchText.includes(q)) : idx;

			if (matches.length === 0) {
				dropdown.innerHTML = '<div class="eidutil-region-no-match">No regions found</div>';
				return;
			}

			// Group by scene, tracking which group is the "current" scene
			const groups = new Map();
			const sceneIdByKey = new Map();
			const folderByKey = new Map();
			for (const m of matches) {
				const key = m.sceneName + (m.folderPath ? ` (${m.folderPath})` : "");
				if (!groups.has(key)) {
					groups.set(key, []);
					sceneIdByKey.set(key, m.sceneId);
					folderByKey.set(key, m.folderPath);
				}
				groups.get(key).push(m);
			}

			// Sort: current scene first, then by folder proximity (closest ancestor first), then alphabetical
			const sortedKeys = [...groups.keys()].sort((a, b) => {
				const aIsCurrent = sceneIdByKey.get(a) === currentSceneId;
				const bIsCurrent = sceneIdByKey.get(b) === currentSceneId;
				if (aIsCurrent !== bIsCurrent) return aIsCurrent ? -1 : 1;
				const depthA = sharedPathDepth(currentSceneFolder, folderByKey.get(a));
				const depthB = sharedPathDepth(currentSceneFolder, folderByKey.get(b));
				if (depthA !== depthB) return depthB - depthA;
				return a.localeCompare(b);
			});

			let html = "";
			let currentSceneGroupAttr = "";
			for (const key of sortedKeys) {
				const items = groups.get(key);
				const isCurrent = sceneIdByKey.get(key) === currentSceneId;
				html +=
					`<div class="eidutil-region-group-label"${isCurrent ? ' data-current-scene="true"' : ""}>` +
					`${esc(key)}</div>`;
				for (const item of items) {
					html +=
						`<a class="eidutil-region-option" data-uuid="${esc(item.uuid)}">` +
						`<i class="fa-solid fa-draw-polygon"></i> ${esc(item.regionName)}</a>`;
				}
			}
			dropdown.innerHTML = html;
		};

		const openDropdown = () => {
			renderOptions(search.value === selectedLabel ? "" : search.value);
			dropdown.style.display = "block";

			// Auto-scroll to the current scene's group
			requestAnimationFrame(() => {
				const currentGroup = dropdown.querySelector('.eidutil-region-group-label[data-current-scene="true"]');
				if (currentGroup) currentGroup.scrollIntoView({ block: "start" });
			});

			setTimeout(() => {
				const closeHandler = (ev) => {
					if (container.contains(ev.target)) return;
					closeDropdown();
					document.removeEventListener("pointerdown", closeHandler, true);
				};
				document.addEventListener("pointerdown", closeHandler, true);
			}, 0);
		};

		const closeDropdown = () => {
			dropdown.style.display = "none";
			// Restore display label if user didn't select
			search.value = selectedLabel;
		};

		const select = (uuid, label) => {
			hidden.value = uuid;
			selectedLabel = label;
			search.value = label;
			if (clearBtn) clearBtn.style.display = uuid ? "" : "none";
			dropdown.style.display = "none";
		};

		// Focus → open dropdown, select text for easy replacement
		search.addEventListener("focus", () => {
			search.select();
			openDropdown();
		});

		// Type → filter
		search.addEventListener("input", () => {
			renderOptions(search.value);
			dropdown.style.display = "block";
		});

		// Select an option
		dropdown.addEventListener("pointerdown", (e) => {
			const opt = e.target.closest(".eidutil-region-option");
			if (!opt) return;
			e.preventDefault();
			e.stopPropagation();
			const uuid = opt.dataset.uuid;
			const label = opt.textContent.trim();
			const entry = ensureIndex().find((r) => r.uuid === uuid);
			select(uuid, entry ? `${entry.regionName} — ${entry.sceneName}` : label);
		});

		// Clear button
		if (clearBtn) {
			clearBtn.addEventListener("click", (e) => {
				e.preventDefault();
				select("", "");
				uuidInput.value = "";
				if (uuidMode) search.focus(); // stay in current mode
				else search.focus();
			});
		}

		// Mode toggle: search ↔ UUID
		const setMode = (toUuid) => {
			uuidMode = toUuid;
			search.style.display = toUuid ? "none" : "";
			uuidInput.style.display = toUuid ? "" : "none";
			dropdown.style.display = "none";
			modeBtn.querySelector("i").className = toUuid
				? "fa-solid fa-search"
				: "fa-solid fa-keyboard";
			modeBtn.title = toUuid ? "Switch to search" : "Switch to UUID paste";
			if (toUuid) {
				uuidInput.value = hidden.value;
				uuidInput.focus();
				uuidInput.select();
			} else {
				search.value = selectedLabel;
				search.focus();
				search.select();
			}
		};

		modeBtn.addEventListener("click", (e) => {
			e.preventDefault();
			setMode(!uuidMode);
		});

		// UUID input: resolve on Enter or blur
		const commitUuid = () => {
			const raw = uuidInput.value.trim();
			if (!raw) { select("", ""); return; }
			const region = _resolveRegionUuid(raw);
			if (region) {
				const scene = region.parent;
				select(raw, `${region.name} — ${scene?.name || "?"}`);
				uuidInput.value = raw;
			} else {
				// Keep the raw value so the user sees it didn't resolve
				uuidInput.classList.add("eidutil-region-uuid-error");
				setTimeout(() => uuidInput.classList.remove("eidutil-region-uuid-error"), 1500);
			}
		};

		uuidInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); commitUuid(); }
			else if (e.key === "Escape") { uuidInput.blur(); }
		});
		uuidInput.addEventListener("blur", commitUuid);

		// Keyboard: Escape closes, Enter selects first visible
		search.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				closeDropdown();
				search.blur();
			} else if (e.key === "Enter") {
				e.preventDefault();
				const first = dropdown.querySelector(".eidutil-region-option");
				if (first) first.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
			}
		});
	}

	/* -------------------------------------------------- */
	/*  Behavior type                                      */
	/* -------------------------------------------------- */

	class DirectionalTeleportRegionBehaviorType extends RegionBehaviorType {
		static LOCALIZATION_PREFIXES = ["EIDUTIL.TYPES.directionalTeleport"];

		static defineSchema() {
			return {
				destination: new RegionPickerField({
					required: false,
					initial: "",
					nullable: false,
				}),
				choice: new BooleanField(),
				directions: new DirectionPillField({
					required: true,
					initial: "",
					nullable: false,
				}),
				event: new StringField({
					required: true,
					initial: "enter",
					choices: {
						enter: "On Enter (from)",
						exit: "On Exit (toward)",
					},
				}),
			};
		}

		/* -------------------------------------------------- */
		/*  Direction detection                                */
		/* -------------------------------------------------- */

		/**
		 * Determine the primary direction of a movement vector.
		 * Returns "left", "right", "up", or "down".
		 */
		static _detectDirection(from, to) {
			const dx = to.x - from.x;
			const dy = to.y - from.y;
			if (Math.abs(dx) >= Math.abs(dy)) {
				return dx >= 0 ? "right" : "left";
			}
			return dy >= 0 ? "down" : "up";
		}

		/** Find the first ENTER segment. */
		static _findEnterSegment(segments) {
			for (const segment of segments) {
				if (segment.type === Region.MOVEMENT_SEGMENT_TYPES.ENTER) return segment;
			}
			return null;
		}

		/** Find the last EXIT segment. */
		static _findExitSegment(segments) {
			for (let i = segments.length - 1; i >= 0; i--) {
				if (segments[i].type === Region.MOVEMENT_SEGMENT_TYPES.EXIT) return segments[i];
			}
			return null;
		}

		/**
		 * Check if the token's movement direction matches the configured directions.
		 * Empty directions set = match any direction.
		 */
		static _matchesDirection(segments, directionsStr, eventType) {
			const allowedDirs = directionsStr ? new Set(directionsStr.split(",")) : new Set();
			if (allowedDirs.size === 0) return true; // empty = any

			const segment =
				eventType === "enter"
					? DirectionalTeleportRegionBehaviorType._findEnterSegment(segments)
					: DirectionalTeleportRegionBehaviorType._findExitSegment(segments);

			if (!segment) return false;

			const movementDirection = DirectionalTeleportRegionBehaviorType._detectDirection(
				segment.from,
				segment.to,
			);

			if (eventType === "enter") {
				// "from right" means the token was moving LEFT (coming from the right side)
				const entryFrom = { left: "right", right: "left", up: "down", down: "up" }[movementDirection];
				return allowedDirs.has(entryFrom);
			}
			// "toward right" means the token is moving right when it exits
			return allowedDirs.has(movementDirection);
		}

		/* -------------------------------------------------- */
		/*  Event handlers                                     */
		/* -------------------------------------------------- */

		static events = {
			[CONST.REGION_EVENTS.TOKEN_MOVE_IN]: this._onTokenMoveIn,
			[CONST.REGION_EVENTS.TOKEN_PRE_MOVE]: this._onTokenPreMove,
			[CONST.REGION_EVENTS.TOKEN_MOVE_OUT]: this._onTokenMoveOut,
		};

		/** Enter trigger: teleport the token if direction matches. */
		static async _onTokenMoveIn(event) {
			if (this.event !== "enter" || !this.destination || event.data.forced) return;
			if (
				!DirectionalTeleportRegionBehaviorType._matchesDirection(
					event.data.segments,
					this.directions,
					"enter",
				)
			)
				return;
			await DirectionalTeleportRegionBehaviorType._handleTeleport.call(this, event);
		}

		/** Exit trigger: teleport the token if direction matches. */
		static async _onTokenMoveOut(event) {
			if (this.event !== "exit" || !this.destination || event.data.forced) return;
			if (
				!DirectionalTeleportRegionBehaviorType._matchesDirection(
					event.data.segments,
					this.directions,
					"exit",
				)
			)
				return;
			await DirectionalTeleportRegionBehaviorType._handleTeleport.call(this, event);
		}

		/** Pre-move: stop the token at the entry point (enter mode only, if direction matches). */
		static async _onTokenPreMove(event) {
			if (this.event !== "enter" || !this.destination) return;
			if (
				!DirectionalTeleportRegionBehaviorType._matchesDirection(
					event.data.segments,
					this.directions,
					"enter",
				)
			)
				return;
			for (const segment of event.data.segments) {
				if (segment.type === Region.MOVEMENT_SEGMENT_TYPES.ENTER) {
					event.data.destination = segment.to;
					break;
				}
			}
		}

		/* -------------------------------------------------- */
		/*  Core teleport logic                                */
		/* -------------------------------------------------- */

		/** Shared handler for both enter and exit events. */
		static async _handleTeleport(event) {
			const destination = fromUuidSync(this.destination);
			if (!(destination instanceof RegionDocument)) {
				console.error(`${LOG_PREFIX} ${this.destination} does not exist`);
				return;
			}

			const token = event.data.token;
			const user = event.user;

			if (!DirectionalTeleportRegionBehaviorType._shouldTeleport(token, destination, user)) return;

			// Wait for any in-progress movement animation
			if (token.object) {
				const animation = CanvasAnimation.getAnimation(token.object.animationName);
				if (animation) await animation.promise;
			}

			// Confirm dialog (only for the triggering user)
			if (this.choice && user.isSelf) {
				const confirmed = await DirectionalTeleportRegionBehaviorType._confirmDialog(token, destination);
				if (!confirmed) return;
			}

			await DirectionalTeleportRegionBehaviorType._teleportToken(token, destination, user);
		}

		/**
		 * Determine which user should execute the teleport.
		 * Mirrors core logic: owner teleports if they can, otherwise the highest-role active GM.
		 */
		static _shouldTeleport(token, destination, user) {
			const userCanTeleport =
				token.parent === destination.parent || (user.can("TOKEN_CREATE") && user.can("TOKEN_DELETE"));
			if (userCanTeleport) return user.isSelf;
			const eligibleGMs = game.users.filter(
				(u) => u.active && u.isGM && u.can("TOKEN_CREATE") && u.can("TOKEN_DELETE"),
			);
			if (eligibleGMs.length === 0) return false;
			eligibleGMs.sort((a, b) => (b.role - a.role) || a.id.compare(b.id));
			return eligibleGMs[0].isSelf;
		}

		/** Confirmation dialog using i18n strings. */
		static async _confirmDialog(token, destination) {
			const DialogClass = foundry.applications?.api?.DialogV2 ?? Dialog;
			const i18nKey = game.user.isGM
				? "EIDUTIL.TYPES.directionalTeleport.ConfirmGM"
				: "EIDUTIL.TYPES.directionalTeleport.Confirm";
			const content = game.i18n.format(i18nKey, {
				token: token.name,
				region: destination.name,
				scene: destination.parent.name,
			});
			return DialogClass.confirm({
				window: { title: game.i18n.localize("EIDUTIL.directionalTeleport.typeLabel") },
				content: `<p>${content}</p>`,
				rejectClose: false,
			});
		}

		/* -------------------------------------------------- */
		/*  Random destination (same as core)                  */
		/* -------------------------------------------------- */

		/**
		 * Find a random valid position within the destination region.
		 * Mirrors core teleportToken #getDestination logic.
		 */
		static _getRandomDestination(region, token) {
			const scene = region.document.parent;
			const grid = scene.grid;

			if (region.polygons.length === 0) throw new Error(`${region.document.uuid} is empty`);

			const elevation = Math.clamp(token.document.elevation, region.bottom, region.top);
			const pivot = token.getCenterPoint({ x: 0, y: 0 });
			let position;

			if (!grid.isGridless) {
				const positions = [];
				const [i0, j0, i1, j1] = grid.getOffsetRange(
					new PIXI.Rectangle(0, 0, scene.dimensions.width, scene.dimensions.height)
						.fit(region.bounds)
						.pad(1),
				);

				for (let i = i0; i < i1; i++) {
					for (let j = j0; j < j1; j++) {
						const center = grid.getCenterPoint({ i, j });
						if (!region.polygonTree.testPoint(center)) continue;

						const pos = token.getSnappedPosition({ x: center.x - pivot.x, y: center.y - pivot.y });
						pos.x = Math.round(pos.x);
						pos.y = Math.round(pos.y);
						pos.elevation = elevation;

						if (!region.polygonTree.testPoint(token.getCenterPoint(pos))) continue;
						if (!token.testInsideRegion(region, pos)) continue;

						positions.push(pos);
					}
				}

				if (positions.length !== 0) position = positions[Math.floor(Math.random() * positions.length)];
			}

			if (position) return position;

			// Gridless fallback: triangulation sampling
			const { vertices, indices } = region.triangulation;
			const areas = [];
			let totalArea = 0;
			for (let k = 0; k < indices.length; k += 3) {
				const i0 = indices[k] * 2;
				const i1 = indices[k + 1] * 2;
				const i2 = indices[k + 2] * 2;
				const area =
					Math.abs(
						(vertices[i1] - vertices[i0]) * (vertices[i2 + 1] - vertices[i0 + 1]) -
							(vertices[i2] - vertices[i0]) * (vertices[i1 + 1] - vertices[i0 + 1]),
					) / 2;
				totalArea += area;
				areas.push(area);
			}

			for (let n = 0; n < 10; n++) {
				position = undefined;
				let j;
				let a = totalArea * Math.random();
				for (j = 0; j < areas.length - 1; j++) {
					a -= areas[j];
					if (a < 0) break;
				}
				const k = 3 * j;
				const i0 = indices[k] * 2;
				const i1 = indices[k + 1] * 2;
				const i2 = indices[k + 2] * 2;

				const r1 = Math.sqrt(Math.random());
				const r2 = Math.random();
				const s = r1 * (1 - r2);
				const t = r1 * r2;
				const x = Math.round(
					vertices[i0] +
						(vertices[i1] - vertices[i0]) * s +
						(vertices[i2] - vertices[i0]) * t -
						pivot.x,
				);
				const y = Math.round(
					vertices[i0 + 1] +
						(vertices[i1 + 1] - vertices[i0 + 1]) * s +
						(vertices[i2 + 1] - vertices[i0 + 1]) * t -
						pivot.y,
				);
				position = { x, y, elevation };

				if (!region.polygonTree.testPoint(token.getCenterPoint(position))) continue;
				if (!token.testInsideRegion(region, position)) continue;
			}

			if (!position) throw new Error(`${region.document.uuid} cannot accommodate ${token.document.uuid}`);
			return position;
		}

		/* -------------------------------------------------- */
		/*  Token teleportation                                */
		/* -------------------------------------------------- */

		/** Perform the actual teleportation, handling same-scene and cross-scene cases. */
		static async _teleportToken(originToken, destinationRegion, user) {
			const destinationScene = destinationRegion.parent;
			const originScene = originToken.parent;

			const destinationRegionObject =
				destinationRegion.object ?? new CONFIG.Region.objectClass(destinationRegion);

			let destinationToken;
			if (originScene === destinationScene) {
				destinationToken = originToken;
			} else {
				const data = originToken.toObject();
				delete data._id;
				destinationToken = TokenDocument.implementation.fromSource(data, { parent: destinationScene });
			}

			const destinationTokenObject =
				destinationToken.object ?? new CONFIG.Token.objectClass(destinationToken);
			if (destinationTokenObject.animationContexts.size !== 0) destinationToken.reset();

			let destination;
			try {
				destination = DirectionalTeleportRegionBehaviorType._getRandomDestination(
					destinationRegionObject,
					destinationTokenObject,
				);
			} finally {
				if (!destinationRegion.object) destinationRegionObject.destroy({ children: true });
				if (!destinationToken.id || !destinationToken.object)
					destinationTokenObject.destroy({ children: true });
			}

			// Same-scene teleport
			if (originToken === destinationToken) {
				await originToken.update(destination, { teleport: true, forced: true });
				return;
			}

			// Cross-scene teleport
			destinationToken.updateSource(destination);
			const destinationTokenData = destinationToken.toObject();
			if (destinationScene.tokens.has(originToken.id)) delete destinationTokenData._id;
			else destinationTokenData._id = originToken.id;

			destinationToken = await TokenDocument.implementation.create(destinationToken, {
				parent: destinationScene,
				keepId: true,
			});

			for (const combat of game.combats) {
				const toUpdate = [];
				for (const combatant of combat.combatants) {
					if (combatant.sceneId === originScene.id && combatant.tokenId === originToken.id) {
						toUpdate.push({
							_id: combatant.id,
							sceneId: destinationScene.id,
							tokenId: destinationToken.id,
						});
					}
				}
				if (toUpdate.length) await combat.updateEmbeddedDocuments("Combatant", toUpdate);
			}

			await originToken.delete();

			if (user.isSelf) {
				if (originScene.isView) await destinationScene.view();
			} else if (originScene.id === user.viewedScene) {
				await game.socket.emit("pullToScene", destinationScene.id, user.id);
			}
		}
	}

	// --- Register ---
	Object.assign(CONFIG.RegionBehavior.dataModels, {
		[FULL_TYPE]: DirectionalTeleportRegionBehaviorType,
	});
	CONFIG.RegionBehavior.typeLabels[FULL_TYPE] = "EIDUTIL.directionalTeleport.typeLabel";
	CONFIG.RegionBehavior.typeIcons[FULL_TYPE] = "fa-solid fa-compass";

	console.log(`${LOG_PREFIX} Behavior registered.`);
});
