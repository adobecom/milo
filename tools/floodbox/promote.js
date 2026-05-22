/* eslint-disable import/no-unresolved */
import { Queue } from 'https://da.live/nx/public/utils/tree.js';
import { DA_ORIGIN } from './constants.js';
import RequestHandler from './request-handler.js';
import searchAndReplace from './search-replace.js';
import { isEditableFile } from './utils.js';

class Promote {
  constructor({
    accessToken, org, repo, expName, promoteType, files, callback, color, signal,
  }) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.expName = expName;
    this.promoteType = promoteType;
    this.filesToPromote = files;
    this.callback = callback;
    this.color = color;
    this.signal = signal;
    this.requestHandler = new RequestHandler(accessToken, { signal });
    const destRepo = promoteType === 'graybox' ? repo.replace('-graybox', '') : repo.replace(`-fg-${color}`, '');
    this.srcSitePath = `/${org}/${repo}`;
    this.destSitePath = `/${org}/${destRepo}`;
  }

  async processFile(file) {
    if (this.signal?.aborted) return;
    try {
      const response = await this.requestHandler.daFetch(`${DA_ORIGIN}/source${file.path}`);
      if (response.ok) {
        let content = isEditableFile(file.ext) ? await response.text() : await response.blob();
        if (file.ext === 'html') {
          content = searchAndReplace({
            content,
            searchType: this.promoteType,
            org: this.org,
            repo: this.repo,
            expName: this.expName,
            color: this.color,
          });
        }
        let destFilePath = file.path.replace(this.srcSitePath, this.destSitePath);
        if (this.promoteType === 'graybox') {
          destFilePath = destFilePath.replace(`/${this.expName}`, '');
        }
        const status = await this.requestHandler.uploadContent(destFilePath, content, file.ext);
        this.callback(status);
      } else {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch : ${response.status} :: ${file.path}`);
        const status = { statusCode: response.status, filePath: file.path, errorMsg: 'Failed to fetch' };
        this.callback(status);
      }
    } catch (err) {
      if (err.name !== 'AbortError') throw err;
    }
  }

  async promoteFilesInBatches(filePaths) {
    const queue = new Queue((file) => this.processFile(file), 100);
    await Promise.allSettled(filePaths.map((file) => queue.push(file)));
  }

  async promoteFiles() {
    // eslint-disable-next-line no-console
    console.log(`Promoting files from ${this.srcSitePath} to ${this.destSitePath}`);
    await this.promoteFilesInBatches(this.filesToPromote);
  }
}

async function promoteFiles(options) {
  const promoter = new Promote(options);
  await promoter.promoteFiles();
}

export default promoteFiles;
