import TriggerFormApplication from "./TriggerFormApplication.js";
import {
  FLAG_TIME_TRIGGER_ACTIVE,
  FLAG_TIME_TRIGGER_HIDE_WINDOW,
  FLAG_TIME_TRIGGER_SHOW_PLAYER_WINDOW,
  MODULE_ID
} from "../core/constants.js";
import { buildActionSummaryParts, executeTriggerAction, getActionLabel } from "../core/actions.js";
import { getTimeTriggers, setTimeTriggers } from "../core/storage.js";
import { debugGroup, debugGroupEnd, debugLog } from "../core/debug.js";
import { getSceneFromApplication, hasSceneDocument, localize } from "../core/utils.js";
import { formatTriggerTimeForDisplay } from "../core/time-format.js";
import { onTimeFormatSettingChange } from "../core/settings.js";
import { createSceneConfigTabFactory } from "../../common/ui/scene-config-tab-factory.js";
import { createApplicationFactory } from "../../common/ui/application-factories.js";

const triggerFormFactory = createApplicationFactory(TriggerFormApplication);
const TIME_TRIGGER_SCENE_TEMPLATE = `modules/${MODULE_ID}/templates/time-trigger-scene-tab.html`;

const timeTriggerSceneConfigFactory = createSceneConfigTabFactory({
  tabId: "time-triggers",
  tabLabel: () => localize("EIDOLON.TimeTrigger.Tab", "Time Triggers"),
  getScene: getSceneFromApplication,
  isApplicable: isRecognizedSceneConfig,
  renderContent: ({ app, scene, tab }) => renderTimeTriggerTab(app, tab, scene),
  logger: {
    log: debugLog,
    group: debugGroup,
    groupEnd: debugGroupEnd
  }
});

export function registerSceneConfigHook() {
  debugLog("Registering SceneConfig render hook");
  return timeTriggerSceneConfigFactory.register();
}

function renderTimeTriggerTab(app, tabElement, scene) {
  if (!(tabElement instanceof HTMLElement)) return;
  const activeScene = hasSceneDocument(scene) ? scene : getSceneFromApplication(app);

  void renderTimeTriggersTabContent(app, tabElement, activeScene);

  const unsubscribe = onTimeFormatSettingChange(() => {
    void renderTimeTriggersTabContent(app, tabElement, activeScene);
  });

  return () => {
    if (typeof unsubscribe === "function") {
      try {
        unsubscribe();
      } catch (error) {
        console.error(
          `${MODULE_ID} | Failed to dispose scene config time format subscription`,
          error
        );
      }
    }
  };
}

async function renderTimeTriggersTabContent(app, tabElement, sceneOverride) {
  const scene = sceneOverride ?? getSceneFromApplication(app);
  debugGroup("renderTimeTriggersTabContent", { sceneId: scene?.id ?? null });
  try {
    if (!hasSceneDocument(scene)) {
      const unavailableLabel = localize(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      tabElement.innerHTML = `<p class="notes">${unavailableLabel}</p>`;
      debugLog("Scene lacks document for time triggers", { sceneId: scene?.id ?? null });
      return;
    }

    const flagPath = `flags.${MODULE_ID}.${FLAG_TIME_TRIGGER_ACTIVE}`;
    const hideWindowFlagPath = `flags.${MODULE_ID}.${FLAG_TIME_TRIGGER_HIDE_WINDOW}`;
    const showPlayerWindowFlagPath = `flags.${MODULE_ID}.${FLAG_TIME_TRIGGER_SHOW_PLAYER_WINDOW}`;
    const isActive = Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_ACTIVE));
    const shouldHideWindow = Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_HIDE_WINDOW));
    const shouldShowPlayerWindow = Boolean(
      scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_SHOW_PLAYER_WINDOW)
    );
    const triggers = getTimeTriggers(scene);
    debugLog("Rendering time trigger list", {
      sceneId: scene.id,
      isActive,
      shouldHideWindow,
      shouldShowPlayerWindow,
      triggerCount: triggers.length
    });

    const activateLabel = localize("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger");
    const description = localize(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    );
    const hideWindowLabel = localize(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    );
    const hideWindowDescription = localize(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    );
    const showPlayerWindowLabel = localize(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    );
    const showPlayerWindowDescription = localize(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    );
    const triggerListLabel = localize(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    );
    const emptyLabel = localize(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    );
    const addLabel = localize("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger");
    const editLabel = localize("EIDOLON.TimeTrigger.EditTrigger", "Edit");
    const deleteLabel = localize("EIDOLON.TimeTrigger.DeleteTrigger", "Remove");
    const triggerNowLabel = localize("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now");
    const atLabel = localize("EIDOLON.TimeTrigger.AtLabel", "At");
    const doLabel = localize("EIDOLON.TimeTrigger.DoLabel", "Do");
    const missingTime = localize("EIDOLON.TimeTrigger.MissingTime", "(No time set)");

    const triggerItems = triggers.map((trigger, index) => {
      const formattedTimeRaw = trigger.time ? formatTriggerTimeForDisplay(trigger.time) : "";
      const formattedTime = formattedTimeRaw || trigger.time || "";
      const timeText = formattedTime || missingTime;
      const actionLabel = getActionLabel(trigger.action);

      const summaryParts = [
        `${atLabel} ${timeText}`,
        `${doLabel} ${actionLabel}`,
        ...buildActionSummaryParts(trigger)
      ];

      return {
        index,
        summaryParts,
        tooltips: {
          triggerNow: triggerNowLabel,
          edit: editLabel,
          delete: deleteLabel
        }
      };
    });

    const templateRenderer =
      foundry?.applications?.handlebars?.renderTemplate ??
      (typeof renderTemplate === "function" ? renderTemplate : globalThis?.renderTemplate);
    if (typeof templateRenderer !== "function") {
      console.error(`${MODULE_ID} | renderTemplate is unavailable; cannot render scene tab.`);
      tabElement.innerHTML = `<p class="notes">${emptyLabel}</p>`;
      return;
    }

    let renderedTemplate = "";
    try {
      renderedTemplate = await templateRenderer(TIME_TRIGGER_SCENE_TEMPLATE, {
        flags: {
          active: flagPath,
          hideWindow: hideWindowFlagPath,
          showPlayerWindow: showPlayerWindowFlagPath
        },
        states: {
          isActive,
          hideWindow: shouldHideWindow,
          showPlayerWindow: shouldShowPlayerWindow
        },
        labels: {
          activate: activateLabel,
          hideWindow: hideWindowLabel,
          showPlayerWindow: showPlayerWindowLabel,
          triggerList: triggerListLabel,
          empty: emptyLabel,
          add: addLabel
        },
        hints: {
          activate: description,
          hideWindow: hideWindowDescription,
          showPlayerWindow: showPlayerWindowDescription
        },
        triggers: triggerItems,
        hasTriggers: triggerItems.length > 0
      });
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to render time trigger scene tab template`, error);
      tabElement.innerHTML = `<p class="notes">${emptyLabel}</p>`;
      return;
    }

    tabElement.innerHTML = renderedTemplate;

    bindTimeTriggerTabEvents(app, tabElement, scene);
  } finally {
    debugGroupEnd();
  }
}

function bindTimeTriggerTabEvents(app, tabElement, sceneOverride) {
  const scene = sceneOverride ?? getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) return;

  const addButton = tabElement.querySelector('[data-action="add-trigger"]');
  if (addButton) {
    addButton.addEventListener("click", () => {
      debugLog("Add trigger button clicked", { sceneId: scene.id });
      openTriggerForm(app, { scene });
    });
  }

  tabElement.querySelectorAll('[data-action="edit-trigger"]').forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      const triggers = getTimeTriggers(scene);
      const trigger = triggers[index];
      if (!trigger) return;
      debugLog("Edit trigger button clicked", { sceneId: scene.id, triggerId: trigger.id, index });
      openTriggerForm(app, { trigger, triggerIndex: index, scene });
    });
  });

  tabElement.querySelectorAll('[data-action="delete-trigger"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      const triggers = getTimeTriggers(scene);
      const removedTrigger = triggers[index];
      if (!removedTrigger) return;
      triggers.splice(index, 1);
      try {
        debugLog("Deleting trigger", {
          sceneId: scene.id,
          index,
          triggerId: removedTrigger?.id ?? null
        });
        await setTimeTriggers(scene, triggers);
        await renderTimeTriggersTabContent(app, tabElement, scene);
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to delete time trigger`, error);
        ui.notifications?.error?.(
          localize(
            "EIDOLON.TimeTrigger.TriggerDeleteError",
            "Failed to remove the selected time trigger."
          )
        );
      }
    });
  });

  tabElement.querySelectorAll('[data-action="fire-trigger"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      const triggers = getTimeTriggers(scene);
      const trigger = triggers[index];
      if (!trigger) return;

      if (!game.user?.isGM) {
        ui.notifications?.warn?.(
          localize("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
        );
        return;
      }

      try {
        debugLog("Manually firing trigger", { sceneId: scene.id, triggerId: trigger.id, index });
        await executeTriggerAction(scene, trigger);
        ui.notifications?.info?.(
          localize(
            "EIDOLON.TimeTrigger.TriggerNowSuccess",
            "Triggered the selected time trigger."
          )
        );
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to execute time trigger manually`, error);
        ui.notifications?.error?.(
          localize(
            "EIDOLON.TimeTrigger.TriggerNowError",
            "Failed to execute the selected time trigger."
          )
        );
        debugLog("Manual trigger execution failed", {
          sceneId: scene.id,
          triggerId: trigger.id,
          index,
          message: error?.message ?? String(error)
        });
      }
    });
  });
}

function openTriggerForm(app, options = {}) {
  const providedScene = options.scene ?? null;
  const scene =
    providedScene && hasSceneDocument(providedScene)
      ? providedScene
      : getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) {
    console.warn(`${MODULE_ID} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  debugLog("Opening trigger form", {
    sceneId: scene.id,
    triggerId: options.trigger?.id ?? null,
    index: Number.isInteger(options.triggerIndex) ? Number(options.triggerIndex) : null
  });
  const formBuilder = triggerFormFactory;
  const form = formBuilder({
    scene,
    trigger: options.trigger ?? null,
    triggerIndex: options.triggerIndex ?? null,
    onSave: () => {
      const tab = app.element?.[0]?.querySelector('.tab[data-tab="time-triggers"]');
      if (tab) {
        void renderTimeTriggersTabContent(app, tab, scene);
      }
    }
  });
  form.render({ force: true });
}

function isRecognizedSceneConfig(app, scene) {
  if (!app) return false;

  const SceneConfigClass = foundry?.applications?.sheets?.SceneConfig ?? globalThis?.SceneConfig;
  if (SceneConfigClass && app instanceof SceneConfigClass) return true;

  const constructorName = app?.constructor?.name;
  if (typeof constructorName === "string" && constructorName.includes("SceneConfig")) return true;

  if (scene) {
    const SceneClass = globalThis?.Scene;
    if (SceneClass && scene instanceof SceneClass) return true;
    if (scene?.documentName === "Scene" || scene?.documentName === "scenes") return true;
    if (scene?.collection === "scenes") return true;
  }

  const baseApplication = app?.options?.baseApplication ?? app?.options?.id;
  if (typeof baseApplication === "string" && baseApplication.includes("SceneConfig")) return true;

  return false;
}
