import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  resolveOnPage,
  highlightOnPage,
  jumpToChangeOnPage,
} from '../../../../libs/blocks/preflight/panels/diff-onpage.js';
import { waitFor } from '../../../helpers/waitfor.js';

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

    it('climbs to the containing block when the resolved element sits inside a decorated block', () => {
      const root = document.createElement('main');
      root.innerHTML = `
        <div class="section">
          <div class="columns block">
            <div><div><p>Block text</p></div></div>
          </div>
        </div>`;

      const el = resolveOnPage('/div[1]/div[1]/div[1]/div[1]/p[1]', root);
      const block = root.querySelector('.columns.block');

      expect(el).to.equal(block);
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

    it('adds preflight-diff-added to a resolved added change', () => {
      const diff = {
        added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }],
        modified: [],
        removed: [],
      };

      highlightOnPage(diff, root);

      const h2 = root.querySelector('h2');
      expect(h2.classList.contains('preflight-diff-added')).to.equal(true);
    });

    it('adds preflight-diff-modified to a resolved modified change', () => {
      const diff = {
        added: [],
        modified: [{ type: 'modified', tag: 'P', path: '/div[1]/p[2]' }],
        removed: [],
      };

      highlightOnPage(diff, root);

      const p = [...root.querySelectorAll('p')][1];
      expect(p.classList.contains('preflight-diff-modified')).to.equal(true);
    });

    it('skips removed changes on the page (no element carries a class for them)', () => {
      const diff = {
        added: [],
        modified: [],
        removed: [{ type: 'removed', tag: 'P', path: '/div[1]/p[3]' }],
      };

      highlightOnPage(diff, root);

      expect(root.querySelector('.preflight-diff-added')).to.not.exist;
      expect(root.querySelector('.preflight-diff-modified')).to.not.exist;
    });

    it('skips a change that cannot be resolved, without throwing, and logs to lana', () => {
      const diff = {
        added: [{ type: 'added', tag: 'SPAN', path: '/article[1]/span[1]' }],
        modified: [],
        removed: [],
      };

      expect(() => highlightOnPage(diff, root)).to.not.throw();
      expect(root.querySelector('.preflight-diff-added')).to.not.exist;
      expect(lanaLogStub.called).to.equal(true);
      expect(lanaLogStub.firstCall.args[0]).to.include('diff-onpage');
      expect(lanaLogStub.firstCall.args[1]).to.deep.include({ tags: 'preflight' });
    });

    it('returns a cleanup function that removes every class it applied', () => {
      const diff = {
        added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }],
        modified: [{ type: 'modified', tag: 'P', path: '/div[1]/p[2]' }],
        removed: [],
      };

      const cleanup = highlightOnPage(diff, root);
      expect(root.querySelectorAll('.preflight-diff-added, .preflight-diff-modified')).to.have.length(2);

      cleanup();

      expect(root.querySelectorAll('.preflight-diff-added, .preflight-diff-modified')).to.have.length(0);
    });

    it('clears previously-applied classes at the start of a re-run, even without calling cleanup', () => {
      const first = { added: [{ type: 'added', tag: 'H2', path: '/div[1]/h2[1]' }], modified: [], removed: [] };
      highlightOnPage(first, root);
      expect(root.querySelector('.preflight-diff-added')).to.exist;

      const second = { added: [], modified: [], removed: [] };
      highlightOnPage(second, root);

      expect(root.querySelector('.preflight-diff-added')).to.not.exist;
    });

    it('handles an empty/undefined diff without throwing', () => {
      expect(() => highlightOnPage(null, root)).to.not.throw();
      expect(() => highlightOnPage({ added: [], modified: [], removed: [] }, root)).to.not.throw();
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
});
