// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { getComparator } from 'playwright-core/lib/utils';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const config = require('./config.js');
const { validatePath } = require('./utils.js');

async function downloadImage(url, localPath) {
  const writer = fs.createWriteStream(validatePath(localPath, { forWriting: true }));
  const res = await axios.get(url, { responseType: 'stream' });
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

/**
 * For each entry in `curEntries`, fetch the previously published baseline
 * image from S3 and rewrite `entry.a` to point at the local download path.
 * Used when the run only produced one capture (current) and needs to compare
 * against the last good baseline.
 */
async function getSavedImages(s3Url, curEntries) {
  let response;
  try {
    response = await axios.get(`${s3Url}/results.json`);
  } catch (error) {
    console.error(`Failed to get previous results.json from ${s3Url}`);
    process.exit(1);
  }
  const preEntries = response.data;

  if (Object.keys(curEntries).length !== Object.keys(preEntries).length) {
    throw new Error(
      `Previous one has ${Object.keys(preEntries).length} items, `
      + `but the current one has ${Object.keys(curEntries).length}`,
    );
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(curEntries)) {
    const entry = value[0];
    if (!entry.b) {
      entry.b = entry.a;
    }

    const basename = path.basename(preEntries[key][0].a);
    entry.a = preEntries[key][0].a.includes('-a.png')
      ? preEntries[key][0].a
      : preEntries[key][0].a.replace('.png', '-a.png');
    console.log(`Downloading ${s3Url}/${basename}`);
    // eslint-disable-next-line no-await-in-loop
    await downloadImage(`${s3Url}/${basename}`, entry.a);
  }
}

async function main() {
  const localPath = process.argv[2];

  if (!localPath) {
    console.log('Usage: node compare.mjs <localPath>');
    process.exit(1);
  }

  const curEntries = JSON.parse(fs.readFileSync(validatePath(`${localPath}/results.json`)));

  const firstEntry = Object.values(curEntries)[0][0];

  if (firstEntry.a && !firstEntry.b) {
    const s3Url = `${config.publicReadUrl}/${localPath}`;
    if (s3Url) {
      await getSavedImages(s3Url, curEntries);
    }
  }

  const results = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(curEntries)) {
    const resultsArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of value) {
      const result = {};
      console.log(entry);

      const baseImage = fs.readFileSync(validatePath(entry.a));
      const currImage = fs.readFileSync(validatePath(entry.b));
      result.order = entry.order;
      result.a = entry.a;
      result.b = entry.b;
      result.urls = entry.urls;

      const comparator = getComparator('image/png');
      // Match nala's visual.config.js tolerance — suppress single-pixel
      // anti-aliasing noise that drowns real layout changes.
      const diffImage = comparator(baseImage, currImage, {
        threshold: 0.2,
        maxDiffPixelRatio: 0.01,
      });

      if (diffImage) {
        const diffName = `${entry.b}`.replace('.png', '-diff.png');
        fs.writeFileSync(validatePath(diffName, { forWriting: true }), diffImage.diff);
        result.diff = diffName;
        console.info('Differences found');
      }
      resultsArray.push(result);
    }
    results[key] = resultsArray;
  }

  fs.writeFileSync(
    validatePath(`${localPath}/results.json`, { forWriting: true }),
    JSON.stringify(results, null, 2),
  );
}

main();
