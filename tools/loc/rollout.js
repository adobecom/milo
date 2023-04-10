import parseMarkdown from './helix/parseMarkdown.bundle.js';
import { mdast2docx } from './helix/mdast2docx.bundle.js';
import { docx2md } from './helix/docx2md.bundle.js';

import {
  connect as connectToSP,
  copyFileAndUpdateMetadata,
  getFileMetadata,
  getFileVersionInfo,
  getVersionOfFile,
  saveFileAndUpdateMetadata, updateFile,
} from './sharepoint.js';
import { getUrlInfo, loadingON, simulatePreview, stripExtension } from './utils.js';

const types = new Set();
const hashToContentMap = new Map();

function getBlockName(node) {
  if (node.type === 'gridTable') {
    let blockNameNode = node;
    try {
      while (blockNameNode.type !== 'text' && blockNameNode?.children.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        blockNameNode = blockNameNode.children[0];
      }
      const fullyQualifiedBlockName = blockNameNode.value;
      if (fullyQualifiedBlockName) {
        const blockClass = fullyQualifiedBlockName.indexOf('(');
        let blockName = fullyQualifiedBlockName;
        if (blockClass !== -1) {
          blockName = fullyQualifiedBlockName.substring(0, blockClass).trim();
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
  let structure = '';
  nodes.forEach((node) => {
    const nodeType = getNodeType(node);
    types.add(nodeType);
    structure = `${structure}-${nodeType}`;
    const hash = objectHash.sha1(node);
    arrayWithTypeAndHash.push({ type: nodeType, hash });
    hashToIndex.set(hash, index);
    hashToContentMap.set(hash, node);
    index += 1;
  });
  return { hashToIndex, arrayWithTypeAndHash, structure };
}

async function getMd(path) {
  const mdPath = `${path}.md`;
  await simulatePreview(mdPath);
  const mdFile = await fetch(`${getUrlInfo().origin}${mdPath}`);
  return mdFile.text();
}

function getMdastFromMd(mdContent) {
  const state = { content: { data: mdContent }, log: '' };
  parseMarkdown(state);
  return state.content.mdast;
}

async function getMdast(path) {
  const mdContent = await getMd(path);
  return getMdastFromMd(mdContent);
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

async function persistDoc(srcPath, docx, dstPath) {
  try {
    await saveFileAndUpdateMetadata(srcPath, docx, dstPath, { RolloutStatus: 'Merged' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to save file', error);
  }
}

async function persist(srcPath, mdast, dstPath) {
  try {
    const docx = await mdast2docx(mdast);
    await persistDoc(srcPath, docx, dstPath);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to save file', error);
  }
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
  for (let leftPointer = 0; leftPointer <= leftLimit; leftPointer += 1) {
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
  for (let pointer = 0; pointer <= rightLimit; pointer += 1) {
    const rightElement = rightArray[pointer];
    if (!changesMap.has(rightElement.hash) && !editSet.has(rightElement.hash)) {
      changesMap.set(rightElement.hash, { op: 'added' });
    }
  }
  return changesMap;
}

function updateMergedMdast(mergedMdast, node, author) {
  const hash = node.opInfo.op === 'edited' ? node.opInfo.newHash : node.hash;
  const content = hashToContentMap.get(hash);
  if (node.opInfo.op !== 'edited' && node.opInfo.op !== 'nochange') {
    content.author = `${author} ${node.opInfo.op}`;
    content.action = node.opInfo.op;
  }
  mergedMdast.children.push(content);
}

function getMergedMdast(left, right) {
  const mergedMdast = { type: 'root', children: [] };
  let leftPointer = 0;
  const leftArray = Array.from(left.entries());

  function addTrackChangesInfo(author, action, root) {
    root.author = author;
    root.action = action;

    function addTrackChangesInfoToChildren(content) {
      if (content?.children) {
        const { children } = content;
        for (let i = 0; i < children.length; i += 1) {
          const child = children[i];
          if (child.type === 'text' || child.type === 'gtRow') {
            child.author = author;
            child.action = action;
          }
          if (child.type !== 'text') {
            addTrackChangesInfoToChildren(child);
          }
        }
      }
    }
    addTrackChangesInfoToChildren(root);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [rightHash, rightOpInfo] of right) {
    if (left.has(rightHash)) {
      for (leftPointer; leftPointer < leftArray.length; leftPointer += 1) {
        const leftArrayElement = leftArray[leftPointer];
        const leftHash = leftArrayElement[0];
        const leftOpInfo = leftArrayElement[1];
        if (leftHash === rightHash) {
          const leftContent = hashToContentMap.get(leftOpInfo.op === 'edited' ? leftOpInfo.newHash : leftHash);
          if (rightOpInfo.op === 'nochange') {
            mergedMdast.children.push(leftContent);
          } else if (rightOpInfo.op === 'edited') {
            addTrackChangesInfo('Langstore Version', 'deleted', leftContent);
            mergedMdast.children.push(leftContent);
            const rightContent = hashToContentMap.get(rightOpInfo.newHash);
            addTrackChangesInfo('Regional Version', 'edited', rightContent);
            mergedMdast.children.push(rightContent);
          }
          leftPointer += 1;
          break;
        } else {
          updateMergedMdast(mergedMdast, { hash: leftHash, opInfo: leftOpInfo }, 'Langstore');
        }
      }
    } else {
      updateMergedMdast(mergedMdast, { hash: rightHash, opInfo: rightOpInfo }, 'Region');
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
        'Langstore',
      );
    }
  }
  return mergedMdast;
}

function noRegionalChanges(fileMetadata) {
  const lastModified = new Date(fileMetadata.Modified);
  const lastRollout = new Date(fileMetadata.Rollout);
  const diffBetweenRolloutAndModification = Math.abs(lastRollout - lastModified) / 1000;
  return diffBetweenRolloutAndModification < 10;
}

async function safeGetVersionOfFile(filePath, version) {
  let versionFile;
  try {
    versionFile = await getVersionOfFile(filePath, version);
  } catch (error) {
    // Do nothing
  }
  return versionFile;
}

async function rollout(file, targetFolders, skipMerge = false) {
  const filePath = file.path;
  await connectToSP();
  const filePathWithoutExtension = stripExtension(filePath);
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

  async function rolloutPerFolder(targetFolder) {
    let langstorePrevMd;
    const livecopyFilePath = `${targetFolder}/${fileName}`;
    const status = { success: true, path: livecopyFilePath };

    function udpateErrorStatus(errorMessage) {
      status.success = false;
      status.errorMsg = errorMessage;
      loadingON(errorMessage);
    }

    try {
      loadingON(`Rollout to ${livecopyFilePath} started`);
      const fileMetadata = await getFileMetadata(livecopyFilePath);
      const isfileNotFound = fileMetadata?.status === 404;
      const langstorePrevVersion = fileMetadata.RolloutVersion;
      const previouslyMerged = fileMetadata.RolloutStatus;
      const langstoreCurrentVersion = await getFileVersionInfo(filePath);
      if (isfileNotFound) {
        // just copy since regional document does not exist
        await copyFileAndUpdateMetadata(filePath, targetFolder);
        loadingON(`Rollout to ${livecopyFilePath} complete`);
        return status;
      }
      if (skipMerge || (noRegionalChanges(fileMetadata) && !previouslyMerged)) {
        await saveFileAndUpdateMetadata(
          filePath,
          file.blob,
          livecopyFilePath,
        );
        loadingON(`Rollout to ${livecopyFilePath} complete`);
        return status;
      }
      if (!langstorePrevVersion) {
        // Cannot merge since we don't have rollout version info.
        // eslint-disable-next-line no-console
        loadingON(`Cannot rollout to ${livecopyFilePath} since last rollout version info is unavailable`);
      } else if (langstoreCurrentVersion === langstorePrevVersion) {
        langstorePrevMd = await getMd(filePathWithoutExtension);
      } else {
        const langstoreBaseFile = await safeGetVersionOfFile(filePath, langstorePrevVersion);
        if (langstoreBaseFile) {
          langstorePrevMd = await docx2md(langstoreBaseFile, { gridtables: true });
        }
      }
      if (langstorePrevMd != null) {
        const langstorePrev = await getMdastFromMd(langstorePrevMd);
        const langstoreBaseProcessed = await getProcessedMdast(langstorePrev);
        const langstoreNow = await getMdast(filePathWithoutExtension);
        const langstoreNowProcessed = await getProcessedMdast(langstoreNow);
        const liveCopyPath = `${targetFolder}/${fileName}`;
        if (langstoreBaseProcessed.structure !== langstoreNowProcessed.structure) {
          await updateFile(liveCopyPath, null, { RolloutStatus: 'Skipped' });
          return status;
        }
        const livecopy = await getMdast(liveCopyPath.substring(0, liveCopyPath.lastIndexOf('.')));
        const livecopyProcessed = await getProcessedMdast(livecopy);
        if (langstoreBaseProcessed.structure !== livecopyProcessed.structure) {
          await updateFile(liveCopyPath, null, { RolloutStatus: 'Skipped' });
          return status;
        }
        const langstoreBaseToNowChanges = getChanges(langstoreBaseProcessed, langstoreNowProcessed);
        const langstoreBaseToRegionChanges = getChanges(langstoreBaseProcessed, livecopyProcessed);
        const livecopyMergedMdast = getMergedMdast(
          langstoreBaseToNowChanges,
          langstoreBaseToRegionChanges,
        );
        await persist(filePath, livecopyMergedMdast, livecopyFilePath);
        loadingON(`Rollout to ${livecopyFilePath} complete`);
      } else {
        udpateErrorStatus(`Rollout to ${livecopyFilePath} did not succeed. Missing langstore file`);
      }
    } catch (error) {
      udpateErrorStatus(`Rollout to ${livecopyFilePath} did not succeed. Error ${error.message}`);
    }
    return status;
  }

  const rolloutStatuses = await Promise.all(
    targetFolders.map((targetFolder) => rolloutPerFolder(targetFolder)),
  );
  return rolloutStatuses
    .filter(({ success }) => !success)
    .map(({ path }) => path);
}

export default rollout;
