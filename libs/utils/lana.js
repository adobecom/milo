var MSG_LIMIT = 2000;

var defaultOptions = {
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

function getOptions(op) {
  var o = window.lana.options;
  return {
    clientId: op.clientId !== undefined ? op.clientId : o.clientId,
    debug: op.debug !== undefined ? op.debug : o.debug,
    endpoint: op.endpoint !== undefined ? op.endpoint : o.endpoint,
    endpointStage: op.endpointStage !== undefined ? op.endpointStage : o.endpointStage,
    errorType: op.errorType !== undefined ? op.errorType : o.errorType,
    implicitSampleRate:
      op.implicitSampleRate !== undefined ? op.implicitSampleRate : o.implicitSampleRate,
    sampleRate: op.sampleRate !== undefined ? op.sampleRate : o.sampleRate,
    useProd: op.useProd !== undefined ? op.useProd : o.useProd,
  };
}

function setDefaultOptions(options) {
  window.lana.options = getOptions(options);
}

function sendUnhandledError(e) {
  log(e.reason || e.error || e.message, {
    errorType: 'i',
  });
}

function log(message, options) {
  if (!options) options = {};

  var o = getOptions(options);

  var sampleRate = o.errorType === 'i' ? o.implicitSampleRate : o.sampleRate;
  var endpoint = o.useProd ? o.endpoint : o.endpointStage;

  message = message && message.stack ? message.stack : message;
  if (message.length > MSG_LIMIT) {
    message = message.slice(0, MSG_LIMIT) + '<trunc>';
  }

  if (o.debug) {
    console.warn('LANA:', message);
  }

  if (sampleRate <= Math.random() * 100) return;

  var queryParams = [
    'm=' + encodeURIComponent(message),
    'c=' + encodeURI(o.clientId),
    's=' + sampleRate,
    't=' + encodeURI(o.errorType),
  ];

  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '?' + queryParams.join('&'));
  xhr.send();
}

function init() {
  var options = window.lana && window.lana.options;
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
