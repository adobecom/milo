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

      // Create a unique key based on error pattern, not specific IDs/codes
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

      // Only add if we haven't seen this type of error before
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
    const consoleErrorAttachment = `\n\n=== MAS CONSOLE ERRORS DURING TEST FAILURE ===\n${errorSummary}\n==========================================`;

    // Attach as additional context to the test failure
    testInfo.attach('Console Errors', {
      body: consoleErrorAttachment,
      contentType: 'text/plain',
    });

    return consoleErrorAttachment;
  }
  return '';
}

module.exports = { setupMasConsoleListener, attachMasConsoleErrorsToFailure, PRICE_PATTERN };
