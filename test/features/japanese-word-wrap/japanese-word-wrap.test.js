import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const { controlLineBreaksJapanese } = await import('../../../libs/features/japanese-word-wrap.js');

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
    });
  });

  it('Apply JP word wrap to all headings (h1-h6) under div#area', async () => {
    const area = document.getElementById('area');
    await controlLineBreaksJapanese(config, area);
    area.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
    });
  });

  it('Apply JP word wrap to H1', async () => {
    await controlLineBreaksJapanese(config, document, 'h1');
    document.querySelectorAll('h1').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).to.equal('keep-all', 'JP word wrap is not applied');
    });
  });

  it('Do not apply JP word wrap to paragraphs (p)', async () => {
    await controlLineBreaksJapanese(config);
    document.querySelectorAll('p').forEach((elem) => {
      expect(window.getComputedStyle(elem).wordBreak).not.equal('keep-all', 'JP word wrap is applied');
    });
  });
});
