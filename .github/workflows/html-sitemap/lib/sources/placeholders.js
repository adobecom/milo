/**
 * Geo placeholder map loader and resolver. The `placeholders.json` for a
 * geo provides locale-specific replacements for `{{key}}` tokens that
 * appear in GNAV link titles, page titles, etc.
 */

import fs from 'node:fs/promises';

/**
 * @typedef {Record<string, string>} PlaceholderMap
 */

/**
 * Project a placeholders.json row into a `[key, value]` tuple. Tolerates
 * both `Key`/`Text` (DA naming) and lowercase variants.
 * @param {Record<string, unknown>} entry
 * @returns {[string, string] | null}
 */
function normalizePlaceholderEntry(entry) {
  const key = String(entry.Key || entry.key || '').trim();
  const value = String(entry.Text || entry.text || entry.value || '').trim();
  if (!key) return null;
  return [key, value];
}

/**
 * Load a placeholders.json into a flat `key -> text` map. Returns an
 * empty map if the file is missing or unparsable.
 * @param {string} filePath
 * @returns {Promise<PlaceholderMap>}
 */
export async function loadPlaceholderMap(filePath) {
  try {
    const json = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const entries = Array.isArray(json.data) ? json.data : [];
    return Object.fromEntries(entries.map(normalizePlaceholderEntry).filter(Boolean));
  } catch {
    return {};
  }
}

/**
 * Substitute `{{key}}` tokens in `text` with values from the map. Tokens
 * with no entry are left as-is so they're visible in output for debugging.
 * @param {string} text
 * @param {PlaceholderMap} placeholders
 * @returns {string}
 */
export function resolvePlaceholders(text, placeholders) {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const resolved = placeholders[key.trim()];
    return resolved || match;
  });
}
