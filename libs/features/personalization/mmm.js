import { getConfig, getMetadata } from '../../utils/utils.js';
import { US_GEO } from './personalization.js';

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';

export const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page?id=`,
  save: `${API_DOMAIN}/save-mep-call`,
  report: `${API_DOMAIN}/get-report`,
};

function parsePageAndUrl(config, windowLocation, prefix) {
  const { stageDomainsMap, env } = config;
  const { pathname, origin } = windowLocation;
  const allowedHosts = [
    'business.stage.adobe.com',
    'www.stage.adobe.com',
    'milo.stage.adobe.com',
  ];
  if (env?.name === 'prod' || !stageDomainsMap
    || allowedHosts.includes(origin.replace('https://', ''))) {
    const domain = origin.replace('stage.adobe.com', 'adobe.com');
    return { page: pathname.replace(`/${prefix}/`, '/'), url: `${domain}${pathname}` };
  }
  let path = pathname;
  let domain = origin;
  const domainCheck = Object.keys(stageDomainsMap)
    .find((key) => {
      try {
        const { host } = new URL(`https://${key}`);
        return allowedHosts.includes(host);
      } catch (e) {
        /* c8 ignore next 2 */
        return false;
      }
    });
  if (domainCheck) domain = `https://${domainCheck}`;
  path = path.replace('/homepage/index-loggedout', '/');
  if (!path.endsWith('/') && !path.endsWith('.html') && !domain.includes('milo')) {
    path += '.html';
  }
  domain = domain.replace('stage.adobe.com', 'adobe.com');
  return { page: path.replace(`/${prefix}/`, '/'), url: `${domain}${path}` };
}
export function parseMepConfig() {
  const config = getConfig();
  const { mep, locale } = config;
  const { experiments, prefix, highlight } = mep;
  const activities = experiments.map((experiment) => {
    const {
      name, event, manifest, variantNames, selectedVariantName, disabled, analyticsTitle, source,
    } = experiment;
    let pathname = manifest;
    try { pathname = new URL(manifest).pathname; } catch (e) { /* do nothing */ }
    return {
      targetActivityName: name,
      variantNames,
      selectedVariantName,
      url: manifest,
      disabled,
      source,
      eventStart: event?.start,
      eventEnd: event?.end,
      pathname,
      analyticsTitle,
    };
  });
  const { page, url } = parsePageAndUrl(config, window.location, prefix);

  return {
    page: {
      url,
      page,
      target: getMetadata('target') || 'off',
      personalization: (getMetadata('personalization')) ? 'on' : 'off',
      geo: prefix === US_GEO ? '' : prefix,
      locale: locale.ietf,
      region: locale.region,
      highlight,
    },
    activities,
  };
}
export async function saveToMmm() {
  const config = getConfig();
  const data = parseMepConfig();
  const excludedStrings = ['/drafts/', '.stage.', '.page/', '.live/', '/fragments/', '/nala/'];
  if (excludedStrings.some((str) => data.page.url.includes(str))) return false;
  data.activities = data.activities.filter((activity) => {
    const { url, source } = activity;
    activity.source = source.filter((item) => item !== 'mep param');
    return (!!(activity.source?.length && !url.includes('/drafts/')));
  });
  data.activities = data.activities.map((activity) => {
    activity.variantNames = activity.variantNames?.join('||') || '';
    activity.source = activity.source?.join(',') || '';
    delete activity.selectedVariantName;
    return activity;
  });
  if (data.page.prefix === US_GEO) data.page.prefix = '';
  data.page.target = getMetadata('target') || 'off';
  delete data.page.highlight;
  return fetch(API_URLS.save, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const res = await response.json();
      if (response.ok) return res;
      /* c8 ignore next 1 */
      throw new Error(res.message || 'Network response failed');
    });
}
