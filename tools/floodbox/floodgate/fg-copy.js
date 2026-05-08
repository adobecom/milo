/* eslint-disable import/no-unresolved */
import { Queue } from 'https://da.live/nx/public/utils/tree.js';
import { DA_ORIGIN } from '../constants.js';
import RequestHandler from '../request-handler.js';
import { getFileExtension, getFileName, isEditableFile } from '../utils.js';

class FloodgateCopy {
  constructor({
    accessToken,
    org,
    repo,
    paths,
    callback,
    fgColor,
    signal,
  }) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.paths = paths;
    this.callback = callback;
    this.signal = signal;

    this.requestHandler = new RequestHandler(accessToken, { signal });
    this.destRepo = `${repo}-fg-${fgColor}`;
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
    if (this.signal?.aborted) return;
    try {
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
    } catch (err) {
      if (err.name !== 'AbortError') throw err;
    }
  }

  async copyFilesInBatches() {
    const queue = new Queue((file) => this.processFile(file), 100);
    await Promise.allSettled(this.filesToCopy.map((file) => queue.push(file)));
  }

  async getFilesToCopy() {
    for (const path of this.paths) {
      if (path.length === 0) {
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

async function copyFiles(options) {
  const copier = new FloodgateCopy(options);
  await copier.copyFiles();
}

export default copyFiles;
