/* eslint-disable no-await-in-loop */
import { getMSALConfig, getReqOptions } from './msal.js';

const BODY_BASE = { '@microsoft.graph.conflictBehavior': 'replace' };

const { baseUri, site } = await getMSALConfig();

async function downloadFile(id) {
  const options = getReqOptions({ method: 'GET' });
  const resp = await fetch(`${site}/drive/items/${id}/content`, options);
  return resp.blob();
}

// async function createFolder(parentId, name) {
//   const body = { ...BODY_BASE, name, folder: {} };
//   const options = getReqOptions({ method: 'POST', body });
//   const resp = await fetch(`${site}/drive/items/${parentId}/children`, options);
//   return resp.json();
// }

async function getItem(path) {
  const newBase = baseUri.replace('milo', 'bacom');
  const fullpath = `${newBase}${path}`;
  const options = getReqOptions();
  const resp = await fetch(fullpath, options);
  const json = await resp.json();
  return json;
}

async function copyItem(id, parentReference, folder, name) {
  const body = { ...BODY_BASE, parentReference, name };
  const options = getReqOptions({ method: 'POST', body });
  const resp = await fetch(`${site}/drive/items/${id}/copy`, options);
  console.log(resp.headers.get('Location'));
  if (resp.status !== 202) return {};
  return getItem(`${folder}/${name}`);
}

async function moveFile(id, parentReference, name) {
  const body = { parentReference, name };
  const opts = getReqOptions({ body, method: 'PATCH' });
  opts.headers.append('Prefer', 'bypass-shared-lock');
  const resp = await fetch(`${site}/drive/items/${id}`, opts);
  const json = await resp.json();
  return json;
}

async function deleteFile({ path, item }) {
  const itemToDelete = item || await getItem(path);
  const opts = getReqOptions({ method: 'DELETE' });
  opts.headers.append('Prefer', 'bypass-shared-lock');
  const resp = await fetch(`${site}/drive/items/${itemToDelete.id}`, opts);
  return { ...itemToDelete, deleted: resp.status === 204 };
}

async function getUploadSession(folder, name, fileSize) {
  const path = `${folder}/${name}`;
  const body = { ...BODY_BASE, name, fileSize };
  const opts = getReqOptions({ body, method: 'POST' });
  const resp = await fetch(`${baseUri}${path}:/createUploadSession`, opts);
  return resp.json();
}

async function uploadFile(url, blob) {
  const opts = getReqOptions({ method: 'PUT' });
  opts.headers.append('Content-Length', blob.size);
  opts.headers.append('Content-Range', `bytes 0-${blob.size - 1}/${blob.size}`);
  opts.headers.append('Prefer', 'bypass-shared-lock');
  const resp = await fetch(url, { ...opts, body: blob });
  return resp.json();
}

async function breakLock(dest, destItem, size) {
  const { parentReference, id } = destItem;
  const copiedItem = await copyItem(id, parentReference, dest.folder, dest.lockName);
  await deleteFile({ item: destItem });
  await moveFile(copiedItem.id, parentReference, dest.name);
  return getUploadSession(dest.folder, dest.name, size);
}

/**
 * Attempt an upload.
 *
 * Work around SharePoint giving an upload URL even though a file is 423 locked.
 *
 * @param {Object} dest contains folder, name, and sync name
 * @param {Object} destItem the destination represented by SharePoint details
 * @param {String} uploadUrl the URL to upload to
 * @param {Blob} blob the blob to upload
 * @returns {Object} a SharePoint item representing the copied file.
 */
async function uploadAttempt(dest, destItem, uploadUrl, blob) {
  let count = 1;
  let uploadItem;
  let url = uploadUrl;
  while (!uploadItem || uploadItem.error || count > 2) {
    uploadItem = await uploadFile(url, blob);
    if (!uploadItem.error) break;
    count += 1;
    const session = await breakLock(dest, destItem, blob.size);
    url = session.uploadUrl;
  }
  return uploadItem;
}

function getDocDetails(path) {
  const parentArr = path.split('/');
  const name = parentArr.pop();
  const folder = parentArr.join('/');
  const split = name.split('.');
  return { folder, name, lockName: `${split[0]} (lock copy).${split[1]}` };
}

/**
 *
 * Public functions below.
 *
 */

/**
 * Copy File - Copies any file.
 *
 * @param {String} sourcePath the source document path
 * @param {String} destPath the destination document path
 * @returns {Object} json an object describing the copied item
 */
export async function copyFile(sourcePath, destPath) {
  console.log(site);
  const opts = getReqOptions({ method: 'GET' });
  const resp = await fetch(`${site}/drives`, opts);
  const json = await resp.json();
  console.log(json);

  const source = getDocDetails(sourcePath);
  const dest = getDocDetails(destPath);

  const sourceItem = await getItem(`${source.folder}/${source.name}`);
  const destItem = await getItem(`${dest.folder}/${dest.name}`);

  const blob = await downloadFile(sourceItem.id);
  const session = await getUploadSession(dest.folder, dest.name, blob.size);
  const { uploadUrl } = session.error ? await breakLock(dest, destItem, blob.size) : session;
  if (uploadUrl) return uploadAttempt(dest, destItem, uploadUrl, blob);
  return { error: { msg: 'Couldn\'t copy file. Contact Milo Community.' } };
}

async function listChildren(startUrl, options) {
  let path = startUrl;
  const items = [];
  const folders = [];
  while (path) {
    const resp = await fetch(path, options);
    const json = await resp.json();
    json.value.forEach((child) => {
      if (child.name.endsWith('.docx')) {
        const parent = child.parentReference.path.split('bacom').pop();
        console.log(`${parent}/${child.name.replace('.docx', '')}`);
        items.push(`${parent}/${child.name.replace('.docx', '')}`);
      } else {
        folders.push(child.id);
      }
    });
    path = json['@odata.nextLink'];
  }
  return { items, folders };
}

export async function listChildrenDocs(folder) {
  const sourceItem = await getItem(folder);
  const { id } = sourceItem;
  const options = getReqOptions({ method: 'GET' });
  const path = `${site}/drive/items/${id}/children`;
  const items = [];
  const folders = [];
  const children = await listChildren(path, options);
  items.push(...children.items);
  folders.push(...children.folders);
  while (folders.length > 0) {
    console.log(folders.length);
    const first = folders.shift();
    const { items: subItems, folders: subFolders } = await listChildren(`${site}/drive/items/${first}/children`, options);
    items.push(...subItems);
    folders.push(...subFolders);
  }
  console.log(items);
  console.log(folders);
}
