export default function loadFavicon(createTag, config, getMetadata) {
  const { codeRoot } = config;
  const name = getMetadata('favicon') || 'favicon';
  const favBase = `${codeRoot}/img/favicons/${name}`;

  const favicon = document.head.querySelector('link[rel="icon"]');
  const tags = `<link rel="apple-touch-icon" href="${favBase}-180.png">
                <link rel="icon" href="${favBase}-180.png" sizes="any">
                <link rel="icon" href="${codeRoot}/img/favicons/safari-pinned-tab.svg" sizes="16x16">
                <link rel="manifest" href="${favBase}.webmanifest">`;
  favicon.insertAdjacentHTML('afterend', tags);
  favicon.href = `${favBase}.ico`;
}
