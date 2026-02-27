// ── Detail panel builder and path utilities ──────────────────────────────────

import { TWEEN_TYPES, TWEEN_TYPE_DEFAULTS } from "./editor-constants.js";
import { listEasingNames } from "../../tween/core/easing.js";

// ── Path utilities ───────────────────────────────────────────────────────────

export function parseEntryPath(path) {
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

export function getEntryAtPath(path, state) {
	const parsed = parseEntryPath(path);
	if (!parsed) return null;
	if (parsed.type === "setup") return state.setup;
	if (parsed.type === "landing") return state.landing;
	if (parsed.type === "timeline") return state.timeline[parsed.index];
	if (parsed.type === "branch") {
		return state.timeline[parsed.index]?.parallel?.branches?.[parsed.branchIndex]?.[parsed.branchEntryIndex];
	}
	return null;
}

export function getTimelineIndexFromPath(path) {
	const parsed = parseEntryPath(path);
	if (!parsed || parsed.type !== "timeline") return null;
	return parsed.index;
}

// ── Unique target counter ────────────────────────────────────────────────────

export function countUniqueTargets(state) {
	const selectors = new Set();
	const data = state.data;
	const active = data.cinematics?.[state.activeCinematicName];
	if (!active) return 0;

	function collectFromTimeline(timeline) {
		for (const entry of timeline ?? []) {
			if (entry.tweens) {
				for (const tw of entry.tweens) {
					if (tw.target) selectors.add(tw.target);
				}
			}
			if (entry.before) for (const sel of Object.keys(entry.before)) selectors.add(sel);
			if (entry.after) for (const sel of Object.keys(entry.after)) selectors.add(sel);
			if (entry.parallel?.branches) {
				for (const branch of entry.parallel.branches) collectFromTimeline(branch);
			}
		}
	}

	if (active.segments) {
		// v4: walk all segments
		for (const seg of Object.values(active.segments)) {
			if (seg.setup) for (const sel of Object.keys(seg.setup)) selectors.add(sel);
			if (seg.landing) for (const sel of Object.keys(seg.landing)) selectors.add(sel);
			if (seg.gate?.target) selectors.add(seg.gate.target);
			collectFromTimeline(seg.timeline);
		}
	} else {
		// v3 flat
		if (active.setup) for (const sel of Object.keys(active.setup)) selectors.add(sel);
		if (active.landing) for (const sel of Object.keys(active.landing)) selectors.add(sel);
		collectFromTimeline(active.timeline);
	}
	return selectors.size;
}

// ── Detail builder ───────────────────────────────────────────────────────────

function stepNumberForPath(path, state) {
	const parsed = parseEntryPath(path);
	if (!parsed) return 0;

	if (parsed.type === "timeline") {
		let count = 0;
		for (let i = 0; i <= parsed.index; i++) {
			const e = state.timeline[i];
			if (e && e.delay == null && e.emit == null && e.parallel == null && e.sound == null && e.stopSound == null) count++;
		}
		return count;
	}

	if (parsed.type === "branch") {
		const branch = state.timeline[parsed.index]?.parallel?.branches?.[parsed.branchIndex] ?? [];
		let count = 0;
		for (let j = 0; j <= parsed.branchEntryIndex; j++) {
			const be = branch[j];
			if (be && be.delay == null && be.emit == null && be.sound == null && be.stopSound == null) count++;
		}
		return count;
	}
	return 0;
}

function buildSetupDetail(state) {
	return {
		isSetup: true,
		targetCount: Object.keys(state.setup ?? {}).length,
	};
}

function buildLandingDetail(state) {
	return {
		isLanding: true,
		targetCount: Object.keys(state.landing ?? {}).length,
	};
}

function buildDelayDetail(entry) {
	return { type: "delay", isDelay: true, delay: entry.delay };
}

function buildEmitDetail(entry) {
	return { type: "emit", isEmit: true, signal: entry.emit };
}

function buildSoundDetail(entry) {
	const filename = (entry.sound.src || "").split("/").pop() || "";
	return {
		type: "sound",
		isSound: true,
		soundSrc: entry.sound.src ?? "",
		soundFilename: filename,
		soundId: entry.sound.id ?? "",
		soundVolume: entry.sound.volume ?? 0.8,
		soundLoop: entry.sound.loop ?? false,
		soundFadeIn: entry.sound.fadeIn ?? "",
		soundFadeOut: entry.sound.fadeOut ?? "",
		soundDuration: entry.sound.duration ?? 0,
		soundFireAndForget: entry.sound.fireAndForget ?? false,
		soundModeForever: (entry.sound.loop ?? false) && !((entry.sound.duration ?? 0) > 0),
	};
}

function buildStopSoundDetail(entry) {
	return {
		type: "stopSound",
		isStopSound: true,
		stopSoundId: entry.stopSound,
	};
}

function buildParallelDetail(entry, state) {
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
			const isSound = be.sound != null;
			const isStopSound = be.stopSound != null;
			const isStep = !isDelay && !isAwait && !isEmit && !isSound && !isStopSound;
			let label, sub;
			if (isDelay) { label = `${be.delay}ms`; sub = "delay"; }
			else if (isAwait) { label = "Await"; sub = be.await?.event ?? "click"; }
			else if (isEmit) { label = "Emit"; sub = be.emit || "(unnamed)"; }
			else if (isSound) { label = "Sound"; sub = (be.sound.src || "").split("/").pop() || "(none)"; }
			else if (isStopSound) { label = "Stop Sound"; sub = be.stopSound || "(no id)"; }
			else { label = "Step"; sub = `${be.tweens?.length ?? 0} tweens`; }
			return { branchEntryIndex: bei, isDelay, isAwait, isEmit, isSound, isStopSound, isStep, label, sub };
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

function buildStepDetail(entry, path, expandedTweens, state) {
	const easingNames = listEasingNames();
	const tweens = (entry.tweens ?? []).map((tw, i) => {
		const tweenKey = `${path}.tweens.${i}`;
		const isExpanded = expandedTweens.has(tweenKey);
		const tweenType = tw.type ?? "tile-prop";
		const typeObj = TWEEN_TYPES.find((t) => t.value === tweenType);
		const typeDefaults = TWEEN_TYPE_DEFAULTS[tweenType];
		const formGroup = typeDefaults?.form ?? "prop";
		const colorMode = tw.mode ?? "oklch";

		return {
			tweenIndex: i,
			isExpanded,
			type: tweenType,
			typeLabel: typeObj?.label ?? tw.type ?? "Tile Prop",
			target: tw.target ?? "",
			attribute: tw.attribute ?? "",
			attributePlaceholder: typeDefaults?.placeholder ?? "",
			value: tw.value ?? "",
			easing: tw.easing ?? "",
			// Form group flags
			formGroup,
			formIsProp: formGroup === "prop",
			formIsParticles: formGroup === "particles",
			formIsCamera: formGroup === "camera",
			formIsLightColor: formGroup === "lightColor",
			formIsLightState: formGroup === "lightState",
			// Camera fields
			camX: tw.x ?? "",
			camY: tw.y ?? "",
			camScale: tw.scale ?? "",
			// Light-color fields
			toColor: tw.toColor ?? "#ffffff",
			toAlpha: tw.toAlpha ?? "",
			colorMode,
			colorModeIsOklch: colorMode === "oklch",
			colorModeIsHsl: colorMode === "hsl",
			colorModeIsRgb: colorMode === "rgb",
			// Light-state fields
			enabled: tw.enabled ?? true,
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

	const beforeKeys = Object.keys(entry.before ?? {});
	const afterKeys = Object.keys(entry.after ?? {});

	return {
		type: "step",
		isStep: true,
		isDelay: false,
		stepNumber: stepNumberForPath(path, state),
		stepDuration: entry.duration ?? 1000,
		tweens,
		beforeSummary: beforeKeys.length ? `${beforeKeys.length} target${beforeKeys.length !== 1 ? "s" : ""}` : "(none)",
		afterSummary: afterKeys.length ? `${afterKeys.length} target${afterKeys.length !== 1 ? "s" : ""}` : "(none)",
	};
}

/**
 * Build the detail context for a selected path.
 * @param {string} path - Entry path (e.g. "setup", "timeline.2", "timeline.0.parallel.branches.1.3")
 * @param {object} opts
 * @param {object} opts.state - CinematicState instance
 * @param {Set} opts.expandedTweens - Set of expanded tween keys
 * @returns {object|null}
 */
export function buildDetail(path, { state, expandedTweens }) {
	const parsed = parseEntryPath(path);
	if (!parsed) return null;

	if (parsed.type === "setup") return buildSetupDetail(state);
	if (parsed.type === "landing") return buildLandingDetail(state);

	const entry = getEntryAtPath(path, state);
	if (!entry) return null;

	if (entry.delay != null) return buildDelayDetail(entry);
	if (entry.emit != null) return buildEmitDetail(entry);
	if (entry.sound != null) return buildSoundDetail(entry);
	if (entry.stopSound != null) return buildStopSoundDetail(entry);
	if (entry.parallel != null && parsed.type === "timeline") return buildParallelDetail(entry, state);

	// Step (including branch entries that are steps)
	return buildStepDetail(entry, path, expandedTweens, state);
}
