import { getEnv, getConfig, getMetadata, localizeLink } from '../../../utils/utils.js';

const FEDERAL_BRANCH_PATTERN = /^[a-z0-9-]+(?:--[a-z0-9-]+)*$/;

function getFederalDomain(config) {
  const federalBranchParam = new URLSearchParams(window.location.search).get('federal-branch');
  if (federalBranchParam?.trim()) {
    const sanitized = federalBranchParam.trim().toLowerCase();
    if (sanitized === 'local') return 'http://localhost:3000';

    const extension = window.location.hostname.endsWith('.page') ? 'page' : 'live';
    if (!FEDERAL_BRANCH_PATTERN.test(sanitized)) return 'https://stage--federal--adobecom.aem.page';
    const branch = sanitized.includes('--') ? sanitized : `${sanitized}--federal--adobecom`;
    return `https://${branch}.aem.${extension}`;
  }

  const env = getEnv(config);
  if (env.name === 'stage') return 'https://www.stage.adobe.com/federal';
  if (env.name === 'prod') return 'https://www.adobe.com/federal';
  return 'https://stage--federal--adobecom.aem.page';
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
