var defaultOptions = {
  clientId: '',
  debug: false,
  endpoint: '',
  errorType: 'e',
  sampleRate: 1,
};

function setClientdId(id) {
  defaultOptions.clientId = id;
}

function setDefaultOptions(options) {
  defaultOptions = {
    sampleRate: options.sampleRate || defaultOptions.sampleRate,
    endpoint: options.endpoint || defaultOptions.endpoint,
    errorType: options.errorType || defaultOptions.errorType,
    debug: options.debug || defaultOptions.debug,
    clientId: options.clientId || defaultOptions.clientId,
  };
}

function sendUnhandledError(e) {
  log(e.reason || e.error || e.message, {
    errorType: 'i',
  });
}

function log(message, options) {
  if (!options) options = {};

  var debug = options.debug || defaultOptions.debug;
  var sampleRate = options.sampleRate || defaultOptions.sampleRate;
  message = message && message.stack ? message.stack : message;

  if (debug) {
    console.warn('LANA:', message);
  }

  if (sampleRate <= Math.random() * 100) return;

  var clientId = options.clientId || defaultOptions.clientId;
  var endpoint = options.endpoint || defaultOptions.endpoint;
  var errorType = options.errorType || defaultOptions.errorType;

  var queryParams = [
    'm=' + encodeURIComponent(message),
    'c=' + encodeURI(clientId),
    's=' + sampleRate,
    't=' + encodeURI(errorType),
  ];

  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '?' + queryParams.join('&'));
  xhr.send();
}

function init() {
  window.lana = {
    log: log,
    setClientdId: setClientdId,
    setDefaultOptions: setDefaultOptions,
  };
  window.addEventListener('error', sendUnhandledError);
  window.addEventListener('unhandledrejection', sendUnhandledError);
}
init();
