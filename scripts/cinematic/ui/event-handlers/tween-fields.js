// ── Tween field event handlers ───────────────────────────────────────────────

import { TWEEN_TYPE_DEFAULTS } from "../editor-constants.js";
import PlaceablePickerApplication from "../../../placeable-picker/ui/PlaceablePickerApplication.js";

/**
 * Bind tween card and field events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindTweenFieldEvents(root, ctx) {
	// Tween card toggle
	root.querySelectorAll("[data-action='toggle-tween-card']").forEach((el) => {
		el.addEventListener("click", (e) => {
			if (e.target.closest("[data-action='delete-tween']")) return;
			const tweenIdx = Number(el.dataset.tweenIndex);
			const key = `${ctx.selectedPath}.tweens.${tweenIdx}`;
			if (ctx.expandedTweens.has(key)) {
				ctx.expandedTweens.delete(key);
			} else {
				ctx.expandedTweens.add(key);
			}
			ctx.render();
		});
	});

	// Tween pick target
	root.querySelectorAll("[data-action='pick-target']").forEach((btn) => {
		btn.addEventListener("click", async () => {
			const tweenIdx = Number(btn.dataset.tweenIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || Number.isNaN(tweenIdx)) return;

			const entry = ctx.getEntryAtPath(ctx.selectedPath);
			const currentTarget = entry?.tweens?.[tweenIdx]?.target ?? "";
			const initial = currentTarget ? [currentTarget] : [];

			const result = await PlaceablePickerApplication.open({ selections: initial });
			if (result && result.length > 0) {
				if (parsed.type === "timeline") {
					ctx.mutate((s) => s.updateTween(parsed.index, tweenIdx, { target: result[0] }));
				} else if (parsed.type === "branch") {
					const tweens = (entry.tweens ?? []).map((tw, i) => i === tweenIdx ? { ...tw, target: result[0] } : tw);
					ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens }));
				}
			}
		});
	});

	// Tween delete
	root.querySelectorAll("[data-action='delete-tween']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const tweenIdx = Number(btn.dataset.tweenIndex);
			const parsed = ctx.parseEntryPath(ctx.selectedPath);
			if (!parsed || Number.isNaN(tweenIdx)) return;

			if (parsed.type === "timeline") {
				ctx.mutate((s) => s.removeTween(parsed.index, tweenIdx));
			} else if (parsed.type === "branch") {
				const entry = ctx.getEntryAtPath(ctx.selectedPath);
				if (!entry) return;
				const tweens = (entry.tweens ?? []).filter((_, i) => i !== tweenIdx);
				ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { tweens }));
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
				} else if (field === "x" || field === "y" || field === "scale" || field === "toAlpha") {
					value = input.value.trim() === "" ? "" : Number(input.value) || 0;
				} else if (field === "value" && !Number.isNaN(Number(input.value)) && input.value.trim() !== "") {
					value = Number(input.value);
				} else {
					value = input.value;
				}
				// When type changes, reset fields to sensible defaults per form group, flush, and re-render
				if (field === "type") {
					const defaults = TWEEN_TYPE_DEFAULTS[value];
					const patch = { type: value };
					if (defaults) {
						const form = defaults.form ?? "prop";
						if (form === "prop" || form === "particles") {
							Object.assign(patch, { attribute: defaults.attribute, value: defaults.value });
						} else if (form === "camera") {
							Object.assign(patch, { x: defaults.x, y: defaults.y, scale: defaults.scale });
						} else if (form === "lightColor") {
							Object.assign(patch, { toColor: defaults.toColor, toAlpha: defaults.toAlpha, mode: defaults.mode });
						} else if (form === "lightState") {
							Object.assign(patch, { enabled: defaults.enabled });
						}
					}
					ctx.queueTweenChange(tweenIdx, patch);
					ctx.flushTweenChangesImmediate();
					ctx.render();
				} else {
					ctx.queueTweenChange(tweenIdx, { [field]: value });
				}
			});
		});
	});
}
