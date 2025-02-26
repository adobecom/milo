import { AEM_ORIGIN } from './constants.js';
import RequestHandler from './request-handler.js';

const BATCH_SIZE = 25;
const BATCH_DELAY = 2000;

export class BulkAction {
  constructor({ org, repo, accessToken, callback }) {
    this.org = org;
    this.repo = repo;
    this.callback = callback;
    this.accessToken = accessToken;
    this.requestHandler = new RequestHandler(accessToken);
    this.batchCount = 0;
  }

  static cleanUpPath(path) {
    let cleanedPath = path.replace(/\.html$/, '');
    cleanedPath = cleanedPath.replace(/^\/[^/]+\/[^/]+/, '');
    return cleanedPath;
  }

  static delay = () => new Promise((resolve) => {
    setTimeout(resolve, BATCH_DELAY);
  });

  async previewOrPublishPath({ path, action, isDelete = false }) {
    const cleanedPath = BulkAction.cleanUpPath(path);
    const method = isDelete ? 'DELETE' : 'POST';
    const opts = { method };
    const aemUrl = `${AEM_ORIGIN}/${action}/${this.org}/${this.repo}/main${cleanedPath}`;
    const resp = await this.requestHandler.daFetch(aemUrl, opts);
    if (!resp.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to ${action} : ${resp.status} :: ${aemUrl}`);
      this.callback({ statusCode: resp.status, aemUrl, errorMsg: `Failed to ${action}` });
    } else {
      this.callback({ statusCode: resp.status, aemUrl });
    }
  }

  async previewOrPublishPaths({ paths, action, isDelete = false }) {
    for (let i = 0; i < paths.length; i += BATCH_SIZE) {
      const batch = paths.slice(i, i + BATCH_SIZE);
      // eslint-disable-next-line no-console,no-plusplus
      console.log(`Batch number : ${++this.batchCount}`);
      await Promise.all(batch.map((path) => this.previewOrPublishPath({ path, action, isDelete })));
      // eslint-disable-next-line no-console
      console.log(`Waiting for ${BATCH_DELAY / 1000} seconds before processing the next batch...`);
      await BulkAction.delay();
    }
  }
}

async function previewOrPublishPaths({
  org, repo, paths, action, accessToken, callback, isDelete = false,
}) {
  const bulkAction = new BulkAction({ org, repo, accessToken, callback });
  // eslint-disable-next-line no-console
  console.log(`Action: ${action} :: isDelete: ${isDelete}`);
  await bulkAction.previewOrPublishPaths({ paths, action, isDelete });
}

export default previewOrPublishPaths;
