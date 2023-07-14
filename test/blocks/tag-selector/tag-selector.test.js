import { expect } from '@esm-bundle/chai';
import { default as init } from '../../../libs/blocks/tag-selector/tag-selector.js';
import { delay, waitForElement, waitForRemoval } from '../../helpers/waitfor.js';
import { stubFetch } from '../caas-config/mockFetch.js';

stubFetch();

describe('Tag Selector', () => {
  beforeEach(async () => {
    document.body.innerHTML = '<div class="tag-selector"></div>';
    await init(document.querySelector('.tag-selector'));
  });

  it('loads caas tags by default', async () => {
    const firstItem = await waitForElement('.tagselect-item [id^=caas]');
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
});
