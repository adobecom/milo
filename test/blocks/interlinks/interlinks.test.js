import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import interlink from '../../../libs/features/interlinks.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
let foundInterlinks = 0;

function interlinksCheck(item) {
  if (item.getAttribute('data-origin')) {
    expect(item.getAttribute('data-origin')).to.equal('interlink');
  } else {
    return;
  }
  if (!item.getAttribute('daa-ll')) {
    return;
  }
  if (item.parentElement.getAttribute('daa-lh')) {
    expect(item.parentElement.getAttribute('daa-lh')).to.contain('interlinks_p_');
  } else return;

  foundInterlinks += 1;
}
describe('Interlinks', async () => {
  it('No valid keywords file is provided', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/maxlinks.plain.html' });
    await interlink('/test/blocks/interlinks/mocks/invalid.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('No main tag is found', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/nomain.plain.html' });
    await interlink('/test/blocks/interlinks/mocks/keywords.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Keywords file has no records, no interlinks are made', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/interlinks.plain.html' });
    await interlink('/test/blocks/interlinks/mocks/empty.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Interlinks not made, ratio of text to links on page is too small', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/maxlinks.plain.html' });
    await interlink('/test/blocks/interlinks/mocks/keywords.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Interlinks not made, no matches found', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/interlinks.plain.html' });
    await interlink('/test/blocks/interlinks/mocks/nomatches.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(0);
  });

  it('Interlinks are made with a valid keywords file', async () => {
    foundInterlinks = 0;
    document.body.innerHTML = await readFile({ path: './mocks/interlinks.plain.html' });
    await interlink('/test/blocks/interlinks/mocks/keywords.json');
    const atags = document.getElementsByTagName('a');
    atags.forEach(interlinksCheck);
    expect(foundInterlinks).to.equal(3);
  });
});
