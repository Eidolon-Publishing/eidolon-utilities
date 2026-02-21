import {
  MODULE_ID,
  SETTING_ENABLE_CRITERIA_SURFACES
} from "./constants.js";
import { localize } from "../../time-triggers/core/utils.js";

let settingsRegistered = false;

export function registerSceneCriteriaSettings() {
  if (settingsRegistered) return;
  settingsRegistered = true;

  if (!game?.settings?.register) {
    console.warn(`${MODULE_ID} | game.settings.register unavailable; scene criteria setting skipped.`);
    return;
  }

  game.settings.register(MODULE_ID, SETTING_ENABLE_CRITERIA_SURFACES, {
    name: localize("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
    hint: localize(
      "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
      "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      // Some surfaces are registered at initialization; prompt for reload.
      promptReloadForCriteriaSurfaces();
    }
  });
}

export function getCriteriaSurfacesEnabled() {
  try {
    if (game?.settings?.get) {
      return Boolean(game.settings.get(MODULE_ID, SETTING_ENABLE_CRITERIA_SURFACES));
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to read criteria surfaces setting`, error);
  }
  return true;
}

function promptReloadForCriteriaSurfaces() {
  const title = localize("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required");
  const content = `<p>${localize(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`;

  const canReload = typeof foundry?.utils?.debouncedReload === "function";
  const reload = () => {
    if (canReload) {
      foundry.utils.debouncedReload();
    } else {
      window.location.reload();
    }
  };

  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (typeof DialogV2?.confirm === "function") {
    void DialogV2.confirm({
      window: { title },
      content
    }).then((confirmed) => {
      if (confirmed) reload();
    });
    return;
  }

  if (typeof Dialog?.confirm === "function") {
    Dialog.confirm({
      title,
      content,
      yes: () => reload(),
      no: () => {}
    });
    return;
  }

  ui.notifications?.info?.(
    localize(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
