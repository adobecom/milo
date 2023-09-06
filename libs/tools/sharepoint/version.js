import getServiceConfig from '../../utils/service-config.js';
import { getReqOptions } from './msal.js';
import login from './login.js';

function getPrettyDate(string) {
  const rawDate = new Date(string);
  rawDate.setSeconds(0, 0);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return [date, time];
}

async function getUrl(origin, siteId, itemId) {
  return `${origin}/sites/${siteId}/_api/web/GetFileById('${itemId}')`;
}

async function loginToSharePoint(origin, telemetry) {
  const scopes = ['files.readwrite', 'sites.readwrite.all'];
  const extraScopes = [`${origin}/.default`];
  await login({ scopes, extraScopes, telemetry });
}

async function getSharePointDetails(hlxOrigin) {
  const { sharepoint } = await getServiceConfig(hlxOrigin);
  const spSiteHostname = sharepoint.site.split(',')[0].split('/').pop();
  return {
    origin: `https://${spSiteHostname}`,
    siteId: sharepoint.siteId,
    site: sharepoint.site,
    driveId: sharepoint.driveId ? `drives/${sharepoint.driveId}` : 'drive',
  };
}

async function getGraphVersions(site, driveId, itemId) {
  const reqOpts = getReqOptions();
  const resp = await fetch(`${site}/${driveId}/items/${itemId}/versions`, reqOpts);
  return resp.json();
}

async function getSharePointVersions(origin, siteId, itemId) {
  const url = await getUrl(origin, siteId, itemId);
  const reqOpts = getReqOptions({ extra: true });
  const resp = await fetch(`${url}/Versions`, reqOpts);
  const json = await resp.json();
  return json.value.reduce((rdx, ver) => {
    const label = ver.VersionLabel.toString();
    rdx[label] = {
      comment: ver.CheckInComment,
      href: `${origin}/sites/${siteId}/${ver.Url}`,
    };
    return rdx;
  }, {});
}

async function getCurrentVersion(origin, siteId, itemId) {
  const url = await getUrl(origin, siteId, itemId);
  const reqOpts = getReqOptions({ extra: true });
  const resp = await fetch(`${url}`, reqOpts);
  const json = await resp.json();
  if (!json.CheckInComment) return {};
  return {
    id: `${json.MajorVersion}.${json.MinorVersion}`,
    comment: json.CheckInComment,
  };
}

export async function getVersions(telemetry, hlxOrigin, itemId) {
  const { origin, site, siteId, driveId } = await getSharePointDetails(hlxOrigin);
  await loginToSharePoint(origin, telemetry);

  const graph = getGraphVersions(site, driveId, itemId);
  const sp = getSharePointVersions(origin, siteId, itemId);
  const current = getCurrentVersion(origin, siteId, itemId);

  return Promise.all([graph, sp, current]).then((result) => {
    const [graphVersions, spVersions, currVersion] = result;
    return graphVersions.value.map((ver) => ({
      id: ver.id,
      date: getPrettyDate(ver.lastModifiedDateTime),
      user: ver.lastModifiedBy.user.displayName,
      comment: ver.id === currVersion.id
        ? currVersion.comment : spVersions[ver.id]?.comment,
      href: spVersions[ver.id]?.href,
    }));
  });
}

export async function createVersion(hlxOrigin, itemId, comment) {
  const { origin, siteId } = await getSharePointDetails(hlxOrigin);

  const reqOpts = getReqOptions({ method: 'POST', extra: true });

  const url = await getUrl(origin, siteId, itemId);
  return fetch(`${url}/Publish('${comment}')`, reqOpts);
}
