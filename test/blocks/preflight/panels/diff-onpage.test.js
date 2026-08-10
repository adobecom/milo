import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadStyle } from '../../../../libs/utils/utils.js';
import {
  resolveOnPage,
  highlightOnPage,
  jumpToChangeOnPage,
  clearHighlights,
  autoHighlightOnPage,
  areHighlightsDismissed,
  setHighlightsDismissed,
} from '../../../../libs/blocks/preflight/panels/diff-onpage.js';
import { waitFor } from '../../../helpers/waitfor.js';

// loadStyle uses a load/error callback, not a promise — wrap it so getComputedStyle assertions
// below don't race the stylesheet's network fetch.
await new Promise((resolve) => {
  loadStyle('../../../../libs/blocks/preflight/preflight.css', resolve);
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

    it('climbs to the containing block for a block-kind change, even resolved deep inside its rebuilt DOM', () => {
      const root = document.createElement('main');
      root.innerHTML = `
        <div class="section">
          <div class="columns block">
            <div><div><p>Block text</p></div></div>
          </div>
        </div>`;

      const el = resolveOnPage('/div[1]/div[1]/div[1]/div[1]/p[1]', root, 'block');
      const block = root.querySelector('.columns.block');

      expect(el).to.equal(block);
    });

    it('does not climb for a leaf-kind change, even when it sits inside a decorated block', () => {
      // Same fixture as above, but resolved as a 'leaf' change — must return the paragraph
      // itself, not the containing block.
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
        added: [{ type: 'added', kind: 'block', tag: 'DIV', path: '/div[1]/div[1]', blockName: 'marquee' }],
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

  describe('on-page dismiss control', () => {
    let root;
    let diff;

    beforeEach(() => {
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
      sinon.restore();
    });

    it('injects a dismiss control when highlights are applied and onDismiss is provided', () => {
      const onDismiss = sinon.spy();
      highlightOnPage(diff, root, onDismiss);
      const control = document.querySelector('.preflight-diff-highlight-control');
      expect(control).to.exist;
      expect(control.querySelector('.preflight-diff-control-hide')).to.exist;
    });

    it('does not inject a control when there is nothing to highlight', () => {
      highlightOnPage({ added: [], modified: [] }, root, sinon.spy());
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });

    it('does not inject a control when no onDismiss is given', () => {
      highlightOnPage(diff, root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });

    it('clicking Hide clears overlays, removes the control, and calls onDismiss', () => {
      const onDismiss = sinon.spy();
      highlightOnPage(diff, root, onDismiss);
      document.querySelector('.preflight-diff-control-hide').click();

      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
      expect(onDismiss.calledOnce).to.equal(true);
    });

    it('clearHighlights removes the injected control', () => {
      highlightOnPage(diff, root, sinon.spy());
      clearHighlights(root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });
  });

  describe('jumpToChangeOnPage', () => {
    let root;
    let preflightModal;
    let sidekick;

    beforeEach(() => {
      root = document.createElement('main');
      root.innerHTML = '<div><p>Kept</p><h2>New heading</h2></div>';
      document.body.append(root);

      preflightModal = document.createElement('div');
      preflightModal.id = 'preflight';
      document.body.append(preflightModal);

      sidekick = document.createElement('aem-sidekick');
      document.body.append(sidekick);

      window.lana = { log: sinon.stub() };
    });

    afterEach(() => {
      root.remove();
      preflightModal.remove();
      sidekick.remove();
      document.querySelector('.preflight-return-popover')?.remove();
      document.querySelectorAll('.preflight-diff-jump-highlight')
        .forEach((el) => el.classList.remove('preflight-diff-jump-highlight'));
      delete window.lana;
      sinon.restore();
    });

    it('closes the preflight modal, flashes the element, and shows the return popover', async () => {
      const closeSpy = sinon.spy();
      preflightModal.addEventListener('closeModal', closeSpy);
      const h2 = root.querySelector('h2');
      const scrollSpy = sinon.spy(h2, 'scrollIntoView');

      const result = jumpToChangeOnPage({ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }, root);

      expect(result).to.equal(true);
      expect(closeSpy.calledOnce).to.equal(true);

      await waitFor(() => document.querySelector('.preflight-return-popover'));

      expect(scrollSpy.calledOnce).to.equal(true);
      expect(h2.classList.contains('preflight-diff-jump-highlight')).to.equal(true);
      expect(document.querySelector('.preflight-return-reopen')).to.exist;
      expect(document.querySelector('.preflight-return-dismiss')).to.exist;
    });

    it('dismiss removes the popover and the flash highlight', async () => {
      jumpToChangeOnPage({ type: 'modified', tag: 'H2', path: '/div[1]/h2[1]' }, root);
      await waitFor(() => document.querySelector('.preflight-return-popover'));

      document.querySelector('.preflight-return-dismiss').click();

      expect(document.querySelector('.preflight-return-popover')).to.not.exist;
      expect(root.querySelector('.preflight-diff-jump-highlight')).to.not.exist;
    });

    it('reopen dispatches custom:preflight on the sidekick and removes the popover', async () => {
      const reopenSpy = sinon.spy();
      sidekick.addEventListener('custom:preflight', reopenSpy);

      jumpToChangeOnPage({ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }, root);
      await waitFor(() => document.querySelector('.preflight-return-popover'));

      document.querySelector('.preflight-return-reopen').click();

      expect(reopenSpy.calledOnce).to.equal(true);
      expect(document.querySelector('.preflight-return-popover')).to.not.exist;
    });

    it('returns false and does not touch the DOM when the change cannot be resolved on the page', () => {
      const closeSpy = sinon.spy();
      preflightModal.addEventListener('closeModal', closeSpy);

      const result = jumpToChangeOnPage({ type: 'removed', tag: 'P', path: '/article[1]/p[9]' }, root);

      expect(result).to.equal(false);
      expect(closeSpy.called).to.equal(false);
      expect(document.querySelector('.preflight-return-popover')).to.not.exist;
    });
  });

  describe('autoHighlightOnPage (preview-load auto-apply, FA #1)', () => {
    let root;
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
      autoHighlightOnPage({ added: [{ path: '/div[1]/p[1]', kind: 'leaf', tag: 'P', previewText: 'Hello world' }], modified: [] }, root);
      expect(root.querySelector('.preflight-diff-overlay.is-added')).to.exist;
    });

    it('is a no-op once highlights have been dismissed for the session', () => {
      setHighlightsDismissed(true);
      const cleanup = autoHighlightOnPage({ added: [{ path: '/div[1]/p[1]', kind: 'leaf', tag: 'P', previewText: 'Hello world' }], modified: [] }, root);
      expect(cleanup).to.equal(undefined);
      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
    });

    it('dismissing via the on-page control flips the shared session flag', () => {
      autoHighlightOnPage({ added: [{ path: '/div[1]/p[1]', kind: 'leaf', tag: 'P', previewText: 'Hello world' }], modified: [] }, root);
      document.querySelector('.preflight-diff-highlight-control .preflight-diff-control-hide')?.click();
      expect(areHighlightsDismissed()).to.equal(true);
    });
  });
});
