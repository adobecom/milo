export const SEOTECH_API_URL_PROD = 'https://14257-seotech.adobeioruntime.net';
export const SEOTECH_API_URL_STAGE = 'https://14257-seotech-stage.adobeioruntime.net';
export const SEOTECH_CDN_URL_PROD = 'https://seotech.adobe.com'; // fixme
export const SEOTECH_CDN_URL_STAGE = 'https://seotech.adobe.com'; // fixme

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

// todo: getStructuredData(url, cloud)
// Use url to determine hash of JSON file to fetch from seotech CDN
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

export const HLX_MATCHER = /([\w-]+)--([\w-]+)--([\w-]+)\.hlx.(page|live)/;
export const ADOBECOM_MATCHER = /([\w-]+)(.stage)?\.adobe.com/;
export const PATHNAME_MATCHER = /^(?:\/(?<geo>(?<country>[a-z]{2}|africa|mena)(?:_(?<lang>[a-z]{2,3}))?))?(?<geopath>(?:\/(?<cloudfolder>acrobat|creativecloud|express))?\/.*)$/;

export function parseAdobeUrl(rawUrl) {
  const url = new URL(rawUrl);

  const path = url.pathname.match(PATHNAME_MATCHER).groups;

  const hlx = url.hostname.match(HLX_MATCHER);
  if (hlx) {
    return {
      ...path,
      domain: url.hostname,
      pathname: url.pathname,
      cloud: hlx[2],
      env: {
        page: 'stage',
        live: 'prod',
      }[hlx[4]],
    };
  }

  const adobe = url.hostname.match(ADOBECOM_MATCHER);
  if (adobe) {
    const cloud = {
      business: 'bacom',
      milo: 'milo',
    }[adobe[1]] || {
      acrobat: 'dc',
      creativecloud: 'cc',
      express: 'express',
      default: 'homepage',
    }[path.cloudfolder || 'default'];

    return {
      ...path,
      domain: url.hostname,
      pathname: url.pathname,
      cloud,
      env: adobe[2] ? 'stage' : 'prod',
    };
  }

  return null;
}

export async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function calcAdobeUrlHash(url) {
  const adobeUrl = parseAdobeUrl(url);
  const cloud = adobeUrl.cloud || '';
  const pathname = adobeUrl.pathname.replace('.html', '');
  const key = `${cloud}${pathname}`;
  const hash = await sha256(key);
  return hash;
}

// todo: replace getStructuredData
export async function fetchStructuredData(url) {
  const hash = await calcAdobeUrlHash(url);
  const jsonUrl = `${SEOTECH_CDN_URL_PROD}/structured-data/${hash}.json`; // fixme
  try {
    const resp = await fetch(jsonUrl);
    if (!resp || !resp.ok) return null;
    const body = await resp.json();
    return body;
  } catch (e) {
    logError(e.message);
  }
  return null;
}

export default appendScriptTag;
