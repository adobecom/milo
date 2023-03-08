import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

const ogDoc = document.body.innerHTML;

const { default: init } = await import('../../../libs/blocks/tags/tags.js');

describe('decorateTags', () => {
  config.locale.contentRoot = '/test/blocks/tags/mocks';

  afterEach(() => {
    document.body.innerHTML = ogDoc;
  });

  it('renders tags block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.tags');
    await init(block);
    expect(document.body.querySelector('.tags')).to.be.exist;
  });
});
