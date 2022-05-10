const MSG_LIMIT = 2000;

const defaultOptions = {
  clientId: '',
  debug: false,
  endpoint: 'https://www.adobe.com/lana/ll',
  endpointStage: 'https://www.stage.adobe.com/lana/ll',
  errorType: 'e',
  sampleRate: 1,
  implicitSampleRate: 1,
  useProd: true,
};

function setClientdId(id) {
  window.lana.options.clientId = id;
}

function setDefaultOptions(options) {
  window.lana.options = getOptions(options);
}

function getOptions(op) {
  const o = window.lana.options;
  const getOpt = (key) => (op[key] !== undefined ? op[key] : o[key]);

  return Object.keys(defaultOptions).reduce((options, key) => {
    options[key] = getOpt(key);
    return options;
  }, {});
}

function sendUnhandledError(e) {
  log(e.reason || e.error || e.message, {
    errorType: 'i',
  });
}

function log(msg, options = {}) {
  msg = msg && msg.stack ? msg.stack : msg;
  if (msg.length > MSG_LIMIT) {
    msg = msg.slice(0, MSG_LIMIT) + '<trunc>';
  }

  const o = getOptions(options);
  if (o.debug) {
    console.warn('LANA:', msg);
  }

  const sampleRate = o.errorType === 'i' ? o.implicitSampleRate : o.sampleRate;
  if (sampleRate <= Math.random() * 100) return;

  const endpoint = o.useProd ? o.endpoint : o.endpointStage;
  const queryParams = [
    'm=' + encodeURIComponent(msg),
    'c=' + encodeURI(o.clientId),
    's=' + sampleRate,
    't=' + encodeURI(o.errorType),
  ];

  const xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '?' + queryParams.join('&'));
  xhr.send();
}

function init() {
  const options = window.lana && window.lana.options;
  window.lana = {
    log: log,
    setClientdId: setClientdId,
    setDefaultOptions: setDefaultOptions,
    options: options || defaultOptions,
  };

  window.addEventListener('error', sendUnhandledError);
  window.addEventListener('unhandledrejection', sendUnhandledError);
}
init();
