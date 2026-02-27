// ── Sound field event handlers ───────────────────────────────────────────────

import { soundIdFromPath, loadAudioDurationMs } from "../editor-constants.js";

/**
 * Bind sound-related field events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindSoundFieldEvents(root, ctx) {
	/** Helper: apply a sound patch at the current selected path */
	function applySoundPatch(parsed, entry, soundPatch) {
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { sound: soundPatch }));
		} else if (parsed.type === "branch") {
			ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { sound: soundPatch }));
		}
	}

	root.querySelector("[data-action='change-sound-src']")?.addEventListener("change", async (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		const src = e.target.value;
		const patch = { ...entry.sound, src };
		if (!patch.id) patch.id = soundIdFromPath(src);
		const durationMs = await loadAudioDurationMs(src);
		if (durationMs > 0) patch.duration = durationMs;
		applySoundPatch(parsed, entry, patch);
	});

	root.querySelector("[data-action='pick-sound-src']")?.addEventListener("click", () => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		const fp = new FilePicker({
			type: "audio",
			current: entry.sound.src || "",
			callback: async (path) => {
				const patch = { ...entry.sound, src: path };
				if (!patch.id) patch.id = soundIdFromPath(path);
				const durationMs = await loadAudioDurationMs(path);
				if (durationMs > 0) patch.duration = durationMs;
				applySoundPatch(parsed, entry, patch);
			},
		});
		fp.render(true);
	});

	root.querySelector("[data-action='change-sound-id']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, id: e.target.value || undefined });
	});

	root.querySelector("[data-action='change-sound-volume']")?.addEventListener("input", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, volume: Number(e.target.value) || 0.8 });
	});

	root.querySelector("[data-action='change-sound-loop']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, loop: e.target.checked });
	});

	root.querySelector("[data-action='change-sound-fadein']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, fadeIn: Number(e.target.value) || undefined });
	});

	root.querySelector("[data-action='change-sound-fadeout']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, fadeOut: Number(e.target.value) || undefined });
	});

	root.querySelector("[data-action='change-sound-duration']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, duration: Number(e.target.value) || 0 });
	});

	root.querySelector("[data-action='change-sound-fireandforget']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		const entry = ctx.getEntryAtPath(ctx.selectedPath);
		if (!entry?.sound) return;
		applySoundPatch(parsed, entry, { ...entry.sound, fireAndForget: e.target.checked });
	});

	// StopSound detail
	root.querySelector("[data-action='change-stopsound-id']")?.addEventListener("change", (e) => {
		const parsed = ctx.parseEntryPath(ctx.selectedPath);
		if (!parsed) return;
		if (parsed.type === "timeline") {
			ctx.mutate((s) => s.updateEntry(parsed.index, { stopSound: e.target.value }));
		} else if (parsed.type === "branch") {
			ctx.mutate((s) => s.updateBranchEntry(parsed.index, parsed.branchIndex, parsed.branchEntryIndex, { stopSound: e.target.value }));
		}
	});
}
