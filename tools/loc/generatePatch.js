const MAX_RETRIES = 5;

async function fetchFile(url, retryAttempt) {
  const response = await fetch(url);
  if (!response.ok && retryAttempt <= MAX_RETRIES) {
    await fetchFile(url, retryAttempt + 1);
  }
  return response;
}

async function init() {
  const first = await fetchFile('https://diffpoc--milo--adobecom.hlx.page/drafts/bhagwath/validatemd.md', 1);
  const second = await fetchFile('https://diffpoc--milo--adobecom.hlx.page/drafts/bhagwath/validatemd1.md', 1);
  const third = await fetchFile('https://diffpoc--milo--adobecom.hlx.page/drafts/bhagwath/validatemd2.md', 1);
  const firstText = await first.text();
  const secondText = await second.text();
  const thirdText = await third.text();
  // Char Diff
  const diffChars = Diff.diffWords(firstText, secondText);
  const diffCharsContainer = document.getElementById('md-diff-chars');
  diffChars.forEach((part) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = JSON.stringify(part, undefined, 2);
    diffCharsContainer.append(paragraph);
  });
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
  const structuredPatch = Diff.structuredPatch('firstmd', 'secondmd', firstText, secondText);
  const diffContainer2 = document.getElementById('md-diff-json');
  diffContainer2.textContent = JSON.stringify(structuredPatch, undefined, 2);
  // eslint-disable-next-line max-len
  const appliedPatch = Diff.applyPatch(thirdText, Diff.parsePatch(standardPatch), { fuzzFactor: 10 });
  const appliedPatchContainer = document.getElementById('md-generated-patch');
  appliedPatchContainer.textContent = appliedPatch;
}

export default init;
