import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/editorial-card/editorial-card.js');

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};
setConfig(config);

describe('editorial-card', () => {
  const editorialCards = document.querySelectorAll('.editorial-card');
  beforeEach(async () => {
    editorialCards.forEach((card) => {
      init(card);
    });
  });
  it('w/ 1 row has a foreground', () => {
    const foreground = editorialCards[3].querySelector('.foreground');
    expect(foreground).to.exist;
  });
  it('w/ 4 rows has a footer', () => {
    const footer = editorialCards[3].querySelector('.footer');
    expect(footer).to.exist;
  });
  it('w/ lockup gets decorated', () => {
    const label = editorialCards[4].querySelector('.lockup-label');
    expect(label).to.exist;
  });
});
