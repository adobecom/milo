import { getMetadata } from '../utils/utils.js';

export default function dynamicNav(url, key) {
  const metadataContent = getMetadata('dynamic-nav');

  if (metadataContent === 'entry') {
    window.sessionStorage.setItem('gnavSource', url);
    window.sessionStorage.setItem('dynamicNavKey', key);
    return url;
  }

  if (metadataContent !== 'on' || key !== window.sessionStorage.getItem('dynamicNavKey')) return url;

  return window.sessionStorage.getItem('gnavSource') || url;
}
