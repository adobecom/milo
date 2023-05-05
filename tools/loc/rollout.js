import parseMarkdown from './helix/parseMarkdown.bundle.js';
import { mdast2docx } from './helix/mdast2docx.bundle.js';

import {
  connect as connectToSP,
  copyFileAndUpdateMetadata,
  getFileMetadata,
  saveFileAndUpdateMetadata,
} from './sharepoint.js';
import { getUrlInfo, loadingON, simulatePreview, stripExtension } from './utils.js';

const hashToContentMap = new Map();

function processMdast(nodes) {
  const arrayWithContentHash = [];
  nodes.forEach((node) => {
    const hash = objectHash.sha1(node);
    arrayWithContentHash.push(hash);
    hashToContentMap.set(hash, node);
  });
  return arrayWithContentHash;
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

function getMergedMdast(langstoreNowProcessedMdast, livecopyProcessedMdast) {
  const mergedMdast = { type: 'root', children: [] };

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

  // Iterate and insert content in mergedMdast as long as both arrays have content
  const length = Math.min(langstoreNowProcessedMdast.length, livecopyProcessedMdast.length);
  let index;
  for (index = 0; index < length; index += 1) {
    if (langstoreNowProcessedMdast[index] === livecopyProcessedMdast[index]) {
      const content = hashToContentMap.get(langstoreNowProcessedMdast[index]);
      mergedMdast.children.push(content);
    } else {
      const langstoreContent = hashToContentMap.get(langstoreNowProcessedMdast[index]);
      addTrackChangesInfo('Langstore Version', 'deleted', langstoreContent);
      mergedMdast.children.push(langstoreContent);
      const livecopyContent = hashToContentMap.get(livecopyProcessedMdast[index]);
      addTrackChangesInfo('Regional Version', 'added', livecopyContent);
      mergedMdast.children.push(livecopyContent);
    }
  }

  // Insert the leftover content in langstore if any
  if (index < langstoreNowProcessedMdast.length) {
    for (; index < langstoreNowProcessedMdast.length; index += 1) {
      const langstoreContent = hashToContentMap.get(langstoreNowProcessedMdast[index]);
      addTrackChangesInfo('Langstore Version', 'deleted', langstoreContent);
      mergedMdast.children.push(langstoreContent);
    }
  }

  // Insert the leftover content in livecopy if any
  if (index < livecopyProcessedMdast.length) {
    for (; index < livecopyProcessedMdast.length; index += 1) {
      const livecopyContent = hashToContentMap.get(livecopyProcessedMdast[index]);
      mergedMdast.children.push(livecopyContent);
    }
  }

  return mergedMdast;
}

// If modified timestamp and rollout timestamp is less than 10seconds for livecopy, return true.
function noRegionalChanges(fileMetadata) {
  const lastModified = new Date(fileMetadata.Modified);
  const lastRollout = new Date(fileMetadata.Rollout);
  const diffBetweenRolloutAndModification = Math.abs(lastRollout - lastModified) / 1000;
  // TODO: temporarily commenting out for the ease of testing
  // return diffBetweenRolloutAndModification < 10;
  return false;
}

async function rollout(file, targetFolders, skipMerge = false) {
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

      // if regional file exists but there are no changes in regional doc or if we are skipping merge altogether
      if (skipMerge || (noRegionalChanges(fileMetadata) && !previouslyMerged)) {
        await saveFileAndUpdateMetadata(
          filePath,
          file.blob,
          livecopyFilePath,
        );
        loadingON(`Rollout to ${livecopyFilePath} complete`);
        return status;
      }

      // if regional file exists AND there are changes in the regional file, then merge process kicks in.
      if (!langstorePrevVersion) {
        // if for some reason the RolloutVersion metadata info is not available in region, rollout is NOT performed
        // Cannot merge since we don't have rollout version info.
        // eslint-disable-next-line no-console
        loadingON(`Cannot rollout to ${livecopyFilePath} since last rollout version info is unavailable`);
      } else {
        // get MDAST of the current langstore file that needs to be rolled out
        const langstoreNow = await getMdast(filePathWithoutExtension);
        // get processed data Map for the current langstore file that needs to be rolled out
        const langstoreNowProcessedMdast = await getProcessedMdast(langstoreNow);

        const liveCopyPath = `${targetFolder}/${fileName}`;
        // get MDAST of the livecopy file
        const livecopy = await getMdast(liveCopyPath.substring(0, liveCopyPath.lastIndexOf('.')));
        // get processed data Map for the livecopy file
        const livecopyProcessedMdast = await getProcessedMdast(livecopy);
        // get merged mdast
        const livecopyMergedMdast = getMergedMdast(langstoreNowProcessedMdast, livecopyProcessedMdast);
        // save the merged livecopy file
        await persist(filePath, livecopyMergedMdast, livecopyFilePath);
        loadingON(`Rollout to ${livecopyFilePath} complete`);
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
