const PRICE_PATTERN = {
  US_mo: /US\$\d+\.\d\d\/mo/,
  US_yr: /US\$\d+\.\d\d\/yr/,
  FR_mo: /\d+,\d\d\s€\/mois/,
};

const CCD_BASE_PATH = {
  US: '/libs/features/mas/docs/ccd.html',
  FR: '/libs/features/mas/docs/ccd.html?locale=fr_FR',
  MINI_US: '/libs/features/mas/docs/ccd-mini.html',
  MINI_FR: '/libs/features/mas/docs/ccd-mini.html?country=FR&language=fr',
};

const ADOBE_HOME_BASE_PATH = { US: '/libs/features/mas/docs/adobe-home.html' };

const PLANS_BASE_PATH = { US: '/drafts/nala/features/commerce/plans' };

const DOCS_BASE_PATH = {
  merch_card: '/libs/features/mas/docs/merch-card.html',
  checkout_link: '/libs/features/mas/docs/checkout-link.html',
  plans: '/libs/features/mas/docs/plans.html',
};

async function setupMasConsoleListener(consoleErrors) {
  const seenErrors = new Set();

  return (msg) => {
    if (msg.type() === 'error') {
      const errorText = msg.text();
      let errorCode = '';
      let formattedError = '';

      const codeMatch = errorText.match(/(?:\[ERR[_-])?\d+\]?|(?:Error:?\s*)\d+|(?:status(?:\scode)?:?\s*)\d+/i);
      if (codeMatch) {
        [errorCode] = codeMatch;
        formattedError = `[${errorCode}] ${errorText}`;
      } else {
        formattedError = errorText;
      }

      let uniqueKey;

      if (errorText.includes('blocked by CORS policy')) {
        // Only log CORS errors for MAS-related URLs
        if (errorText.includes('/mas/io/') || /commerce[^.]*\.adobe\.com/.test(errorText)) {
          uniqueKey = 'MAS_CORS_POLICY_BLOCKED';
        } else {
          return; // Skip non-MAS CORS errors
        }
      } else if (errorText.includes('MAS Error:')) {
        uniqueKey = 'MAS_ERROR';
      } else if (errorText.includes('AEM Error:')) {
        uniqueKey = 'AEM_ERROR';
      } else if (errorText.includes('server responded with a status of 403')) {
        uniqueKey = 'HTTP_403_FORBIDDEN';
      } else if (errorText.includes('server responded with a status of 404')) {
        uniqueKey = 'HTTP_404_NOT_FOUND';
      } else if (errorText.includes('net::ERR_HTTP2_PROTOCOL_ERROR')) {
        uniqueKey = 'HTTP2_PROTOCOL_ERROR';
      } else if (errorText.includes('net::ERR_FAILED')) {
        uniqueKey = 'NETWORK_ERR_FAILED';
      } else {
        uniqueKey = errorCode || errorText.split('\n')[0].substring(0, 100);
      }

      if (!seenErrors.has(uniqueKey)) {
        seenErrors.add(uniqueKey);
        consoleErrors.push(formattedError);
      }
    }
  };
}

function attachMasConsoleErrorsToFailure(testInfo, consoleErrors) {
  if (testInfo.status === 'failed' && consoleErrors.length > 0) {
    const errorSummary = consoleErrors.map((error, index) => `${index + 1}. ${error}`).join('\n');
    const consoleErrorAttachment = `\n=== MAS CONSOLE ERRORS DURING TEST FAILURE ===\n${errorSummary}\n==========================================\n`;

    // Attach as additional context to the test failure
    testInfo.attach('Console Errors', {
      body: consoleErrorAttachment,
      contentType: 'text/plain',
    });

    return consoleErrorAttachment;
  }
  return '';
}

function attachMasRequestErrorsToFailure(testInfo, masRequestErrors) {
  if (testInfo.status === 'failed' && masRequestErrors.length > 0) {
    const errorSummary = masRequestErrors.map((error, index) => `${index + 1}. ${error}`).join('\n');
    const requestErrorAttachment = `\n=== MAS REQUEST ERRORS DURING TEST FAILURE ===\n${errorSummary}\n==========================================\n`;

    // Attach as additional context to the test failure
    testInfo.attach('MAS Request Errors', {
      body: requestErrorAttachment,
      contentType: 'text/plain',
    });

    return requestErrorAttachment;
  }
  return '';
}

async function setupMasRequestLogger(masRequestErrors) {
  const seenRequests = new Set();

  return {
    responseListener: async (response) => {
      const url = response.url();
      const status = response.status();

      if (url.includes('/mas/io/') && status >= 400) {
        let uniqueKey;
        if (status === 403) {
          uniqueKey = 'MAS_IO_403_FORBIDDEN';
        } else if (status === 404) {
          uniqueKey = 'MAS_IO_404_NOT_FOUND';
        } else if (status === 429) {
          uniqueKey = 'MAS_IO_429_TOO_MANY_REQUESTS';
        } else if (status >= 500) {
          uniqueKey = 'MAS_IO_5XX_SERVER_ERROR';
        } else {
          uniqueKey = `MAS_IO_${status}_ERROR`;
        }

        if (!seenRequests.has(uniqueKey)) {
          seenRequests.add(uniqueKey);

          const headers = response.headers();
          const corsHeaders = {
            'access-control-allow-origin': headers['access-control-allow-origin'] || 'MISSING',
            'access-control-allow-methods': headers['access-control-allow-methods'] || 'MISSING',
            'access-control-allow-headers': headers['access-control-allow-headers'] || 'MISSING',
            'access-control-allow-credentials': headers['access-control-allow-credentials'] || 'MISSING',
          };
          const akamaiGrn = headers['akamai-grn-www.adobe.com'] || 'MISSING';

          const errorDetails = `[${status}] Failed MAS I/O Request: ${url} | CORS: ${JSON.stringify(corsHeaders)} | Akamai GRN: ${akamaiGrn}`;
          masRequestErrors.push(errorDetails);

          console.log('\n🚫 Failed MAS I/O Request:');
          console.log(`URL: ${url}`);
          console.log(`Status: ${status}`);
          console.log('CORS Headers:', JSON.stringify(corsHeaders, null, 2));
          console.log(`Akamai GRN: ${akamaiGrn}`);
          console.log('─────────────────────────────────────\n');
        }
      }
    },

    requestFailedListener: async (request) => {
      const url = request.url();

      if (url.includes('/mas/io/')) {
        const failure = request.failure();
        const uniqueKey = `MAS_IO_REQUEST_FAILED_${failure ? failure.errorText : 'UNKNOWN'}`;

        if (!seenRequests.has(uniqueKey)) {
          seenRequests.add(uniqueKey);

          const errorDetails = `[FAILED] MAS I/O Request Failed: ${url} | Method: ${request.method()} | Failure: ${failure ? failure.errorText : 'Unknown error'}`;
          masRequestErrors.push(errorDetails);

          console.log('\n❌ MAS I/O Request Failed:');
          console.log(`URL: ${url}`);
          console.log(`Method: ${request.method()}`);
          console.log(`Failure: ${failure ? failure.errorText : 'Unknown error'}`);
          console.log('❌ NO RESPONSE RECEIVED (CORS blocked by browser)');
          console.log('─────────────────────────────────────\n');
        }
      }
    },
  };
}

/**
 * Creates a worker-scoped page setup utility
 * @param {Object} config - Configuration object
 * @param {Array} config.pages - Array of page configurations [{ name: 'US', url: '/path' }, ...]
 * @param {Object} config.extraHTTPHeaders - HTTP headers to set on the context
 * @param {number} config.loadTimeout - Timeout after networkidle (default: 5000ms)
 * @returns {Object} - Setup object with pages, setup/cleanup methods, and error arrays
 */
function createWorkerPageSetup(config = {}) {
  const {
    pages = [],
    extraHTTPHeaders = { 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' },
    loadTimeout = 5000,
  } = config;

  let workerContext;
  const workerPages = {};
  let consoleErrors = [];
  let masRequestErrors = [];

  const miloLibs = process.env.MILO_LIBS || '';

  /**
   * Sets up worker-scoped pages and listeners
   * @param {Object} params - Playwright test parameters
   * @param {Object} params.browser - Playwright browser object
   * @param {string} params.baseURL - Base URL for the test environment
   */
  async function setupWorkerPages({ browser, baseURL }) {
    console.info('[Worker Setup]: Initializing worker-scoped pages...');

    workerContext = await browser.newContext({ extraHTTPHeaders });

    consoleErrors = [];
    masRequestErrors = [];

    const pagePromises = pages.map(async (pageConfig) => {
      const { name, url } = pageConfig;
      const fullUrl = `${baseURL}${url}${miloLibs}`;

      console.info(`[Worker Setup]: Creating page for ${name}:`, fullUrl);

      const page = await workerContext.newPage();
      workerPages[name] = page;

      // Set up MAS request logger
      const masRequestLogger = await setupMasRequestLogger(masRequestErrors);
      page.on('response', masRequestLogger.responseListener);
      page.on('requestfailed', masRequestLogger.requestFailedListener);

      // Set up console listener
      const consoleListener = await setupMasConsoleListener(consoleErrors);
      page.on('console', consoleListener);

      // Load the page
      await page.goto(fullUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(loadTimeout);

      console.info(`[Worker Setup]: ${name} page fully loaded:`, await page.url());

      return { name, page, url: fullUrl };
    });

    await Promise.all(pagePromises);
    console.info('[Worker Setup]: All worker-scoped pages ready');
  }

  /**
   * Cleans up worker-scoped resources and reports errors
   */
  async function cleanupWorkerPages() {
    // Only run cleanup if setup was executed
    if (!consoleErrors && !masRequestErrors) {
      return; // Test was skipped, no cleanup needed
    }

    // Report console errors
    if (consoleErrors && consoleErrors.length > 0) {
      console.log('\n=== MAS CONSOLE ERRORS DURING PAGE LOADING ===');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      console.log('==========================================\n');
    }

    // Report MAS request errors
    if (masRequestErrors && masRequestErrors.length > 0) {
      console.log('\n=== MAS REQUEST ERRORS DURING WORKER LIFETIME ===');
      masRequestErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      console.log('==========================================\n');
    }

    // Clean up worker context
    if (workerContext) {
      await workerContext.close();
      console.info('[Worker Cleanup]: Worker context closed');
    }
  }

  /**
   * Attaches worker-scoped errors to failed test stack traces
   * @param {Object} testInfo - Playwright test info object
   */
  function attachWorkerErrorsToFailure(testInfo) {
    if (testInfo.status === 'failed') {
      const consoleErrorText = attachMasConsoleErrorsToFailure(testInfo, consoleErrors);
      const requestErrorText = attachMasRequestErrorsToFailure(testInfo, masRequestErrors);

      let enhancedMessage = '';

      if (consoleErrors.length > 0) {
        enhancedMessage += consoleErrorText;
      }

      if (masRequestErrors.length > 0) {
        enhancedMessage += requestErrorText;
      }

      if (enhancedMessage && testInfo.error) {
        testInfo.error.message = `${testInfo.error.message}${enhancedMessage}`;
      }
    }
  }

  /**
   * Gets a worker page by name
   * @param {string} pageName - Name of the page to retrieve
   * @returns {Object} - Playwright page object
   */
  function getPage(pageName) {
    const page = workerPages[pageName];
    if (!page) {
      throw new Error(`Worker page '${pageName}' not found. Available pages: ${Object.keys(workerPages).join(', ')}`);
    }
    return page;
  }

  /**
   * Verifies a page URL matches the expected pattern (requires Playwright expect)
   * @param {string} pageName - Name of the page to verify
   * @param {string} expectedPath - Expected URL path (will be converted to regex with ? escaping)
   * @param {Function} expect - Playwright expect function
   */
  async function verifyPageURL(pageName, expectedPath, expect) {
    const page = getPage(pageName);
    const regex = new RegExp(expectedPath.replace('?', '\\?'));
    await expect(page).toHaveURL(regex);
  }

  return {
    // Setup methods
    setupWorkerPages,
    cleanupWorkerPages,
    attachWorkerErrorsToFailure,

    // Page access methods
    getPage,
    verifyPageURL,

    // Direct access to error arrays
    get consoleErrors() { return consoleErrors; },
    get masRequestErrors() { return masRequestErrors; },

    // Direct access to all pages
    get pages() { return workerPages; },
  };
}

module.exports = {
  setupMasConsoleListener,
  attachMasConsoleErrorsToFailure,
  setupMasRequestLogger,
  attachMasRequestErrorsToFailure,
  createWorkerPageSetup,
  PRICE_PATTERN,
  CCD_BASE_PATH,
  ADOBE_HOME_BASE_PATH,
  PLANS_BASE_PATH,
  DOCS_BASE_PATH,
};
