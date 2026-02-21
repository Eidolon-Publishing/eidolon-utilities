import { createSceneConfigTabFactory } from "../../common/ui/scene-config-tab-factory.js";
import { createApplicationFactory } from "../../common/ui/application-factories.js";
import {
  getSceneFromApplication,
  hasSceneDocument,
  localize
} from "../../time-triggers/core/utils.js";
import { getCriteriaSurfacesEnabled } from "../core/settings.js";
import {
  createSceneCriterion,
  getSceneCriteria,
  getSceneCriteriaState,
  notifyPersistError,
  setSceneCriteria
} from "../core/storage.js";
import { MODULE_ID } from "../core/constants.js";
import CategoryEditorApplication from "./CategoryEditorApplication.js";

const CRITERIA_SCENE_TEMPLATE = `modules/${MODULE_ID}/templates/scene-criteria-tab.html`;

const logger = {
  log: (...args) => console.debug?.(`${MODULE_ID} | Criteria`, ...args),
  group: (...args) => console.groupCollapsed?.(`${MODULE_ID} | Criteria`, ...args),
  groupEnd: () => console.groupEnd?.()
};

const criterionEditorFactory = createApplicationFactory(CategoryEditorApplication);

const sceneCriteriaConfigFactory = createSceneConfigTabFactory({
  tabId: "criteria",
  tabLabel: () => localize("EIDOLON.SceneCriteria.TabLabel", "Criteria"),
  getScene: getSceneFromApplication,
  isApplicable: () => getCriteriaSurfacesEnabled(),
  renderContent: ({ app, tab, scene }) => renderCriteriaTab(app, tab, scene),
  logger
});

export function registerSceneCriteriaConfigHook() {
  return sceneCriteriaConfigFactory.register();
}

function renderCriteriaTab(app, tabElement, scene) {
  if (!(tabElement instanceof HTMLElement)) return;
  const activeScene = hasSceneDocument(scene) ? scene : getSceneFromApplication(app);
  void renderCriteriaTabContent(app, tabElement, activeScene);
}

async function renderCriteriaTabContent(app, tabElement, sceneOverride) {
  const scene = sceneOverride ?? getSceneFromApplication(app);
  logger.group("renderCriteriaTabContent", { sceneId: scene?.id ?? null });

  try {
    if (!hasSceneDocument(scene)) {
      const unavailableLabel = localize(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      tabElement.innerHTML = `<p class="notes">${unavailableLabel}</p>`;
      return;
    }

    const criteria = getSceneCriteria(scene).sort((a, b) => a.order - b.order);
    const state = getSceneCriteriaState(scene, criteria);
    const templateRenderer =
      foundry?.applications?.handlebars?.renderTemplate ??
      (typeof renderTemplate === "function" ? renderTemplate : globalThis?.renderTemplate);
    if (typeof templateRenderer !== "function") {
      tabElement.innerHTML = `<p class="notes">${localize("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }

    const renderedTemplate = await templateRenderer(CRITERIA_SCENE_TEMPLATE, {
      description: localize(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: localize("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: localize(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: localize("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: localize("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: localize("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: localize("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: localize("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: localize("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: localize("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: criteria.length,
        valueCount: criteria.reduce((count, criterion) => count + criterion.values.length, 0)
      },
      criteria: criteria.map((criterion, index) => ({
        id: criterion.id,
        label: criterion.label,
        displayName: criterion.label?.trim?.() || localize("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
        hasValues: criterion.values.length > 0,
        values: criterion.values.map((value) => ({
          value,
          isCurrent: (state[criterion.key] ?? criterion.default) === value
        })),
        valueCountLabel: formatValueCount(criterion.values.length),
        canMoveUp: index > 0,
        canMoveDown: index < criteria.length - 1
      })),
      hasCriteria: criteria.length > 0
    });

    tabElement.innerHTML = renderedTemplate;
    bindCriteriaTabEvents(app, tabElement, scene);
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to render criteria tab`, error);
    tabElement.innerHTML = `<p class="notes">${localize("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    logger.groupEnd();
  }
}

function bindCriteriaTabEvents(app, tabElement, sceneOverride) {
  const scene = sceneOverride ?? getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) return;

  const addButton = tabElement.querySelector('[data-criteria-action="add"]');
  if (addButton) {
    addButton.addEventListener("click", () => {
      openCriterionEditor(app, {
        scene,
        criterion: createSceneCriterion(
          localize("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
        ),
        isNew: true,
        onSave: () => renderCriteriaTabContent(app, tabElement, scene)
      });
    });
  }

  tabElement.querySelectorAll('[data-criteria-action="edit"]').forEach((button) => {
    const criterionId = button.dataset.criterionId;
    if (!criterionId) return;

    button.addEventListener("click", () => {
      const criterion = getSceneCriteria(scene).find((entry) => entry.id === criterionId);
      if (!criterion) return;
      openCriterionEditor(app, {
        scene,
        criterion,
        onSave: () => renderCriteriaTabContent(app, tabElement, scene)
      });
    });
  });

  tabElement.querySelectorAll('[data-criteria-action="remove"]').forEach((button) => {
    const criterionId = button.dataset.criterionId;
    if (!criterionId) return;

    button.addEventListener("click", async () => {
      const didUpdate = await mutateCriteria(scene, (criteria) => {
        const index = criteria.findIndex((entry) => entry.id === criterionId);
        if (index < 0) return false;
        criteria.splice(index, 1);
        reindexCriteriaOrder(criteria);
        return true;
      });
      if (didUpdate) {
        await renderCriteriaTabContent(app, tabElement, scene);
      }
    });
  });

  tabElement.querySelectorAll('[data-criteria-action="move-up"]').forEach((button) => {
    const criterionId = button.dataset.criterionId;
    if (!criterionId) return;

    button.addEventListener("click", async () => {
      const didUpdate = await mutateCriteria(scene, (criteria) => {
        const index = criteria.findIndex((entry) => entry.id === criterionId);
        if (index <= 0) return false;
        const [current] = criteria.splice(index, 1);
        criteria.splice(index - 1, 0, current);
        reindexCriteriaOrder(criteria);
        return true;
      });
      if (didUpdate) {
        await renderCriteriaTabContent(app, tabElement, scene);
      }
    });
  });

  tabElement.querySelectorAll('[data-criteria-action="move-down"]').forEach((button) => {
    const criterionId = button.dataset.criterionId;
    if (!criterionId) return;

    button.addEventListener("click", async () => {
      const didUpdate = await mutateCriteria(scene, (criteria) => {
        const index = criteria.findIndex((entry) => entry.id === criterionId);
        if (index < 0 || index >= criteria.length - 1) return false;
        const [current] = criteria.splice(index, 1);
        criteria.splice(index + 1, 0, current);
        reindexCriteriaOrder(criteria);
        return true;
      });
      if (didUpdate) {
        await renderCriteriaTabContent(app, tabElement, scene);
      }
    });
  });
}

async function mutateCriteria(scene, mutator) {
  const criteria = getSceneCriteria(scene).sort((a, b) => a.order - b.order);
  const result = mutator(criteria);
  if (result === false) return false;

  try {
    await setSceneCriteria(scene, criteria);
    return true;
  } catch (error) {
    notifyPersistError(error);
    return false;
  }
}

function openCriterionEditor(app, options = {}) {
  const providedScene = options.scene ?? null;
  const scene =
    providedScene && hasSceneDocument(providedScene)
      ? providedScene
      : getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) {
    return;
  }

  const editor = criterionEditorFactory({
    scene,
    criterion: options.criterion ?? null,
    isNew: Boolean(options.isNew),
    onSave: typeof options.onSave === "function" ? options.onSave : null
  });
  editor.render({ force: true });
}

function reindexCriteriaOrder(criteria) {
  criteria.forEach((criterion, index) => {
    criterion.order = index;
  });
}

function formatValueCount(count) {
  if (game.i18n?.has?.("EIDOLON.SceneCriteria.ValueCountLabel")) {
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count });
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to format value count label`, error);
    }
  }

  if (count === 0) return "No values configured";
  if (count === 1) return "1 value";
  return `${count} values`;
}
