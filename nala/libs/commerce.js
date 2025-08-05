const PRICE_PATTERN = {
  US_mo: /US\$\d+\.\d\d\/mo/,
  US_yr: /US\$\d+\.\d\d\/yr/,
  FR_mo: /\d+,\d\d\s€\/mois/,
};

async function enableMasErrorLogging(page) {
  const originalConsoleError = console.error;
  await page.evaluate(() => {
    document.addEventListener('mas:error', (event) => {
      originalConsoleError('MAS Error:', event?.detail);
    });
    document.addEventListener('aem:error', (event) => {
      originalConsoleError('AEM Error:', event?.detail);
    });
  });
}

module.exports = { enableMasErrorLogging, PRICE_PATTERN };
