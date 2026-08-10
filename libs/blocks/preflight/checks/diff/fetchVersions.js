import { getPageStatus } from '../adminStatus.js';

export function deriveLiveUrl(url) {
  const live = new URL(url.href);
  live.hostname = live.hostname.replace('hlx.page', 'hlx.live').replace('aem.page', 'aem.live');
  return live;
}

// "missing" (doesn't exist) vs "error" (failed to load) — conflating them fakes an empty live doc.
// no-store: live/preview .plain.html are cached (max-age 7200), so a plain fetch would diff against
// a stale copy during iterative edits — always pull the current version.
async function fetchPlain(url) {
  const plain = new URL(url.href);
  plain.pathname = `${plain.pathname.replace(/\/$/, '')}.plain.html`;
  try {
    const resp = await fetch(plain.href, { cache: 'no-store' });
    if (!resp.ok) return { html: null, fetchStatus: resp.status === 404 ? 'missing' : 'error' };
    return { html: await resp.text(), fetchStatus: 'ok' };
  } catch {
    return { html: null, fetchStatus: 'error' };
  }
}

export default async function fetchVersions(previewUrl) {
  const liveUrl = deriveLiveUrl(previewUrl);
  const status = await getPageStatus(previewUrl).catch((e) => {
    window.lana?.log?.(`[preflight][diff] status fetch failed: ${e.message}`, { tags: 'preflight', errorType: 'i' });
    return null;
  });

  const pMod = status?.preview?.lastModified ? Date.parse(status.preview.lastModified) : NaN;
  const lMod = status?.live?.lastModified ? Date.parse(status.live.lastModified) : NaN;
  // Nothing unpublished: skip the diff fetch entirely when preview isn't newer than live.
  if (!Number.isNaN(pMod) && !Number.isNaN(lMod) && pMod <= lMod) {
    return { preview: null, live: null, liveStatus: 'ok', status, skipped: true };
  }

  const [previewResult, liveResult] = await Promise.all([
    fetchPlain(previewUrl),
    fetchPlain(liveUrl),
  ]);
  const preview = previewResult.html === null ? null : { html: previewResult.html };
  const live = liveResult.html === null ? null : { html: liveResult.html };
  return { preview, live, liveStatus: liveResult.fetchStatus, status, skipped: false };
}
