/* eslint-disable no-await-in-loop */
import { getMSALConfig, getReqOptions } from './msal.js';

const BODY_BASE = { '@microsoft.graph.conflictBehavior': 'replace' };

const { baseUri, site } = await getMSALConfig();

// async function downloadFile(downloadUrl) {
//   const response = await fetch(downloadUrl);
//   return response.blob();
// }

async function createFolder(parentId, name) {
  const body = { ...BODY_BASE, name, folder: {} };
  const options = getReqOptions({ method: 'POST', body });
  const resp = await fetch(`${site}/drive/items/${parentId}/children`, options);
  return resp.json();
}

async function getParent(path) {
  const destArr = path.split('/');
  destArr.pop();
  let parent;
  const reverseDest = [];
  while (!parent) {
    const item = await getItem(destArr.join('/'));
    if (item.error) {
      reverseDest.push(destArr.pop());
    } else {
      parent = item;
    }
  }
  if (reverseDest.length > 0) {
    while (reverseDest.length > 0) {
      parent = await createFolder(parent.id, reverseDest.pop());
    }
  }
  return { parentReference: { id: parent.id } };
}

async function getItem(path) {
  const fullpath = `${baseUri}${path}`;
  const options = getReqOptions();
  const resp = await fetch(fullpath, options);
  return resp.json();
}

async function renameFile(path, name, copy) {
  const destArr = path.split('/');
  destArr.pop();
  const destParent = destArr.join('/');
  const destCopy = await getItem(`${destParent}/${copy}`);

  const body = { ...BODY_BASE, name };
  const options = getReqOptions({ method: 'PATCH', body });
  const resp = await fetch(`${site}/drive/items/${destCopy.id}`, options);

  if (resp.status === 200) return destCopy;
  return { error: true };
}

function getFilename(path) {
  const name = path.split('/').pop();
  const file = name.includes('.json') ? name.replace('.json', '.xlsx') : `${name}.docx`;
  const split = file.split('.');
  return { name: file, copy: `${split[0]}-copy.${split[1]}` };
}

async function getItemTry(path) {
  return new Promise((resolve) => {
    let count = 1;
    const found = setInterval(async () => {
      const json = await getItem(path);
      count += 1;
      if (count > 10 || json.webPath) {
        clearInterval(found);
        resolve(json);
      }
    }, 100);
  });
}

/**
 *
 * Public functions below.
 *
 */

/**
 * Copy File - Copies any file. Will correctly create folders and handle conflicts.
 *
 * @param {String} sourcePath the source document path
 * @param {String} destPath the destination document path
 * @returns {Object} json an object describing the copied item
 */
export default async function copyFile(sourcePath, destPath) {
  const source = await getItem(`${sourcePath}.docx`);
  const dest = await getItem(`${destPath}.docx`);
  const { parentReference } = dest.error ? await getParent(destPath) : dest;

  if (source.id && parentReference) {
    const { name, copy } = getFilename(destPath);
    const body = { ...BODY_BASE, parentReference, name: dest.id ? copy : name };
    const options = getReqOptions({ method: 'POST', body });
    const resp = await fetch(`${site}/drive/items/${source.id}/copy`, options);
    if (resp.status === 202) {
      return dest.id ? renameFile(destPath, name, copy) : getItemTry(`${destPath}.docx`);
    }
    return resp.json();
  }
  return { status: 500 };
}
