import getServiceConfig from '../../utils/service-config.js';

export async function getSharePointDetails(hlxOrigin) {
  const { sharepoint } = await getServiceConfig(hlxOrigin);
  const spSiteHostname = sharepoint.site.split(',')[0].split('/').pop();
  return {
    origin: `https://${spSiteHostname}`,
    siteId: sharepoint.siteId,
    site: sharepoint.site,
    driveId: sharepoint.driveId ? `drives/${sharepoint.driveId}` : 'drive',
  };
}

export function getItemId() {
  const referrer = new URLSearchParams(window.location.search).get('referrer');
  const sourceDoc = referrer?.match(/sourcedoc=([^&]+)/)[1];
  const sourceId = decodeURIComponent(sourceDoc);
  return sourceId.slice(1, -1);
}

export function getSiteOrigin() {
  const search = new URLSearchParams(window.location.search);
  const repo = search.get('repo');
  const owner = search.get('owner');
  return repo && owner ? `https://main--${repo}--${owner}.hlx.page` : window.location.origin;
}
