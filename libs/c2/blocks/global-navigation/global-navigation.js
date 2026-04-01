import { getEnv, getConfig, getMetadata, localizeLink } from '../../../utils/utils.js';

const DEFAULT_FEDERAL_URL = 'https://main--federal--adobecom.aem.page';

function getFederalDomain(config) {
  const queryParams = new URLSearchParams(window.location.search);
  const federalBranch = queryParams.get('fedsbranch');
  if (federalBranch?.trim()) {
    const sanitized = federalBranch.trim().toLowerCase();
    if (sanitized === 'local') return 'http://localhost:3000/federal';
    return `https://${sanitized}--federal--adobecom.aem.page/federal`;
  }

  const { hostname } = window.location;
  let extension;
  if (hostname.endsWith('.aem.page')) extension = 'page';
  if (hostname.endsWith('.aem.live') || hostname.endsWith('.aem.reviews')) extension = 'live';

  if (extension) return `${DEFAULT_FEDERAL_URL.replace('aem.page', `aem.${extension}`)}/federal`;

  const env = getEnv(config);
  if (env.name === 'stage') return 'https://www.stage.adobe.com/federal';
  if (env.name === 'prod') return 'https://www.adobe.com/federal';
  return `${DEFAULT_FEDERAL_URL}/federal`;
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
  const gnavUrl = new URL(getMetadata('gnav-source') || `${config.locale?.contentRoot ?? window.location.origin}/gnav`);

  main({
    localizeLink,
    gnavSource: gnavUrl,
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
