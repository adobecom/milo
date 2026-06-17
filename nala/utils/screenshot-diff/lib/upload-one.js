#!/usr/bin/env node
/**
 * Upload a single file to S3. Used by the merge-fan-in job to publish
 * just the consolidated results.json after parallel matrix capture.
 *
 * Usage: node upload-one.js <localPath>
 * The S3 key equals the local path. MIME type inferred from extension.
 */

const { uploadFile } = require('./upload-s3.js');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node upload-one.js <localPath>');
  process.exit(1);
}

const mimeType = filePath.endsWith('.json') ? 'application/json'
  : filePath.endsWith('.png') ? 'image/png'
    : 'application/octet-stream';

uploadFile({
  fileName: filePath,
  s3Path: '.',
  s3Key: filePath,
  mimeType,
})
  .then(() => console.log(`✓ Uploaded ${filePath}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
