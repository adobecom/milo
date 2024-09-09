import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/iframe/iframe.js');
const emptyHTML = '<div class="iframe"><div></div></div>';
const blockHTML = `<div class="iframe additional">
  <div>
    <div><a href="https://adobe-ideacloud.forgedx.com/adobe-adobe-magento/adobe-magento-hybrid/public/mx?SUID=6Bmhi16C730c3noGdPN385j4ZipffIAq">https://adobe-ideacloud.forgedx.com/adobe-adobe-magento/adobe-magento-hybrid/public/mx?SUID=6Bmhi16C730c3noGdPN385j4ZipffIAq</a></div>
  </div>
</div>`;
const autoBlockHTML = '<a href="https://adobe-ideacloud.forgedx.com/adobe-adobe-magento/adobe-magento-hybrid/public/mx?SUID=6Bmhi16C730c3noGdPN385j4ZipffIAq">https://adobe-ideacloud.forgedx.com/adobe-adobe-magento/adobe-magento-hybrid/public/mx?SUID=6Bmhi16C730c3noGdPN385j4ZipffIAq</a>';

describe('iframe', () => {
  it('does not render iframe when there are no links', async () => {
    document.body.innerHTML = emptyHTML;

    const el = document.querySelector('.iframe');
    init(el);

    expect(document.querySelectorAll('iframe').length).to.equal(0);
  });

  it('renders iframe onto the page', async () => {
    document.body.innerHTML = blockHTML;
    const el = document.querySelector('.iframe');
    init(el);

    expect(document.querySelector('iframe')).to.exist;
  });

  it('renders iframe autoblock onto the page', async () => {
    setConfig({ autoBlocks: [{ iframe: 'https://adobe-ideacloud.forgedx.com' }] });
    document.body.innerHTML = autoBlockHTML;

    const el = document.querySelector('a');
    init(el);

    expect(document.querySelector('iframe')).to.exist;
  });

  it('passes additional classes to final iframe', async () => {
    document.body.innerHTML = blockHTML;
    const el = document.querySelector('.iframe');
    init(el);

    expect(document.querySelector('.additional')).to.exist;
  });
});
