import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getConfig, loadStyle } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';
import { watchForMasContent, unwatchForMasContent } from '../../../libs/features/mep/mep-next/mep-mas.js';

import init from '../../../libs/c2/blocks/rich-content/rich-content.js';

describe('Rich Content', () => {
  describe('MAS fields', () => {
    let stylesheet;
    let originalViewport;
    let originalMep;
    before(async () => {
      await new Promise((resolve, reject) => {
        loadStyle('/libs/c2/blocks/rich-content/rich-content.css', (status) => {
          if (status === 'error') reject(new Error('Failed to load Rich Content styles'));
          else resolve();
        });
      });
      stylesheet = document.head.querySelector('link[href="/libs/c2/blocks/rich-content/rich-content.css"]');
    });
    after(() => stylesheet.remove());
    beforeEach(() => {
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
      originalMep = getConfig().mep;
      getConfig().mep = { ...originalMep, preview: true };
    });
    afterEach(async () => {
      unwatchForMasContent();
      delete document.body.dataset.mepMasHighlight;
      sinon.restore();
      getConfig().mep = originalMep;
      await setViewport(originalViewport);
    });

    it('preserves inherited MAS fields and Studio URLs across viewports', async () => {
      document.body.innerHTML = `<div class="rich-content">
        <div><div>mobile-viewport</div></div>
        <div><div><h2><mas-field field="cardTitle" data-mas-block="inline"><span data-role="mas-field-content">"Creative apps</span></mas-field></h2>
        <p><mas-field field="shortDescription" data-mas-block="inline"><span data-role="mas-field-content">Body copy</span></mas-field></p></div></div>
        <div><div>tablet-viewport</div></div><div><div></div></div>
        <div><div>desktop-viewport</div></div><div><div></div></div>
        </div>`;
      const block = document.querySelector('.rich-content');
      const fields = [...block.querySelectorAll('mas-field')];
      fields.forEach((field, index) => {
        mepMasStudioUrls.set(field, `https://mas.adobe.com/studio.html#query=rich-content-${index}`);
      });
      const open = sinon.stub(window, 'open');
      document.body.dataset.mepMasHighlight = 'true';
      watchForMasContent();
      init(block);

      for (const width of [375, 1000, 1440]) {
        await setViewport({ width, height: 900 });
        await new Promise((resolve) => { requestAnimationFrame(resolve); });
        const renderedFields = [...block.querySelectorAll('mas-field')];
        expect(renderedFields.length).to.equal(2);
        expect(block.querySelector('.content h2 mas-field')).to.equal(renderedFields[0]);
        expect(renderedFields[1].parentElement.tagName).to.equal('DIV');
        renderedFields.forEach((field, index) => {
          const url = `https://mas.adobe.com/studio.html#query=rich-content-${index}`;
          expect(mepMasStudioUrls.get(field)).to.equal(url);
          const rect = sinon.stub(field, 'getBoundingClientRect')
            .returns({ top: 100, right: 400, height: 30 });
          field.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, clientX: 300, clientY: 90 }));
          expect(open.lastCall.args).to.deep.equal([url, '_blank', 'noopener,noreferrer']);
          rect.restore();
        });
      }
    });

    it('preserves quoted MAS headings, events and Studio editing', () => {
      document.body.innerHTML = `<div class="rich-content"><div><div>
        <h2><mas-field field="cardTitle" data-mas-block="inline"><span data-role="mas-field-content">"Creative apps</span></mas-field></h2>
        <p>Body copy.</p></div></div></div>`;
      const block = document.querySelector('.rich-content');
      const field = block.querySelector('mas-field');
      const content = field.firstElementChild;
      const ready = sinon.spy();
      field.addEventListener('mas:ready', ready);
      const url = 'https://mas.adobe.com/studio.html#query=rich-content&field=cardTitle';
      mepMasStudioUrls.set(field, url);
      const open = sinon.stub(window, 'open');
      document.body.dataset.mepMasHighlight = 'true';
      watchForMasContent();
      init(block);

      expect(block.querySelector('.content h2 mas-field')).to.equal(field);
      expect(field.firstElementChild).to.equal(content);
      expect(block.querySelector('.opening-quote')).to.be.null;
      field.dispatchEvent(new Event('mas:ready'));
      expect(ready.calledOnce).to.be.true;
      sinon.stub(field, 'getBoundingClientRect').returns({ top: 100, right: 400, height: 30 });
      field.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, clientX: 300, clientY: 90 }));
      expect(open.lastCall.args).to.deep.equal([url, '_blank', 'noopener,noreferrer']);
      content.textContent = '"Updated title';
      expect(block.querySelector('h2').textContent).to.equal('"Updated title');
    });

    ['regular', 'media'].forEach((variant) => {
      ['before decoration', 'after decoration', 'already unwrapped'].forEach((timing) => {
        it(`normalizes ${variant} body fields resolved ${timing}`, () => {
          document.body.innerHTML = `<div class="rich-content ${variant === 'media' ? 'media' : ''}"><div><div>
            <h2>Creative apps</h2>
            <p><mas-field field="shortDescription"><span data-role="mas-field-content"></span></mas-field></p>
            <p><strong><mas-field field="ctas"><span data-role="mas-field-content"></span></mas-field></strong></p>
            </div><div><picture><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt=""></picture></div></div></div>`;
          const block = document.querySelector('.rich-content');
          const field = block.querySelector('mas-field[field="shortDescription"]');
          const cta = block.querySelector('mas-field[field="ctas"]');
          const ctaParent = cta.parentElement;
          const resolve = () => {
            field.firstElementChild.innerHTML = '<p>Apps with <span is="inline-price">US$9.99/mo</span>.</p><p><em>Terms apply.</em> <a href="/terms">See terms</a></p>';
          };
          if (timing !== 'after decoration') resolve();
          if (timing === 'already unwrapped') field.parentElement.replaceWith(field);
          init(block);
          if (timing === 'after decoration') resolve();

          const body = field.parentElement;
          expect(body.tagName).to.equal('DIV');
          expect([...body.classList].some((cls) => cls.startsWith('body-'))).to.be.true;
          expect(body.closest(variant === 'media' ? '.cta-area' : '.content')).to.exist;
          expect(block.querySelectorAll('mas-field').length).to.equal(2);
          expect(cta.parentElement).to.equal(ctaParent);
          expect(field.querySelector('[is="inline-price"]').textContent).to.equal('US$9.99/mo');
          expect(field.querySelector('a').getAttribute('href')).to.equal('/terms');
          body.style.fontSize = '22px';
          body.style.lineHeight = '30px';
          field.querySelectorAll('p').forEach((paragraph) => {
            const style = getComputedStyle(paragraph);
            expect(style.display).to.equal('inline');
            expect(style.fontSize).to.equal('22px');
            expect(style.lineHeight).to.equal('30px');
          });
          expect(getComputedStyle(field.querySelector('p + p'), '::before').content).to.equal('" "');
        });
      });
    });

    it('promotes the MAS body wrapper rather than a resolved inner paragraph', () => {
      document.body.innerHTML = `<div class="rich-content"><div><div>
        <p><mas-field field="shortDescription"><span data-role="mas-field-content"></span></mas-field></p>
        <p>Other copy.</p></div></div></div>`;
      const block = document.querySelector('.rich-content');
      const field = block.querySelector('mas-field');
      field.firstElementChild.innerHTML = '<p>Title</p><p>Copy</p>';
      init(block);
      expect(field.parentElement.classList.contains('heading-2')).to.be.true;
      expect(field.querySelector('[class*="heading-"]')).to.be.null;
    });
  });

  it('adds foreground and content classes to the first row and cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const foreground = block.children[0];
    expect(foreground.classList.contains('foreground')).to.be.true;
    expect(foreground.children[0].classList.contains('content')).to.be.true;
  });

  it('hangs an opening quote into its own span', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const heading = block.querySelector('.content h2');
    const quote = heading.querySelector('.opening-quote');
    expect(quote).to.exist;
    expect(quote.textContent).to.equal('“');
    // the quote character is removed from the heading text itself
    expect(heading.textContent).to.equal('“Great things ahead');
    expect(heading.firstElementChild).to.equal(quote);
  });

  // hangOpeningQuote matches \p{Pi} (curly quotes “ ‘, guillemets « ‹) plus a whitelist of
  // opening quotes Unicode files under Ps/Po: straight " (U+0022), German/CE-European low-9
  // „ ‚ (U+201E, U+201A), CJK corner brackets 「 『 ｢ ﹁ ﹃, full-width ＂, reversed low-9 ⹂.
  // An explicit whitelist (not \p{Ps}) keeps ( [ { from hanging; straight ' is excluded so
  // headings like "'90s nostalgia" stay intact. The cases below lock in that behaviour.
  ['"', '„', '‚', '「', '『'].forEach((mark) => {
    it(`hangs a non-Pi opening quote (${mark}) into its own span`, () => {
      document.body.innerHTML = `<main><div class="section"><div class="rich-content"><div><div>
        <h2>${mark}Localized heading</h2><p>Copy.</p></div></div></div></div></main>`;
      const block = document.querySelector('.rich-content');
      init(block);

      const quote = block.querySelector('.content h2 .opening-quote');
      expect(quote).to.exist;
      expect(quote.textContent).to.equal(mark);
      expect(block.querySelector('.content h2').firstElementChild).to.equal(quote);
    });
  });

  it("does not hang a straight single quote (') so headings like '90s stay intact", () => {
    document.body.innerHTML = `<main><div class="section"><div class="rich-content"><div><div>
      <h2>'90s nostalgia</h2><p>Copy.</p></div></div></div></div></main>`;
    const block = document.querySelector('.rich-content');
    init(block);

    expect(block.querySelector('.opening-quote')).to.be.null;
  });

  it('does not add an opening-quote span when the heading has no opening quote', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-quote.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    expect(block.querySelector('.opening-quote')).to.be.null;
  });

  it('marks a text-only second cell as the hero overlay source and sets the section variable', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const bgCell = block.children[0].children[1];
    expect(bgCell.classList.contains('hero-overlay-source')).to.be.true;

    const section = block.closest('.section');
    expect(section.style.getPropertyValue('--rc-hero-overlay').trim()).to.equal('rgba(0, 0, 0, 0.5)');
  });

  it('does not treat a second cell containing an image as an overlay source', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bg-image.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const bgCell = block.children[0].children[1];
    expect(bgCell.classList.contains('hero-overlay-source')).to.be.false;

    const section = block.closest('.section');
    expect(section.style.getPropertyValue('--rc-hero-overlay')).to.equal('');
  });

  it('promotes the first paragraph to a heading when the content has no heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/promote-heading.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const paragraphs = block.querySelectorAll('.content p');
    expect([...paragraphs[0].classList].some((c) => c.startsWith('heading-'))).to.be.true;
    expect([...paragraphs[0].classList].some((c) => c.startsWith('body-'))).to.be.false;
    // subsequent paragraphs stay body copy
    expect([...paragraphs[1].classList].some((c) => c.startsWith('body-'))).to.be.true;
  });

  it('leaves paragraphs alone when the content already has a heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-quote.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const paragraph = block.querySelector('.content p');
    expect([...paragraph.classList].some((c) => c.startsWith('heading-'))).to.be.false;
  });
});
