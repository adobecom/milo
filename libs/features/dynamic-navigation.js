export default function dynamicNav(metadataContent, methods) {
  const { getConfig, getMetadata } = methods;
  const { dynamicNavKey } = getConfig();
  const gnavSourceContent = getMetadata('gnav-source');

  if (!dynamicNavKey) return;

  if (metadataContent === 'entry' && gnavSourceContent) {
    window.sessionStorage.setItem('gnavSource', gnavSourceContent);
    window.sessionStorage.setItem('dynamicNavKey', dynamicNavKey);
    return;
  }

  if (metadataContent === 'on') {
    if (dynamicNavKey !== window.sessionStorage.getItem('dynamicNavKey')) return;
    const source = window.sessionStorage.getItem('gnavSource');

    if (!source) return;

    if (gnavSourceContent) {
      document.querySelector('meta[name="gnav-source"]').content = source;
    } else {
      const gnMeta = document.createElement('meta');
      gnMeta.setAttribute('name', 'gnav-source');
      gnMeta.setAttribute('content', source);
      document.head.append(gnMeta);
    }
  }
}
