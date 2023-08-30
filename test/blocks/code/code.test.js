import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';

import init, { HIGHLIGHT_JS, FONT_CSS } from '../../../libs/blocks/code/code.js';

describe('Code', () => {
  beforeEach(async () => {
    window.lana = { log: () => console.log('LANA NOT STUBBED!') };
  });
  afterEach(() => {
    window.lana?.restore?.();
  });

  it('should not render code block with missing code element', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-bad.html' });
    const lanaStub = stub(window.lana, 'log');
    const codeBlock = document.querySelector('.code');
    await init(codeBlock);
    expect(lanaStub.called).to.be.true;
  });

  it('should render code block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const lanaStub = stub(window.lana, 'log');
    const loadStyle = stub()
      .withArgs(FONT_CSS)
      .returns(null);
    const highlightElement = stub();
    const loadScript = stub()
      .withArgs(HIGHLIGHT_JS)
      .callsFake(() => { window.hljs = { highlightElement }; });
    const utils = { loadStyle, loadScript };

    const codeBlock = document.querySelector('.code');
    await init(codeBlock, utils);
    expect(codeBlock.classList.contains('con-block')).to.be.true;

    const codeEl = codeBlock.querySelector('pre code');
    expect(codeEl.classList.contains('code-l')).to.be.true;
    expect(codeEl.classList.contains('javascript')).to.be.true;

    expect(lanaStub.called).to.be.false;
    expect(loadStyle.calledOnce).to.be.true;
    expect(loadScript.calledOnce).to.be.true;
    expect(highlightElement.calledOnce).to.be.true;
  });
});
