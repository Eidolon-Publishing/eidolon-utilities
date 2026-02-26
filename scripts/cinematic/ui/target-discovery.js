/**
 * Scans the current scene for available cinematic targets.
 * Returns structured options for target dropdowns.
 *
 * @param {Scene} scene
 * @returns {{ selector: string, label: string, kind: string }[]}
 */
export function discoverTargets(scene) {
	const targets = [];

	// Tagger tags on scene placeables
	const TaggerAPI = window.Tagger ?? game.modules.get("tagger")?.api;
	if (TaggerAPI) {
		const tagged = TaggerAPI.getByTag("*", { sceneId: scene.id });
		const tagSet = new Set();
		for (const obj of tagged) {
			const tags = TaggerAPI.getTags(obj);
			for (const tag of tags) tagSet.add(tag);
		}
		for (const tag of [...tagSet].sort()) {
			targets.push({ selector: `tag:${tag}`, label: `Tag: ${tag} (first)`, kind: "tag" });
			targets.push({ selector: `tag-all:${tag}`, label: `Tag: ${tag} (all)`, kind: "tag-all" });
		}
	}

	// FXMaster particles (only when module is active)
	if (game.modules.get("fxmaster")?.active && canvas.particleeffects) {
		targets.push({ selector: "$particles", label: "Particle Effects", kind: "special" });
	}

	return targets;
}
