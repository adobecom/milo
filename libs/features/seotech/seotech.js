export const PROD_BASE_URL = 'https://www.adobe.com/seotech/api';
export const STRUCTURED_DATA_ORIGIN_MAP_URL = 'https://firefly.azureedge.net/c4dbffdc97a2c4f65073a222e967ea7c-public/public/aem-origin-map/public.json';

export const REGEX_ADOBETV = /(?:https?:\/\/)?(?:stage-)?video.tv.adobe.com\/v\/([\d]+)/;
export const REGEX_YOUTUBE = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/;
export const VIDEO_OBJECT_PROVIDERS = [
  { provider: 'adobe', regex: REGEX_ADOBETV },
  { provider: 'youtube', regex: REGEX_YOUTUBE },
];

export function logError(msg, context = {}) {
  // Build additional context string with pilcrow delineation
  const additionalInfo = [];

  if (context.bucket) {
    additionalInfo.push(`bucket:${context.bucket}`);
  }

  if (context.repo) {
    additionalInfo.push(`repo:${context.repo}`);
  }

  if (context.id) {
    additionalInfo.push(`id:${context.id}`);
  }

  if (context.hostname) {
    additionalInfo.push(`hostname:${context.hostname}`);
  }

  if (context.videoUrl) {
    additionalInfo.push(`videoUrl:${context.videoUrl}`);
  }

  if (context.pathname) {
    additionalInfo.push(`pathname:${context.pathname}`);
  }

  // Combine message with additional context using pilcrow
  const fullMessage = additionalInfo.length > 0
    ? `${msg} ¶ ${additionalInfo.join(' ¶ ')}`
    : msg;

  window.lana?.log(`SEOTECH: ${fullMessage}`, {
    debug: false,
    sampleRate: 100,
    tags: 'seotech',
    severity: 'error',
  });
}

export function parseVideoUrl(url, providers = VIDEO_OBJECT_PROVIDERS) {
  for (const { regex, provider } of providers) {
    const match = url.match(regex);
    if (match) {
      return { provider, id: match[1] };
    }
  }
  return null;
}

export async function getVideoObject(url, { baseUrl = PROD_BASE_URL } = {}) {
  const parsedUrl = parseVideoUrl(url);
  if (!parsedUrl) {
    throw new Error(`Invalid video url: ${url}`);
  }
  const { provider, id } = parsedUrl;
  const videoObjectUrl = `${baseUrl}/json-ld/types/video-object/providers/${provider}/${id}`;

  const resp = await fetch(videoObjectUrl, { headers: { 'Content-Type': 'application/json' } });
  const body = await resp?.json();

  if (!resp.ok) {
    throw new Error(`Failed to fetch video: ${body?.error || resp.statusText} (Status: ${resp.status})`);
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

export function canonicalizePathname(pathname = '') {
  let path = pathname || '/';
  path = path.replace(/\.html$/, '');
  path = path.replace(/\/+$/, '');
  if (!path || path === '/') return '/index';
  return path;
}

export function getOriginMapHostKey(hostname = '') {
  const [subdomain] = hostname.toLowerCase().split('.');
  return subdomain;
}

export function matchesOriginPrefix(canonicalPathname, prefix) {
  if (!prefix || !canonicalPathname) return false;

  if (prefix.includes('*')) {
    const escaped = prefix.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${escaped}$`).test(canonicalPathname);
  }

  return canonicalPathname === prefix
    || canonicalPathname.startsWith(`${prefix}/`)
    || canonicalPathname.startsWith(`${prefix}.`);
}

export function resolveRepoFromOriginMap(originMap, hostname, pathname) {
  const hostKey = getOriginMapHostKey(hostname);
  const origins = originMap?.properties?.[hostKey]?.origins || [];
  const canonicalPathname = canonicalizePathname(pathname);

  for (const origin of origins) {
    const matched = (origin.prefixes || [])
      .some((prefix) => matchesOriginPrefix(canonicalPathname, prefix));
    if (matched) {
      return origin.repo;
    }
  }

  if (canonicalPathname === '/index') {
    const homepageOrigin = origins.find((origin) => origin.homepage);
    if (homepageOrigin?.repo) {
      return homepageOrigin.repo;
    }
  }

  return origins.find((origin) => origin.default)?.repo || null;
}

export async function getStructuredData(pathname, hostname, options = {}) {
  const { originMapUrl = STRUCTURED_DATA_ORIGIN_MAP_URL } = options;
  const originMapResp = await fetch(originMapUrl);
  if (!originMapResp?.ok) {
    throw new Error(`Failed to fetch origin map: ${originMapResp?.status} ${originMapResp?.statusText}`);
  }
  const originMap = await originMapResp.json();

  const repo = resolveRepoFromOriginMap(originMap, hostname, pathname);
  if (!repo) {
    throw new Error(`Unable to resolve repo for ${hostname}${pathname}`);
  }

  const template = originMap?.structuredDataUrlTemplate;
  if (!template) {
    throw new Error('Missing structuredDataUrlTemplate in origin map');
  }

  const canonicalPath = canonicalizePathname(pathname);
  const url = template
    .replace('{repo}', repo)
    .replace('{path}', canonicalPath);

  const resp = await fetch(url);

  if (!resp) {
    throw new Error('Network error: No response received');
  }

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  }

  const body = await resp.json();
  return body;
}

export function isStructuredDataEnabled(locationUrl, getMetadata) {
  const url = new URL(locationUrl);
  return getMetadata('seotech-structured-data') === 'on'
    || url.searchParams.get('seotech-structured-data') === 'on';
}

export async function appendScriptTag({ locationUrl, getMetadata, createTag }) {
  const url = new URL(locationUrl);
  const params = new URLSearchParams(url.search);
  const baseUrl = params.get('seotech-api-base-url') || undefined;
  const originMapUrl = params.get('seotech-origin-map-url') || undefined;
  const append = (obj, className) => {
    if (!obj) return;
    const attributes = { type: 'application/ld+json' };
    if (className) attributes.class = className;
    const script = createTag('script', attributes, JSON.stringify(obj));
    document.head.append(script);
  };

  const promises = [];
  if (isStructuredDataEnabled(locationUrl, getMetadata)) {
    promises.push(getStructuredData(url.pathname, url.hostname, { originMapUrl })
      .then((obj) => append(obj, 'seotech-structured-data'))
      .catch(() => logError('Structured data operation failed', {
        hostname: url.hostname,
        pathname: url.pathname,
      })));
  }
  const videoUrl = getMetadata('seotech-video-url');
  if (videoUrl) {
    promises.push(getVideoObject(videoUrl, { baseUrl })
      .then((videoObject) => append(videoObject, 'seotech-video-url'))
      .catch(() => logError('Video object operation failed', { videoUrl })));
  }
  return Promise.all(promises);
}

export default appendScriptTag;
