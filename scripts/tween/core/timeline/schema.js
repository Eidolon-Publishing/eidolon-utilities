import { ErrorPolicy } from "./constants.js";
import { TweenTimeline } from "./TweenTimeline.js";
import { validateTweenEntry } from "../registry.js";

/**
 * Validate a sequence JSON structure. Throws on structural errors.
 * Does NOT validate individual tween type existence (types may register late).
 *
 * @param {object} data
 * @param {string} [data.name]
 * @param {"abort"|"continue"} [data.errorPolicy]
 * @param {Array} data.timeline
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

	validateSegmentsJSON(data.timeline, "timeline", 0);
}

/**
 * Validate a segment array structurally. Recursive for parallel branches.
 * @param {Array} segments
 * @param {string} path  Human-readable path for error messages
 * @param {number} depth  Current parallel nesting depth
 */
function validateSegmentsJSON(segments, path, depth = 0) {
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const segPath = `${path}[${i}]`;

		// Step segment (array)
		if (Array.isArray(segment)) {
			if (segment.length === 0) {
				throw new Error(`Sequence JSON: ${segPath} is an empty step.`);
			}
			for (let j = 0; j < segment.length; j++) {
				const entry = segment[j];
				if (!entry || typeof entry !== "object") {
					throw new Error(`Sequence JSON: ${segPath}[${j}] must be an object.`);
				}
				if (typeof entry.type !== "string" || !entry.type) {
					throw new Error(`Sequence JSON: ${segPath}[${j}].type must be a non-empty string.`);
				}
				if (entry.params != null && typeof entry.params !== "object") {
					throw new Error(`Sequence JSON: ${segPath}[${j}].params must be an object.`);
				}
				if (entry.opts != null && typeof entry.opts !== "object") {
					throw new Error(`Sequence JSON: ${segPath}[${j}].opts must be an object.`);
				}
				if (entry.detach != null && typeof entry.detach !== "boolean") {
					throw new Error(`Sequence JSON: ${segPath}[${j}].detach must be a boolean.`);
				}
			}
			continue;
		}

		if (typeof segment !== "object") {
			throw new Error(`Sequence JSON: ${segPath} must be a step array or an object.`);
		}

		// Delay segment
		if (segment.delay !== undefined) {
			if (typeof segment.delay !== "number" || segment.delay < 0) {
				throw new Error(`Sequence JSON: ${segPath}.delay must be a non-negative number.`);
			}
			continue;
		}

		// Await segment
		if (segment.await !== undefined) {
			const awaitConfig = segment.await;
			if (!awaitConfig || typeof awaitConfig !== "object") {
				throw new Error(`Sequence JSON: ${segPath}.await must be an object.`);
			}
			if (typeof awaitConfig.event !== "string" || !awaitConfig.event) {
				throw new Error(`Sequence JSON: ${segPath}.await.event must be a non-empty string.`);
			}
			if (awaitConfig.event === "signal" && (typeof awaitConfig.name !== "string" || !awaitConfig.name)) {
				throw new Error(`Sequence JSON: ${segPath}.await signal requires a non-empty "name".`);
			}
			if (awaitConfig.event === "keypress" && awaitConfig.key != null && typeof awaitConfig.key !== "string") {
				throw new Error(`Sequence JSON: ${segPath}.await keypress "key" must be a string.`);
			}
			if (awaitConfig.timeout != null && (typeof awaitConfig.timeout !== "number" || awaitConfig.timeout <= 0)) {
				throw new Error(`Sequence JSON: ${segPath}.await.timeout must be a positive number.`);
			}
			continue;
		}

		// Emit segment
		if (segment.emit !== undefined) {
			if (typeof segment.emit !== "string" || !segment.emit) {
				throw new Error(`Sequence JSON: ${segPath}.emit must be a non-empty string.`);
			}
			continue;
		}

		// Parallel segment
		if (segment.parallel !== undefined) {
			if (depth >= 8) {
				throw new Error(`Sequence JSON: ${segPath} exceeds maximum parallel nesting depth of 8.`);
			}
			const par = segment.parallel;
			if (!par || typeof par !== "object") {
				throw new Error(`Sequence JSON: ${segPath}.parallel must be an object.`);
			}
			if (!Array.isArray(par.branches) || par.branches.length === 0) {
				throw new Error(`Sequence JSON: ${segPath}.parallel.branches must be a non-empty array.`);
			}

			// Validate join
			const join = par.join ?? "all";
			if (join !== "all" && join !== "any") {
				if (typeof join !== "number" || !Number.isInteger(join) || join < 1 || join > par.branches.length) {
					throw new Error(`Sequence JSON: ${segPath}.parallel.join must be "all", "any", or 1..${par.branches.length}.`);
				}
			}

			// Validate overflow
			const overflow = par.overflow ?? "detach";
			if (overflow !== "detach" && overflow !== "cancel") {
				throw new Error(`Sequence JSON: ${segPath}.parallel.overflow must be "detach" or "cancel".`);
			}

			// Recurse into each branch
			for (let b = 0; b < par.branches.length; b++) {
				const branch = par.branches[b];
				if (!Array.isArray(branch)) {
					throw new Error(`Sequence JSON: ${segPath}.parallel.branches[${b}] must be an array.`);
				}
				validateSegmentsJSON(branch, `${segPath}.parallel.branches[${b}]`, depth + 1);
			}
			continue;
		}

		// Unknown segment type
		throw new Error(`Sequence JSON: ${segPath} is not a recognized segment (step array, delay, await, emit, or parallel).`);
	}
}

/**
 * Validate sequence semantics against registered tween types and validators.
 * Throws on unknown types or invalid params.
 *
 * @param {object} data
 */
export function validateSequenceSemantics(data) {
	validateSequenceJSON(data);
	validateSegmentsSemantics(data.timeline, "timeline");
}

/**
 * Recursively validate semantics of a segment array.
 * @param {Array} segments
 * @param {string} path
 */
function validateSegmentsSemantics(segments, path) {
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const segPath = `${path}[${i}]`;

		if (Array.isArray(segment)) {
			// Step — validate each tween entry
			for (let j = 0; j < segment.length; j++) {
				const entry = segment[j];
				try {
					validateTweenEntry(entry.type, entry.params ?? {});
				} catch (err) {
					throw new Error(`Sequence JSON: ${segPath}[${j}] failed semantic validation: ${err.message}`);
				}
			}
		} else if (segment.parallel) {
			// Recurse into parallel branches
			for (let b = 0; b < segment.parallel.branches.length; b++) {
				validateSegmentsSemantics(segment.parallel.branches[b], `${segPath}.parallel.branches[${b}]`);
			}
		}
		// delay, await, emit have no semantic validation beyond structural
	}
}

/**
 * Compile a validated sequence JSON into a TweenTimeline instance.
 *
 * @param {object} data  Validated sequence JSON
 * @param {object} [opts]
 * @param {boolean} [opts.validateSemantics]
 * @returns {TweenTimeline}
 */
export function compileSequence(data, opts = {}) {
	validateSequenceJSON(data);
	if (opts.validateSemantics) {
		validateSequenceSemantics(data);
	}

	const tl = new TweenTimeline();

	if (data.name) tl.name(data.name);
	if (data.errorPolicy) tl.errorPolicy(data.errorPolicy);

	compileSegments(data.timeline, tl);

	return tl;
}

/**
 * Compile a segment array into a TweenTimeline.
 * @param {Array} segments  JSON segments
 * @param {TweenTimeline} tl  Target timeline
 */
function compileSegments(segments, tl) {
	for (const segment of segments) {
		// Step (array)
		if (Array.isArray(segment)) {
			const step = tl.step();
			for (const entry of segment) {
				step.add(entry.type, entry.params ?? {}, entry.opts);
				if (entry.detach) step.detach();
			}
			continue;
		}

		// Delay
		if (segment.delay !== undefined) {
			tl.delay(segment.delay);
			continue;
		}

		// Await
		if (segment.await !== undefined) {
			tl.await(segment.await);
			continue;
		}

		// Emit
		if (segment.emit !== undefined) {
			tl.emit(segment.emit);
			continue;
		}

		// Parallel
		if (segment.parallel !== undefined) {
			const par = segment.parallel;
			const branchFns = par.branches.map((branchSegments) => {
				return (sub) => compileSegments(branchSegments, sub);
			});
			tl.parallel(branchFns, {
				join: par.join ?? "all",
				overflow: par.overflow ?? "detach",
			});
		}
	}
}
