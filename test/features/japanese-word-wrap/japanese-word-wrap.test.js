import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const { default: controlLineBreaksJapanese } = await import('../../../libs/features/japanese-word-wrap.js');

const codeRoot = '/libs';
const conf = { codeRoot };
setConfig(conf);
const config = getConfig();

describe('Japanese Word Wrap', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  it('Apply JP word wrap to all headings (h1-h6)', async () => {
    await controlLineBreaksJapanese(config);
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
      expect(elem.innerHTML).to.include('<wbr>', 'JP word wrap is not applied');
    });
  });

  it('Apply JP word wrap to all headings (h1-h6) under div#area', async () => {
    const scopeArea = document.getElementById('area');
    await controlLineBreaksJapanese(config, { scopeArea });
    scopeArea.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
      expect(elem.innerHTML).to.include('<wbr>', 'JP word wrap is not applied');
    });
  });

  it('Apply JP word wrap to H1', async () => {
    await controlLineBreaksJapanese(config, {
      scopeArea: document,
      budouxSelector: 'h1',
    });
    document.querySelectorAll('h1').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
      expect(elem.innerHTML).to.include('<wbr>', 'JP word wrap is not applied');
    });
    document.querySelectorAll('h2').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).not.equal('keep-all', 'JP word wrap should not be applied');
    });
  });

  it('Do not apply JP word wrap to paragraphs (p) as default', async () => {
    await controlLineBreaksJapanese(config);
    document.querySelectorAll('p').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).not.equal('keep-all', 'JP word wrap is applied');
    });
  });

  it('Apply balance word wrap to H1', async () => {
    await controlLineBreaksJapanese(config, {
      budouxSelector: 'h1',
      bwSelector: 'h1',
    });
    document.querySelectorAll('h1').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
      elem.querySelectorAll('wbr').forEach((wbr) => {
        expect(wbr.classList.length).to.greaterThan(0, 'Balance word wrap should be applied');
      });
    });
    document.querySelectorAll('h2').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).not.equal('keep-all', 'JP word wrap should not be applied');
    });
  });

  it('Prevent line break with specific patterns by using lineBreakNgPatterns option', async () => {
    await controlLineBreaksJapanese(config, {
      budouxSelector: '#h1-headline',
      lineBreakNgPatterns: ['Franklinベースの#ウェブサイト'],
    });
    const elem = document.querySelector('#h1-headline');
    expect(elem.innerHTML).include('Franklinベースのウェブサイト');
  });

  it('Allow line break with specific patterns by using lineBreakOkPatterns option', async () => {
    await controlLineBreaksJapanese(config, {
      budouxSelector: '#h1-headline',
      lineBreakOkPatterns: ['共有#機能'],
    });
    const elem = document.querySelector('#h1-headline');
    expect(elem.innerHTML).include('共有<wbr>機能');
  });

  it('Work properly even when an invalid pattern is specified', async () => {
    await controlLineBreaksJapanese(config, {
      budouxSelector: '#h1-headline',
      lineBreakOkPatterns: ['共有機能'],
      lineBreakNgPatterns: ['共有'],
    });
    const elem = document.querySelector('#h1-headline');
    expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
    expect(elem.innerHTML).to.include('<wbr>', 'JP word wrap is not applied');
  });

  it('Change budouxThres value correctly', async () => {
    await controlLineBreaksJapanese(config, {
      budouxSelector: '#h1-headline',
      budouxThres: 100000,
    });
    const elem = document.querySelector('#h1-headline');
    expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
    expect(elem.innerHTML).not.include('<wbr>', '<wbr> should not appear');
  });
});
