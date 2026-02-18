// CSS imports for Vite HMR in dev, bundled in prod
import "../styles/time-triggers.css";
import "../styles/object-variants.css";
import "../styles/light-presets.css";

// Feature modules - preserve existing load order
import "../scripts/time-triggers/index.js";
import "../scripts/object-variants/index.js";
import "../scripts/light-presets/index.js";
import "../scripts/tween/index.js";
