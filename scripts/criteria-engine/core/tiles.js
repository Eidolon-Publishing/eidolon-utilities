/**
 * Backward-compatibility barrel for tile criteria.
 *
 * All logic has been extracted to focused modules. This file re-exports
 * the full public API so existing `import { ... } from "./tiles.js"`
 * statements continue to work.
 */

// tile-targets
export {
	normalizeFilePath,
	buildTileFileEntries,
	createTileTargetFromIndex,
	normalizeTileTarget,
	resolveTileTargetIndex
} from "./tile-targets.js";

// tile-criteria
export {
	detectTileCriteriaConflicts,
	buildTileCriteriaFromFileIndex,
	normalizeTileCriteria
} from "./tile-criteria.js";

// tile-matcher
export {
	selectTileFileIndex
} from "./tile-matcher.js";

// update-tiles (orchestrator + cache invalidation)
export {
	invalidateTileCriteriaCaches,
	updateTiles
} from "./update-tiles.js";
