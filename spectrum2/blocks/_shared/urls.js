export const CDN_WHITELISTED_ORIGINS = Object.freeze([
  'https://www.adobe.com',
  'https://business.adobe.com',
  'https://blog.adobe.com',
  'https://milo.adobe.com',
  'https://news.adobe.com',
  'graybox.adobe.com',
]);

export const DEFAULT_FEDERATED_ROOT = 'https://www.adobe.com';

export function federatedRoot(win) {
  let origin = '';
  try {
    origin = win?.location?.origin || '';
  } catch (e) {
    origin = '';
  }
  if (!origin || origin === 'null') return DEFAULT_FEDERATED_ROOT;
  const originNoStage = origin.replace('.stage', '');
  const allowed = CDN_WHITELISTED_ORIGINS.some((o) => (
    o.startsWith('https://') ? originNoStage === o : originNoStage.endsWith(o)
  ));
  return allowed ? origin : DEFAULT_FEDERATED_ROOT;
}

export function federatedUrl(url, win) {
  if (typeof url !== 'string' || !url.includes('/federal/')) return url;
  if (url.startsWith('/')) return `${federatedRoot(win)}${url}`;
  try {
    const { pathname, search, hash } = new URL(url);
    return `${federatedRoot(win)}${pathname}${search}${hash}`;
  } catch (e) {
    return url;
  }
}
