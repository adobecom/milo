import parseMarkdown from './helix/parseMarkdown.bundle.js';
import mdast2docx from './helix/mdast2docx.bundle.js';
import {
  connect as connectToSP,
  saveFile,
} from '../translation/sharepoint.js';

const MAX_RETRIES = 5;
const types = new Set();

async function fetchFile(url, retryAttempt) {
  const response = await fetch(url);
  if (!response.ok && retryAttempt <= MAX_RETRIES) {
    await fetchFile(url, retryAttempt + 1);
  }
  return response;
}

function getMdastWithHashes(nodes) {
  const mdastwithHashes = {};
  const mdastwithHashAsKey = {};
  const mdastPositionKeyWithIndex = {};
  const mdastwithPositionAsKey = {};
  const positionKeysByType = {};
  const nodeTypeWithIndex = {};
  const mdastArray = [];
  let sectionIndex = 1;
  // eslint-disable-next-line no-restricted-syntax
  let positionIndex = 0;
  for (const node of nodes) {
    const nodeType = node.type;
    types.add(nodeType);
    const baseKey = `section${sectionIndex}${nodeType}`;
    let key = baseKey;
    const typeIndex = nodeTypeWithIndex[key];
    if (nodeType === 'thematicBreak') {
      sectionIndex += 1;
    } else {
      if (typeIndex) {
        const index = typeIndex + 1;
        nodeTypeWithIndex[key] = index;
        key += index;
      } else {
        nodeTypeWithIndex[key] = 1;
        key += 1;
      }
      const hash = objectHash.sha1(node);
      mdastwithPositionAsKey[key] = hash;
      mdastwithHashAsKey[hash] = key;
      mdastPositionKeyWithIndex[key] = positionIndex;
      mdastArray.push(key);
      const existingKeysByType = positionKeysByType[baseKey];
      if (existingKeysByType) {
        existingKeysByType.push(key);
        positionKeysByType[baseKey] = existingKeysByType;
      } else {
        positionKeysByType[baseKey] = [key];
      }
      positionIndex += 1;
    }
  }
  mdastwithHashes.mdastwithPositionAsKey = mdastwithPositionAsKey;
  mdastwithHashes.mdastwithHashAsKey = mdastwithHashAsKey;
  mdastwithHashes.positionKeysByType = positionKeysByType;
  mdastwithHashes.mdastPositionKeyWithIndex = mdastPositionKeyWithIndex;
  mdastwithHashes.mdastArray = mdastArray;
  return mdastwithHashes;
}

async function getMd(path) {
  const mdPath = `${path}.md`;
  const mdFile = await fetchFile(mdPath, 1);
  // eslint-disable-next-line no-return-await
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
  return getMdastWithHashes(nodes);
}

async function getProcessedMdast(mdast) {
  const nodes = mdast.children || [];
  return getMdastWithHashes(nodes);
}

function display(id, value) {
  const container = document.getElementById(id);
  container.innerText = JSON.stringify(value, undefined, 2);
  if (id !== 'changeList' && id !== 'changeList1' /*&& id !== 'mdast3'*/) {
    container.style.display = 'none';
  }
}

// eslint-disable-next-line no-unused-vars
async function persist(mdast, path = '/drafts/bhagwath/ValidateMD2AutoSavedV3.docx') {
  const docx = await mdast2docx(mdast);
  await connectToSP(async () => {
    await saveFile(docx, path);
  });
}

function splitToTypeAndIndex(typeWithIndex) {
  let currentType = '';
  const typeAndIndex = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const type of types) {
    if (typeWithIndex.includes(type)) {
      currentType = type;
      break;
    }
  }
  const computedIndexOfType = typeWithIndex.indexOf(currentType) + currentType.length;
  const type = typeWithIndex.substring(0, computedIndexOfType);
  const index = typeWithIndex.substring(computedIndexOfType);
  typeAndIndex.type = type;
  typeAndIndex.index = parseInt(index, 10);
  typeAndIndex.fullyQualified = typeWithIndex;
  return typeAndIndex;
}

function cleanUpEquivalents(typeKeys, typeAndIndexOfDeletedOrInsertedKey, changeList, adjustment) {
  let typeFound = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const typeKey of typeKeys) {
    if (typeAndIndexOfDeletedOrInsertedKey.fullyQualified === typeKey) {
      typeFound = true;
    }
    if (typeFound) {
      const typeAndIndexOfMdast1PositionKey = splitToTypeAndIndex(typeKey);
      const mdast2PositionKey = changeList[typeKey];
      if (typeof mdast2PositionKey === 'string') {
        const typeAndIndexOfMdast2PositionKey = splitToTypeAndIndex(mdast2PositionKey);
        const equiIndex = typeAndIndexOfMdast2PositionKey.index + adjustment;
        const pseudoMdast2PositionKeyWrtOp = typeAndIndexOfMdast2PositionKey.type
          + equiIndex;
        if (pseudoMdast2PositionKeyWrtOp === typeAndIndexOfMdast1PositionKey.fullyQualified) {
          delete changeList[typeKey];
        }
      }
    }
  }
}

function getChangeList(mdast1withHashes, mdast2withHashes) {
  const mdast1withPositionAsKey = mdast1withHashes.mdastwithPositionAsKey;
  const mdast2PositionKeyWithIndex = mdast2withHashes.mdastPositionKeyWithIndex;
  const mdast2Array = mdast2withHashes.mdastArray;
  const mdast2withPositionAsKeyTracker = structuredClone(mdast2withHashes.mdastwithPositionAsKey);
  const mdast2withHashAsKey = mdast2withHashes.mdastwithHashAsKey;
  const mdast1PositionKeysByType = mdast1withHashes.positionKeysByType;
  const changeList = {};
  const deletedSet = new Set();
  const insertedSet = new Set();
  // First Pass - compare values - if not present deleted
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(mdast1withPositionAsKey)) {
    const positionInMdast2 = mdast2withHashAsKey[value];
    if (positionInMdast2) {
      changeList[key] = positionInMdast2;
      delete mdast2withPositionAsKeyTracker[positionInMdast2];
    } else {
      changeList[key] = 'deleted';
      deletedSet.add(key);
    }
  }
  display('changeListFirstPass', changeList);
  // Second Pass - check remaining in mdast2 and mark as replace if appropriate
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(mdast2withPositionAsKeyTracker)) {
    if (changeList[key]
      && changeList[key] === 'deleted') {
      const replaceObject = {};
      replaceObject.op = 'replace';
      replaceObject.positionInNewDoc = key;
      replaceObject.newContentHash = value;
      replaceObject.hash = mdast1withPositionAsKey[key];
      changeList[key] = replaceObject;
      delete mdast2withPositionAsKeyTracker[key];
      deletedSet.delete(key);
    }
  }
  display('changeListSecondPass', changeList);
  // Third Pass for inserts
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(mdast2withPositionAsKeyTracker)) {
    const index = mdast2PositionKeyWithIndex[key];
    const insertObject = {};
    insertObject.newContentPosition = key;
    insertObject.newContentHash = value;
    insertObject.op = 'insert';
    if (index === 0) {
      insertObject.before = mdast2Array[index + 1];
    } else if (index === mdast2Array.length - 1) {
      insertObject.after = mdast2Array[index - 1];
    } else {
      insertObject.before = mdast2Array[index + 1];
      insertObject.after = mdast2Array[index - 1];
    }
    if (insertObject.after) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [originalPos, newPos] of Object.entries(changeList)) {
        if (newPos === insertObject.after) {
          changeList[originalPos] = {
            op: 'insert::after',
            positionInNewDoc: newPos,
            insertKey: key,
            hash: mdast1withPositionAsKey[originalPos],
            insertHash: value,
          };
          insertedSet.add(key);
        }
      }
    } else if (insertObject.before) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [originalPos, newPos] of Object.entries(changeList)) {
        if (newPos === insertObject.before) {
          changeList[originalPos] = {
            op: 'insert::before',
            positionInNewDoc: newPos,
            insertKey: key,
            insertHash: value,
          };
        }
      }
    }
  }
  // Clean up after inserts
  // eslint-disable-next-line no-restricted-syntax
  for (const insertedKey of insertedSet) {
    const typeAndIndexOfInsertedKey = splitToTypeAndIndex(insertedKey);
    const typeKeys = mdast1PositionKeysByType[typeAndIndexOfInsertedKey.type];
    cleanUpEquivalents(typeKeys, typeAndIndexOfInsertedKey, changeList, -1);
  }
  // Third Pass - if `deleted` still exists reset indices and find pseudo equals
  // and skip them from change list
  // eslint-disable-next-line no-restricted-syntax
  for (const deletedKey of deletedSet) {
    const typeAndIndexOfDeletedKey = splitToTypeAndIndex(deletedKey);
    const typeKeys = mdast1PositionKeysByType[typeAndIndexOfDeletedKey.type];
    changeList[deletedKey] = {
      op: 'deleted',
      hash: mdast1withPositionAsKey[deletedKey],
    };
    // eslint-disable-next-line no-restricted-syntax
    cleanUpEquivalents(typeKeys, typeAndIndexOfDeletedKey, changeList, 1);
  }
  display('changeListThirdPass', changeList);
  // Fourth Pass - remove same position content.
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(changeList)) {
    if (key === value) {
      delete changeList[key];
    }
  }
  display('changeListFourthPass', changeList);
  // Fifth Pass - identify swaps.
  const toBeRemovedFromChangeList = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(changeList)) {
    const valuePresentAsKey = changeList[value];
    if (valuePresentAsKey && typeof valuePresentAsKey === 'string'
      && valuePresentAsKey !== 'deleted'
      && valuePresentAsKey === key) {
      const swapObject = {};
      swapObject.op = 'swap';
      swapObject.swapPosition = value;
      swapObject.hash = mdast1withPositionAsKey[key];
      swapObject.swapContentHash = mdast1withPositionAsKey[value];
      changeList[key] = swapObject;
      toBeRemovedFromChangeList.push(value);
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const toBeRemoved of toBeRemovedFromChangeList) {
    delete changeList[toBeRemoved];
  }
  display('changeListFifthPass', changeList);
  return changeList;
}

async function applyChanges(changeList, newLangmaster, currentRegion) {
  // const newLangmasterWithHashes = await getProcessedMdast(newLangmaster);
  const currentRegionWithHashes = await getProcessedMdast(currentRegion);
  const nodes = newLangmaster.children || [];
  const mdastWithChangesApplied = structuredClone(newLangmaster);
  mdastWithChangesApplied.children = [];
  const nodeTypeWithIndex = {};
  let sectionIndex = 1;
  // eslint-disable-next-line no-restricted-syntax
  let currentIndex = 0;
  const swapInfo = {};
  for (const node of nodes) {
    const nodeType = node.type;
    types.add(nodeType);
    const baseKey = `section${sectionIndex}${nodeType}`;
    let key = baseKey;
    const typeIndex = nodeTypeWithIndex[key];
    if (nodeType === 'thematicBreak') {
      sectionIndex += 1;
    } else if (typeIndex) {
      const index = typeIndex + 1;
      nodeTypeWithIndex[key] = index;
      key += index;
    } else {
      nodeTypeWithIndex[key] = 1;
      key += 1;
    }
    const changeInfo = changeList[key];
    if (changeInfo) {
      if (changeInfo.op === 'replace') {
        let index = currentRegionWithHashes.mdastPositionKeyWithIndex[changeInfo.positionInNewDoc];
        if (!changeInfo.positionInNewDoc.startsWith('section1')) {
          index += 1;
        }
        mdastWithChangesApplied.children[currentIndex] = currentRegion.children[index];
      } else if (changeInfo.op === 'deleted') {
        currentIndex -= 1;
      } else if (changeInfo.op === 'insert::after') {
        let index = currentRegionWithHashes.mdastPositionKeyWithIndex[changeInfo.insertKey];
        if (!changeInfo.positionInNewDoc.startsWith('section1')) {
          index += 1;
        }
        mdastWithChangesApplied.children[currentIndex] = node;
        currentIndex += 1;
        mdastWithChangesApplied.children[currentIndex] = currentRegion.children[index];
      } else if (changeInfo.op === 'swap') {
        let index = currentRegionWithHashes.mdastPositionKeyWithIndex[changeInfo.swapPosition];
        if (!changeInfo.swapPosition.startsWith('section1')) {
          index += 1;
        }
        mdastWithChangesApplied.children[currentIndex] = newLangmaster.children[index];
        swapInfo[changeInfo.swapPosition] = node;
      }
    } else if (swapInfo[key]) {
      mdastWithChangesApplied.children[currentIndex] = swapInfo[key];
    } else {
      mdastWithChangesApplied.children[currentIndex] = node;
    }
    currentIndex += 1;
  }
  // display('mdast3', mdastWithChangesApplied);
  // persist(mdastWithChangesApplied);
}

async function init() {
  const mdast1 = await getMdast('/drafts/bhagwath/validatemd');
  const mdast1withHashes = await getProcessedMdast(mdast1);
  const mdast2 = await getMdast('/drafts/bhagwath/validatemd1');
  const mdast2withHashes = await getProcessedMdast(mdast2);

  const mdast3 = await getMdast('/drafts/bhagwath/validatemd3');
  const changeList = getChangeList(mdast1withHashes, mdast2withHashes);
  applyChanges(changeList, mdast3, mdast2);
  display('changeList', changeList);
  // display('changeList1', getChangeList(mdast1withHashes, await getProcessedMdast(mdast3)));
  display('mdast1', mdast1withHashes);
  display('mdast2', mdast2withHashes);
  display('mdast3', await getProcessedMdast(mdast3));
}

export default init;
