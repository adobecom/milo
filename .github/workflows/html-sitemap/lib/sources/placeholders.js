import fs from 'node:fs/promises';

/**
 * @typedef {Record<string, string>} PlaceholderMap
 */

/**
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
