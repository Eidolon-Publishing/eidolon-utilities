import { ApplicationV2, HandlebarsApplicationMixin } from "../../time-triggers/core/applications.js";
import { localize } from "../../time-triggers/core/utils.js";
import { getSceneCriteria, getSceneCriteriaState } from "../../scene-criteria/core/storage.js";
import { applyState } from "../core/state.js";
import { MODULE_ID } from "../core/constants.js";

export default class CriteriaSwitcherApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static APP_ID = `${MODULE_ID}-criteria-switcher`;

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      id: CriteriaSwitcherApplication.APP_ID,
      classes: Array.from(
        new Set([...(super.DEFAULT_OPTIONS?.classes ?? []), "eidolon-criteria-switcher-window", "themed"])
      ),
      tag: "section",
      window: {
        title: localize("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
        icon: "fa-solid fa-sliders",
        resizable: false
      },
      position: {
        width: 420,
        height: "auto"
      }
    },
    { inplace: false }
  );

  static PARTS = {
    content: {
      template: `modules/${MODULE_ID}/templates/criteria-switcher.html`
    }
  };

  #scene = null;
  #criteria = [];
  #state = {};
  #applying = false;
  #applyTimer = null;
  #pendingState = null;
  #hookId = null;
  #applyDebounceMs = 120;

  constructor(options = {}) {
    super(options);
    this.setScene(options.scene ?? game.scenes?.viewed ?? null);
  }

  setScene(scene) {
    this.#scene = scene ?? game.scenes?.viewed ?? null;
    this.#hydrateFromScene();
  }

  get scene() {
    return this.#scene;
  }

  #hydrateFromScene() {
    if (!this.#scene) {
      this.#criteria = [];
      this.#state = {};
      return;
    }

    this.#criteria = getSceneCriteria(this.#scene).sort((a, b) => a.order - b.order);
    this.#state = getSceneCriteriaState(this.#scene, this.#criteria);
  }

  async _prepareContext() {
    const hasScene = Boolean(this.#scene);
    const hasCriteria = hasScene && this.#criteria.length > 0;

    return {
      hasScene,
      hasCriteria,
      sceneName: this.#scene?.name ?? localize("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: localize(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: localize(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: localize("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: localize("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: localize("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: localize("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: this.#criteria.map((criterion) => ({
        key: criterion.key,
        label: criterion.label || criterion.key,
        values: criterion.values.map((value) => ({
          value,
          selected: this.#state?.[criterion.key] === value
        })),
        defaultValue: criterion.default
      })),
      stateSummary: this.#formatStateSummary()
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);

    this.#bindEvents();
    this.#ensureSyncHook();
  }

  async _onClose(options) {
    if (this.#applyTimer !== null) {
      clearTimeout(this.#applyTimer);
      this.#applyTimer = null;
    }

    if (this.#hookId !== null) {
      Hooks.off("eidolon-utilities.criteriaStateApplied", this.#hookId);
      this.#hookId = null;
    }
    return super._onClose(options);
  }

  #bindEvents() {
    const root = this.element;
    if (!(root instanceof HTMLElement)) return;

    root.querySelectorAll("[data-criteria-key]").forEach((selectElement) => {
      selectElement.addEventListener("change", (event) => {
        const select = event.currentTarget;
        if (!(select instanceof HTMLSelectElement)) return;

        const key = select.dataset.criteriaKey;
        if (!key) return;

        this.#state = {
          ...this.#state,
          [key]: select.value
        };

        this.#queuePartialState({ [key]: select.value });
      });
    });

    root.querySelector("[data-action='reset-defaults']")?.addEventListener("click", () => {
      void this.#resetToDefaults();
    });

    root.querySelector("[data-action='close-switcher']")?.addEventListener("click", () => {
      void this.close();
    });
  }

  #ensureSyncHook() {
    if (this.#hookId !== null) return;

    this.#hookId = Hooks.on("eidolon-utilities.criteriaStateApplied", (scene, state) => {
      if (!this.#scene || scene?.id !== this.#scene.id || this.#applying) return;

      this.#state = { ...(state ?? {}) };
      this.render({ force: true });
    });
  }

  async #applyPartialState(partialState) {
    if (!this.#scene) return;

    this.#setStatus("applying");
    this.#applying = true;

    try {
      const persisted = await applyState(partialState, this.#scene);
      if (persisted) {
        this.#state = persisted;
      }
      this.#setStatus("ready");
      this.render({ force: true });
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to apply criteria state`, error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      );
      this.#setStatus("error", error?.message ?? "Unknown error");
    } finally {
      this.#applying = false;

      if (this.#pendingState) {
        void this.#flushPendingState();
      }
    }
  }

  #queuePartialState(partialState) {
    this.#pendingState = {
      ...(this.#pendingState ?? {}),
      ...(partialState ?? {})
    };

    if (this.#applyTimer !== null) {
      clearTimeout(this.#applyTimer);
    }

    this.#setStatus("applying");
    this.#applyTimer = setTimeout(() => {
      this.#applyTimer = null;
      void this.#flushPendingState();
    }, this.#applyDebounceMs);
  }

  async #flushPendingState() {
    if (this.#applying || !this.#pendingState) return;

    const queued = this.#pendingState;
    this.#pendingState = null;
    await this.#applyPartialState(queued);
  }

  async #resetToDefaults() {
    if (!this.#criteria.length) return;

    const defaults = this.#criteria.reduce((accumulator, criterion) => {
      accumulator[criterion.key] = criterion.default;
      return accumulator;
    }, {});

    this.#state = defaults;

    if (this.#applyTimer !== null) {
      clearTimeout(this.#applyTimer);
      this.#applyTimer = null;
    }
    this.#pendingState = null;

    await this.#applyPartialState(defaults);
  }

  #setStatus(mode, detail = "") {
    const root = this.element;
    if (!(root instanceof HTMLElement)) return;

    const node = root.querySelector("[data-role='status']");
    if (!(node instanceof HTMLElement)) return;

    node.dataset.mode = mode;

    switch (mode) {
      case "applying":
        node.textContent = localize("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        node.textContent = `${localize("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${detail}`;
        break;
      case "ready":
      default:
        node.textContent = `${localize("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${this.#formatStateSummary()}`;
        break;
    }
  }

  #formatStateSummary() {
    if (!this.#criteria.length) return "-";

    return `[${this.#criteria.map((criterion) => this.#state?.[criterion.key] ?? criterion.default).join(" | ")}]`;
  }
}
