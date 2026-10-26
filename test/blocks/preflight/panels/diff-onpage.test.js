import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadStyle } from '../../../../libs/utils/utils.js';
import {
  resolveOnPage,
  highlightOnPage,
  clearHighlights,
  areHighlightsDismissed,
  setHighlightsDismissed,
} from '../../../../libs/blocks/preflight/panels/diff-onpage.js';

// loadStyle uses a load/error callback, not a promise — wrap it so getComputedStyle assertions
// below don't race the stylesheet's network fetch.
await new Promise((resolve) => {
  loadStyle('../../../../libs/blocks/preflight/panels/diff-onpage.css', resolve);
});

describe('preflight diff-onpage', () => {
  describe('resolveOnPage', () => {
    it('resolves a leaf in a plain.html-style tree with no decoration wrappers', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><p>Hello</p><p>World</p></div>';

      const el = resolveOnPage('/div[1]/p[2]', root);

      expect(el).to.exist;
      expect(el.tagName).to.equal('P');
      expect(el.textContent).to.equal('World');
    });

    it('tolerates a decoration-inserted wrapper div between levels (skips it via descendant match)', () => {
      const root = document.createElement('main');
      // Plain tree would have had <div><p>Text</p></div> — decoration wrapped the <p> in an
      // extra layout div that isn't in the original path.
      root.innerHTML = '<div><div class="decoration-wrapper"><p>Text</p></div></div>';

      const el = resolveOnPage('/div[1]/p[1]', root);

      expect(el).to.exist;
      expect(el.tagName).to.equal('P');
      expect(el.textContent).to.equal('Text');
    });

    it('tolerates decoration wrapping an <img> in a <picture> and resolves the <img> itself', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><picture><img src="/a.png" alt="A"></picture></div>';

      const el = resolveOnPage('/div[1]/img[1]', root);

      expect(el).to.exist;
      expect(el.tagName).to.equal('IMG');
      expect(el.getAttribute('src')).to.equal('/a.png');
    });

    it('resolves a block by name and text, ignoring position (robust to layout/masonry moves)', () => {
      const root = document.createElement('main');
      root.innerHTML = `
        <div class="brick"><h2>Generative AI tools</h2></div>
        <div class="brick"><h2>Fonts and stock images</h2></div>
        <div class="brick"><h2>Creative community</h2></div>`;

      const el = resolveOnPage('/div[99]/div[1]', root, 'block', 'Fonts and stock images', 'brick');

      expect(el).to.equal(root.querySelectorAll('.brick')[1]);
    });

    it('accepts a block whose text similarity is exactly the matching threshold', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div class="brick"><p>one two three four five six</p></div>';

      const el = resolveOnPage(
        '/div[1]/div[1]',
        root,
        'block',
        'one two three seven eight nine ten',
        'brick',
      );

      expect(el).to.equal(root.querySelector('.brick'));
    });

    it('returns null when no block of the given name matches the change text', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div class="brick"><h2>Completely unrelated content</h2></div>';

      const el = resolveOnPage('/div[1]/div[1]', root, 'block', 'Fonts and stock images', 'brick');

      expect(el).to.equal(null);
    });

    it('does not climb for a leaf-kind change, even when it sits inside a decorated block', () => {
      // A leaf change inside a block must resolve to the paragraph, not the block.
      const root = document.createElement('main');
      root.innerHTML = `
        <div class="section">
          <div class="columns block">
            <div><div><p>Block text</p></div></div>
          </div>
        </div>`;

      const el = resolveOnPage('/div[1]/div[1]/div[1]/div[1]/p[1]', root, 'leaf');

      expect(el).to.exist;
      expect(el.tagName).to.equal('P');
      expect(el.textContent).to.equal('Block text');
    });

    it('does not climb past a decoration-inserted default-content-wrapper for a leaf-kind change', () => {
      // Milo wraps ordinary (non-block) content in a "default-content-wrapper" div, which also
      // has a class — the resolver must not mistake that wrapper for a block and climb to it.
      const root = document.createElement('main');
      root.innerHTML = `
        <div class="section">
          <div class="default-content-wrapper">
            <p>A paragraph that will be modified.</p>
          </div>
        </div>`;

      const el = resolveOnPage('/div[1]/p[1]', root, 'leaf');
      const wrapper = root.querySelector('.default-content-wrapper');

      expect(el).to.exist;
      expect(el.tagName).to.equal('P');
      expect(el).to.not.equal(wrapper);
    });

    it('resolves a leaf-kind change with no kind specified (back-compat default) to the element itself', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div class="section"><div class="default-content-wrapper"><p>Text</p></div></div>';

      const el = resolveOnPage('/div[1]/p[1]', root);

      expect(el).to.exist;
      expect(el.tagName).to.equal('P');
    });

    it('returns null when even the outermost segment cannot be matched', () => {
      const root = document.createElement('main');
      root.innerHTML = '<article><p>Nothing to do with this path</p></article>';

      expect(resolveOnPage('/div[1]/p[1]', root)).to.equal(null);
    });

    it('returns null for an empty or malformed path without throwing', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><p>Text</p></div>';

      expect(() => resolveOnPage('', root)).to.not.throw();
      expect(resolveOnPage('', root)).to.equal(null);
      expect(() => resolveOnPage(undefined, root)).to.not.throw();
      expect(resolveOnPage('not-a-path', root)).to.equal(null);
    });

    it('returns null when root is missing', () => {
      expect(resolveOnPage('/div[1]/p[1]', null)).to.equal(null);
    });

    it('fails closed when a fallback match lands on an element with unrelated text', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><div class="decoration-wrapper"><p>Text</p></div></div>';

      const el = resolveOnPage('/div[1]/p[1]', root, undefined, 'Completely unrelated phrase');

      expect(el).to.equal(null);
    });

    it('still accepts a direct-child exact match even when expectedText is unrelated', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><p>Hello</p><p>World</p></div>';

      const el = resolveOnPage('/div[1]/p[2]', root, undefined, 'Completely unrelated phrase');

      expect(el).to.exist;
      expect(el.textContent).to.equal('World');
    });

    it('accepts a fallback match onto an image (empty textContent) regardless of expectedText', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><picture><img src="/a.png" alt="A"></picture></div>';

      const el = resolveOnPage('/div[1]/img[1]', root, undefined, 'Some unrelated alt text');

      expect(el).to.exist;
      expect(el.tagName).to.equal('IMG');
    });

    it('accepts a fallback match whose text is similar enough to expectedText', () => {
      const root = document.createElement('main');
      root.innerHTML = '<div><div class="decoration-wrapper"><p>Text</p></div></div>';

      const el = resolveOnPage('/div[1]/p[1]', root, undefined, 'Text');

      expect(el).to.exist;
      expect(el.textContent).to.equal('Text');
    });
  });

  describe('highlightOnPage', () => {
    let root;
    let lanaLogStub;

    beforeEach(() => {
      root = document.createElement('main');
      root.innerHTML = '<div><p>Kept</p><p>Old text</p><h2>New heading</h2></div>';
      document.body.append(root);
      lanaLogStub = sinon.stub();
      window.lana = { log: lanaLogStub };
    });

    afterEach(() => {
      root.remove();
      document.querySelector('.preflight-diff-highlight-control')?.remove();
      setHighlightsDismissed(false);
      delete window.lana;
      sinon.restore();
    });

    it('appends a preflight-diff-overlay child (not a class on the element itself) for a resolved added change', () => {
      const diff = {
        added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }],
        modified: [],
        removed: [],
      };

      highlightOnPage(diff, root);

      const h2 = root.querySelector('h2');
      expect(h2.classList.contains('preflight-diff-overlay')).to.equal(false);
      const overlay = h2.querySelector(':scope > .preflight-diff-overlay');
      expect(overlay).to.exist;
      expect(overlay.classList.contains('is-added')).to.equal(true);
      expect(overlay.classList.contains('is-block')).to.equal(false);
    });

    it('marks a block-kind change overlay with is-block so it gets the inset-frame treatment', () => {
      root.innerHTML = '<div class="section"><div class="marquee"><p>Block text</p></div></div>';
      const diff = {
        added: [{
          type: 'added',
          kind: 'block',
          path: '/div[1]/div[1]',
          blockName: 'marquee',
          previewText: 'Block text',
        }],
        modified: [],
        removed: [],
      };

      highlightOnPage(diff, root);

      const overlay = root.querySelector('.marquee > .preflight-diff-overlay');
      expect(overlay).to.exist;
      expect(overlay.classList.contains('is-block')).to.equal(true);
      expect(overlay.classList.contains('is-added')).to.equal(true);
    });

    it('appends a preflight-diff-overlay child with is-modified for a resolved modified change', () => {
      const diff = {
        added: [],
        modified: [{ type: 'modified', tag: 'P', path: '/div[1]/p[2]' }],
        removed: [],
      };

      highlightOnPage(diff, root);

      const p = [...root.querySelectorAll('p')][1];
      const overlay = p.querySelector(':scope > .preflight-diff-overlay');
      expect(overlay).to.exist;
      expect(overlay.classList.contains('is-modified')).to.equal(true);
    });

    it('resolves a change against change.scope instead of the page root when set', () => {
      const fragment = document.createElement('div');
      fragment.className = 'fragment';
      fragment.innerHTML = '<div><p>Fragment text</p></div>';
      root.append(fragment);
      const diff = {
        added: [{ type: 'added', tag: 'P', path: '/div[1]/p[1]', scope: fragment }],
        modified: [],
        removed: [],
      };

      highlightOnPage(diff, root);

      expect(fragment.querySelector('p > .preflight-diff-overlay')).to.exist;
      expect(root.children[0].querySelector('.preflight-diff-overlay')).to.not.exist;
    });

    it('gives an added overlay host a visually-hidden accessible label, since the overlay itself is aria-hidden', () => {
      const diff = { added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }], modified: [], removed: [] };

      highlightOnPage(diff, root);

      const h2 = root.querySelector('h2');
      const overlay = h2.querySelector(':scope > .preflight-diff-overlay');
      expect(overlay.getAttribute('aria-hidden')).to.equal('true');
      const srLabel = h2.querySelector(':scope > .preflight-diff-sr-only');
      expect(srLabel).to.exist;
      expect(srLabel.textContent).to.equal('Unpublished — new');
    });

    it('gives a modified overlay host a visually-hidden accessible label reading "changed"', () => {
      const diff = { added: [], modified: [{ type: 'modified', tag: 'P', path: '/div[1]/p[2]' }], removed: [] };

      highlightOnPage(diff, root);

      const p = [...root.querySelectorAll('p')][1];
      const srLabel = p.querySelector(':scope > .preflight-diff-sr-only');
      expect(srLabel).to.exist;
      expect(srLabel.textContent).to.equal('Unpublished — changed');
    });

    it('the overlay is a positioned, click-through, modest-z-index element sitting above sibling content', () => {
      const diff = { added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }], modified: [], removed: [] };
      highlightOnPage(diff, root);

      const overlay = root.querySelector('.preflight-diff-overlay');
      const style = window.getComputedStyle(overlay);
      expect(style.position).to.equal('absolute');
      expect(style.pointerEvents).to.equal('none');
      // Modest on purpose: the host below is isolation:isolate, so this only needs to beat the
      // block's own local layers, never the preflight modal (--modal-z-index in modal.css).
      expect(Number(style.zIndex)).to.equal(5);
      expect(Number(style.zIndex)).to.be.lessThan(100000);
    });

    it('forces a positioning context onto an unpositioned host so the overlay aligns to it, without moving it', () => {
      const diff = { added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }], modified: [], removed: [] };
      highlightOnPage(diff, root);

      const h2 = root.querySelector('h2');
      expect(h2.classList.contains('preflight-diff-highlight-relative')).to.equal(true);
      expect(window.getComputedStyle(h2).position).to.equal('relative');
    });

    it('gives the host its own isolated stacking context so the overlay cannot escape above the modal', () => {
      const diff = { added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }], modified: [], removed: [] };
      highlightOnPage(diff, root);

      const h2 = root.querySelector('h2');
      expect(h2.classList.contains('preflight-diff-highlight-isolate')).to.equal(true);
      expect(window.getComputedStyle(h2).isolation).to.equal('isolate');
    });

    it('wraps a void/replaced element (img) that cannot host an appended overlay child', () => {
      root.innerHTML = '<div><img src="/a.png" alt="A"></div>';
      const diff = { added: [{ type: 'added', tag: 'IMG', path: '/div[1]/img[1]' }], modified: [], removed: [] };

      highlightOnPage(diff, root);

      const img = root.querySelector('img');
      const wrapper = img.parentElement;
      expect(wrapper.classList.contains('preflight-diff-highlight-wrap')).to.equal(true);
      expect(wrapper.classList.contains('preflight-diff-highlight-isolate')).to.equal(true);
      expect(wrapper.querySelector(':scope > .preflight-diff-overlay.is-added')).to.exist;
      expect(window.getComputedStyle(wrapper).position).to.equal('relative');
      expect(window.getComputedStyle(wrapper).isolation).to.equal('isolate');
    });

    it('skips removed changes on the page (no overlay for them)', () => {
      const diff = {
        added: [],
        modified: [],
        removed: [{ type: 'removed', tag: 'P', path: '/div[1]/p[3]' }],
      };

      highlightOnPage(diff, root);

      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
    });

    it('skips a change that cannot be resolved, without throwing, and logs to lana', () => {
      const diff = {
        added: [{ type: 'added', tag: 'SPAN', path: '/article[1]/span[1]' }],
        modified: [],
        removed: [],
      };

      expect(() => highlightOnPage(diff, root)).to.not.throw();
      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      expect(lanaLogStub.called).to.equal(true);
      expect(lanaLogStub.firstCall.args[0]).to.include('diff-onpage');
      expect(lanaLogStub.firstCall.args[1]).to.deep.include({ tags: 'preflight' });
    });

    it('returns a cleanup function that removes every overlay and reverses any positioning/wrapping it applied', () => {
      root.innerHTML = '<div><p>Kept</p><p>Old text</p><h2>New heading</h2><img src="/a.png" alt="A"></div>';
      const diff = {
        added: [
          { type: 'added', tag: 'H2', path: '/div[1]/h2[1]' },
          { type: 'added', tag: 'IMG', path: '/div[1]/img[1]' },
        ],
        modified: [{ type: 'modified', tag: 'P', path: '/div[1]/p[2]' }],
        removed: [],
      };

      const cleanup = highlightOnPage(diff, root);
      expect(root.querySelectorAll('.preflight-diff-overlay')).to.have.length(3);
      expect(root.querySelector('.preflight-diff-highlight-wrap')).to.exist;
      expect(root.querySelector('.preflight-diff-highlight-isolate')).to.exist;

      cleanup();

      expect(root.querySelectorAll('.preflight-diff-overlay')).to.have.length(0);
      expect(root.querySelector('.preflight-diff-highlight-relative')).to.not.exist;
      expect(root.querySelector('.preflight-diff-highlight-wrap')).to.not.exist;
      expect(root.querySelector('.preflight-diff-highlight-isolate')).to.not.exist;
      // The wrapped img is back in the tree, unwrapped, in its original spot.
      expect(root.querySelector('img')).to.exist;
      expect(root.querySelector('div > img')).to.exist;
    });

    it('clears previously-applied overlays/wrappers at the start of a re-run, even without calling cleanup', () => {
      root.innerHTML = '<div><img src="/a.png" alt="A"></div>';
      const first = { added: [{ type: 'added', tag: 'IMG', path: '/div[1]/img[1]' }], modified: [], removed: [] };
      highlightOnPage(first, root);
      expect(root.querySelector('.preflight-diff-overlay')).to.exist;
      expect(root.querySelector('.preflight-diff-highlight-wrap')).to.exist;

      const second = { added: [], modified: [], removed: [] };
      highlightOnPage(second, root);

      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      expect(root.querySelector('.preflight-diff-highlight-wrap')).to.not.exist;
      expect(root.querySelector('img')).to.exist;
    });

    it('handles an empty/undefined diff without throwing', () => {
      expect(() => highlightOnPage(null, root)).to.not.throw();
      expect(() => highlightOnPage({ added: [], modified: [], removed: [] }, root)).to.not.throw();
    });
  });

  describe('word-level marks on changed elements', () => {
    let root;
    const source = (html) => Object.assign(document.createElement('p'), { innerHTML: html });
    const changed = (liveHtml, previewHtml) => ({
      added: [],
      modified: [{
        type: 'modified', kind: 'leaf', tag: 'P', path: '/div[1]/p[1]', liveEl: source(liveHtml), previewEl: source(previewHtml),
      }],
    });
    const preview = 'Starting at <strong>$29.99/mo</strong> today';
    const marks = (tag) => [...root.querySelectorAll(tag)].map((el) => el.textContent);

    beforeEach(() => {
      root = document.createElement('main');
      root.innerHTML = `<div><p>${preview}</p></div>`;
      document.body.append(root);
    });

    afterEach(() => {
      clearHighlights(root);
      root.remove();
    });

    it('marks added words and inserts removed words before them, keeping the changed frame', () => {
      highlightOnPage(changed('Starting at $19.99/mo', preview), root);

      const p = root.querySelector('p');
      expect(marks('ins')).to.deep.equal(['$29.99/mo', 'today']);
      const del = p.querySelector('del');
      expect(del.textContent).to.equal('$19.99/mo');
      expect(del.nextElementSibling.textContent).to.equal('$29.99/mo');
      expect(p.querySelector(':scope > .preflight-diff-overlay.is-modified')).to.exist;
    });

    it('treats line breaks as word boundaries and joins neighboring added words', () => {
      root.innerHTML = '<div><p>changed from live<br>HELLO</p></div>';
      highlightOnPage(changed('changed<br>HELLO', 'changed from live<br>HELLO'), root);

      expect(marks('ins')).to.deep.equal(['from live']);
      expect(marks('del')).to.deep.equal([]);
    });

    it('appends words removed from the end', () => {
      root.innerHTML = '<div><p>Buy now</p></div>';
      highlightOnPage(changed('Buy now today only', 'Buy now'), root);

      expect(root.querySelector('del').textContent).to.equal('today only');
    });

    it('keeps removed words with the text they were removed from', () => {
      root.innerHTML = '<div><p><strong>Heading</strong> Body text</p></div>';
      highlightOnPage(changed('<strong>Heading old tail</strong> Body text', '<strong>Heading</strong> Body text'), root);

      expect(root.querySelector('del').parentElement.tagName).to.equal('STRONG');
    });

    it('keeps a word whole when inline formatting splits it on the page', () => {
      root.innerHTML = '<div><p>Try Photo<strong>shop</strong> tomorrow</p></div>';
      highlightOnPage(changed('Try Photoshop today', 'Try Photo<strong>shop</strong> tomorrow'), root);

      expect(marks('ins')).to.deep.equal(['tomorrow']);
      expect(marks('del')).to.deep.equal(['today']);
    });

    it('keeps a word whole when inline formatting that split it was removed', () => {
      root.innerHTML = '<div><p>Try Photoshop tomorrow</p></div>';
      highlightOnPage(changed('Try Photo<strong>shop</strong> today', 'Try Photoshop tomorrow'), root);

      expect(marks('ins')).to.deep.equal(['tomorrow']);
      expect(marks('del')).to.deep.equal(['today']);
    });

    it('marks every part of an added word that spans inline formatting', () => {
      root.innerHTML = '<div><p>Try Photo<strong>shop</strong> today</p></div>';
      highlightOnPage(changed('Try today', 'Try Photo<strong>shop</strong> today'), root);

      expect(marks('ins')).to.deep.equal(['Photo', 'shop']);
      clearHighlights(root);
      expect(root.querySelector('p').innerHTML).to.equal('Try Photo<strong>shop</strong> today');
    });

    it('adds no word marks when the page text differs from the preview source, keeping the frame', () => {
      highlightOnPage(changed('Starting at $19.99/mo', 'Starting at {{price}} today'), root);

      const p = root.querySelector('p');
      expect(p.querySelectorAll('ins, del').length).to.equal(0);
      expect(p.querySelector(':scope > .preflight-diff-overlay.is-modified')).to.exist;
    });

    it('inserts removed text as text, never as markup', () => {
      highlightOnPage(changed('Starting at &lt;b&gt;bold&lt;/b&gt; today', preview), root);

      expect(root.querySelectorAll('b').length).to.equal(0);
      expect(root.querySelector('del').textContent).to.equal('<b>bold</b>');
    });

    it('restores the original text nodes when highlights are cleared', () => {
      highlightOnPage(changed('Starting at $19.99/mo', preview), root);
      clearHighlights(root);

      const p = root.querySelector('p');
      expect(p.textContent).to.equal('Starting at $29.99/mo today');
      expect(p.childNodes).to.have.length(3);
      expect(p.querySelector('strong').childNodes).to.have.length(1);
    });

    it('inserts words removed from the start before the first word', () => {
      root.innerHTML = '<div><p>price $10</p></div>';
      highlightOnPage(changed('Old price $10', 'price $10'), root);

      const p = root.querySelector('p');
      expect(p.firstElementChild.tagName).to.equal('DEL');
      expect(p.textContent.startsWith('Oldprice $10')).to.equal(true);
      expect(marks('del')).to.deep.equal(['Old']);
      expect(marks('ins')).to.deep.equal([]);
    });

    it('marks added words on both sides of an unchanged word separately', () => {
      root.innerHTML = '<div><p>new one same new two</p></div>';
      highlightOnPage(changed('same', 'new one same new two'), root);

      expect(marks('ins')).to.deep.equal(['new one', 'new two']);
    });

    it('does not join a word with the text of a following block element', () => {
      root.innerHTML = '<div><p>foo</p></div>';
      root.querySelector('p').append(Object.assign(document.createElement('div'), { textContent: 'baz' }));
      highlightOnPage(changed('foo<div>bar</div>', 'foo<div>baz</div>'), root);

      expect(marks('ins')).to.deep.equal(['baz']);
      expect(marks('del')).to.deep.equal(['bar']);
    });
  });

  describe('on-page Hide/Show toggle control', () => {
    let root;
    let diff;

    beforeEach(() => {
      setHighlightsDismissed(false);
      root = document.createElement('main');
      root.innerHTML = '<div><p>Kept</p><p>Old text</p><h2>New heading</h2></div>';
      document.body.append(root);
      diff = {
        added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }],
        modified: [],
        removed: [],
      };
    });

    afterEach(() => {
      root.remove();
      document.querySelector('.preflight-diff-highlight-control')?.remove();
      setHighlightsDismissed(false);
      sinon.restore();
    });

    it('injects a toggle control (labelled Hide) when highlights are applied', () => {
      highlightOnPage(diff, root);
      const control = document.querySelector('.preflight-diff-highlight-control');
      expect(control).to.exist;
      const toggle = control.querySelector('.preflight-diff-control-hide');
      expect(toggle).to.exist;
      expect(toggle.textContent).to.equal('Hide');
    });

    it('does not inject a control when there is nothing to highlight', () => {
      highlightOnPage({ added: [], modified: [] }, root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });

    it('treats a removed-only diff as nothing to highlight (removed content is not framed on-page)', () => {
      highlightOnPage({ added: [], modified: [], removed: [{ type: 'removed', tag: 'P', path: '/div[1]/p[1]' }] }, root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
    });

    it('degrades gracefully when storage is unavailable (private mode / sandboxed iframe)', () => {
      sinon.stub(Storage.prototype, 'setItem').throws(new Error('blocked'));
      expect(() => highlightOnPage(diff, root)).to.not.throw();
      expect(root.querySelector('.preflight-diff-overlay')).to.exist;
      expect(() => document.querySelector('.preflight-diff-control-hide').click()).to.not.throw();
      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
    });

    it('clicking Hide clears overlays, keeps the control as a Show toggle, and flips the session flag', () => {
      highlightOnPage(diff, root);
      document.querySelector('.preflight-diff-control-hide').click();

      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      const toggle = document.querySelector('.preflight-diff-highlight-control .preflight-diff-control-hide');
      expect(toggle).to.exist;
      expect(toggle.textContent).to.equal('Show');
      expect(areHighlightsDismissed()).to.equal(true);
    });

    it('persists the Hide state to localStorage (carries across pages/tabs until Show)', () => {
      highlightOnPage(diff, root);
      document.querySelector('.preflight-diff-control-hide').click();
      expect(localStorage.getItem('preflight-diff-hidden')).to.equal('1');
      document.querySelector('.preflight-diff-control-hide').click();
      expect(localStorage.getItem('preflight-diff-hidden')).to.equal('0');
    });

    it('clicking Show re-applies overlays, relabels back to Hide, and clears the session flag', () => {
      highlightOnPage(diff, root);
      const toggle = document.querySelector('.preflight-diff-control-hide');
      toggle.click();
      toggle.click();

      expect(root.querySelector('.preflight-diff-overlay.is-added')).to.exist;
      expect(toggle.textContent).to.equal('Hide');
      expect(areHighlightsDismissed()).to.equal(false);
    });

    it('clearHighlights removes the injected control', () => {
      highlightOnPage(diff, root);
      clearHighlights(root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });

    it('flips the label copy to "not highlighted" when hidden and back when shown', () => {
      highlightOnPage(diff, root);
      const label = document.querySelector('.preflight-diff-highlight-control .preflight-diff-control-label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Unpublished changes highlighted');
      expect(label.getAttribute('aria-live')).to.equal('polite');

      const toggle = document.querySelector('.preflight-diff-control-hide');
      toggle.click();
      expect(label.textContent).to.equal('Unpublished changes not highlighted');

      toggle.click();
      expect(label.textContent).to.equal('Unpublished changes highlighted');
    });
  });

  describe('preview-load auto-apply (FA #1)', () => {
    let root;
    const diff = { added: [{ path: '/div[1]/p[1]', kind: 'leaf', tag: 'P', previewText: 'Hello world' }], modified: [] };
    beforeEach(() => {
      setHighlightsDismissed(false);
      root = document.createElement('main');
      root.innerHTML = '<div><p>Hello world</p></div>';
      document.body.append(root);
    });
    afterEach(() => {
      clearHighlights(root);
      root.remove();
      setHighlightsDismissed(false);
    });

    it('applies overlays with no author action when highlights are not dismissed', () => {
      highlightOnPage(diff, root);
      expect(root.querySelector('.preflight-diff-overlay.is-added')).to.exist;
    });

    it('draws no overlays when dismissed, but still shows the control so it can be re-enabled', () => {
      setHighlightsDismissed(true);
      highlightOnPage(diff, root);
      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      const toggle = document.querySelector('.preflight-diff-control-hide');
      expect(toggle).to.exist;
      expect(toggle.textContent).to.equal('Show');
    });

    it('forces highlights on despite a saved Hide preference without changing it', () => {
      setHighlightsDismissed(true);

      highlightOnPage(diff, root, true);

      expect(root.querySelector('.preflight-diff-overlay.is-added')).to.exist;
      expect(localStorage.getItem('preflight-diff-hidden')).to.equal('1');
      const toggle = document.querySelector('.preflight-diff-control-hide');
      toggle.click();
      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      toggle.click();
      expect(root.querySelector('.preflight-diff-overlay.is-added')).to.exist;
      expect(localStorage.getItem('preflight-diff-hidden')).to.equal('1');
      expect(areHighlightsDismissed()).to.equal(true);
    });
  });
});
