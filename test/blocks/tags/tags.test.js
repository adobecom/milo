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
  config.locale.contentRoot = '/test/blocks/featured-article/mocks';

  const block = document.createElement('div');
  block.setAttribute('class', 'tags');
  const tagsContainer = document.createElement('p');
  tagsContainer.setAttribute('class', 'tags-container');
  tagsContainer.textContent = 'Creative Cloud;Document Cloud;Experience Cloud;After Effects;Illustrator;Photoshop';
  block.append(tagsContainer);

  afterEach(() => {
    document.body.innerHTML = ogDoc;
  });

  it('renders tags block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init(block);
    expect(document.body.querySelector('.tags-container')).to.be.exist;
  });

  it('renders tags block before recommended articles block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bodyWithRecommededArticles.html' });
    await init(block);

    const mainEl = document.body.querySelector('main');
    const tagsEl = mainEl.querySelector('.recommended-articles').previousElementSibling;

    console.log(mainEl);
    expect(mainEl.querySelector('.tags-container')).to.be.exist;
    expect(tagsEl.classList.contains('tags')).to.be.true;
  });
});
