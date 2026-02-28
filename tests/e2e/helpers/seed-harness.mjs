const DEFAULT_SCENE_NAME = "E2E Criteria Harness";

function getSceneName() {
  const configured = process.env.E2E_SCENE_NAME?.trim();
  return configured || DEFAULT_SCENE_NAME;
}

export async function seedCriteriaHarness(page) {
  const sceneName = getSceneName();

  return page.evaluate(async ({ sceneName }) => {
    const moduleId = "eidolon-utilities";
    const api = game.modules?.get(moduleId)?.api?.criteria;
    if (!api) {
      throw new Error("Criteria API is unavailable; cannot seed E2E harness.");
    }

    if (!game.user?.isGM) {
      throw new Error("E2E harness seeding requires a GM session.");
    }

    const {
      sanitizeLightConfigPayload,
      setLightCriteriaState
    } = await import("/modules/eidolon-utilities/scripts/light-criteria/core/storage.js");
    const { setTileCriteria } = await import(
      "/modules/eidolon-utilities/scripts/criteria-engine/core/tile-storage.js"
    );

    const criteria = [
      {
        id: "e2e-weather-id",
        key: "e2e-weather",
        label: "E2E Weather",
        values: ["Clear", "Rain"],
        default: "Clear",
        order: 0
      },
      {
        id: "e2e-phase-id",
        key: "e2e-phase",
        label: "E2E Phase",
        values: ["Day", "Night"],
        default: "Day",
        order: 1
      },
      {
        id: "e2e-mode-id",
        key: "e2e-mode",
        label: "E2E Mode",
        values: ["Public", "Stealth"],
        default: "Public",
        order: 2
      }
    ];

    const defaultState = {
      "e2e-weather": "Clear",
      "e2e-phase": "Day",
      "e2e-mode": "Public"
    };

    const candidates = game.scenes?.filter((entry) => {
      return entry.getFlag(moduleId, "e2eHarnessScene") === true || entry.name === sceneName;
    }) ?? [];

    let scene = candidates.find((entry) => entry.name === sceneName) ?? candidates[0] ?? null;
    if (!scene) {
      scene = await Scene.create({
        name: sceneName,
        navigation: true,
        active: false,
        flags: {
          [moduleId]: {
            e2eHarnessScene: true
          }
        }
      });
    } else {
      await scene.update({
        navigation: true,
        [`flags.${moduleId}.e2eHarnessScene`]: true
      });
      scene = game.scenes?.get(scene.id) ?? scene;
    }

    const duplicates = (game.scenes?.filter((entry) => {
      return entry.id !== scene.id && (entry.getFlag(moduleId, "e2eHarnessScene") === true || entry.name === sceneName);
    }) ?? []);
    if (duplicates.length > 0) {
      await Scene.updateDocuments(
        duplicates.map((entry) => ({
          _id: entry.id,
          [`flags.${moduleId}.e2eHarnessScene`]: false,
          navigation: false
        }))
      );
    }

    await api.setCriteria(criteria, scene);
    await scene.setFlag(moduleId, "state", defaultState);
    await api.applyState(defaultState, scene);

    if (!scene.active) {
      await scene.activate();
      scene = game.scenes?.get(scene.id) ?? scene;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const waitForCanvasScene = async (sceneId, timeoutMs = 20_000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (canvas?.ready && canvas?.scene?.id === sceneId) return;
        await sleep(100);
      }
      throw new Error(`Canvas failed to view scene '${sceneId}' within ${timeoutMs}ms.`);
    };

    await scene.view();
    await waitForCanvasScene(scene.id);

    const upsertHarnessLight = async () => {
      const lightCollection = scene.getEmbeddedCollection("AmbientLight");
      const existing = lightCollection.find((entry) => entry.getFlag(moduleId, "e2eHarness") === "main-light") ?? null;

      const lightUpdate = {
        x: 1200,
        y: 900,
        hidden: false,
        rotation: 0,
        walls: false,
        vision: false,
        config: {
          alpha: 0.5,
          bright: 20,
          dim: 40,
          angle: 360,
          attenuation: 0.5,
          coloration: 1,
          luminosity: 0.5,
          saturation: 0,
          contrast: 0,
          shadows: 0,
          animation: {
            type: "none",
            speed: 1,
            intensity: 1,
            reverse: false
          }
        },
        flags: {
          [moduleId]: {
            e2eHarness: "main-light"
          }
        }
      };

      let light = existing;
      if (light) {
        await scene.updateEmbeddedDocuments("AmbientLight", [{ _id: light.id, ...lightUpdate }]);
        light = scene.getEmbeddedCollection("AmbientLight")?.get(light.id) ?? light;
      } else {
        const [created] = await scene.createEmbeddedDocuments("AmbientLight", [lightUpdate]);
        light = scene.getEmbeddedCollection("AmbientLight")?.get(created?.id) ?? created;
      }

      const base = sanitizeLightConfigPayload(light.toObject());
      if (!base) {
        throw new Error("Unable to sanitize seeded light base config.");
      }

      const weatherConfig = foundry.utils.deepClone(base);
      weatherConfig.config.dim = 80;

      const phaseConfig = foundry.utils.deepClone(base);
      if (!phaseConfig.config.animation) phaseConfig.config.animation = {};
      phaseConfig.config.animation.speed = 4;

      const stealthConfig = foundry.utils.deepClone(base);
      stealthConfig.hidden = true;

      await setLightCriteriaState(light, {
        base,
        mappings: [
          {
            id: "e2e-weather-map",
            categories: { "e2e-weather": "Rain" },
            config: weatherConfig,
            updatedAt: Date.now()
          },
          {
            id: "e2e-phase-map",
            categories: { "e2e-phase": "Night" },
            config: phaseConfig,
            updatedAt: Date.now() + 1
          },
          {
            id: "e2e-mode-map",
            categories: { "e2e-mode": "Stealth" },
            config: stealthConfig,
            updatedAt: Date.now() + 2
          }
        ],
        current: null
      });

      return light.id;
    };

    const upsertHarnessTile = async () => {
      const files = [
        { name: "icons/svg/sun.svg", selected: true },
        { name: "icons/svg/rain.svg", selected: false },
        { name: "icons/svg/fog.svg", selected: false }
      ];

      const tileCollection = scene.getEmbeddedCollection("Tile");
      const existing = tileCollection.find((entry) => entry.getFlag(moduleId, "e2eHarness") === "main-tile") ?? null;

      const tileUpdate = {
        x: 1600,
        y: 900,
        width: 256,
        height: 256,
        rotation: 0,
        texture: {
          src: files[0].name
        },
        flags: {
          [moduleId]: {
            e2eHarness: "main-tile"
          },
          "monks-active-tiles": {
            files,
            fileindex: 0
          }
        }
      };

      let tile = existing;
      if (tile) {
        await scene.updateEmbeddedDocuments("Tile", [{ _id: tile.id, ...tileUpdate }]);
        tile = scene.getEmbeddedCollection("Tile")?.get(tile.id) ?? tile;
      } else {
        const [created] = await scene.createEmbeddedDocuments("Tile", [tileUpdate]);
        tile = scene.getEmbeddedCollection("Tile")?.get(created?.id) ?? created;
      }

      await setTileCriteria(
        tile,
        {
          strategy: "select-one",
          defaultTarget: { indexHint: 0 },
          variants: [
            {
              criteria: { "e2e-weather": "Rain" },
              target: { indexHint: 1 }
            },
            {
              criteria: { "e2e-weather": "Rain", "e2e-phase": "Night" },
              target: { indexHint: 2 }
            }
          ]
        },
        {
          strictValidation: true
        }
      );

      return tile.id;
    };

    const lightId = await upsertHarnessLight();
    const tileId = await upsertHarnessTile();

    await api.applyState(defaultState, scene);

    return {
      sceneId: scene.id,
      sceneName: scene.name,
      lightId,
      tileId
    };
  }, { sceneName });
}
