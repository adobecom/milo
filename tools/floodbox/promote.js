import { DA_ORIGIN } from './constants.js';
import RequestHandler from './request-handler.js';
import searchAndReplace from './search-replace.js';
import { isEditableFile } from './utils.js';

const BATCH_SIZE = 100;

class Promote {
  constructor(accessToken, org, repo, expName, promoteType, files, callback) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.expName = expName;
    this.promoteType = promoteType;
    this.filesToPromote = files;
    this.callback = callback;

    this.requestHandler = new RequestHandler(accessToken);
    const destRepo = promoteType === 'graybox' ? repo.replace('-graybox', '') : repo.replace('-pink', '');
    this.srcSitePath = `/${org}/${repo}`;
    this.destSitePath = `/${org}/${destRepo}`;
  }

  async processFile(file) {
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
  }

  async promoteFilesInBatches(filePaths) {
    for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
      const batch = filePaths.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((file) => this.processFile(file)));
    }
  }

  async promoteFiles() {
    // eslint-disable-next-line no-console
    console.log(`Promoting files from ${this.srcSitePath} to ${this.destSitePath}`);
    await this.promoteFilesInBatches(this.filesToPromote);
  }
}

async function promoteFiles({
  accessToken, org, repo, expName, promoteType, files, callback,
}) {
  const promoter = new Promote(accessToken, org, repo, expName, promoteType, files, callback);
  await promoter.promoteFiles();
}

export default promoteFiles;
