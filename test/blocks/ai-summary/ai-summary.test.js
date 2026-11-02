import { expect } from '@esm-bundle/chai';
import init from '../../../libs/blocks/ai-summary/ai-summary.js';
import { loadBlock, setConfig } from '../../../libs/utils/utils.js';

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
    expect(block.querySelector('.ai-summary-content p').textContent).to.equal('An introduction to the summary.');
    expect(block.querySelectorAll('.ai-summary-content li').length).to.equal(2);
    expect(block.querySelector('a').getAttribute('href')).to.equal('/blog/example');
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

  it('loads the shared block from Milo on a consuming site', async () => {
    setConfig({
      codeRoot: '/consumer-site',
      miloLibs: '/libs',
      locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
    });
    document.body.innerHTML = `
      <div class="ai-summary"><div><div><h2>Key takeaways</h2><p>Summary content.</p></div></div></div>`;
    const block = document.querySelector('.ai-summary');
    await loadBlock(block);

    expect(block.dataset.blockStatus).to.equal('loaded');
    expect(block.querySelector('.ai-summary-content h2')).to.exist;
    expect(document.querySelector('link[href="/libs/blocks/ai-summary/ai-summary.css"]')).to.exist;
  });
});
