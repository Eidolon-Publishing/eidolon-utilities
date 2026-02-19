import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import {
  createSceneCriterion,
  getSceneCriteria,
  notifyPersistError,
  sanitizeCriterion,
  setSceneCriteria
} from "../core/storage.js";
import { MODULE_ID } from "../core/constants.js";
import { escapeHtml, localize } from "../../time-triggers/core/utils.js";

export default class CategoryEditorApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  #state = null;
  #keyIsCustom = false;

  constructor(options = {}) {
    const { scene, criterion, isNew, onSave, ...rest } = options ?? {};
    super(rest);
    this.scene = scene ?? null;
    this.criterion = criterion ?? null;
    this.onSave = typeof onSave === "function" ? onSave : null;
    this.isNew = Boolean(isNew);
    this.#state = this.#initializeState();
    this.#keyIsCustom = this.#state.key !== slugifyKey(this.#state.label);
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      id: `${MODULE_ID}-criterion-editor`,
      classes: Array.from(
        new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "standard-form", "themed"])
      ),
      window: {
        title: localize("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        resizable: false
      },
      position: {
        width: 460,
        height: "auto"
      }
    },
    { inplace: false }
  );

  static PARTS = {
    content: {
      template: `modules/${MODULE_ID}/templates/scene-criteria-editor.html`
    }
  };

  #initializeState() {
    const criterion =
      sanitizeCriterion(this.criterion, 0, new Set()) ??
      createSceneCriterion(localize("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));

    return {
      id: criterion.id,
      key: criterion.key,
      label: criterion.label ?? "",
      values: Array.isArray(criterion.values) ? [...criterion.values] : [],
      default: criterion.default
    };
  }

  async _prepareContext() {
    const values = Array.isArray(this.#state?.values) ? this.#state.values : [];
    return {
      isNew: this.isNew,
      key: this.#state?.key ?? "",
      label: this.#state?.label ?? "",
      defaultValue: this.#state?.default ?? "",
      values: values.map((value, index) => ({
        index,
        value,
        selected: value === this.#state?.default
      })),
      hasValues: values.length > 0,
      labels: {
        label: localize("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: localize("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: localize("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: localize("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: localize(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: localize("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: localize("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: localize("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: localize("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew
          ? localize("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion")
          : localize("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: localize("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: this.#keyIsCustom
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const form = this.element?.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", this.#onSubmit);
    form.querySelector('[data-action="add-value"]')?.addEventListener("click", this.#onAddValue);
    form
      .querySelector('input[name="criterionLabel"]')
      ?.addEventListener("input", this.#onLabelInput);
    form
      .querySelector('input[name="criterionKey"]')
      ?.addEventListener("input", this.#onKeyInput);
    form
      .querySelector('[data-action="reset-auto-key"]')
      ?.addEventListener("click", this.#onResetAutoKey);
    form.querySelectorAll('[data-action="remove-value"]').forEach((button) => {
      button.addEventListener("click", this.#onRemoveValue);
    });
    form.querySelectorAll('input[name="criterionValues"]').forEach((input) => {
      input.addEventListener("input", this.#onValuesChanged);
    });
    form.querySelector('[data-action="cancel"]')?.addEventListener("click", (event) => {
      event.preventDefault();
      this.close();
    });

    this.#syncAutoKeyButton(form);
    this.#syncDefaultOptions(form);
  }

  #onSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    const formData = new FormData(form);
    const label = String(formData.get("criterionLabel") ?? "").trim();
    const key = String(formData.get("criterionKey") ?? "").trim();
    const values = Array.from(form.querySelectorAll('[name="criterionValues"]'))
      .map((input) => (input instanceof HTMLInputElement ? input.value.trim() : ""))
      .filter((value, index, list) => value && list.indexOf(value) === index);

    const defaultSelection = String(formData.get("criterionDefault") ?? "").trim();
    const fallbackDefault = defaultSelection || values[0] || "Standard";

    const nextState = sanitizeCriterion(
      {
        id: this.#state.id,
        key,
        label,
        values,
        default: fallbackDefault,
        order: Number(this.#state.order ?? 0)
      },
      0,
      new Set()
    );

    if (!nextState) return;
    this.#state = nextState;
    await this.#persist();
    this.close();
  };

  #onLabelInput = (event) => {
    if (this.#keyIsCustom) return;
    const input = event.currentTarget;
    const form = input?.form ?? this.element?.querySelector("form");
    if (!(form instanceof HTMLFormElement)) return;

    const keyInput = form.querySelector('input[name="criterionKey"]');
    if (!(keyInput instanceof HTMLInputElement)) return;
    keyInput.value = slugifyKey(input.value);
  };

  #onKeyInput = (event) => {
    const keyInput = event.currentTarget;
    const form = keyInput?.form ?? this.element?.querySelector("form");
    if (!(form instanceof HTMLFormElement) || !(keyInput instanceof HTMLInputElement)) return;

    const labelInput = form.querySelector('input[name="criterionLabel"]');
    const expected = slugifyKey(labelInput instanceof HTMLInputElement ? labelInput.value : "");
    const entered = slugifyKey(keyInput.value);

    this.#keyIsCustom = entered !== expected;
    keyInput.value = entered;
    this.#syncAutoKeyButton(form);
  };

  #onResetAutoKey = (event) => {
    event.preventDefault();
    const form = event.currentTarget?.form ?? this.element?.querySelector("form");
    if (!(form instanceof HTMLFormElement)) return;

    const labelInput = form.querySelector('input[name="criterionLabel"]');
    const keyInput = form.querySelector('input[name="criterionKey"]');
    if (!(keyInput instanceof HTMLInputElement)) return;

    keyInput.value = slugifyKey(labelInput instanceof HTMLInputElement ? labelInput.value : "");
    this.#keyIsCustom = false;
    this.#syncAutoKeyButton(form);
  };

  #syncAutoKeyButton(form) {
    const button = form.querySelector('[data-action="reset-auto-key"]');
    if (!(button instanceof HTMLButtonElement)) return;
    button.disabled = !this.#keyIsCustom;
  }

  #onAddValue = (event) => {
    event.preventDefault();
    const form = event.currentTarget?.form ?? this.element?.querySelector("form");
    if (!(form instanceof HTMLFormElement)) return;

    const list = form.querySelector(".scene-criterion-editor__values");
    if (!(list instanceof HTMLElement)) return;

    list.querySelector(".scene-criterion-editor__empty")?.remove();

    const row = document.createElement("div");
    row.classList.add("scene-criterion-editor__value");
    const placeholder = escapeHtml(localize("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"));
    const removeLabel = escapeHtml(localize("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
    row.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${placeholder}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${removeLabel}" title="${removeLabel}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    list.appendChild(row);
    row.querySelector('[data-action="remove-value"]')?.addEventListener("click", this.#onRemoveValue);
    row.querySelector('input[name="criterionValues"]')?.addEventListener("input", this.#onValuesChanged);
    this.#syncDefaultOptions(form);
    row.querySelector('input[name="criterionValues"]')?.focus();
  };

  #onRemoveValue = (event) => {
    event.preventDefault();
    event.currentTarget?.closest(".scene-criterion-editor__value")?.remove();

    const form = event.currentTarget?.form ?? this.element?.querySelector("form");
    if (!(form instanceof HTMLFormElement)) return;
    const list = form.querySelector(".scene-criterion-editor__values");
    if (!(list instanceof HTMLElement)) return;

    if (!list.querySelector(".scene-criterion-editor__value")) {
      const message = document.createElement("p");
      message.classList.add("notes", "scene-criterion-editor__empty");
      message.textContent = localize(
        "EIDOLON.SceneCriteria.ValueListEmpty",
        "No values have been added to this criterion."
      );
      list.appendChild(message);
    }

    this.#syncDefaultOptions(form);
  };

  #onValuesChanged = (event) => {
    const form = event.currentTarget?.form ?? this.element?.querySelector("form");
    if (!(form instanceof HTMLFormElement)) return;
    this.#syncDefaultOptions(form);
  };

  #syncDefaultOptions(form) {
    const select = form.querySelector('select[name="criterionDefault"]');
    if (!(select instanceof HTMLSelectElement)) return;

    const current = select.value?.trim?.() ?? "";
    const values = Array.from(form.querySelectorAll('input[name="criterionValues"]'))
      .map((input) => (input instanceof HTMLInputElement ? input.value.trim() : ""))
      .filter((value, index, list) => value && list.indexOf(value) === index);

    const emptyLabel =
      select.dataset.emptyLabel ||
      localize("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");

    select.innerHTML = "";

    if (!values.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = emptyLabel;
      option.selected = true;
      select.appendChild(option);
      return;
    }

    const selected = values.includes(current) ? current : values[0];
    for (const value of values) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = value === selected;
      select.appendChild(option);
    }
  }

  async #persist() {
    if (!this.scene) return;

    const criteria = getSceneCriteria(this.scene).sort((a, b) => a.order - b.order);
    const existingIndex = criteria.findIndex((entry) => entry.id === this.#state.id);

    if (existingIndex < 0) {
      this.#state.order = criteria.length;
      criteria.push(this.#state);
    } else {
      this.#state.order = criteria[existingIndex].order;
      criteria.splice(existingIndex, 1, this.#state);
    }

    try {
      await setSceneCriteria(this.scene, criteria);
      if (this.onSave) {
        await this.onSave(this.#state);
      }
    } catch (error) {
      notifyPersistError(error);
    }
  }
}

function slugifyKey(value) {
  const slug = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "criterion";
}
