import {
  getEnv,
  getConfig,
  getMetadata,
  localizeLink,
  decorateLinksAsync,
  convertStageLinks,
  lingoActive,
  getLingoRegion,
} from '../../../utils/utils.js';
import { isDesktop, loadStyles } from '../../../blocks/global-navigation/utilities/utilities.js';

const MOBILE_UA_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Touch/i;

const DEFAULT_FEDERAL_URL = 'https://main--federal--adobecom.aem.page';

function getFederalDomain(config) {
  const env = getEnv(config);

  if (env.name !== 'prod') {
    const queryParams = new URLSearchParams(window.location.search);
    const federalBranch = queryParams.get('fedsbranch');
    if (federalBranch?.trim()) {
      const sanitized = federalBranch.trim().toLowerCase();
      if (sanitized === 'local') return 'http://localhost:3000/federal';
      return `https://${sanitized}--federal--adobecom.aem.page/federal`;
    }
  }

  const { hostname } = window.location;
  let extension;
  if (hostname.endsWith('.aem.page')) extension = 'page';
  if (hostname.endsWith('.aem.live') || hostname.endsWith('.aem.reviews')) extension = 'live';

  if (extension) return `${DEFAULT_FEDERAL_URL.replace('aem.page', `aem.${extension}`)}/federal`;

  if (env.name === 'stage') return 'https://www.stage.adobe.com/federal';
  if (env.name === 'prod') return 'https://www.adobe.com/federal';
  return `${DEFAULT_FEDERAL_URL}/federal`;
}

async function decorateAppPrompt(el) {
  const state = getMetadata('app-prompt')?.toLowerCase();
  const entName = getMetadata('app-prompt-entitlement')?.toLowerCase();
  const promptPath = getMetadata('app-prompt-path')?.toLowerCase();
  const hasMobileUA = MOBILE_UA_REGEX.test(navigator.userAgent);

  if (state === 'off'
    || !window.adobeIMS?.isSignedInUser()
    || !isDesktop.matches
    || hasMobileUA
    || !entName?.length
    || !promptPath?.length) return;

  const parent = el.querySelector('.feds-utilities');
  if (!parent) return;

  const { base } = getConfig();
  const [webappPrompt] = await Promise.all([
    import('../../../features/webapp-prompt/webapp-prompt.js'),
    loadStyles(`${base}/features/webapp-prompt/webapp-prompt.css`),
  ]);

  await webappPrompt.default({
    promptPath,
    entName,
    parent,
    getAnchorState: () => window.UniversalNav?.getComponent?.('app-switcher'),
  });
}

export default async function init(el) {
  const config = getConfig();
  const isLingo = lingoActive();
  const federalDomain = getFederalDomain(config);
  const federalGnavUrl = new URL('libs/global-navigation/dist/main.js', `${federalDomain}/`).href;

  const isGnavOverrideOnC1 = getMetadata('foundation') !== 'c2' && getMetadata('gnav-foundation') === 'c2';
  if (isGnavOverrideOnC1) el.classList.add('c2-gnav-c1-host');

  const placeholdersPromise = (async () => {
    const { fetchPlaceholders, getGeoIpPlaceholders } = await import('../../../features/placeholders.js');
    // Federal replaces {{key}} tokens with a flat string swap and never runs
    // milo's geo-aware decoration, so merge geo-IP overrides into the map here —
    // otherwise {{…-geo-ip}} tokens in the gnav resolve to the base value.
    const [placeholders, geoIp] = await Promise.all([
      fetchPlaceholders({ config }),
      isLingo ? getGeoIpPlaceholders(config) : null,
    ]);
    const map = new Map(Object.entries(placeholders));
    geoIp?.forEach((value, key) => map.set(key, value));
    // MEP manifest "placeholders" sheet overrides win last, matching getPlaceholder
    // precedence (config.placeholders beats geo-IP in placeholders.js).
    Object.entries(config.placeholders ?? {}).forEach(([key, value]) => map.set(key, value));
    return map;
  })();
  // for now we only support inBlock commands.
  // Since MEP on gnav is relatively rare we'll
  // keep it at this and see if any problems crop up.
  const mepGnav = config.mep?.inBlock?.['global-navigation'];
  const commands = mepGnav?.commands ?? [];
  const gnavMepCommands = config?.mep?.commands?.filter(
    (command) => command?.modifiers?.includes('include-gnav'),
  ) || [];

  const personalizationHandler = async (cs, root) => {
    const { handleCommands } = await import('../../../features/personalization/personalization.js');
    return handleCommands(cs, root, true, true);
  };

  const { main } = await import(federalGnavUrl);
  const gnavUrl = new URL(getMetadata('gnav-source') || `${config.locale?.contentRoot ?? window.location.origin}/gnav`);

  const lingoRegion = isLingo ? await getLingoRegion({ useGeoLocation: true }) : null;

  const universalNavMeta = getMetadata('universal-nav')?.toLowerCase();
  const unavEnabled = universalNavMeta === 'on'
    || !!universalNavMeta?.split(',').map((option) => option.trim()).filter(Boolean).length;

  const gnavPromise = main({
    localizeLink,
    // Lingo link transformation only — skip when lingo is off so federal doesn't
    // re-run milo link decoration over links federal has already localized.
    ...(isLingo && { decorateBody: decorateLinksAsync }),
    gnavSource: gnavUrl,
    asideSource: null,
    isLocalNav: false,
    mountpoint: el,
    unavEnabled,
    placeholders: placeholdersPromise,
    miloConfig: config,
    mepMartech: config.mep?.martech || '',
    lingoRegion,
    personalization: {
      commands: [...commands, ...gnavMepCommands],
      handleCommands: personalizationHandler,
    },
    convertStageLinks: ({ anchors, hostname, href }) => {
      convertStageLinks({ anchors, config, hostname, href });
    },
  }).catch((error) => {
    window.lana?.log?.('Failed to initialize federal global navigation', {
      error,
      tags: 'global-navigation',
      errorType: 'e',
    });
    return {};
  });
  gnavPromise.then(() => {
    requestAnimationFrame(() => window.lenis?.resize());
    decorateAppPrompt(el);
  });
  config.federal = { fedsGlobalNavigation: gnavPromise };
}
