import { ApplicationV2, HandlebarsApplicationMixin } from "../core/applications.js";
import {
  ACTION_PLAY_SOUND,
  MODULE_ID,
  TIME_FORMAT_12_HOUR,
  TIME_FORMAT_24_HOUR
} from "../core/constants.js";
import { applyActionFormData, buildActionFormSection, listActions } from "../core/actions.js";
import { getTimeTriggers, setTimeTriggers } from "../core/storage.js";
import { debugGroup, debugGroupEnd, debugLog } from "../core/debug.js";
import { generateTriggerId, localize } from "../core/utils.js";
import {
  getTimeFormValues,
  getPeriodOptions,
  normalizeFormTimeInput
} from "../core/time-format.js";
import { onTimeFormatSettingChange } from "../core/settings.js";

export default class TriggerFormApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  #timeInputCleanup = null;
  #syncTimeInputValue = null;
  #timeFormatCleanup = null;
  #pendingFormState = null;

  constructor(options = {}) {
    const { scene, trigger, triggerIndex, onSave, ...appOptions } = options ?? {};
    super(appOptions);
    this.scene = scene ?? null;
    this.trigger = trigger ?? null;
    this.triggerIndex = Number.isInteger(triggerIndex) ? Number(triggerIndex) : null;
    this.onSave = typeof onSave === "function" ? onSave : null;
    this.#timeFormatCleanup = onTimeFormatSettingChange(this.#handleTimeFormatChange);
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      id: `${MODULE_ID}-trigger-form`,
      classes: Array.from(
        new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "standard-form", "themed"])
      ),
      window: {
        title: localize("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
        resizable: false
      },
      position: {
        width: 400,
        height: "auto"
      }
    },
    { inplace: false }
  );

  static PARTS = {
    content: {
      template: `modules/${MODULE_ID}/templates/time-trigger-form.html`
    }
  };

  async _prepareContext() {
    debugGroup("TriggerFormApplication#_prepareContext", {
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const trigger = this.trigger ?? { action: ACTION_PLAY_SOUND, data: {} };
      const selectedAction = trigger.action ?? ACTION_PLAY_SOUND;
      const timeState = getTimeFormValues(trigger.time);
      const timeFormat = timeState.format ?? TIME_FORMAT_12_HOUR;
      const periodSource = timeFormat === TIME_FORMAT_12_HOUR ? getPeriodOptions() : [];
      const selectedPeriodValue =
        timeState.period ?? (periodSource.length > 0 ? periodSource[0].value : null);
      const periodOptions =
        timeFormat === TIME_FORMAT_12_HOUR
          ? periodSource.map((option) => ({
              ...option,
              selected: option.value === selectedPeriodValue
            }))
          : [];

      const actions = listActions().map((action) => ({
        id: action.id,
        label: typeof action.label === "function" ? action.label() : action.label,
        selected: action.id === selectedAction
      }));

      const actionSections = listActions()
        .map((action) => {
          const previewTrigger = action.id === trigger.action ? trigger : { ...trigger, action: action.id };
          const content = buildActionFormSection(previewTrigger);
          if (!content) return null;
          return {
            id: action.id,
            visible: action.id === selectedAction,
            content
          };
        })
        .filter(Boolean);

      return {
        timeValue: timeState.canonical ?? "",
        timeHourValue: timeState.hour ?? "",
        timeMinuteValue: timeState.minute ?? "",
        timePeriodValue: selectedPeriodValue ?? "",
        timeFormat,
        is12HourFormat: timeFormat === TIME_FORMAT_12_HOUR,
        is24HourFormat: timeFormat === TIME_FORMAT_24_HOUR,
        timePeriodOptions: periodOptions,
        actions,
        actionSections,
        allowReplayOnRewind: Boolean(trigger.allowReplayOnRewind),
        labels: {
          time: localize("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: localize("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: localize("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: localize("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: localize("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: localize(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: localize(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: localize("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      debugGroupEnd();
    }
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const element = this.element;
    if (!element) return;

    debugLog("Trigger form rendered", {
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null
    });

    const themeClass = Array.from(document?.body?.classList ?? []).find((cls) =>
      cls.startsWith("theme-")
    );
    if (themeClass) {
      element.classList.add(themeClass);
    }

    const form = element.querySelector("form");
    if (!form) return;

    this.#setupTimeInput(form);
    this.#restorePendingFormState(form);

    form.addEventListener("submit", this.#onSubmit);

    const actionSelect = form.querySelector("[data-action-select]");
    if (actionSelect) {
      actionSelect.addEventListener("change", this.#onActionSelectChange);
      this.#updateActionSections(actionSelect.value, form);
    }

    form.querySelectorAll("[data-action-file-picker]").forEach((button) => {
      button.addEventListener("click", this.#onFilePicker);
    });
  }

  #handleTimeFormatChange = () => {
    const isRendered = this.rendered ?? this.isRendered ?? false;
    if (!isRendered) return;
    this.#pendingFormState = this.#captureFormState();
    this.render({ force: true });
  };

  #captureFormState() {
    const form = this.element?.querySelector?.("form");
    if (!(form instanceof HTMLFormElement)) return null;

    const controls = Array.from(form.elements ?? []);
    const fields = [];

    for (const control of controls) {
      if (
        !(
          control instanceof HTMLInputElement ||
          control instanceof HTMLSelectElement ||
          control instanceof HTMLTextAreaElement
        )
      ) {
        continue;
      }
      if (!control.name) continue;

      if (
        control.dataset?.timeHidden !== undefined ||
        control.dataset?.timeHour !== undefined ||
        control.dataset?.timeMinute !== undefined ||
        control.dataset?.timePeriod !== undefined
      ) {
        continue;
      }

      if (control instanceof HTMLInputElement) {
        if (control.type === "checkbox" || control.type === "radio") {
          fields.push({
            kind: control.type,
            name: control.name,
            value: control.value,
            checked: control.checked
          });
          continue;
        }
        fields.push({
          kind: "value",
          name: control.name,
          value: control.value
        });
        continue;
      }

      if (control instanceof HTMLSelectElement) {
        if (control.multiple) {
          fields.push({
            kind: "select-multiple",
            name: control.name,
            values: Array.from(control.selectedOptions ?? []).map((option) => option.value)
          });
        } else {
          fields.push({
            kind: "value",
            name: control.name,
            value: control.value
          });
        }
        continue;
      }

      fields.push({
        kind: "value",
        name: control.name,
        value: control.value
      });
    }

    const wrapper = form.querySelector("[data-time-format]");
    let timeState = null;
    if (wrapper instanceof HTMLElement) {
      const hidden = wrapper.querySelector("[data-time-hidden]");
      const hour = wrapper.querySelector("[data-time-hour]");
      const minute = wrapper.querySelector("[data-time-minute]");
      const period = wrapper.querySelector("[data-time-period]");
      timeState = {
        format: wrapper.dataset?.timeFormat ?? null,
        canonical: hidden instanceof HTMLInputElement ? hidden.value : "",
        hour: hour instanceof HTMLInputElement ? hour.value : "",
        minute: minute instanceof HTMLInputElement ? minute.value : "",
        period: period instanceof HTMLSelectElement ? period.value : ""
      };
    }

    return {
      fields,
      time: timeState
    };
  }

  #restorePendingFormState(form) {
    if (!this.#pendingFormState) return;
    if (!(form instanceof HTMLFormElement)) {
      this.#pendingFormState = null;
      return;
    }

    const { fields = [], time = null } = this.#pendingFormState ?? {};
    this.#pendingFormState = null;
    this.#restoreFieldValues(form, fields);
    this.#restoreTimeInputs(form, time);
  }

  #restoreFieldValues(form, fields) {
    if (!Array.isArray(fields) || fields.length === 0) return;
    const cssEscape = typeof CSS?.escape === "function" ? CSS.escape : (value) => value;

    for (const field of fields) {
      if (!field || typeof field.name !== "string") continue;
      const escapedName = cssEscape(field.name);

      if (field.kind === "checkbox" || field.kind === "radio") {
        const selector = `input[type="${field.kind}"][name="${escapedName}"]`;
        const inputs = form.querySelectorAll(selector);
        inputs.forEach((input) => {
          if (!(input instanceof HTMLInputElement)) return;
          if (inputs.length === 1 || input.value === field.value) {
            input.checked = Boolean(field.checked);
          }
        });
        continue;
      }

      if (field.kind === "select-multiple") {
        const select = form.querySelector(`select[name="${escapedName}"]`);
        if (!(select instanceof HTMLSelectElement)) continue;
        const values = new Set(Array.isArray(field.values) ? field.values : []);
        Array.from(select.options ?? []).forEach((option) => {
          option.selected = values.has(option.value);
        });
        continue;
      }

      const element = form.querySelector(`[name="${escapedName}"]`);
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.value = field.value ?? "";
      }
    }
  }

  #restoreTimeInputs(form, timeState) {
    const wrapper = form.querySelector("[data-time-format]");
    if (!(wrapper instanceof HTMLElement)) {
      if (typeof this.#syncTimeInputValue === "function") {
        this.#syncTimeInputValue();
      }
      return;
    }

    const format =
      wrapper.dataset?.timeFormat === TIME_FORMAT_24_HOUR ? TIME_FORMAT_24_HOUR : TIME_FORMAT_12_HOUR;

    const hourInput = wrapper.querySelector("[data-time-hour]");
    const minuteInput = wrapper.querySelector("[data-time-minute]");
    const periodSelect = wrapper.querySelector("[data-time-period]");
    const hiddenInput = wrapper.querySelector("[data-time-hidden]");

    if (!timeState) {
      if (hourInput instanceof HTMLInputElement) hourInput.value = "";
      if (minuteInput instanceof HTMLInputElement) minuteInput.value = "";
      if (periodSelect instanceof HTMLSelectElement) {
        const defaultOption = periodSelect.options?.[0]?.value ?? "";
        periodSelect.value = defaultOption;
      }
      if (hiddenInput instanceof HTMLInputElement) hiddenInput.value = "";
      if (typeof this.#syncTimeInputValue === "function") {
        this.#syncTimeInputValue();
      }
      return;
    }

    const canonical = typeof timeState.canonical === "string" ? timeState.canonical : "";
    const previousPeriod = typeof timeState.period === "string" ? timeState.period : "";
    const previousHour = typeof timeState.hour === "string" ? timeState.hour : "";
    const previousMinute = typeof timeState.minute === "string" ? timeState.minute : "";

    let resolvedHour = "";
    let resolvedMinute = "";
    let resolvedPeriod = previousPeriod;
    let resolvedCanonical = canonical;

    if (canonical) {
      const values = getTimeFormValues(canonical, format);
      resolvedHour = values.hour ?? "";
      resolvedMinute = values.minute ?? "";
      resolvedCanonical = values.canonical ?? canonical;
      if (format === TIME_FORMAT_12_HOUR) {
        resolvedPeriod = values.period ?? previousPeriod;
      } else {
        resolvedPeriod = "";
      }
    } else {
      resolvedHour = previousHour;
      resolvedMinute = previousMinute;
      if (format !== TIME_FORMAT_12_HOUR) {
        resolvedPeriod = "";
      }
    }

    if (hourInput instanceof HTMLInputElement) {
      hourInput.value = resolvedHour ?? "";
    }
    if (minuteInput instanceof HTMLInputElement) {
      minuteInput.value = resolvedMinute ?? "";
    }
    if (periodSelect instanceof HTMLSelectElement) {
      if (format === TIME_FORMAT_12_HOUR) {
        const options = Array.from(periodSelect.options ?? []);
        const matching = options.find((option) => option.value === resolvedPeriod);
        if (matching) {
          periodSelect.value = resolvedPeriod;
        } else if (options.length > 0) {
          periodSelect.value = options[0].value;
        } else {
          periodSelect.value = "";
        }
      } else {
        periodSelect.value = "";
      }
    }
    if (hiddenInput instanceof HTMLInputElement) {
      hiddenInput.value = resolvedCanonical ?? "";
    }

    if (typeof this.#syncTimeInputValue === "function") {
      this.#syncTimeInputValue();
    }
  }

  #onActionSelectChange = (event) => {
    const select = event.currentTarget;
    const form = select?.closest("form");
    if (!form) return;
    debugLog("Trigger action selection changed", {
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null,
      actionId: select?.value ?? null
    });
    this.#updateActionSections(select.value, form);
  };

  #updateActionSections(actionId, form) {
    if (!form) return;
    form.querySelectorAll("[data-action-config]").forEach((section) => {
      const shouldShow = section.dataset.actionConfig === actionId;
      section.style.display = shouldShow ? "" : "none";
    });
  }

  #onFilePicker = (event) => {
    event.preventDefault();
    const button = event.currentTarget;
    const form = button?.closest("form");
    if (!form) return;

    const targetName = button.dataset?.target;
    if (!targetName) return;

    const cssEscape = typeof CSS?.escape === "function" ? CSS.escape : (value) => value;
    const input = form.querySelector(`[name="${cssEscape(targetName)}"]`);
    if (!input) return;

    debugLog("Opening file picker for trigger", {
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null,
      target: targetName
    });
    const picker = new FilePicker({
      type: button.dataset?.type || "audio",
      current: input.value,
      callback: (path) => {
        input.value = path;
        input.dispatchEvent(new Event("change"));
        debugLog("Trigger form file selected", {
          sceneId: this.scene?.id ?? null,
          triggerId: this.trigger?.id ?? null,
          target: targetName,
          path
        });
      }
    });

    picker.render({ force: true });
  };

  #setupTimeInput(form) {
    this.#timeInputCleanup?.();
    this.#timeInputCleanup = null;
    this.#syncTimeInputValue = null;

    if (!(form instanceof HTMLFormElement)) return;

    const wrapper = form.querySelector("[data-time-format]");
    const format = wrapper?.dataset?.timeFormat ?? null;
    if (format !== TIME_FORMAT_12_HOUR && format !== TIME_FORMAT_24_HOUR) {
      return;
    }

    const hiddenInput = wrapper.querySelector("[data-time-hidden]");
    const hourInput = wrapper.querySelector("[data-time-hour]");
    const minuteInput = wrapper.querySelector("[data-time-minute]");
    const periodSelect =
      format === TIME_FORMAT_12_HOUR ? wrapper.querySelector("[data-time-period]") : null;

    if (!hiddenInput || !hourInput || !minuteInput || (format === TIME_FORMAT_12_HOUR && !periodSelect)) {
      debugLog("Trigger form time inputs missing elements", {
        format,
        hasHidden: Boolean(hiddenInput),
        hasHour: Boolean(hourInput),
        hasMinute: Boolean(minuteInput),
        hasPeriod: Boolean(periodSelect)
      });
      return;
    }

    const inputs = [hourInput, minuteInput, ...(periodSelect ? [periodSelect] : [])];
    const update = () => {
      const { canonical, error } = normalizeFormTimeInput(
        {
          hour: hourInput.value,
          minute: minuteInput.value,
          period: periodSelect?.value ?? null,
          time: hiddenInput.value
        },
        format
      );
      hiddenInput.value = canonical ?? "";
      const message = error ?? "";
      hiddenInput.setCustomValidity(message);
      inputs.forEach((input) => {
        input.setCustomValidity(message);
      });
    };

    inputs.forEach((input) => {
      input.addEventListener("input", update);
      input.addEventListener("change", update);
    });

    update();

    this.#timeInputCleanup = () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", update);
        input.removeEventListener("change", update);
      });
    };
    this.#syncTimeInputValue = update;

    debugLog("Trigger form configured for time input", {
      format,
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null
    });
  }

  #onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    debugLog("Trigger form submitted", {
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null
    });
    await this.#handleSubmit(form);
  };

  async #handleSubmit(form) {
    if (typeof this.#syncTimeInputValue === "function") {
      this.#syncTimeInputValue();
    }

    if (typeof form.checkValidity === "function" && !form.checkValidity()) {
      if (typeof form.reportValidity === "function") {
        form.reportValidity();
      }
      debugLog("Trigger form submission blocked by validity check", {
        sceneId: this.scene?.id ?? null,
        triggerId: this.trigger?.id ?? null
      });
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    delete data.timeHour;
    delete data.timeMinute;
    delete data.timePeriod;
    data.allowReplayOnRewind =
      form.querySelector('input[name="allowReplayOnRewind"]')?.checked ?? false;

    debugLog("Processing trigger form submission", {
      sceneId: this.scene?.id ?? null,
      triggerId: this.trigger?.id ?? null,
      allowReplayOnRewind: data.allowReplayOnRewind
    });
    await this.#persistTrigger(data);
    await this.close();
  }

  async #persistTrigger(formData) {
    const trigger = {
      id: this.trigger?.id ?? generateTriggerId(),
      time: formData.time ?? "",
      action: formData.action ?? ACTION_PLAY_SOUND,
      allowReplayOnRewind: Boolean(formData.allowReplayOnRewind),
      data: {}
    };

    debugLog("Persisting trigger from form", {
      sceneId: this.scene?.id ?? null,
      triggerId: trigger.id,
      existingIndex: this.triggerIndex
    });
    applyActionFormData(trigger, formData);

    const triggers = getTimeTriggers(this.scene);

    if (this.triggerIndex !== null && triggers[this.triggerIndex]) {
      triggers[this.triggerIndex] = trigger;
    } else {
      triggers.push(trigger);
    }

    try {
      await setTimeTriggers(this.scene, triggers);
      debugLog("Trigger list saved", {
        sceneId: this.scene?.id ?? null,
        triggerCount: triggers.length
      });
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to save time trigger`, error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.TriggerSaveError",
          "Failed to save the scene's time triggers."
        )
      );
      throw error;
    }

    if (this.onSave) {
      try {
        this.onSave(triggers);
      } catch (error) {
        console.error(`${MODULE_ID} | Trigger onSave callback failed`, error);
        debugLog("Trigger onSave callback failed", {
          sceneId: this.scene?.id ?? null,
          message: error?.message ?? String(error)
        });
      }
    }
  }

  async close(options = {}) {
    this.#timeInputCleanup?.();
    this.#timeInputCleanup = null;
    this.#syncTimeInputValue = null;
    this.#pendingFormState = null;
    if (typeof this.#timeFormatCleanup === "function") {
      try {
        this.#timeFormatCleanup();
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to dispose trigger form time format subscription`, error);
      }
    }
    this.#timeFormatCleanup = null;
    return super.close(options);
  }
}
