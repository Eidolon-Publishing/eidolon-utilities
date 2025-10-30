import { MODULE_ID } from "./constants.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications?.api ?? {};

if (!ApplicationV2 || !HandlebarsApplicationMixin) {
  throw new Error(
    `${MODULE_ID} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
}

export { ApplicationV2, HandlebarsApplicationMixin };
