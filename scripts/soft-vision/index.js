/**
 * Soft-vision feature entry point.
 *
 * Registers a "Soft Fade" vision mode with configurable attenuation,
 * brightness, contrast, and saturation, plus edge blur on the
 * visibility/fog boundary.
 */

import { registerSoftVisionHooks } from "./hooks.js";

registerSoftVisionHooks();
