/* eslint-disable no-restricted-syntax */
const readline = require('readline');
// eslint-disable-next-line import/no-extraneous-dependencies
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const config = require('./config.js');

async function* listObjects(s3, params) {
  let isTruncated = false;
  let token;
  do {
    const command = new ListObjectsV2Command({ ...params, ContinuationToken: token });
    // eslint-disable-next-line no-await-in-loop
    const response = await s3.send(command);
    yield response.Contents;
    ({ IsTruncated: isTruncated, NextContinuationToken: token } = response);
  } while (isTruncated);
}

function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    });
  });
}

/**
 * List + (optionally interactively) delete all objects under a prefix.
 * Pass --force to skip the y/N prompt (use with care; intended for scheduled
 * lifecycle cleanup, not ad-hoc deletes).
 * @param {string} bucket
 * @param {string} s3Path - Prefix
 * @param {{force?: boolean}} [opts]
 */
async function cleanPrefix(bucket, s3Path, opts = {}) {
  if (!config.s3.accessKeyId || !config.s3.secretAccessKey) {
    throw new Error(
      'Missing S3 credentials. Set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY env vars.',
    );
  }

  const s3 = new S3Client({
    region: config.s3.region,
    endpoint: config.s3.endpoint,
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
    },
    forcePathStyle: true,
  });

  const params = { Bucket: bucket, Prefix: s3Path, MaxKeys: 1000 };
  let totalSize = 0;
  const toBeDeleted = { Bucket: bucket, Delete: { Objects: [], Quiet: false } };

  for await (const contents of listObjects(s3, params)) {
    if (!contents || contents.length === 0) {
      console.log('No objects to delete.');
      return;
    }
    for (const obj of contents) {
      totalSize += obj.Size;
      console.log(`${obj.Key}, ${obj.LastModified}, ${obj.Size}`);
      toBeDeleted.Delete.Objects.push({ Key: obj.Key });
    }
  }

  if (toBeDeleted.Delete.Objects.length === 0) {
    console.log('No files to delete.');
    return;
  }

  const proceed = opts.force
    || (await askQuestion('Are you sure you want to delete these files? (yes/no): ')).toLowerCase() === 'yes';

  if (proceed) {
    await s3.send(new DeleteObjectsCommand(toBeDeleted));
    console.log(`Files deleted successfully. Total size freed: ${totalSize}`);
  } else {
    console.log('Deletion canceled.');
  }
}

module.exports = { cleanPrefix };

// CLI entry: `node clean-s3.js <bucket> <prefix> [--force]`
if (require.main === module) {
  const bucket = process.argv[2];
  const s3Path = process.argv[3];
  const force = process.argv.includes('--force');

  if (!bucket || !s3Path) {
    console.log('Usage: node clean-s3.js <bucket> <prefix> [--force]');
    process.exit(1);
  }

  cleanPrefix(bucket, s3Path, { force }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
