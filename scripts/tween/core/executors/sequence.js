import { registerTweenType } from "../registry.js";
import { validateSequenceJSON, compileSequence } from "../timeline/schema.js";

/**
 * Validate sequence tween parameters (JSON structure check only).
 * @param {object} params  Sequence JSON data
 */
function validate(params) {
	validateSequenceJSON(params);
}

/**
 * Execute a sequence tween by compiling JSON into a TweenTimeline and running it.
 * Broadcast is disabled since the dispatcher already broadcast the message.
 *
 * @param {object} params  Sequence JSON data
 * @param {object} opts
 * @param {boolean} [opts.commit]
 * @param {number}  [opts.startEpochMS]
 * @returns {Promise<boolean>}
 */
async function execute(params, opts = {}) {
	const tl = compileSequence(params);
	const handle = tl.run({
		broadcast: false,
		commit: opts.commit,
		startEpochMS: opts.startEpochMS,
	});
	return handle.finished;
}

export function registerSequenceTween() {
	registerTweenType({ type: "sequence", execute, validate });
}
