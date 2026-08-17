import { getPageStatus } from '../adminStatus.js';

function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function deriveLiveUrl(url) {
  const live = new URL(url.href);
  if (isLocalHost(live.hostname)) {
    return new URL(`https://main--milo--adobecom.aem.live${live.pathname}`);
  }
  live.hostname = live.hostname.replace('hlx.page', 'hlx.live').replace('aem.page', 'aem.live');
  return live;
}

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
  if (!isLocalHost(previewUrl.hostname)
    && !Number.isNaN(pMod) && !Number.isNaN(lMod) && pMod <= lMod) {
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
