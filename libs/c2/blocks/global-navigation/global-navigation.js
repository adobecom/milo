import {
  getEnv,
  getConfig,
  getMetadata,
  localizeLink,
  localizeLinkAsync,
  convertStageLinks,
  lingoActive,
  getLingoRegion,
  getFederatedUrl,
} from '../../../utils/utils.js';

const DEFAULT_FEDERAL_URL = 'https://main--federal--adobecom.aem.page';

// Resolve hrefs only; decorateLinksAsync would also run decorateSVG and turn
// federal's authored .svg icon anchors into <picture> (MWPW-198294).
async function localizeGnavLinks(body) {
  await Promise.all([...body.querySelectorAll('a')].map(async (a) => {
    a.href = await localizeLinkAsync(a.href, window.location.hostname, false, a);
  }));
}

export function getFederalDomain(config) {
  const env = getEnv(config);

  if (env.name !== 'prod') {
    const queryParams = new URLSearchParams(window.location.search);
    const federalBranch = queryParams.get('fedsbranch')?.trim().toLowerCase();
    // Branch names are [a-z0-9-] only; reject other characters so the value
    // cannot break out of the host position of the import URL built below.
    if (federalBranch && /^[a-z0-9-]+$/.test(federalBranch)) {
      if (federalBranch === 'local') return 'http://localhost:3000/federal';
      return `https://${federalBranch}--federal--adobecom.aem.page/federal`;
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

export default async function init(el) {
  const config = getConfig();
  const isLingo = lingoActive();
  const federalDomain = getFederalDomain(config);
  const federalGnavUrl = new URL('libs/global-navigation/dist/main.js', `${federalDomain}/`).href;

  const placeholdersPromise = (async () => {
    const { fetchPlaceholders, getGeoIpPlaceholders } = await import('../../../features/placeholders.js');
    // Federal does a flat token swap with no geo decoration, so merge geo-IP overrides
    // here or {{…-geo-ip}} tokens resolve to the base value. The sheet is federal-owned
    // (parallel to federal's placeholders.json), authored once for every site.
    const geoIpSource = `${federalDomain}/globalnav/placeholders-geo-ip.json`;
    const [placeholders, geoIp] = await Promise.all([
      fetchPlaceholders({ config }),
      isLingo ? getGeoIpPlaceholders(config, geoIpSource) : null,
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

  // Mirrors fragment.js's mep.fragments lookup + handleFragmentCommand: swaps
  // a nested `#_inline` product-card (or other) fragment href for whatever
  // MEP's page-wide fragment-replace manifest points it at.
  const resolveFragmentHref = async (href) => {
    const isFederalHref = href.includes('/federal/');
    const path = isFederalHref
      ? getFederatedUrl(href).replace('#_inline', '')
      : new URL(href).pathname;
    const mepFrag = config.mep?.fragments?.[path]
      ?? config.mep?.fragments?.[path.replace(config.locale?.prefix ?? '', '')];
    if (!mepFrag) return href;
    const { handleFragmentCommand } = await import('../../../features/personalization/personalization.js');
    const tempAnchor = document.createElement('a');
    tempAnchor.href = href;
    const resolved = handleFragmentCommand(mepFrag, tempAnchor);
    return resolved ? tempAnchor.href : href;
  };

  const { main } = await import(federalGnavUrl);
  const gnavUrl = new URL(getMetadata('gnav-source') || `${config.locale?.contentRoot ?? window.location.origin}/gnav`);

  const lingoRegion = isLingo ? await getLingoRegion({ useGeoLocation: true }) : null;

  const countryCodePromise = (async () => {
    const { isMasGeoDetectionEnabled } = await import('../../../blocks/merch/merch.js');
    if (!isMasGeoDetectionEnabled()) return undefined;
    const base = config.miloLibs || config.codeRoot;
    const { getValidatedMarket } = await import(`${base}/utils/market.js`);
    return (await getValidatedMarket())?.toUpperCase();
  })().catch(() => undefined);

  const gnavPromise = main({
    localizeLink,
    // Lingo href transformation only; skip when lingo is off.
    ...(isLingo && { decorateBody: localizeGnavLinks }),
    gnavSource: gnavUrl,
    asideSource: null,
    isLocalNav: false,
    mountpoint: el,
    unavEnabled: getMetadata('unav') === 'on',
    placeholders: placeholdersPromise,
    miloConfig: config,
    countryCode: countryCodePromise,
    mepMartech: config.mep?.martech || '',
    lingoRegion,
    personalization: {
      commands: [...commands, ...gnavMepCommands],
      handleCommands: personalizationHandler,
      resolveFragmentHref,
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
  gnavPromise.then(() => requestAnimationFrame(() => window.lenis?.resize()));
  config.federal = { fedsGlobalNavigation: gnavPromise };
}
