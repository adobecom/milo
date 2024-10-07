import { getMetadata } from '../../utils/utils.js';

export function foundDisableValues() {
  const dynamicNavDisableValues = getMetadata('dynamic-nav-disable');
  if (!dynamicNavDisableValues) return false;

  const metadataPairsMap = dynamicNavDisableValues.split(',').map((pair) => pair.split(';'));
  const foundValues = metadataPairsMap.filter(([metadataKey, metadataContent]) => {
    const metaTagContent = getMetadata(metadataKey.toLowerCase());
    return (metaTagContent
        && metaTagContent.toLowerCase() === metadataContent.toLowerCase());
  });

  return foundValues.length ? foundValues : false;
}

export default function dynamicNav(url, key) {
  if (foundDisableValues()) return url;
  const metadataContent = getMetadata('dynamic-nav');

  if (metadataContent === 'entry') {
    window.sessionStorage.setItem('gnavSource', url);
    window.sessionStorage.setItem('dynamicNavKey', key);
    return url;
  }

  if (metadataContent !== 'on' || key !== window.sessionStorage.getItem('dynamicNavKey')) return url;

  return window.sessionStorage.getItem('gnavSource') || url;
}
