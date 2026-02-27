// ── Swimlane layout: pure functions for timeline geometry computation ─────────

import {
	LANE_HEIGHT, RULER_HEIGHT, SETUP_WIDTH, LANDING_WIDTH,
	FIXED_BLOCK_WIDTH, MARKER_WIDTH, GATE_WIDTH,
	MIN_STEP_WIDTH, MIN_DELAY_WIDTH,
} from "./editor-constants.js";

// ── Duration helpers ─────────────────────────────────────────────────────────

function computeStepDurations(entry) {
	return { stepDuration: Math.max(500, entry.duration ?? 500), detachOverflow: 0 };
}

function computeParallelDuration(entry) {
	const branches = entry.parallel?.branches ?? [];
	let maxDuration = 0;
	for (const branch of branches) {
		let branchDuration = 0;
		for (const be of branch) {
			if (be.delay != null) branchDuration += be.delay;
			else if (be.await != null) { /* gate, +0 */ }
			else if (be.emit != null) { /* instant, +0 */ }
			else if (be.sound != null) branchDuration += (be.sound.fireAndForget ? 0 : (be.sound.duration ?? 0));
			else if (be.stopSound != null) { /* +0 */ }
			else branchDuration += computeStepDurations(be).stepDuration;
		}
		maxDuration = Math.max(maxDuration, branchDuration);
	}
	return Math.max(500, maxDuration);
}

export function computeTotalDuration(timeline) {
	return timeline.reduce((sum, entry) => {
		if (entry.delay != null) return sum + entry.delay;
		if (entry.await != null) return sum;
		if (entry.emit != null) return sum; // instant, +0
		if (entry.transitionTo != null) return sum; // terminal, +0
		if (entry.sound != null) return sum + (entry.sound.fireAndForget ? 0 : (entry.sound.duration ?? 0));
		if (entry.stopSound != null) return sum; // instant, +0
		if (entry.parallel != null) return sum + computeParallelDuration(entry);
		return sum + computeStepDurations(entry).stepDuration;
	}, 0);
}

function computeScale(totalDurationMs, availableWidth) {
	if (totalDurationMs <= 0) return 0.1;
	const scale = availableWidth / totalDurationMs;
	return Math.max(0.03, Math.min(0.5, scale));
}

// ── Label helper ─────────────────────────────────────────────────────────────

function deriveStepLabel(entry) {
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

// ── Branch lane computation ──────────────────────────────────────────────────

function computeBranchLane(branch, startPx, scale, pathPrefix, selectedPath) {
	const blocks = [];
	const emits = [];
	const awaits = [];
	let cursorPx = startPx;

	for (let k = 0; k < branch.length; k++) {
		const be = branch[k];
		const entryPath = `${pathPrefix}.${k}`;
		const isSelected = selectedPath === entryPath;

		if (be.delay != null) {
			const w = Math.max(MIN_DELAY_WIDTH, be.delay * scale);
			blocks.push({ type: "delay", leftPx: cursorPx, widthPx: w, label: `${be.delay}ms`, entryPath, selected: isSelected });
			cursorPx += w;
		} else if (be.await != null) {
			const awaitEvent = be.await?.event ?? "click";
			const gateIcon = awaitEvent === "tile-click" ? "fa-hand-pointer"
				: awaitEvent === "signal" ? "fa-bolt"
				: "fa-pause";
			blocks.push({ type: "await", leftPx: cursorPx, widthPx: GATE_WIDTH, label: awaitEvent, entryPath, selected: isSelected, isGate: true, gateIcon });
			if (be.await?.event === "signal") {
				awaits.push({ signal: be.await.signal, centerPx: cursorPx + GATE_WIDTH / 2 });
			}
			cursorPx += GATE_WIDTH;
		} else if (be.emit != null) {
			blocks.push({ type: "emit", leftPx: cursorPx, widthPx: MARKER_WIDTH, label: "emit", entryPath, selected: isSelected, isMarker: true });
			emits.push({ signal: be.emit, centerPx: cursorPx + MARKER_WIDTH / 2 });
			// instant — don't advance cursor
		} else if (be.sound != null) {
			const filename = (be.sound.src || "").split("/").pop() || "Sound";
			const soundDur = be.sound.duration ?? 0;
			const fireAndForget = be.sound.fireAndForget ?? false;

			if (fireAndForget) {
				// Marker — don't advance branch cursor
				blocks.push({ type: "sound", leftPx: cursorPx, widthPx: MARKER_WIDTH, label: filename, entryPath, selected: isSelected, isMarker: true });
			} else {
				const soundW = soundDur > 0 ? Math.max(FIXED_BLOCK_WIDTH, soundDur * scale) : FIXED_BLOCK_WIDTH;
				const hasTrailingArrow = (be.sound.loop ?? false) && soundDur <= 0;
				blocks.push({ type: "sound", leftPx: cursorPx, widthPx: soundW, label: filename, entryPath, selected: isSelected, hasTrailingArrow });
				cursorPx += soundW;
			}
		} else if (be.stopSound != null) {
			blocks.push({ type: "stopSound", leftPx: cursorPx, widthPx: MARKER_WIDTH, label: "Stop", entryPath, selected: isSelected, isMarker: true });
			// instant — don't advance cursor
		} else {
			const { stepDuration } = computeStepDurations(be);
			const w = Math.max(MIN_STEP_WIDTH, stepDuration * scale);
			const label = deriveStepLabel(be);
			blocks.push({ type: "step", leftPx: cursorPx, widthPx: w, label, entryPath, selected: isSelected });
			cursorPx += w;
		}
	}

	return { blocks, width: cursorPx - startPx, emits, awaits };
}

// ── Signal arcs ──────────────────────────────────────────────────────────────

function laneIndexToY(laneIndex) {
	return RULER_HEIGHT + laneIndex * LANE_HEIGHT;
}

function computeSignalArcs(signals, subLaneCount) {
	const arcs = [];

	for (const emit of signals.emits) {
		for (const await_ of signals.awaits) {
			if (emit.signal !== await_.signal) continue;

			const x1 = emit.centerPx;
			const y1 = laneIndexToY(emit.laneIndex) + LANE_HEIGHT / 2;
			const x2 = await_.centerPx;
			const y2 = laneIndexToY(await_.laneIndex) + LANE_HEIGHT / 2;

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

// ── Time markers ─────────────────────────────────────────────────────────────

function computeTimeMarkers(totalDurationMs, scale) {
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

// ── Insertion points ─────────────────────────────────────────────────────────

function computeInsertionPoints(mainBlocks) {
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

// ── Main entry point ─────────────────────────────────────────────────────────

/**
 * Compute complete swimlane geometry from timeline data.
 * @param {Array} timeline - The timeline entries array
 * @param {object} opts
 * @param {string|null} opts.selectedPath - Currently selected entry path
 * @param {number} opts.windowWidth - Available width for scaling
 * @returns {object} { mainBlocks, subLanes, signalArcs, fafConnectors, timeMarkers, insertionPoints, totalWidthPx, swimlaneHeightPx, totalDurationMs }
 */
export function computeLanes(timeline, { selectedPath, windowWidth }) {
	const totalDurationMs = computeTotalDuration(timeline);
	const availableWidth = windowWidth - 70 - 100;
	const scale = computeScale(totalDurationMs, availableWidth);

	const mainBlocks = [];
	const subLaneGroups = [];
	const signals = { emits: [], awaits: [] };

	// Shared F&F sound lanes — pack sounds into fewest lanes, only split on overlap
	const fafLanes = []; // Array of { label, blocks, rightEdgePx }

	// Setup bookend
	mainBlocks.push({
		type: "setup", leftPx: 0, widthPx: SETUP_WIDTH,
		label: "Setup", entryPath: "setup",
		selected: selectedPath === "setup",
	});
	let cursorPx = SETUP_WIDTH;

	for (let i = 0; i < timeline.length; i++) {
		const entry = timeline[i];
		const entryPath = `timeline.${i}`;
		const isSelected = selectedPath === entryPath;

		if (entry.delay != null) {
			const w = Math.max(MIN_DELAY_WIDTH, entry.delay * scale);
			mainBlocks.push({
				type: "delay", leftPx: cursorPx, widthPx: w,
				label: `${entry.delay}ms`, entryPath, selected: isSelected,
			});
			cursorPx += w;
		} else if (entry.emit != null) {
			mainBlocks.push({
				type: "emit", leftPx: cursorPx, widthPx: MARKER_WIDTH,
				label: `Emit`, entryPath, selected: isSelected, isMarker: true,
			});
			signals.emits.push({
				signal: entry.emit,
				centerPx: cursorPx + MARKER_WIDTH / 2,
				laneIndex: 0,
			});
			// instant — don't advance cursor
		} else if (entry.sound != null) {
			const filename = (entry.sound.src || "").split("/").pop() || "Sound";
			const soundDur = entry.sound.duration ?? 0;
			const fireAndForget = entry.sound.fireAndForget ?? false;

			if (fireAndForget) {
				// No block on main lane — pack into shared F&F sub-lanes
				const soundW = soundDur > 0 ? Math.max(FIXED_BLOCK_WIDTH, soundDur * scale) : FIXED_BLOCK_WIDTH;
				const hasTrailingArrow = (entry.sound.loop ?? false) && soundDur <= 0;
				const block = {
					type: "sound", leftPx: cursorPx, widthPx: soundW,
					label: filename, entryPath, selected: isSelected,
					hasTrailingArrow,
				};

				// Find first F&F lane with no overlap at cursorPx
				let packed = false;
				for (const lane of fafLanes) {
					if (lane.rightEdgePx <= cursorPx) {
						lane.blocks.push(block);
						lane.rightEdgePx = cursorPx + soundW;
						packed = true;
						break;
					}
				}
				if (!packed) {
					fafLanes.push({
						label: "♫ F&F",
						blocks: [block],
						rightEdgePx: cursorPx + soundW,
					});
				}
			} else {
				// Block on main lane — advances cursor
				const soundW = soundDur > 0 ? Math.max(FIXED_BLOCK_WIDTH, soundDur * scale) : FIXED_BLOCK_WIDTH;
				const hasTrailingArrow = (entry.sound.loop ?? false) && soundDur <= 0;
				mainBlocks.push({
					type: "sound", leftPx: cursorPx, widthPx: soundW,
					label: filename, entryPath, selected: isSelected,
					hasTrailingArrow,
				});
				cursorPx += soundW;
			}
		} else if (entry.stopSound != null) {
			mainBlocks.push({
				type: "stopSound", leftPx: cursorPx, widthPx: MARKER_WIDTH,
				label: `Stop`, entryPath, selected: isSelected, isMarker: true,
			});
			// instant — don't advance cursor
		} else if (entry.parallel != null) {
			const branches = entry.parallel.branches ?? [];
			const parallelStartPx = cursorPx;
			const branchLanes = [];

			let maxBranchWidth = 0;
			for (let bi = 0; bi < branches.length; bi++) {
				const pathPrefix = `timeline.${i}.parallel.branches.${bi}`;
				const { blocks, width, emits, awaits: branchAwaits } = computeBranchLane(branches[bi], parallelStartPx, scale, pathPrefix, selectedPath);
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
			const { stepDuration } = computeStepDurations(entry);
			const stepW = Math.max(MIN_STEP_WIDTH, stepDuration * scale);
			const label = deriveStepLabel(entry);

			mainBlocks.push({
				type: "step", leftPx: cursorPx, widthPx: stepW,
				label, entryPath, selected: isSelected,
			});
			cursorPx += stepW;
		}
	}

	// Landing bookend
	mainBlocks.push({
		type: "landing", leftPx: cursorPx, widthPx: LANDING_WIDTH,
		label: "Landing", entryPath: "landing",
		selected: selectedPath === "landing",
	});
	cursorPx += LANDING_WIDTH;

	// Flatten sub-lanes for rendering: parallel branches first, then shared F&F lanes
	const subLanes = subLaneGroups.flatMap((g) => g.lanes);
	const fafLaneStartIndex = subLanes.length;
	for (const lane of fafLanes) {
		subLanes.push({ label: lane.label, blocks: lane.blocks });
	}

	// Compute signal arcs
	const signalArcs = computeSignalArcs(signals, subLanes.length);

	// Compute F&F connector lines (vertical dashed lines from main lane to sub-lane)
	const fafConnectors = [];
	for (let fi = 0; fi < fafLanes.length; fi++) {
		const laneIdx = fafLaneStartIndex + fi;
		for (const block of fafLanes[fi].blocks) {
			const x = block.leftPx;
			const y1 = RULER_HEIGHT + LANE_HEIGHT; // bottom of main lane
			const y2 = RULER_HEIGHT + (1 + laneIdx) * LANE_HEIGHT + LANE_HEIGHT / 2; // center of target sub-lane
			fafConnectors.push({ x, y1, y2 });
		}
	}

	// Compute time markers
	const timeMarkers = computeTimeMarkers(totalDurationMs, scale);

	// Compute insertion points
	const insertionPoints = computeInsertionPoints(mainBlocks);

	// Swimlane height: ruler + main lane + sub-lanes
	const swimlaneHeightPx = RULER_HEIGHT + (1 + subLanes.length) * LANE_HEIGHT;

	return {
		mainBlocks, subLanes, signalArcs, fafConnectors, timeMarkers, insertionPoints,
		totalWidthPx: Math.max(cursorPx, 200),
		swimlaneHeightPx,
		totalDurationMs,
	};
}
