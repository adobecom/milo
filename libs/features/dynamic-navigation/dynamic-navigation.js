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

function dynamicNavGroupMatches(groupMetaData) {
  const storedGroup = window.sessionStorage.getItem('dynamicNavGroup');
  if (groupMetaData && storedGroup) {
    return storedGroup.toLowerCase() === groupMetaData.toLowerCase();
  }
  return false;
}

export default function dynamicNav(url, key) {
  const storageSource = 'gnavSource';
  const storageKey = 'dynamicNavKey';
  const storageGroup = 'dynamicNavGroup';

  if (foundDisableValues()) return url;
  const metadataContent = getMetadata('dynamic-nav');
  const dynamicNavGroup = getMetadata('dynamic-nav-group');

  if (metadataContent === 'reset') {
    window.sessionStorage.removeItem(storageSource, url);
    window.sessionStorage.removeItem(storageKey, key);
    window.sessionStorage.removeItem(storageGroup, dynamicNavGroup);
    return url;
  }

  if (metadataContent === 'entry') {
    window.sessionStorage.setItem(storageSource, url);
    window.sessionStorage.setItem(storageKey, key);
    if (dynamicNavGroup) window.sessionStorage.setItem(storageGroup, dynamicNavGroup);
    return url;
  }

  if (metadataContent === 'on' && dynamicNavGroup) {
    if (!dynamicNavGroupMatches(dynamicNavGroup)) return url;
  }

  if (metadataContent !== 'on' || key !== window.sessionStorage.getItem(storageKey)) return url;

  return window.sessionStorage.getItem(storageSource) || url;
}
