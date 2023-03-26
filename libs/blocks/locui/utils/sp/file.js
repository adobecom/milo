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

async function renameFile(id, name) {
  const body = { ...BODY_BASE, name };
  const options = getReqOptions({ method: 'PATCH', body });
  return fetch(`${site}/drive/items/${id}`, options);
}

function getFilename(path) {
  const name = path.split('/').pop();
  const file = name.includes('.json') ? name.replace('.json', '.xlsx') : `${name}.docx`;
  const split = file.split('.');
  return { name: file, copy: `${split[0]}-copy.${split[1]}` };
}

async function getItem(path) {
  const fullpath = `${baseUri}${path}`;
  const options = getReqOptions();
  const resp = await fetch(fullpath, options);
  return resp.json();
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

export default async function copyFile(sourcePath, destPath) {
  const source = await getItem(`${sourcePath}.docx`);
  const dest = await getItem(`${destPath}.docx`);
  const { parentReference } = dest.error ? await getParent(destPath) : dest;

  if (source.id && parentReference) {
    const { name, copy } = getFilename(sourcePath);
    const body = { ...BODY_BASE, parentReference, name: dest.id ? copy : name };
    const options = getReqOptions({ method: 'POST', body });
    const resp = await fetch(`${site}/drive/items/${source.id}/copy`, options);
    if (resp.status === 202) {
      // Make a copy if destination file exists
      if (dest.id) {
        const destArr = destPath.split('/');
        destArr.pop();
        const destParent = destArr.join('/');
        const destCopy = await getItem(`${destParent}/${copy}`);
        const renameResp = await renameFile(destCopy.id, name);
        if (renameResp.status === 200) {
          return destCopy;
        }
      }
      // Return the details of the non copy item
      return getItemTry(`${destPath}.docx`);
    }
    return resp.json();
  }
  return { status: 500 };
}
