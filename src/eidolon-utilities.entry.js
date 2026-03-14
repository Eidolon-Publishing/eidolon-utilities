// CSS imports for Vite HMR in dev, bundled in prod
import "../styles/time-triggers.css";
import "../styles/scene-criteria.css";
import "../styles/light-criteria.css";
import "../styles/criteria-switcher.css";
import "../styles/tile-criteria.css";
import "../styles/cinematic-editor.css";
import "../styles/placeable-picker.css";
import "../styles/canvas-popup.css";
import "../styles/idle-animations.css";
import "../styles/tile-interactions.css";
import "../styles/door-links.css";
import "../styles/scene-links.css";
import "../styles/region-shapes.css";
import "../styles/soft-light.css";
import "../styles/directional-teleport.css";

// Feature modules - preserve existing load order
import "../scripts/time-triggers/index.js";
import "../scripts/scene-criteria/index.js";
import "../scripts/criteria-engine/index.js";
import "../scripts/light-criteria/index.js";
import "../scripts/tween/index.js";
import "../scripts/cinematic/index.js";
import "../scripts/placeable-picker/index.js";
// Canvas popup - standalone, no feature dependencies
import "../scripts/canvas-popup/index.js";
// Idle animations - must come after tween (needs executor registry populated)
import "../scripts/idle-animations/index.js";
// Tile interactions - must come after tween and cinematic (needs TileAnimator + executors)
import "../scripts/tile-interactions/index.js";
// Door links - standalone, hooks into wall config and door state changes
import "../scripts/door-links/index.js";
// Scene links - standalone, hooks into scene config for cross-scene navigation
import "../scripts/scene-links/index.js";
// Region shapes - standalone, drag & drop shapes between RegionConfig windows
import "../scripts/region-shapes/index.js";
// Soft vision - custom vision mode with blur + soft fade (standalone, client-side only)
import "../scripts/soft-vision/index.js";
// Soft light - per-light radial desaturation/darkening (standalone, shader patching)
import "../scripts/soft-light/index.js";
// Directional teleport - region behavior for edge-biased token teleportation
import "../scripts/directional-teleport/index.js";
// Better Roofs multi-link - comma-separated occlusionLinkId support
import "../scripts/betterroofs-multilink/index.js";
