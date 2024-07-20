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

export function getRepoByImsClientId(imsClientId) {
  return {
    'adobedotcom-cc': 'cc',
    acrobatmilo: 'dc',
    bacom: 'bacom',
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
  const { env } = options;
  const baseUrl = env === 'prod' ? SEOTECH_API_URL_PROD : SEOTECH_API_URL_STAGE;
  const url = `${baseUrl}/apis/v1/seotech/structured-data/${bucket}/${id}`;
  const resp = await fetch(url);
  if (!resp || !resp.ok) return null;
  const body = await resp.json();
  return body;
}

export async function appendScriptTag({ locationUrl, getMetadata, createTag, getConfig }) {
  const env = getConfig()?.env?.name;
  const seotechAPIUrl = env === 'prod'
    ? SEOTECH_API_URL_PROD : SEOTECH_API_URL_STAGE;

  const append = (obj) => {
    if (!obj) return;
    const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
    document.head.append(script);
  };

  const promises = [];
  if (getMetadata('seotech-structured-data') === 'on') {
    const bucket = getRepoByImsClientId(getConfig()?.imsClientId);
    const id = await sha256(new URL(locationUrl).pathname?.replace('.html', ''));
    promises.push(getStructuredData(bucket, id, { env })
      .then((obj) => append(obj))
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
