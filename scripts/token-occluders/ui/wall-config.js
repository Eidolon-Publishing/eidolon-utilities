import { asHTMLElement } from "../../common/ui/foundry-compat.js";
import { FLAG_TOKEN_OCCLUDER, MODULE_ID } from "../core/constants.js";
import { getLinkedDoorIds, getTokenOccluderConfig } from "../core/flag-utils.js";

const CONTAINER_CLASS = "eidolon-token-occluder";

export function renderTokenOccluderWallConfig(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;
	if (root.querySelector(`.${CONTAINER_CLASS}`)) return;

	const doc = app.document ?? app.object?.document ?? app.object;
	if (!doc) return;

	const config = getTokenOccluderConfig(doc);
	const linkedDoorIds = getLinkedDoorIds(doc);
	const flagPrefix = `flags.${MODULE_ID}.${FLAG_TOKEN_OCCLUDER}`;

	const fieldset = document.createElement("fieldset");
	fieldset.className = CONTAINER_CLASS;
	fieldset.innerHTML = `
		<legend>Token Occluder</legend>
		<div class="form-group">
			<label>Hide Tokens Only</label>
			<input type="checkbox" name="${flagPrefix}.enabled" ${config.enabled ? "checked" : ""}>
		</div>
		<p class="hint">Treat this wall like a normal vision blocker for token rendering only. LOS, fog, and lighting remain unchanged.</p>
		<div class="form-group eidolon-token-occluder-gating" ${!config.enabled ? 'style="opacity: 0.5"' : ""}>
			<label>Follow Linked Doors</label>
			<input type="checkbox" name="${flagPrefix}.gateByLinkedDoors" ${config.gateByLinkedDoors ? "checked" : ""} ${linkedDoorIds.length === 0 ? "disabled" : ""}>
		</div>
		<p class="hint">${linkedDoorIds.length > 0
			? `Active only while at least one linked door is closed or locked. Linked doors: ${linkedDoorIds.join(", ")}.`
			: "No linked door metadata found on this wall. When enabled, occlusion is always active."}</p>
	`;

	const mount = findMountPoint(root);
	if (!mount) return;
	mount.appendChild(fieldset);

	const enabledInput = fieldset.querySelector(`input[name="${flagPrefix}.enabled"]`);
	const gatingGroup = fieldset.querySelector(".eidolon-token-occluder-gating");
	enabledInput?.addEventListener("change", () => {
		if (gatingGroup) gatingGroup.style.opacity = enabledInput.checked ? "" : "0.5";
	});

	app.setPosition?.({ height: "auto" });
}

function findMountPoint(root) {
	const v13Body = root.querySelector(".standard-form [data-application-part='body']")
		?? root.querySelector(".standard-form.scrollable");
	if (v13Body) return v13Body;

	const form = root.querySelector("form");
	if (!form) return null;

	const footer = form.querySelector(":scope > footer") ?? form.querySelector(".form-footer");
	if (footer?.parentElement === form) {
		const mount = document.createElement("div");
		form.insertBefore(mount, footer);
		return mount;
	}

	return form;
}
