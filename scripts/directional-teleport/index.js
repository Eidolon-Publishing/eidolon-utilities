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

const MODULE_ID = "eidolon-utilities";
const BEHAVIOR_TYPE = "directionalTeleport";
const FULL_TYPE = `${MODULE_ID}.${BEHAVIOR_TYPE}`;
const LOG_PREFIX = `[${MODULE_ID}] Directional Teleport:`;

const ALL_DIRECTIONS = ["left", "right", "up", "down"];
const DIRECTION_LABELS = { left: "Left", right: "Right", up: "Up", down: "Down" };
const DIRECTION_ICONS = { left: "fa-arrow-left", right: "fa-arrow-right", up: "fa-arrow-up", down: "fa-arrow-down" };

Hooks.once("init", () => {
	const { RegionBehaviorType } = foundry.data.regionBehaviors;
	const { BooleanField, DocumentUUIDField, StringField } = foundry.data.fields;

	/* -------------------------------------------------- */
	/*  Custom pill-set field                              */
	/* -------------------------------------------------- */

	/**
	 * A StringField that stores a comma-separated set of directions
	 * and renders as interactive pills in the form.
	 */
	class DirectionPillField extends StringField {
		/** @override */
		_toInput(config) {
			const currentValue = config.value || "";
			const selected = new Set(currentValue ? currentValue.split(",") : []);

			// Container
			const container = document.createElement("div");
			container.classList.add("eidutil-direction-pills");

			// Hidden input for form submission
			const hidden = document.createElement("input");
			hidden.type = "hidden";
			hidden.name = config.name;
			hidden.value = currentValue;
			container.appendChild(hidden);

			// Pill container
			const pillBox = document.createElement("div");
			pillBox.classList.add("eidutil-pill-box");
			container.appendChild(pillBox);

			const syncHidden = () => {
				const pills = pillBox.querySelectorAll(".eidutil-pill");
				const values = [];
				for (const pill of pills) values.push(pill.dataset.value);
				hidden.value = values.join(",");
			};

			const addPill = (dir) => {
				const pill = document.createElement("span");
				pill.classList.add("eidutil-pill");
				pill.dataset.value = dir;

				const icon = document.createElement("i");
				icon.className = `fa-solid ${DIRECTION_ICONS[dir]}`;
				pill.appendChild(icon);

				const label = document.createElement("span");
				label.textContent = ` ${DIRECTION_LABELS[dir]}`;
				pill.appendChild(label);

				const remove = document.createElement("a");
				remove.classList.add("eidutil-pill-remove");
				remove.innerHTML = '<i class="fa-solid fa-xmark"></i>';
				remove.addEventListener("click", (e) => {
					e.preventDefault();
					pill.remove();
					syncHidden();
					updateAddButton();
				});
				pill.appendChild(remove);

				pillBox.appendChild(pill);
			};

			// Render existing pills
			for (const dir of selected) {
				if (ALL_DIRECTIONS.includes(dir)) addPill(dir);
			}

			// "Add" dropdown
			const addWrapper = document.createElement("div");
			addWrapper.classList.add("eidutil-pill-add-wrapper");

			const addBtn = document.createElement("a");
			addBtn.classList.add("eidutil-pill-add");
			addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
			addWrapper.appendChild(addBtn);

			const dropdown = document.createElement("div");
			dropdown.classList.add("eidutil-pill-dropdown");
			dropdown.style.display = "none";

			for (const dir of ALL_DIRECTIONS) {
				const option = document.createElement("a");
				option.classList.add("eidutil-pill-option");
				option.dataset.value = dir;
				option.innerHTML = `<i class="fa-solid ${DIRECTION_ICONS[dir]}"></i> ${DIRECTION_LABELS[dir]}`;
				option.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					addPill(dir);
					syncHidden();
					dropdown.style.display = "none";
					updateAddButton();
				});
				dropdown.appendChild(option);
			}

			addWrapper.appendChild(dropdown);
			container.appendChild(addWrapper);

			addBtn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				updateDropdownOptions();
				const opening = dropdown.style.display === "none";
				dropdown.style.display = opening ? "block" : "none";

				// Close on next outside click (one-shot)
				if (opening) {
					setTimeout(() => {
						const closeHandler = () => {
							dropdown.style.display = "none";
							document.removeEventListener("pointerdown", closeHandler, true);
						};
						document.addEventListener("pointerdown", closeHandler, true);
					}, 0);
				}
			});

			const updateDropdownOptions = () => {
				const current = new Set(hidden.value ? hidden.value.split(",") : []);
				for (const option of dropdown.querySelectorAll(".eidutil-pill-option")) {
					option.style.display = current.has(option.dataset.value) ? "none" : "";
				}
			};

			const updateAddButton = () => {
				const current = new Set(hidden.value ? hidden.value.split(",") : []);
				addWrapper.style.display = current.size >= ALL_DIRECTIONS.length ? "none" : "";
			};

			updateAddButton();

			// "Any direction" hint when empty
			const hint = document.createElement("span");
			hint.classList.add("eidutil-pill-empty-hint");
			hint.textContent = "Any direction";
			pillBox.insertBefore(hint, pillBox.firstChild);

			const updateHint = () => {
				hint.style.display = pillBox.querySelectorAll(".eidutil-pill").length > 0 ? "none" : "";
			};

			// Observe pill changes for hint visibility
			const observer = new MutationObserver(updateHint);
			observer.observe(pillBox, { childList: true });
			updateHint();

			return container;
		}
	}

	/* -------------------------------------------------- */
	/*  Behavior type                                      */
	/* -------------------------------------------------- */

	class DirectionalTeleportRegionBehaviorType extends RegionBehaviorType {
		static LOCALIZATION_PREFIXES = ["EIDUTIL.TYPES.directionalTeleport"];

		static defineSchema() {
			return {
				destination: new DocumentUUIDField({
					type: "Region",
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
