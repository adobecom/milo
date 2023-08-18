export const SEOTECH_API_URL_PROD = 'https://14257-seotech.adobeioruntime.net';
export const SEOTECH_API_URL_STAGE = 'https://14257-seotech-stage.adobeioruntime.net';

export function logError(msg) {
  window.lana?.log(`SEOTECH: ${msg}`, {
    debug: false,
    implicitSampleRate: 100,
    sampleRate: 100,
    tags: 'errorType=seotech',
  });
}

export async function getVideoObject(url, seotechAPIUrl) {
  const videoUrl = new URL(url)?.href;
  const videoObjectUrl = `${seotechAPIUrl}/api/v1/web/seotech/getVideoObject?url=${videoUrl}`;
  const resp = await fetch(videoObjectUrl, { headers: { 'Content-Type': 'application/json' } });
  const body = await resp?.json();
  if (!resp.ok) {
    throw new Error(`Failed to fetch video: ${body?.error}`);
  }
  return body.videoObject;
}

export async function getStructuredData(url, sheetUrl, seotechAPIUrl) {
  const apiUrl = new URL(seotechAPIUrl);
  apiUrl.pathname = '/api/v1/web/seotech/getStructuredData';
  apiUrl.searchParams.set('url', url);
  if (sheetUrl) {
    apiUrl.searchParams.set('sheetUrl', sheetUrl);
  }
  const resp = await fetch(apiUrl.href, { headers: { 'Content-Type': 'application/json' } });
  const body = await resp?.json();
  if (!resp.ok) {
    throw new Error(`Failed to fetch structured data: ${body?.error}`);
  }
  return body.objects;
}

export async function appendScriptTag({ locationUrl, getMetadata, createTag, getConfig }) {
  const windowUrl = new URL(locationUrl);
  const seotechAPIUrl = getConfig()?.env?.name === 'prod'
    ? SEOTECH_API_URL_PROD : SEOTECH_API_URL_STAGE;

  const append = (obj) => {
    const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
    document.head.append(script);
  };

  const promises = [];
  if (getMetadata('seotech-structured-data') === 'on') {
    const pageUrl = `${windowUrl.origin}${windowUrl.pathname}`;
    const sheetUrl = (new URLSearchParams(windowUrl.search)).get('seotech-sheet-url') || getMetadata('seotech-sheet-url');
    promises.push(getStructuredData(pageUrl, sheetUrl, seotechAPIUrl)
      .then((objects) => objects.forEach((obj) => append(obj)))
      .catch((e) => logError(e.message)));
  }
  if (getMetadata('seotech-video-url')) {
    promises.push(getVideoObject(getMetadata('seotech-video-url'), seotechAPIUrl)
      .then((videoObject) => append(videoObject))
      .catch((e) => logError(e.message)));
  }
  return Promise.all(promises);
}

export default appendScriptTag;
