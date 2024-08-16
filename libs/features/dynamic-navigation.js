import { getMetadata } from '../utils/utils.js';

function checkForIgnoreValues() {
  const dynamicNavDisableValues = getMetadata('dynamic-nav-disable');
  if (!dynamicNavDisableValues) return false;

  const metadataPairsMap = dynamicNavDisableValues.split(',').map((pair) => pair.split(';'));
  return metadataPairsMap.some(([metadataKey, metadataContent]) => {
    const metaTagContent = getMetadata(metadataKey.toLowerCase());
    return (metaTagContent
        && metaTagContent.toLowerCase() === metadataContent.toLowerCase());
  });
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
