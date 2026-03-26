import { isTokenOccluderActive } from "./flag-utils.js";

const MODULE_ID = "eidolon-utilities";
const REFRESH_VISIBILITY_PATCH = Symbol("eidolonTokenOccluderRefreshVisibilityPatch");

let activeWallCache = null;
let debugEnabled = false;
let visibilityCheckCount = 0;

/**
 * Clear cached wall state so the next visibility check re-reads scene data.
 */
export function invalidateTokenOccluderCache() {
	activeWallCache = null;
}

/**
 * Ask Foundry to recompute token visibility.
 */
export function refreshTokenOccluders() {
	invalidateTokenOccluderCache();
	canvas?.perception?.update?.({ refreshVisibility: true });
}

export function setTokenOccluderDebug(enabled) {
	debugEnabled = !!enabled;
	console.info(`[eidolon-utilities] Token occluder debug ${debugEnabled ? "enabled" : "disabled"}.`);
	return debugEnabled;
}

export function getTokenOccluderDebugState() {
	return {
		debugEnabled,
		visibilityCheckCount,
		activeWallIds: getActiveOccluderWalls().map((wall) => wall.document.id),
		visionSourceIds: getVisionSources().map((source) => source.object?.id).filter(Boolean),
	};
}

/**
 * Patch the token visibility getter so flagged walls can suppress token
 * rendering without affecting LOS, fog, or lighting.
 */
export function patchTokenVisibilityGetter() {
	const owner = findRefreshVisibilityOwner();
	if (!owner) return false;
	if (owner[REFRESH_VISIBILITY_PATCH]) return true;

	const wrapper = function tokenOccluderRefreshVisibility(wrapped, ...args) {
		wrapped(...args);
		applyTokenOccluderVisibility(this);
	};

	if (game.modules.get("lib-wrapper")?.active && globalThis.libWrapper) {
		libWrapper.register(MODULE_ID, "Token.prototype._refreshVisibility", wrapper, "WRAPPER");
		owner[REFRESH_VISIBILITY_PATCH] = { mode: "libWrapper" };
		return true;
	}

	const original = owner._refreshVisibility;
	owner._refreshVisibility = function patchedTokenOccluderRefreshVisibility(...args) {
		original.apply(this, args);
		applyTokenOccluderVisibility(this);
	};
	owner[REFRESH_VISIBILITY_PATCH] = { mode: "direct", original };
	return true;
}

export function getOriginalTokenVisibility(token) {
	return token?.isVisible ?? null;
}

function findRefreshVisibilityOwner() {
	let proto = CONFIG?.Token?.objectClass?.prototype;
	while (proto) {
		if (typeof proto._refreshVisibility === "function") return proto;
		proto = Object.getPrototypeOf(proto);
	}
	return null;
}

function applyTokenOccluderVisibility(token) {
	visibilityCheckCount += 1;
	const coreVisible = token?.visible ?? false;
	if (!coreVisible) {
		if (debugEnabled) {
			logVisibilityCheck(token, false, {
				occluded: false,
				reason: "core-hidden",
				visionSourceCount: 0,
				wallCount: 0,
				viewers: [],
			});
		}
		return;
	}

	const occlusion = evaluateTokenOcclusion(token);
	if (debugEnabled) logVisibilityCheck(token, coreVisible, occlusion);
	if (!occlusion.occluded) return;

	const wasVisible = token.visible;
	token.visible = false;
	if (token.mesh) token.mesh.visible = false;
	if (token.visible !== wasVisible) MouseInteractionManager.emulateMoveEvent();
	if (token.layer?.occlusionMode === CONST.TOKEN_OCCLUSION_MODES.VISIBLE) {
		canvas.perception.update({ refreshOcclusion: true });
	}
}

export function evaluateTokenOcclusion(token) {
	if (!canvas?.ready) {
		return { occluded: false, reason: "canvas-not-ready", visionSourceCount: 0, wallCount: 0, viewers: [] };
	}

	const visionSources = getVisionSources();
	if (visionSources.length === 0) {
		return { occluded: false, reason: "no-vision-sources", visionSourceCount: 0, wallCount: 0, viewers: [] };
	}

	const viewerIds = new Set(visionSources.map((source) => source.object?.id).filter(Boolean));
	if (viewerIds.has(token.id)) {
		return { occluded: false, reason: "token-is-vision-source", visionSourceCount: visionSources.length, wallCount: 0, viewers: [] };
	}

	const occluderWalls = getActiveOccluderWalls();
	if (occluderWalls.length === 0) {
		return { occluded: false, reason: "no-active-occluder-walls", visionSourceCount: visionSources.length, wallCount: 0, viewers: [] };
	}

	const target = getTokenCenter(token);
	const targetPoints = getTokenTestPoints(token);
	const viewers = [];
	for (const source of visionSources) {
		if (source.object?.id === token.id) {
			return { occluded: false, reason: "token-is-vision-source", visionSourceCount: visionSources.length, wallCount: occluderWalls.length, viewers };
		}

		const sourcePoint = { x: source.x, y: source.y };
		const viewerResult = {
			viewerTokenId: source.object?.id ?? null,
			viewerTokenName: source.object?.name ?? null,
			sourcePoint,
			blocked: true,
			visibleSampleIndex: null,
			visibleSamplePoint: null,
			sampleChecks: [],
		};

		for (const [sampleIndex, samplePoint] of targetPoints.entries()) {
			const sampleResult = {
				sampleIndex,
				targetPoint: samplePoint,
				blocked: false,
				blockingWallId: null,
				wallChecks: [],
			};

			for (const wall of occluderWalls) {
				const check = inspectWallIntersection(wall, sourcePoint, samplePoint);
				sampleResult.wallChecks.push(check);
				if (check.blocks) {
					sampleResult.blocked = true;
					sampleResult.blockingWallId = check.wallId;
					break;
				}
			}

			viewerResult.sampleChecks.push(sampleResult);
			if (!sampleResult.blocked) {
				viewerResult.blocked = false;
				viewerResult.visibleSampleIndex = sampleIndex;
				viewerResult.visibleSamplePoint = samplePoint;
				break;
			}
		}

		viewers.push(viewerResult);
		if (!viewerResult.blocked) {
			return {
				occluded: false,
				reason: "visible-to-at-least-one-viewer",
				visionSourceCount: visionSources.length,
				wallCount: occluderWalls.length,
				target,
				targetPoints,
				viewers,
			};
		}
	}

	return {
		occluded: true,
		reason: "blocked-for-all-viewers",
		visionSourceCount: visionSources.length,
		wallCount: occluderWalls.length,
		target,
		targetPoints,
		viewers,
	};
}

function getVisionSources() {
	const sources = canvas?.effects?.visionSources;
	if (!sources?.size) return [];
	return Array.from(sources.values()).filter((source) => source?.active && source?.object);
}

function getActiveOccluderWalls() {
	const sceneId = canvas?.scene?.id ?? null;
	if (activeWallCache?.sceneId === sceneId) return activeWallCache.walls;

	const walls = (canvas?.walls?.placeables ?? []).filter((wall) => isTokenOccluderActive(wall.document));
	activeWallCache = { sceneId, walls };
	return walls;
}

function getTokenCenter(token) {
	if (token?.center) return token.center;
	return {
		x: token.x + (token.w / 2),
		y: token.y + (token.h / 2),
	};
}

export function getTokenTestPoints(token) {
	const center = getTokenCenter(token);
	const width = Number(token?.w ?? 0);
	const height = Number(token?.h ?? 0);
	if (!(width > 0) || !(height > 0)) return [center];

	const insetX = Math.max(Math.min(width * 0.25, width / 2), 1);
	const insetY = Math.max(Math.min(height * 0.25, height / 2), 1);
	const left = token.x + insetX;
	const right = token.x + width - insetX;
	const top = token.y + insetY;
	const bottom = token.y + height - insetY;

	return dedupePoints([
		center,
		{ x: left, y: top },
		{ x: right, y: top },
		{ x: left, y: bottom },
		{ x: right, y: bottom },
	]);
}

/**
 * Check whether a wall intersects and blocks a source->target segment.
 *
 * @param {object} wallPlaceable
 * @param {{ x: number, y: number }} source
 * @param {{ x: number, y: number }} target
 * @returns {boolean}
 */
export function wallBlocksSegment(wallPlaceable, source, target) {
	return inspectWallIntersection(wallPlaceable, source, target).blocks;
}

export function inspectWallIntersection(wallPlaceable, source, target) {
	const coords = wallPlaceable?.document?.c ?? wallPlaceable?.coords ?? wallPlaceable?.c;
	const wallId = wallPlaceable?.document?.id ?? wallPlaceable?.id ?? null;
	const edge = wallPlaceable?.edge ?? wallPlaceable?.document?.object?.edge ?? null;
	if (!Array.isArray(coords) || coords.length !== 4) {
		return { wallId, blocks: false, reason: "invalid-coords", intersectionRatio: null, directionalAllows: null, coords: null };
	}

	const intersection = getWallIntersection(edge, source, target, coords);
	if (!intersection) {
		return { wallId, blocks: false, reason: "no-segment-intersection", intersectionRatio: null, directionalAllows: null, coords };
	}
	const ratio = intersection.t1 ?? null;

	const rayLike = { angle: Math.atan2(target.y - source.y, target.x - source.x) };
	if (typeof wallPlaceable?.canRayIntersect === "function") {
		const directionalAllows = wallPlaceable.canRayIntersect(rayLike);
		return {
			wallId,
			blocks: directionalAllows,
			reason: directionalAllows ? "intersects-and-direction-allows" : "intersects-but-direction-blocks",
			intersectionRatio: ratio,
			directionalAllows,
			coords,
			rayAngle: rayLike.angle,
		};
	}

	return {
		wallId,
		blocks: true,
		reason: "intersects-no-direction-check",
		intersectionRatio: ratio,
		directionalAllows: null,
		coords,
		rayAngle: rayLike.angle,
	};
}

function getWallIntersection(edge, source, target, coords) {
	const EdgeClass = foundry?.canvas?.edges?.Edge;
	const VertexClass = foundry?.canvas?.edges?.PolygonVertex;
	if (edge && EdgeClass && VertexClass?.fromPoint) {
		const rayEdge = new EdgeClass(
			VertexClass.fromPoint(source),
			VertexClass.fromPoint(target),
			{ type: "sight" },
		);
		return edge.getIntersection(rayEdge) ?? null;
	}

	return foundry?.utils?.lineLineIntersection?.(
		{ x: coords[0], y: coords[1] },
		{ x: coords[2], y: coords[3] },
		source,
		target,
		{ t1: true },
	) ?? null;
}

function dedupePoints(points) {
	const seen = new Set();
	const deduped = [];
	for (const point of points) {
		const key = `${Math.round(point.x * 1000)}:${Math.round(point.y * 1000)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(point);
	}
	return deduped;
}

function logVisibilityCheck(token, coreVisible, occlusion) {
	const tokenId = token?.document?.id ?? token?.id ?? "unknown-token";
	console.groupCollapsed(
		`[eidolon-utilities] token-occluder visibility ${token.name ?? tokenId}`,
	);
	console.log({
		check: visibilityCheckCount,
		tokenId,
		coreVisible,
		finalVisible: !occlusion.occluded,
		occlusion,
	});
	console.groupEnd();
}

export function debugSelectedTokenOccluders({ log = true } = {}) {
	const selectedTokens = canvas?.tokens?.controlled ?? [];
	const selectedWalls = canvas?.walls?.controlled ?? [];
	const report = {
		selectedTokenIds: selectedTokens.map((token) => token.document.id),
		selectedWallIds: selectedWalls.map((wall) => wall.document.id),
		activeOccluderWallIds: getActiveOccluderWalls().map((wall) => wall.document.id),
		visionSourceIds: getVisionSources().map((source) => source.object?.id).filter(Boolean),
		tokens: selectedTokens.map((token) => ({
			tokenId: token.document.id,
			name: token.name,
			center: getTokenCenter(token),
			coreVisible: getOriginalTokenVisibility(token),
			isVisible: token.isVisible,
			occlusion: evaluateTokenOcclusion(token),
		})),
	};

	if (log) {
		console.group(`[eidolon-utilities] token-occluder debugSelectedTokenOccluders`);
		console.dir(report);
		console.groupEnd();
	}

	return report;
}
