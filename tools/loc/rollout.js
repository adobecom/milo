import parseMarkdown from './helix/parseMarkdown.bundle.js';
import { mdast2docx } from './helix/mdast2docx.bundle.js';

import {
  connect as connectToSP,
  copyFileAndUpdateMetadata,
  getFileMetadata,
  saveFileAndUpdateMetadata,
} from './sharepoint.js';
import {
  getUrlInfo,
  isExcel,
  loadingON,
  simulatePreview,
  stripExtension,
} from './utils.js';

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

// MWPW-135315: remove after franklin fix for bold issue
const getLeaf = (node, type, parent = null) => {
  if (node?.type === type || !node.children) return { parent, node };

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const leaf = getLeaf(node.children[i], type, node);
      if (leaf) return leaf;
    }
  }
  return {};
};

// MWPW-135315: remove after franklin fix for bold issue
const addBoldHeaders = (mdast) => {
  const tables = mdast.children.filter((child) => child.type === 'gridTable'); // gets all block
  const tableMap = tables.forEach((table) => {
    const { node, parent } = getLeaf(table, 'text'); // gets first text node i.e. header
    if (parent && parent.type !== 'strong') {
      const idx = parent.children.indexOf(node);
      parent.children[idx] = { type: 'strong', children: [node] };
    }
  });
  return tableMap;
};

const hashToContentMap = new Map();
function processMdast(nodes) {
  const arrayWithContentHash = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const blockName = getLeaf(node, 'text')?.node?.value;
    const hash = objectHash.sha1(node);
    if (blockName?.toLowerCase().startsWith('block-group-start')) {
      const groupArray = [];
      groupArray.push(node);
      for (let j = i + 1; j < nodes.length; j++) {
        const nextNode = nodes[j];
        const nextBlockName = getLeaf(nextNode, 'text')?.node?.value;
        i = j;
        if (!nextBlockName?.toLowerCase().startsWith('block-group-end')) {
          groupArray.push(nextNode);
        } else {
          nextNode.endNode = true;
          groupArray.push(nextNode);
          break;
        }
      }
      const hashOfGroupArray = objectHash.sha1(groupArray);
      arrayWithContentHash.push(hashOfGroupArray);
      hashToContentMap.set(hashOfGroupArray, groupArray);
    } else {
      arrayWithContentHash.push(hash);
      hashToContentMap.set(hash, node);
    }
  }
  return arrayWithContentHash;
}

function removeLabelForType(node, type) {
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === type && child.label) child.label = '';
      removeLabelForType(child, type);
    }
  }
}

async function getProcessedMdast(mdast) {
  removeLabelForType(mdast, 'image');
  const nodes = mdast.children || [];
  return processMdast(nodes);
}

async function getMdastFromMd(mdContent) {
  const state = { content: { data: mdContent }, log: '' };
  await parseMarkdown(state);
  return state.content.mdast;
}

async function getMd(path) {
  const mdPath = `${path}.md`;
  await simulatePreview(mdPath);
  const mdFile = await fetch(`${getUrlInfo().origin}${mdPath}`);
  return mdFile.text();
}

async function getMdast(path) {
  const mdContent = await getMd(path);
  return getMdastFromMd(mdContent);
}

function getMergedMdast(langstoreNowProcessedMdast, livecopyProcessedMdast) {
  const mergedMdast = { type: 'root', children: [] };
  let mergedProcessedMdast = [];

  function addTrackChangesInfo(author, action, root) {
    root.author = author;
    root.action = action;

    function addTrackChangesInfoToChildren(content) {
      if (content?.children) {
        const { children } = content;
        const typesToTrack = ['text', 'gtRow', 'image', 'html', 'paragraph', 'heading'];
        for (let i = 0; i < children.length; i += 1) {
          const child = children[i];
          if (typesToTrack.includes(child.type)) {
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

  function checkAndPush(mergedArr, content, type) {
    for (let i = 0; i < mergedArr.length; i++) {
      if (mergedArr[i].hashcode === content) {
        if (mergedArr[i].classType === '') {
          continue;
        }
        if (mergedArr[i].classType === 'deleted') {
          if (type === 'added') {
            const newArr = [...mergedArr.slice(0, i), ...mergedArr.slice(i + 1)];
            newArr.push({ hashcode: content, classType: '' });
            return newArr;
          }
          if (type === 'deleted') {
            mergedArr.push({ hashcode: content, classType: type });
            return mergedArr;
          }
        }
        if (mergedArr[i].classType === 'added') {
          if (type === 'added') {
            mergedArr.push({ hashcode: content, classType: type });
            return mergedArr;
          }
          if (type === 'deleted') {
            mergedArr[i].classType = '';
            return mergedArr;
          }
        }
      }
    }
    mergedArr.push({ hashcode: content, classType: type });
    return mergedArr;
  }

  // Iterate and insert content in mergedMdast as long as both arrays have content
  const length = Math.min(langstoreNowProcessedMdast.length, livecopyProcessedMdast.length);
  let index;
  for (index = 0; index < length; index += 1) {
    if (langstoreNowProcessedMdast[index] === livecopyProcessedMdast[index]) {
      mergedProcessedMdast = checkAndPush(mergedProcessedMdast, langstoreNowProcessedMdast[index], '');
    } else {
      mergedProcessedMdast = checkAndPush(mergedProcessedMdast, langstoreNowProcessedMdast[index], 'deleted');
      mergedProcessedMdast = checkAndPush(mergedProcessedMdast, livecopyProcessedMdast[index], 'added');
    }
  }

  // Insert the leftover content in langstore if any
  if (index < langstoreNowProcessedMdast.length) {
    for (; index < langstoreNowProcessedMdast.length; index += 1) {
      mergedProcessedMdast = checkAndPush(mergedProcessedMdast, langstoreNowProcessedMdast[index], 'deleted');
    }
  }

  // Insert the leftover content in livecopy if any
  if (index < livecopyProcessedMdast.length) {
    for (; index < livecopyProcessedMdast.length; index += 1) {
      mergedProcessedMdast = checkAndPush(mergedProcessedMdast, livecopyProcessedMdast[index], 'added');
    }
  }

  mergedProcessedMdast.map((elem) => {
    const content = hashToContentMap.get(elem.hashcode);
    // Creating new object of langstoreContent to avoid mutation of original object
    const newContent = JSON.parse(JSON.stringify(content));
    if (elem.classType === 'deleted') {
      if (Array.isArray(newContent)) {
        newContent.forEach((el) =>  {
          addTrackChangesInfo('Langstore Version', elem.classType, el);
          if (el.type === 'gridTable') {
            if (el.endNode) delete el.endNode;
            else el.group = true;
          }
        });
      }
      else 
        addTrackChangesInfo('Langstore Version', elem.classType, newContent);
    } else if (elem.classType === 'added') {
      if (Array.isArray(newContent)) {
        newContent.forEach((el) => {
          addTrackChangesInfo('Regional Version', elem.classType, el);
          if (el.type === 'gridTable') {
            if (el.endNode) delete el.endNode;
            else el.group = true;
          }
        });
      }
      else 
        addTrackChangesInfo('Regional Version', elem.classType, newContent);
    }
    if (Array.isArray(newContent))
      mergedMdast.children.push(...newContent);
    else
      mergedMdast.children.push(newContent);
  });
  return mergedMdast;
}

// If modified timestamp and rollout timestamp is less than 10seconds for livecopy, return true.
function noRegionalChanges(fileMetadata) {
  const lastModified = new Date(fileMetadata.Modified);
  const lastRollout = new Date(fileMetadata.Rollout);
  const diffBetweenRolloutAndModification = Math.abs(lastRollout - lastModified) / 1000;
  return diffBetweenRolloutAndModification < 10;
}

async function rollout(file, targetFolders, skipDocMerge = true) {
  // path to the doc that is being rolled out
  const filePath = file.path;
  await connectToSP();
  const filePathWithoutExtension = stripExtension(filePath);
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

  async function rolloutPerFolder(targetFolder) {
    // live copy path of where the file is getting rolled out to
    const livecopyFilePath = `${targetFolder}/${fileName}`;
    // holds the status of whether rollout was successful
    const status = { success: true, path: livecopyFilePath };

    function udpateErrorStatus(errorMessage) {
      status.success = false;
      status.errorMsg = errorMessage;
      loadingON(errorMessage);
    }

    try {
      loadingON(`Rollout to ${livecopyFilePath} started`);
      // gets the metadata info of the live copy file
      const fileMetadata = await getFileMetadata(livecopyFilePath);
      // does the live copy file exist?
      const isfileNotFound = fileMetadata?.status === 404;
      // get langstore file prev version value from the rolled out live copy file's RolloutVersion value.
      // the RolloutVersion basically gives which version of langstore file was previously rolled out
      const langstorePrevVersion = fileMetadata.RolloutVersion;
      // get RolloutStatus value - eg: 'Merged'
      const previouslyMerged = fileMetadata.RolloutStatus;

      // if regional file does not exist, just copy the langstore file to region
      if (isfileNotFound) {
        // just copy since regional document does not exist
        await copyFileAndUpdateMetadata(filePath, targetFolder);
        loadingON(`Rollout to ${livecopyFilePath} complete`);
        return status;
      }

      // copy/overwrite the langstore file to the region:
      // 1. if regional file exists but there are no changes in regional doc
      // AND
      // 2. if the doc at the regional was not previously merged
      if (isExcel(filePath) || skipDocMerge) {
        await saveFileAndUpdateMetadata(
          filePath,
          file.blob,
          livecopyFilePath,
        );
        loadingON(`Rollout to ${livecopyFilePath} complete`);
        return status;
      }

      // if regional file exists, kick-in the diff & merge process
      // get MDAST of the current langstore file that needs to be rolled out
      const langstoreNow = await getMdast(filePathWithoutExtension);
      // force block name to be bold in langstore doc mdast
      // MWPW-135315: remove after franklin adds a fix for the bold issue
      addBoldHeaders(langstoreNow);
      // get processed data Map for the current langstore file that needs to be rolled out
      const langstoreNowProcessedMdast = await getProcessedMdast(langstoreNow);

      const liveCopyPath = `${targetFolder}/${fileName}`;
      // get MDAST of the livecopy file
      const livecopy = await getMdast(liveCopyPath.substring(0, liveCopyPath.lastIndexOf('.')));
      // force block name to be bold in livecopy doc mdast
      // MWPW-135315: remove after franklin adds a fix for the bold issue
      addBoldHeaders(livecopy);
      // get processed data Map for the livecopy file
      const livecopyProcessedMdast = await getProcessedMdast(livecopy);
      // get merged mdast
      const livecopyMergedMdast = getMergedMdast(langstoreNowProcessedMdast, livecopyProcessedMdast);
      // save the merged livecopy file
      await persist(filePath, livecopyMergedMdast, livecopyFilePath);
      loadingON(`Rollout to ${livecopyFilePath} complete`);
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
