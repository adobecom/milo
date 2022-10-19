const sendPing = (checkpoint, data) => {
  const { weight, id } = window.hlx.rum;
  const body = JSON.stringify({
    weight,
    id,
    referer: window.location.href,
    generation: window.hlx.RUM_GENERATION,
    checkpoint,
    ...data,
  });
  const url = `https://rum.hlx.page/.rum/${weight}`;
  navigator.sendBeacon(url, body);
  console.debug(`ping:${checkpoint}`, data);
};

/* c8 ignore next 30 */
const initSampleRUM = (rum, checkpoint, data) => {
  window.hlx = window.hlx || {};

  rum.defer = [];

  rum.drain = ((dfnname, fn) => {
    rum[dfnname] = fn;
    rum.defer
      .filter(({ fnname }) => dfnname === fnname)
      .forEach(({ fnname, args }) => rum[fnname](...args));
  });

  rum.on = (chkpnt, fn) => {
    rum.cases[chkpnt] = fn;
  };

  rum.cases = {
    cwv: () => rum.cwv(data) || true,
    lazy: () => {
      // use classic script to avoid CORS issues
      const script = document.createElement('script');
      script.src = 'https://rum.hlx.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js';
      document.head.appendChild(script);
      sendPing(checkpoint, data);
      return true;
    },
  };

  rum.initialized = true;
};

// eslint-disable-next-line no-bitwise
const hashCode = (s) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const initHlxRUM = (rum) => {
  const usp = new URLSearchParams(window.location.search);
  const weight = usp.get('rum') === 'on' ? 1 : 100; // with parameter, weight is 1. Defaults to 100.
  const id = `${hashCode(window.location.href)}-${new Date().getTime()}-${Math.random()
    .toString(16)
    .substr(2, 14)}`;
  const random = Math.random();
  const isSelected = random * weight < 1;
  window.hlx.rum = { weight, id, random, isSelected, sampleRUM: rum };
};

const defer = (rum, fnname) => {
  rum[fnname] = rum[fnname]
    || ((...args) => rum.defer.push({ fnname, args }));
};

/**
 * log RUM if part of the sample.
 * @param {string} checkpoint identifies the checkpoint in funnel
 * @param {Object} data additional data for RUM sample
 */
export default function sampleRUM(checkpoint, data = {}) {
  try {
    if (!sampleRUM.initialized) { initSampleRUM(sampleRUM, checkpoint, data); }
    if (!window.hlx.rum) { initHlxRUM(sampleRUM); }

    defer(sampleRUM, 'observe');
    defer(sampleRUM, 'cwv');

    if (window.hlx.rum.isSelected) {
      sendPing(checkpoint, data);

      if (sampleRUM.cases[checkpoint]) {
        sampleRUM.cases[checkpoint]();
      }
    }
  } catch (error) {
    console.error(`SampleRUM error: ${error.message}`);
  }
}
