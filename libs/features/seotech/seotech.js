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

export async function getVideoObject(url, options) {
  const { env } = options;
  const videoUrl = new URL(url)?.href;
  const baseUrl = env === 'prod' ? SEOTECH_API_URL_PROD : SEOTECH_API_URL_STAGE;
  const videoObjectUrl = `${baseUrl}/api/v1/web/seotech/getVideoObject?url=${videoUrl}`;
  const resp = await fetch(videoObjectUrl, { headers: { 'Content-Type': 'application/json' } });
  const body = await resp?.json();
  if (!resp.ok) {
    throw new Error(`Failed to fetch video: ${body?.error}`);
  }
  return body.videoObject;
}

// https://github.com/orgs/adobecom/discussions/2633
export function getRepoByImsClientId(imsClientId) {
  return {
    'adobedotcom-cc': 'cc',
    acrobatmilo: 'dc',
    bacom: 'bacom',
    homepage_milo: 'homepage',
    milo: 'milo',
  }[imsClientId];
}

export async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function getStructuredData(bucket, id, options) {
  if (!bucket || !id) throw new Error('bucket and id are required');
  const { baseUrl } = options;
  const url = `${baseUrl}/structured-data/${bucket}/${id}`;
  const resp = await fetch(url);
  if (!resp || !resp.ok) return null;
  const body = await resp.json();
  return body;
}

export async function appendScriptTag({ locationUrl, getMetadata, createTag, getConfig }) {
  const url = new URL(locationUrl);
  const params = new URLSearchParams(url.search);
  const append = (obj, className) => {
    if (!obj) return;
    const attributes = { type: 'application/ld+json' };
    if (className) attributes.class = className;
    const script = createTag('script', attributes, JSON.stringify(obj));
    document.head.append(script);
  };

  const promises = [];
  if (getMetadata('seotech-structured-data') === 'on') {
    const bucket = getRepoByImsClientId(getConfig()?.imsClientId);
    const id = await sha256(url.pathname?.replace('.html', ''));
    const baseUrl = params.get('seotech-api-base-url') || 'https://www.adobe.com/seotech/api';
    promises.push(getStructuredData(bucket, id, { baseUrl })
      .then((obj) => append(obj, 'seotech-structured-data'))
      .catch((e) => logError(e.message)));
  }
  if (getMetadata('seotech-video-url')) {
    const env = getConfig()?.env?.name;
    promises.push(getVideoObject(getMetadata('seotech-video-url'), { env })
      .then((videoObject) => append(videoObject, 'seotech-video-url'))
      .catch((e) => logError(e.message)));
  }
  return Promise.all(promises);
}

export default appendScriptTag;
