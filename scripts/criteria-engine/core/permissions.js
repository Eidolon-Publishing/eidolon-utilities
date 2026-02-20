import { MODULE_ID } from "./constants.js";

export function canManageCriteria(scene = null) {
  const user = game?.user ?? null;
  if (!user) return false;
  if (user.isGM) return true;

  const target = scene ?? game?.scenes?.viewed ?? null;
  if (!target) return false;

  if (typeof target.canUserModify === "function") {
    try {
      return Boolean(target.canUserModify(user, "update"));
    } catch (_error) {
      // Fall through to ownership checks.
    }
  }

  if (typeof target.testUserPermission === "function") {
    try {
      return Boolean(target.testUserPermission(user, "OWNER"));
    } catch (_error) {
      // Fall through to ownership checks.
    }
  }

  return Boolean(target.isOwner);
}

export function requireCriteriaAccess(scene = null) {
  if (canManageCriteria(scene)) return;
  throw new Error(`${MODULE_ID} | You do not have permission to manage scene criteria.`);
}

