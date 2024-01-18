import './mock-sidekick.js';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/bulk-publish/bulk-publish.js');
const urlValue = 'https://main--milo--adobecom.hlx.page/drafts/sarchibeque/bulk-publish-test';

describe('Bulk Publish Tool', () => {
  const bp = document.querySelector('.bulk-publish');
  const sidekick = document.createElement('helix-sidekick');
  bp.parentElement.prepend(sidekick);
  init(bp);

  const bpwp = bp.querySelector('bulk-publish');
  it('has a bulk publish component', () => {
    expect(bpwp).to.exist;
  });

  sidekick.runMockEvents();
  const root = bpwp.shadowRoot;
  it('can run a bulk process', () => {
    const textarea = root.querySelector('#Urls');
    const select = root.querySelector('#ProcessSelect');
    const submitBtn = root.querySelector('#RunProcess');
    textarea.value = urlValue;
    select.value = 'preview';
    submitBtn.click();
  });
});
