import { getPageStatus } from './adminStatus.js';

export function deriveLiveUrl(url) {
  const live = new URL(url.href);
  live.hostname = live.hostname.replace('hlx.page', 'hlx.live').replace('aem.page', 'aem.live');
  return live;
}

async function fetchPlain(url) {
  const plain = new URL(url.href);
  plain.pathname = `${plain.pathname.replace(/\/$/, '')}.plain.html`;
  try {
    const resp = await fetch(plain.href);
    if (!resp.ok) return null;
    return { html: await resp.text() };
  } catch {
    return null;
  }
}

export default async function fetchVersions(previewUrl) {
  const liveUrl = deriveLiveUrl(previewUrl);
  const status = await getPageStatus(previewUrl).catch(() => null);

  const pMod = status?.preview?.lastModified ? Date.parse(status.preview.lastModified) : NaN;
  const lMod = status?.live?.lastModified ? Date.parse(status.live.lastModified) : NaN;
  // Nothing unpublished: skip the diff fetch entirely when preview isn't newer than live.
  if (!Number.isNaN(pMod) && !Number.isNaN(lMod) && pMod <= lMod) {
    return { preview: null, live: null, status, skipped: true };
  }

  const [preview, live] = await Promise.all([fetchPlain(previewUrl), fetchPlain(liveUrl)]);
  return { preview, live, status, skipped: false };
}
