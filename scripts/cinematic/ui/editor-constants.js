// ── Constants and utilities shared across the cinematic editor ────────────────

export const TWEEN_TYPES = [
	{ value: "tile-prop", label: "Tile Prop" },
	{ value: "light-color", label: "Light Color" },
	{ value: "light-state", label: "Light State" },
	{ value: "particles-prop", label: "Particles Prop" },
	{ value: "camera-pan", label: "Camera Pan" },
	{ value: "token-prop", label: "Token Prop" },
	{ value: "drawing-prop", label: "Drawing Prop" },
	{ value: "sound-prop", label: "Sound Prop" },
];

/** Sensible defaults per tween type — used when switching types to reset fields.
 *  `form` determines which field group the editor renders. */
export const TWEEN_TYPE_DEFAULTS = {
	"tile-prop":      { form: "prop",       attribute: "alpha",  value: 1,    placeholder: "alpha, rotation, x, y, width, height" },
	"token-prop":     { form: "prop",       attribute: "alpha",  value: 1,    placeholder: "alpha, rotation, x, y" },
	"drawing-prop":   { form: "prop",       attribute: "alpha",  value: 1,    placeholder: "alpha, rotation, x, y" },
	"sound-prop":     { form: "prop",       attribute: "volume", value: 0.5,  placeholder: "volume, radius" },
	"particles-prop": { form: "particles",  attribute: "alpha",  value: 1,    placeholder: "alpha, rate, speed, size" },
	"camera-pan":     { form: "camera",     x: 0,   y: 0,   scale: 1 },
	"light-color":    { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
	"light-state":    { form: "lightState", enabled: true },
};

export const TRIGGER_OPTIONS = [
	{ value: "canvasReady", label: "Canvas Ready" },
	{ value: "manual", label: "Manual Only" },
];

/** Derive a stable sound ID from a file path: "audio/rain.ogg" → "rain" */
export function soundIdFromPath(src) {
	if (!src) return "";
	const filename = src.split("/").pop() || "";
	return filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}

/** Load an audio file's duration in ms from its metadata. Returns 0 on failure. */
export function loadAudioDurationMs(src) {
	if (!src) return Promise.resolve(0);
	return new Promise((resolve) => {
		const audio = new Audio(src);
		audio.addEventListener("loadedmetadata", () => {
			resolve(Math.round(audio.duration * 1000));
		});
		audio.addEventListener("error", () => resolve(0));
	});
}

// ── Layout dimensions ────────────────────────────────────────────────────────

export const LANE_HEIGHT = 40;
export const RULER_HEIGHT = 24;
export const SETUP_WIDTH = 50;
export const LANDING_WIDTH = 50;
export const FIXED_BLOCK_WIDTH = 60;
export const MARKER_WIDTH = 10;
export const GATE_WIDTH = 16;
export const MIN_STEP_WIDTH = 40;
export const MIN_DELAY_WIDTH = 20;

// ── Segment graph layout ──────────────────────────────────────────────────────

export const SEGMENT_NODE_HEIGHT = 44;
export const SEGMENT_NODE_MIN_WIDTH = 90;
export const SEGMENT_EDGE_WIDTH = 70;
export const SEGMENT_GRAPH_HEIGHT = 60;
export const SEGMENT_GRAPH_PADDING = 8;
