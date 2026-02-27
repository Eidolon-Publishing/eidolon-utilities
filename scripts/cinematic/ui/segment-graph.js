// ── Segment graph: pure functions for segment flow geometry computation ────────

import {
	SEGMENT_NODE_MIN_WIDTH, SEGMENT_EDGE_WIDTH,
	SEGMENT_GRAPH_HEIGHT, SEGMENT_GRAPH_PADDING,
} from "./editor-constants.js";
import { computeTotalDuration } from "./swimlane-layout.js";

/**
 * Format duration in ms to a human-readable label.
 * @param {number} ms
 * @returns {string}
 */
function formatDuration(ms) {
	if (ms <= 0) return "0s";
	if (ms < 1000) return `${ms}ms`;
	const s = ms / 1000;
	return s % 1 === 0 ? `${s}s` : `${s.toFixed(1)}s`;
}

/**
 * Compute the segment graph geometry from cinematic state.
 *
 * Walks the graph from `entry` following `next` edges, collecting orphans.
 * Returns node and edge data for rendering.
 *
 * @param {object} state  CinematicState instance
 * @param {string} activeSegmentName  Currently selected segment
 * @returns {{ nodes: Array, edges: Array, totalWidthPx: number }}
 */
export function computeSegmentGraph(state, activeSegmentName) {
	const segments = state.segments ?? {};
	const entryName = state.entry ?? "main";
	const segmentNames = Object.keys(segments);

	if (segmentNames.length === 0) {
		return { nodes: [], edges: [], totalWidthPx: 0 };
	}

	// Walk graph from entry following next edges
	const visited = new Set();
	const orderedNames = [];
	let current = entryName;
	while (current && typeof current === "string" && segments[current]) {
		if (visited.has(current)) break; // cycle
		visited.add(current);
		orderedNames.push(current);
		current = segments[current].next;
	}

	// Collect orphans (segments not reachable from entry)
	for (const name of segmentNames) {
		if (!visited.has(name)) {
			orderedNames.push(name);
		}
	}

	// Compute nodes
	const nodes = [];
	let cursorPx = SEGMENT_GRAPH_PADDING;

	for (const name of orderedNames) {
		const seg = segments[name];
		const durationMs = computeTotalDuration(seg.timeline ?? []);
		const durationLabel = formatDuration(durationMs);
		const isEntry = name === entryName;
		const isActive = name === activeSegmentName;
		const isOrphan = !visited.has(name);

		const widthPx = SEGMENT_NODE_MIN_WIDTH;

		nodes.push({
			name,
			durationMs,
			durationLabel,
			isEntry,
			isActive,
			isOrphan,
			leftPx: cursorPx,
			widthPx,
			hasGate: !!seg.gate,
			gateEvent: seg.gate?.event ?? null,
		});

		cursorPx += widthPx + SEGMENT_EDGE_WIDTH;
	}

	// Compute edges
	const edges = [];
	const nodeMap = new Map(nodes.map((n) => [n.name, n]));

	for (const name of orderedNames) {
		const seg = segments[name];
		if (!seg.next) continue;

		const nextName = typeof seg.next === "string" ? seg.next : seg.next?.segment;
		if (!nextName) continue;

		const fromNode = nodeMap.get(name);
		const toNode = nodeMap.get(nextName);
		if (!fromNode || !toNode) continue;

		// Gate label from the target segment
		const targetSeg = segments[nextName];
		const gateLabel = targetSeg?.gate?.event ?? null;
		const isCrossScene = typeof seg.next === "object" && seg.next?.scene;

		edges.push({
			fromName: name,
			toName: nextName,
			gateLabel,
			isCrossScene,
			fromRightPx: fromNode.leftPx + fromNode.widthPx,
			toLeftPx: toNode.leftPx,
		});
	}

	const totalWidthPx = cursorPx - SEGMENT_EDGE_WIDTH + SEGMENT_GRAPH_PADDING;

	return { nodes, edges, totalWidthPx };
}
