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
