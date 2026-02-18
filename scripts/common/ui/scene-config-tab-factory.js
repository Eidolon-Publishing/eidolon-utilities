import { asHTMLElement, isAppV2, setActiveTab } from "./foundry-compat.js";

const V13_PATCHED_SYMBOL = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");

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
 * @param {string} [options.moduleId="eidolon-utilities"] Module ID for template paths.
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
    logger = {},
    moduleId = "eidolon-utilities",
    tabIcon = "fa-solid fa-puzzle-piece"
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

  // ── v13 init-time patching ──────────────────────────────────────────

  function patchV13SceneConfig() {
    const SceneConfigClass =
      foundry?.applications?.sheets?.SceneConfig ?? CONFIG?.Scene?.sheetClass;
    if (!SceneConfigClass) return;
    if (!isAppV2({ changeTab: SceneConfigClass.prototype?.changeTab })) return;

    const patchedSet = SceneConfigClass[V13_PATCHED_SYMBOL] ?? new Set();
    if (patchedSet.has(tabId)) return;
    patchedSet.add(tabId);
    SceneConfigClass[V13_PATCHED_SYMBOL] = patchedSet;

    // Push tab into the "sheet" tab group
    const sheetGroup = SceneConfigClass.TABS?.sheet;
    if (sheetGroup && Array.isArray(sheetGroup.tabs)) {
      if (!sheetGroup.tabs.some((t) => t.id === tabId)) {
        sheetGroup.tabs.push({
          id: tabId,
          icon: tabIcon
        });
      }
    }

    // Patch static PARTS
    if (SceneConfigClass.PARTS && !SceneConfigClass.PARTS[tabId]) {
      SceneConfigClass.PARTS[tabId] = {
        template: `modules/${moduleId}/templates/scene-config-tab-mount.hbs`,
        scrollable: [`.tab[data-tab="${tabId}"]`]
      };
    }

    log("Patched v13 SceneConfig TABS/PARTS", { tabId });
  }

  // ── Render dispatch ─────────────────────────────────────────────────

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
      const root = asHTMLElement(html) ?? asHTMLElement(app.element);
      if (!root) {
        log("Missing root element", { tabId });
        return;
      }

      if (isAppV2(app)) {
        handleRenderV2(app, root, scene);
      } else {
        handleRenderV1(app, root, scene);
      }
    } finally {
      groupEnd();
    }
  }

  // ── Button content helper ────────────────────────────────────────────

  /** Set tab button content, matching native structure for v12 and v13. */
  function setButtonContent(button, label, v2) {
    if (!tabIcon) {
      button.textContent = label;
      return;
    }
    const existingIcon = button.querySelector("i")?.cloneNode(true);
    button.textContent = "";
    const icon = existingIcon ?? document.createElement("i");
    if (!existingIcon) {
      icon.className = tabIcon;
      if (v2) icon.inert = true;
    }
    button.append(icon, " ");
    if (v2) {
      const span = document.createElement("span");
      span.textContent = label;
      button.append(span);
    } else {
      button.append(document.createTextNode(label));
    }
  }

  // ── v12 AppV1 path ──────────────────────────────────────────────────

  function handleRenderV1(app, root, scene) {
    const navSelectors = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ];
    const nav = navSelectors
      .map((selector) => root.querySelector(selector))
      .find((element) => element instanceof HTMLElement);

    const bodyCandidates = [
      root.querySelector(".tab[data-tab]")?.parentElement,
      root.querySelector(".sheet-body"),
      nav?.parentElement?.querySelector?.(":scope > .sheet-body"),
      nav?.parentElement
    ];
    const body = bodyCandidates.find((candidate) => candidate instanceof HTMLElement);

    const groupName =
      nav?.dataset?.group ??
      nav?.querySelector?.("a[data-group]")?.dataset?.group ??
      nav?.querySelector?.("[data-group]")?.dataset?.group ??
      body?.querySelector?.(".tab[data-group]")?.dataset?.group ??
      "main";

    if (!nav || !body) {
      log("Missing navigation elements", {
        tabId,
        hasNav: Boolean(nav),
        hasBody: Boolean(body)
      });
      return;
    }

    // Create or find tab button
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

    setButtonContent(tabButton, renderLabel({ app, scene }) ?? tabId, isAppV2(app));

    // Create or find tab panel
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

    // Determine active state from DOM classes
    const isActiveInitial =
      tabButton.classList?.contains("active") || tab.classList.contains("active");

    if (isActiveInitial) {
      tabButton.classList.add("active");
      tab.classList.add("active");
      tab.removeAttribute("hidden");
    } else {
      tabButton.classList.remove("active");
      tab.classList.remove("active");
      tab.setAttribute("hidden", "true");
    }

    // Visibility helpers
    const ensureTabVisible = () => {
      const isActive =
        tabButton.classList?.contains("active") || tab.classList.contains("active");
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
      ensureTabVisible();
      requestAnimationFrame(ensureTabVisible);
    };

    // Click handler — use public API
    if (!tabButton.dataset.eidolonEnsureSceneTabVisibility) {
      tabButton.addEventListener("click", () => {
        setActiveTab(app, tabId, groupName);
        requestAnimationFrame(ensureTabVisible);
      });
      tabButton.dataset.eidolonEnsureSceneTabVisibility = "true";
    }

    // Render content
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
  }

  // ── v13 AppV2 path ──────────────────────────────────────────────────

  function handleRenderV2(app, root, scene) {
    const tab = root.querySelector(`.tab[data-tab="${tabId}"]`);
    const tabButton = root.querySelector(`nav [data-tab="${tabId}"]`);

    if (!tab || !tabButton) {
      log("v2 mount not found, falling back to v1 injection", { tabId });
      handleRenderV1(app, root, scene);
      return;
    }

    setButtonContent(tabButton, renderLabel({ app, scene }) ?? tabId, true);

    // ensureTabVisible / scheduleEnsureTabVisible are lightweight for AppV2
    // since Foundry's own tab machinery handles visibility
    const ensureTabVisible = () => {
      if (!tabButton.classList?.contains("active") && !tab.classList.contains("active")) return;
      tab.classList.add("active");
      tab.removeAttribute("hidden");
      tab.removeAttribute("aria-hidden");
      if (tab.style.display === "none") {
        tab.style.display = "";
      }
    };

    const scheduleEnsureTabVisible = () => {
      ensureTabVisible();
      requestAnimationFrame(ensureTabVisible);
    };

    // Render content
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
  }

  // ── Lifecycle ───────────────────────────────────────────────────────

  function handleClose(app) {
    invokeCleanup(app, cleanupSymbol, log);
  }

  function register() {
    Hooks.once("init", () => {
      patchV13SceneConfig();
    });
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

// ── Internals (kept) ────────────────────────────────────────────────

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
