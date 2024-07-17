export const SEOTECH_API_URL_PROD = 'https://14257-seotech.adobeioruntime.net';
export const SEOTECH_API_URL_STAGE = 'https://14257-seotech-stage.adobeioruntime.net';
export const SEOTECH_CDN_URL_PROD = 'https://seotech.adobe.com'; // fixme
export const SEOTECH_CDN_URL_STAGE = 'https://seotech.adobe.com'; // fixme

export const HLX_MATCHER = /([\w-]+)--([\w-]+)--([\w-]+)\.hlx\.(page|live)/;
export const ADOBECOM_MATCHER = /([\w-]+)(\.stage)?\.adobe\.com/;
export const PATHNAME_MATCHER = /^(?:\/(?<geo>(?<country>[a-z]{2}|africa|mena)(?:_(?<lang>[a-z]{2,3}))?))?(?<geopath>(?:\/(?<cloudfolder>acrobat|creativecloud|express))?\/.*)$/;

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

export async function getStructuredData(url) {
  const hash = await calcAdobeUrlHash(url);
  const jsonUrl = `${SEOTECH_CDN_URL_PROD}/structured-data/${hash}.json`; // fixme
  const resp = await fetch(jsonUrl);
  if (!resp || !resp.ok) return null;
  const body = await resp.json();
  return body;
}

export async function appendScriptTag({ locationUrl, getMetadata, createTag, getConfig }) {
  const seotechAPIUrl = getConfig()?.env?.name === 'prod'
    ? SEOTECH_API_URL_PROD : SEOTECH_API_URL_STAGE;

  const append = (obj) => {
    if (!obj) return;
    const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
    document.head.append(script);
  };

  const promises = [];
  if (getMetadata('seotech-structured-data') === 'on') {
    promises.push(getStructuredData(locationUrl)
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
