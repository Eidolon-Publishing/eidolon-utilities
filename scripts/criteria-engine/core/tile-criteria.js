/**
 * Criteria normalization, legacy conversion, and conflict detection for tiles.
 */
import {
	createTileTargetFromIndex,
	normalizeTileTarget,
	resolveTileTargetIndex
} from "./tile-targets.js";

function sanitizeCriteria(criteria) {
	if (!criteria || typeof criteria !== "object" || Array.isArray(criteria)) return {};

	const result = {};
	for (const [key, value] of Object.entries(criteria)) {
		if (typeof key !== "string" || !key) continue;
		if (typeof value !== "string" || !value.trim()) continue;
		result[key] = value.trim();
	}
	return result;
}

function serializeCriteria(criteria) {
	const entries = Object.entries(sanitizeCriteria(criteria)).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	return entries.map(([key, value]) => `${key}=${value}`).join("\u001f");
}

function getCriteriaSpecificity(criteria) {
	return Object.keys(sanitizeCriteria(criteria)).length;
}

function areCriteriaCompatible(leftCriteria, rightCriteria) {
	const left = sanitizeCriteria(leftCriteria);
	const right = sanitizeCriteria(rightCriteria);

	for (const [key, leftValue] of Object.entries(left)) {
		if (!(key in right)) continue;
		if (right[key] !== leftValue) return false;
	}

	return true;
}

function getTargetIdentity(target, files) {
	const resolvedIndex = resolveTileTargetIndex(target, files);
	if (Number.isInteger(resolvedIndex) && resolvedIndex >= 0) {
		return `index:${resolvedIndex}`;
	}

	const normalized = normalizeTileTarget(target);
	if (!normalized) return "";

	if (normalized.path) {
		const occurrence = Number.isInteger(normalized.occurrence) ? normalized.occurrence : 0;
		return `path:${normalized.path}#${occurrence}`;
	}

	if (Number.isInteger(normalized.indexHint)) {
		return `hint:${normalized.indexHint}`;
	}

	return "";
}

export function detectTileCriteriaConflicts(tileCriteria, options = {}) {
	const files = Array.isArray(options.files) ? options.files : [];
	const normalized = normalizeTileCriteria(tileCriteria, { files });
	if (!normalized?.variants?.length) {
		return {
			errors: [],
			warnings: []
		};
	}

	const prepared = normalized.variants.map((variant, index) => ({
		index,
		criteria: sanitizeCriteria(variant.criteria),
		specificity: getCriteriaSpecificity(variant.criteria),
		criteriaSignature: serializeCriteria(variant.criteria),
		targetIdentity: getTargetIdentity(variant.target, files)
	}));

	const errors = [];
	const warnings = [];

	for (let leftIndex = 0; leftIndex < prepared.length; leftIndex += 1) {
		const left = prepared[leftIndex];

		for (let rightIndex = leftIndex + 1; rightIndex < prepared.length; rightIndex += 1) {
			const right = prepared[rightIndex];
			if (left.specificity !== right.specificity) continue;
			if (!areCriteriaCompatible(left.criteria, right.criteria)) continue;

			const sameTarget = Boolean(left.targetIdentity) && left.targetIdentity === right.targetIdentity;
			if (!sameTarget) {
				errors.push({
					leftIndex: left.index,
					rightIndex: right.index,
					type: left.criteriaSignature === right.criteriaSignature ? "equivalent" : "overlap",
					specificity: left.specificity
				});
				continue;
			}

			if (left.criteriaSignature === right.criteriaSignature) {
				warnings.push({
					leftIndex: left.index,
					rightIndex: right.index,
					type: "duplicate"
				});
			}
		}
	}

	return {
		errors,
		warnings
	};
}

function normalizeTileVariant(entry, files) {
	if (!entry || typeof entry !== "object") return null;

	let target = normalizeTileTarget(entry.target);
	if (!target) {
		const fileIndex = Number(entry.fileIndex);
		if (Number.isInteger(fileIndex) && fileIndex >= 0) {
			target = createTileTargetFromIndex(files, fileIndex);
		}
	}

	if (!target) return null;

	return {
		criteria: sanitizeCriteria(entry.criteria),
		target
	};
}

/**
 * Convert a legacy `fileIndex` array into select-one tile criteria.
 */
export function buildTileCriteriaFromFileIndex(fileIndex, options = {}) {
	if (!Array.isArray(fileIndex) || fileIndex.length === 0) return null;

	const files = Array.isArray(options.files) ? options.files : null;

	const variants = fileIndex
		.map((criteria, index) => ({
			criteria: sanitizeCriteria(criteria),
			target: createTileTargetFromIndex(files, index)
		}))
		.filter((entry) => entry.target);

	if (!variants.length) return null;

	const universal = variants.find((entry) => Object.keys(entry.criteria).length === 0);
	const fallbackDefault = universal?.target ?? variants[0].target;

	let defaultTarget = null;
	const defaultFileIndex = Number(options.defaultFileIndex);
	if (Number.isInteger(defaultFileIndex) && defaultFileIndex >= 0) {
		defaultTarget = createTileTargetFromIndex(files, defaultFileIndex);
	}

	if (!defaultTarget) defaultTarget = fallbackDefault;

	return {
		strategy: "select-one",
		variants,
		defaultTarget
	};
}

/**
 * Normalize tile criteria definitions.
 *
 * Supports:
 * - New schema: `{ strategy, variants[{criteria,target}], defaultTarget }`
 * - Legacy schema: `fileIndex` criteria array and `defaultFileIndex`
 */
export function normalizeTileCriteria(tileCriteria, options = {}) {
	const files = Array.isArray(options.files) ? options.files : null;

	if (Array.isArray(tileCriteria)) {
		return buildTileCriteriaFromFileIndex(tileCriteria, { files });
	}

	if (!tileCriteria || typeof tileCriteria !== "object") return null;

	const variants = Array.isArray(tileCriteria.variants)
		? tileCriteria.variants.map((entry) => normalizeTileVariant(entry, files)).filter(Boolean)
		: [];

	if (!variants.length) return null;

	let defaultTarget = normalizeTileTarget(tileCriteria.defaultTarget);

	if (!defaultTarget) {
		const defaultFileIndex = Number(tileCriteria.defaultFileIndex);
		if (Number.isInteger(defaultFileIndex) && defaultFileIndex >= 0) {
			defaultTarget = createTileTargetFromIndex(files, defaultFileIndex);
		}
	}

	if (!defaultTarget) {
		const universal = variants.find((entry) => Object.keys(entry.criteria).length === 0);
		defaultTarget = universal?.target ?? variants[0].target;
	}

	return {
		strategy: "select-one",
		variants,
		defaultTarget
	};
}

/** @internal Exposed for dependency index key extraction */
export { sanitizeCriteria };
