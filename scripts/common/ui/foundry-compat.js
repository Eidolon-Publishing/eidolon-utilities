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
    if (group != null) options.group = group;
    if (options.triggerCallback == null) options.triggerCallback = true;
    app.activateTab(tabId, options);
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
