import { expect } from '@esm-bundle/chai';
import init from '../../../libs/blocks/tag-selector/tag-selector.js';
import { delay, waitForElement } from '../../helpers/waitfor.js';
import { restoreFetch, stubFetch } from '../caas-config/mockFetch.js';
import taxonomy from './taxonomy.js';

describe('Tag Selector', () => {
  beforeEach(async () => {
    stubFetch();
    window.fetch.withArgs('./mocks/taxonomy.json').returns(
      new Promise((resolve) => {
        resolve({
          ok: true,
          json: () => taxonomy,
        });
      }),
    );

    document.body.innerHTML = '<div><div class="tag-selector"><div><div>Consumer Tags</div><div><a href="./mocks/taxonomy.json">./mocks/taxonomy.json</a></div></div></div>';
    await init(document.querySelector('.tag-selector'));
  });

  afterEach(() => {
    restoreFetch();
  });

  it('loads caas tags by default', async () => {
    const firstItem = await waitForElement('.tagselect-item [data-tag=CaaS]');
    expect(firstItem).to.exist;
  });

  it('adds tags to preview box when checked', async () => {
    const checkbox = await waitForElement('.tagselect-item [id^=caas]');
    checkbox.click();

    const previewTag = await waitForElement('.tag-preview p');
    const key = checkbox.getAttribute('id');
    expect(previewTag.textContent).to.equal(key);
  });

  it('removes tags from preview box when unchecked', async () => {
    const checkbox = await waitForElement('.tagselect-item [id^=caas]');
    checkbox.click();

    const previewTag = await waitForElement('.tag-preview p');
    const key = checkbox.getAttribute('id');
    expect(previewTag.textContent).to.equal(key);

    checkbox.click();

    await delay(50);

    expect(document.querySelector('.tag-preview p')).to.be.null;
  });

  it('shows children on arrow click', async () => {
    const arrow = await waitForElement('.tagselect-picker-cols .has-children');

    arrow.click();

    const secondCol = await waitForElement('.tagselect-picker-cols .col:nth-child(2)');

    expect(secondCol).to.exist;
  });

  it('shows consumer tags when clicked', async () => {
    const button = await waitForElement('.tagselect-item [data-tag="Consumer Tags"]');

    button.click();

    const item = await waitForElement('.tagselect-picker-cols .tagselect-item');

    expect(item).to.exist;
    expect(item.dataset.key).to.equal('primaryproductname');
  });
});
