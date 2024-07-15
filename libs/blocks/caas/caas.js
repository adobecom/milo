import {
  decodeCompressedString,
  fgHeaderValue,
  initCaas,
  loadCaasFiles,
  loadStrings,
} from './utils.js';
import {
  b64ToUtf8,
  createIntersectionObserver,
  getConfig,
  getMetadata,
  parseEncodedConfig,
} from '../../utils/utils.js';

const P_CAAS_AIO = b64ToUtf8('MTQyNTctY2hpbWVyYS5hZG9iZWlvcnVudGltZS5uZXQvYXBpL3YxL3dlYi9jaGltZXJhLTAuMC4xL2NvbGxlY3Rpb24=');
const S_CAAS_AIO = b64ToUtf8('MTQyNTctY2hpbWVyYS1zdGFnZS5hZG9iZWlvcnVudGltZS5uZXQvYXBpL3YxL3dlYi9jaGltZXJhLTAuMC4xL2NvbGxlY3Rpb24=');
const ROOT_MARGIN = 1000;
const getCaasStrings = (placeholderUrl) => new Promise((resolve) => {
  if (placeholderUrl) {
    resolve(loadStrings(placeholderUrl));
    return;
  }
  resolve({});
});

const loadCaas = async (a, state) => {
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

  const floodGateColor = getMetadata('floodgatecolor') || '';
  if (floodGateColor === fgHeaderValue) {
    state.fetchCardsFromFloodgateTree = true;
  }

  const { env } = getConfig();
  const { host } = window.location;
  let chimeraEndpoint = 'www.adobe.com/chimera-api/collection';

  if (host.includes('stage.adobe') || env?.name === 'local') {
    chimeraEndpoint = S_CAAS_AIO;
  } else if (host.includes('.hlx.')) {
    // If invoking URL is not an Acom URL, then switch to AIO
    chimeraEndpoint = P_CAAS_AIO;
  }

  if (host.includes('hlx.page') || env?.name === 'local') {
    state.draftDb = true;
  }

  state.endpoint = chimeraEndpoint;

  initCaas(state, caasStrs, block);
};

function extractRootMargin(str) {
  const regex = /\(root-margin:(\d+)\)/;
  const match = regex.exec(str);

  if (match) {
    return parseInt(match[1], 10);
  }
  return ROOT_MARGIN; // default root margin used in Milo
}

export default async function init(link) {
  const encodedConfig = link.href.split('#')[1];
  const state = encodedConfig.startsWith('~~')
    ? await decodeCompressedString(encodedConfig.substring(2))
    : parseEncodedConfig(encodedConfig);
  if (link.textContent.includes('no-lazy')) {
    loadCaas(link, state);
  } else {
    createIntersectionObserver({
      el: link,
      options: { rootMargin: `${state.rootMargin || ROOT_MARGIN}px` },
      callback: loadCaas,
    });
  }
}
