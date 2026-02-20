import { getSceneCriteria, getSceneCriteriaCategories } from "../../scene-criteria/core/storage.js";
import { localize } from "../../time-triggers/core/utils.js";
import {
  getLightCriteriaState,
  setLightCriteriaState,
  storeBaseLighting,
  upsertLightCriteriaMapping,
  retargetLightCriteriaMapping,
  removeLightCriteriaMapping,
  sanitizeLightConfigPayload,
  computeCriteriaMappingKey,
  storeCurrentCriteriaSelection,
  migrateLightCriteriaCategoriesToKeys
} from "../core/storage.js";
import { MODULE_ID, FLAG_LIGHT_CRITERIA } from "../core/constants.js";
import { debugGroup, debugGroupEnd, debugLog } from "../../time-triggers/core/debug.js";
import { asHTMLElement, readFormData } from "../../common/ui/foundry-compat.js";

const creationState = new WeakMap();
const managerDialogs = new WeakMap();
const BASE_SELECT_VALUE = "__eidolon_default__";

export function registerAmbientLightCriteriaControls() {
  Hooks.on("renderAmbientLightConfig", handleAmbientLightConfigRender);
  debugLog("LightCriteria | AmbientLightConfig controls registered");
}

function handleAmbientLightConfigRender(app, html) {
  debugGroup("LightCriteria | renderAmbientLightConfig", {
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
  debugLog("LightCriteria | Resolved ambient light", {
    sheetId: ambientLight?.id ?? null,
    persistedId: persistedLight?.id ?? null,
    sameRef: ambientLight === persistedLight
  });

  const scene = persistedLight?.parent ?? ambientLight.parent ?? null;
  const categoriesRaw = scene ? getSceneCriteriaCategories(scene) : [];
  const categoriesWithValues = categoriesRaw.filter(
    (category) => Array.isArray(category?.values) && category.values.length > 0
  );
  const categoryNameLookup = buildCategoryNameLookup(categoriesRaw);

  const activeLight = persistedLight ?? ambientLight;
  const sceneCriteria = scene ? getSceneCriteria(scene) : [];

  let state = getLightCriteriaState(activeLight);
  const migratedState = migrateLightCriteriaCategoriesToKeys(state, sceneCriteria);
  if (JSON.stringify(migratedState) !== JSON.stringify(state)) {
    state = migratedState;
    void setLightCriteriaState(activeLight, migratedState).catch((error) => {
      console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", error);
    });
  }

  debugLog("LightCriteria | Loaded mapping state", {
    hasBase: Boolean(state?.base),
    mappingCount: Array.isArray(state?.mappings) ? state.mappings.length : 0,
    mappings: Array.isArray(state?.mappings)
      ? state.mappings.map((mapping) => ({
          id: mapping.id,
          key: mapping.key,
          hasColor: Boolean(mapping.config?.config?.color)
        }))
      : []
  });

  const existingFieldset = windowContent.querySelector(".eidolon-light-criteria");
  if (existingFieldset) {
    existingFieldset.remove();
  }
  windowContent
    .querySelectorAll(".eidolon-light-criteria-main-switcher")
    .forEach((element) => element.remove());

  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("eidolon-light-criteria");

  const legend = document.createElement("legend");
  legend.textContent = localize("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting");
  fieldset.appendChild(legend);

  const description = document.createElement("p");
  description.classList.add("notes");
  description.textContent = localize(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  );
  fieldset.appendChild(description);

  const controlsRow = document.createElement("div");
  controlsRow.classList.add("eidolon-light-criteria__controls");

  const makeDefaultButton = document.createElement("button");
  makeDefaultButton.type = "button";
  makeDefaultButton.dataset.action = "make-default";
  makeDefaultButton.classList.add("eidolon-light-criteria__button");
  makeDefaultButton.textContent = localize(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  );
  controlsRow.appendChild(makeDefaultButton);

  const createButton = document.createElement("button");
  createButton.type = "button";
  createButton.dataset.action = "create-mapping";
  createButton.classList.add("eidolon-light-criteria__button");
  createButton.textContent = localize(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  );
  createButton.setAttribute("aria-expanded", "false");
  controlsRow.appendChild(createButton);

  fieldset.appendChild(controlsRow);

  const statusLine = document.createElement("p");
  statusLine.classList.add("notes", "eidolon-light-criteria__status");
  fieldset.appendChild(statusLine);

  const switcher = document.createElement("div");
  switcher.classList.add("eidolon-light-criteria__switcher");

  const switcherLabel = document.createElement("label");
  switcherLabel.classList.add("eidolon-light-criteria__switcher-label");
  const selectId = `${app?.id ?? ambientLight?.id ?? "eidolon-light"}-mapping-select`;
  switcherLabel.htmlFor = selectId;
  switcherLabel.textContent = localize("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping");
  switcher.appendChild(switcherLabel);

  const switcherControls = document.createElement("div");
  switcherControls.classList.add("eidolon-light-criteria__switcher-controls");
  switcher.appendChild(switcherControls);

  const mappingSelect = document.createElement("select");
  mappingSelect.id = selectId;
  mappingSelect.classList.add("eidolon-light-criteria__select");
  mappingSelect.dataset.action = "select-mapping";
  switcherControls.appendChild(mappingSelect);

  const actionStack = document.createElement("div");
  actionStack.classList.add("eidolon-light-criteria__action-stack");
  switcherControls.appendChild(actionStack);

  const applyMappingButton = document.createElement("button");
  applyMappingButton.type = "button";
  applyMappingButton.dataset.action = "apply-selected-mapping";
  applyMappingButton.classList.add("eidolon-light-criteria__button", "secondary", "icon-only");
  applyMappingButton.dataset.tooltip = localize("EIDOLON.LightCriteria.ApplyButton", "Apply");
  applyMappingButton.setAttribute("aria-label", localize("EIDOLON.LightCriteria.ApplyButton", "Apply"));
  applyMappingButton.innerHTML = '<i class="fa-solid fa-play" inert=""></i>';
  actionStack.appendChild(applyMappingButton);

  const updateMappingButton = document.createElement("button");
  updateMappingButton.type = "button";
  updateMappingButton.dataset.action = "update-selected-mapping";
  updateMappingButton.classList.add("eidolon-light-criteria__button", "secondary", "icon-only");
  updateMappingButton.dataset.tooltip = localize("EIDOLON.LightCriteria.UpdateButton", "Save Changes");
  updateMappingButton.setAttribute(
    "aria-label",
    localize("EIDOLON.LightCriteria.UpdateButton", "Save Changes")
  );
  updateMappingButton.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>';
  actionStack.appendChild(updateMappingButton);

  const editCriteriaButton = document.createElement("button");
  editCriteriaButton.type = "button";
  editCriteriaButton.dataset.action = "edit-selected-mapping-criteria";
  editCriteriaButton.classList.add("eidolon-light-criteria__button", "secondary", "icon-only");
  editCriteriaButton.dataset.tooltip = localize("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria");
  editCriteriaButton.setAttribute(
    "aria-label",
    localize("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria")
  );
  editCriteriaButton.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
  actionStack.appendChild(editCriteriaButton);

  const removeMappingButton = document.createElement("button");
  removeMappingButton.type = "button";
  removeMappingButton.dataset.action = "remove-selected-mapping";
  removeMappingButton.classList.add("eidolon-light-criteria__button", "secondary", "icon-only", "danger");
  removeMappingButton.dataset.tooltip = localize("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping");
  removeMappingButton.setAttribute(
    "aria-label",
    localize("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping")
  );
  removeMappingButton.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>';
  actionStack.appendChild(removeMappingButton);

  const switcherRegion = document.createElement("div");
  switcherRegion.classList.add("eidolon-light-criteria-main-switcher");
  switcherRegion.appendChild(switcher);

  const switcherEmptyState = document.createElement("p");
  switcherEmptyState.classList.add("notes", "eidolon-light-criteria-main-switcher__empty");
  switcherEmptyState.textContent = localize(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  );
  switcherRegion.appendChild(switcherEmptyState);

  if (categoriesRaw.length === 0) {
    const warning = document.createElement("p");
    warning.classList.add("notification", "warning", "eidolon-light-criteria__warning");
    warning.textContent = localize(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    );
    fieldset.appendChild(warning);
  } else if (categoriesWithValues.length === 0) {
    const warning = document.createElement("p");
    warning.classList.add("notification", "warning", "eidolon-light-criteria__warning");
    warning.textContent = localize(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    );
    fieldset.appendChild(warning);
  }

  const creationSection = document.createElement("div");
  creationSection.classList.add("eidolon-light-criteria__creation");
  creationSection.dataset.section = "creation";
  creationSection.hidden = true;

  const selectionIntro = document.createElement("p");
  selectionIntro.classList.add("notes");
  selectionIntro.textContent = localize(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  );
  creationSection.appendChild(selectionIntro);

  const categoryList = document.createElement("div");
  categoryList.classList.add("eidolon-light-criteria__category-list");
  creationSection.appendChild(categoryList);

  for (const category of categoriesWithValues) {
    const categoryRow = document.createElement("label");
    categoryRow.classList.add("eidolon-light-criteria__category");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("eidolon-light-criteria__category-name");
    nameSpan.textContent = category.name?.trim?.()
      ? category.name.trim()
      : localize("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    categoryRow.appendChild(nameSpan);

    const select = document.createElement("select");
    select.dataset.categoryId = category.id;
    select.classList.add("eidolon-light-criteria__category-select");

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = localize(
      "EIDOLON.LightCriteria.IgnoreCategory",
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
  creationActions.classList.add("eidolon-light-criteria__creation-actions");

  const saveMappingButton = document.createElement("button");
  saveMappingButton.type = "button";
  saveMappingButton.dataset.action = "save-mapping";
  saveMappingButton.classList.add("eidolon-light-criteria__button", "primary");
  saveMappingButton.textContent = localize(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  );
  creationActions.appendChild(saveMappingButton);

  const cancelMappingButton = document.createElement("button");
  cancelMappingButton.type = "button";
  cancelMappingButton.dataset.action = "cancel-create";
  cancelMappingButton.classList.add("eidolon-light-criteria__button", "secondary");
  cancelMappingButton.textContent = localize(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  );
  creationActions.appendChild(cancelMappingButton);

  creationSection.appendChild(creationActions);
  fieldset.appendChild(creationSection);

  windowContent.prepend(switcherRegion);

  windowContent.appendChild(fieldset);
  fieldset.hidden = true;
  ensureManagerHeaderButton(app, {
    fieldset,
    homeContainer: windowContent
  });
  requestAnimationFrame(() => {
    app.setPosition?.({ height: "auto" });
  });

  let currentState = state;
  updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
  updateStatusLine(statusLine, currentState);
  updateCreateButtonState(createButton, {
    state: currentState,
    hasCategories: categoriesWithValues.length > 0
  });
  debugLog("LightCriteria | Controls injected", {
    sceneId: scene?.id ?? null,
    lightId: ambientLight?.id ?? null,
    hasBase: Boolean(currentState?.base),
    mappingCount: Array.isArray(currentState?.mappings) ? currentState.mappings.length : 0,
    categories: categoriesWithValues.length
  });

  const initialSelection = resolveInitialMappingSelection(currentState);
  const stateEntry = {
    restoreConfig: null,
    app,
    selectedMapping: initialSelection,
    editorMode: "create",
    editingMappingId: null
  };
  creationState.set(fieldset, stateEntry);

  mappingSelect.addEventListener("change", () => {
    stateEntry.selectedMapping = mappingSelect.value ?? "";
    syncMappingSwitcherState({
      mappingSelect,
      applyMappingButton,
      updateMappingButton,
      editCriteriaButton,
      removeMappingButton,
      state: currentState
    });
    void persistCurrentSelection(
      persistedLight ?? ambientLight,
      currentState,
      stateEntry.selectedMapping
    ).then((nextState) => {
      if (nextState) {
        currentState = nextState;
      }
    });
  });

  const applySelectedMapping = async () => {
    const selectedValue = mappingSelect.value ?? "";
    if (!selectedValue) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      syncMappingSwitcherState({
        mappingSelect,
        applyMappingButton,
        updateMappingButton,
        editCriteriaButton,
        removeMappingButton,
        state: currentState
      });
      return;
    }

    if (selectedValue === BASE_SELECT_VALUE) {
      if (!currentState?.base) {
        ui.notifications?.warn?.(
          localize(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      hideCreationSection(fieldset, creationSection, createButton);
      applyConfigToForm(app, form, currentState.base);
      currentState = await storeCurrentCriteriaSelection(persistedLight ?? ambientLight, {
        mappingId: BASE_SELECT_VALUE,
        categories: null,
        updatedAt: Date.now()
      });
      stateEntry.selectedMapping = BASE_SELECT_VALUE;
      populateMappingSelector(mappingSelect, currentState, categoryNameLookup, stateEntry.selectedMapping);
      stateEntry.selectedMapping = mappingSelect.value ?? BASE_SELECT_VALUE;
      updateStatusLine(statusLine, currentState);
      updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
      updateCreateButtonState(createButton, {
        state: currentState,
        hasCategories: categoriesWithValues.length > 0
      });
      logAppliedColorState(form, {
        mappingId: BASE_SELECT_VALUE,
        color: currentState.base?.config?.color ?? null
      });
      ui.notifications?.info?.(
        localize(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      );
      syncMappingSwitcherState({
        mappingSelect,
        applyMappingButton,
        updateMappingButton,
        editCriteriaButton,
        removeMappingButton,
        state: currentState
      });
      return;
    }

    const mapping =
      Array.isArray(currentState?.mappings) && currentState.mappings.length
        ? currentState.mappings.find((entry) => entry?.id === selectedValue)
        : null;
    if (!mapping) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      populateMappingSelector(mappingSelect, currentState, categoryNameLookup, "");
      stateEntry.selectedMapping = mappingSelect.value ?? "";
      syncMappingSwitcherState({
        mappingSelect,
        applyMappingButton,
        updateMappingButton,
        editCriteriaButton,
        removeMappingButton,
        state: currentState
      });
      return;
    }

    hideCreationSection(fieldset, creationSection, createButton);
    applyConfigToForm(app, form, mapping.config);
    currentState = await storeCurrentCriteriaSelection(persistedLight ?? ambientLight, {
      mappingId: mapping.id,
      categories: mapping.categories,
      updatedAt: Date.now()
    });
    stateEntry.selectedMapping = mapping.id;
    populateMappingSelector(mappingSelect, currentState, categoryNameLookup, stateEntry.selectedMapping);
    stateEntry.selectedMapping = mappingSelect.value ?? mapping.id;
    updateStatusLine(statusLine, currentState);
    updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
    updateCreateButtonState(createButton, {
      state: currentState,
      hasCategories: categoriesWithValues.length > 0
    });
    logAppliedColorState(form, {
      mappingId: mapping.id,
      color: mapping.config?.config?.color ?? null
    });
    const mappingLabel = formatMappingOptionLabel(mapping, categoryNameLookup);
    ui.notifications?.info?.(
      localize(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", mappingLabel)
    );
    syncMappingSwitcherState({
      mappingSelect,
      applyMappingButton,
      updateMappingButton,
      editCriteriaButton,
      removeMappingButton,
      state: currentState
    });
  };

  applyMappingButton.addEventListener("click", () => {
    void applySelectedMapping();
  });
  mappingSelect.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void applySelectedMapping();
    }
  });

  const updateSelectedMapping = async () => {
    const selectedValue = stateEntry.selectedMapping;
    if (!selectedValue) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }

    updateMappingButton.disabled = true;
    try {
      const config = captureAmbientLightFormConfig(app, persistedLight);
      if (selectedValue === BASE_SELECT_VALUE) {
        currentState = await storeBaseLighting(persistedLight ?? ambientLight, config);
        debugLog("LightCriteria | Base lighting updated", {
          lightId: (persistedLight ?? ambientLight)?.id ?? null,
          configColor: config?.config?.color ?? null
        });
        ui.notifications?.info?.(
          localize(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        );
        stateEntry.selectedMapping = BASE_SELECT_VALUE;
      } else {
        const mappingBefore = getMappingById(currentState, selectedValue);
        if (!mappingBefore) {
          ui.notifications?.warn?.(
            localize(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          );
          populateMappingSelector(mappingSelect, currentState, categoryNameLookup, "");
          stateEntry.selectedMapping = mappingSelect.value ?? "";
          return;
        }

        currentState = await upsertLightCriteriaMapping(
          persistedLight ?? ambientLight,
          mappingBefore.categories,
          config,
          { label: mappingBefore.label ?? null }
        );
        debugLog("LightCriteria | Mapping updated", {
          mappingId: selectedValue,
          hasColor: Boolean(config?.config?.color),
          stored: Array.isArray(currentState?.mappings)
            ? currentState.mappings.find((mapping) => mapping?.id === selectedValue)?.config ?? null
            : null,
          persisted: (persistedLight ?? ambientLight)
            ?.getFlag?.(MODULE_ID, FLAG_LIGHT_CRITERIA)
        });
        const mappingAfter = getMappingById(currentState, selectedValue);
        const label = mappingAfter
          ? formatMappingOptionLabel(mappingAfter, categoryNameLookup)
          : formatMappingOptionLabel(mappingBefore, categoryNameLookup);
        debugLog("LightCriteria | Mapping updated", {
          mappingId: selectedValue,
          categories: mappingBefore.categories,
          updatedColor: config?.config?.color ?? null,
          storedColor: mappingAfter?.config?.config?.color ?? mappingBefore.config?.config?.color ?? null
        });
        ui.notifications?.info?.(
          localize(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", label)
        );
        stateEntry.selectedMapping = selectedValue;
      }

      updateStatusLine(statusLine, currentState);
      updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
      updateCreateButtonState(createButton, {
        state: currentState,
        hasCategories: categoriesWithValues.length > 0
      });
      populateMappingSelector(mappingSelect, currentState, categoryNameLookup, stateEntry.selectedMapping);
      stateEntry.selectedMapping = mappingSelect.value ?? "";
    } catch (error) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      updateMappingButton.disabled = false;
      syncMappingSwitcherState({
        mappingSelect,
        applyMappingButton,
        updateMappingButton,
        editCriteriaButton,
        removeMappingButton,
        state: currentState
      });
    }
  };

  updateMappingButton.addEventListener("click", () => {
    void updateSelectedMapping();
  });

  populateMappingSelector(mappingSelect, currentState, categoryNameLookup, stateEntry.selectedMapping);
  stateEntry.selectedMapping = mappingSelect.value ?? stateEntry.selectedMapping ?? "";
  syncMappingSwitcherState({
    mappingSelect,
    applyMappingButton,
    updateMappingButton,
    editCriteriaButton,
    removeMappingButton,
    state: currentState
  });

  makeDefaultButton.addEventListener("click", async () => {
    makeDefaultButton.disabled = true;
    try {
      const config = captureAmbientLightFormConfig(app, persistedLight);
      currentState = await storeBaseLighting(persistedLight ?? ambientLight, config);
      debugLog("LightCriteria | Base lighting stored", {
        lightId: (persistedLight ?? ambientLight)?.id ?? null,
        configColor: config?.config?.color ?? null
      });
      ui.notifications?.info?.(
        localize(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      );
      updateStatusLine(statusLine, currentState);
      updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
      updateCreateButtonState(createButton, {
        state: currentState,
        hasCategories: categoriesWithValues.length > 0
      });
      stateEntry.selectedMapping = BASE_SELECT_VALUE;
      populateMappingSelector(mappingSelect, currentState, categoryNameLookup, stateEntry.selectedMapping);
      stateEntry.selectedMapping = mappingSelect.value ?? "";
      syncMappingSwitcherState({
        mappingSelect,
        applyMappingButton,
        updateMappingButton,
        editCriteriaButton,
        removeMappingButton,
        state: currentState
      });
    } catch (error) {
      console.error("eidolon-utilities | Failed to store base light criteria state", error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      makeDefaultButton.disabled = false;
    }
  });

  createButton.addEventListener("click", () => {
    if (!currentState?.base) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (categoriesWithValues.length === 0) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }

    const stateEntry = creationState.get(fieldset);
    openMappingEditor({
      app,
      fieldset,
      createButton,
      creationSection,
      categoryList,
      form,
      persistedLight,
      stateEntry,
      mode: "create",
      mapping: null,
      preloadConfig: currentState.base
    });
  });

  editCriteriaButton.addEventListener("click", () => {
    const selectedValue = stateEntry.selectedMapping;
    if (!selectedValue || selectedValue === BASE_SELECT_VALUE) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }

    const mapping = getMappingById(currentState, selectedValue);
    if (!mapping) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }

    openManagerDialog(app, { fieldset, homeContainer: windowContent });

    openMappingEditor({
      app,
      fieldset,
      createButton,
      creationSection,
      categoryList,
      form,
      persistedLight,
      stateEntry,
      mode: "retarget",
      mapping,
      preloadConfig: mapping.config
    });
  });

  saveMappingButton.addEventListener("click", async () => {
    const categoriesSelection = readCategorySelections(categoryList);
    if (!categoriesSelection) {
      ui.notifications?.warn?.(
        localize(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }

    saveMappingButton.disabled = true;
    try {
      const config = captureAmbientLightFormConfig(app, persistedLight);
      if (stateEntry.editorMode === "retarget" && stateEntry.editingMappingId) {
        const conflictId = findMappingIdByCategories(currentState, categoriesSelection);
        let replaceExisting = false;
        if (conflictId && conflictId !== stateEntry.editingMappingId) {
          replaceExisting = await confirmCriteriaConflict();
          if (!replaceExisting) {
            saveMappingButton.disabled = false;
            return;
          }
        }

        currentState = await retargetLightCriteriaMapping(
          persistedLight ?? ambientLight,
          stateEntry.editingMappingId,
          categoriesSelection,
          config,
          { replaceExisting }
        );

        debugLog("LightCriteria | Mapping criteria retargeted", {
          mappingId: stateEntry.editingMappingId,
          categories: categoriesSelection,
          replaced: replaceExisting,
          configColor: config?.config?.color ?? null
        });
        ui.notifications?.info?.(
          localize(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else {
        currentState = await upsertLightCriteriaMapping(
          persistedLight ?? ambientLight,
          categoriesSelection,
          config,
          {}
        );
        debugLog("LightCriteria | Mapping saved from editor", {
          categories: categoriesSelection,
          configColor: config?.config?.color ?? null
        });
        ui.notifications?.info?.(
          localize(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      }
      updateStatusLine(statusLine, currentState);
      updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
      const updatedSelection = findMappingIdByCategories(currentState, categoriesSelection);
      if (updatedSelection) {
        stateEntry.selectedMapping = updatedSelection;
      }
      populateMappingSelector(mappingSelect, currentState, categoryNameLookup, stateEntry.selectedMapping);
      stateEntry.selectedMapping = mappingSelect.value ?? "";
      syncMappingSwitcherState({
        mappingSelect,
        applyMappingButton,
        updateMappingButton,
        editCriteriaButton,
        removeMappingButton,
        state: currentState
      });
      hideCreationSection(fieldset, creationSection, createButton);
    } catch (error) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      saveMappingButton.disabled = false;
    }
  });

  cancelMappingButton.addEventListener("click", () => {
    const stateEntry = creationState.get(fieldset);
    if (stateEntry?.restoreConfig) {
      applyConfigToForm(app, form, stateEntry.restoreConfig);
    }
    hideCreationSection(fieldset, creationSection, createButton);
  });

  removeMappingButton.addEventListener("click", async () => {
    const selectedValue = stateEntry.selectedMapping;
    if (!selectedValue || selectedValue === BASE_SELECT_VALUE) return;

    const confirmed = await confirmRemoveMapping();
    if (!confirmed) return;

    currentState = await removeLightCriteriaMapping(persistedLight ?? ambientLight, selectedValue);
    stateEntry.selectedMapping = "";
    updateStatusLine(statusLine, currentState);
    updateActiveMappingVisibility({ switcher, emptyState: switcherEmptyState, state: currentState });
    populateMappingSelector(mappingSelect, currentState, categoryNameLookup, "");
    syncMappingSwitcherState({
      mappingSelect,
      applyMappingButton,
      updateMappingButton,
      editCriteriaButton,
      removeMappingButton,
      state: currentState
    });
    ui.notifications?.info?.(
      localize("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    );
  });
}

function openMappingEditor({
  app,
  fieldset,
  createButton,
  creationSection,
  categoryList,
  form,
  persistedLight,
  stateEntry,
  mode,
  mapping,
  preloadConfig
}) {
  if (stateEntry) {
    stateEntry.restoreConfig = captureAmbientLightFormConfig(app, persistedLight);
    stateEntry.editorMode = mode;
    stateEntry.editingMappingId = mode === "retarget" ? mapping?.id ?? null : null;
  }

  if (preloadConfig) {
    applyConfigToForm(app, form, preloadConfig);
  }

  if (mode === "retarget" && mapping?.categories) {
    setCategorySelections(categoryList, mapping.categories);
  } else {
    resetCategorySelections(categoryList);
  }

  const intro = creationSection.querySelector("p.notes");
  if (intro instanceof HTMLElement) {
    intro.textContent =
      mode === "retarget"
        ? localize(
            "EIDOLON.LightCriteria.EditCriteriaDescription",
            "Adjust criteria values for the selected mapping."
          )
        : localize(
            "EIDOLON.LightCriteria.CreateDescription",
            "Assign scene criteria values to map the current configuration."
          );
  }

  const saveButton = creationSection.querySelector('button[data-action="save-mapping"]');
  if (saveButton instanceof HTMLButtonElement) {
    saveButton.textContent =
      mode === "retarget"
        ? localize("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes")
        : localize("EIDOLON.LightCriteria.SaveMapping", "Save Mapping");
  }

  creationSection.hidden = false;
  createButton.setAttribute("aria-expanded", "true");
  updateManagerSectionVisibility(fieldset, creationSection);
  requestAnimationFrame(() => {
    app.setPosition?.({ height: "auto" });
  });
}

async function confirmCriteriaConflict() {
  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (typeof DialogV2?.confirm === "function") {
    return DialogV2.confirm({
      window: { title: localize("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${localize(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: false
    });
  }

  const LegacyDialog = globalThis.Dialog;
  if (typeof LegacyDialog?.confirm !== "function") return false;

  return LegacyDialog.confirm({
    title: localize("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${localize(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: () => true,
    no: () => false,
    defaultYes: false
  });
}

async function confirmRemoveMapping() {
  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (typeof DialogV2?.confirm === "function") {
    return DialogV2.confirm({
      window: { title: localize("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${localize(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: false
    });
  }

  const LegacyDialog = globalThis.Dialog;
  if (typeof LegacyDialog?.confirm !== "function") return false;
  return LegacyDialog.confirm({
    title: localize("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${localize(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: () => true,
    no: () => false,
    defaultYes: false
  });
}

function ensureManagerHeaderButton(app, { fieldset, homeContainer }) {
  const appRoot = resolveApplicationRoot(app, homeContainer);
  if (!(appRoot instanceof HTMLElement)) return;

  const header = appRoot.querySelector(".window-header");
  if (!(header instanceof HTMLElement)) return;

  let button = header.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(button instanceof HTMLButtonElement)) {
    button = document.createElement("button");
    button.type = "button";
    button.classList.add("header-control", "icon");
    button.dataset.eidolonAction = "open-light-criteria-manager";
    button.dataset.tooltip = localize("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting");
    button.setAttribute("aria-label", localize("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"));
    button.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';

    const controls = header.querySelector(".window-controls") ?? header;
    const moreButton = controls.querySelector('[data-action="toggleControls"]');
    if (moreButton?.parentElement === controls) {
      controls.insertBefore(button, moreButton);
    } else {
      const closeButton = controls.querySelector('[data-action="close"]');
      if (closeButton?.parentElement === controls) {
        controls.insertBefore(button, closeButton);
      } else {
        controls.appendChild(button);
      }
    }
  }

  button.onclick = (event) => {
    event.preventDefault();
    openManagerDialog(app, { fieldset, homeContainer });
  };
}

function openManagerDialog(app, { fieldset, homeContainer }) {
  const existing = managerDialogs.get(app);
  if (existing?.rendered) {
    existing.bringToTop?.();
    return;
  }

  const onRender = (...args) => {
    const root = findDialogRoot(args);
    const host = root?.querySelector?.(".eidolon-light-criteria-manager-host");
    if (!(host instanceof HTMLElement)) return;
    applyManagerLayout(fieldset);
    fieldset.hidden = false;
    host.appendChild(fieldset);
  };

  const onClose = () => {
    if (homeContainer instanceof HTMLElement) {
      homeContainer.appendChild(fieldset);
    }
    fieldset.hidden = true;
    managerDialogs.delete(app);
    requestAnimationFrame(() => {
      app.setPosition?.({ height: "auto" });
    });
  };

  const title = localize("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting");
  const content = '<div class="eidolon-light-criteria-manager-host"></div>';
  const closeLabel = localize("EIDOLON.LightCriteria.Close", "Close");

  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (typeof DialogV2?.wait === "function") {
    try {
      let didClose = false;
      const closeOnce = () => {
        if (didClose) return;
        didClose = true;
        onClose();
      };

      managerDialogs.set(app, {
        rendered: true,
        bringToTop: () => {}
      });

      void DialogV2.wait({
        window: { title },
        content,
        buttons: [{ action: "close", label: closeLabel, default: true }],
        render: (...args) => onRender(...args),
        close: closeOnce,
        rejectClose: false
      }).catch((error) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", error);
        closeOnce();
      });
      return;
    } catch (error) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", error);
      onClose();
    }
  }

  const DialogClass = globalThis.Dialog;
  if (typeof DialogClass !== "function") return;

  const dialog = new DialogClass(
    {
      title,
      content,
      buttons: {
        close: {
          label: closeLabel
        }
      },
      render: (...args) => onRender(...args),
      close: onClose
    },
    {
      width: 640,
      resizable: true
    }
  );

  managerDialogs.set(app, dialog);
  dialog.render(true);
}

function findDialogRoot(args) {
  for (const arg of args) {
    const direct = asHTMLElement(arg);
    if (direct) return direct;
    const nested = asHTMLElement(arg?.element);
    if (nested) return nested;
  }
  return null;
}

function applyManagerLayout(fieldset) {
  if (!(fieldset instanceof HTMLElement)) return;
  if (fieldset.dataset.managerLayout === "true") return;

  fieldset.dataset.managerLayout = "true";
  fieldset.classList.add("is-manager");

  const legend = fieldset.querySelector("legend");
  const description = fieldset.querySelector("p.notes:not(.eidolon-light-criteria__status)");
  const controls = fieldset.querySelector(".eidolon-light-criteria__controls");
  const status = fieldset.querySelector(".eidolon-light-criteria__status");
  const creation = fieldset.querySelector(".eidolon-light-criteria__creation");
  const warnings = Array.from(fieldset.querySelectorAll(".eidolon-light-criteria__warning"));

  const shell = document.createElement("div");
  shell.classList.add("eidolon-light-criteria-manager");

  const top = document.createElement("section");
  top.classList.add("eidolon-light-criteria-manager__section", "is-top");
  shell.appendChild(top);

  const bottom = document.createElement("section");
  bottom.classList.add("eidolon-light-criteria-manager__section", "is-bottom");
  shell.appendChild(bottom);

  const topHeader = document.createElement("div");
  topHeader.classList.add("eidolon-light-criteria-manager__header");
  topHeader.textContent = localize("EIDOLON.LightCriteria.ManagerHeader", "Base State");
  top.appendChild(topHeader);

  if (status) top.appendChild(status);
  if (controls) top.appendChild(controls);

  if (warnings.length) {
    const warningWrap = document.createElement("div");
    warningWrap.classList.add("eidolon-light-criteria-manager__warnings");
    for (const warning of warnings) warningWrap.appendChild(warning);
    top.appendChild(warningWrap);
  }

  const bottomHeader = document.createElement("div");
  bottomHeader.classList.add("eidolon-light-criteria-manager__header");
  bottomHeader.textContent = localize("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping");
  bottom.appendChild(bottomHeader);
  if (creation) bottom.appendChild(creation);

  fieldset.innerHTML = "";
  if (legend) fieldset.appendChild(legend);
  if (description) fieldset.appendChild(description);
  fieldset.appendChild(shell);
  updateManagerSectionVisibility(fieldset, creation);
}

function resolveApplicationRoot(app, fallbackRoot) {
  const appElement = asHTMLElement(app?.element);
  if (appElement) return appElement;
  return fallbackRoot?.closest?.(".application") ?? null;
}

function hideCreationSection(fieldset, creationSection, createButton) {
  const stateEntry = creationState.get(fieldset);
  if (stateEntry) {
    stateEntry.restoreConfig = null;
    stateEntry.editorMode = "create";
    stateEntry.editingMappingId = null;
  }
  creationSection.hidden = true;
  createButton.setAttribute("aria-expanded", "false");
  const intro = creationSection.querySelector("p.notes");
  if (intro instanceof HTMLElement) {
    intro.textContent = localize(
      "EIDOLON.LightCriteria.CreateDescription",
      "Assign scene criteria values to map the current configuration."
    );
  }
  const saveButton = creationSection.querySelector('button[data-action="save-mapping"]');
  if (saveButton instanceof HTMLButtonElement) {
    saveButton.textContent = localize("EIDOLON.LightCriteria.SaveMapping", "Save Mapping");
  }
  updateManagerSectionVisibility(fieldset, creationSection);
  requestAnimationFrame(() => {
    stateEntry?.app?.setPosition?.({ height: "auto" });
  });
}

function updateStatusLine(statusElement, state) {
  if (!statusElement) return;

  const hasBase = Boolean(state?.base);
  const mappingCount = Array.isArray(state?.mappings) ? state.mappings.length : 0;

  const pieces = [];
  pieces.push(
    hasBase
      ? localize(
          "EIDOLON.LightCriteria.StatusBaseSaved",
          "Base lighting saved."
        )
      : localize(
          "EIDOLON.LightCriteria.StatusBaseMissing",
          "Base lighting not yet saved."
        )
  );
  pieces.push(
    localize(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(mappingCount))
  );
  statusElement.textContent = pieces.join(" ");
}

function updateCreateButtonState(button, { state, hasCategories }) {
  if (!button) return;
  const hasBase = Boolean(state?.base);
  const enabled = hasBase && hasCategories;
  button.disabled = !enabled;
  button.title = enabled
    ? ""
    : !hasBase
      ? localize(
        "EIDOLON.LightCriteria.CreateDisabledNoBase",
        "Save a base lighting state before creating criteria mappings."
      )
    : localize(
        "EIDOLON.LightCriteria.CreateDisabledNoCategories",
        "Add scene criteria with values before creating mappings."
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
      debugLog("LightCriteria | Captured color-picker value", {
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
      debugLog("LightCriteria | Captured range-picker value", {
        path,
        elementValue,
        numberValue,
        rangeValue,
        chosenValue
      });
    });
  }

  const sanitized = sanitizeLightConfigPayload(merged);
  debugLog("LightCriteria | Captured form config", {
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
    debugLog("LightCriteria | Applying field", {
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

  debugLog("LightCriteria | Color picker applied", {
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

  debugLog("LightCriteria | Range picker applied", {
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

function syncMappingSwitcherState({
  mappingSelect,
  applyMappingButton,
  updateMappingButton,
  editCriteriaButton,
  removeMappingButton,
  state
}) {
  const selectedValue = mappingSelect?.value ?? "";
  const hasBase = Boolean(state?.base);
  const mappingExists =
    selectedValue && selectedValue !== BASE_SELECT_VALUE
      ? Boolean(getMappingById(state, selectedValue))
      : false;

  if (applyMappingButton instanceof HTMLButtonElement) {
    if (!selectedValue) {
      applyMappingButton.disabled = true;
    } else if (selectedValue === BASE_SELECT_VALUE) {
      applyMappingButton.disabled = !hasBase;
    } else {
      applyMappingButton.disabled = !mappingExists;
    }
  }

  if (updateMappingButton instanceof HTMLButtonElement) {
    if (!selectedValue) {
      updateMappingButton.disabled = true;
    } else if (selectedValue === BASE_SELECT_VALUE) {
      updateMappingButton.disabled = false;
    } else {
      updateMappingButton.disabled = !mappingExists;
    }
  }

  if (editCriteriaButton instanceof HTMLButtonElement) {
    editCriteriaButton.disabled =
      !selectedValue || selectedValue === BASE_SELECT_VALUE || !mappingExists;
  }

  if (removeMappingButton instanceof HTMLButtonElement) {
    removeMappingButton.disabled =
      !selectedValue || selectedValue === BASE_SELECT_VALUE || !mappingExists;
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
        : localize("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    if (!lookup.has(id)) {
      lookup.set(id, name);
    }
  }
  return lookup;
}

function populateMappingSelector(select, state, categoryNameLookup, selectedValue) {
  if (!(select instanceof HTMLSelectElement)) return;

  const selection = typeof selectedValue === "string" ? selectedValue : "";
  const hasBase = Boolean(state?.base);
  const mappings = Array.isArray(state?.mappings) ? [...state.mappings] : [];

  const previous = select.value;
  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = localize(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  );
  placeholderOption.disabled = hasBase;
  select.appendChild(placeholderOption);

  const defaultOption = document.createElement("option");
  defaultOption.value = BASE_SELECT_VALUE;
  defaultOption.textContent = localize(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  );
  defaultOption.disabled = !hasBase;
  select.appendChild(defaultOption);

  mappings
    .slice()
    .sort((a, b) => {
      const labelA = formatMappingOptionLabel(a, categoryNameLookup);
      const labelB = formatMappingOptionLabel(b, categoryNameLookup);
      return labelA.localeCompare(labelB, game.i18n?.lang ?? undefined, {
        sensitivity: "base"
      });
    })
    .forEach((mapping) => {
      if (!mapping?.id) return;
      const option = document.createElement("option");
      option.value = mapping.id;
      option.textContent = formatMappingOptionLabel(mapping, categoryNameLookup);
      select.appendChild(option);
    });

  const validValues = new Set(
    Array.from(select.options)
      .filter((option) => !option.disabled)
      .map((option) => option.value)
  );

  const preferredPrevious = hasBase && previous === "" ? "" : previous;
  const desiredValue = selection || (validValues.has(preferredPrevious) ? preferredPrevious : "");

  if (desiredValue && validValues.has(desiredValue)) {
    select.value = desiredValue;
  } else if (hasBase) {
    select.value = BASE_SELECT_VALUE;
  } else {
    select.value = "";
  }
}

function formatMappingOptionLabel(mapping, categoryNameLookup) {
  if (!mapping || typeof mapping !== "object") {
    return localize("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  }

  if (typeof mapping.label === "string" && mapping.label.trim()) {
    return mapping.label.trim();
  }

  const categories = mapping.categories ?? {};
  const pairs = Object.entries(categories)
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([categoryId, value]) => {
      const trimmedValue = value.trim();
      const categoryName =
        categoryNameLookup.get(categoryId) ??
        localize("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
      return `${categoryName}: ${trimmedValue}`;
    });

  if (pairs.length === 0) {
    return localize("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  }

  return pairs.join(" • ");
}

function findMappingIdByCategories(state, categoriesSelection) {
  if (!state || typeof state !== "object") return null;
  if (!Array.isArray(state.mappings)) return null;
  const key = computeCriteriaMappingKey(categoriesSelection);
  if (!key) return null;
  const mapping = state.mappings.find((entry) => entry?.key === key);
  return mapping?.id ?? null;
}

function getMappingById(state, mappingId) {
  if (!mappingId) return null;
  if (!state || typeof state !== "object") return null;
  if (!Array.isArray(state.mappings)) return null;
  return state.mappings.find((mapping) => mapping?.id === mappingId) ?? null;
}

function resolveInitialMappingSelection(state) {
  if (!state || typeof state !== "object") return "";
  const current = state.current;

  if (current?.mappingId) {
    if (current.mappingId === BASE_SELECT_VALUE) {
      return state?.base ? BASE_SELECT_VALUE : "";
    }
    if (Array.isArray(state.mappings) && state.mappings.some((mapping) => mapping.id === current.mappingId)) {
      return current.mappingId;
    }
  }

  if (current?.categories) {
    const matched = findMappingIdByCategories(state, current.categories);
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
  debugLog("LightCriteria | Color state after apply", {
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

function setCategorySelections(container, categories) {
  const normalized = categories && typeof categories === "object" ? categories : {};
  container.querySelectorAll("select[data-category-id]").forEach((select) => {
    const categoryId = select.dataset.categoryId;
    if (!categoryId) return;
    const value = normalized[categoryId];
    select.value = typeof value === "string" ? value : "";
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

async function persistCurrentSelection(lightDocument, state, selectedMappingId) {
  if (!lightDocument) return null;

  try {
    if (!selectedMappingId) {
      return await storeCurrentCriteriaSelection(lightDocument, {});
    }

    if (selectedMappingId === BASE_SELECT_VALUE) {
      return await storeCurrentCriteriaSelection(lightDocument, {
        mappingId: BASE_SELECT_VALUE,
        categories: null,
        updatedAt: Date.now()
      });
    }

    const mapping = getMappingById(state, selectedMappingId);
    if (!mapping) return null;

    return await storeCurrentCriteriaSelection(lightDocument, {
      mappingId: mapping.id,
      categories: mapping.categories,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.warn("eidolon-utilities | Failed to persist mapping selection", error);
    return null;
  }
}

function updateManagerSectionVisibility(fieldset, creationSection) {
  if (!(fieldset instanceof HTMLElement)) return;
  const bottomSection = fieldset.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  if (!(bottomSection instanceof HTMLElement)) return;
  bottomSection.hidden = Boolean(creationSection?.hidden);
}

function updateActiveMappingVisibility({ switcher, emptyState, state }) {
  const hasBase = Boolean(state?.base);

  if (switcher instanceof HTMLElement) {
    switcher.hidden = !hasBase;
  }

  if (emptyState instanceof HTMLElement) {
    emptyState.hidden = hasBase;
  }
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
