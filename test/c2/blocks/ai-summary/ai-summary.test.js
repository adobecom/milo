import { setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../../libs/c2/blocks/ai-summary/ai-summary.js';
import { loadBlock, setConfig } from '../../../../libs/utils/utils.js';

describe('AI Summary', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('preserves the optional image and authored heading, paragraphs, and bullets', () => {
    document.body.innerHTML = `
      <div class="ai-summary">
        <div><div><picture><img src="data:," alt="Article overview"></picture></div></div>
        <div><div>
          <h2>Key takeaways</h2>
          <p>An introduction to the summary.</p>
          <ul><li>First takeaway</li><li><a href="/blog/example">Second takeaway</a></li></ul>
        </div></div>
      </div>`;
    const block = document.querySelector('.ai-summary');
    const picture = block.querySelector('picture');
    const heading = block.querySelector('h2');
    init(block);

    expect(block.querySelector('.ai-summary-image picture')).to.equal(picture);
    expect(picture.querySelector('img').alt).to.equal('Article overview');
    expect(block.querySelector('.ai-summary-content h2')).to.equal(heading);
    expect(heading.classList.contains('heading-5')).to.equal(true);
    expect(block.querySelector('.ai-summary-image .body-lg')).to.not.exist;
    expect(block.querySelector('.ai-summary-content p').classList.contains('body-lg')).to.equal(true);
    expect(block.querySelector('.ai-summary-content p').textContent).to.equal('An introduction to the summary.');
    expect(block.querySelectorAll('.ai-summary-content li').length).to.equal(2);
    expect(block.querySelector('a').getAttribute('href')).to.equal('/blog/example');
  });

  it('decorates each authored viewport and swaps them on resize', async () => {
    const { innerWidth: width, innerHeight: height } = window;
    document.body.innerHTML = `
      <div class="ai-summary">
        <div><div>mobile-viewport</div></div>
        <div><div><h2>Mobile takeaways</h2><p>Short.</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div><picture><img src="data:," alt=""></picture></div></div>
        <div><div><h2>Desktop takeaways</h2><p>Long.</p></div></div>
      </div>`;
    const block = document.querySelector('.ai-summary');
    await setViewport({ width: 600, height });
    try {
      init(block);
      expect(block.querySelector('.ai-summary-content h2').textContent).to.equal('Mobile takeaways');
      expect(block.querySelector('.ai-summary-image')).to.not.exist;
      await setViewport({ width: 1300, height });
      await new Promise((resolve) => { requestAnimationFrame(resolve); });
      expect(block.querySelector('.ai-summary-image picture')).to.exist;
      expect(block.querySelector('.ai-summary-content h2').classList.contains('heading-5')).to.be.true;
      expect(block.querySelector('.ai-summary-content p').classList.contains('body-lg')).to.be.true;
    } finally {
      await setViewport({ width, height });
    }
  });

  it('supports authored content without an image', () => {
    document.body.innerHTML = `
      <div class="ai-summary">
        <div><div><h2>Key takeaways</h2><p>A paragraph-only summary.</p></div></div>
      </div>`;
    const block = document.querySelector('.ai-summary');
    init(block);

    expect(block.querySelector('.ai-summary-image')).to.not.exist;
    expect(block.querySelector('.ai-summary-content h2').textContent).to.equal('Key takeaways');
    expect(block.querySelector('.ai-summary-content p').textContent).to.equal('A paragraph-only summary.');
  });

  it('loads the shared block from the Milo C2 directory on a foundation=c2 page', async () => {
    setConfig({
      codeRoot: '/consumer-site',
      miloLibs: '/libs',
      locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
    });
    const foundation = document.createElement('meta');
    foundation.name = 'foundation';
    foundation.content = 'c2';
    document.head.append(foundation);
    document.body.innerHTML = `
      <div class="ai-summary"><div><div><h2>Key takeaways</h2><p>Summary content.</p></div></div></div>`;
    const block = document.querySelector('.ai-summary');
    try {
      await loadBlock(block);

      expect(block.dataset.reason).to.be.undefined;
      expect(block.dataset.blockStatus).to.equal('loaded');
      expect(block.querySelector('.ai-summary-content h2')).to.exist;
      expect(document.querySelector('link[href="/libs/c2/blocks/ai-summary/ai-summary.css"]')).to.exist;
    } finally {
      foundation.remove();
    }
  });
});
