import { getMetadata, getConfig } from '../../../utils/utils.js';
import { US_GEO, getFileName, normalizePath } from '../../personalization/personalization.js';

const STAGE_ALLOWED_HOSTS = [
  'business.stage.adobe.com',
  'www.stage.adobe.com',
  'milo.stage.adobe.com',
];

function buildResult(domain, path, prefix) {
  return { page: path.replace(`/${prefix}/`, '/'), url: `${domain}${path}` };
}

function parsePageAndUrl(config, windowLocation, prefix) {
  const { stageDomainsMap, env } = config;
  const { pathname, origin } = windowLocation;
  const originHost = origin.replace('https://', '');

  if (env?.name === 'prod' || !stageDomainsMap || STAGE_ALLOWED_HOSTS.includes(originHost)) {
    return buildResult(origin.replace('stage.adobe.com', 'adobe.com'), pathname, prefix);
  }

  const mappedDomain = Object.keys(stageDomainsMap).find((key) => {
    try {
      return STAGE_ALLOWED_HOSTS.includes(new URL(`https://${key}`).host);
    } catch (e) {
      /* c8 ignore next */
      return false;
    }
  });

  const domain = mappedDomain ? `https://${mappedDomain}` : origin;
  let path = pathname.replace('/homepage/index-loggedout', '/');
  if (!path.endsWith('/') && !path.endsWith('.html') && !domain.includes('milo')) {
    path += '.html';
  }

  return buildResult(domain.replace('stage.adobe.com', 'adobe.com'), path, prefix);
}

function toActivity({
  name, event, manifest, variantNames, selectedVariantName,
  disabled, analyticsTitle, source, geoRestriction, mktgAction,
}) {
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
    geoRestriction,
    mktgAction,
  };
}

function parseMepConfig() {
  const config = getConfig();
  const { mep, locale } = config;
  if (!mep || !locale) return null;

  const { experiments, prefix, highlight } = mep;
  const { page, url } = parsePageAndUrl(config, window.location, prefix);

  return {
    page: {
      url,
      page,
      target: getMetadata('target') || 'off',
      personalization: getMetadata('personalization') ? 'on' : 'off',
      geo: prefix === US_GEO ? '' : prefix,
      locale: locale?.ietf,
      region: locale?.region,
      highlight,
    },
    activities: experiments.map(toActivity),
  };
}

function formatDate(dateTime, format = 'local') {
  if (!dateTime) return '';
  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  if (format === 'iso') return dateObj.toISOString();
  const date = dateObj.toLocaleDateString(false, { year: 'numeric', month: 'short', day: 'numeric' });
  const time = dateObj.toLocaleTimeString(false, { timeStyle: 'short' });
  return `${date} ${time}`;
}

const TARGET_MAP = { postlcp: 'postlcp', true: 'on', false: 'off' };

export function getManifestsFound() {
  const mepconfig = parseMepConfig();
  const activities = mepconfig?.activities;

  return activities?.length ?? 0;
}

export function getFoundation() {
  return (getMetadata('foundation') || 'c1').toUpperCase();
}

export function getTargetIntegration() {
  const { page } = parseMepConfig();
  const mepTarget = TARGET_MAP[getConfig().mep?.targetEnabled];
  if (mepTarget === undefined) return page.target;
  return { postlcp: 'on post LCP' }[mepTarget] ?? mepTarget;
}

export function getLocale() {
  const { page } = parseMepConfig();
  return page.locale?.toLowerCase();
}

export function getLastSeen() {
  const { page } = parseMepConfig();
  return formatDate(new Date(page.lastSeen));
}

export function getPersonalization() {
  const { page } = parseMepConfig();
  return page.personalization;
}

export function getPerformanceConsent() {
  const config = getConfig();
  const { consentState } = config.mep;
  return consentState?.functional ? 'on' : 'off';
}

export function getAdvertisingConsent() {
  const config = getConfig();
  const { consentState } = config.mep;
  return consentState?.advertising ? 'on' : 'off';
}
