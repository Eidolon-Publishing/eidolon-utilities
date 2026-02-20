/**
 * Generic criteria-based matching.
 *
 * Returns the first exact match for the subset of keys defined by `responds`.
 * Optionally falls back by resetting keys in `fallback` to their defaults.
 */
export function findBestMatch(entries, state, responds, fallback, defaults) {
  if (!entries?.length || !responds?.length) return -1;

  const target = {};
  for (const key of responds) {
    target[key] = state[key];
  }

  const exactIndex = findExactMatch(entries, target, responds);
  if (exactIndex >= 0) return exactIndex;

  if (fallback?.length && defaults) {
    const relaxed = { ...target };
    for (const key of fallback) {
      if (!(key in relaxed)) continue;
      relaxed[key] = defaults[key] ?? "Standard";
      const index = findExactMatch(entries, relaxed, responds);
      if (index >= 0) return index;
    }
  }

  return -1;
}

function findExactMatch(entries, target, responds) {
  return entries.findIndex((entry) => {
    for (const key of responds) {
      if (entry[key] !== target[key]) return false;
    }
    return true;
  });
}

/**
 * Specificity matcher for MATT file indexes.
 *
 * Entries are criteria objects. The most specific matching object wins.
 * Ties are broken by first occurrence in the fileIndex array.
 */
export function findFileIndex(fileIndex, state) {
  if (!fileIndex?.length) return -1;

  let bestIndex = -1;
  let bestSpecificity = -1;

  for (let i = 0; i < fileIndex.length; i += 1) {
    const entry = fileIndex[i] ?? {};
    const keys = Object.keys(entry);

    if (keys.length === 0) {
      if (bestSpecificity < 0) {
        bestIndex = i;
        bestSpecificity = 0;
      }
      continue;
    }

    let matches = true;
    for (const key of keys) {
      if (entry[key] !== state[key]) {
        matches = false;
        break;
      }
    }

    if (matches && keys.length > bestSpecificity) {
      bestIndex = i;
      bestSpecificity = keys.length;
    }
  }

  return bestIndex;
}

