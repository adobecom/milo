import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/features/interlinks.js');
const anchorUrl = 'http://oceandecade.org/';

describe('Interlinks', () => {
  it('works for english language', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_en.html' });
    await init('/test/features/interlinks/mocks/keywords.json', 'en');
    await waitForElement('a');
    const anchorElem = document.querySelector('a');
    expect(anchorElem.getAttribute('href')).equals(anchorUrl);
    expect(anchorElem.getAttribute('title')).equals('Ocean breeze');
  });

  it('works for korean language', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_ko.html' });
    await init('/test/features/interlinks/mocks/keywords.json', 'ko');
    await waitForElement('a');
    const anchorElem = document.querySelector('a');
    expect(anchorElem.getAttribute('href')).equals(anchorUrl);
    expect(anchorElem.getAttribute('title')).equals('바닷바람');
  });

  it('works for french language', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_fr.html' });
    await init('/test/features/interlinks/mocks/keywords.json', 'fr');
    await waitForElement('a');
    const anchorElem = document.querySelector('a');
    expect(anchorElem.getAttribute('href')).equals(anchorUrl);
    expect(anchorElem.getAttribute('title')).equals('Brise marine');
  });
});
