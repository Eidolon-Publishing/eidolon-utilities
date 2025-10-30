import { ACTION_PLAY_SOUND, MODULE_ID } from "./constants.js";
import { debugLog } from "./debug.js";
import { escapeHtml, localize } from "./utils.js";

const registry = new Map();
const missingDataWarnings = new Set();

export function registerAction(definition) {
  if (!definition?.id) {
    throw new Error(`${MODULE_ID} | Action definitions require an id.`);
  }

  if (registry.has(definition.id)) {
    throw new Error(`${MODULE_ID} | Duplicate time trigger action id: ${definition.id}`);
  }

  registry.set(definition.id, {
    ...definition
  });
  debugLog("Registered time trigger action", { actionId: definition.id });
}

export function getAction(actionId) {
  return registry.get(actionId) ?? null;
}

export function getActionLabel(actionId) {
  const action = getAction(actionId);
  if (!action) return actionId;
  return typeof action.label === "function" ? action.label() : action.label;
}

export function listActions() {
  return Array.from(registry.values());
}

export async function executeTriggerAction(scene, trigger) {
  const action = getAction(trigger?.action);
  if (!action || typeof action.execute !== "function") {
    const message = localize(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    ui.notifications?.warn?.(message);
    console.warn(`${MODULE_ID} | Unknown time trigger action`, trigger);
    debugLog("Encountered unknown time trigger action", {
      triggerId: trigger?.id ?? null,
      actionId: trigger?.action ?? null
    });
    return;
  }

  debugLog("Executing action handler", {
    actionId: action.id,
    triggerId: trigger?.id ?? null,
    sceneId: scene?.id ?? null
  });
  await action.execute({ scene, trigger });
}

export function buildActionSummaryParts(trigger) {
  const action = getAction(trigger?.action);
  if (!action || typeof action.buildSummaryParts !== "function") return [];
  return action.buildSummaryParts({ trigger, escapeHtml, localize }) ?? [];
}

export function buildActionFormSection(trigger) {
  const action = getAction(trigger?.action);
  if (!action || typeof action.buildFormContent !== "function") return "";
  return action.buildFormContent({ trigger, escapeHtml, localize }) ?? "";
}

export function applyActionFormData(trigger, formData) {
  const action = getAction(trigger?.action);
  if (!action || typeof action.prepareFormData !== "function") return;
  action.prepareFormData({ trigger, formData });
}

function warnMissingTriggerData(scene, trigger, reason) {
  const key = `${scene?.id ?? "unknown"}:${trigger?.id ?? trigger?.action ?? "unknown"}:${reason}`;
  if (missingDataWarnings.has(key)) return;
  missingDataWarnings.add(key);

  const message = localize(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  ui.notifications?.warn?.(message);
  console.warn(`${MODULE_ID} | Missing trigger data (${reason})`, { scene: scene?.id, trigger });
}

async function executePlaySoundAction({ scene, trigger }) {
  const path = trigger?.data?.path?.trim?.();
  if (!path) {
    warnMissingTriggerData(scene, trigger, "missing-audio-path");
    return;
  }

  const soundConfig = {
    src: path,
    autoplay: true,
    loop: false
  };

  const playPromise = (() => {
    if (typeof foundry?.audio?.AudioHelper?.play === "function") {
      return foundry.audio.AudioHelper.play(soundConfig, true);
    }

    if (typeof game?.audio?.constructor?.play === "function") {
      return game.audio.constructor.play(soundConfig, true);
    }

    if (typeof game?.audio?.play === "function") {
      return game.audio.play(soundConfig, true);
    }

    return null;
  })();

  if (!playPromise) {
    console.error(`${MODULE_ID} | Foundry audio helper is unavailable`);
    ui.notifications?.error?.(
      localize(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }

  await playPromise;
}

registerAction({
  id: ACTION_PLAY_SOUND,
  label: () => localize("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"),
  execute: executePlaySoundAction,
  buildSummaryParts: ({ trigger, escapeHtml, localize }) => {
    if (!trigger?.data?.path) return [];
    const soundLabel = escapeHtml(localize("EIDOLON.TimeTrigger.TriggerSound", "Sound File"));
    return [`${soundLabel}: ${escapeHtml(trigger.data.path)}`];
  },
  buildFormContent: ({ trigger, escapeHtml, localize }) => {
    const soundLabel = escapeHtml(localize("EIDOLON.TimeTrigger.TriggerSound", "Sound File"));
    const chooseFile = escapeHtml(
      localize("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    );
    const notes = escapeHtml(
      localize(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    );
    const value = escapeHtml(trigger?.data?.path ?? "");

    return `
      <label>${soundLabel}</label>
      <div class="form-fields">
        <input type="text" name="playSoundPath" value="${value}" data-dtype="String">
        <button
          type="button"
          class="file-picker icon-only"
          data-action-file-picker
          data-type="audio"
          data-target="playSoundPath"
          aria-label="${chooseFile}"
          title="${chooseFile}"
        >
          <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
        </button>
      </div>
      <p class="hint">${notes}</p>
    `;
  },
  prepareFormData: ({ trigger, formData }) => {
    trigger.data.path = formData.playSoundPath?.trim?.() ?? "";
  }
});
