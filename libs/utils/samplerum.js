const WEB_VITALS_SRC = 'https://rum.hlx.page/.rum/web-vitals/dist/web-vitals.iife.js';

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
  navigator.sendBeacon(`https://rum.hlx.page/.rum/${weight}`, body);
  console.debug(`ping:${checkpoint}`, data);
};

const targetSelector = (element) => {
  let value = element.getAttribute('href') || element.currentSrc || element.getAttribute('src');
  if (value?.startsWith('https://')) {
    // resolve relative links
    value = new URL(value, window.location).href;
  }
  return value;
};

const sourceSelector = (element) => {
  if (element === document.body || element === document.documentElement || !element) {
    return undefined;
  }
  if (element.id) return `#${element.id}`;

  if (element.classList.length && element.parentElement.classList.contains('section')) {
    return `.${element.classList[0]}`;
  }

  return sourceSelector(element.parentElement);
};

const getObserver = (rum, checkpoint) => (window.IntersectionObserver
  ? new IntersectionObserver((entries, observer) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => {
        observer.unobserve(entry.target);
        const target = targetSelector(entry.target);
        const source = sourceSelector(entry.target);
        rum(checkpoint, { target, source });
      });
  }, { threshold: 0.25 })
  : { observe: () => {} }
);

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
      rum.drain('observe', ((elements) => {
        elements.forEach((element) => {
          const tagName = element.tagName.toLowerCase();
          const checkpointType = ['img', 'video', 'audio', 'iframe'].includes(tagName)
            ? 'viewmedia'
            : 'viewblock';

          const io = getObserver(rum, checkpointType);
          io.observe(element);
        });
      }));

      rum.drain('cwv', (() => {
        if (document.querySelector(`script[src="${WEB_VITALS_SRC}"]`)) {
          // web vitals script has been loaded already
          return;
        }
        // use classic script to avoid CORS issues
        const script = document.createElement('script');
        script.src = WEB_VITALS_SRC;
        script.onload = () => {
          const storeCWV = (measurement) => {
            const cwvData = { cwv: {} };
            cwvData.cwv[measurement.name] = measurement.value;
            rum('cwv', cwvData);
          };
          // When loading `web-vitals` using a classic script, all the public
          // methods can be found on the `webVitals` global namespace.
          window.webVitals.getCLS(storeCWV);
          window.webVitals.getFID(storeCWV);
          window.webVitals.getLCP(storeCWV);
        };
        document.head.appendChild(script);
      }));

      sendPing(checkpoint, data);

      document.addEventListener('click', (event) => {
        rum('click', { target: targetSelector(event.target), source: sourceSelector(event.target) });
      });

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
  window.hlx = window.hlx || {};
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
function sampleRUM(checkpoint, data = {}) {
  try {
    if (!sampleRUM.initialized) { initSampleRUM(sampleRUM, checkpoint, data); }
    if (!window.hlx?.rum) { initHlxRUM(sampleRUM); }

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

export default sampleRUM;
