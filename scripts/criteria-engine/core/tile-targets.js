/**
 * File target resolution for criteria-driven tiles.
 *
 * Handles path normalization, file entry building, target creation,
 * and target-to-index resolution against MATT file lists.
 */

export function normalizeFilePath(path) {
	if (typeof path !== "string") return "";

	const trimmed = path.trim();
	if (!trimmed) return "";

	const slashNormalized = trimmed.replace(/\\/g, "/");
	try {
		return decodeURIComponent(slashNormalized);
	} catch (_error) {
		return slashNormalized;
	}
}

function getFilePath(file) {
	if (typeof file?.name === "string") return file.name;
	if (typeof file?.src === "string") return file.src;
	return "";
}

export function buildTileFileEntries(files) {
	if (!Array.isArray(files)) return [];

	const counts = new Map();
	return files.map((file, index) => {
		const path = normalizeFilePath(getFilePath(file));
		const key = path || `__index:${index}`;
		const occurrence = counts.get(key) ?? 0;
		counts.set(key, occurrence + 1);

		const target = {
			indexHint: index
		};

		if (path) {
			target.path = path;
			target.occurrence = occurrence;
		}

		return {
			index,
			path,
			occurrence,
			target,
			label: path.split("/").pop() || `File ${index + 1}`
		};
	});
}

export function createTileTargetFromIndex(files, index) {
	if (!Number.isInteger(index) || index < 0) return null;

	const entries = buildTileFileEntries(files);
	const entry = entries.find((candidate) => candidate.index === index);
	if (!entry) return { indexHint: index };
	return { ...entry.target };
}

export function normalizeTileTarget(target) {
	if (!target || typeof target !== "object") return null;

	const normalizedPath = normalizeFilePath(target.path);
	const normalizedIndex = Number(target.indexHint ?? target.fileIndex);
	const normalizedOccurrence = Number(target.occurrence);

	const normalized = {};

	if (normalizedPath) {
		normalized.path = normalizedPath;
		normalized.occurrence = Number.isInteger(normalizedOccurrence) && normalizedOccurrence >= 0
			? normalizedOccurrence
			: 0;
	}

	if (Number.isInteger(normalizedIndex) && normalizedIndex >= 0) {
		normalized.indexHint = normalizedIndex;
	}

	if (!normalized.path && !Number.isInteger(normalized.indexHint)) return null;
	return normalized;
}

export function resolveTileTargetIndex(target, files) {
	const normalizedTarget = normalizeTileTarget(target);
	if (!normalizedTarget) return -1;

	const entries = buildTileFileEntries(files);
	if (!entries.length) return -1;

	if (normalizedTarget.path) {
		const matches = entries.filter((entry) => entry.path === normalizedTarget.path);
		if (matches.length > 0) {
			const occurrence = Number.isInteger(normalizedTarget.occurrence)
				? normalizedTarget.occurrence
				: 0;

			if (matches[occurrence]) return matches[occurrence].index;

			if (Number.isInteger(normalizedTarget.indexHint)) {
				const hinted = matches.find((entry) => entry.index === normalizedTarget.indexHint);
				if (hinted) return hinted.index;
			}

			return matches[0].index;
		}
	}

	if (Number.isInteger(normalizedTarget.indexHint) && normalizedTarget.indexHint < entries.length) {
		return normalizedTarget.indexHint;
	}

	return -1;
}

/** @internal Exposed for updateTiles orchestrator */
export { getFilePath };
