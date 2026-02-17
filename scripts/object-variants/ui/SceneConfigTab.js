import { createSceneConfigTabFactory } from "../../common/ui/scene-config-tab-factory.js";
import { createApplicationFactory } from "../../common/ui/application-factories.js";
import {
  getSceneFromApplication,
  hasSceneDocument,
  localize
} from "../../time-triggers/core/utils.js";
import {
  createObjectVariantCategory,
  getObjectVariantCategories,
  notifyPersistError,
  setObjectVariantCategories
} from "../core/storage.js";
import { MODULE_ID } from "../core/constants.js";
import CategoryEditorApplication from "./CategoryEditorApplication.js";

const OBJECT_VARIANTS_SCENE_TEMPLATE = `modules/${MODULE_ID}/templates/object-variants-scene-tab.html`;

const logger = {
  log: (...args) => console.debug?.(`${MODULE_ID} | ObjectVariants`, ...args),
  group: (...args) => console.groupCollapsed?.(`${MODULE_ID} | ObjectVariants`, ...args),
  groupEnd: () => console.groupEnd?.()
};

const categoryEditorFactory = createApplicationFactory(CategoryEditorApplication);

const objectVariantSceneConfigFactory = createSceneConfigTabFactory({
  tabId: "variants",
  tabLabel: () => localize("EIDOLON.ObjectVariants.TabLabel", "Variants"),
  getScene: getSceneFromApplication,
  renderContent: ({ app, tab, scene }) => renderObjectVariantsTab(app, tab, scene),
  logger
});

export function registerObjectVariantSceneConfigHook() {
  return objectVariantSceneConfigFactory.register();
}

function renderObjectVariantsTab(app, tabElement, scene) {
  if (!(tabElement instanceof HTMLElement)) return;
  const activeScene = hasSceneDocument(scene) ? scene : getSceneFromApplication(app);

  void renderObjectVariantsTabContent(app, tabElement, activeScene);
}

async function renderObjectVariantsTabContent(app, tabElement, sceneOverride) {
  const scene = sceneOverride ?? getSceneFromApplication(app);
  logger.group("renderObjectVariantsTabContent", { sceneId: scene?.id ?? null });
  try {
    if (!hasSceneDocument(scene)) {
      const unavailableLabel = localize(
        "EIDOLON.ObjectVariants.Unavailable",
        "Object variants are unavailable for this configuration sheet."
      );
      tabElement.innerHTML = `<p class="notes">${unavailableLabel}</p>`;
      logger.log("Scene lacks document for object variants", { sceneId: scene?.id ?? null });
      return;
    }

    const categories = getObjectVariantCategories(scene);
    logger.log("Rendering object variant list", {
      sceneId: scene.id,
      categoryCount: categories.length
    });

    const description = localize(
      "EIDOLON.ObjectVariants.Description",
      "Group scene assets into reusable variant categories and assign label values for quick reference."
    );
    const categoriesLabel = localize(
      "EIDOLON.ObjectVariants.CategoryListLabel",
      "Scene Variant Categories"
    );
    const emptyLabel = localize(
      "EIDOLON.ObjectVariants.CategoryListEmpty",
      "No variant categories configured for this scene."
    );
    const addCategoryLabel = localize("EIDOLON.ObjectVariants.AddCategory", "Add Category");
    const removeCategoryLabel = localize(
      "EIDOLON.ObjectVariants.RemoveCategory",
      "Remove Category"
    );
    const editCategoryLabel = localize("EIDOLON.ObjectVariants.EditCategory", "Edit Category");
    const valuesLabel = localize("EIDOLON.ObjectVariants.ValuesLabel", "Values");
    const emptyValueLabel = localize(
      "EIDOLON.ObjectVariants.ValueListEmpty",
      "No values have been added to this category."
    );
    const unnamedCategoryLabel = localize(
      "EIDOLON.ObjectVariants.UnnamedCategory",
      "Unnamed Category"
    );
    const formatCount = (count) => formatValueCount(count);

    const templateRenderer =
      foundry?.applications?.handlebars?.renderTemplate ??
      (typeof renderTemplate === "function" ? renderTemplate : globalThis?.renderTemplate);
    if (typeof templateRenderer !== "function") {
      console.error(`${MODULE_ID} | renderTemplate is unavailable; cannot render object variants tab.`);
      tabElement.innerHTML = `<p class="notes">${emptyLabel}</p>`;
      return;
    }

    let renderedTemplate = "";
    try {
      renderedTemplate = await templateRenderer(OBJECT_VARIANTS_SCENE_TEMPLATE, {
        description,
        labels: {
          categories: categoriesLabel,
          empty: emptyLabel,
          addCategory: addCategoryLabel,
          removeCategory: removeCategoryLabel,
          editCategory: editCategoryLabel,
          values: valuesLabel,
          emptyValue: emptyValueLabel,
          unnamedCategory: unnamedCategoryLabel
        },
        categories: categories.map((category) => {
          const trimmedName = category.name?.trim?.() ?? "";
          return {
            id: category.id,
            name: category.name,
            displayName: trimmedName || unnamedCategoryLabel,
            isUnnamed: !trimmedName,
            values: category.values,
            hasValues: category.values.length > 0,
            valuePreview: buildValuePreview(category.values),
            valueCount: category.values.length,
            valueCountLabel: formatCount(category.values.length),
            valueChips: buildValueChips(category.values)
          };
        }),
        hasCategories: categories.length > 0
      });
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to render object variants scene tab template`, error);
      tabElement.innerHTML = `<p class="notes">${emptyLabel}</p>`;
      return;
    }

    tabElement.innerHTML = renderedTemplate;
    bindObjectVariantTabEvents(app, tabElement, scene);
  } finally {
    logger.groupEnd();
  }
}

function bindObjectVariantTabEvents(app, tabElement, sceneOverride) {
  const scene = sceneOverride ?? getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) return;

  const defaultCategoryName = localize(
    "EIDOLON.ObjectVariants.DefaultCategoryName",
    "New Category"
  );

  const addCategoryButton = tabElement.querySelector('[data-variant-action="add-category"]');
  if (addCategoryButton) {
    addCategoryButton.addEventListener("click", () => {
      openCategoryEditor(app, {
        scene,
        category: createObjectVariantCategory(defaultCategoryName),
        isNew: true,
        onSave: () => renderObjectVariantsTabContent(app, tabElement, scene)
      });
    });
  }

  tabElement.querySelectorAll('[data-variant-action="remove-category"]').forEach((button) => {
    const categoryId = button.dataset.categoryId;
    if (!categoryId) return;
    button.addEventListener("click", async () => {
      const didUpdate = await mutateVariantCategories(scene, (categories) => {
        const index = categories.findIndex((category) => category.id === categoryId);
        if (index === -1) return false;
        categories.splice(index, 1);
        return true;
      });
      if (didUpdate) {
        await renderObjectVariantsTabContent(app, tabElement, scene);
      }
    });
  });

  tabElement.querySelectorAll('[data-variant-action="edit-category"]').forEach((button) => {
    const categoryId = button.dataset.categoryId;
    if (!categoryId) return;
    button.addEventListener("click", () => {
      const categories = getObjectVariantCategories(scene);
      const category = categories.find((entry) => entry.id === categoryId);
      if (!category) return;
      openCategoryEditor(app, {
        scene,
        category,
        onSave: () => renderObjectVariantsTabContent(app, tabElement, scene)
      });
    });
  });
}

async function mutateVariantCategories(scene, mutator) {
  const categories = getObjectVariantCategories(scene);
  const result = mutator(categories);
  if (result === false) return false;

  try {
    await setObjectVariantCategories(scene, categories);
    return true;
  } catch (error) {
    notifyPersistError(error);
    return false;
  }
}

function openCategoryEditor(app, options = {}) {
  const providedScene = options.scene ?? null;
  const scene =
    providedScene && hasSceneDocument(providedScene)
      ? providedScene
      : getSceneFromApplication(app);
  if (!hasSceneDocument(scene)) {
    console.warn(
      `${MODULE_ID} | Unable to open object variant editor because no scene document is available.`
    );
    return;
  }

  const editor = categoryEditorFactory({
    scene,
    category: options.category ?? null,
    isNew: Boolean(options.isNew),
    onSave: typeof options.onSave === "function" ? options.onSave : null
  });
  editor.render({ force: true });
}

function buildValuePreview(values) {
  if (!Array.isArray(values) || values.length === 0) return "";
  const preview = values.slice(0, 5);
  const summary = preview.join(", ");
  if (values.length > preview.length) {
    return `${summary}, …`;
  }
  return summary;
}

function buildValueChips(values) {
  if (!Array.isArray(values) || values.length === 0) return [];
  return values.map((value) => value);
}

function formatValueCount(count) {
  if (game.i18n?.has?.("EIDOLON.ObjectVariants.ValueCountLabel")) {
    try {
      return game.i18n.format("EIDOLON.ObjectVariants.ValueCountLabel", { count });
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to format value count label`, error);
    }
  }
  if (count === 0) return "No values configured";
  if (count === 1) return "1 value";
  return `${count} values`;
}
