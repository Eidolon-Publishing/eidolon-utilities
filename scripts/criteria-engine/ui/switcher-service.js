import { createApplicationFactory } from "../../common/ui/application-factories.js";
import { canManageCriteria } from "../core/permissions.js";
import CriteriaSwitcherApplication from "./CriteriaSwitcherApplication.js";

const createSwitcher = createApplicationFactory(CriteriaSwitcherApplication);

let activeSwitcher = null;

function resolveScene(scene) {
  return scene ?? game.scenes?.viewed ?? null;
}

function isRendered(app) {
  return Boolean(app?.rendered && app?.element?.isConnected);
}

export function getCriteriaSwitcher() {
  if (isRendered(activeSwitcher)) {
    return activeSwitcher;
  }
  activeSwitcher = null;
  return null;
}

export function openCriteriaSwitcher(scene) {
  const targetScene = resolveScene(scene);
  if (!targetScene) {
    ui.notifications?.warn?.("No active scene to open the criteria switcher.");
    return null;
  }

  if (!canManageCriteria(targetScene)) {
    ui.notifications?.warn?.("You do not have permission to manage scene criteria.");
    return null;
  }

  const existing = getCriteriaSwitcher();
  if (existing) {
    existing.setScene(targetScene);
    existing.render({ force: true });
    existing.bringToFront?.();
    return existing;
  }

  activeSwitcher = createSwitcher({ scene: targetScene });
  activeSwitcher.render({ force: true });
  return activeSwitcher;
}

export function closeCriteriaSwitcher() {
  const existing = getCriteriaSwitcher();
  if (!existing) return;

  void existing.close();
  activeSwitcher = null;
}

export function toggleCriteriaSwitcher(scene) {
  const existing = getCriteriaSwitcher();
  if (existing) {
    closeCriteriaSwitcher();
    return null;
  }

  return openCriteriaSwitcher(scene);
}
