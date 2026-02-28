const DEFAULT_UPDATE_CHUNK_SIZE = 200;

export function getCollectionSize(collection) {
	if (!collection) return 0;
	if (Number.isInteger(collection.size)) return collection.size;
	if (Array.isArray(collection)) return collection.length;
	if (typeof collection.length === "number") return collection.length;
	return Array.from(collection).length;
}

export function nowMs() {
	if (typeof performance?.now === "function") return performance.now();
	return Date.now();
}

export function uniqueStringKeys(keys) {
	if (!Array.isArray(keys)) return [];

	const unique = new Set();
	for (const key of keys) {
		if (typeof key !== "string") continue;
		const normalized = key.trim();
		if (!normalized) continue;
		unique.add(normalized);
	}

	return Array.from(unique);
}

export function chunkArray(values, chunkSize = DEFAULT_UPDATE_CHUNK_SIZE) {
	if (!Array.isArray(values) || values.length === 0) return [];
	const size = Number.isInteger(chunkSize) && chunkSize > 0 ? chunkSize : DEFAULT_UPDATE_CHUNK_SIZE;

	const chunks = [];
	for (let index = 0; index < values.length; index += size) {
		chunks.push(values.slice(index, index + size));
	}
	return chunks;
}

export function isPlainObject(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function areValuesEqual(left, right) {
	if (Object.is(left, right)) return true;

	if (Array.isArray(left) || Array.isArray(right)) {
		if (!Array.isArray(left) || !Array.isArray(right)) return false;
		if (left.length !== right.length) return false;
		for (let index = 0; index < left.length; index += 1) {
			if (!areValuesEqual(left[index], right[index])) return false;
		}
		return true;
	}

	if (isPlainObject(left) || isPlainObject(right)) {
		if (!isPlainObject(left) || !isPlainObject(right)) return false;

		const rightKeys = Object.keys(right);

		for (const key of rightKeys) {
			if (!areValuesEqual(left[key], right[key])) return false;
		}
		return true;
	}

	return false;
}
