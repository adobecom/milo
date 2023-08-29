export const FAVICON_TYPES = {
  gif: 'image/gif',
  ico: 'image/x-icon',
  png: 'image/png',
  svg: 'image/svg+xml',
};

export function getFileExt(str) {
  return str.toLowerCase().split('.').pop();
}

export default function loadFavicon({ getConfig, getMetadata }) {
  const favicon = document.head.querySelector('link[rel="icon"]');
  const { codeRoot } = getConfig();

  const faviconVal = getMetadata('favicon') || 'favicon';
  const ext = getFileExt(faviconVal);
  if (ext && ext in FAVICON_TYPES) {
    favicon.href = faviconVal;
    favicon.type = FAVICON_TYPES[ext];
  } else {
    const favBase = `${codeRoot}/img/favicons/${faviconVal}`;
    const tags = `<link rel="apple-touch-icon" href="${favBase}-180.png">
                  <link rel="manifest" href="${favBase}.webmanifest">`;
    favicon.insertAdjacentHTML('afterend', tags);
    favicon.href = `${favBase}.ico`;
  }
}
