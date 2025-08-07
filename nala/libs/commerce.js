const PRICE_PATTERN = {
  US_mo: /US\$\d+\.\d\d\/mo/,
  US_yr: /US\$\d+\.\d\d\/yr/,
  FR_mo: /\d+,\d\d\s€\/mois/,
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
        uniqueKey = 'CORS_POLICY_BLOCKED';
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

module.exports = { setupMasConsoleListener, attachMasConsoleErrorsToFailure, setupMasRequestLogger, attachMasRequestErrorsToFailure, PRICE_PATTERN };
