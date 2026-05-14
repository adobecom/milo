import {
  decodeCompressedString,
  initCaas,
  loadCaasFiles,
  loadStrings,
} from './utils.js';
import {
  b64ToUtf8,
  createIntersectionObserver,
  getConfig,
  getMetadata,
  isBot,
  parseEncodedConfig,
  SLD,
} from '../../utils/utils.js';

const ROOT_MARGIN = 1000;
const P_CAAS_AIO = b64ToUtf8('MTQyNTctY2hpbWVyYS5hZG9iZWlvcnVudGltZS5uZXQvYXBpL3YxL3dlYi9jaGltZXJhLTAuMC4xL2NvbGxlY3Rpb24=');
const S_CAAS_AIO = b64ToUtf8('MTQyNTctY2hpbWVyYS1zdGFnZS5hZG9iZWlvcnVudGltZS5uZXQvYXBpL3YxL3dlYi9jaGltZXJhLTAuMC4xL2NvbGxlY3Rpb24=');

const getFloodgateColor = (host) => {
  const metaColor = getMetadata('floodgatecolor');
  if (metaColor) return metaColor;

  if (host.endsWith('.aem.page') || host.endsWith('.aem.live')) {
    const parts = host.split('.')[0].split('--');
    const repo = parts.length >= 3 ? parts.slice(1, -1).join('--') : '';
    const fgMatch = repo.match(/-fg-(\w+)$/);
    if (fgMatch) return fgMatch[1];
  }

  return '';
};

const getCaasStrings = (placeholderUrl) => new Promise((resolve) => {
  if (placeholderUrl) {
    resolve(loadStrings(placeholderUrl));
    return;
  }
  resolve({});
});

const loadCaas = async (a) => {
  const encodedConfig = a.href.split('#')[1];
  // ~~ indicates the new compressed string format
  const state = encodedConfig.startsWith('~~')
    ? await decodeCompressedString(encodedConfig.substring(2))
    : parseEncodedConfig(encodedConfig);

  const [caasStrs] = await Promise.all([
    getCaasStrings(state.placeholderUrl),
    loadCaasFiles(),
  ]);

  const block = document.createElement('div');
  block.className = a.className;
  block.id = 'caas';
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modalContainer';
  a.insertAdjacentElement('afterend', modalDiv);

  a.insertAdjacentElement('afterend', block);
  a.remove();

  const langFirst = getMetadata('langfirst');
  if (langFirst) {
    state.langFirst = true;
  }

  const { env } = getConfig();
  const { host, search } = window.location;

  const floodGateColor = getFloodgateColor(host);
  if (floodGateColor && floodGateColor !== 'default') {
    state.fetchCardsFromFloodgateTree = true;
    state.floodgateColor = floodGateColor;
  }
  let chimeraEndpoint = 'www.adobe.com/chimera-api/collection';
  const queryParams = new URLSearchParams(search);
  const caasEndpoint = queryParams.get('caasendpoint');
  const caasContainer = queryParams.get('caascontainer');

  if (host === 'stage.adobe.com' || host.endsWith('.stage.adobe.com')) {
    chimeraEndpoint = 'www.stage.adobe.com/chimera-api/collection';
  } else if (env?.name === 'local' || caasEndpoint === 'stage') {
    chimeraEndpoint = S_CAAS_AIO;
  } else if (host.includes(`.${SLD}.`) || caasEndpoint === 'prod') {
    // If invoking URL is not an Acom URL, then switch to AIO
    chimeraEndpoint = P_CAAS_AIO;
  }

  if (host.includes(`${SLD}.page`) || env?.name === 'local' || caasContainer === 'draft') {
    state.draftDb = true;
  }

  state.endpoint = chimeraEndpoint;

  initCaas(state, caasStrs, block);
};

export default async function init(link) {
  if (link.textContent.includes('no-lazy') || isBot()) {
    loadCaas(link);
  } else {
    createIntersectionObserver({
      el: link,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadCaas,
    });
  }
}
