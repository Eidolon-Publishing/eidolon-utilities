// CSS imports for Vite HMR in dev, bundled in prod
import "../styles/time-triggers.css";
import "../styles/scene-criteria.css";
import "../styles/light-criteria.css";

// Feature modules - preserve existing load order
import "../scripts/time-triggers/index.js";
import "../scripts/scene-criteria/index.js";
import "../scripts/light-criteria/index.js";
import "../scripts/tween/index.js";
