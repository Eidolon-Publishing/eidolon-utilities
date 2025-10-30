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
import {
  escapeHtml,
  getSceneFromApplication,
  hasSceneDocument,
  localize
} from "../core/utils.js";
import { formatTriggerTimeForDisplay } from "../core/time-format.js";
import { onTimeFormatSettingChange } from "../core/settings.js";

const TAB_GROUP_PATCH_SYMBOL = Symbol("EIDOLON_TIME_TRIGGER_TAB_GROUP_PATCH");
const TIME_FORMAT_SUBSCRIPTION_SYMBOL = Symbol("EIDOLON_TIME_TRIGGER_TIME_FORMAT_SUB");

export function registerSceneConfigHook() {
  debugLog("Registering SceneConfig render hook");
  Hooks.on("renderSceneConfig", (app, html) => {
    const scene = getSceneFromApplication(app);
    if (!isRecognizedSceneConfig(app, scene)) {
      debugLog("renderSceneConfig skipped", {
        reason: "unrecognized-application",
        constructor: app?.constructor?.name ?? null
      });
      return;
    }

    debugGroup("renderSceneConfig", { sceneId: scene?.id ?? null });
    try {
      const rootElement =
        html instanceof HTMLElement
          ? html
          : html?.[0] instanceof HTMLElement
          ? html[0]
          : app.element?.[0] instanceof HTMLElement
          ? app.element[0]
          : null;
      if (!rootElement) {
        debugLog("renderSceneConfig aborted", { reason: "missing-root-element" });
        return;
      }

      const navSelectors = [
        "nav.sheet-tabs[data-group]",
        "nav.tabs[data-group]",
        "nav.sheet-tabs",
        "nav.tabs"
      ];
      const nav = navSelectors
        .map((selector) => rootElement.querySelector(selector))
        .find((element) => element instanceof HTMLElement);

      const bodyCandidates = [
        rootElement.querySelector(".tab[data-tab]")?.parentElement,
        rootElement.querySelector(".sheet-body"),
        nav?.parentElement?.querySelector?.(":scope > .sheet-body"),
        nav?.parentElement
      ];
      const body = bodyCandidates.find((candidate) => candidate instanceof HTMLElement);
      const groupName =
        nav?.dataset?.group ??
        nav?.querySelector?.("a[data-group]")?.dataset?.group ??
        nav?.querySelector?.("[data-group]")?.dataset?.group ??
        body?.querySelector?.(".tab[data-group]")?.dataset?.group ??
        app._tabs?.find?.((binding) => binding?.group)?.group ??
        getFirstTabGroupName(app) ??
        "main";
      if (!nav || !body) {
        debugLog("renderSceneConfig aborted", { reason: "missing-navigation", hasNav: Boolean(nav), hasBody: Boolean(body) });
        return;
      }
      const { controller: tabGroupController, active: initialActiveTab } = resolveTabGroupState(app, groupName);

      let tabButton = nav.querySelector('[data-tab="time-triggers"]');
      if (!tabButton) {
        tabButton = document.createElement("a");
        tabButton.dataset.action = "tab";
        tabButton.dataset.group = groupName;
        tabButton.dataset.tab = "time-triggers";
        const referenceTab = nav.querySelector("a[data-tab]");
        if (referenceTab?.classList?.contains("item")) {
          tabButton.classList.add("item");
        }
        nav.appendChild(tabButton);
        debugLog("Created time trigger tab button", { group: groupName });
      }
      tabButton.innerHTML = localize("EIDOLON.TimeTrigger.Tab", "Time Triggers");

      let tab = body.querySelector('.tab[data-tab="time-triggers"]');
      if (!tab) {
        tab = document.createElement("div");
        tab.classList.add("tab");
        tab.dataset.tab = "time-triggers";
        tab.dataset.group = groupName;
        const footer = findFooterElement(body);
        body.insertBefore(tab, footer ?? null);
        debugLog("Created time trigger tab container", { group: groupName });
      }

      const isActiveTimeTriggerTab =
        initialActiveTab === "time-triggers" ||
        tabButton.classList?.contains("active") ||
        tab.classList.contains("active");

      if (isActiveTimeTriggerTab) {
        tabButton.classList.add("active");
        tab.classList.add("active");
      } else {
        tabButton.classList.remove("active");
        tab.classList.remove("active");
      }

      tab.toggleAttribute("hidden", !isActiveTimeTriggerTab);

      const ensureTabVisible = () => {
        if (!(tab instanceof HTMLElement)) return;
        const activeTabId = getTabGroupActiveId(app, groupName);
        const isActive =
          activeTabId === "time-triggers" ||
          tabButton.classList?.contains("active") ||
          tab.classList.contains("active");
        if (!isActive) return;

        tabButton.classList?.add("active");
        tab.classList.add("active");
        tab.removeAttribute("hidden");
        tab.removeAttribute("aria-hidden");
        if (tab.style.display === "none") {
          tab.style.display = "";
        }
      };

      const scheduleEnsureTabVisible = () => {
        try {
          ensureTabVisible();
        } catch (error) {
          debugLog("Time trigger tab visibility enforcement failed", {
            reason: "ensure-visible",
            message: error?.message ?? String(error)
          });
        }

        const rerun = () => {
          try {
            ensureTabVisible();
          } catch (error) {
            debugLog("Time trigger tab visibility enforcement failed", {
              reason: "ensure-visible-rerun",
              message: error?.message ?? String(error)
            });
          }
        };

        const scheduleMicrotask =
          typeof queueMicrotask === "function"
            ? queueMicrotask
            : (callback) => Promise.resolve().then(callback);

        scheduleMicrotask(rerun);
        setTimeout(rerun, 0);
      };

      if (!tabButton.dataset.eidolonEnsureTimeTriggerVisibility) {
        tabButton.addEventListener("click", scheduleEnsureTabVisible);
        tabButton.dataset.eidolonEnsureTimeTriggerVisibility = "true";
      }

      renderTimeTriggersTabContent(app, tab);
      registerSceneConfigTimeFormatSubscription(app, tab);

      const bindTargetElement =
        html instanceof HTMLElement
          ? html
          : html?.[0] instanceof HTMLElement
          ? html[0]
          : rootElement;
      const bindTargetJQuery =
        typeof html?.find === "function"
          ? html
          : typeof app?.element?.find === "function"
          ? app.element
          : typeof globalThis?.jQuery === "function" && bindTargetElement
          ? globalThis.jQuery(bindTargetElement)
          : null;

      if (tabGroupController?.bind) {
        patchTabGroupActivate(tabGroupController, ensureTabVisible);
        const targetElement = bindTargetElement ?? bindTargetJQuery?.[0] ?? rootElement;
        if (targetElement instanceof HTMLElement) {
          tabGroupController.bind(targetElement);
        }
        scheduleEnsureTabVisible();
      } else {
        const legacyBinding =
          app._tabs?.find?.((binding) => binding?.group === groupName) ?? app._tabs?.[0];
        patchLegacyTabsActivate(legacyBinding, ensureTabVisible);
        if (legacyBinding?.bind) {
          const legacyTargetElement = bindTargetElement ?? bindTargetJQuery?.[0] ?? rootElement;
          const legacyTargetJQuery =
            legacyTargetElement && typeof globalThis?.jQuery === "function"
              ? globalThis.jQuery(legacyTargetElement)
              : bindTargetJQuery;

          const tryBind = (target) => {
            if (!target) return false;
            try {
              legacyBinding.bind(target);
              return true;
            } catch (error) {
              debugLog("Legacy tab binding failed", {
                reason: "bind-target",
                targetType: target instanceof HTMLElement ? "element" : "other",
                message: error?.message ?? String(error)
              });
              return false;
            }
          };

          if (!tryBind(legacyTargetElement)) {
            tryBind(legacyTargetJQuery ?? legacyTargetElement);
          }
        }
        scheduleEnsureTabVisible();
      }

      scheduleEnsureTabVisible();

      app.setPosition?.({ height: "auto" });
    } finally {
      debugGroupEnd();
    }
  });

  Hooks.on("closeSceneConfig", (app) => {
    disposeSceneConfigTimeFormatSubscription(app);
  });
}

function patchTabGroupActivate(tabGroup, ensureTabVisible) {
  if (!tabGroup || typeof ensureTabVisible !== "function") return;

  if (typeof tabGroup.on === "function") {
    const patchState = tabGroup[TAB_GROUP_PATCH_SYMBOL] ?? {};
    patchState.ensure = ensureTabVisible;
    if (!patchState.listener) {
      patchState.listener = () => {
        try {
          patchState.ensure?.();
        } catch (error) {
          debugLog("Time trigger tab visibility enforcement failed", {
            reason: "tab-group-event",
            message: error?.message ?? String(error)
          });
        }
      };
      tabGroup.on("activate", patchState.listener);
    }
    tabGroup[TAB_GROUP_PATCH_SYMBOL] = patchState;
  }

  const callbacks = tabGroup.callbacks ?? (tabGroup.callbacks = {});
  const existingActivate = callbacks.activate;

  if (typeof existingActivate === "function" && existingActivate.__eidolonTimeTriggerPatch) {
    existingActivate.__eidolonEnsureVisible = ensureTabVisible;
    return;
  }

  const patchedActivate = function (...args) {
    try {
      patchedActivate.__eidolonEnsureVisible?.();
    } catch (error) {
      debugLog("Time trigger tab visibility enforcement failed", {
        reason: "tab-group-activate",
        message: error?.message ?? String(error)
      });
    }

    if (typeof patchedActivate.__eidolonOriginal === "function") {
      return patchedActivate.__eidolonOriginal.apply(this, args);
    }
    return undefined;
  };

  patchedActivate.__eidolonTimeTriggerPatch = true;
  patchedActivate.__eidolonOriginal = typeof existingActivate === "function" ? existingActivate : null;
  patchedActivate.__eidolonEnsureVisible = ensureTabVisible;

  callbacks.activate = patchedActivate;
}

function patchLegacyTabsActivate(binding, ensureTabVisible) {
  if (!binding || typeof ensureTabVisible !== "function") return;

  const existingCallback = binding.callback;

  if (typeof existingCallback === "function" && existingCallback.__eidolonTimeTriggerPatch) {
    existingCallback.__eidolonEnsureVisible = ensureTabVisible;
    return;
  }

  const patchedCallback = function (...args) {
    try {
      patchedCallback.__eidolonEnsureVisible?.();
    } catch (error) {
      debugLog("Time trigger tab visibility enforcement failed", {
        reason: "legacy-tabs-activate",
        message: error?.message ?? String(error)
      });
    }

    if (typeof patchedCallback.__eidolonOriginal === "function") {
      return patchedCallback.__eidolonOriginal.apply(this, args);
    }
    return undefined;
  };

  patchedCallback.__eidolonTimeTriggerPatch = true;
  patchedCallback.__eidolonOriginal = typeof existingCallback === "function" ? existingCallback : null;
  patchedCallback.__eidolonEnsureVisible = ensureTabVisible;

  binding.callback = patchedCallback;
}

function renderTimeTriggersTabContent(app, tabElement) {
  const scene = getSceneFromApplication(app);
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
    const missingTime = escapeHtml(localize("EIDOLON.TimeTrigger.MissingTime", "(No time set)"));
    const descriptionHint = escapeHtml(description);
    const hideWindowHint = escapeHtml(hideWindowDescription);
    const showPlayerWindowHint = escapeHtml(showPlayerWindowDescription);

    const triggerNowTooltip = escapeHtml(triggerNowLabel);
    const editTooltip = escapeHtml(editLabel);
    const deleteTooltip = escapeHtml(deleteLabel);

    const triggerItems = triggers.map((trigger, index) => {
      const formattedTimeRaw = trigger.time ? formatTriggerTimeForDisplay(trigger.time) : "";
      const formattedTime = formattedTimeRaw || trigger.time || "";
      const timeText = formattedTime ? escapeHtml(formattedTime) : missingTime;
      const actionLabel = escapeHtml(getActionLabel(trigger.action));

      const summaryParts = [
        `${atLabel} ${timeText}`,
        `${doLabel} ${actionLabel}`,
        ...buildActionSummaryParts(trigger)
      ];

      return `
        <li class="time-trigger-item" data-index="${index}">
          <div class="time-trigger-summary">${summaryParts.join(" &bull; ")}</div>
          <div class="time-trigger-controls">
            <button
              type="button"
              class="icon"
              data-action="fire-trigger"
              data-index="${index}"
              aria-label="${triggerNowTooltip}"
              title="${triggerNowTooltip}"
              data-tooltip="${triggerNowTooltip}"
            >
              <i class="fa-solid fa-play"></i>
            </button>
            <button
              type="button"
              class="icon"
              data-action="edit-trigger"
              data-index="${index}"
              aria-label="${editTooltip}"
              title="${editTooltip}"
              data-tooltip="${editTooltip}"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              type="button"
              class="icon"
              data-action="delete-trigger"
              data-index="${index}"
              aria-label="${deleteTooltip}"
              title="${deleteTooltip}"
              data-tooltip="${deleteTooltip}"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>`;
    });

    const listContent =
      triggerItems.length > 0
        ? `<ul class="time-trigger-list">${triggerItems.join("")}</ul>`
        : `<p class="notes">${emptyLabel}</p>`;

    tabElement.innerHTML = `
      <div class="form-group stacked time-trigger-activate">
        <label class="checkbox">
          <input type="checkbox" name="${flagPath}" ${isActive ? "checked" : ""}>
          ${activateLabel}
        </label>
        <p class="hint">${descriptionHint}</p>
      </div>
      <div class="form-group stacked time-trigger-hide-window">
        <label class="checkbox">
          <input type="checkbox" name="${hideWindowFlagPath}" ${shouldHideWindow ? "checked" : ""}>
          ${hideWindowLabel}
        </label>
        <p class="hint">${hideWindowHint}</p>
      </div>
      <div class="form-group stacked time-trigger-show-player-window">
        <label class="checkbox">
          <input type="checkbox" name="${showPlayerWindowFlagPath}" ${shouldShowPlayerWindow ? "checked" : ""}>
          ${showPlayerWindowLabel}
        </label>
        <p class="hint">${showPlayerWindowHint}</p>
      </div>
      <hr>
      <div class="form-group time-trigger-management">
        <label>${triggerListLabel}</label>
        <div class="time-trigger-entries">
          ${listContent}
          <button type="button" class="time-trigger-add" data-action="add-trigger">${addLabel}</button>
        </div>
      </div>`;

    bindTimeTriggerTabEvents(app, tabElement);
  } finally {
    debugGroupEnd();
  }
}

function bindTimeTriggerTabEvents(app, tabElement) {
  const scene = getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) return;

  const addButton = tabElement.querySelector('[data-action="add-trigger"]');
  if (addButton) {
    addButton.addEventListener("click", () => {
      debugLog("Add trigger button clicked", { sceneId: scene.id });
      openTriggerForm(app);
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
      openTriggerForm(app, { trigger, triggerIndex: index });
    });
  });

  tabElement.querySelectorAll('[data-action="delete-trigger"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      const triggers = getTimeTriggers(scene);
      if (!triggers[index]) return;
      triggers.splice(index, 1);
      try {
        debugLog("Deleting trigger", { sceneId: scene.id, index, triggerId: triggers[index]?.id ?? null });
        await setTimeTriggers(scene, triggers);
        renderTimeTriggersTabContent(app, tabElement);
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
  const scene = getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) {
    console.warn(`${MODULE_ID} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  debugLog("Opening trigger form", {
    sceneId: scene.id,
    triggerId: options.trigger?.id ?? null,
    index: Number.isInteger(options.triggerIndex) ? Number(options.triggerIndex) : null
  });
  const form = new TriggerFormApplication({
    scene,
    trigger: options.trigger ?? null,
    triggerIndex: options.triggerIndex ?? null,
    onSave: () => {
      const tab = app.element?.[0]?.querySelector('.tab[data-tab="time-triggers"]');
      if (tab) {
        renderTimeTriggersTabContent(app, tab);
      }
    }
  });
  form.render({ force: true });
}

function registerSceneConfigTimeFormatSubscription(app, tabElement) {
  if (!app) return;
  disposeSceneConfigTimeFormatSubscription(app);
  if (!(tabElement instanceof HTMLElement)) return;

  const unsubscribe = onTimeFormatSettingChange(() => {
    if (!(tabElement instanceof HTMLElement)) return;
    try {
      renderTimeTriggersTabContent(app, tabElement);
    } catch (error) {
      debugLog("Failed to refresh time triggers tab after time format change", {
        sceneId: getSceneFromApplication(app)?.id ?? null,
        message: error?.message ?? String(error)
      });
    }
  });

  app[TIME_FORMAT_SUBSCRIPTION_SYMBOL] = unsubscribe;
}

function disposeSceneConfigTimeFormatSubscription(app) {
  if (!app) return;
  const unsubscribe = app?.[TIME_FORMAT_SUBSCRIPTION_SYMBOL];
  if (typeof unsubscribe === "function") {
    try {
      unsubscribe();
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to dispose scene config time format subscription`, error);
    }
  }
  app[TIME_FORMAT_SUBSCRIPTION_SYMBOL] = null;
}

function resolveTabGroupState(app, groupName) {
  const result = { controller: null, active: null };
  if (!app) return result;

  const groups = app.tabGroups;
  if (!groups) return result;

  const normalize = (entry) => {
    if (!entry) return result;
    if (typeof entry === "string") {
      return { controller: null, active: entry };
    }
    if (typeof entry === "object") {
      return { controller: entry, active: entry?.active ?? null };
    }
    return result;
  };

  if (typeof groups.get === "function") {
    const entry = groups.get(groupName);
    if (entry !== undefined) {
      return normalize(entry);
    }
  }

  return normalize(groups[groupName]);
}

function getTabGroupActiveId(app, groupName) {
  return resolveTabGroupState(app, groupName).active;
}

function getFirstTabGroupName(app) {
  if (!app?.tabGroups) return undefined;

  const groups = app.tabGroups;
  if (typeof groups.keys === "function") {
    const iterator = groups.keys();
    if (iterator && typeof iterator.next === "function") {
      const { value, done } = iterator.next();
      if (!done) return value;
    }
  }

  const keys = Object.keys(groups ?? {});
  return keys.length > 0 ? keys[0] : undefined;
}

function findFooterElement(container) {
  if (!(container instanceof HTMLElement)) return null;

  const selectors = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];

  for (const selector of selectors) {
    const candidate = container.querySelector(selector);
    if (candidate instanceof HTMLElement) return candidate;
  }

  return null;
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
