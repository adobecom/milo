import { getMetadata } from '../utils/utils.js';

function checkForIgnoreValues() {
  const dynamicNavDisableValues = getMetadata('dynamic-nav-disable');

  if (!dynamicNavDisableValues) {
    window.lana.log('Dynamic-nav-disables not present to deactivate dynamic nav');
    return false;
  }

  let match = false;

  const metadataPairsMap = dynamicNavDisableValues.split(',').map((pair) => pair.split(';'));
  metadataPairsMap.forEach((pair) => {
    const [metadataKey, metadataContent] = pair;
    const metaTagContent = getMetadata(metadataKey.toLowerCase());
    if (!metaTagContent) return false;
    if (metaTagContent.toLowerCase() !== metadataContent.toLowerCase()) return false;
    match = true;
  });

  return match;
}

export default function dynamicNav(url, key) {
  if (checkForIgnoreValues()) return url;
  const metadataContent = getMetadata('dynamic-nav');

  if (metadataContent === 'entry') {
    window.sessionStorage.setItem('gnavSource', url);
    window.sessionStorage.setItem('dynamicNavKey', key);
    return url;
  }

  if (metadataContent !== 'on' || key !== window.sessionStorage.getItem('dynamicNavKey')) return url;

  return window.sessionStorage.getItem('gnavSource') || url;
}
