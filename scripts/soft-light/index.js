/**
 * Soft-light feature entry point.
 *
 * Adds per-light soft fade: the center of each light looks normal,
 * edges gradually desaturate and darken. Toggleable per-light via
 * the light config UI (Animation tab).
 */

import { registerSoftLightHooks } from "./hooks.js";

registerSoftLightHooks();
