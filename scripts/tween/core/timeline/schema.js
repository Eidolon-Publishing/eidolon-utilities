import { ErrorPolicy } from "./constants.js";
import { TweenTimeline } from "./TweenTimeline.js";

/**
 * Validate a sequence JSON structure. Throws on structural errors.
 * Does NOT validate individual tween type existence (types may register late).
 *
 * @param {object} data
 * @param {string} [data.name]
 * @param {"abort"|"continue"} [data.errorPolicy]
 * @param {Array<Array|{ delay: number }>} data.timeline
 */
export function validateSequenceJSON(data) {
	if (!data || typeof data !== "object") {
		throw new Error("Sequence JSON: data must be an object.");
	}
	if (!Array.isArray(data.timeline)) {
		throw new Error("Sequence JSON: 'timeline' must be an array.");
	}
	if (data.name != null && typeof data.name !== "string") {
		throw new Error("Sequence JSON: 'name' must be a string.");
	}
	if (data.errorPolicy != null && data.errorPolicy !== ErrorPolicy.ABORT && data.errorPolicy !== ErrorPolicy.CONTINUE) {
		throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
	}

	for (let i = 0; i < data.timeline.length; i++) {
		const segment = data.timeline[i];

		// Delay segment
		if (!Array.isArray(segment)) {
			if (typeof segment !== "object" || typeof segment.delay !== "number" || segment.delay < 0) {
				throw new Error(`Sequence JSON: timeline[${i}] must be a step array or { delay: <ms> }.`);
			}
			continue;
		}

		// Step segment — array of entries
		if (segment.length === 0) {
			throw new Error(`Sequence JSON: timeline[${i}] is an empty step.`);
		}
		for (let j = 0; j < segment.length; j++) {
			const entry = segment[j];
			if (!entry || typeof entry !== "object") {
				throw new Error(`Sequence JSON: timeline[${i}][${j}] must be an object.`);
			}
			if (typeof entry.type !== "string" || !entry.type) {
				throw new Error(`Sequence JSON: timeline[${i}][${j}].type must be a non-empty string.`);
			}
			if (entry.params != null && typeof entry.params !== "object") {
				throw new Error(`Sequence JSON: timeline[${i}][${j}].params must be an object.`);
			}
			if (entry.opts != null && typeof entry.opts !== "object") {
				throw new Error(`Sequence JSON: timeline[${i}][${j}].opts must be an object.`);
			}
			if (entry.detach != null && typeof entry.detach !== "boolean") {
				throw new Error(`Sequence JSON: timeline[${i}][${j}].detach must be a boolean.`);
			}
		}
	}
}

/**
 * Compile a validated sequence JSON into a TweenTimeline instance.
 *
 * @param {object} data  Validated sequence JSON
 * @returns {TweenTimeline}
 */
export function compileSequence(data) {
	validateSequenceJSON(data);

	const tl = new TweenTimeline();

	if (data.name) tl.name(data.name);
	if (data.errorPolicy) tl.errorPolicy(data.errorPolicy);

	for (const segment of data.timeline) {
		if (!Array.isArray(segment)) {
			// Delay
			tl.delay(segment.delay);
			continue;
		}

		// Step — array of entries
		const step = tl.step();
		for (const entry of segment) {
			step.add(entry.type, entry.params ?? {}, entry.opts);
			if (entry.detach) step.detach();
		}
	}

	return tl;
}
