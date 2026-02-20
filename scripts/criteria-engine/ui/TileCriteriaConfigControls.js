import { asHTMLElement, setActiveTab } from "../../common/ui/foundry-compat.js";
import { localize } from "../../time-triggers/core/utils.js";
import { getSceneCriteria } from "../../scene-criteria/core/storage.js";
import { getCriteriaSurfacesEnabled } from "../../scene-criteria/core/settings.js";
import { MODULE_ID } from "../core/constants.js";
import {
  createDefaultTileCriteria,
  getTileCriteria,
  setTileCriteria
} from "../core/tile-storage.js";
import {
  buildTileFileEntries,
  createTileTargetFromIndex,
  detectTileCriteriaConflicts,
  normalizeTileCriteria,
  resolveTileTargetIndex
} from "../core/tiles.js";

const WILDCARD_VALUE = "__eidolon_any__";
const TILE_TAB_ID = "eidolon-tile-criteria";
const TILE_TAB_ICON = "fa-solid fa-sliders";
const UI_STATE_KEY = Symbol.for("eidolon.tileCriteriaUiState");
const ENTRY_FILTER_MODES = ["all", "unmapped", "mapped", "conflicts"];

function readUiState(app) {
  const raw = app?.[UI_STATE_KEY];
  if (!raw || typeof raw !== "object") {
    return {
      filterQuery: "",
      filterMode: "all",
      selectedFileIndex: null
    };
  }

  return {
    filterQuery: typeof raw.filterQuery === "string" ? raw.filterQuery : "",
    filterMode: ENTRY_FILTER_MODES.includes(raw.filterMode) ? raw.filterMode : "all",
    selectedFileIndex: Number.isInteger(raw.selectedFileIndex) ? raw.selectedFileIndex : null
  };
}

function applyUiState(state, uiState) {
  if (!state || !uiState) return;

  if (typeof uiState.filterQuery === "string") {
    state.filterQuery = uiState.filterQuery;
  }

  if (ENTRY_FILTER_MODES.includes(uiState.filterMode)) {
    state.filterMode = uiState.filterMode;
  }

  const hasSelected = Number.isInteger(uiState.selectedFileIndex)
    && state.fileEntries.some((entry) => entry.index === uiState.selectedFileIndex);
  if (hasSelected) {
    state.selectedFileIndex = uiState.selectedFileIndex;
  }

}

function persistUiState(controller) {
  const app = controller?.app;
  const state = controller?.state;
  if (!app || !state) return;

  app[UI_STATE_KEY] = {
    filterQuery: typeof state.filterQuery === "string" ? state.filterQuery : "",
    filterMode: ENTRY_FILTER_MODES.includes(state.filterMode) ? state.filterMode : "all",
    selectedFileIndex: Number.isInteger(state.selectedFileIndex) ? state.selectedFileIndex : null
  };
}

function getTileDocument(app) {
  const document = app?.object ?? app?.document ?? null;
  if (!document?.isEmbedded) return null;
  if (document.documentName !== "Tile") return null;
  return document;
}

function getTileFiles(tile) {
  return tile?.getFlag?.("monks-active-tiles", "files") ?? [];
}

function getCriteriaDefinitions(tile, stored) {
  const scene = tile?.parent ?? game.scenes?.viewed ?? null;
  const criteria = getSceneCriteria(scene).sort((left, right) => left.order - right.order);

  const definitions = criteria.map((criterion) => ({
    key: criterion.key,
    label: criterion.label || criterion.key,
    values: [...(criterion.values ?? [])]
  }));

  const knownKeys = new Set(definitions.map((criterion) => criterion.key));
  const extraValues = new Map();

  for (const variant of stored?.variants ?? []) {
    for (const [key, value] of Object.entries(variant?.criteria ?? {})) {
      if (knownKeys.has(key)) continue;

      if (!extraValues.has(key)) extraValues.set(key, new Set());
      if (typeof value === "string" && value.trim()) {
        extraValues.get(key).add(value.trim());
      }
    }
  }

  for (const [key, values] of extraValues.entries()) {
    definitions.push({
      key,
      label: key,
      values: [...values]
    });
  }

  return definitions;
}

function buildTree(entries) {
  const root = {
    folders: new Map(),
    files: []
  };

  for (const entry of entries) {
    const displayPath = entry.path || entry.label;
    const segments = displayPath.split("/").filter(Boolean);
    if (!segments.length) {
      root.files.push({ entry, name: entry.label });
      continue;
    }

    const filename = segments.pop();
    let node = root;

    for (const segment of segments) {
      if (!node.folders.has(segment)) {
        node.folders.set(segment, {
          folders: new Map(),
          files: []
        });
      }
      node = node.folders.get(segment);
    }

    node.files.push({ entry, name: filename || entry.label });
  }

  return root;
}

function collapseFolderBranch(folderName, folderNode) {
  const segments = [folderName];
  let node = folderNode;

  while (node.files.length === 0 && node.folders.size === 1) {
    const [nextName, nextNode] = node.folders.entries().next().value;
    segments.push(nextName);
    node = nextNode;
  }

  return {
    label: segments.join("/"),
    node
  };
}

function getRuleSummariesForFile(state, fileIndex) {
  const rules = state.rulesByFile.get(fileIndex) ?? [];
  const summaries = [];

  for (const rule of rules) {
    const entries = Object.entries(rule.criteria ?? {}).filter(([, value]) => typeof value === "string" && value.trim());

    if (!entries.length) {
      summaries.push("*");
      continue;
    }

    const summary = entries
      .map(([key, value]) => `${state.criteriaLabels.get(key) ?? key}: ${value}`)
      .join(" · ");
    summaries.push(summary);
  }

  return summaries;
}

function buildEditorState(tile) {
  const files = getTileFiles(tile);
  const fileEntries = buildTileFileEntries(files);
  const stored = getTileCriteria(tile, { allowLegacy: true }) ?? createDefaultTileCriteria(files);

  const criteriaDefinitions = getCriteriaDefinitions(tile, stored);
  const criteriaLabels = new Map(criteriaDefinitions.map((definition) => [definition.key, definition.label]));
  const relativePaths = new Map(
    fileEntries.map((entry) => [
      entry.index,
      entry.path || entry.label
    ])
  );

  const defaultIndexRaw = resolveTileTargetIndex(stored.defaultTarget, files);
  const fallbackIndex = fileEntries[0]?.index ?? 0;
  const defaultIndex = defaultIndexRaw >= 0 ? defaultIndexRaw : fallbackIndex;

  const rulesByFile = new Map(fileEntries.map((entry) => [entry.index, []]));
  let nextRuleId = 1;

  for (const variant of stored.variants ?? []) {
    const resolvedIndex = resolveTileTargetIndex(variant.target, files);
    if (resolvedIndex < 0) continue;

    if (!rulesByFile.has(resolvedIndex)) {
      rulesByFile.set(resolvedIndex, []);
    }

    rulesByFile.get(resolvedIndex).push({
      id: nextRuleId,
      criteria: { ...(variant.criteria ?? {}) }
    });
    nextRuleId += 1;
  }

  const selectedFileIndex = fileEntries.some((entry) => entry.index === defaultIndex)
    ? defaultIndex
    : fileEntries[0]?.index ?? null;

  return {
    files,
    fileEntries,
    criteriaDefinitions,
    criteriaLabels,
    relativePaths,
    defaultIndex,
    selectedFileIndex,
    filterQuery: "",
    filterMode: "all",
    nextRuleId,
    rulesByFile,
    status: {
      mode: "ready",
      message: localize("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}

function getRulesForFile(state, fileIndex) {
  if (!state.rulesByFile.has(fileIndex)) {
    state.rulesByFile.set(fileIndex, []);
  }
  return state.rulesByFile.get(fileIndex);
}

function sanitizeRuleCriteria(criteria) {
  return Object.fromEntries(
    Object.entries(criteria ?? {})
      .filter(([key, value]) => typeof key === "string" && key && typeof value === "string" && value.trim())
      .map(([key, value]) => [key, value.trim()])
  );
}

function buildTileCriteriaDraft(state) {
  const defaultTarget = createTileTargetFromIndex(state.files, state.defaultIndex);
  if (!defaultTarget) return null;

  const variants = [];
  const sources = [];
  for (const [fileIndex, rules] of state.rulesByFile.entries()) {
    const target = createTileTargetFromIndex(state.files, fileIndex);
    if (!target) continue;

    for (const [rulePosition, rule] of rules.entries()) {
      const criteria = sanitizeRuleCriteria(rule.criteria);

      variants.push({
        criteria,
        target: { ...target }
      });

      sources.push({
        fileIndex,
        ruleId: rule.id,
        rulePosition,
        criteria
      });
    }
  }

  if (!variants.length) {
    variants.push({
      criteria: {},
      target: { ...defaultTarget }
    });

    sources.push({
      fileIndex: state.defaultIndex,
      ruleId: null,
      rulePosition: null,
      criteria: {},
      isFallback: true
    });
  }

  const normalized = normalizeTileCriteria(
    {
      strategy: "select-one",
      defaultTarget,
      variants
    },
    { files: state.files }
  );

  return {
    normalized,
    sources
  };
}

function exportTileCriteria(state) {
  return buildTileCriteriaDraft(state)?.normalized ?? null;
}

function analyzeRuleConflicts(state) {
  const draft = buildTileCriteriaDraft(state);
  if (!draft?.normalized) {
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  }

  const report = detectTileCriteriaConflicts(draft.normalized, { files: state.files });

  const mapConflict = (conflict) => {
    const left = draft.sources[conflict.leftIndex] ?? null;
    const right = draft.sources[conflict.rightIndex] ?? null;

    return {
      ...conflict,
      leftFileIndex: left?.fileIndex,
      rightFileIndex: right?.fileIndex
    };
  };

  const errors = report.errors.map((conflict) => mapConflict(conflict));
  const warnings = report.warnings.map((conflict) => mapConflict(conflict));

  const toFileIndexes = (conflicts) => {
    const fileIndexes = new Set();

    for (const conflict of conflicts) {
      if (Number.isInteger(conflict.leftFileIndex)) fileIndexes.add(conflict.leftFileIndex);
      if (Number.isInteger(conflict.rightFileIndex)) fileIndexes.add(conflict.rightFileIndex);
    }

    return [...fileIndexes];
  };

  return {
    errors,
    warnings,
    errorFileIndexes: toFileIndexes(errors),
    warningFileIndexes: toFileIndexes(warnings)
  };
}

function createBadge(text, kind = "neutral") {
  const badge = document.createElement("span");
  badge.classList.add("eidolon-tile-criteria__badge");
  badge.dataset.kind = kind;
  badge.textContent = text;
  return badge;
}

function middleEllipsis(text, options = {}) {
  const source = typeof text === "string" ? text : "";
  const {
    maxLength = 42,
    headLength = 20,
    tailLength = 16
  } = options;

  if (!source || source.length <= maxLength) return source;

  const head = source.slice(0, headLength).trimEnd();
  const tail = source.slice(-tailLength).trimStart();
  return `${head}...${tail}`;
}

function createRegexFilter(query) {
  const raw = typeof query === "string" ? query.trim() : "";
  if (!raw) {
    return {
      error: "",
      matches: () => true
    };
  }

  let pattern = raw;
  let flags = "i";

  if (raw.startsWith("/") && raw.length > 1) {
    const lastSlash = raw.lastIndexOf("/");
    if (lastSlash > 0) {
      pattern = raw.slice(1, lastSlash);
      flags = raw.slice(lastSlash + 1) || "i";
    }
  }

  flags = flags.replace(/g/g, "");

  try {
    const regex = new RegExp(pattern, flags);
    return {
      error: "",
      matches: (value) => regex.test(String(value ?? ""))
    };
  } catch (error) {
    return {
      error: error?.message ?? localize("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: () => true
    };
  }
}

function createCriterionSelect(definition, selectedValue) {
  const select = document.createElement("select");
  select.dataset.criteriaKey = definition.key;

  const wildcardOption = document.createElement("option");
  wildcardOption.value = WILDCARD_VALUE;
  wildcardOption.textContent = "*";
  select.appendChild(wildcardOption);

  const values = new Set(definition.values ?? []);
  if (selectedValue && !values.has(selectedValue)) values.add(selectedValue);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }

  select.value = selectedValue ?? WILDCARD_VALUE;
  return select;
}

function renderRuleEditor(rule, state, fileIndex, onChange) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("eidolon-tile-criteria__rule-editor");

  const grid = document.createElement("div");
  grid.classList.add("eidolon-tile-criteria__rule-grid");

  for (const definition of state.criteriaDefinitions) {
    const field = document.createElement("label");
    field.classList.add("eidolon-tile-criteria__rule-field");

    const caption = document.createElement("span");
    caption.classList.add("eidolon-tile-criteria__criterion-label");
    caption.textContent = definition.label;
    field.appendChild(caption);

    const select = createCriterionSelect(definition, rule.criteria?.[definition.key]);
    select.addEventListener("change", () => {
      if (select.value === WILDCARD_VALUE) {
        delete rule.criteria[definition.key];
      } else {
        rule.criteria[definition.key] = select.value;
      }
      onChange();
    });
    field.appendChild(select);

    grid.appendChild(field);
  }

  wrapper.appendChild(grid);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove");
  remove.textContent = localize("EIDOLON.TileCriteria.RemoveRule", "Remove");
  remove.addEventListener("click", () => {
    const rules = getRulesForFile(state, fileIndex);
    const next = rules.filter((candidate) => candidate.id !== rule.id);
    state.rulesByFile.set(fileIndex, next);
    onChange();
  });
  wrapper.appendChild(remove);

  return wrapper;
}

const ruleEditorDialogs = new WeakMap();

function getDialogOwner(controller) {
  return controller?.app ?? controller?.tile ?? null;
}

function findDialogRoot(args) {
  for (const arg of args) {
    const direct = asHTMLElement(arg);
    if (direct) return direct;
    const nested = asHTMLElement(arg?.element);
    if (nested) return nested;
  }
  return null;
}

function buildRuleEditorContent(controller, fileIndex, onRefresh) {
  const state = controller.state;
  const entry = state.fileEntries.find((file) => file.index === fileIndex);
  if (!entry) return document.createElement("div");

  const content = document.createElement("section");
  content.classList.add("eidolon-tile-criteria__dialog-content");

  const header = document.createElement("header");
  header.classList.add("eidolon-tile-criteria__editor-header");

  const title = document.createElement("h4");
  title.textContent = state.relativePaths.get(entry.index) || entry.label;
  header.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.classList.add("notes");
  subtitle.textContent = `#${entry.index + 1} · ${entry.path || localize("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`;
  header.appendChild(subtitle);

  content.appendChild(header);

  const controls = document.createElement("div");
  controls.classList.add("eidolon-tile-criteria__editor-controls");

  const defaultButton = document.createElement("button");
  defaultButton.type = "button";
  defaultButton.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action");
  if (state.defaultIndex === entry.index) {
    defaultButton.textContent = localize("EIDOLON.TileCriteria.IsDefault", "Default Target");
    defaultButton.disabled = true;
  } else {
    defaultButton.textContent = localize("EIDOLON.TileCriteria.SetDefault", "Set As Default");
    defaultButton.addEventListener("click", () => {
      state.defaultIndex = entry.index;
      renderController(controller);
      onRefresh();
    });
  }
  controls.appendChild(defaultButton);

  const clearRules = document.createElement("button");
  clearRules.type = "button";
  clearRules.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary");
  clearRules.textContent = localize("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules");
  clearRules.addEventListener("click", () => {
    state.rulesByFile.set(entry.index, []);
    renderController(controller);
    onRefresh();
  });
  controls.appendChild(clearRules);

  content.appendChild(controls);

  const rulesWrap = document.createElement("div");
  rulesWrap.classList.add("eidolon-tile-criteria__rule-editors");

  const rules = getRulesForFile(state, entry.index);
  if (!rules.length) {
    const hint = document.createElement("p");
    hint.classList.add("notes");
    hint.textContent = localize(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    );
    rulesWrap.appendChild(hint);
  } else {
    for (const rule of rules) {
      rulesWrap.appendChild(
        renderRuleEditor(rule, state, entry.index, () => {
          renderController(controller);
          onRefresh();
        })
      );
    }
  }
  content.appendChild(rulesWrap);

  const addRule = document.createElement("button");
  addRule.type = "button";
  addRule.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action");
  addRule.textContent = localize("EIDOLON.TileCriteria.AddRule", "Add Rule");
  addRule.disabled = !state.criteriaDefinitions.length;
  addRule.addEventListener("click", () => {
    const rulesForFile = getRulesForFile(state, entry.index);
    rulesForFile.push({
      id: state.nextRuleId,
      criteria: {}
    });
    state.nextRuleId += 1;
    renderController(controller);
    onRefresh();
  });
  content.appendChild(addRule);

  return content;
}

function openRuleEditorDialog(controller, fileIndex) {
  const owner = getDialogOwner(controller);
  if (!owner) return;

  const existing = ruleEditorDialogs.get(owner);
  if (existing) {
    existing.controller = controller;
    existing.fileIndex = fileIndex;
    existing.refresh?.();
    return;
  }

  const dialogState = {
    controller,
    fileIndex,
    host: null,
    refresh: null
  };
  ruleEditorDialogs.set(owner, dialogState);

  const closeDialog = () => {
    ruleEditorDialogs.delete(owner);
  };

  const refreshDialog = () => {
    if (!(dialogState.host instanceof HTMLElement)) return;
    dialogState.host.replaceChildren(
      buildRuleEditorContent(dialogState.controller, dialogState.fileIndex, refreshDialog)
    );
  };
  dialogState.refresh = refreshDialog;

  const title = localize("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules");
  const content = '<div class="eidolon-tile-criteria-editor-host"></div>';
  const closeLabel = localize("EIDOLON.TileCriteria.CloseEditor", "Close");

  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (typeof DialogV2?.wait === "function") {
    void DialogV2.wait({
      window: { title },
      content,
      buttons: [{ action: "close", label: closeLabel, default: true }],
      render: (...args) => {
        const root = findDialogRoot(args);
        const host = root?.querySelector?.(".eidolon-tile-criteria-editor-host");
        if (!(host instanceof HTMLElement)) return;
        dialogState.host = host;
        refreshDialog();
      },
      close: closeDialog,
      rejectClose: false
    }).catch((error) => {
      console.warn(`${MODULE_ID} | Rule editor dialog failed`, error);
      closeDialog();
    });
    return;
  }

  closeDialog();
}

function refreshOpenRuleEditor(controller) {
  const owner = getDialogOwner(controller);
  if (!owner) return;
  const dialog = ruleEditorDialogs.get(owner);
  dialog?.refresh?.();
}

function hasRulesForFile(state, fileIndex) {
  return (state.rulesByFile.get(fileIndex) ?? []).length > 0;
}

function hasConflictForFile(conflictReport, fileIndex) {
  return conflictReport?.errorFileIndexes?.includes(fileIndex)
    || conflictReport?.warningFileIndexes?.includes(fileIndex);
}

function matchesFilterMode(state, entry, conflictReport) {
  switch (state.filterMode) {
    case "unmapped":
      return !hasRulesForFile(state, entry.index);
    case "mapped":
      return hasRulesForFile(state, entry.index);
    case "conflicts":
      return hasConflictForFile(conflictReport, entry.index);
    case "all":
    default:
      return true;
  }
}

function getFilterModeCounts(state, conflictReport) {
  let mapped = 0;
  let unmapped = 0;
  let conflicts = 0;

  for (const entry of state.fileEntries) {
    if (hasRulesForFile(state, entry.index)) mapped += 1;
    else unmapped += 1;

    if (hasConflictForFile(conflictReport, entry.index)) {
      conflicts += 1;
    }
  }

  return {
    all: state.fileEntries.length,
    mapped,
    unmapped,
    conflicts
  };
}

function getFilterModeLabel(mode) {
  switch (mode) {
    case "unmapped":
      return localize("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return localize("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return localize("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return localize("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}

function renderTreeNode(node, state, controller, conflictReport, parentList) {
  const folderNames = [...node.folders.keys()].sort((left, right) => left.localeCompare(right));
  for (const folderName of folderNames) {
    const collapsed = collapseFolderBranch(folderName, node.folders.get(folderName));

    const folderItem = document.createElement("li");
    folderItem.classList.add("eidolon-tile-criteria__tree-branch");

    const row = document.createElement("div");
    row.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-folder-open");
    row.appendChild(icon);

    const label = document.createElement("span");
    label.classList.add("eidolon-tile-criteria__tree-folder-label");
    label.textContent = collapsed.label;
    label.title = collapsed.label;
    row.appendChild(label);

    folderItem.appendChild(row);

    const nested = document.createElement("ul");
    nested.classList.add("eidolon-tile-criteria__tree");
    nested.dataset.folder = collapsed.label;
    renderTreeNode(collapsed.node, state, controller, conflictReport, nested);
    if (nested.childElementCount > 0) {
      folderItem.appendChild(nested);
    }
    parentList.appendChild(folderItem);
  }

  const files = [...node.files].sort((left, right) => left.name.localeCompare(right.name));
  if (!files.length) return;

  const fileHost = document.createElement("li");
  const fileList = document.createElement("ul");
  fileList.classList.add("document-list", "eidolon-tile-criteria__document-list");

  for (const file of files) {
    const entry = file.entry;
    const isSelected = entry.index === state.selectedFileIndex;
    const isDefault = entry.index === state.defaultIndex;
    const summaries = getRuleSummariesForFile(state, entry.index);

    const item = document.createElement("li");
    item.classList.add("document", "update", "eidolon-tile-criteria__tree-file");

    const row = document.createElement("button");
    row.type = "button";
    row.classList.add("eidolon-tile-criteria__file-row");
    const hasErrorConflict = conflictReport?.errorFileIndexes?.includes(entry.index);
    const hasWarningConflict = conflictReport?.warningFileIndexes?.includes(entry.index);
    if (hasErrorConflict) {
      row.classList.add("has-conflict");
    } else if (hasWarningConflict) {
      row.classList.add("has-warning");
    }
    const fullLabel = state.relativePaths.get(entry.index) || entry.path || file.name;
    const titleSegments = [fullLabel];
    if (hasErrorConflict) {
      titleSegments.push(
        localize(
          "EIDOLON.TileCriteria.ConflictFileHint",
          "This file participates in one or more conflicting rules."
        )
      );
    } else if (hasWarningConflict) {
      titleSegments.push(
        localize(
          "EIDOLON.TileCriteria.WarningFileHint",
          "This file has potentially redundant rules."
        )
      );
    }
    if (!summaries.length) {
      titleSegments.push(
        localize(
          "EIDOLON.TileCriteria.UnmappedHint",
          "No criteria rules map to this file."
        )
      );
    }
    row.title = titleSegments.join("\n");
    if (isSelected) row.classList.add("is-selected");
    row.addEventListener("click", () => {
      state.selectedFileIndex = entry.index;
      renderController(controller);
      openRuleEditorDialog(controller, entry.index);
    });

    const indicator = document.createElement("span");
    indicator.classList.add("eidolon-tile-criteria__indicator");
    indicator.dataset.kind = isDefault ? "default" : summaries.length ? "mapped" : "unmapped";
    row.appendChild(indicator);

    const content = document.createElement("span");
    content.classList.add("eidolon-tile-criteria__file-content");

    const titleRow = document.createElement("span");
    titleRow.classList.add("eidolon-tile-criteria__file-heading");

    const title = document.createElement("span");
    title.classList.add("eidolon-tile-criteria__file-title");
    title.textContent = middleEllipsis(file.name || entry.label);
    title.title = fullLabel;
    titleRow.appendChild(title);

    const indexBadge = createBadge(`#${entry.index + 1}`, "meta");
    indexBadge.classList.add("eidolon-tile-criteria__index-badge");
    titleRow.appendChild(indexBadge);

    content.appendChild(titleRow);

    const badges = document.createElement("span");
    badges.classList.add("eidolon-tile-criteria__badges");

    if (isDefault) {
      badges.appendChild(createBadge(localize("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    }

    const visibleSummaries = summaries.slice(0, 2);
    for (const summary of visibleSummaries) {
      badges.appendChild(createBadge(summary, "rule"));
    }
    if (summaries.length > visibleSummaries.length) {
      badges.appendChild(createBadge(`+${summaries.length - visibleSummaries.length}`, "meta"));
    }

    content.appendChild(badges);
    row.appendChild(content);

    if (hasErrorConflict || hasWarningConflict) {
      const conflictIcon = document.createElement("span");
      conflictIcon.classList.add("eidolon-tile-criteria__row-warning");
      conflictIcon.dataset.mode = hasErrorConflict ? "error" : "warning";
      conflictIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>';
      row.appendChild(conflictIcon);
    }

    item.appendChild(row);

    fileList.appendChild(item);
  }

  fileHost.appendChild(fileList);
  parentList.appendChild(fileHost);
}

function renderTreePanel(state, controller, conflictReport, actionHandlers = {}) {
  const panel = document.createElement("section");
  panel.classList.add("eidolon-tile-criteria__tree-panel");

  const filter = createRegexFilter(state.filterQuery);
  const modeCounts = getFilterModeCounts(state, conflictReport);

  if (state.filterMode !== "all" && modeCounts[state.filterMode] === 0) {
    state.filterMode = "all";
  }

  const toolbar = document.createElement("div");
  toolbar.classList.add("eidolon-tile-criteria__toolbar");

  const modeBar = document.createElement("div");
  modeBar.classList.add("eidolon-tile-criteria__mode-bar");

  for (const mode of ENTRY_FILTER_MODES) {
    const modeButton = document.createElement("button");
    modeButton.type = "button";
    modeButton.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button");
    modeButton.dataset.mode = mode;
    modeButton.textContent = getFilterModeLabel(mode);
    const isApplicable = mode === "all" || modeCounts[mode] > 0;
    modeButton.disabled = !isApplicable;

    if (!isApplicable) {
      modeButton.dataset.tooltip = localize(
        "EIDOLON.TileCriteria.FilterModeUnavailable",
        "No entries currently match this filter."
      );
      modeButton.title = modeButton.dataset.tooltip;
    }

    if (state.filterMode === mode) {
      modeButton.classList.add("is-active");
      modeButton.setAttribute("aria-pressed", "true");
    } else {
      modeButton.setAttribute("aria-pressed", "false");
    }

    modeButton.addEventListener("click", () => {
      if (state.filterMode === mode) return;
      state.filterMode = mode;
      renderController(controller);
    });
    modeBar.appendChild(modeButton);
  }
  toolbar.appendChild(modeBar);

  const filterRow = document.createElement("div");
  filterRow.classList.add("eidolon-tile-criteria__filter-row");

  const filterInput = document.createElement("input");
  filterInput.type = "text";
  filterInput.classList.add("eidolon-tile-criteria__filter-input");
  filterInput.placeholder = localize("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)");
  filterInput.value = state.filterQuery;
  filterInput.autocomplete = "off";

  filterInput.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  filterInput.addEventListener("keyup", (event) => {
    event.stopPropagation();
  });

  filterInput.addEventListener("change", (event) => {
    event.stopPropagation();
  });

  filterInput.addEventListener("input", (event) => {
    event.stopPropagation();
    const caretStart = filterInput.selectionStart ?? filterInput.value.length;
    const caretEnd = filterInput.selectionEnd ?? caretStart;
    state.filterQuery = filterInput.value;
    renderController(controller);

    requestAnimationFrame(() => {
      const nextInput = controller.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (!(nextInput instanceof HTMLInputElement)) return;

      nextInput.focus();
      try {
        nextInput.setSelectionRange(caretStart, caretEnd);
      } catch (_error) {
        // Some browsers/input modes may reject selection restore; ignore.
      }
    });
  });
  filterRow.appendChild(filterInput);

  const actionBar = document.createElement("div");
  actionBar.classList.add("eidolon-tile-criteria__toolbar-actions");

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  const saveLabel = localize("EIDOLON.TileCriteria.Save", "Save Rules");
  saveButton.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only");
  saveButton.dataset.tooltip = saveLabel;
  saveButton.setAttribute("aria-label", saveLabel);
  saveButton.title = saveLabel;
  saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>';
  saveButton.disabled = conflictReport.errors.length > 0;
  saveButton.addEventListener("click", () => {
    void actionHandlers.onSave?.();
  });
  actionBar.appendChild(saveButton);

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  const clearLabel = localize("EIDOLON.TileCriteria.Clear", "Clear Rules");
  clearButton.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only");
  clearButton.dataset.tooltip = clearLabel;
  clearButton.setAttribute("aria-label", clearLabel);
  clearButton.title = clearLabel;
  clearButton.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>';
  clearButton.addEventListener("click", () => {
    void actionHandlers.onClear?.();
  });
  actionBar.appendChild(clearButton);

  filterRow.appendChild(actionBar);
  toolbar.appendChild(filterRow);
  panel.appendChild(toolbar);

  if (filter.error) {
    const error = document.createElement("p");
    error.classList.add("notes", "eidolon-tile-criteria__filter-error");
    error.textContent = `${localize("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${filter.error}`;
    panel.appendChild(error);
  }

  const treeWrap = document.createElement("div");
  treeWrap.classList.add("eidolon-tile-criteria__library-tree");

  const filteredEntries = state.fileEntries.filter((entry) => {
    const path = state.relativePaths.get(entry.index) || entry.path || entry.label;
    return matchesFilterMode(state, entry, conflictReport) && filter.matches(path);
  });

  if (!state.fileEntries.length) {
    const empty = document.createElement("p");
    empty.classList.add("notes");
    empty.textContent = localize("EIDOLON.TileCriteria.NoVariants", "No MATT variants found");
    treeWrap.appendChild(empty);
  } else if (!filteredEntries.length) {
    const empty = document.createElement("p");
    empty.classList.add("notes");
    empty.textContent = localize("EIDOLON.TileCriteria.NoMatches", "No variants match this filter.");
    treeWrap.appendChild(empty);
  } else {
    const tree = document.createElement("ul");
    tree.classList.add("eidolon-tile-criteria__tree");
    renderTreeNode(buildTree(filteredEntries), state, controller, conflictReport, tree);
    treeWrap.appendChild(tree);
  }

  panel.appendChild(treeWrap);
  return panel;
}

function renderController(controller) {
  const { section, state } = controller;
  const conflictReport = analyzeRuleConflicts(state);
  persistUiState(controller);
  section.replaceChildren();

  const handleSave = async () => {
    try {
      const conflicts = analyzeRuleConflicts(state);
      if (conflicts.errors.length) {
        state.status = {
          mode: "error",
          message: localize(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${conflicts.errors.length} conflict(s) before saving tile criteria rules.`
          )
        };
        renderController(controller);
        return;
      }

      const normalized = exportTileCriteria(state);
      if (!normalized) {
        state.status = {
          mode: "error",
          message: localize("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        };
        renderController(controller);
        return;
      }

      await setTileCriteria(controller.tile, normalized);
      const preservedFilter = state.filterQuery;
      const preservedFilterMode = state.filterMode;
      const preservedSelected = state.selectedFileIndex;
      controller.state = buildEditorState(controller.tile);
      controller.state.filterQuery = preservedFilter;
      controller.state.filterMode = preservedFilterMode;
      if (Number.isInteger(preservedSelected)) {
        controller.state.selectedFileIndex = preservedSelected;
      }
      controller.state.status = {
        mode: "ready",
        message: localize("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      };
      renderController(controller);
      refreshOpenRuleEditor(controller);
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to save tile criteria`, error);
      state.status = {
        mode: "error",
        message: error?.message ?? "Failed to save tile criteria rules."
      };
      renderController(controller);
    }
  };

  const handleClear = async () => {
    try {
      await setTileCriteria(controller.tile, null);
      const preservedFilter = state.filterQuery;
      const preservedFilterMode = state.filterMode;
      const preservedSelected = state.selectedFileIndex;
      controller.state = buildEditorState(controller.tile);
      controller.state.filterQuery = preservedFilter;
      controller.state.filterMode = preservedFilterMode;
      if (Number.isInteger(preservedSelected)) {
        controller.state.selectedFileIndex = preservedSelected;
      }
      controller.state.status = {
        mode: "ready",
        message: localize("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      };
      renderController(controller);
      refreshOpenRuleEditor(controller);
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to clear tile criteria`, error);
      state.status = {
        mode: "error",
        message: error?.message ?? "Failed to clear tile criteria rules."
      };
      renderController(controller);
    }
  };

  section.appendChild(renderTreePanel(state, controller, conflictReport, {
    onSave: handleSave,
    onClear: handleClear
  }));

  if (conflictReport.errors.length || conflictReport.warnings.length) {
    const conflictPanel = document.createElement("section");
    conflictPanel.classList.add("eidolon-tile-criteria__conflicts");

    const summary = document.createElement("p");
    summary.classList.add("eidolon-tile-criteria__conflict-summary", "notes");
    if (conflictReport.errors.length) {
      summary.dataset.mode = "error";
      summary.textContent = localize(
        "EIDOLON.TileCriteria.ConflictSummary",
        `${conflictReport.errors.length} conflict(s) must be resolved before saving${conflictReport.warnings.length ? ` (${conflictReport.warnings.length} warning(s))` : ""}.`
      );
    } else {
      summary.dataset.mode = "warning";
      summary.textContent = localize(
        "EIDOLON.TileCriteria.WarningSummary",
        `${conflictReport.warnings.length} potential issue(s) detected.`
      );
    }
    conflictPanel.appendChild(summary);

    const hint = document.createElement("p");
    hint.classList.add("eidolon-tile-criteria__conflict-hint", "notes");
    hint.textContent = localize(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    );
    conflictPanel.appendChild(hint);

    section.appendChild(conflictPanel);
  }

  if (state.status.mode === "error" || state.status.mode === "warning") {
    const status = document.createElement("p");
    status.classList.add("eidolon-tile-criteria__status", "notes");
    status.dataset.mode = state.status.mode;
    status.textContent = state.status.message;
    section.appendChild(status);
  }
}

function createController(tile, app = null) {
  const section = document.createElement("section");
  section.classList.add("eidolon-tile-criteria");

  const state = buildEditorState(tile);
  applyUiState(state, readUiState(app));

  const controller = {
    app,
    tile,
    section,
    state
  };

  renderController(controller);
  return controller;
}

function findFooterElement(container) {
  if (!(container instanceof HTMLElement)) return null;

  const selectors = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];

  for (const selector of selectors) {
    const candidate = container.querySelector(selector);
    if (candidate instanceof HTMLElement) return candidate;
  }

  return null;
}

function findTabNav(root) {
  if (!(root instanceof HTMLElement)) return null;

  const selectors = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];

  for (const selector of selectors) {
    const nav = root.querySelector(selector);
    if (nav instanceof HTMLElement) return nav;
  }

  return null;
}

function findTabBody(root, nav) {
  if (!(root instanceof HTMLElement)) return null;

  const candidates = [
    root.querySelector(".tab[data-tab]")?.parentElement,
    root.querySelector(".sheet-body"),
    nav?.parentElement?.querySelector?.(":scope > .sheet-body"),
    nav?.parentElement
  ];

  return candidates.find((candidate) => candidate instanceof HTMLElement) ?? null;
}

function getTabGroup(nav, body) {
  return (
    nav?.dataset?.group
    ?? nav?.querySelector?.("[data-group]")?.dataset?.group
    ?? body?.querySelector?.(".tab[data-group]")?.dataset?.group
    ?? "main"
  );
}

function setTabButtonContent(button, label) {
  if (!(button instanceof HTMLElement)) return;

  button.textContent = "";

  const icon = document.createElement("i");
  icon.className = TILE_TAB_ICON;
  icon.setAttribute("inert", "");
  button.append(icon, " ");

  const text = document.createElement("span");
  text.textContent = label;
  button.append(text);
}

function createTabButton(nav, group) {
  const reference = nav.querySelector("[data-tab]");
  const tagName = reference?.tagName || "A";
  const button = document.createElement(tagName);

  if (reference instanceof HTMLElement) {
    button.className = reference.className;
  }

  button.classList.remove("active");

  if (tagName === "BUTTON") {
    button.type = "button";
  }

  button.dataset.action = "tab";
  button.dataset.tab = TILE_TAB_ID;
  button.dataset.group = group;
  button.setAttribute("aria-selected", "false");
  button.setAttribute("aria-pressed", "false");

  return button;
}

function createTabPanel(body, group) {
  const panel = document.createElement("div");
  panel.classList.add("tab");
  panel.dataset.tab = TILE_TAB_ID;
  panel.dataset.group = group;
  panel.dataset.applicationPart = TILE_TAB_ID;
  panel.setAttribute("hidden", "true");

  const footer = findFooterElement(body);
  body.insertBefore(panel, footer ?? null);
  return panel;
}

function syncTabVisibility(app, group, button, panel) {
  if (!(button instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;

  const activeTab = app?.tabGroups?.[group];
  const isActive = typeof activeTab === "string"
    ? activeTab === TILE_TAB_ID
    : button.classList.contains("active") || panel.classList.contains("active");

  if (isActive) {
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    button.setAttribute("aria-pressed", "true");
    panel.classList.add("active");
    panel.removeAttribute("hidden");
    panel.removeAttribute("aria-hidden");
    return;
  }

  button.classList.remove("active");
  button.setAttribute("aria-selected", "false");
  button.setAttribute("aria-pressed", "false");
  panel.classList.remove("active");
  panel.setAttribute("hidden", "true");
}

function ensureTileCriteriaTab(app, root) {
  const nav = findTabNav(root);
  const body = findTabBody(root, nav);
  if (!(nav instanceof HTMLElement) || !(body instanceof HTMLElement)) return null;

  const group = getTabGroup(nav, body);

  let tabButton = nav.querySelector(`[data-tab="${TILE_TAB_ID}"]`);
  if (!(tabButton instanceof HTMLElement)) {
    tabButton = createTabButton(nav, group);
    nav.appendChild(tabButton);
  }

  setTabButtonContent(tabButton, localize("EIDOLON.TileCriteria.TabLabel", "Criteria"));

  let tabPanel = body.querySelector(`.tab[data-tab="${TILE_TAB_ID}"]`);
  if (!(tabPanel instanceof HTMLElement)) {
    tabPanel = createTabPanel(body, group);
  }

  if (!tabButton.dataset.eidolonTileCriteriaBound) {
    tabButton.addEventListener("click", () => {
      setActiveTab(app, TILE_TAB_ID, group);
      requestAnimationFrame(() => {
        syncTabVisibility(app, group, tabButton, tabPanel);
      });
    });
    tabButton.dataset.eidolonTileCriteriaBound = "true";
  }

  syncTabVisibility(app, group, tabButton, tabPanel);
  requestAnimationFrame(() => {
    syncTabVisibility(app, group, tabButton, tabPanel);
  });

  return tabPanel;
}

export function registerTileCriteriaConfigControls() {
  Hooks.on("renderTileConfig", (app, html) => {
    const root = asHTMLElement(html);
    if (!root) return;

    const tile = getTileDocument(app);
    if (!tile) return;

    root.querySelector(".eidolon-tile-criteria")?.remove();

    if (!getCriteriaSurfacesEnabled()) {
      root.querySelector(`.item[data-tab='${TILE_TAB_ID}']`)?.remove();
      root.querySelector(`.tab[data-tab='${TILE_TAB_ID}']`)?.remove();
      return;
    }

    const controller = createController(tile, app);
    const tabPanel = ensureTileCriteriaTab(app, root);

    if (tabPanel instanceof HTMLElement) {
      tabPanel.replaceChildren(controller.section);
      app.setPosition?.({ height: "auto" });
      return;
    }

    const form = app?.form instanceof HTMLFormElement
      ? app.form
      : root instanceof HTMLFormElement
        ? root
        : root.querySelector("form");
    if (!(form instanceof HTMLFormElement)) return;

    const submitButton = form.querySelector("button[type='submit']");
    if (submitButton?.parentElement) {
      submitButton.parentElement.insertAdjacentElement("beforebegin", controller.section);
    } else {
      form.appendChild(controller.section);
    }
  });
}
