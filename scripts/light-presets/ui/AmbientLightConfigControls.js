import { getObjectVariantCategories } from "../../object-variants/core/storage.js";
import { localize } from "../../time-triggers/core/utils.js";
import {
  getLightPresetState,
  storeDefaultPreset,
  upsertLightPreset,
  sanitizeLightConfigPayload,
  computePresetKey,
  storeCurrentPresetSelection
} from "../core/storage.js";
import { MODULE_ID, FLAG_LIGHT_PRESETS } from "../core/constants.js";
import { debugGroup, debugGroupEnd, debugLog } from "../../time-triggers/core/debug.js";
import { asHTMLElement, readFormData } from "../../common/ui/foundry-compat.js";

const creationState = new WeakMap();
const PRESET_SELECT_VALUE_DEFAULT = "__eidolon_default__";

export function registerAmbientLightConfigControls() {
  Hooks.on("renderAmbientLightConfig", handleAmbientLightConfigRender);
  debugLog("LightPresets | AmbientLightConfig controls registered");
}

function handleAmbientLightConfigRender(app, html) {
  debugGroup("LightPresets | renderAmbientLightConfig", {
    appId: app?.id ?? null,
    constructor: app?.constructor?.name ?? null,
    isRendered: app?.rendered ?? false
  });
  try {
    const root = asHTMLElement(html);
    if (!root) return;

    enhanceAmbientLightConfig(app, root);
  } catch (error) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", error);
  } finally {
    debugGroupEnd();
  }
}

function enhanceAmbientLightConfig(app, root) {
  const form =
    app?.form instanceof HTMLFormElement
      ? app.form
      : root instanceof HTMLFormElement
      ? root
      : root?.closest?.("form");
  if (!(form instanceof HTMLFormElement)) return;

  const windowContent = form.querySelector(".window-content");
  if (!(windowContent instanceof HTMLElement)) return;

  const ambientLight = getAmbientLightDocument(app);
  if (!ambientLight) return;
  const persistedLight = getPersistedAmbientLightDocument(ambientLight);
  debugLog("LightPresets | Resolved ambient light", {
    sheetId: ambientLight?.id ?? null,
    persistedId: persistedLight?.id ?? null,
    sameRef: ambientLight === persistedLight
  });

  const scene = persistedLight?.parent ?? ambientLight.parent ?? null;
  const categoriesRaw = scene ? getObjectVariantCategories(scene) : [];
  const categoriesWithValues = categoriesRaw.filter(
    (category) => Array.isArray(category?.values) && category.values.length > 0
  );
  const categoryNameLookup = buildCategoryNameLookup(categoriesRaw);

  const state = getLightPresetState(persistedLight ?? ambientLight);
  debugLog("LightPresets | Loaded preset state", {
    hasDefault: Boolean(state?.default),
    presetCount: Array.isArray(state?.presets) ? state.presets.length : 0,
    presets: Array.isArray(state?.presets)
      ? state.presets.map((preset) => ({
          id: preset.id,
          key: preset.key,
          hasColor: Boolean(preset.config?.config?.color)
        }))
      : []
  });

  const existingFieldset = windowContent.querySelector(".eidolon-light-presets");
  if (existingFieldset) {
    existingFieldset.remove();
  }

  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("eidolon-light-presets");

  const legend = document.createElement("legend");
  legend.textContent = localize("EIDOLON.LightPresets.Legend", "Light Presets");
  fieldset.appendChild(legend);

  const description = document.createElement("p");
  description.classList.add("notes");
  description.textContent = localize(
    "EIDOLON.LightPresets.Description",
    "Capture default lighting and register presets tied to scene variant values."
  );
  fieldset.appendChild(description);

  const controlsRow = document.createElement("div");
  controlsRow.classList.add("eidolon-light-presets__controls");

  const makeDefaultButton = document.createElement("button");
  makeDefaultButton.type = "button";
  makeDefaultButton.dataset.action = "make-default";
  makeDefaultButton.classList.add("eidolon-light-presets__button");
  makeDefaultButton.textContent = localize(
    "EIDOLON.LightPresets.MakeDefault",
    "Make Default"
  );
  controlsRow.appendChild(makeDefaultButton);

  const createButton = document.createElement("button");
  createButton.type = "button";
  createButton.dataset.action = "create-preset";
  createButton.classList.add("eidolon-light-presets__button");
  createButton.textContent = localize(
    "EIDOLON.LightPresets.CreatePreset",
    "Create Preset"
  );
  createButton.setAttribute("aria-expanded", "false");
  controlsRow.appendChild(createButton);

  fieldset.appendChild(controlsRow);

  const statusLine = document.createElement("p");
  statusLine.classList.add("notes", "eidolon-light-presets__status");
  fieldset.appendChild(statusLine);

  const switcher = document.createElement("div");
  switcher.classList.add("eidolon-light-presets__switcher");

  const switcherLabel = document.createElement("label");
  switcherLabel.classList.add("eidolon-light-presets__switcher-label");
  const selectId = `${app?.id ?? ambientLight?.id ?? "eidolon-light"}-preset-select`;
  switcherLabel.htmlFor = selectId;
  switcherLabel.textContent = localize("EIDOLON.LightPresets.SelectLabel", "Preset");
  switcher.appendChild(switcherLabel);

  const switcherControls = document.createElement("div");
  switcherControls.classList.add("eidolon-light-presets__switcher-controls");
  switcher.appendChild(switcherControls);

  const presetSelect = document.createElement("select");
  presetSelect.id = selectId;
  presetSelect.classList.add("eidolon-light-presets__select");
  presetSelect.dataset.action = "select-preset";
  switcherControls.appendChild(presetSelect);

  const applyPresetButton = document.createElement("button");
  applyPresetButton.type = "button";
  applyPresetButton.dataset.action = "apply-selected-preset";
  applyPresetButton.classList.add("eidolon-light-presets__button", "secondary");
  applyPresetButton.textContent = localize("EIDOLON.LightPresets.ApplyButton", "Apply");
  switcherControls.appendChild(applyPresetButton);

  const updatePresetButton = document.createElement("button");
  updatePresetButton.type = "button";
  updatePresetButton.dataset.action = "update-selected-preset";
  updatePresetButton.classList.add("eidolon-light-presets__button", "secondary");
  updatePresetButton.textContent = localize(
    "EIDOLON.LightPresets.UpdateButton",
    "Save Changes"
  );
  switcherControls.appendChild(updatePresetButton);

  fieldset.appendChild(switcher);

  if (categoriesRaw.length === 0) {
    const warning = document.createElement("p");
    warning.classList.add("notification", "warning", "eidolon-light-presets__warning");
    warning.textContent = localize(
      "EIDOLON.LightPresets.NoCategoriesWarning",
      "This scene has no variant categories. Add categories under Scene → Variants to enable lighting presets."
    );
    fieldset.appendChild(warning);
  } else if (categoriesWithValues.length === 0) {
    const warning = document.createElement("p");
    warning.classList.add("notification", "warning", "eidolon-light-presets__warning");
    warning.textContent = localize(
      "EIDOLON.LightPresets.NoValuesWarning",
      "Variant categories exist, but none define selectable values. Add values in Scene → Variants."
    );
    fieldset.appendChild(warning);
  }

  const creationSection = document.createElement("div");
  creationSection.classList.add("eidolon-light-presets__creation");
  creationSection.dataset.section = "creation";
  creationSection.hidden = true;

  const selectionIntro = document.createElement("p");
  selectionIntro.classList.add("notes");
  selectionIntro.textContent = localize(
    "EIDOLON.LightPresets.CreateDescription",
    "Assign scene variant values to map the current configuration to a preset."
  );
  creationSection.appendChild(selectionIntro);

  const categoryList = document.createElement("div");
  categoryList.classList.add("eidolon-light-presets__category-list");
  creationSection.appendChild(categoryList);

  for (const category of categoriesWithValues) {
    const categoryRow = document.createElement("label");
    categoryRow.classList.add("eidolon-light-presets__category");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("eidolon-light-presets__category-name");
    nameSpan.textContent = category.name?.trim?.()
      ? category.name.trim()
      : localize("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category");
    categoryRow.appendChild(nameSpan);

    const select = document.createElement("select");
    select.dataset.categoryId = category.id;
    select.classList.add("eidolon-light-presets__category-select");

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = localize(
      "EIDOLON.LightPresets.IgnoreCategory",
      "Ignore"
    );
    select.appendChild(placeholderOption);

    for (const value of category.values) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }

    categoryRow.appendChild(select);
    categoryList.appendChild(categoryRow);
  }

  const creationActions = document.createElement("div");
  creationActions.classList.add("eidolon-light-presets__creation-actions");

  const savePresetButton = document.createElement("button");
  savePresetButton.type = "button";
  savePresetButton.dataset.action = "save-preset";
  savePresetButton.classList.add("eidolon-light-presets__button", "primary");
  savePresetButton.textContent = localize(
    "EIDOLON.LightPresets.SavePreset",
    "Save Preset"
  );
  creationActions.appendChild(savePresetButton);

  const cancelPresetButton = document.createElement("button");
  cancelPresetButton.type = "button";
  cancelPresetButton.dataset.action = "cancel-create";
  cancelPresetButton.classList.add("eidolon-light-presets__button", "secondary");
  cancelPresetButton.textContent = localize(
    "EIDOLON.LightPresets.Cancel",
    "Cancel"
  );
  creationActions.appendChild(cancelPresetButton);

  creationSection.appendChild(creationActions);
  fieldset.appendChild(creationSection);

  windowContent.appendChild(fieldset);
  requestAnimationFrame(() => {
    app.setPosition?.({ height: "auto" });
  });

  let currentState = state;
  updateStatusLine(statusLine, currentState);
  updateCreateButtonState(createButton, {
    state: currentState,
    hasCategories: categoriesWithValues.length > 0
  });
  debugLog("LightPresets | Controls injected", {
    sceneId: scene?.id ?? null,
    lightId: ambientLight?.id ?? null,
    hasDefault: Boolean(currentState?.default),
    presetCount: Array.isArray(currentState?.presets) ? currentState.presets.length : 0,
    categories: categoriesWithValues.length
  });

  const initialSelection = resolveInitialPresetSelection(currentState);
  const stateEntry = {
    restoreConfig: null,
    app,
    selectedPreset: initialSelection
  };
  creationState.set(fieldset, stateEntry);

  presetSelect.addEventListener("change", () => {
    stateEntry.selectedPreset = presetSelect.value ?? "";
    syncPresetSwitcherState({
      presetSelect,
      applyPresetButton,
      updatePresetButton,
      state: currentState
    });
  });

  const applySelectedPreset = async () => {
    const selectedValue = presetSelect.value ?? "";
    if (!selectedValue) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      );
      syncPresetSwitcherState({
        presetSelect,
        applyPresetButton,
        updatePresetButton,
        state: currentState
      });
      return;
    }

    if (selectedValue === PRESET_SELECT_VALUE_DEFAULT) {
      if (!currentState?.default) {
        ui.notifications?.warn?.(
          localize(
            "EIDOLON.LightPresets.DefaultUnavailable",
            "Save a default preset before applying it."
          )
        );
        return;
      }
      hideCreationSection(fieldset, creationSection, createButton);
      applyConfigToForm(app, form, currentState.default);
      currentState = await storeCurrentPresetSelection(persistedLight ?? ambientLight, {
        presetId: PRESET_SELECT_VALUE_DEFAULT,
        categories: null,
        updatedAt: Date.now()
      });
      stateEntry.selectedPreset = PRESET_SELECT_VALUE_DEFAULT;
      populatePresetSelector(presetSelect, currentState, categoryNameLookup, stateEntry.selectedPreset);
      stateEntry.selectedPreset = presetSelect.value ?? PRESET_SELECT_VALUE_DEFAULT;
      updateStatusLine(statusLine, currentState);
      updateCreateButtonState(createButton, {
        state: currentState,
        hasCategories: categoriesWithValues.length > 0
      });
      logAppliedColorState(form, {
        presetId: PRESET_SELECT_VALUE_DEFAULT,
        color: currentState.default?.config?.color ?? null
      });
      ui.notifications?.info?.(
        localize(
          "EIDOLON.LightPresets.DefaultApplied",
          "Applied the default preset to the form."
        )
      );
      syncPresetSwitcherState({
        presetSelect,
        applyPresetButton,
        updatePresetButton,
        state: currentState
      });
      return;
    }

    const preset =
      Array.isArray(currentState?.presets) && currentState.presets.length
        ? currentState.presets.find((entry) => entry?.id === selectedValue)
        : null;
    if (!preset) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightPresets.PresetUnavailable",
          "The selected preset is no longer available."
        )
      );
      populatePresetSelector(presetSelect, currentState, categoryNameLookup, "");
      stateEntry.selectedPreset = presetSelect.value ?? "";
      syncPresetSwitcherState({
        presetSelect,
        applyPresetButton,
        updatePresetButton,
        state: currentState
      });
      return;
    }

    hideCreationSection(fieldset, creationSection, createButton);
    applyConfigToForm(app, form, preset.config);
    currentState = await storeCurrentPresetSelection(persistedLight ?? ambientLight, {
      presetId: preset.id,
      categories: preset.categories,
      updatedAt: Date.now()
    });
    stateEntry.selectedPreset = preset.id;
    populatePresetSelector(presetSelect, currentState, categoryNameLookup, stateEntry.selectedPreset);
    stateEntry.selectedPreset = presetSelect.value ?? preset.id;
    updateStatusLine(statusLine, currentState);
    updateCreateButtonState(createButton, {
      state: currentState,
      hasCategories: categoriesWithValues.length > 0
    });
    logAppliedColorState(form, {
      presetId: preset.id,
      color: preset.config?.config?.color ?? null
    });
    const presetLabel = formatPresetOptionLabel(preset, categoryNameLookup);
    ui.notifications?.info?.(
      localize(
        "EIDOLON.LightPresets.PresetApplied",
        "Applied preset: {label}"
      ).replace("{label}", presetLabel)
    );
    syncPresetSwitcherState({
      presetSelect,
      applyPresetButton,
      updatePresetButton,
      state: currentState
    });
  };

  applyPresetButton.addEventListener("click", () => {
    void applySelectedPreset();
  });
  presetSelect.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void applySelectedPreset();
    }
  });

  const updateSelectedPreset = async () => {
    const selectedValue = stateEntry.selectedPreset;
    if (!selectedValue) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      );
      return;
    }

    updatePresetButton.disabled = true;
    try {
      const config = captureAmbientLightFormConfig(app, persistedLight);
      if (selectedValue === PRESET_SELECT_VALUE_DEFAULT) {
        currentState = await storeDefaultPreset(persistedLight ?? ambientLight, config);
        debugLog("LightPresets | Default preset updated", {
          lightId: (persistedLight ?? ambientLight)?.id ?? null,
          configColor: config?.config?.color ?? null
        });
        ui.notifications?.info?.(
          localize(
            "EIDOLON.LightPresets.DefaultUpdated",
            "Updated the default preset with the current configuration."
          )
        );
        stateEntry.selectedPreset = PRESET_SELECT_VALUE_DEFAULT;
      } else {
        const presetBefore = getPresetById(currentState, selectedValue);
        if (!presetBefore) {
          ui.notifications?.warn?.(
            localize(
              "EIDOLON.LightPresets.PresetUnavailable",
              "The selected preset is no longer available."
            )
          );
          populatePresetSelector(presetSelect, currentState, categoryNameLookup, "");
          stateEntry.selectedPreset = presetSelect.value ?? "";
          return;
        }

        currentState = await upsertLightPreset(
          persistedLight ?? ambientLight,
          presetBefore.categories,
          config,
          { label: presetBefore.label ?? null }
        );
        debugLog("LightPresets | Preset updated", {
          presetId: selectedValue,
          hasColor: Boolean(config?.config?.color),
          stored: Array.isArray(currentState?.presets)
            ? currentState.presets.find((preset) => preset?.id === selectedValue)?.config ?? null
            : null,
          persisted: (persistedLight ?? ambientLight)
            ?.getFlag?.(MODULE_ID, FLAG_LIGHT_PRESETS)
        });
        const presetAfter = getPresetById(currentState, selectedValue);
        const label = presetAfter
          ? formatPresetOptionLabel(presetAfter, categoryNameLookup)
          : formatPresetOptionLabel(presetBefore, categoryNameLookup);
        debugLog("LightPresets | Preset updated", {
          presetId: selectedValue,
          categories: presetBefore.categories,
          updatedColor: config?.config?.color ?? null,
          storedColor: presetAfter?.config?.config?.color ?? presetBefore.config?.config?.color ?? null
        });
        ui.notifications?.info?.(
          localize(
            "EIDOLON.LightPresets.PresetUpdated",
            "Saved changes to preset: {label}"
          ).replace("{label}", label)
        );
        stateEntry.selectedPreset = selectedValue;
      }

      updateStatusLine(statusLine, currentState);
      updateCreateButtonState(createButton, {
        state: currentState,
        hasCategories: categoriesWithValues.length > 0
      });
      populatePresetSelector(presetSelect, currentState, categoryNameLookup, stateEntry.selectedPreset);
      stateEntry.selectedPreset = presetSelect.value ?? "";
    } catch (error) {
      console.error("eidolon-utilities | Failed to update light preset", error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.LightPresets.PresetUpdateError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      updatePresetButton.disabled = false;
      syncPresetSwitcherState({
        presetSelect,
        applyPresetButton,
        updatePresetButton,
        state: currentState
      });
    }
  };

  updatePresetButton.addEventListener("click", () => {
    void updateSelectedPreset();
  });

  populatePresetSelector(presetSelect, currentState, categoryNameLookup, stateEntry.selectedPreset);
  stateEntry.selectedPreset = presetSelect.value ?? stateEntry.selectedPreset ?? "";
  syncPresetSwitcherState({
    presetSelect,
    applyPresetButton,
    updatePresetButton,
    state: currentState
  });

  makeDefaultButton.addEventListener("click", async () => {
    makeDefaultButton.disabled = true;
    try {
      const config = captureAmbientLightFormConfig(app, persistedLight);
      currentState = await storeDefaultPreset(persistedLight ?? ambientLight, config);
      debugLog("LightPresets | Default preset stored", {
        lightId: (persistedLight ?? ambientLight)?.id ?? null,
        configColor: config?.config?.color ?? null
      });
      ui.notifications?.info?.(
        localize(
          "EIDOLON.LightPresets.DefaultStored",
          "Saved the current configuration as the default preset."
        )
      );
      updateStatusLine(statusLine, currentState);
      updateCreateButtonState(createButton, {
        state: currentState,
        hasCategories: categoriesWithValues.length > 0
      });
      stateEntry.selectedPreset = PRESET_SELECT_VALUE_DEFAULT;
      populatePresetSelector(presetSelect, currentState, categoryNameLookup, stateEntry.selectedPreset);
      stateEntry.selectedPreset = presetSelect.value ?? "";
      syncPresetSwitcherState({
        presetSelect,
        applyPresetButton,
        updatePresetButton,
        state: currentState
      });
    } catch (error) {
      console.error("eidolon-utilities | Failed to store default light preset", error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.LightPresets.DefaultError",
          "Failed to save the default preset. Check the console for details."
        )
      );
    } finally {
      makeDefaultButton.disabled = false;
    }
  });

  createButton.addEventListener("click", () => {
    if (!currentState?.default) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightPresets.RequiresDefault",
          "Create a default preset before adding additional variants."
        )
      );
      return;
    }
    if (categoriesWithValues.length === 0) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightPresets.NoCategoriesAvailable",
          "Add variant categories with values in the Scene configuration before creating presets."
        )
      );
      return;
    }

    const stateEntry = creationState.get(fieldset);
    if (stateEntry) {
      stateEntry.restoreConfig = captureAmbientLightFormConfig(app, persistedLight);
    }

    applyConfigToForm(app, form, currentState.default);
    resetCategorySelections(categoryList);
    creationSection.hidden = false;
    createButton.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      app.setPosition?.({ height: "auto" });
    });
  });

  savePresetButton.addEventListener("click", async () => {
    const categoriesSelection = readCategorySelections(categoryList);
    if (!categoriesSelection) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightPresets.SelectionRequired",
          "Select at least one category value to identify the preset."
        )
      );
      return;
    }

    savePresetButton.disabled = true;
    try {
      const config = captureAmbientLightFormConfig(app, persistedLight);
      currentState = await upsertLightPreset(
        persistedLight ?? ambientLight,
        categoriesSelection,
        config,
        {}
      );
      debugLog("LightPresets | Preset saved from editor", {
        categories: categoriesSelection,
        configColor: config?.config?.color ?? null
      });
      ui.notifications?.info?.(
        localize(
          "EIDOLON.LightPresets.PresetSaved",
          "Updated lighting preset for the selected scene variants."
        )
      );
      updateStatusLine(statusLine, currentState);
      const updatedSelection = findPresetIdByCategories(currentState, categoriesSelection);
      if (updatedSelection) {
        stateEntry.selectedPreset = updatedSelection;
      }
      populatePresetSelector(presetSelect, currentState, categoryNameLookup, stateEntry.selectedPreset);
      stateEntry.selectedPreset = presetSelect.value ?? "";
      syncPresetSwitcherState({
        presetSelect,
        applyPresetButton,
        updatePresetButton,
        state: currentState
      });
      hideCreationSection(fieldset, creationSection, createButton);
    } catch (error) {
      console.error("eidolon-utilities | Failed to persist light preset", error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.LightPresets.PresetError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      savePresetButton.disabled = false;
    }
  });

  cancelPresetButton.addEventListener("click", () => {
    const stateEntry = creationState.get(fieldset);
    if (stateEntry?.restoreConfig) {
      applyConfigToForm(app, form, stateEntry.restoreConfig);
    }
    hideCreationSection(fieldset, creationSection, createButton);
  });
}

function hideCreationSection(fieldset, creationSection, createButton) {
  const stateEntry = creationState.get(fieldset);
  if (stateEntry) {
    stateEntry.restoreConfig = null;
  }
  creationSection.hidden = true;
  createButton.setAttribute("aria-expanded", "false");
  requestAnimationFrame(() => {
    stateEntry?.app?.setPosition?.({ height: "auto" });
  });
}

function updateStatusLine(statusElement, state) {
  if (!statusElement) return;

  const hasDefault = Boolean(state?.default);
  const presetCount = Array.isArray(state?.presets) ? state.presets.length : 0;

  const pieces = [];
  pieces.push(
    hasDefault
      ? localize(
          "EIDOLON.LightPresets.StatusDefaultSaved",
          "Default preset saved."
        )
      : localize(
          "EIDOLON.LightPresets.StatusDefaultMissing",
          "Default preset not yet saved."
        )
  );
  pieces.push(
    localize(
      "EIDOLON.LightPresets.StatusPresetCount",
      "Preset count: {count}"
    ).replace("{count}", String(presetCount))
  );
  statusElement.textContent = pieces.join(" ");
}

function updateCreateButtonState(button, { state, hasCategories }) {
  if (!button) return;
  const hasDefault = Boolean(state?.default);
  const enabled = hasDefault && hasCategories;
  button.disabled = !enabled;
  button.title = enabled
    ? ""
    : !hasDefault
    ? localize(
        "EIDOLON.LightPresets.CreateDisabledNoDefault",
        "Save a default preset before creating additional presets."
      )
    : localize(
        "EIDOLON.LightPresets.CreateDisabledNoCategories",
        "Add scene variant categories with values before creating presets."
      );
}

function captureAmbientLightFormConfig(app, persistedDocument) {
  const document = persistedDocument ?? getAmbientLightDocument(app);
  if (!document) {
    throw new Error("Ambient light document unavailable.");
  }

  const base = sanitizeLightConfigPayload(document.toObject?.() ?? {});
  if (!base) {
    throw new Error("Unable to duplicate ambient light data.");
  }

  const form = app?.form instanceof HTMLFormElement ? app.form : null;
  const expanded = form ? readFormData(form) : {};

  const merged = foundry.utils.mergeObject(base, expanded, {
    inplace: false,
    performDeletions: true
  });

  if (form) {
    form.querySelectorAll("color-picker[name]").forEach((picker) => {
      const path = picker.getAttribute("name");
      if (!path) return;
      const pickerValue = typeof picker.value === "string" ? picker.value : "";
      const colorInput = picker.ui?.input ?? picker.querySelector?.('input[type="color"]');
      const swatchValue = colorInput?.value ?? "";
      const value = pickerValue || swatchValue;
      if (typeof value !== "string" || !value) return;
      foundry.utils.setProperty(merged, path, value);
      debugLog("LightPresets | Captured color-picker value", {
        path,
        pickerValue,
        swatchValue,
        chosenValue: value
      });
    });

    form.querySelectorAll("range-picker[name]").forEach((picker) => {
      const path = picker.getAttribute("name");
      if (!path) return;
      const elementValue =
        picker.value !== undefined && picker.value !== null ? String(picker.value) : "";
      const rangeInput = picker.querySelector?.('input[type="range"]');
      const numberInput = picker.querySelector?.('input[type="number"]');
      const rangeValue = rangeInput instanceof HTMLInputElement ? rangeInput.value : "";
      const numberValue = numberInput instanceof HTMLInputElement ? numberInput.value : "";
      const chosenRaw = elementValue || numberValue || rangeValue;
      if (typeof chosenRaw !== "string" || !chosenRaw.length) return;
      const numeric = Number(chosenRaw);
      const chosenValue = Number.isFinite(numeric) ? numeric : chosenRaw;
      foundry.utils.setProperty(merged, path, chosenValue);
      debugLog("LightPresets | Captured range-picker value", {
        path,
        elementValue,
        numberValue,
        rangeValue,
        chosenValue
      });
    });
  }

  const sanitized = sanitizeLightConfigPayload(merged);
  debugLog("LightPresets | Captured form config", {
    lightId: document?.id ?? null,
    hasColor: Boolean(sanitized?.config?.color),
    color: sanitized?.config?.color ?? null
  });
  return sanitized;
}

function applyConfigToForm(app, form, config) {
  if (!config || typeof config !== "object") return;
  const flattened = foundry.utils.flattenObject(config, { safe: true });
  for (const [path, value] of Object.entries(flattened)) {
    const elements = form.querySelectorAll(`[name="${path}"]`);
    if (!elements.length) continue;
    debugLog("LightPresets | Applying field", {
      path,
      value,
      elementCount: elements.length
    });

    for (const element of elements) {
      if (element instanceof HTMLElement && element.tagName === "COLOR-PICKER") {
        applyValueToColorPicker(element, value, app);
      } else if (element instanceof HTMLElement && element.tagName === "RANGE-PICKER") {
        applyValueToRangePicker(element, value, app);
      } else if (element instanceof HTMLInputElement) {
        applyValueToInput(element, value, app);
      } else if (element instanceof HTMLSelectElement) {
        applyValueToSelect(element, value, app);
      } else if (element instanceof HTMLTextAreaElement) {
        applyValueToTextarea(element, value, app);
      }
    }
  }

  // Ensure AppV2 canvas preview updates after all fields are set
  requestAnimationFrame(() => app._previewChanges?.());
}

function applyValueToInput(input, value, app) {
  const type = input.type;
  if (type === "checkbox") {
    const nextChecked = Boolean(value);
    if (input.checked !== nextChecked) {
      input.checked = nextChecked;
      triggerInputChange(input);
    }
    return;
  }

  if (type === "radio") {
    const stringValue = value === undefined || value === null ? "" : String(value);
    const nextChecked = input.value === stringValue;
    if (input.checked !== nextChecked) {
      input.checked = nextChecked;
      if (nextChecked) {
        triggerInputChange(input);
      }
    }
    return;
  }

  const stringValue = value === undefined || value === null ? "" : String(value);
  let didChange = false;
  if (input.value !== stringValue) {
    input.value = stringValue;
    didChange = true;
  }

  if (didChange) {
    triggerInputChange(input);
  }
}

function applyValueToColorPicker(pickerEl, value, app) {
  const stringValue = value === undefined || value === null ? "" : String(value);
  let didChange = false;

  if (pickerEl.value !== stringValue) {
    pickerEl.value = stringValue;
    pickerEl.setAttribute("value", stringValue);
    if (pickerEl.ui?.setValue) {
      pickerEl.ui.setValue(stringValue);
    }
    didChange = true;
  }

  const colorInput = pickerEl.ui?.input ?? pickerEl.querySelector?.('input[type="color"]');
  if (colorInput instanceof HTMLInputElement && colorInput.value !== stringValue) {
    colorInput.value = stringValue;
    triggerInputChange(colorInput);
  }

  const textInput = pickerEl.ui?.text ?? pickerEl.querySelector?.('input[type="text"]');
  if (textInput instanceof HTMLInputElement && textInput.value !== stringValue) {
    textInput.value = stringValue;
    triggerInputChange(textInput);
  }

  if (pickerEl.ui?.commit) {
    pickerEl.ui.commit();
  } else {
    pickerEl.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    pickerEl.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
  }

  debugLog("LightPresets | Color picker applied", {
    value: stringValue,
    pickerValue: pickerEl.value ?? null,
    swatchValue: colorInput?.value ?? null,
    textValue: textInput?.value ?? null
  });

  if (didChange) {
    triggerInputChange(pickerEl);
  }
}

function applyValueToRangePicker(rangePickerEl, value, app) {
  const stringValue = value === undefined || value === null ? "" : String(value);
  const numericValue = Number(stringValue);
  const resolvedValue = Number.isFinite(numericValue) ? numericValue : stringValue;
  let didChange = false;

  if (rangePickerEl.value !== undefined && rangePickerEl.value !== resolvedValue) {
    rangePickerEl.value = resolvedValue;
    didChange = true;
  }

  if (rangePickerEl.getAttribute("value") !== stringValue) {
    rangePickerEl.setAttribute("value", stringValue);
    didChange = true;
  }

  const rangeInput = rangePickerEl.querySelector?.('input[type="range"]');
  if (rangeInput instanceof HTMLInputElement && rangeInput.value !== stringValue) {
    rangeInput.value = stringValue;
    triggerInputChange(rangeInput);
  }

  const numberInput = rangePickerEl.querySelector?.('input[type="number"]');
  if (numberInput instanceof HTMLInputElement && numberInput.value !== stringValue) {
    numberInput.value = stringValue;
    triggerInputChange(numberInput);
  }

  if (typeof rangePickerEl.commit === "function") {
    try {
      rangePickerEl.commit();
    } catch (error) {
      console.error("eidolon-utilities | range-picker commit failed", error);
    }
  }

  debugLog("LightPresets | Range picker applied", {
    value: stringValue,
    resolvedValue,
    rangeValue: rangeInput?.value ?? null,
    numberValue: numberInput?.value ?? null
  });

  if (didChange) {
    triggerInputChange(rangePickerEl);
  }
}

function applyValueToSelect(select, value, app) {
  const stringValue = value === undefined || value === null ? "" : String(value);
  if (select.value !== stringValue) {
    select.value = stringValue;
    triggerInputChange(select);
  }
}

function applyValueToTextarea(textarea, value, app) {
  const stringValue = value === undefined || value === null ? "" : String(value);
  if (textarea.value !== stringValue) {
    textarea.value = stringValue;
    triggerInputChange(textarea);
  }
}

function triggerInputChange(element) {
  element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
}

function syncPresetSwitcherState({ presetSelect, applyPresetButton, updatePresetButton, state }) {
  const selectedValue = presetSelect?.value ?? "";
  const hasDefault = Boolean(state?.default);
  const presetExists =
    selectedValue && selectedValue !== PRESET_SELECT_VALUE_DEFAULT
      ? Boolean(getPresetById(state, selectedValue))
      : false;

  if (applyPresetButton instanceof HTMLButtonElement) {
    if (!selectedValue) {
      applyPresetButton.disabled = true;
    } else if (selectedValue === PRESET_SELECT_VALUE_DEFAULT) {
      applyPresetButton.disabled = !hasDefault;
    } else {
      applyPresetButton.disabled = !presetExists;
    }
  }

  if (updatePresetButton instanceof HTMLButtonElement) {
    if (!selectedValue) {
      updatePresetButton.disabled = true;
    } else if (selectedValue === PRESET_SELECT_VALUE_DEFAULT) {
      updatePresetButton.disabled = false;
    } else {
      updatePresetButton.disabled = !presetExists;
    }
  }
}

function buildCategoryNameLookup(categories) {
  const lookup = new Map();
  for (const category of categories) {
    if (!category) continue;
    const id = typeof category.id === "string" ? category.id : null;
    if (!id) continue;
    const name =
      typeof category.name === "string" && category.name.trim()
        ? category.name.trim()
        : localize("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category");
    if (!lookup.has(id)) {
      lookup.set(id, name);
    }
  }
  return lookup;
}

function populatePresetSelector(select, state, categoryNameLookup, selectedValue) {
  if (!(select instanceof HTMLSelectElement)) return;

  const selection = typeof selectedValue === "string" ? selectedValue : "";
  const hasDefault = Boolean(state?.default);
  const presets = Array.isArray(state?.presets) ? [...state.presets] : [];

  const previous = select.value;
  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = localize(
    "EIDOLON.LightPresets.SelectPlaceholder",
    "Select a preset"
  );
  select.appendChild(placeholderOption);

  const defaultOption = document.createElement("option");
  defaultOption.value = PRESET_SELECT_VALUE_DEFAULT;
  defaultOption.textContent = localize(
    "EIDOLON.LightPresets.DefaultOption",
    "Default Preset"
  );
  defaultOption.disabled = !hasDefault;
  select.appendChild(defaultOption);

  presets
    .slice()
    .sort((a, b) => {
      const labelA = formatPresetOptionLabel(a, categoryNameLookup);
      const labelB = formatPresetOptionLabel(b, categoryNameLookup);
      return labelA.localeCompare(labelB, game.i18n?.lang ?? undefined, {
        sensitivity: "base"
      });
    })
    .forEach((preset) => {
      if (!preset?.id) return;
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = formatPresetOptionLabel(preset, categoryNameLookup);
      select.appendChild(option);
    });

  const validValues = new Set(
    Array.from(select.options)
      .filter((option) => !option.disabled)
      .map((option) => option.value)
  );

  const desiredValue = selection || (validValues.has(previous) ? previous : "");

  if (desiredValue && validValues.has(desiredValue)) {
    select.value = desiredValue;
  } else if (hasDefault) {
    select.value = PRESET_SELECT_VALUE_DEFAULT;
  } else {
    select.value = "";
  }
}

function formatPresetOptionLabel(preset, categoryNameLookup) {
  if (!preset || typeof preset !== "object") {
    return localize("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset");
  }

  if (typeof preset.label === "string" && preset.label.trim()) {
    return preset.label.trim();
  }

  const categories = preset.categories ?? {};
  const pairs = Object.entries(categories)
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([categoryId, value]) => {
      const trimmedValue = value.trim();
      const categoryName =
        categoryNameLookup.get(categoryId) ??
        localize("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category");
      return `${categoryName}: ${trimmedValue}`;
    });

  if (pairs.length === 0) {
    return localize("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset");
  }

  return pairs.join(" • ");
}

function findPresetIdByCategories(state, categoriesSelection) {
  if (!state || typeof state !== "object") return null;
  if (!Array.isArray(state.presets)) return null;
  const key = computePresetKey(categoriesSelection);
  if (!key) return null;
  const preset = state.presets.find((entry) => entry?.key === key);
  return preset?.id ?? null;
}

function getPresetById(state, presetId) {
  if (!presetId) return null;
  if (!state || typeof state !== "object") return null;
  if (!Array.isArray(state.presets)) return null;
  return state.presets.find((preset) => preset?.id === presetId) ?? null;
}

function resolveInitialPresetSelection(state) {
  if (!state || typeof state !== "object") return "";
  const current = state.current;

  if (current?.presetId) {
    if (current.presetId === PRESET_SELECT_VALUE_DEFAULT) {
      return state?.default ? PRESET_SELECT_VALUE_DEFAULT : "";
    }
    if (Array.isArray(state.presets) && state.presets.some((preset) => preset.id === current.presetId)) {
      return current.presetId;
    }
  }

  if (current?.categories) {
    const matched = findPresetIdByCategories(state, current.categories);
    if (matched) return matched;
  }

  return "";
}

function logAppliedColorState(form, context = {}) {
  if (!(form instanceof HTMLFormElement)) return;
  const colorPicker = form.querySelector('color-picker[name="config.color"]');
  const pickerValue = colorPicker?.value ?? null;
  const textInput = colorPicker?.ui?.text ?? colorPicker?.querySelector?.('input[type="text"]');
  const swatchInput = colorPicker?.ui?.input ?? colorPicker?.querySelector?.('input[type="color"]');
  debugLog("LightPresets | Color state after apply", {
    ...context,
    textValue: textInput?.value ?? null,
    pickerValue,
    swatchValue: swatchInput?.value ?? null
  });
}

function resetCategorySelections(container) {
  container.querySelectorAll("select[data-category-id]").forEach((select) => {
    select.value = "";
  });
}

function readCategorySelections(container) {
  const selection = {};
  container.querySelectorAll("select[data-category-id]").forEach((select) => {
    const categoryId = select.dataset.categoryId;
    const value = select.value?.trim?.();
    if (!categoryId || !value) return;
    selection[categoryId] = value;
  });
  return Object.keys(selection).length > 0 ? selection : null;
}

function getAmbientLightDocument(app) {
  const document = app?.object ?? app?.document ?? null;
  if (!document?.isEmbedded) return null;
  if (document.documentName !== "AmbientLight") return null;
  return document;
}

function getPersistedAmbientLightDocument(document) {
  if (!document?.isEmbedded) return null;
  const parent = document.parent ?? null;
  if (!parent) return document;
  if (typeof parent.getEmbeddedDocument === "function") {
    const embedded = parent.getEmbeddedDocument(document.documentName, document.id);
    if (embedded) return embedded;
  }
  const collection = parent.lights;
  if (collection?.get) {
    const embedded = collection.get(document.id);
    if (embedded) return embedded;
  }
  return document;
}
