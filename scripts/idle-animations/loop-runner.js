import { getTweenType } from "../tween/core/registry.js";

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "idle-animation";

/** @type {Map<string, { controller: AbortController, restore: () => void }>} */
const activeLoops = new Map();

// ── Config helpers ──────────────────────────────────────────────────

function isValidTilePropConfig(c) {
	return (
		typeof c.attribute === "string" &&
		typeof c.from === "number" &&
		typeof c.to === "number" &&
		typeof c.period === "number" &&
		c.period > 0
	);
}

function isValidTileTintConfig(c) {
	return (
		typeof c.fromColor === "string" &&
		typeof c.toColor === "string" &&
		typeof c.period === "number" &&
		c.period > 0
	);
}

function isValidTileScaleConfig(c) {
	return (
		typeof c.fromScale === "number" &&
		typeof c.toScale === "number" &&
		c.fromScale > 0 &&
		c.toScale > 0 &&
		typeof c.period === "number" &&
		c.period > 0
	);
}

function isValidConfig(c) {
	if (!c || typeof c !== "object") return false;
	const type = c.type ?? "tile-prop";
	if (type === "tile-tint") return isValidTileTintConfig(c);
	if (type === "tile-scale") return isValidTileScaleConfig(c);
	return isValidTilePropConfig(c);
}

export function getIdleAnimationConfigs(doc) {
	const raw = doc?.getFlag?.(MODULE_ID, FLAG_KEY);
	if (!raw) return [];

	let entries;
	if (Array.isArray(raw)) {
		entries = raw;
	} else if (typeof raw === "object" && "0" in raw) {
		entries = Object.values(raw);
	} else if (typeof raw === "object" && isValidConfig(raw)) {
		return [raw];
	} else {
		return [];
	}

	return entries.filter(isValidConfig);
}

// ── Loop key helpers ────────────────────────────────────────────────

function loopKey(tileId, config) {
	const type = config.type ?? "tile-prop";
	if (type === "tile-tint") return `${tileId}::tint`;
	if (type === "tile-scale") return `${tileId}::scale`;
	return `${tileId}::${config.attribute}`;
}

// ── Type-aware param builder ────────────────────────────────────────

function buildExecuteParams(uuid, config, forward, refGeometry) {
	if (config.type === "tile-tint") {
		return { uuid, toColor: forward ? config.toColor : config.fromColor, mode: config.mode };
	}
	if (config.type === "tile-scale") {
		return {
			uuid,
			toScale: forward ? config.toScale : config.fromScale,
			...refGeometry,
		};
	}
	return { uuid, attribute: config.attribute, value: forward ? config.to : config.from };
}

// ── Loop lifecycle ──────────────────────────────────────────────────

export function startLoop(tile, config) {
	const doc = tile?.document;
	if (!doc) return;

	const tileId = doc.id;
	const key = loopKey(tileId, config);

	stopLoopByKey(key);

	const type = config.type ?? "tile-prop";
	const tweenDef = getTweenType(type);
	if (!tweenDef) {
		console.warn(`[${MODULE_ID}] idle-animation: unknown tween type "${type}"`);
		return;
	}

	const controller = new AbortController();
	let restore;
	let refGeometry = null;

	if (type === "tile-tint") {
		const originalTint = doc._source?.texture?.tint ?? "#ffffff";
		restore = () => {
			const d = canvas.scene?.tiles?.get(tileId);
			if (d) {
				d.updateSource({ texture: { tint: originalTint } });
				d.object?.refresh();
			}
		};
		doc.updateSource({ texture: { tint: config.fromColor } });
		tile.refresh();
	} else if (type === "tile-scale") {
		const origW = doc._source.width;
		const origH = doc._source.height;
		const origX = doc._source.x;
		const origY = doc._source.y;
		refGeometry = {
			baseWidth: origW,
			baseHeight: origH,
			centerX: origX + origW / 2,
			centerY: origY + origH / 2,
		};

		restore = () => {
			const d = canvas.scene?.tiles?.get(tileId);
			if (d) {
				d.updateSource({ width: origW, height: origH, x: origX, y: origY });
				d.object?.refresh();
			}
		};

		const startW = origW * config.fromScale;
		const startH = origH * config.fromScale;
		const startX = refGeometry.centerX - startW / 2;
		const startY = refGeometry.centerY - startH / 2;
		doc.updateSource({ width: startW, height: startH, x: startX, y: startY });
		tile.refresh();
	} else {
		const originalValue = foundry.utils.getProperty(doc._source, config.attribute);
		if (typeof originalValue !== "number") {
			console.warn(`[${MODULE_ID}] idle-animation: attribute "${config.attribute}" is not a number on tile ${tileId}`);
			return;
		}
		restore = () => {
			const d = canvas.scene?.tiles?.get(tileId);
			if (d) {
				d.updateSource(foundry.utils.expandObject({ [config.attribute]: originalValue }));
				d.object?.refresh();
			}
		};
		doc.updateSource(foundry.utils.expandObject({ [config.attribute]: config.from }));
		tile.refresh();
	}

	activeLoops.set(key, { controller, restore });

	const uuid = doc.uuid;
	const halfPeriod = config.period / 2;
	const easing = config.easing ?? "easeInOutCosine";

	(async () => {
		const { signal } = controller;

		while (!signal.aborted) {
			const fwd = await tweenDef.execute(
				buildExecuteParams(uuid, config, true, refGeometry),
				{ durationMS: halfPeriod, easing, commit: false, signal }
			);
			if (fwd === false || signal.aborted) break;

			const rev = await tweenDef.execute(
				buildExecuteParams(uuid, config, false, refGeometry),
				{ durationMS: halfPeriod, easing, commit: false, signal }
			);
			if (rev === false || signal.aborted) break;
		}
	})();
}

function stopLoopByKey(key) {
	const entry = activeLoops.get(key);
	if (!entry) return;
	entry.controller.abort();
	activeLoops.delete(key);
	entry.restore();
}

export function stopLoopsForTile(tileId) {
	const prefix = `${tileId}::`;
	for (const key of [...activeLoops.keys()]) {
		if (key.startsWith(prefix)) {
			stopLoopByKey(key);
		}
	}
}

export function startAllLoops(tile, configs) {
	if (!tile?.document) return;
	stopLoopsForTile(tile.document.id);
	for (const config of configs) {
		startLoop(tile, config);
	}
}

export function stopAllLoops() {
	for (const key of [...activeLoops.keys()]) {
		stopLoopByKey(key);
	}
}

export function isLooping(tileId) {
	const prefix = `${tileId}::`;
	for (const key of activeLoops.keys()) {
		if (key.startsWith(prefix)) return true;
	}
	return false;
}
