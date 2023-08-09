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

export async function getStructuredData(url, seotechAPIUrl) {
  const dataUrl = new URL(url)?.href;
  const apiUrl = `${seotechAPIUrl}/api/v1/web/seotech/getStructuredData?url=${dataUrl}`;
  const resp = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } });
  const body = await resp?.json();
  if (!resp.ok) {
    throw new Error(`Failed to fetch structured data: ${body?.error}`);
  }
  return body.objects;
}

export async function appendScriptTag({ getMetadata, createTag, getConfig }) {
  const seotechAPIUrl = getConfig()?.env?.name === 'prod'
    ? SEOTECH_API_URL_PROD : SEOTECH_API_URL_STAGE;

  const append = (obj) => {
    const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
    document.head.append(script);
  };

  const prs = [];
  if (getMetadata('seotech-structured-data') === 'on') {
    prs.push(getStructuredData(window.location.href, seotechAPIUrl)
      .then((r) => r.forEach((obj) => append(obj)))
      .catch((e) => logError(e.message)));
  }
  if (getMetadata('seotech-video-url')) {
    prs.push(getVideoObject(getMetadata('seotech-video-url'), seotechAPIUrl)
      .then((r) => append(r))
      .catch((e) => logError(e.message)));
  }
  return Promise.all(prs);
}

export default appendScriptTag;
