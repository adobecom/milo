/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../helpers/selectors.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Decorating', () => {
  before(async () => {
    await import('../../../libs/scripts/scripts.js');
  });

  it('Decorates auto blocks', async () => {
    const autoBlock = document.querySelector('a[class]');
    expect(autoBlock.className).to.equal('adobetv link-block');
  });

  it('Decorates modal link', async () => {
    const modalLink = document.querySelector('a[data-modal-path]');
    expect(modalLink.dataset.modalPath).to.equal('/fragments/mock');
  });

  it('modal test', async () => {
    window.location.hash = '#play-video';
    await waitForElement('dialog');
    const modal = document.querySelector('dialog');
    expect(modal).to.exist;
  });
});

//   it('Decorates pictures', async () => {
//     const pics = document.querySelectorAll('picture');
//     expect(pics[0].parentElement.nodeName).to.equal('P');
//     expect(pics[1].parentElement.nodeName).to.equal('P');
//   });

//   it('Decorates relative links', async () => {
//     const links = document.querySelectorAll('a');
//     expect(links[0].href).to.equal('http://localhost:2000/test');
//     expect(links[1].href).to.equal('http://localhost:2000/test');
//   });

//   it('Decorates SVGs', async () => {
//     const svgs = document.querySelectorAll('[src$="svg"]');
//     expect(svgs.length).to.equal(2);
//     expect(svgs[0].src).to.equal('http://localhost:2000/img/favicon.svg');
//     expect(svgs[1].parentElement.parentElement.href).to.equal('https://www.adobe.com/');
//   });



//   // it('Decorates no nav', () => {
//   //   const meta = utils.createTag('meta', { name: 'header', content: 'off' });
//   //   document.head.append(meta);
//   //   utils.decorateNavs();
//   //   expect(document.body.classList.contains('nav-off')).to.be.true;
//   // });


// describe('Loading', () => {
//   before(() => {
//     sinon.spy(console, 'log');
//   });

//   after(() => {
//     console.log.restore();
//   });

//   it('Doesnt load a block twice', async () => {
//     const hero = await utils.loadBlock(document.querySelector('.hero'));
//     expect(hero.dataset.status).to.be.undefined;
//   });

//   it('Doesnt load a bad block', async () => {
//     const bad = document.querySelector('#not-block');
//     await utils.loadBlock(bad);
//     expect(bad.dataset.failed).to.equal('true');
//   });

//   it('loadDelayed() test - expect moduled', async () => {
//     const mod = await utils.loadDelayed(0);
//     expect(mod).to.exist;
//   });

//   it('loadDelayed() test - expect nothing', async () => {
//     document.head.querySelector('meta[name="interlinks"]').remove();
//     const mod = await utils.loadDelayed(0);
//     expect(mod).to.be.null;
//   });

//   it('modal test', () => {
//     const modal = document.querySelector('dialog');
//     expect(modal).to.not.exist;
//   });
// });

// describe('Utilities', () => {
//   it('Extracts metadata', () => {
//     expect(utils.getMetadata('og:title')).to.equal('Milo');
//     expect(utils.getMetadata('description')).to.equal('Website foundation technology.');
//   });

//   it('Makes relative URLs', () => {
//     const emdashHref = 'https://main—milo—adobecom.hlx.page/img/bg-dots.svg';
//     const relativeUrl = utils.makeRelative(emdashHref);
//     expect(relativeUrl).to.equal('/img/bg-dots.svg');
//   });
// });
