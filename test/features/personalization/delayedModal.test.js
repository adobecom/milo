// @TODO: write new tests, place them in proper files and remove this file
// import { expect } from '@esm-bundle/chai';
// import { parseUrl } from '../../../libs/features/personalization/personalization.js';
// import { defineHashParams, showModal, setEventBasedModalListener, DISPLAY_MODE } from '../../../libs/utils/utils.js';
// import { delay, waitForElement } from '../../helpers/waitfor.js';

// const hash = '#dm';

// it('parses URL properly', () => {
//   expect(parseUrl()).to.deep.equal({});
//   expect(parseUrl('https://www.adobe.com/')).to.deep.equal({
//     hash: '',
//     href: '/',
//     pathname: '/',
//     search: '',
//   });
//   expect(parseUrl('/fragments/testpage')).to.deep.equal({ href: '/fragments/testpage' });
//   expect(parseUrl('https://www.adobe.com/testpage/?delay=1&display=pageload#dm')).to.deep.equal({
//     hash,
//     href: '/testpage/?delay=1&display=pageload#dm',
//     pathname: '/testpage/',
//     search: '?delay=1&display=pageload',
//   });
// });

// it('takes the delayed modal parameters from the URL', () => {
//   expect(defineDelayedModalParams()).to.deep.equal({});
//   expect(defineDelayedModalParams('?delay=invalid&display=invalid')).to.deep.equal({});
//   expect(defineDelayedModalParams('?delay=-1&display=pageload')).to.deep.equal({ displayMode: DISPLAY_MODE.oncePerPageLoad });
//   expect(defineDelayedModalParams('?delay=1&display=pageload')).to.deep.equal({
//     delay: 1000,
//     displayMode: DISPLAY_MODE.oncePerPageLoad,
//   });
// });

// it('add proper attributes and class names to the link', () => {
//   const a = document.createElement('a');
//   decorateDelayedModalAnchor({
//     a,
//     hash,
//     pathname: '/testpage/',
//   });
//   expect(a.getAttribute('href')).to.equal(hash);
//   expect(a.getAttribute('data-modal-hash')).to.equal(hash);
//   expect(a.getAttribute('data-modal-path')).to.equal('/testpage/');
//   expect(a.getAttribute('style')).to.equal('display: none');
//   expect(a.classList.contains('modal')).to.be.true;
//   expect(a.classList.contains('link-block')).to.be.true;
//   a.remove();
// });

// it('creates and opens the delayed modal', async () => {
//   const a = document.createElement('a');
//   decorateDelayedModalAnchor({
//     a,
//     hash,
//     pathname: '/testpage',
//   });
//   document.body.appendChild(a);
//   showModalWithDelay({
//     delay: '1',
//     displayMode: DISPLAY_MODE.oncePerPageLoad,
//     hash,
//   });
//   const delayedModal = await waitForElement(hash);
//   expect(delayedModal).to.exist;
//   delayedModal.remove();
//   a.remove();
//   window.location.hash = '';
// });

// it('does not open a delayed modal if it should be displayed once per session and was already displayed', async () => {
//   const a = document.createElement('a');
//   window.sessionStorage.removeItem('wasDelayedModalShown');
//   decorateDelayedModalAnchor({
//     a,
//     hash,
//     pathname: '/testpage',
//   });
//   document.body.appendChild(a);
//   showModalWithDelay({
//     delay: '1',
//     displayMode: DISPLAY_MODE.oncePerSession,
//     hash,
//   });
//   const delayedModal = await waitForElement(hash);
//   expect(delayedModal).to.exist;
//   expect(window.sessionStorage.getItem('wasDelayedModalShown')).to.equal('true');
//   delayedModal.remove();

//   showModalWithDelay({
//     delay: '1',
//     displayMode: DISPLAY_MODE.oncePerSession,
//     hash,
//   });
//   await delay(900);
//   expect(document.querySelector(hash)).to.not.exist;
//   a.remove();
//   window.sessionStorage.removeItem('wasDelayedModalShown');
// });
