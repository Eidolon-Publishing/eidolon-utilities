/**
 * Selector parsing and building utilities.
 *
 * Selector grammar:
 *   tag:X          → first placeable with Tagger tag X
 *   tag-all:X      → all placeables with Tagger tag X
 *   id:DOC_ID      → single placeable by document ID
 *   tags-any:A,B   → placeables matching ANY of the listed tags
 *   tags-all:A,B   → placeables matching ALL of the listed tags
 *   $particles     → special: FXMaster particle effects
 *   Scene.x.Tile.y → UUID passthrough
 */

const PREFIXED_TYPES = ["tag", "tag-all", "id", "tags-any", "tags-all"];
const MULTI_VALUE_TYPES = new Set(["tags-any", "tags-all"]);

/**
 * Parse a selector string into a structured object.
 *
 * @param {string} selector  e.g. "tag:door", "id:abc", "tags-any:A,B"
 * @returns {{ type: string, value: string | string[] }}
 */
export function parseSelector(selector) {
	if (!selector || typeof selector !== "string") {
		return { type: "unknown", value: selector ?? "" };
	}

	// Special selectors
	if (selector.startsWith("$")) {
		return { type: "special", value: selector };
	}

	// Prefixed selectors — try longest prefix first (tag-all before tag)
	for (const prefix of PREFIXED_TYPES) {
		if (selector.startsWith(`${prefix}:`)) {
			const raw = selector.slice(prefix.length + 1);
			const value = MULTI_VALUE_TYPES.has(prefix) ? raw.split(",").map((s) => s.trim()) : raw;
			return { type: prefix, value };
		}
	}

	// UUID passthrough (contains dots — e.g. Scene.xxx.Tile.yyy)
	if (selector.includes(".")) {
		return { type: "uuid", value: selector };
	}

	return { type: "unknown", value: selector };
}

/**
 * Build a selector string from a structured object.
 *
 * @param {{ type: string, value: string | string[] }} parsed
 * @returns {string}
 */
export function buildSelector(parsed) {
	if (!parsed) return "";

	const { type, value } = parsed;

	if (type === "special" || type === "uuid" || type === "unknown") {
		return Array.isArray(value) ? value.join(",") : (value ?? "");
	}

	const serialized = Array.isArray(value) ? value.join(",") : (value ?? "");
	return `${type}:${serialized}`;
}

/**
 * Build a tag selector from one or more tags and a match mode.
 *
 * @param {string[]} tags  Tag names
 * @param {"any" | "all" | "first" | "first-all"} mode  Match mode
 * @returns {string}  Selector string
 */
export function buildTagSelector(tags, mode = "first") {
	if (!tags?.length) return "";

	if (tags.length === 1) {
		return mode === "first-all" || mode === "all" ? `tag-all:${tags[0]}` : `tag:${tags[0]}`;
	}

	if (mode === "any") return `tags-any:${tags.join(",")}`;
	if (mode === "all") return `tags-all:${tags.join(",")}`;
	if (mode === "first-all") return `tags-all:${tags.join(",")}`;

	// "first" with multiple tags → tags-any (returns any match)
	return `tags-any:${tags.join(",")}`;
}
