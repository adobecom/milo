import parseMarkdown from './helix/parseMarkdown.bundle.js';
import mdast2docx from './helix/mdast2docx.bundle.js';
import {
  connect as connectToSP,
  saveFile,
} from '../translation/sharepoint.js';

const types = new Set();
const hashToContentMap = {};

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
  const hashToIndex = {};
  const arrayWithTypeAndHash = [];
  let index = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const node of nodes) {
    const nodeType = getNodeType(node);
    types.add(nodeType);
    const hash = objectHash.sha1(node);
    arrayWithTypeAndHash.push({ type: nodeType, hash });
    hashToIndex[hash] = index;
    hashToContentMap[hash] = node;
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

function display(id, value) {
  const container = document.getElementById(id);
  container.innerText = JSON.stringify(value, undefined, 2);
}

// eslint-disable-next-line no-unused-vars
async function persist(mdast, path = '/drafts/bhagwath/ValidateMD2AutoSavedV3.docx') {
  const docx = await mdast2docx(mdast);
  await connectToSP(async () => {
    await saveFile(docx, path);
  });
}

async function init() {
  const langmasterBase = await getMdast('/drafts/bhagwath/diffpoc/langmaster-base');
  const langmasterBaseProcessed = await getProcessedMdast(langmasterBase);
  display('langmasterBase', langmasterBaseProcessed);
  const langmasterV1 = await getMdast('/drafts/bhagwath/diffpoc/langmaster-v1');
  const langmasterV1Processed = await getProcessedMdast(langmasterV1);
  display('langmasterV1', langmasterV1Processed);
  const regionV1 = await getMdast('/drafts/bhagwath/diffpoc/region-v1');
  const regionV1Processed = await getProcessedMdast(regionV1);
  display('regionV1', regionV1Processed);
}

export default init;
