import { getCookie, getMetadata, isTrustedUrl } from '../../utils/utils.js';
import { OPT_ON_AND_CONSENT_COOKIE, parseOptanonConsent } from '../../martech/helpers.js';

const COOKIE_NAME = 'dynamicNav';
const EXPIRY_SECONDS = 30 * 60; // 30-minute inactivity expiry, refreshed on use.
const PROD_DOMAIN = 'adobe.com';
const STAGE_DOMAIN = 'stage.adobe.com';
const PREVIEW_HOST_PATTERN = /\.(?:hlx|aem)\.(?:page|live)$/;

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

let cookieAvailability;

export function resetCookieAvailability() {
  cookieAvailability = undefined;
}

export function cookiesAvailable() {
  if (cookieAvailability !== undefined) return cookieAvailability;
  try {
    // eslint-disable-next-line compat/compat
    cookieAvailability = window.navigator.cookieEnabled === true;
  } catch (e) {
    cookieAvailability = false;
  }
  if (!cookieAvailability) {
    window.lana?.log('Dynamic nav: cookies unavailable, using authored navigation', { tags: 'dynamic-nav', severity: 'info' });
  }
  return cookieAvailability;
}

function hasFunctionalConsent() {
  // Preserve embedded "=" characters in OneTrust's query-string cookie value.
  const prefix = `${OPT_ON_AND_CONSENT_COOKIE}=`;
  const raw = document.cookie.split(';').map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))?.slice(prefix.length);
  try {
    return parseOptanonConsent(decodeURIComponent(raw || '')).configuration.functional;
  } catch (e) {
    window.lana?.log('Dynamic nav: malformed consent cookie, using authored navigation', { tags: 'dynamic-nav', severity: 'info' });
    return false;
  }
}

function sanitizeSource(source) {
  if (typeof source !== 'string' || !source) return null;
  let parsed;
  try {
    parsed = new URL(source, window.location.origin);
  } catch (e) {
    return null;
  }
  if (parsed.origin === window.location.origin || isTrustedUrl(source)) return source;
  return null;
}

export function getCookieEnvironment(
  host = window.location.host,
  protocol = window.location.protocol,
) {
  const secure = protocol === 'https:';
  if (host === STAGE_DOMAIN || host.endsWith(`.${STAGE_DOMAIN}`)) {
    return { name: 'stage', shareDomain: STAGE_DOMAIN, secure };
  }
  if (host === PROD_DOMAIN || host.endsWith(`.${PROD_DOMAIN}`)) {
    return { name: 'prod', shareDomain: PROD_DOMAIN, secure };
  }
  if (PREVIEW_HOST_PATTERN.test(host)) {
    return { name: 'preview', shareDomain: null, secure };
  }
  return { name: 'local', shareDomain: null, secure };
}

function cookieName(env = getCookieEnvironment()) {
  return env.name === 'stage' ? `${COOKIE_NAME}-stage` : COOKIE_NAME;
}

export function cookieAttributes(
  host = window.location.host,
  protocol = window.location.protocol,
) {
  const env = getCookieEnvironment(host, protocol);
  const attrs = ['Path=/', 'SameSite=Lax'];
  // Share across *.adobe.com only; EDS preview/live and local stay host-only.
  if (env.shareDomain) attrs.push(`Domain=${env.shareDomain}`);
  // Secure is required for cross-site cookies but cannot be set over local HTTP.
  if (env.secure) attrs.push('Secure');
  return attrs;
}

function writeState({ source, group }) {
  if (!cookiesAvailable() || !hasFunctionalConsent()) return;
  // Resolve relative sources against the authoring origin before persisting.
  let absoluteSource;
  try {
    absoluteSource = new URL(source, window.location.origin).href;
  } catch (e) {
    return;
  }
  if (!sanitizeSource(absoluteSource)) return;

  const value = { s: absoluteSource };
  if (group) value.g = group;
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = [`${cookieName()}=${encoded}`, `Max-Age=${EXPIRY_SECONDS}`, ...cookieAttributes()].join('; ');
}

function clearState() {
  if (!cookiesAvailable() || !hasFunctionalConsent()) return;
  document.cookie = [`${cookieName()}=`, 'Max-Age=0', ...cookieAttributes()].join('; ');
}

export function readState() {
  const available = cookiesAvailable();
  const consent = available && hasFunctionalConsent();
  if (!consent) return { available, consent, source: null, group: null };

  const raw = getCookie(cookieName());
  if (!raw) return { available, consent, source: null, group: null };

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const source = sanitizeSource(parsed?.s);
    const group = typeof parsed?.g === 'string' ? parsed.g : null;
    if (!source) return { available, consent, source: null, group, malformed: true };
    return { available, consent, source, group };
  } catch (e) {
    return { available, consent, source: null, group: null, malformed: true };
  }
}

export function groupsMatch(pageGroup, storedGroup) {
  return (pageGroup || '').toLowerCase() === (storedGroup || '').toLowerCase();
}

export function getDynamicNavState() {
  const setting = getMetadata('dynamic-nav');
  const group = getMetadata('dynamic-nav-group') || '';
  const disableValues = foundDisableValues();
  const disabled = !!disableValues;
  const stored = readState();
  const groupMatched = groupsMatch(group, stored.group);
  const environment = getCookieEnvironment();
  const active = setting === 'on'
    && !disabled
    && stored.available
    && !!stored.source
    && groupMatched;

  return {
    setting, group, disabled, disableValues, stored, groupMatched, active, environment,
  };
}

export default function dynamicNav(url) {
  const { setting, disabled, group, stored, groupMatched } = getDynamicNavState();

  if (disabled) return url;

  if (setting === 'reset') {
    clearState();
    return url;
  }

  if (setting === 'entry') {
    writeState({ source: url, group });
    return url;
  }

  if (setting === 'on' && stored.available && stored.source && groupMatched) {
    writeState({ source: stored.source, group: stored.group });
    return stored.source;
  }

  return url;
}
