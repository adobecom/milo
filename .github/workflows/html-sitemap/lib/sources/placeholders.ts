import fs from 'node:fs/promises';

export type PlaceholderMap = Record<string, string>;

function normalizePlaceholderEntry(entry: Record<string, unknown>): [string, string] | null {
  const key = String(entry.Key || entry.key || '').trim();
  const value = String(entry.Text || entry.text || entry.value || '').trim();
  if (!key) return null;
  return [key, value];
}

export async function loadPlaceholderMap(filePath: string): Promise<PlaceholderMap> {
  try {
    const json = JSON.parse(await fs.readFile(filePath, 'utf8')) as { data?: Record<string, unknown>[] };
    const entries = Array.isArray(json.data) ? json.data : [];
    return Object.fromEntries(entries.map(normalizePlaceholderEntry).filter(Boolean) as [string, string][]);
  } catch {
    return {};
  }
}

export function resolvePlaceholders(text: string, placeholders: PlaceholderMap): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, key: string) => {
    const resolved = placeholders[key.trim()];
    return resolved || match;
  });
}
