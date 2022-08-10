import parseMarkdown from './helix/parseMarkdown.bundle.js';
import { mdast2docx, sanitizeHtml } from './helix/mdast2docx.bundle.js';

import {
  connect as connectToSP,
  saveFileAndUpdateMetadata,
} from '../translation/sharepoint.js';

let types = new Set();
let hashToContentMap = new Map();
const MAX_RETRIES = 5;

function getParsedHtml(htmlString) {
  return new DOMParser().parseFromString(htmlString, 'text/html');
}

function getBlockName(node) {
  if (node.type === 'html') {
    try {
      const html = getParsedHtml(node.value);
      const block = html.getElementsByTagName('table')[0];
      if (block) {
        const fullyQualifiedBlockName = block.getElementsByTagName('tr')[0].textContent;
        const blockClass = fullyQualifiedBlockName.indexOf('(');
        let blockName = fullyQualifiedBlockName;
        if (blockClass !== -1) {
          blockName = fullyQualifiedBlockName.substring(0, fullyQualifiedBlockName.indexOf('(')).trim();
        }
        return blockName.toLowerCase().trim();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Unable to get component name', error);
    }
  }
  return undefined;
}

function getNodeType(node) {
  return getBlockName(node) || node.type;
}

function processMdast(nodes) {
  const hashToIndex = new Map();
  const arrayWithTypeAndHash = [];
  let index = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const node of nodes) {
    const nodeType = getNodeType(node);
    types.add(nodeType);
    const hash = objectHash.sha1(node);
    arrayWithTypeAndHash.push({ type: nodeType, hash });
    hashToIndex.set(hash, index);
    hashToContentMap.set(hash, node);
    index += 1;
  }
  return { hashToIndex, arrayWithTypeAndHash };
}

// TODO - This will later be replaced with actual reading of the docx version and conversion to md
async function simulatePreview(mdPath, retryAttempt = 1) {
  const previewUrl = `https://admin.hlx3.page/preview/adobecom/milo/diffpoc${mdPath}`;
  const response = await fetch(
    `${previewUrl}`,
    { method: 'POST' },
  );
  if (!response.ok && retryAttempt <= MAX_RETRIES) {
    await simulatePreview(`${previewUrl}`, retryAttempt + 1);
  }
}

async function getMd(path) {
  const mdPath = `${path}.md`;
  await simulatePreview(mdPath);
  const mdFile = await fetch(mdPath);
  return mdFile.text();
}

async function getMdast(path) {
  const mdContent = await getMd(path);
  const state = { content: { data: mdContent }, log: '' };
  parseMarkdown(state);
  return state.content.mdast;
}

// eslint-disable-next-line no-unused-vars
async function getProcessedMdastFromPath(path) {
  let mdast = await getMdast(path);
  mdast = await sanitizeHtml(mdast);
  const nodes = mdast.children || [];
  return processMdast(nodes);
}

async function getProcessedMdast(mdast) {
  const mdastWithBlocks = await sanitizeHtml(mdast);
  const nodes = mdastWithBlocks.children || [];
  return processMdast(nodes);
}

function display(id, toBeDisplayed) {
  function replacer(key, value) {
    if (value instanceof Map) {
      return { value: Array.from(value.entries()) }; // or with spread: value: [...value]
    }
    return value;
  }

  const container = document.getElementById(id);
  container.innerText = JSON.stringify(toBeDisplayed, replacer, 2);
}

// eslint-disable-next-line no-unused-vars
async function persist(srcPath, mdast, dstPath) {
  try {
    const docx = await mdast2docx(mdast);
    await connectToSP(async () => {
      await saveFileAndUpdateMetadata(srcPath, docx, dstPath);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to save file', error);
  }
}

// eslint-disable-next-line no-unused-vars
function notPresentInChangesMap(elements, changesMap) {
  let notPresentInChanges = true;
  elements.forEach((element) => {
    notPresentInChanges = !changesMap.has(element.hash) && notPresentInChangesMap;
  });
  return notPresentInChanges;
}

function updateChangesMap(changesMap, key, value) {
  if (!changesMap.has(key)) {
    changesMap.set(key, value);
  }
}

function getChanges(left, right) {
  const leftArray = left.arrayWithTypeAndHash;
  const leftHashToIndex = left.hashToIndex;
  const rightArray = right.arrayWithTypeAndHash;
  const rightHashToIndex = right.hashToIndex;
  const leftLimit = leftArray.length - 1;
  const rightLimit = rightArray.length - 1;
  const changesMap = new Map();
  const editSet = new Set();
  let rightPointer = 0;
  // eslint-disable-next-line no-plusplus
  for (let leftPointer = 0; leftPointer <= leftLimit; leftPointer++) {
    const leftElement = leftArray[leftPointer];
    if (leftPointer <= rightLimit) {
      rightPointer = leftPointer;
      const rightElement = rightArray[rightPointer];
      if (leftElement.hash === rightElement.hash) {
        updateChangesMap(changesMap, leftElement.hash, { op: 'nochange' });
      } else if (rightHashToIndex.has(leftElement.hash)) {
        updateChangesMap(changesMap, rightElement.hash, { op: 'added' });
      } else if (leftHashToIndex.has(rightElement.hash)) {
        updateChangesMap(changesMap, leftElement.hash, { op: 'deleted' });
        updateChangesMap(changesMap, rightElement.hash, { op: 'added' });
      } else if (leftElement.type === rightElement.type) {
        updateChangesMap(changesMap, leftElement.hash, { op: 'edited', newHash: rightElement.hash });
        editSet.add(rightElement.hash);
      } else {
        updateChangesMap(changesMap, leftElement.hash, { op: 'deleted' });
        updateChangesMap(changesMap, rightElement.hash, { op: 'added' });
      }
    } else {
      updateChangesMap(changesMap, leftElement.hash, { op: 'deleted' });
    }
  }
  // eslint-disable-next-line no-plusplus
  for (let pointer = 0; pointer <= rightLimit; pointer++) {
    const rightElement = rightArray[pointer];
    if (!changesMap.has(rightElement.hash) && !editSet.has(rightElement.hash)) {
      changesMap.set(rightElement.hash, { op: 'added' });
    }
  }
  return changesMap;
}

function reset() {
  types = new Set();
  hashToContentMap = new Map();
}

function updateMergedMdast(mergedMdast, node, author) {
  const hash = node.opInfo.op === 'edited' ? node.opInfo.newHash : node.hash;
  const content = hashToContentMap.get(hash);
  content.author = author;
  content.action = node.opInfo.op;
  mergedMdast.children.push(content);
}

function getMergedMdast(left, right) {
  const mergedMdast = { type: 'root', children: [] };
  let leftPointer = 0;
  const leftArray = Array.from(left.entries());
  // eslint-disable-next-line no-restricted-syntax
  for (const [rightHash, rightOpInfo] of right) {
    if (left.has(rightHash)) {
      // eslint-disable-next-line no-plusplus
      for (leftPointer; leftPointer < leftArray.length; leftPointer++) {
        const leftArrayElement = leftArray[leftPointer];
        const leftHash = leftArrayElement[0];
        const leftOpInfo = leftArrayElement[1];
        if (leftHash === rightHash) {
          let toAdd = { hash: leftHash, opInfo: leftOpInfo };
          let author = 'langmaster';
          if (rightOpInfo.op === 'nochange') {
            toAdd = { hash: rightHash, opInfo: rightOpInfo };
            author = 'region';
          }
          updateMergedMdast(mergedMdast, toAdd, author);
          leftPointer += 1;
          break;
        } else {
          updateMergedMdast(mergedMdast, { hash: leftHash, opInfo: leftOpInfo }, 'langmaster');
        }
      }
    } else {
      updateMergedMdast(mergedMdast, { hash: rightHash, opInfo: rightOpInfo }, 'region');
    }
  }
  // Check if there are excess elements in left array - if yes update them into the mergedMdast.
  if (leftPointer < leftArray.length) {
    // eslint-disable-next-line no-plusplus
    for (leftPointer; leftPointer < leftArray.length; leftPointer++) {
      const leftArrayElement = leftArray[leftPointer];
      updateMergedMdast(
        mergedMdast,
        { hash: leftArrayElement[0], opInfo: leftArrayElement[1] },
        'langmaster',
      );
    }
  }
  return mergedMdast;
}

async function process(folderPath) {
  reset();
  const langmasterBase = await getMdast(`${folderPath}/langmaster-base`);
  const langmasterBaseProcessed = await getProcessedMdast(langmasterBase);
  display('langmasterBase', langmasterBaseProcessed);
  const langmasterV1 = await getMdast(`${folderPath}/langmaster-v1`);
  const langmasterV1Processed = await getProcessedMdast(langmasterV1);
  display('langmasterV1', langmasterV1Processed);
  const langmasterBaseToV1Changes = getChanges(langmasterBaseProcessed, langmasterV1Processed);
  display('langmasterV1Diff', langmasterBaseToV1Changes);
  const regionV1 = await getMdast(`${folderPath}/region-v1`);
  const regionV1Processed = await getProcessedMdast(regionV1);
  display('regionV1', regionV1Processed);
  const langmasterBaseToRegionV1Changes = getChanges(langmasterBaseProcessed, regionV1Processed);
  display('regionV1Diff', langmasterBaseToRegionV1Changes);
  const regionV2Mdast = getMergedMdast(langmasterBaseToV1Changes, langmasterBaseToRegionV1Changes);
  display('regionV2', regionV2Mdast);
  await persist(`${folderPath}/Langmaster(Base).docx`, regionV2Mdast, `${folderPath}/Region(V2).docx`);
}

async function init() {
  document.getElementById('merge').addEventListener('submit', (e) => {
    e.preventDefault();
    const folderPath = document.getElementById('folderPath').value;
    process(folderPath);
  });
}

export default init;
