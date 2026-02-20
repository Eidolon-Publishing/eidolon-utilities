function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function deepClone(value) {
  if (value === null || value === undefined) return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function deletePath(target, path) {
  if (!path) return;
  const parts = path.split(".").filter(Boolean);
  if (!parts.length) return;

  let current = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!isPlainObject(current?.[parts[i]])) return;
    current = current[parts[i]];
  }
  delete current[parts.at(-1)];
}

function fallbackMerge(target, source) {
  const output = deepClone(target ?? {});
  if (!isPlainObject(source)) return output;

  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("-=") && value === true) {
      deletePath(output, key.slice(2));
      continue;
    }

    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = fallbackMerge(output[key], value);
    } else {
      output[key] = deepClone(value);
    }
  }

  return output;
}

function defaultMerge(target, source) {
  if (foundry?.utils?.mergeObject && foundry?.utils?.deepClone) {
    return foundry.utils.mergeObject(target, foundry.utils.deepClone(source), {
      inplace: false
    });
  }
  return fallbackMerge(target, source);
}

function criteriaMatch(criteria, state) {
  if (!criteria) return true;
  for (const key of Object.keys(criteria)) {
    if (criteria[key] !== state[key]) return false;
  }
  return true;
}

/**
 * Resolve all matching rules against a state.
 *
 * Matching rules are sorted by specificity ascending, then list order.
 */
export function resolveRules(base, rules, state, mergeFn) {
  const merge = mergeFn ?? defaultMerge;
  let result = merge({}, base ?? {});
  if (!rules?.length) return result;

  const matches = [];
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];
    if (criteriaMatch(rule?.criteria, state)) {
      const specificity = rule?.criteria ? Object.keys(rule.criteria).length : 0;
      matches.push({ specificity, index: i, delta: rule?.delta });
    }
  }

  matches.sort((a, b) => a.specificity - b.specificity || a.index - b.index);

  for (const match of matches) {
    if (match.delta) {
      result = merge(result, match.delta);
    }
  }

  return result;
}

