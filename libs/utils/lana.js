/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
(function iife() {
  const MSG_LIMIT = 2000;

  const defaultOptions = {
    clientId: '',
    endpoint: 'https://www.adobe.com/lana/ll',
    endpointStage: 'https://www.stage.adobe.com/lana/ll',
    /**
     * Type of error being logged:
     * 'e' - explicit (manually logged errors/messages)
     * 'i' - implicit (automatically caught errors)
     */
    errorType: 'e',
    sampleRate: 1,
    tags: '',
    implicitSampleRate: 1,
    useProd: true,
    isProdDomain: false,
  };

  // Valid severity values (both full and abbreviated formats)
  const VALID_SEVERITIES = new Set(['d', 'debug', 'i', 'info', 'w', 'warn', 'e', 'error', 'c', 'critical']);

  const w = window;

  function isProd() {
    const { host } = window.location;
    if (host.substring(host.length - 10) === '.adobe.com'
      && host.substring(host.length - 15) !== '.corp.adobe.com'
      && host.substring(host.length - 16) !== '.stage.adobe.com') {
      return true;
    }
    return false;
  }

  function mergeOptions(op1, op2) {
    if (!op1) {
      op1 = {};
    }

    if (!op2) {
      op2 = {};
    }

    function getOpt(key) {
      if (op1[key] !== undefined) {
        return op1[key];
      }
      if (op2[key] !== undefined) {
        return op2[key];
      }
      return defaultOptions[key];
    }

    return Object.keys(defaultOptions).reduce((options, key) => {
      options[key] = getOpt(key);
      return options;
    }, {});
  }

  function hasDebugParam() {
    return w.location.search.toLowerCase().indexOf('lanadebug') !== -1;
  }

  function isLocalhost() {
    return w.location.host.toLowerCase().indexOf('localhost') !== -1;
  }

  function log(msg, options) {
    msg = msg && msg.stack ? msg.stack : (msg || '');
    if (msg.length > MSG_LIMIT) {
      msg = `${msg.slice(0, MSG_LIMIT)}<trunc>`;
    }

    const o = mergeOptions(options, w.lana.options);
    if (!o.clientId) {
      console.warn('LANA ClientID is not set in options.');
      return;
    }

    // Process severity only if it's explicitly provided in original options
    let severity;
    if (options && options.severity !== undefined) {
      // Check if value is valid
      if (VALID_SEVERITIES.has(options.severity)) {
        severity = options.severity;
      } else {
        // Invalid severity, use default based on debug mode
        const isDebugMode = hasDebugParam() || w.lana.debug;
        const defaultSeverity = isDebugMode ? 'd' : 'i';
        console.warn(`LANA: Invalid severity '${options.severity}'. Defaulting to '${defaultSeverity}'.`);
        severity = defaultSeverity;
      }
    } else if (w.lana.debug) {
      // In debug mode, use debug severity if enabled
      severity = 'd';
    }

    const sampleRateParam = parseInt(new URL(window.location).searchParams.get('lana-sample'), 10);
    const sampleRate = sampleRateParam || (o.errorType === 'i' ? o.implicitSampleRate : o.sampleRate);

    if (!w.lana.debug && !w.lana.localhost && sampleRate <= Math.random() * 100) return;

    const isProdDomain = isProd() || o.isProdDomain;

    const endpoint = (!isProdDomain || !o.useProd) ? o.endpointStage : o.endpoint;
    const queryParams = [
      `m=${encodeURIComponent(msg)}`,
      `c=${encodeURI(o.clientId)}`,
      `s=${sampleRate}`,
      `t=${encodeURI(o.errorType)}`,
    ];

    // Only add severity parameter if it's explicitly provided
    if (severity) {
      queryParams.push(`r=${encodeURI(severity)}`);
    }

    if (o.tags) {
      queryParams.push(`tags=${encodeURI(o.tags)}`);
    }

    if (!isProdDomain || w.lana.debug || w.lana.localhost) console.log('LANA Msg: ', msg, '\nOpts:', o);

    if (!w.lana.localhost || w.lana.debug) {
      const xhr = new XMLHttpRequest();
      if (w.lana.debug) {
        queryParams.push('d');
        xhr.addEventListener('load', () => {
          console.log('LANA response:', xhr.responseText);
        });
      }
      xhr.open('GET', `${endpoint}?${queryParams.join('&')}`);
      xhr.send();
      // eslint-disable-next-line consistent-return
      return xhr;
    }
  }

  /**
   * Sends unhandled errors to Lana with errorType 'i' (implicit)
   * Used for errors that are automatically caught by window error handlers
   */
  function sendUnhandledError(e) {
    log(e.reason || e.error || e.message, { errorType: 'i' });
  }

  w.lana = {
    debug: false,
    log,
    options: mergeOptions(w.lana && w.lana.options),
  };

  /* c8 ignore next */
  if (hasDebugParam()) w.lana.debug = true;
  if (isLocalhost()) w.lana.localhost = true;

  w.addEventListener('error', sendUnhandledError);
  w.addEventListener('unhandledrejection', sendUnhandledError);
}());
