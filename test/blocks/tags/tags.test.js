import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

const { default: init } = await import('../../../libs/blocks/tags/tags.js');

describe('decorateTags', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    config.locale.contentRoot = '/test/blocks/tags/mocks';
    config.taxonomyRoot = undefined;
    const block = document.querySelector('.tags');
    await init(block);
  });

  it('renders tags block', async () => {
    expect(document.body.querySelector('.tags')).to.exist;
  });

  it('sets default taxonomy path to "topics"', async () => {
    const categoryLink = document.querySelector('.tags a');
    expect(categoryLink.href.includes('/topics/')).to.be.true;
  });
});
