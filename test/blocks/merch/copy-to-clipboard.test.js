import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createTag } from '../../../libs/utils/utils.js';
import addCopyToClipboard from '../../../libs/blocks/merch/copy-to-clipboard.js';

describe('Copy to Clipboard', () => {
  let navigatorClipboardWriteText;

  beforeEach(() => {
    navigatorClipboardWriteText = sinon.stub(navigator.clipboard, 'writeText').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return original CTA if ostLink or cta is missing', () => {
    const cta = createTag('a', { href: '#' }, 'Test CTA');
    expect(addCopyToClipboard(null, cta)).to.equal(cta);
    expect(addCopyToClipboard('', cta)).to.equal(cta);
    expect(addCopyToClipboard('test', null)).to.equal(null);
  });

  it('should create wrapper with copy button and original CTA', () => {
    const cta = createTag('a', { href: '#' }, 'Test CTA');
    const ostLink = 'https://test.com';
    const wrapper = addCopyToClipboard(ostLink, cta);
    expect(wrapper.tagName).to.equal('DIV');
    expect(wrapper.classList.contains('copy-cta-wrapper')).to.be.true;
    expect(wrapper.style.display).to.equal('flex');
    expect(wrapper.style.gap).to.equal('14px');
    const button = wrapper.querySelector('button');
    expect(button).to.exist;
    expect(button.title).to.equal('Copy');
    expect(button.style.background).to.equal('none');
    expect(button.style.border).to.equal('none');
    expect(button.style.padding).to.equal('0px');
    expect(button.style.cursor).to.equal('pointer');
    const svg = button.querySelector('svg');
    expect(svg).to.exist;
    expect(svg.getAttribute('height')).to.equal('30');
    expect(svg.getAttribute('width')).to.equal('30');
    const link = wrapper.querySelector('a');
    expect(link).to.exist;
    expect(link.href).to.equal(cta.href);
    expect(link.textContent).to.equal('Test CTA');
  });

  it('should copy link to clipboard when button is clicked', async () => {
    const cta = createTag('a', { href: '#' }, 'Test CTA');
    const ostLink = 'https://test.com';
    const wrapper = addCopyToClipboard(ostLink, cta);
    const button = wrapper.querySelector('button');
    await button.click();
    expect(navigatorClipboardWriteText.calledOnce).to.be.true;
    expect(navigatorClipboardWriteText.calledWith(ostLink)).to.be.true;
  });
});
