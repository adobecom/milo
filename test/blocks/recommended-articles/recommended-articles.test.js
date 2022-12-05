import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/recommended-articles/recommended-articles.js');

describe('creates feature article block', () => {
  const articles = document.querySelectorAll('.recommended-articles');

  it('creates small recommended articles', async () => {
    config.locale.contentRoot = '/test/blocks/recommended-articles/mocks';
    await init(articles[0]);
    const card = document.querySelector('.recommended-articles-small-content-wrapper');
    expect(card).to.exist;
  });

  it('creates regular recommended articles', async () => {
    config.locale.contentRoot = '/test/blocks/recommended-articles/mocks';
    await init(articles[1]);
    const card = document.querySelector('.recommended-articles-content-wrapper');
    expect(card).to.exist;
  });

  it('does not create recommended article cards', async () => {
    config.locale.contentRoot = '/test/blocks/recommended-articles/mocks';
    await init(articles[2]);
    const articleCards = articles[2].querySelector('.articles-cards');
    expect(articleCards).to.be.null;
  });
});
