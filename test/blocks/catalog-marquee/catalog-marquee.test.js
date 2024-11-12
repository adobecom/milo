import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { loadStyle, setConfig } from '../../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, decorateText, extendButtonsClass, decorateFeatures, appendFeatures } = await import('../../../libs/blocks/catalog-marquee/catalog-marquee.js');
const catalogMarquee = document.querySelector('#catalog-marquee');
const catalogMarqueeMnemBusiness = document.querySelector('#mnemonics-and-features');
const catalogMarqueeMnemonics = document.querySelector('#mnemonics');
const catalogMarqueeText = document.querySelector('#text');
const conf = { base: 'http://localhost:2000/' };
setConfig(conf);
window.lana = { log: stub() };

describe('catalog-marquee', () => {
  before(async () => {
    await new Promise((resolve) => {
      loadStyle('../../../../libs/styles/styles.css', resolve);
    });
    await new Promise((resolve) => {
      loadStyle('../../../../libs/blocks/marquee/marquee.css', resolve);
    });
  });

  it('sets a proper heading class', () => {
    const headings = catalogMarqueeText.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const heading = headings[headings.length - 1];
    decorateText(catalogMarqueeText);
    expect(heading.classList.contains('heading-l')).to.be.true;
  });

  it('sets a proper button class', () => {
    const buttons = catalogMarqueeText.querySelectorAll('.con-button');
    extendButtonsClass(catalogMarqueeText);
    buttons.forEach((btn) => {
      expect(btn.classList.contains('button-justified-mobile')).to.have.true;
    });
  });

  it('decorates features', async () => {
    const children = catalogMarqueeMnemonics.querySelectorAll(':scope > div');
    const foreground = children[children.length - 1];
    const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
    const text = headline.closest('div');
    const paragraphs = Array.from(foreground.querySelectorAll(':scope p:not([class])'));
    const headingsIndexes = paragraphs.flatMap((elem, i) => (elem.querySelector('strong') && !elem.querySelector('picture') ? i : []));
    const mnemonics = paragraphs.splice(...headingsIndexes);
    const actionArea = text.querySelector('.action-area');
    decorateFeatures(mnemonics, text, actionArea);
    const mnemonicLists = text.querySelectorAll('.mnemonic-list');
    expect(mnemonicLists.length === 1).to.be.true;
    const mnemonicList = mnemonicLists[0];
    expect(mnemonicList).to.exist;
    const productList = mnemonicList.querySelector('.product-list');
    expect(productList).to.exist;
    const [heading, ...productItems] = productList.querySelectorAll('.product-item');
    expect(heading.querySelector('strong')).to.exist;
    expect(heading.querySelector('picture')).to.not.exist;
    productItems.forEach((item) => {
      expect(item.querySelector('strong')).to.exist;
      expect(item.querySelector('picture')).to.exist;
    });
  });

  it('appends features', async () => {
    const children = catalogMarqueeMnemBusiness.querySelectorAll(':scope > div');
    const foreground = children[children.length - 1];
    const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
    const text = headline.closest('div');
    const promiseArr = [];
    appendFeatures(catalogMarqueeMnemBusiness, foreground, text, promiseArr);
    expect(promiseArr.length === 1).to.be.true;
    const lists = catalogMarqueeMnemBusiness.querySelectorAll('.mnemonic-list');
    expect(lists.length === 2).to.be.true;
    lists.forEach((list) => {
      const productList = list.querySelector('.product-list');
      expect(productList).to.exist;
      const [heading, ...productItems] = productList.querySelectorAll('.product-item');
      expect(heading.querySelector('strong')).to.exist;
      expect(heading.querySelector('picture')).to.not.exist;
      productItems.forEach((item) => {
        expect(item.querySelector('strong')).to.exist;
        expect(item.querySelector('picture')).to.exist;
      });
    });
  });

  it('sets `foreground`, `background` and `text` classes', () => {
    init(catalogMarquee);
    const children = catalogMarquee.querySelectorAll(':scope > div');
    expect(children[0].classList.contains('background'));
    const foreground = children[children.length - 1];
    expect(foreground.classList.contains('foreground', 'container')).be.true;
    const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
    const text = headline.closest('div');
    expect(text.classList.contains('text')).to.be.true;
  });
});
