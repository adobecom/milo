import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();
config.locale.contentRoot = '/test/blocks/reading-time/mocks';

const { default: init } = await import('../../../libs/blocks/reading-time/reading-time.js');

describe('reading-time estimate', () => {
  it('supports longer articles with 2+ min read time', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/long-article.html' });
    const block = document.querySelector('.reading-time');
    await init(block);
    expect(document.querySelector('.reading-time > span:not(:empty)')).to.exist;
  });

  it('supports shorter articles with 1 min read time', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/short-article.html' });
    const block = document.querySelector('.reading-time');
    await init(block);
    expect(document.querySelector('.reading-time > span:not(:empty)')).to.exist;
  });

  describe('inline variant', async () => {
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/inline.html' });
    });

    it('Inline variant (with inline siblings) creates an inline-wrapper element', async () => {
      const section = document.querySelector('.section.inline-has-siblings');
      const els = section.querySelectorAll('.reading-time.inline');
      els.forEach(async (el) => {
        await init(el);
        expect(el.parentElement.classList.contains('inline-wrapper')).to.be.true;
      });
    });

    it("Inline variant (without siblings) doesn't affect the DOM", async () => {
      const section = document.querySelector('.section.inline-no-siblings');
      const el = section.querySelector('.reading-time.inline');
      await init(el);
      expect(el.parentElement.classList.contains('inline-wrapper')).to.be.false;
    });
  });
});
