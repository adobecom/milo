import parseMarkdown from './helix/parseMarkdown.bundle.js';
import mdast2docx from './helix/mdast2docx.bundle.js';
import {
  connect as connectToSP,
  saveFile,
} from '../translation/sharepoint.js';

const types = new Set();
const hashToContentMap = new Map();

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

async function getMd(path) {
  const mdPath = `${path}.md`;
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
  const mdast = await getMdast(path);
  const nodes = mdast.children || [];
  return processMdast(nodes);
}

async function getProcessedMdast(mdast) {
  const nodes = mdast.children || [];
  return processMdast(nodes);
}

function display(id, toBeDisplayed) {
  function replacer(key, value) {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    }
    return value;
  }

  const container = document.getElementById(id);
  container.innerText = JSON.stringify(toBeDisplayed, replacer, 2);
}

// eslint-disable-next-line no-unused-vars
async function persist(mdast, path = '/drafts/bhagwath/ValidateMD2AutoSavedV3.docx') {
  const docx = await mdast2docx(mdast);
  await connectToSP(async () => {
    await saveFile(docx, path);
  });
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

async function init() {
  const langmasterBase = await getMdast('/drafts/bhagwath/diffpoc/case4/langmaster-base');
  const langmasterBaseProcessed = await getProcessedMdast(langmasterBase);
  display('langmasterBase', langmasterBaseProcessed);
  const langmasterV1 = await getMdast('/drafts/bhagwath/diffpoc/case4/langmaster-v1');
  const langmasterV1Processed = await getProcessedMdast(langmasterV1);
  display('langmasterV1', langmasterV1Processed);
  const langmasterBaseToV1Changes = getChanges(langmasterBaseProcessed, langmasterV1Processed);
  display('langmasterV1Diff', langmasterBaseToV1Changes);
  const regionV1 = await getMdast('/drafts/bhagwath/diffpoc/case4/region-v1');
  const regionV1Processed = await getProcessedMdast(regionV1);
  display('regionV1', regionV1Processed);
  const langmasterBaseToRegionV1Changes = getChanges(langmasterBaseProcessed, regionV1Processed);
  display('regionV1Diff', langmasterBaseToRegionV1Changes);
}

export default init;
