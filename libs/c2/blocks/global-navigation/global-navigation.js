import { getEnv, getConfig, getMetadata, localizeLink } from '../../../utils/utils.js';

const FEDERAL_BRANCH_PATTERN = /^[a-z0-9-]+(?:--[a-z0-9-]+)*$/;
const DEFAULT_FEDERAL_URL = 'https://stage--federal--adobecom.aem.page';

function getFederalDomain(config) {
  const queryParams = new URLSearchParams(window.location.search);
  const federalLibsParam = queryParams.get('federallibs');
  if (federalLibsParam?.trim()) {
    const sanitized = federalLibsParam.trim().toLowerCase();
    if (sanitized === 'local') return 'http://localhost:3000/federal';

    const extension = window.location.hostname.endsWith('.page') ? 'page' : 'live';
    if (!FEDERAL_BRANCH_PATTERN.test(sanitized)) return DEFAULT_FEDERAL_URL;
    const segments = sanitized.split('--').filter(Boolean);
    const branch = (() => {
      if (segments.length >= 2) return sanitized;
      return `${sanitized}--federal--adobecom`;
    })();
    return `https://${branch}.aem.${extension}`;
  }

  const env = getEnv(config);
  // Todo: Fix this to actual stage link
  if (env.name === 'stage') return `${DEFAULT_FEDERAL_URL}/federal`;
  if (env.name === 'prod') return 'https://www.adobe.com/federal';
  return DEFAULT_FEDERAL_URL;
}

export default async function init(el) {
  const config = getConfig();
  const federalDomain = getFederalDomain(config);
  const federalGnavUrl = new URL('libs/global-navigation/dist/main.js', `${federalDomain}/`).href;
  const placeholdersPromise = (async () => {
    const { fetchPlaceholders } = await import('../../../features/placeholders.js');
    const placeholders = await fetchPlaceholders({ config });
    return new Map(Object.entries(placeholders));
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
    return handleCommands(cs, root);
  };

  const { main } = await import(federalGnavUrl);
  main({
    localizeLink,
    gnavSource: new URL(getMetadata('gnav-source')),
    asideSource: null,
    isLocalNav: false,
    mountpoint: el,
    unavEnabled: getMetadata('unav') === 'on',
    placeholders: placeholdersPromise,
    miloConfig: config,
    personalization: {
      commands: [...commands, ...gnavMepCommands],
      handleCommands: personalizationHandler,
    },
  }).catch((error) => {
    window.lana?.log?.('Failed to initialize federal global navigation', {
      error,
      tags: 'global-navigation',
      errorType: 'e',
    });
  });
}
