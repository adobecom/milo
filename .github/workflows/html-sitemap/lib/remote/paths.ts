function joinRemotePath(...segments: string[]): string {
  const joined = segments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
  return joined.replace(/^\/+/, '');
}

export function normalizeDaRoot(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('`--da-root` must not be empty.');
  return trimmed.replace(/\/+$/, '').replace(/^([^/])/, '/$1');
}

export function getRemoteHtmlFilePath(daRoot: string, baseGeo: string): string {
  return joinRemotePath(daRoot, baseGeo, 'sitemap.html');
}

export function getRemoteDocumentPath(daRoot: string, baseGeo: string): string {
  return joinRemotePath(daRoot, baseGeo, 'sitemap');
}
