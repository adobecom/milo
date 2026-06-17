const fs = require('fs');
const path = require('path');
const { validatePath } = require('./utils.js');

/**
 * Merge per-worker `results-*.json` files into a single `results.json` and
 * delete the per-worker shards. Used after Playwright matrix runs.
 * @param {string} folderPath e.g. screenshots/milo
 */
function mergeResults(folderPath) {
  try {
    const resultsFiles = fs.readdirSync(validatePath(folderPath, { allowDirectory: true }))
      .filter((file) => file.startsWith('results-'));
    let finalResults = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const file of resultsFiles) {
      const content = JSON.parse(
        fs.readFileSync(validatePath(path.join(folderPath, file)), 'utf-8'),
      );
      finalResults = { ...finalResults, ...content };
    }

    fs.writeFileSync(
      validatePath(`${folderPath}/results.json`, { forWriting: true }),
      JSON.stringify(finalResults, null, 2),
    );

    resultsFiles.forEach((file) => fs.unlinkSync(validatePath(path.join(folderPath, file))));

    console.log('Results merged and saved successfully.');
  } catch (error) {
    console.error('Error merging results:', error);
  }
}

module.exports = { mergeResults };

// CLI entry: `node merge.js screenshots/milo`
if (require.main === module) {
  const folderPath = process.argv[2];
  if (!folderPath) {
    console.error('Please specify a folder path. e.g., screenshots/milo');
    process.exit(1);
  }
  mergeResults(folderPath);
}
