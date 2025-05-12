import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { handleIFrameEvents } from '../../../libs/blocks/iframe/iframe.js';

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
  describe('handleIFrameEvents', () => {
    const originalOpen = window.open;
    beforeEach(async () => {
      window.open = sinon.stub(window, 'open');
    });
    afterEach(() => {
      window.open = originalOpen;
    });
    it('should open external url if Type External', async () => {
      const message = { data: '{"app":"ManagePlan","subType":"EXTERNAL","data":{"externalUrl":"https://www.example.com","target":"_blank"}}' };
      handleIFrameEvents(message);
      expect(window.open.calledOnceWith('https://www.example.com', '_blank')).to.be.true;
    });

    it('should open external url if Type SWITCH', async () => {
      const message = { data: '{"app":"ManagePlan","subType":"SWITCH","data":{"externalUrl":"https://www.example.com","target":"_self"}}' };
      handleIFrameEvents(message);
      expect(window.open.calledOnceWith('https://www.example.com', '_self')).to.be.true;
    });

    it('should emit close event on modal if Type Close', async () => {
      const dialog = document.createElement('div');
      dialog.classList.add('dialog-modal');
      document.body.appendChild(dialog);
      const dispatchSpy = sinon.spy(dialog, 'dispatchEvent');
      const message = { data: '{"app":"ManagePlan","subType":"Close"}' };
      handleIFrameEvents(message);
      expect(dispatchSpy.calledOnce).to.be.true;
    });

    [
      [{ data: {} }, 'should do nothing if message is not parseble'],
      [{ data: '{"app":"ManagePlan","subType":"Invalid","data":{"actionRequired":false}}' }, 'should do nothing if message type is not valid'],
      [{ data: '{"app":"ManagePlan","subType":"Error","data":{"actionRequired":false}}' }, 'should do nothing if message type is error'],
    ].forEach(([message, desc]) => {
      it(desc, () => {
        expect(() => { handleIFrameEvents(message); }).not.to.throw();
        expect(window.open.calledOnce).to.be.false;
      });
    });
  });
});
