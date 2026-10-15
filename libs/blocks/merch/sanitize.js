export const sanitizeTarget = (target) => {
  if (!target || typeof target !== 'string') return '_blank';
  const trimmedTarget = target.trim();
  const normalizedTarget = trimmedTarget
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/g, '');
  if (['_blank', '_self', '_parent', '_top'].includes(normalizedTarget)) {
    return normalizedTarget;
  }
  if (/^[a-zA-Z0-9_-]+$/.test(normalizedTarget)) {
    return normalizedTarget;
  }
  return '_blank';
};

export const decodeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  let decodedUrl = url;
  let previousUrl;
  let iterations = 0;
  const maxIterations = 5;
  while (iterations < maxIterations && decodedUrl !== previousUrl) {
    previousUrl = decodedUrl;
    try {
      decodedUrl = decodeURIComponent(decodedUrl);
    } catch (e) {
      break;
    }
    iterations += 1;
  }
  return decodedUrl;
};

export const normalizeUrl = (url) => {
  const normalizedUrl = url
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, '')
  // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/g, '')
    .trim();

  const dangerousProtocols = /^(javascript|data|vbscript|file|about|chrome|chrome-extension|filesystem|blob|mailto|tel|sms):/i;
  return dangerousProtocols.test(normalizedUrl) ? null : normalizedUrl;
};

export const isHttps = (url) => {
  if (/^https?:\/\//i.test(url)) {
    try {
      const urlObj = new URL(url);
      if (!['https:'].includes(urlObj.protocol)) return null;
      return urlObj.href;
    } catch (e) {
      return null;
    }
  }
  const isRelativeUrl = /^\//.test(url);
  return isRelativeUrl ? url : null;
};

export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const decodedUrl = decodeUrl(url.trim());
  const normalizedUrl = normalizeUrl(decodedUrl);
  return isHttps(normalizedUrl);
};
