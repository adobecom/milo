import { AEM_ORIGIN } from './constants.js';
import RequestHandler from './request-handler.js';

const BATCH_SIZE = 25;
const BATCH_DELAY = 2000;

class BulkAction {
  constructor({ org, repo, callback }) {
    this.org = org;
    this.repo = repo;
    this.callback = callback;
    this.requestHandler = new RequestHandler();
    this.batchCount = 0;
  }

  cleanUpPath(path) {
    path = path.replace(/\.html$/, '');
    path = path.replace(/^\/[^/]+\/[^/]+/, '');
    return path;
  }

  delay = () => new Promise((resolve) => {
    setTimeout(resolve, BATCH_DELAY);
  });

  async previewOrPublishPath({ path, action, isDelete = false }) {
    path = this.cleanUpPath(path);
    const method = isDelete ? 'DELETE' : 'POST';
    const opts = { method };
    const aemUrl = `${AEM_ORIGIN}/${action}/${this.org}/${this.repo}/main${path}`;
    const resp = await this.requestHandler.daFetch(aemUrl, opts);
    if (!resp.ok) {
      console.error(`Failed to ${action} : ${resp.status} :: ${aemUrl}`);      
      this.callback({ statusCode: resp.status, aemUrl, errorMsg: `Failed to ${action}` });
    } else {
      this.callback({ statusCode: resp.status, aemUrl });
    }
  }

  async previewOrPublishPaths({ paths, action, isDelete = false }) {    
    for (let i = 0; i < paths.length; i += BATCH_SIZE) {
      const batch = paths.slice(i, i + BATCH_SIZE);
      console.log(`Batch number : ${++this.batchCount}`);
      await Promise.all(batch.map((path) => this.previewOrPublishPath({ path, action, isDelete })));
      console.log(`Waiting for ${BATCH_DELAY/1000} seconds before processing the next batch...`);
      await this.delay();
    }
  }
}

async function previewOrPublishPaths({ org, repo, paths, action, callback, isDelete = false }) {
  const bulkAction = new BulkAction({ org, repo, callback });
  console.log(`Action: ${action} :: isDelete: ${isDelete}`);
  await bulkAction.previewOrPublishPaths({ paths, action, isDelete });  
}

export default previewOrPublishPaths;
