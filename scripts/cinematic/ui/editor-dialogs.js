// ── Dialog wrappers for the cinematic editor ─────────────────────────────────

import { escapeHtml } from "../../time-triggers/core/utils.js";
import { CinematicState } from "./cinematic-state.js";
import { parseEntryPath, getEntryAtPath } from "./detail-builder.js";

/**
 * Show the Import JSON dialog.
 * @param {object} opts
 * @param {object} opts.state - CinematicState instance
 * @param {function} opts.mutate - (fn: state => state) => void
 */
export function showImportDialog({ state, mutate }) {
	new Dialog({
		title: "Import Cinematic JSON",
		content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">Paste cinematic JSON data below. This will replace the current editor state.</p>
			<textarea id="cinematic-import-json" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem" placeholder='{"version":3,"cinematics":{"default":{...}}}'></textarea>
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
						// Accept either v3 full or single cinematic
						if (parsed.cinematics) {
							mutate(() => new CinematicState(parsed));
						} else if (parsed.timeline !== undefined) {
							// Single cinematic data — wrap in v3
							const wrapped = { version: 3, cinematics: { [state.activeCinematicName]: parsed } };
							mutate(() => new CinematicState(wrapped, { cinematicName: state.activeCinematicName }));
						} else {
							throw new Error("Expected v3 wrapper or single cinematic with 'timeline'");
						}
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

/**
 * Show the Edit Setup/Landing JSON dialog.
 * @param {"setup"|"landing"} key
 * @param {object} opts
 * @param {object} opts.state - CinematicState instance
 * @param {function} opts.mutate - (fn: state => state) => void
 */
export function showEditJsonDialog(key, { state, mutate }) {
	const current = key === "setup" ? state.setup : state.landing;
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
							mutate((s) => s.setSetup(parsed));
						} else {
							mutate((s) => s.setLanding(parsed));
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

/**
 * Show the Edit Step State (before/after) JSON dialog.
 * @param {"before"|"after"} key
 * @param {object} opts
 * @param {string} opts.selectedPath
 * @param {object} opts.state - CinematicState instance
 * @param {function} opts.mutate - (fn: state => state) => void
 */
export function showEditStepStateDialog(key, { selectedPath, state, mutate }) {
	const entry = getEntryAtPath(selectedPath, state);
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
						const p = parseEntryPath(selectedPath);
						if (p?.type === "timeline") {
							mutate((s) => s.updateEntry(p.index, { [key]: parsed }));
						} else if (p?.type === "branch") {
							mutate((s) => s.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { [key]: parsed }));
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

/**
 * Show the Edit Parallel JSON dialog.
 * @param {object} opts
 * @param {string} opts.selectedPath
 * @param {object} opts.state - CinematicState instance
 * @param {function} opts.mutate - (fn: state => state) => void
 */
export function showEditParallelJsonDialog({ selectedPath, state, mutate }) {
	const parsed = parseEntryPath(selectedPath);
	if (!parsed || parsed.type !== "timeline") return;
	const entry = state.timeline[parsed.index];
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
						mutate((s) => s.updateEntry(parsed.index, {
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
