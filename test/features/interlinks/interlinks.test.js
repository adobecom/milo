import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
let foundInterlinks = 0;

const { default: init } = await import('../../../libs/features/interlinks.js');
const anchorUrl = 'http://oceandecade.org/';

function interlinksCheck(item) {
  if (item.getAttribute('data-origin')) {
    expect(item.getAttribute('data-origin')).to.equal('interlink');
  } else {
    return;
  }
  if (!item.getAttribute('daa-ll')) {
    return;
  }

  foundInterlinks += 1;
}
describe('Interlinks', async () => {
  it('No valid keywords file is provided', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/maxlinks.plain.html' });
    await init('/test/features/interlinks/mocks/invalid.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('No main tag is found', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/nomain.plain.html' });
    await init('/test/features/interlinks/mocks/keywords.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Keywords file has no records, no interlinks are made', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/interlinks.plain.html' });
    await init('/test/features/interlinks/mocks/empty.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Interlinks not made, ratio of text to links on page is too small', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/maxlinks.plain.html' });
    await init('/test/features/interlinks/mocks/keywords.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Interlinks not made, no matches found', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/interlinks.plain.html' });
    await init('/test/features/interlinks/mocks/nomatches.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Interlinks are made with a valid keywords file', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/interlinks.plain.html' });
    await init('/test/features/interlinks/mocks/keywords.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(3);
  });
});

describe('Interlinks check for different languages', () => {
  it('works for english language', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_en.html' });
    await init('/test/features/interlinks/mocks/keywords_lang.json', 'en');
    await waitForElement('a');
    const anchorElem = document.querySelector('a');
    expect(anchorElem.getAttribute('href')).equals(anchorUrl);
    expect(anchorElem.getAttribute('title')).equals('Ocean breeze');
  });

  it('works for korean language', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_ko.html' });
    await init('/test/features/interlinks/mocks/keywords_lang.json', 'ko');
    await waitForElement('a');
    const anchorElem = document.querySelector('a');
    expect(anchorElem.getAttribute('href')).equals(anchorUrl);
    expect(anchorElem.getAttribute('title')).equals('바닷바람');
  });

  it('works for french language', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_fr.html' });
    await init('/test/features/interlinks/mocks/keywords_lang.json', 'fr');
    await waitForElement('a');
    const anchorElem = document.querySelector('a');
    expect(anchorElem.getAttribute('href')).equals(anchorUrl);
    expect(anchorElem.getAttribute('title')).equals('Brise marine');
  });
});
