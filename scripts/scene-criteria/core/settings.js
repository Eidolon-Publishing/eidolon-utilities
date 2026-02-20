import {
  MODULE_ID,
  SETTING_ENABLE_CRITERIA_SURFACES,
  SETTING_SHOW_SCENE_CRITERIA_TAB
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

  game.settings.register(MODULE_ID, SETTING_SHOW_SCENE_CRITERIA_TAB, {
    name: localize("EIDOLON.SceneCriteria.ShowTabSettingName", "Show Scene Criteria Tab"),
    hint: localize(
      "EIDOLON.SceneCriteria.ShowTabSettingHint",
      "Enable the Scene Config > Criteria tab for scene criteria authoring."
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      // SceneConfig tab patching happens at initialization; prompt for reload.
      promptReloadForSceneCriteriaTab();
    }
  });

  game.settings.register(MODULE_ID, SETTING_ENABLE_CRITERIA_SURFACES, {
    name: localize("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria UI Surfaces"),
    hint: localize(
      "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
      "Show all criteria-driven UI surfaces (scene tab, tile/light editors, and criteria switcher controls)."
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      // Some surfaces are registered at initialization; prompt for reload.
      promptReloadForSceneCriteriaTab();
    }
  });
}

export function getShowSceneCriteriaTabSetting() {
  try {
    if (game?.settings?.get) {
      return Boolean(game.settings.get(MODULE_ID, SETTING_SHOW_SCENE_CRITERIA_TAB));
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to read Scene Criteria tab setting`, error);
  }
  return false;
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

function promptReloadForSceneCriteriaTab() {
  const title = localize("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required");
  const content = `<p>${localize(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to the Scene Criteria tab visibility require a reload. Reload now?"
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
      "Please reload the world to apply Scene Criteria tab visibility changes."
    )
  );
}
