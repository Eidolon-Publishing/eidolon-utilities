const TAB_GROUP_PATCH_SYMBOL = Symbol("EIDOLON_SCENE_CONFIG_TAB_GROUP_PATCH");

/**
 * Create a SceneConfig tab factory that manages DOM injection and visibility hooks.
 * @param {object} options
 * @param {string} options.tabId Unique identifier for the tab.
 * @param {string|Function} [options.tabLabel] Label or callback returning label markup.
 * @param {(app: Application) => Scene|null} options.getScene Resolves the scene for the config.
 * @param {(app: Application, scene: Scene|null) => boolean} [options.isApplicable] Optional guard.
 * @param {(context: object) => (void|Function)} options.renderContent Renders the tab and returns optional cleanup.
 * @param {object} [options.logger] Optional logger with `log`, `group`, and `groupEnd` functions.
 * @param {Function} [options.onButtonCreate] Invoked when the tab button is created.
 * @param {Function} [options.onTabCreate] Invoked when the tab container is created.
 * @param {Function} [options.onAfterRender] Invoked after render completes.
 * @param {string} [options.debugNamespace="SceneConfigTab"] Label used in log output.
 */
export function createSceneConfigTabFactory(options = {}) {
  const {
    tabId,
    tabLabel,
    getScene,
    isApplicable,
    renderContent,
    debugNamespace = "SceneConfigTab",
    onButtonCreate,
    onTabCreate,
    onAfterRender,
    logger = {}
  } = options ?? {};

  if (!tabId) {
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  }
  if (typeof renderContent !== "function") {
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  }

  const log =
    typeof logger.log === "function"
      ? logger.log.bind(logger)
      : (...args) => console.debug?.(`${debugNamespace}`, ...args);
  const group =
    typeof logger.group === "function"
      ? logger.group.bind(logger)
      : (...args) => console.groupCollapsed?.(`${debugNamespace}`, ...args);
  const groupEnd =
    typeof logger.groupEnd === "function"
      ? logger.groupEnd.bind(logger)
      : () => console.groupEnd?.();

  const cleanupSymbol = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${tabId}`);

  const resolveScene = typeof getScene === "function" ? getScene : () => null;
  const canApply = typeof isApplicable === "function" ? isApplicable : () => true;

  const renderLabel =
    typeof tabLabel === "function"
      ? tabLabel
      : () => (typeof tabLabel === "string" ? tabLabel : tabId);

  function handleRender(app, html) {
    const scene = resolveScene(app);
    if (!canApply(app, scene)) {
      log("Skipped render", {
        tabId,
        reason: "inapplicable",
        constructor: app?.constructor?.name ?? null
      });
      return;
    }

    group("render", {
      tabId,
      sceneId: scene?.id ?? null,
      constructor: app?.constructor?.name ?? null
    });

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
        log("Missing root element", { tabId });
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
        log("Missing navigation elements", {
          tabId,
          hasNav: Boolean(nav),
          hasBody: Boolean(body)
        });
        return;
      }

      let tabButton = nav.querySelector(`[data-tab="${tabId}"]`);
      if (!tabButton) {
        tabButton = document.createElement("a");
        tabButton.dataset.action = "tab";
        tabButton.dataset.group = groupName;
        tabButton.dataset.tab = tabId;
        const referenceTab = nav.querySelector("a[data-tab]");
        if (referenceTab?.classList?.contains("item")) {
          tabButton.classList.add("item");
        }
        nav.appendChild(tabButton);
        if (typeof onButtonCreate === "function") {
          onButtonCreate({ app, button: tabButton, nav, scene });
        }
        log("Created tab button", { tabId, group: groupName });
      }

      tabButton.innerHTML = renderLabel({ app, scene }) ?? tabId;

      let tab = body.querySelector(`.tab[data-tab="${tabId}"]`);
      if (!tab) {
        tab = document.createElement("div");
        tab.classList.add("tab");
        tab.dataset.tab = tabId;
        tab.dataset.group = groupName;
        const footer = findFooterElement(body);
        body.insertBefore(tab, footer ?? null);
        if (typeof onTabCreate === "function") {
          onTabCreate({ app, tab, body, scene });
        }
        log("Created tab container", { tabId, group: groupName });
      }

      const isActiveInitial =
        tabButton.classList?.contains("active") ||
        tab.classList.contains("active") ||
        getTabGroupActiveId(app, groupName) === tabId;

      if (isActiveInitial) {
        tabButton.classList.add("active");
        tab.classList.add("active");
        tab.removeAttribute("hidden");
      } else {
        tabButton.classList.remove("active");
        tab.classList.remove("active");
        tab.setAttribute("hidden", "true");
      }

      const ensureTabVisible = () => {
        const activeTabId = getTabGroupActiveId(app, groupName);
        const isActive =
          activeTabId === tabId ||
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
          log("Ensure visible failed", {
            reason: "ensure-visible",
            message: error?.message ?? String(error)
          });
        }

        const rerun = () => {
          try {
            ensureTabVisible();
          } catch (error) {
            log("Ensure visible rerun failed", {
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

      if (!tabButton.dataset.eidolonEnsureSceneTabVisibility) {
        tabButton.addEventListener("click", scheduleEnsureTabVisible);
        tabButton.dataset.eidolonEnsureSceneTabVisibility = "true";
      }

      const tabGroupState = resolveTabGroupState(app, groupName);
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

      if (tabGroupState?.controller?.bind) {
        patchTabGroupActivate(tabGroupState.controller, ensureTabVisible, log);
        const targetElement = bindTargetElement ?? bindTargetJQuery?.[0] ?? rootElement;
        if (targetElement instanceof HTMLElement) {
          tabGroupState.controller.bind(targetElement);
        }
        scheduleEnsureTabVisible();
      } else {
        const legacyBinding =
          app._tabs?.find?.((binding) => binding?.group === groupName) ?? app._tabs?.[0];
        patchLegacyTabsActivate(legacyBinding, ensureTabVisible, log);
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
              log("Legacy tab bind failed", {
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

      invokeCleanup(app, cleanupSymbol, log);

      const cleanup = renderContent({
        app,
        scene,
        tab,
        tabButton,
        ensureTabVisible,
        scheduleEnsureTabVisible
      });

      if (typeof cleanup === "function") {
        registerCleanup(app, cleanupSymbol, cleanup);
      }

      if (typeof onAfterRender === "function") {
        onAfterRender({
          app,
          scene,
          tab,
          tabButton,
          ensureTabVisible,
          scheduleEnsureTabVisible
        });
      }

      app.setPosition?.({ height: "auto" });
    } finally {
      groupEnd();
    }
  }

  function handleClose(app) {
    invokeCleanup(app, cleanupSymbol, log);
  }

  function register() {
    Hooks.on("renderSceneConfig", handleRender);
    Hooks.on("closeSceneConfig", handleClose);
    return () => unregister();
  }

  function unregister() {
    Hooks.off("renderSceneConfig", handleRender);
    Hooks.off("closeSceneConfig", handleClose);
  }

  return { register, unregister };
}

function registerCleanup(app, symbol, cleanup) {
  if (!app || typeof cleanup !== "function") return;
  const existing = app?.[symbol];
  if (!Array.isArray(existing)) {
    app[symbol] = [];
  }
  app[symbol].push(cleanup);
}

function invokeCleanup(app, symbol, log) {
  if (!app) return;
  const stack = app?.[symbol];
  if (!Array.isArray(stack)) return;

  while (stack.length > 0) {
    const cleanup = stack.pop();
    if (typeof cleanup !== "function") continue;
    try {
      cleanup();
    } catch (error) {
      log("Cleanup failed", { message: error?.message ?? String(error) });
    }
  }
}

export function patchTabGroupActivate(tabGroup, ensureTabVisible, log = () => {}) {
  if (!tabGroup || typeof ensureTabVisible !== "function") return;

  if (typeof tabGroup.on === "function") {
    const patchState = tabGroup[TAB_GROUP_PATCH_SYMBOL] ?? {};
    patchState.ensure = ensureTabVisible;
    if (!patchState.listener) {
      patchState.listener = () => {
        try {
          patchState.ensure?.();
        } catch (error) {
          log("Tab group activation failed", {
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

  if (typeof existingActivate === "function" && existingActivate.__eidolonSceneTabPatch) {
    existingActivate.__eidolonEnsureVisible = ensureTabVisible;
    return;
  }

  const patchedActivate = function (...args) {
    try {
      patchedActivate.__eidolonEnsureVisible?.();
    } catch (error) {
      log("Tab group ensure visible failed", {
        reason: "tab-group-activate",
        message: error?.message ?? String(error)
      });
    }

    if (typeof patchedActivate.__eidolonOriginal === "function") {
      return patchedActivate.__eidolonOriginal.apply(this, args);
    }
    return undefined;
  };

  patchedActivate.__eidolonSceneTabPatch = true;
  patchedActivate.__eidolonOriginal =
    typeof existingActivate === "function" ? existingActivate : null;
  patchedActivate.__eidolonEnsureVisible = ensureTabVisible;

  callbacks.activate = patchedActivate;
}

export function patchLegacyTabsActivate(binding, ensureTabVisible, log = () => {}) {
  if (!binding || typeof ensureTabVisible !== "function") return;

  const existingCallback = binding.callback;

  if (typeof existingCallback === "function" && existingCallback.__eidolonSceneTabPatch) {
    existingCallback.__eidolonEnsureVisible = ensureTabVisible;
    return;
  }

  const patchedCallback = function (...args) {
    try {
      patchedCallback.__eidolonEnsureVisible?.();
    } catch (error) {
      log("Legacy tabs ensure visible failed", {
        reason: "legacy-tabs-activate",
        message: error?.message ?? String(error)
      });
    }

    if (typeof patchedCallback.__eidolonOriginal === "function") {
      return patchedCallback.__eidolonOriginal.apply(this, args);
    }
    return undefined;
  };

  patchedCallback.__eidolonSceneTabPatch = true;
  patchedCallback.__eidolonOriginal =
    typeof existingCallback === "function" ? existingCallback : null;
  patchedCallback.__eidolonEnsureVisible = ensureTabVisible;

  binding.callback = patchedCallback;
}

export function resolveTabGroupState(app, groupName) {
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

export function getTabGroupActiveId(app, groupName) {
  return resolveTabGroupState(app, groupName).active;
}

export function getFirstTabGroupName(app) {
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

export function findFooterElement(container) {
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

