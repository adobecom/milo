/* eslint-disable compat/compat */
import { initCaas, loadCaasFiles, loadStrings, fgHeaderValue } from './utils.js';
import { parseEncodedConfig, createIntersectionObserver, getMetadata, getConfig, b64ToUtf8 } from '../../utils/utils.js';

const ROOT_MARGIN = 1000;
const P_CAAS_AIO = b64ToUtf8('MTQyNTctY2hpbWVyYS5hZG9iZWlvcnVudGltZS5uZXQvYXBpL3YxL3dlYi9jaGltZXJhLTAuMC4xL2NvbGxlY3Rpb24=');
const S_CAAS_AIO = b64ToUtf8('MTQyNTctY2hpbWVyYS1zdGFnZS5hZG9iZWlvcnVudGltZS5uZXQvYXBpL3YxL3dlYi9jaGltZXJhLTAuMC4xL2NvbGxlY3Rpb24=');

const getCaasStrings = (placeholderUrl) => new Promise((resolve) => {
  if (placeholderUrl) {
    resolve(loadStrings(placeholderUrl));
    return;
  }
  resolve({});
});

const decodeCompressedString = async (txt) => {
  const b64decode = (str) => {
    const binaryStr = window.atob(str);
    const bytes = new Uint8Array(new ArrayBuffer(binaryStr.length));
    binaryStr?.split('')
      .forEach((c, i) => (bytes[i] = c.charCodeAt(0)));
    return bytes;
  };

  const b64toStream = (b64) => new Blob([b64decode(b64)], { type: 'text/plain' }).stream();

  const decompressStream = async (stream) => new Response(
    // eslint-disable-next-line no-undef
    stream.pipeThrough(new DecompressionStream('gzip')),
  );

  const responseToJSON = async (response) => {
    const blob = await response.blob();
    return JSON.parse(await blob.text());
  };

  const stream = b64toStream(txt);
  const resp = await decompressStream(stream);
  return responseToJSON(resp);
};

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

export default async function init(link) {
  if (link.textContent.includes('no-lazy')) {
    loadCaas(link);
  } else {
    createIntersectionObserver({
      el: link,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadCaas,
    });
  }
}
