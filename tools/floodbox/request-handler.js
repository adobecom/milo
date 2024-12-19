import { DA_ORIGIN, SUPPORTED_FILES } from './constants.js';
import { isEditableFile } from './utils.js';

class RequestHandler {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async daFetch(url, opts = {}) {
    opts.headers ||= {};
    if (this.accessToken) {
      opts.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const resp = await fetch(url, opts);
    if (resp.status === 401) {
      // eslint-disable-next-line no-console
      console.log('Unauthorized access. Please check your access token.');
      return resp.status;
    }
    return resp;
  }

  /**
   * Uploads the file to the destination path
   * @param {*} filePath Destination file path
   * @param {*} content File blob or text content
   * @param {*} fileExt File extension
   */
  async uploadContent(filePath, content, fileExt) {
    let status;
    if (isEditableFile(fileExt)) {
      status = await this.#createVersionAndUpload(filePath, content, fileExt);
    } else {
      status = await this.#uploadFile(filePath, content, fileExt);
    }
    return status;
  }

  /**
   * Deletes the content at the specified path
   * @param filePath Path of the content to be deleted
   * @returns Object containing status code, file path and error message if any
   */
  async deleteContent(filePath) {
    const opts = { method: 'DELETE' };
    const resp = await this.daFetch(`${DA_ORIGIN}/source${filePath}`, opts);
    if (!resp.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete content for ${filePath} :: ${resp.status}`);
      return { statusCode: resp.status, filePath, errorMsg: 'Failed to delete file' };
    }
    return { statusCode: resp.status, filePath };
  }

  static #getFileType(type) {
    return SUPPORTED_FILES[type] || 'application/octet-stream';
  }

  static #getFileBlob(content, fileExt) {
    return isEditableFile(fileExt)
      ? new Blob([content], { type: RequestHandler.#getFileType(fileExt) })
      : content;
  }

  async #createVersion(destinationFilePath) {
    const opts = {
      method: 'POST',
      body: JSON.stringify({ label: 'Auto created version by FloodBox App' }),
    };
    return this.daFetch(
      `${DA_ORIGIN}/versionsource${destinationFilePath}`,
      opts,
    );
  }

  async #uploadFile(filePath, content, fileExt) {
    const fileBlob = RequestHandler.#getFileBlob(content, fileExt);
    const body = new FormData();
    body.set('data', fileBlob);
    const opts = { body, method: 'POST' };
    const path = `${DA_ORIGIN}/source${filePath}`;
    const resp = await this.daFetch(path, opts);
    if (!resp.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to upload content for ${filePath} :: ${resp.status}`);
      return { statusCode: resp.status, filePath, errorMsg: 'Failed to upload file' };
    }
    return { statusCode: resp.status, filePath };
  }

  async #createVersionAndUpload(destinationFilePath, content, fileExt) {
    const resp = await this.#createVersion(destinationFilePath);
    if (!resp.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to create version for ${destinationFilePath} :: ${resp.status}`);
      return { statusCode: resp.status, filePath: destinationFilePath, errorMsg: 'Failed to create version' };
    }
    return this.#uploadFile(destinationFilePath, content, fileExt);
  }
}

export default RequestHandler;
