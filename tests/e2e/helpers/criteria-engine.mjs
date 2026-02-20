export async function applyAnyCriteriaChange(page) {
  return page.evaluate(async () => {
    const api = game.modules?.get("eidolon-utilities")?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const scene = game.scenes?.viewed ?? game.scenes?.active ?? null;
    if (!scene) return { status: "no-scene" };

    const criteria = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
    if (!criteria.length) {
      return { status: "no-criteria", sceneId: scene.id };
    }

    const state = api.getState?.(scene) ?? {};
    const candidate =
      criteria.find((criterion) => Array.isArray(criterion?.values) && criterion.values.length > 1)
      ?? criteria[0];

    const key = candidate?.key;
    const values = Array.isArray(candidate?.values) ? candidate.values : [];
    if (!key || !values.length) {
      return { status: "no-usable-value", sceneId: scene.id };
    }

    const currentValue = typeof state[key] === "string" ? state[key] : null;
    const nextValue = values.find((value) => value !== currentValue) ?? values[0] ?? null;
    if (!nextValue) {
      return { status: "no-usable-value", sceneId: scene.id, key };
    }

    const persisted = await api.applyState?.({ [key]: nextValue }, scene);

    return {
      status: "applied",
      sceneId: scene.id,
      key,
      value: persisted?.[key] ?? nextValue
    };
  });
}

export async function readCriteriaValue(page, sceneId, key) {
  return page.evaluate(
    ({ sceneId: targetSceneId, key: targetKey }) => {
      const api = game.modules?.get("eidolon-utilities")?.api?.criteria;
      if (!api) return { status: "missing-api" };

      const scene = game.scenes?.get?.(targetSceneId) ?? null;
      if (!scene) return { status: "missing-scene" };

      const state = api.getState?.(scene) ?? null;
      return {
        status: "ok",
        value: state?.[targetKey] ?? null
      };
    },
    { sceneId, key }
  );
}

