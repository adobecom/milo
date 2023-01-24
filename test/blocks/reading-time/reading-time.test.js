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
});
