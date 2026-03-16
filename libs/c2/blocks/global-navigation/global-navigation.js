import { getEnv, getConfig, getMetadata, localizeLink } from '../../../utils/utils.js';

export default async function init(el) {
  const config = getConfig();
  const federalDomain = (() => {
    // TO remove after testing
    const isLocal = new URLSearchParams(window.location.search).get('federal-domain') === 'local';
    if (isLocal) {
      return 'http://localhost:3000';
    }
    const env = getEnv(config);
    switch (env.name) {
      default: return 'https://gnav-redesign--federal--adobecom.aem.page';
    }
  })();
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
    (command) => command?.modifiers?.find((modifier) => modifier === 'include-gnav'),
  ) || [];

  const personalizationHandler = async (cs, root) => {
    const { handleCommands } = await import('../../../features/personalization/personalization.js');
    return handleCommands(cs, root);
  };

  const { main } = await import(`${federalDomain}/libs/global-navigation/dist/main.js`);
  main({
    localizeLink,
    gnavSource: new URL(getMetadata('gnav-source')),
    asideSource: null,
    isLocalNav: false,
    mountpoint: el,
    unavEnabled: getMetadata('unav') === 'on',
    placeholders: placeholdersPromise,
    miloConfig: getConfig(),
    personalization: {
      commands: [...commands, ...gnavMepCommands],
      handleCommands: personalizationHandler,
    },
  }).catch((error) => {
    console.log(error);
  });
}
