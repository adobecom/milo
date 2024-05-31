import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import enableCommerceFrameFeatures, { MOBILE_MAX, TABLET_MAX, adjustModalHeight } from '../../../libs/blocks/modal/modal.merch.js';
import { delay } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/iframe.plain.html' });

const main = document.querySelector('main');

const addModal = (selector) => {
  main.append(document.getElementById(selector).content.cloneNode(true));
  const dialog = document.querySelector('.dialog-modal');
  const iframeWrapper = dialog.querySelector('.milo-iframe');
  const iframe = dialog.querySelector('iframe');
  const secondDialog = document.querySelector('.dialog-modal:nth-child(2)');
  const secondIframeWrapper = secondDialog?.querySelector('.milo-iframe');
  const secondIframe = secondDialog?.querySelector('iframe');
  return {
    dialog,
    iframe,
    iframeWrapper,
    secondDialog,
    secondIframe,
    secondIframeWrapper,
  };
};

describe('Modal dialog with a `commerce-frame` class', () => {
  beforeEach(() => {
    main.innerHTML = '';
  });

  it('adjustStyles: sets the iframe height to 100% if height adjustment is not applicable', () => {
    const { dialog, iframe } = addModal('modal1');
    const originalSrc = iframe.getAttribute('src');
    iframe.setAttribute('src', 'https://www.adobe.com/somepage.html');
    enableCommerceFrameFeatures({ dialog, iframe });
    expect(dialog.classList.contains('height-fit-content')).to.be.false;
    expect(iframe.style.height).to.equal('100%');
    iframe.style.removeProperty('height');
    iframe.setAttribute('src', originalSrc);
  });

  it('adjustStyles: sets the `height-fit-content` class if height adjustment is applicable', () => {
    const { dialog, iframe } = addModal('modal1');
    enableCommerceFrameFeatures({ dialog, iframe });
    expect(dialog.classList.contains('height-fit-content')).to.be.true;
    expect(iframe.style.height).to.equal('');
  });

  it('sends viewport dimensions upon request, and then on every resize', async () => {
    await setViewport({ width: 800, height: 600 });
    const { dialog, iframe } = addModal('modal1');
    sinon.spy(window, 'postMessage');
    enableCommerceFrameFeatures({ dialog, iframe });
    window.postMessage('viewportWidth');
    await delay(10);
    expect(window.postMessage.calledWith({
      mobileMax: MOBILE_MAX,
      tabletMax: TABLET_MAX,
      viewportWidth: 800,
    })).to.be.true;

    document.documentElement.setAttribute('style', 'width: 1200px');
    window.dispatchEvent(new Event('resize'));
    await delay(10);
    expect(window.postMessage.calledWith({
      mobileMax: MOBILE_MAX,
      tabletMax: TABLET_MAX,
      viewportWidth: 1200,
    })).to.be.true;
    document.documentElement.removeAttribute('style');
  });

  it('adjusts modal height if height auto adjustment is applicable', async () => {
    const { dialog, iframe, iframeWrapper } = addModal('modal1');
    const contentHeight = {
      desktop: 714,
      mobile: '100%',
    };
    await setViewport({ width: 1200, height: 1000 });
    window.location.hash = '#first-dialog';
    window.postMessage({ contentHeight: contentHeight.desktop }, '*');
    await delay(50);
    expect(iframe.clientHeight).to.equal(contentHeight.desktop);
    expect(iframeWrapper.clientHeight).to.equal(contentHeight.desktop);
    expect(dialog.clientHeight).to.equal(contentHeight.desktop);

    await setViewport({ width: 320, height: 600 });
    window.postMessage({ contentHeight: contentHeight.mobile }, '*');
    await delay(50);
    expect(iframe.style.height).to.equal(contentHeight.mobile);
    expect(iframeWrapper.style.height).to.equal('');
    expect(dialog.style.height).to.equal('');
    window.location.hash = '';
  });

  it('properly adjusts the modal height when there are two modals on the page', async () => {
    addModal('modal1');
    const {
      dialog, iframe, iframeWrapper, secondDialog, secondIframe, secondIframeWrapper,
    } = addModal('modal2');
    const contentHeight = {
      desktop1: 714,
      desktop2: 600,
      mobile: '100%',
    };
    await setViewport({ width: 1200, height: 1000 });
    window.location.hash = '#first-dialog';
    window.postMessage({ contentHeight: contentHeight.desktop1 }, '*');
    await delay(50);
    expect(iframe.clientHeight).to.equal(contentHeight.desktop1);
    expect(iframeWrapper.clientHeight).to.equal(contentHeight.desktop1);
    expect(dialog.clientHeight).to.equal(contentHeight.desktop1);

    await setViewport({ width: 320, height: 600 });
    window.postMessage({ contentHeight: contentHeight.mobile }, '*');
    await delay(50);
    expect(iframe.style.height).to.equal(contentHeight.mobile);
    expect(iframeWrapper.style.height).to.equal('');
    expect(dialog.style.height).to.equal('');
    window.location.hash = '';

    await setViewport({ width: 1200, height: 1000 });
    window.location.hash = '#second-dialog';
    window.postMessage({ contentHeight: contentHeight.desktop2 }, '*');
    await delay(50);
    expect(secondIframe.clientHeight).to.equal(contentHeight.desktop2);
    expect(secondIframeWrapper.clientHeight).to.equal(contentHeight.desktop2);
    expect(secondDialog.clientHeight).to.equal(contentHeight.desktop2);

    await setViewport({ width: 320, height: 600 });
    window.postMessage({ contentHeight: contentHeight.mobile }, '*');
    await delay(50);
    expect(iframe.style.height).to.equal(contentHeight.mobile);
    expect(iframeWrapper.style.height).to.equal('');
    expect(dialog.style.height).to.equal('');
    window.location.hash = '';
  });

  it('initialises managed modals via merch block', async () => {
    window.location.hash = '#page=2';
    const { dialog } = addModal('modal3');
    adjustModalHeight(600);
    expect(dialog.style.height).to.equal('580px');
  });
});
