export default function loadFavicon(createTag, config, getMetadata) {
  const { codeRoot } = config;
  const name = getMetadata('favicon') || 'favicon';
  const favBase = `${codeRoot}/img/favicons/${name}`;

  const favicon = document.head.querySelector('link[rel="icon"]');
  favicon.href = `${favBase}.ico`;
  const tags = [
    createTag('manifest', { rel: 'icon', href: `${favBase}.webmanifest` }),
    createTag('link', { rel: 'icon', href: `${favBase}.svg`, type: 'image/svg+xml' }),
    createTag('link', { rel: 'apple-touch-icon', href: `${favBase}-180.png`, type: 'image/svg+xml' }),
  ];
  document.head.append(...tags);
}
