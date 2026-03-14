/**
 * updateTiles orchestrator.
 *
 * Applies criteria-driven file selection to all tiles carrying
 * tile criteria flags on a scene.
 */
import { FLAG_TILE_CRITERIA, FLAG_TILE_FILE_INDEX, MODULE_ID } from "./constants.js";
import { getCollectionSize, nowMs } from "./utils.js";
import { getFilePath, normalizeFilePath } from "./tile-targets.js";
import { normalizeTileCriteria } from "./tile-criteria.js";
import { getCompiledTileMatcher, invalidateTileMatcherCache, selectTileFileIndexFromCompiled } from "./tile-matcher.js";
import { createDependencyIndexManager } from "./dependency-index.js";
import { updateDocumentsInChunks } from "./batch-updater.js";

const log = (...args) => console.log(`${MODULE_ID} | criteria tiles:`, ...args);

// ── Tile dependency index ──────────────────────────────────────────────────

const tileDeps = createDependencyIndexManager({
	label: "tile",
	extractKeys(tile) {
		const tileCriteria = tile.getFlag(MODULE_ID, FLAG_TILE_CRITERIA)
			?? tile.getFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
		if (!tileCriteria) return null;

		const normalized = normalizeTileCriteria(tileCriteria, { files: null });
		if (!normalized?.variants?.length) return [];

		const keys = [];
		for (const variant of normalized.variants) {
			for (const key of Object.keys(variant.criteria ?? {})) {
				if (key) keys.push(key);
			}
		}
		return keys;
	}
});

// ── Cache invalidation ─────────────────────────────────────────────────────

export function invalidateTileCriteriaCaches(scene = null, tile = null) {
	tileDeps.invalidate(scene ?? undefined);

	if (tile) {
		invalidateTileMatcherCache(tile);
	} else if (!scene) {
		invalidateTileMatcherCache(null);
	}
}

// ── Orchestrator ───────────────────────────────────────────────────────────

export async function updateTiles(state, scene, options = {}) {
	const start = nowMs();
	const metrics = {
		total: 0,
		scanned: 0,
		updated: 0,
		chunks: 0,
		skipped: {
			unaffected: 0,
			noCriteria: 0,
			noFiles: 0,
			noMatch: 0,
			unchanged: 0
		},
		durationMs: 0
	};

	scene = scene ?? game.scenes?.viewed;
	if (!scene) {
		metrics.durationMs = nowMs() - start;
		return metrics;
	}

	const collection = scene.getEmbeddedCollection("Tile") ?? [];
	metrics.total = getCollectionSize(collection);

	const tiles = tileDeps.getAffectedDocs(scene, collection, options.changedKeys);
	metrics.scanned = tiles.length;
	if (!tiles.length) {
		metrics.skipped.unaffected = metrics.total;
		metrics.durationMs = nowMs() - start;
		return metrics;
	}

	const tileUpdates = [];

	for (const tile of tiles) {
		const tileCriteria = tile.getFlag(MODULE_ID, FLAG_TILE_CRITERIA)
			?? tile.getFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
		if (!tileCriteria) {
			metrics.skipped.noCriteria += 1;
			continue;
		}

		const files = tile.getFlag("monks-active-tiles", "files");
		if (!files?.length) {
			metrics.skipped.noFiles += 1;
			continue;
		}

		const compiled = getCompiledTileMatcher(tile, tileCriteria, files);
		const matchIndex = selectTileFileIndexFromCompiled(compiled, state);
		if (!Number.isInteger(matchIndex) || matchIndex < 0 || matchIndex >= files.length) {
			console.warn(`${MODULE_ID} | Tile ${tile.id} has no valid file match for state`, state);
			metrics.skipped.noMatch += 1;
			continue;
		}

		const nextFileIndex = matchIndex;
		const currentFileIndex = Number(tile.getFlag("monks-active-tiles", "fileindex"));
		const shouldUpdateFileIndex = currentFileIndex !== nextFileIndex;

		const shouldUpdateSelection = files.some((file, index) => Boolean(file?.selected) !== (index === matchIndex));

		const currentTextureSrc = normalizeFilePath(tile.texture?.src ?? tile._source?.texture?.src ?? "");
		const nextTextureSrcRaw = getFilePath(files[matchIndex]);
		const nextTextureSrc = normalizeFilePath(nextTextureSrcRaw);
		const shouldUpdateTexture = Boolean(nextTextureSrc) && nextTextureSrc !== currentTextureSrc;

		if (!shouldUpdateSelection && !shouldUpdateFileIndex && !shouldUpdateTexture) {
			metrics.skipped.unchanged += 1;
			continue;
		}

		const update = {
			_id: tile._id
		};

		if (shouldUpdateSelection) {
			update["flags.monks-active-tiles.files"] = files.map((file, index) => ({
				...file,
				selected: index === matchIndex
			}));
		}

		if (shouldUpdateFileIndex) {
			update["flags.monks-active-tiles.fileindex"] = nextFileIndex;
		}

		if (shouldUpdateTexture) {
			update.texture = { src: nextTextureSrcRaw };
		}

		tileUpdates.push(update);

		log(`Tile ${tile.id} -> ${nextTextureSrcRaw}`);
	}

	if (tileUpdates.length > 0) {
		// Collect old texture sources before applying updates
		const previousTextureSources = new Map(); // normalizedPath -> rawPath
		const newTextureSources = [];
		for (const update of tileUpdates) {
			if (update.texture?.src) {
				newTextureSources.push(update.texture.src);
				const tile = scene.tiles.get(update._id);
				const rawSrc = tile?.texture?.src ?? tile?._source?.texture?.src;
				if (rawSrc) {
					previousTextureSources.set(normalizeFilePath(rawSrc), rawSrc);
				}
			}
		}

		// Pre-load new textures sequentially to avoid a CPU spike from
		// decoding many 8K images in parallel. Once cached, Tile.draw()
		// fetches them instantly instead of triggering concurrent decodes.
		if (newTextureSources.length > 1) {
			const preloaded = await preloadTexturesThrottled(newTextureSources);
			if (preloaded > 0) {
				log(`Pre-loaded ${preloaded}/${newTextureSources.length} texture(s)`);
			}
		}

		metrics.chunks = await updateDocumentsInChunks(scene, "Tile", tileUpdates, options.chunkSize);
		metrics.updated = tileUpdates.length;

		// Schedule cleanup of old textures no longer used by any tile.
		// Delayed to let Foundry finish drawing with new textures first.
		if (previousTextureSources.size > 0) {
			scheduleTextureCleanup(scene, previousTextureSources);
		}
	}

	metrics.durationMs = nowMs() - start;
	return metrics;
}

// ── Texture pre-loading ───────────────────────────────────────────────────

const PRELOAD_CONCURRENCY = 2;

async function preloadTexturesThrottled(sources) {
	const queue = [...sources];
	let loaded = 0;
	const renderer = canvas?.app?.renderer;

	async function worker() {
		while (queue.length > 0) {
			const src = queue.shift();
			try {
				const texture = await loadTexture(src);
				// Force GPU upload now so it doesn't all happen on one
				// frame when the tiles re-render with new textures.
				if (renderer && texture?.baseTexture?.valid) {
					renderer.texture.bind(texture.baseTexture);
				}
				loaded++;
				// Yield a frame between GPU uploads to keep the UI responsive
				await new Promise((r) => requestAnimationFrame(r));
			} catch (_e) {
				// Missing/broken file — Tile.draw() will handle the fallback
			}
		}
	}

	const workers = Math.min(PRELOAD_CONCURRENCY, queue.length);
	await Promise.all(Array.from({ length: workers }, worker));
	return loaded;
}

// ── Texture cleanup ───────────────────────────────────────────────────────

const TEXTURE_CLEANUP_DELAY_MS = 3000;

function scheduleTextureCleanup(scene, previousSources) {
	const sceneId = scene.id;
	setTimeout(async () => {
		// Scene may have changed since the timeout was scheduled
		const currentScene = game.scenes?.get(sceneId);
		if (!currentScene) return;

		// Collect all texture sources still in use by any tile on the scene
		const activeSources = new Set();
		const collection = currentScene.getEmbeddedCollection("Tile") ?? [];
		for (const tile of collection) {
			const src = tile.texture?.src ?? tile._source?.texture?.src;
			if (src) activeSources.add(normalizeFilePath(src));
		}

		let released = 0;
		for (const [normalized, raw] of previousSources) {
			if (!activeSources.has(normalized)) {
				try {
					await PIXI.Assets.unload(raw);
					released++;
				} catch (_e) {
					// Already unloaded or never cached
				}
			}
		}

		if (released > 0) {
			log(`Released ${released} unused texture(s) from GPU/CPU memory`);
		}
	}, TEXTURE_CLEANUP_DELAY_MS);
}
