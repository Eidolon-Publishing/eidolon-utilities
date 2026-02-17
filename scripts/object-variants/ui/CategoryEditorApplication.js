import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import {
  createObjectVariantCategory,
  getObjectVariantCategories,
  notifyPersistError,
  sanitizeCategory,
  setObjectVariantCategories
} from "../core/storage.js";
import { MODULE_ID } from "../core/constants.js";
import { escapeHtml, localize } from "../../time-triggers/core/utils.js";

export default class CategoryEditorApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  #state = null;
  #isNew = false;

  constructor(options = {}) {
    const { scene, category, isNew, onSave, ...rest } = options ?? {};
    super(rest);
    this.scene = scene ?? null;
    this.category = category ?? null;
    this.onSave = typeof onSave === "function" ? onSave : null;
    this.#isNew = Boolean(isNew);
    this.#state = this.#initializeState();
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      id: `${MODULE_ID}-variant-category-editor`,
      classes: Array.from(
        new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "standard-form", "themed"])
      ),
      window: {
        title: localize("EIDOLON.ObjectVariants.EditCategory", "Edit Category"),
        resizable: false
      },
      position: {
        width: 440,
        height: "auto"
      }
    },
    { inplace: false }
  );

  static PARTS = {
    content: {
      template: `modules/${MODULE_ID}/templates/object-variants-category-editor.html`
    }
  };

  #initializeState() {
    const category =
      sanitizeCategory(this.category) ??
      createObjectVariantCategory(
        localize("EIDOLON.ObjectVariants.DefaultCategoryName", "New Category")
      );

    return {
      id: category.id,
      name: category.name ?? "",
      values: Array.isArray(category.values) ? [...category.values] : []
    };
  }

  async _prepareContext() {
    const values = Array.isArray(this.#state?.values) ? this.#state.values : [];
    return {
      isNew: this.#isNew,
      name: this.#state?.name ?? "",
      values: values.map((value, index) => ({
        index,
        value
      })),
      hasValues: values.length > 0,
      labels: {
        name: localize("EIDOLON.ObjectVariants.CategoryNameLabel", "Category Name"),
        values: localize("EIDOLON.ObjectVariants.ValuesLabel", "Values"),
        empty: localize(
          "EIDOLON.ObjectVariants.ValueListEmpty",
          "No values have been added to this category."
        ),
        addValue: localize("EIDOLON.ObjectVariants.AddValue", "Add Value"),
        removeValue: localize("EIDOLON.ObjectVariants.RemoveValue", "Remove Value"),
        valuePlaceholder: localize(
          "EIDOLON.ObjectVariants.ValuePlaceholder",
          "Variant label"
        ),
        save: this.#isNew
          ? localize("EIDOLON.ObjectVariants.CreateCategory", "Add Category")
          : localize("EIDOLON.ObjectVariants.SaveCategory", "Save Category"),
        cancel: localize("EIDOLON.ObjectVariants.CancelEdit", "Cancel"),
        title: this.#isNew
          ? localize("EIDOLON.ObjectVariants.CreateCategory", "Add Category")
          : localize("EIDOLON.ObjectVariants.EditCategory", "Edit Category")
      }
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const element = this.element;
    if (!element) return;

    const themeClass = Array.from(document?.body?.classList ?? []).find((cls) =>
      cls.startsWith("theme-")
    );
    if (themeClass) {
      element.classList.add(themeClass);
    }

    const form = element.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", this.#onSubmit);
    form.querySelectorAll('[data-action="add-value"]').forEach((button) => {
      button.addEventListener("click", this.#onAddValue);
    });
    form.querySelectorAll('[data-action="remove-value"]').forEach((button) => {
      button.addEventListener("click", this.#onRemoveValue);
    });
    const cancelButton = form.querySelector('[data-action="cancel"]');
    if (cancelButton) {
      cancelButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.close();
      });
    }
  }

  #onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    const formData = new FormData(form);
    const name = (formData.get("categoryName") ?? "").toString();

    const valueInputs = Array.from(form.querySelectorAll('[name="categoryValues"]'));
    const values = [];
    for (const input of valueInputs) {
      if (!(input instanceof HTMLInputElement)) continue;
      const value = input.value.trim();
      if (!value) continue;
      if (!values.includes(value)) {
        values.push(value);
      }
    }

    this.#state = {
      ...this.#state,
      name,
      values
    };

    await this.#persist();
    this.close();
  };

  #onAddValue = (event) => {
    event.preventDefault();
    const button = event.currentTarget;
    const form = button?.form ?? this.element?.querySelector?.("form");
    if (!form) return;

    const list = form.querySelector(".object-variant-editor__values");
    if (!list) return;

    const emptyState = list.querySelector(".object-variant-editor__empty");
    if (emptyState) {
      emptyState.remove();
    }

    const template = document.createElement("div");
    template.classList.add("object-variant-editor__value");
    const placeholder = escapeHtml(
      localize("EIDOLON.ObjectVariants.ValuePlaceholder", "Variant label")
    );
    const removeLabel = escapeHtml(
      localize("EIDOLON.ObjectVariants.RemoveValue", "Remove Value")
    );
    template.innerHTML = `
      <input type="text" name="categoryValues" value="" placeholder="${placeholder}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${removeLabel}" title="${removeLabel}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    list.appendChild(template);
    const removeButton = template.querySelector('[data-action="remove-value"]');
    if (removeButton) {
      removeButton.addEventListener("click", this.#onRemoveValue);
    }
    const input = template.querySelector('input[name="categoryValues"]');
    if (input) {
      input.focus();
    }
  };

  #onRemoveValue = (event) => {
    event.preventDefault();
    const button = event.currentTarget;
    const valueRow = button?.closest(".object-variant-editor__value");
    if (valueRow) {
      valueRow.remove();
    }

    const form = button?.form ?? this.element?.querySelector?.("form");
    if (!form) return;
    const list = form.querySelector(".object-variant-editor__values");
    if (!list) return;
    const hasValues = list.querySelector(".object-variant-editor__value");
    if (!hasValues) {
      const message = document.createElement("p");
      message.classList.add("notes", "object-variant-editor__empty");
      message.textContent = localize(
        "EIDOLON.ObjectVariants.ValueListEmpty",
        "No values have been added to this category."
      );
      list.appendChild(message);
    }
  };

  async #persist() {
    if (!this.scene) return;

    const categories = getObjectVariantCategories(this.scene);
    const existingIndex = categories.findIndex((entry) => entry.id === this.#state.id);

    const sanitized = sanitizeCategory({
      id: this.#state.id,
      name: this.#state.name,
      values: this.#state.values
    });

    if (existingIndex === -1) {
      categories.push(sanitized);
    } else {
      categories.splice(existingIndex, 1, sanitized);
    }

    try {
      await setObjectVariantCategories(this.scene, categories);
      if (this.onSave) {
        try {
          await this.onSave(sanitized);
        } catch (error) {
          console.error(`${MODULE_ID} | Object variant editor onSave handler failed`, error);
        }
      }
    } catch (error) {
      notifyPersistError(error);
    }
  }
}
