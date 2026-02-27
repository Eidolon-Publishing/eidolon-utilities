// ── Segment graph event handlers (select, add, remove, rename segments) ───────

/**
 * Bind segment graph interaction events.
 * @param {HTMLElement} root
 * @param {object} ctx - Event context from CinematicEditorApplication
 */
export function bindSegmentGraphEvents(root, ctx) {
	// Select segment node
	root.querySelectorAll("[data-action='select-segment']").forEach((el) => {
		el.addEventListener("click", () => {
			const name = el.dataset.segmentName;
			if (name) ctx.selectSegment(name);
		});
	});

	// Add segment button
	root.querySelector("[data-action='add-segment']")?.addEventListener("click", async () => {
		const name = await new Promise((resolve) => {
			new Dialog({
				title: "Add Segment",
				content: '<label style="font-size:0.82rem">Segment name:<input type="text" id="seg-name" value="" style="width:100%;margin-top:0.3rem" /></label>',
				buttons: {
					ok: {
						label: "Add",
						callback: (html) => resolve(html.find("#seg-name").val()?.trim()),
					},
					cancel: { label: "Cancel", callback: () => resolve(null) },
				},
				default: "ok",
				close: () => resolve(null),
			}).render(true);
		});
		if (name) ctx.addSegment(name);
	});

	// Remove segment (via context or detail)
	root.querySelectorAll("[data-action='remove-segment']").forEach((btn) => {
		btn.addEventListener("click", () => {
			const name = btn.dataset.segmentName;
			if (name) ctx.removeSegment(name);
		});
	});

	// Rename segment (via context or detail)
	root.querySelectorAll("[data-action='rename-segment']").forEach((btn) => {
		btn.addEventListener("click", async () => {
			const oldName = btn.dataset.segmentName;
			if (!oldName) return;
			const newName = await new Promise((resolve) => {
				new Dialog({
					title: "Rename Segment",
					content: `<label style="font-size:0.82rem">New name:<input type="text" id="seg-name" value="${oldName}" style="width:100%;margin-top:0.3rem" /></label>`,
					buttons: {
						ok: {
							label: "Rename",
							callback: (html) => resolve(html.find("#seg-name").val()?.trim()),
						},
						cancel: { label: "Cancel", callback: () => resolve(null) },
					},
					default: "ok",
					close: () => resolve(null),
				}).render(true);
			});
			if (newName && newName !== oldName) ctx.renameSegment(oldName, newName);
		});
	});
}
