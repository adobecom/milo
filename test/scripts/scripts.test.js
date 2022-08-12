/* eslint-disable no-unused-expressions */
/* global describe before after it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const scripts = {};
const utils = {};

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Decorating', () => {
  before(async () => {
    const mod = await import('../../libs/scripts/scripts.js');
    Object.keys(mod).forEach((func) => {
      scripts[func] = mod[func];
    });

    const utilsMod = await import('../../libs/utils/utils.js');
    Object.keys(utilsMod).forEach((func) => {
      utils[func] = utilsMod[func];
    });
  });

  it('Decorates blocks', async () => {
    const blocks = document.querySelectorAll('body > main > .section > [class]');
    expect(blocks.length).to.equal(4);
    expect(blocks[0].classList.length).to.equal(3);
  });

  it('Decorates pictures', async () => {
    const pics = document.querySelectorAll('picture');
    expect(pics[0].parentElement.nodeName).to.equal('P');
    expect(pics[1].parentElement.nodeName).to.equal('P');
  });

  it('Decorates relative links', async () => {
    const links = document.querySelectorAll('a');
    expect(links[0].href).to.equal('http://localhost:2000/test');
    expect(links[1].href).to.equal('http://localhost:2000/test');
  });

  it('Decorates SVGs', async () => {
    const svgs = document.querySelectorAll('[src$="svg"]');
    expect(svgs.length).to.equal(2);
    expect(svgs[0].src).to.equal('http://localhost:2000/img/favicon.svg');
    expect(svgs[1].parentElement.parentElement.href).to.equal('https://www.adobe.com/');
  });

  it('Decorates auto blocks', async () => {
    const autoBlock = document.querySelector('a[class]');
    expect(autoBlock.className).to.equal('youtube link-block');
  });

  it('Decorates modal link', async () => {
    const modalLink = document.querySelector('a[data-modal-path]');
    expect(modalLink.dataset.modalPath).to.equal('/fragments/mock');
  });
});

describe('Loading', () => {
  before(() => {
    sinon.spy(console, 'log');
  });

  after(() => {
    console.log.restore();
  });

  it('Doesnt load a block twice', async () => {
    const hero = await utils.loadBlock(document.querySelector('.hero'));
    expect(hero.dataset.status).to.be.undefined;
  });

  it('Doesnt load a bad block', async () => {
    const bad = document.querySelector('#not-block');
    await utils.loadBlock(bad);
    expect(bad.dataset.failed).to.equal('true');
  });

  it('Removes LCP block out of block list', async () => {
    const blocks = [...document.querySelectorAll('body > main > .section > [class]')];
    await utils.loadLCP({ blocks });
    expect(blocks.length).to.equal(3);
  });

  it('loadDelayed() test', async () => {
    const mod = await utils.loadDelayed(0);
    expect(mod).to.exist;
  });

  it('modal test', () => {
    const modal = document.querySelector('dialog');
    expect(modal).to.not.exist;
  });
});

describe('Utilities', () => {
  it('Extracts metadata', () => {
    expect(utils.getMetadata('og:title')).to.equal('Milo');
    expect(utils.getMetadata('description')).to.equal('Website foundation technology.');
  });

  it('Makes relative URLs', () => {
    const emdashHref = 'https://main—milo—adobecom.hlx.page/img/bg-dots.svg';
    const relativeUrl = utils.makeRelative(emdashHref);
    expect(relativeUrl).to.equal('/img/bg-dots.svg');
  });
});
