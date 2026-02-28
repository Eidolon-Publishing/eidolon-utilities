import { findBestMatch, findFileIndex } from "./matcher.js";
import { resolveRules } from "./resolver.js";
import { applyState, getState, getVersion, setVersion } from "./state.js";
import { updateTiles } from "./update-tiles.js";
import { updatePlaceables } from "./update-placeables.js";
import { indexScene } from "../conventions/bracket-indexer.js";
import { getSceneCriteria, setSceneCriteria } from "../../scene-criteria/core/storage.js";
import { SCHEMA_VERSION } from "./constants.js";
import {
	closeCriteriaSwitcher,
	openCriteriaSwitcher,
	toggleCriteriaSwitcher
} from "../ui/switcher-service.js";
import {
	registerTileConvention,
	unregisterTileConvention,
	getTileConventions,
	registerHiddenLightProvider,
	unregisterHiddenLightProvider,
	registerIndexingHook,
	unregisterIndexingHook
} from "./hooks-registry.js";

export const api = {
	SCHEMA_VERSION,

	applyState,
	getState,
	getVersion,
	setVersion,

	getCriteria(scene) {
		return getSceneCriteria(scene ?? game.scenes?.viewed);
	},

	setCriteria(criteria, scene) {
		return setSceneCriteria(scene ?? game.scenes?.viewed, criteria);
	},

	updateTiles,
	updatePlaceables,
	indexScene,

	openCriteriaSwitcher,
	closeCriteriaSwitcher,
	toggleCriteriaSwitcher,

	findBestMatch,
	findFileIndex,
	resolveRules,

	// Convention registration API
	registerTileConvention,
	unregisterTileConvention,
	getTileConventions,

	// Hidden light provider API
	registerHiddenLightProvider,
	unregisterHiddenLightProvider,

	// Indexing hook API
	registerIndexingHook,
	unregisterIndexingHook
};
