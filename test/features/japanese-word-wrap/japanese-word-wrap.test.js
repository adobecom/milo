import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const {
  applyJapaneseLineBreaks,
  isBalancedWordWrapApplied,
  isWordWrapApplied,
  default: controlJapaneseLineBreaks,
} = await import('../../../libs/features/japanese-word-wrap.js');

const codeRoot = '/libs';
const conf = { codeRoot };
setConfig(conf);
const config = getConfig();

describe('Japanese Word Wrap', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  it('Apply JP word wrap to specified headings and paragraph under div#main', async () => {
    await applyJapaneseLineBreaks(config);
    document.querySelectorAll('#main > :where(h1, h2, h3, h4, h5, h6, p)').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should be appied').to.be.true;
    });
  });

  it('Apply JP word wrap to specified headings and paragraph under div#areaa', async () => {
    const scopeArea = document.getElementById('area');
    await applyJapaneseLineBreaks(config, { scopeArea });
    scopeArea.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should be appied').to.be.true;
    });
    const elem = document.querySelector('#h1-headline');
    expect(isWordWrapApplied(elem), 'JP Word Wrap should not be appied').to.be.false;
  });

  it('Exclude specified selector from applying JP word wrap under div#main', async () => {
    await applyJapaneseLineBreaks(config, { budouxExcludeSelector: 'p' });
    document.querySelectorAll('#main > :where(h1, h2, h3, h4, h5, h6)').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should be appied').to.be.true;
    });
    document.querySelectorAll('#main > p').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should not be appied').to.be.false;
    });
  });

  it('Should not apply JP word wrap to elements under class jpwordwrap-disabled', async () => {
    await applyJapaneseLineBreaks(config);
    document.querySelectorAll('.jpwordwrap-disabled > :where(h1, h2, h3, h4, h5, h6)').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should not be appied').to.be.false;
    });
  });

  it('Apply balanced word wrap to specified elements under div#main', async () => {
    await applyJapaneseLineBreaks(config, {
      bwEnabled: true,
      bwDisabledSelector: 'p',
    });
    document.querySelectorAll('#main > :where(h1, h2, h3, h4, h5, h6)').forEach((elem) => {
      expect(isBalancedWordWrapApplied(elem), 'Balance word wrap should be applied').to.be.true;
    });
    document.querySelectorAll('#main > p').forEach((elem) => {
      expect(isBalancedWordWrapApplied(elem), 'Balance word wrap should not be applied').to.be.false;
    });
  });

  it('Prevent line breaks for specified patterns', async () => {
    await applyJapaneseLineBreaks(config, { lineBreakNgPatterns: ['Miloは、#adobe.com', 'Franklinベースの#ウェブサイト'] });
    const elem = document.querySelector('#h1-headline');
    expect(elem.innerHTML).include('Franklinベースのウェブサイト', '<wbr> should not appear');
    expect(elem.innerHTML).include('Miloは、adobe.com', '<wbr> should not appear');
  });

  it('Allow allow line breaks for specified patterns', async () => {
    await applyJapaneseLineBreaks(config, { lineBreakOkPatterns: ['共有#機能', 'ウェブ#サイト'] });
    const elem = document.querySelector('#h1-headline');
    expect(elem.innerHTML).include('共有<wbr>機能', '<wbr> should appear');
    expect(elem.innerHTML).include('ウェブ<wbr>サイト', '<wbr> should appear');
  });

  it('Handle invalid pattern specification gracefully', async () => {
    await applyJapaneseLineBreaks(config, {
      lineBreakOkPatterns: ['共有機能', '共#有機能'],
      lineBreakNgPatterns: ['共有', '共有##機能', 'ウェブ#サイト共有#機能'],
    });
    const elem = document.querySelector('#h1-headline');
    expect(isWordWrapApplied(elem), 'JP Word Wrap should be appied').to.be.true;
  });

  it('Respect budouxThres value in configuration', async () => {
    await applyJapaneseLineBreaks(config, { budouxThres: Number.MAX_VALUE });
    const elem = document.querySelector('#h1-headline');
    expect(isWordWrapApplied(elem), 'JP Word Wrap should not be appied').to.be.false;
  });

  it('Read options from metadata correctly', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    await controlJapaneseLineBreaks(config);

    // jpwordwrap:budoux-exclude-selector works correctly
    document.querySelectorAll('#main > :where(h1, h2, h3, h4, h5, h6)').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should be appied').to.be.true;
      expect(isBalancedWordWrapApplied(elem), 'Balance word wrap should be applied').to.be.true;
    });
    document.querySelectorAll('#main > p').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should be appied').to.be.true;
      expect(isBalancedWordWrapApplied(elem), 'Balance word wrap should not be applied').to.be.false;
    });

    // jpwordwrap:line-break-ok work correctly
    const elem = document.querySelector('#paragraph');
    expect(elem.innerHTML).include('共有<wbr>機能', '<wbr> should appear');
    expect(elem.innerHTML).include('ウェブ<wbr>サイト', '<wbr> should appear');
  });

  it('Disbale JP word wrap from options correctly', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-disabled.html' });
    await controlJapaneseLineBreaks(config);

    // jpwordwrap:disabled works correctly
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((elem) => {
      expect(isWordWrapApplied(elem), 'JP Word Wrap should not be appied').to.be.false;
      expect(isBalancedWordWrapApplied(elem), 'Balance word wrap should not be applied').to.be.false;
    });
  });
});
