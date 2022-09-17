/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile, setViewport, sendKeys, sendMouse } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import { setConfig, createTag } from '../../../libs/utils/utils.js';

window.lana = { log: stub() };

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const mod = await import('../../../libs/blocks/gnav/gnav.js');
const searchMod = await import('../../../libs/blocks/gnav/gnav-search.js');
let gnav;
const config = {};
setConfig(config);

describe('Gnav', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('test wrong gnav', async () => {
    gnav = await mod.default(document.querySelector('header'));
    expect(gnav).to.be.not.null;
  });

  it('builds breadcrumbs nav element', async () => {
    expect(document.querySelector('header nav.breadcrumbs')).to.exist;
  });

  it('nav menu toggle test', async () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav.gnav');
    const gnavBtn = nav.querySelector('button');
    const largeMenu = document.querySelector('.gnav-navitem.section-menu');
    const largeMenuBtn = largeMenu.querySelector(':scope > a');

    // for mobile
    await setViewport({ width: 400, height: 640 });
    gnavBtn.click();
    expect(header.classList.contains(mod.IS_OPEN)).to.be.true;
    gnavBtn.click();
    expect(header.classList.contains(mod.IS_OPEN)).to.be.false;
    gnavBtn.click();
    await setViewport({ width: 1250, height: 640 });

    // for desktop
    largeMenuBtn.click();
    expect(largeMenu.classList.contains(mod.IS_OPEN)).to.be.true;
    largeMenuBtn.click();
    expect(largeMenu.classList.contains(mod.IS_OPEN)).to.be.false;
    expect(largeMenu.querySelector('.section.last-link-blue')).to.exist;
  });

  it('nav menu toggle test - 1', async () => {
    const largeMenuBtn = document.querySelector('.gnav-navitem.section-menu > a');
    largeMenuBtn.focus();
    await sendKeys({ press: 'Space' });
    const largeMenu = document.querySelector('.gnav-navitem.section-menu');
    // expect(largeMenu.classList.contains(mod.IS_OPEN)).to.be.true;
  });

  it('nav menu toggle test - 2', async () => {
    const largeMenuBtn = document.querySelector('.gnav-navitem.section-menu > a');
    largeMenuBtn.blur();
    await sendKeys({ press: 'Escape' });
    const largeMenu = document.querySelector('.gnav-navitem.section-menu');
    expect(largeMenu.classList.contains(mod.IS_OPEN)).to.be.false;
    largeMenuBtn.click();
    expect(largeMenu.classList.contains(mod.IS_OPEN)).to.be.true;
    await sendMouse({
      type: 'click',
      position: [700, 300],
      button: 'left',
    });
    expect(largeMenu.classList.contains(mod.IS_OPEN)).to.be.false;
  });

  it('search', async () => {
    await gnav.loadSearch();
    const search = document.querySelector('.gnav-search');
    const searchButton = document.querySelector('.gnav-search-button');
    const searchInput = document.querySelector('.gnav-search-input');
    searchButton.click();
    expect(search.classList.contains(mod.IS_OPEN)).to.be.true;

    // search result
    expect(typeof searchMod.fetchBlogArticleIndex()).to.equal('object');
    window.blogIndex = window.blogIndex || {
      data: [],
      byPath: {},
      offset: 0,
      complete: false,
    };
    await searchMod.addSegmentToIndex('/test/blocks/gnav/mocks/query-index.json?limit=206&offset=1000', window.blogIndex, 206);
    searchInput.focus();
    await sendKeys({ type: 'a b' });
    expect(search.querySelector('.gnav-search-results').childElementCount).to.not.equal(0);
    await sendKeys({ type: 'This is just for testing to get 0 result' });
    expect(search.querySelector('.gnav-search-results').childElementCount).to.equal(0);
  });

  it('createOptimizedPicture test', () => {
    const picture = searchMod.createOptimizedPicture('/test/scripts/mocks/media_.png');
    expect(picture.querySelector('source').media).to.be.not.empty;
  });

  // gnav-utils
  it('createTag test', () => {
    const tag = createTag('div', { class: 'test' }, document.createElement('div'));
    expect(tag instanceof HTMLElement).to.be.true;
  });
});
