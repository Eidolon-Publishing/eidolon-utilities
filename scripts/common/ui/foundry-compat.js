/**
 * Normalize the `html` parameter from Foundry render hooks.
 * v12 AppV1 passes a jQuery-like array; v13 AppV2 passes an HTMLElement directly.
 * @param {HTMLElement|object} html
 * @returns {HTMLElement|null}
 */
export function asHTMLElement(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

/**
 * Detect whether an application instance is Foundry's ApplicationV2 (v13+).
 * @param {object} app
 * @returns {boolean}
 */
export function isAppV2(app) {
  return typeof app?.changeTab === "function";
}

/**
 * Activate a tab on an application using the correct API for the Foundry version.
 * AppV2 exposes `changeTab()`; AppV1 exposes `activateTab()`.
 * @param {object} app
 * @param {string} tabId
 * @param {string} [group]
 * @param {object} [opts]
 */
export function setActiveTab(app, tabId, group, opts = {}) {
  if (isAppV2(app)) {
    // AppV2: changeTab(tab, group, options)
    app.changeTab(tabId, group, opts);
    return;
  }
  if (typeof app?.activateTab === "function") {
    // AppV1: activateTab(tabName, { group, triggerCallback })
    const options = { ...opts };
    if (group != null) {
      // Validate that the group exists in _tabs before passing it —
      // DOM data-group may not match the internal Tabs group (timing, modules, etc.)
      const groupExists =
        Array.isArray(app._tabs) && app._tabs.some((t) => t._group === group);
      if (groupExists) {
        options.group = group;
      }
      // If group not found, omit it — activateTab's default will be used
    }
    if (options.triggerCallback == null) options.triggerCallback = true;
    try {
      app.activateTab(tabId, options);
    } catch {
      // activateTab failed — fall back to manual DOM tab switching
      _manualTabActivation(app, tabId);
    }
  }
}

/** DOM-only tab activation fallback when activateTab throws. */
function _manualTabActivation(app, tabId) {
  const root = app.element?.[0] ?? app.element;
  if (!(root instanceof HTMLElement)) return;
  // Deactivate sibling tabs
  const nav = root.querySelector("nav.sheet-tabs") ?? root.querySelector("nav.tabs");
  if (nav) {
    nav.querySelectorAll("[data-tab]").forEach((btn) => btn.classList.remove("active"));
  }
  root.querySelectorAll(".tab[data-tab]").forEach((tab) => {
    tab.classList.remove("active");
    tab.setAttribute("hidden", "true");
  });
  // Activate target
  const button = nav?.querySelector(`[data-tab="${tabId}"]`);
  const panel = root.querySelector(`.tab[data-tab="${tabId}"]`);
  button?.classList.add("active");
  if (panel) {
    panel.classList.add("active");
    panel.removeAttribute("hidden");
  }
}

/**
 * Read form data using FormDataExtended, resolving the class across v12 (global) and v13 (namespaced).
 * Returns an expanded plain object of the form's current values.
 * @param {HTMLFormElement} form
 * @returns {object}
 */
export function readFormData(form) {
  if (!(form instanceof HTMLFormElement)) return {};

  const FormDataExtendedClass =
    foundry?.applications?.ux?.FormDataExtended ??
    globalThis.FormDataExtended ??
    null;

  if (!FormDataExtendedClass) return {};

  try {
    const fd = new FormDataExtendedClass(form);
    const raw = typeof fd.object === "object" ? fd.object : {};
    return foundry.utils.expandObject(raw);
  } catch {
    return {};
  }
}
