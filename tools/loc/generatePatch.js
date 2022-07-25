import parseMarkdown from './helix/parseMarkdown.bundle.js';
import mdast2docx from './helix/mdast2docx.bundle.js';
import {
  connect as connectToSP,
  saveFile,
} from '../translation/sharepoint.js';

const MAX_RETRIES = 5;

async function fetchFile(url, retryAttempt) {
  const response = await fetch(url);
  if (!response.ok && retryAttempt <= MAX_RETRIES) {
    await fetchFile(url, retryAttempt + 1);
  }
  return response;
}

async function init() {
  const first = await fetchFile('/drafts/bhagwath/validatemd.md', 1);
  const second = await fetchFile('/drafts/bhagwath/validatemd1.md', 1);
  const third = await fetchFile('/drafts/bhagwath/validatemd2.md', 1);
  const firstText = await first.text();
  let secondText = await second.text();
  const thirdText = await third.text();
  // Char Diff
  /*const diffChars = Diff.diffWords(firstText, secondText);
  const diffCharsContainer = document.getElementById('md-diff-chars');
  diffChars.forEach((part) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = JSON.stringify(part, undefined, 2);
    diffCharsContainer.append(paragraph);
  });*/
  // Line Diff
  const diffLines = Diff.diffLines(firstText, secondText);
  const diffLinesContainer = document.getElementById('md-diff-lines');
  diffLines.forEach((part) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = JSON.stringify(part, undefined, 2);
    diffLinesContainer.append(paragraph);
  });
  // Standard Patch
  const standardPatch = Diff.createTwoFilesPatch('firstmd', 'secondmd', firstText, secondText);
  const diffContainer = document.getElementById('md-diff');
  diffContainer.innerText = standardPatch;
  // Structured Patch
  /*const structuredPatch = Diff.structuredPatch('firstmd', 'secondmd', firstText, secondText);
  const diffContainer2 = document.getElementById('md-diff-json');
  diffContainer2.textContent = JSON.stringify(structuredPatch, undefined, 2);*/
  // eslint-disable-next-line max-len
  /*const appliedPatch = Diff.applyPatch(thirdText, Diff.parsePatch(standardPatch), { fuzzFactor: 10 });
  const appliedPatchContainer = document.getElementById('md-generated-patch');
  appliedPatchContainer.textContent = appliedPatch;*/
  // markdown parsing
  const state = { content: { data: firstText }, log: '' };
  parseMarkdown(state);
  const { mdast } = state.content;
  const mdastContainer = document.getElementById('md-syntax-tree');
  const mdastStr = JSON.stringify(mdast, undefined, 2);
  mdastContainer.textContent = mdastStr;

  // Line Diff for MDAST
  const state2 = { content: { data: secondText }, log: '' };
  parseMarkdown(state2);
  const mdast2 = state2.content.mdast;
  const mdast2Str = JSON.stringify(mdast2, undefined, 2);
  const mdastDiffContainer = document.getElementById('md-syntax-tree-diff');
  const diffLinesMdast = Diff.diffLines(mdastStr, mdast2Str);
  diffLinesMdast.forEach((part) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = JSON.stringify(part, undefined, 2);
    mdastDiffContainer.append(paragraph);
  });
  const docx = await mdast2docx(mdast2);
  await connectToSP(async () => {
    await saveFile(docx, '/drafts/bhagwath/ValidateMD2AutoSavedV3.docx');
  });
}

export default init;
