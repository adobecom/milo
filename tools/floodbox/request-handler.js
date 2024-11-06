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
      console.log('Unauthorized access. Please check your access token.');
      return resp.status;
    }
    return resp;
  }

  getFileType(type) {
    return SUPPORTED_FILES[type] || 'application/octet-stream';
  }

  getFileBlob(content, fileExt) {
    return isEditableFile(fileExt)
      ? new Blob([content], { type: this.getFileType(fileExt) })
      : content;
  }

  async createVersion(destinationFilePath) {
    const opts = {
      method: 'POST',
      body: JSON.stringify({ label: 'Auto created version by FloodBox App' }),
    };
    return await this.daFetch(
      `${DA_ORIGIN}/versionsource${destinationFilePath}`,
      opts
    );
  }

  async uploadFile(filePath, content, fileExt) {
    const fileBlob = this.getFileBlob(content, fileExt);
    const body = new FormData();
    body.set('data', fileBlob);
    const opts = { body, method: 'POST' };
    const path = `${DA_ORIGIN}/source${filePath}`;
    return await this.daFetch(path, opts);
  }

  async createVersionAndUpload(destinationFilePath, content, fileExt) {
    let resp = await this.createVersion(destinationFilePath);
    if (!resp.ok) {
      console.error(`Failed to create version for ${destinationFilePath} :: ${resp.status}`);
      return { statusCode: resp.status, filePath: destinationFilePath, errorMsg: 'Failed to create version' };
    }
    resp = await this.uploadFile(destinationFilePath, content, fileExt);
    if (!resp.ok) {
      console.error(`Failed to upload content for ${destinationFilePath} :: ${resp.status}`);
      return { statusCode: resp.status, filePath: destinationFilePath, errorMsg: 'Failed to upload file' };
    }
    return { statusCode: resp.status, destinationFilePath };
  }

  /**
   * Uploads the file to the destination path
   * @param {*} filePath Destination file path
   * @param {*} content File blob or text content
   * @param {*} fileExt File extension
   */
  async uploadContent(filePath, content, fileExt) {
    let status = {};
    if (isEditableFile(fileExt)) {
      status = await this.createVersionAndUpload(filePath, content, fileExt); 
    } else {
      status = await this.uploadFile(filePath, content, fileExt);      
    }
    return status;
  }
}

export default RequestHandler;
