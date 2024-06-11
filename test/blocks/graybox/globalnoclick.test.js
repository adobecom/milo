import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadStyle, MILO_EVENTS } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/graybox/graybox.js');
await loadStyle('../../../libs/blocks/graybox/graybox.css');

const CLASS = {
  CHANGED: 'gb-changed',
  NO_CHANGE: 'gb-no-change',
};

describe('Graybox Global No Click With Changed Els', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/noclick-changed-els.html' });
    await init(document.querySelector('.graybox'));
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  });

  it('Stops all grayed elements from being clickable', async () => {
    const changedElSel = `.${CLASS.CHANGED}:not(main > div), main > div.${CLASS.CHANGED} > div:not(.${CLASS.NO_CHANGE})`;
    const changedEls = [...document.querySelectorAll(changedElSel)];
    const allBlockEls = document.querySelectorAll('main > div > div');
    allBlockEls.forEach((el) => {
      // skip the graybox block
      if (el.classList.contains('graybox')) return;

      if (!changedEls.includes(el)) {
        expect(el.classList.contains('gb-no-click')).to.be.true;
      } else {
        expect(el.classList.contains('gb-no-click')).to.be.false;
      }
    });
  });
});

describe('Graybox Global No Click With Not Changed Els Marked', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/noclick-no-change.html' });
    await init(document.querySelector('.graybox'));
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  });

  it('Stops all grayed elements from being clickable', async () => {
    const notChangedEls = [...document.querySelectorAll(`.${CLASS.NO_CHANGE}`)];
    const allBlockAndSectionEls = document.querySelectorAll('main > div > div, main > div');
    allBlockAndSectionEls.forEach((el) => {
      // skip the graybox block
      if (el.classList.contains('graybox')) return;

      if (notChangedEls.includes(el)) {
        expect(el.classList.contains('gb-no-click')).to.be.true;
      } else {
        expect(el.classList.contains('gb-no-click')).to.be.false;
      }
    });
  });
});
