import { DA_ORIGIN } from '../constants.js';
import RequestHandler from '../request-handler.js';
import { getFileExtension, getFileName, isEditableFile } from '../utils.js';

const BATCH_SIZE = 100;

class FloodgateCopy {
  constructor(accessToken, org, repo, paths, callback) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.paths = paths;
    this.callback = callback;

    this.requestHandler = new RequestHandler(accessToken);
    this.destRepo = `${repo}-pink`;
    this.srcSitePath = `/${org}/${repo}`;
    this.destSitePath = `/${org}/${this.destRepo}`;
    this.filesToCopy = [];
  }

  adjustUrlDomains(content) {
    const searchValue = `--${this.repo}--${this.org}.`;
    const replaceValue = `--${this.destRepo}--${this.org}.`;
    return content.replaceAll(searchValue, replaceValue);
  }

  async processFile(file) {
    const response = await this.requestHandler.daFetch(`${DA_ORIGIN}/source${file.path}`);
    if (response.ok) {
      let content = isEditableFile(file.ext) ? await response.text() : await response.blob();
      if (file.ext === 'html') {
        content = this.adjustUrlDomains(content);
      }
      const destFilePath = file.path.replace(this.srcSitePath, this.destSitePath);
      const status = await this.requestHandler.uploadContent(destFilePath, content, file.ext);
      this.callback(status);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch : ${response.status} :: ${file.path}`);
      const status = { statusCode: response.status, filePath: file.path, errorMsg: 'Failed to fetch' };
      this.callback(status);
    }
  }

  async copyFilesInBatches() {
    for (let i = 0; i < this.filesToCopy.length; i += BATCH_SIZE) {
      const batch = this.filesToCopy.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((file) => this.processFile(file)));
    }
  }

  async getFilesToCopy() {
    for (const path of this.paths) {
      if (!path.length > 0) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const ext = getFileExtension(path);
      const name = path.split('/').pop();
      if (ext) {
        this.filesToCopy.push({ path, name, ext });
      } else {
        this.filesToCopy.push({ path: `${path}.html`, name: getFileName(path), ext: 'html' });
      }
    }
  }

  async copyFiles() {
    await this.getFilesToCopy();
    // eslint-disable-next-line no-console
    console.log(`Copying files from ${this.srcSitePath} to ${this.destSitePath}`);
    await this.copyFilesInBatches();
  }
}

async function copyFiles({ accessToken, org, repo, paths, callback }) {
  const copier = new FloodgateCopy(accessToken, org, repo, paths, callback);
  await copier.copyFiles();
}

export default copyFiles;
