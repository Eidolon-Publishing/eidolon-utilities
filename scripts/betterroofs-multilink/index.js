/**
 * Better Roofs Multi-Link Occlusion Patch
 *
 * betterroofs supports only a single occlusionLinkId per tile (strict === comparison).
 * This monkeypatch adds support for comma-separated IDs, so a tile can fade
 * when ANY of several roof groups are occluded.
 *
 * Example: set a tile's occlusionLinkId to "roof-a, roof-b" and it will
 * fade when entering either building A or building B.
 */

Hooks.on("init", () => {
	const br = game.modules.get("betterroofs");
	if (!br?.active) return;

	libWrapper.register(
		"eidolon-utilities",
		"CanvasOcclusionMask.prototype._identifyOccludedObjects",
		function multiLinkOcclusion(wrapped, ...args) {
			const occluded = wrapped(...args);

			const newlyOccluded = [];
			for (const otile of canvas.tiles.placeables) {
				const rawLinkId = otile.document.flags?.betterroofs?.occlusionLinkId;
				if (!rawLinkId || !rawLinkId.includes(",")) continue;
				if (occluded.has(otile.mesh)) continue;
				if (
					globalThis._betterRoofs?.isLevels &&
					CONFIG.Levels.currentToken?.document?.elevation >= otile.document.elevation
				)
					continue;

				const linkIds = rawLinkId.split(",").map((s) => s.trim());
				let found = false;
				for (const tile of canvas.tiles.placeables) {
					if (
						globalThis._betterRoofs?.isLevels &&
						CONFIG.Levels.currentToken?.document?.elevation >= tile.document.elevation
					)
						continue;
					if (!occluded.has(tile.mesh) || tile.id === otile.id) continue;
					const occlusionLinkSource = tile.document.flags?.betterroofs?.occlusionLinkSource;
					const tOcclusionLinkId = tile.document.flags?.betterroofs?.occlusionLinkId;
					if (occlusionLinkSource && linkIds.includes(tOcclusionLinkId)) {
						found = true;
						break;
					}
				}
				if (found) {
					occluded.add(otile.mesh);
					newlyOccluded.push(otile);
				}
			}

			for (const t of newlyOccluded) {
				globalThis._betterRoofsHelpers?.hideTileThroughFog(t);
			}

			return occluded;
		},
		"WRAPPER",
	);
});
