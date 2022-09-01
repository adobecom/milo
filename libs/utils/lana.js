(function () {
  const MSG_LIMIT = 2000;

  const defaultOptions = {
    clientId: '',
    endpoint: 'https://www.adobe.com/lana/ll',
    endpointStage: 'https://www.stage.adobe.com/lana/ll',
    errorType: 'e',
    sampleRate: 1,
    tags: '',
    implicitSampleRate: 1,
    useProd: true,
  };

  const w = window;

  function getOptions(op) {
    const o = w.lana.options;
    function getOpt(key) {
      return op[key] !== undefined ? op[key] : o[key];
    }

    return Object.keys(defaultOptions).reduce(function (options, key) {
      options[key] = getOpt(key);
      return options;
    }, {});
  }

  function sendUnhandledError(e) {
    log(e.reason || e.error || e.message, {
      errorType: 'i',
    });
  }

  function log(msg, options) {
    msg = msg && msg.stack ? msg.stack : msg;
    if (msg.length > MSG_LIMIT) {
      msg = msg.slice(0, MSG_LIMIT) + '<trunc>';
    }

    const o = getOptions(options || {});
    if (!o.clientId) {
      console.warn('LANA ClientID is not set in options.');
      return;
    }

    const sampleRate = o.errorType === 'i' ? o.implicitSampleRate : o.sampleRate;

    if (!w.lana.debug && !w.lana.localhost && sampleRate <= Math.random() * 100) return;

    const isCorpAdobeCom = window.location.href.indexOf('.corp.adobe.com') !== -1;

    const endpoint = (isCorpAdobeCom || !o.useProd) ? o.endpointStage : o.endpoint;
    const queryParams = [
      'm=' + encodeURIComponent(msg),
      'c=' + encodeURI(o.clientId),
      's=' + sampleRate,
      't=' + encodeURI(o.errorType),
    ];

    if (o.tags) {
      queryParams.push('tags=' + encodeURI(o.tags));
    }

    if (w.lana.debug || w.lana.localhost) console.log('LANA Msg: ', msg, '\nOpts:', o);

    if (!w.lana.localhost || w.lana.debug) {
      const xhr = new XMLHttpRequest();
      if (w.lana.debug) {
        queryParams.push('d');
        xhr.addEventListener('load', function () {
          console.log('LANA response:', xhr.responseText);
        });
      }
      xhr.open('GET', endpoint + '?' + queryParams.join('&'));
      xhr.send();
      return xhr;
    }
  }

  function hasDebugParam() {
    return w.location.search.toLowerCase().indexOf('lanadebug') !== -1;
  }

  function isLocalhost() {
    return w.location.host.toLowerCase().indexOf('localhost') !== -1;
  }

  const options = w.lana && w.lana.options;
  w.lana = {
    debug: false,
    log: log,
    options: options || defaultOptions,
    setClientId: function (id) {
      console.warn('LANA setClientId is deprecated and will be removed in a future release.');
      w.lana.options.clientId = id;
    },
    setDefaultOptions: function (options) {
      console.warn('LANA setDefaultOptions is deprecated and will be removed in a future release.');
      w.lana.options = getOptions(options);
    },
  };

  /* c8 ignore next */
  if (hasDebugParam()) w.lana.debug = true;
  if (isLocalhost()) w.lana.localhost = true;

  w.addEventListener('error', sendUnhandledError);
  w.addEventListener('unhandledrejection', sendUnhandledError);
}());
