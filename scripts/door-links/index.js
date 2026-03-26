/**
 * Door-links feature entry point.
 *
 * Registers built-in behaviors and hooks.
 */

import { registerBehavior } from "./core/behavior-registry.js";
import { reflect } from "./core/behaviors/reflect.js";
import { passthru } from "./core/behaviors/passthru.js";
import { registerDoorLinksHooks } from "./hooks.js";
import { registerTokenOccluderHooks } from "../token-occluders/index.js";

// Register built-in behaviors
registerBehavior("reflect", reflect);
registerBehavior("passthru", passthru);

// Register hooks
registerDoorLinksHooks();
registerTokenOccluderHooks();
