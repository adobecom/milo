import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { applyHighlights, scrollToChange } from '../../../../libs/blocks/preflight/panels/diff-highlight.js';

// wrap simulates decoration reshaping the tree after stampKeys ran (Task 2), e.g. a link
// getting wrapped in a button — the data-diff-key stays on the original node either way.
function buildPane(entries) {
  const main = document.createElement('main');
  entries.forEach(({ key, wrap }) => {
    const p = document.createElement('p');
    p.dataset.diffKey = key;
    p.textContent = key;
    if (wrap) {
      const wrapper = document.createElement('div');
      wrapper.className = 'decorated-wrapper';
      wrapper.append(p);
      main.append(wrapper);
    } else {
      main.append(p);
    }
  });
  return main;
}

describe('preflight diff-highlight', () => {
  describe('applyHighlights', () => {
    it('adds preflight-diff-added only to the preview pane element', () => {
      const previewPane = buildPane([{ key: '/main[1]/p[1]' }]);
      const livePane = buildPane([]);
      const diff = { added: [{ type: 'added', path: '/main[1]/p[1]' }], modified: [], removed: [] };

      applyHighlights(previewPane, livePane, diff);

      const el = previewPane.querySelector('[data-diff-key="/main[1]/p[1]"]');
      expect(el.classList.contains('preflight-diff-added')).to.equal(true);
      expect(livePane.querySelector('.preflight-diff-added')).to.not.exist;
    });

    it('adds preflight-diff-removed only to the live pane element', () => {
      const previewPane = buildPane([]);
      const livePane = buildPane([{ key: '/main[1]/p[2]' }]);
      const diff = { added: [], modified: [], removed: [{ type: 'removed', path: '/main[1]/p[2]' }] };

      applyHighlights(previewPane, livePane, diff);

      const el = livePane.querySelector('[data-diff-key="/main[1]/p[2]"]');
      expect(el.classList.contains('preflight-diff-removed')).to.equal(true);
      expect(previewPane.querySelector('.preflight-diff-removed')).to.not.exist;
    });

    it('adds preflight-diff-modified to the same key in both panes', () => {
      const key = '/main[1]/p[3]';
      const previewPane = buildPane([{ key }]);
      const livePane = buildPane([{ key }]);
      const diff = { added: [], modified: [{ type: 'modified', path: key }], removed: [] };

      applyHighlights(previewPane, livePane, diff);

      expect(previewPane.querySelector(`[data-diff-key="${key}"]`).classList.contains('preflight-diff-modified')).to.equal(true);
      expect(livePane.querySelector(`[data-diff-key="${key}"]`).classList.contains('preflight-diff-modified')).to.equal(true);
    });

    it('finds a decoration-wrapped element by attribute lookup (Approach B)', () => {
      const key = '/main[1]/div[1]/p[1]';
      const previewPane = buildPane([{ key, wrap: true }]);
      const livePane = buildPane([]);
      const diff = { added: [{ type: 'added', path: key }], modified: [], removed: [] };

      applyHighlights(previewPane, livePane, diff);

      const el = previewPane.querySelector(`[data-diff-key="${key}"]`);
      expect(el.tagName).to.equal('P');
      expect(el.classList.contains('preflight-diff-added')).to.equal(true);
      expect(el.parentElement.classList.contains('decorated-wrapper')).to.equal(true);
      expect(el.parentElement.classList.contains('preflight-diff-added')).to.equal(false);
    });

    it('does not throw when a change key has no matching element', () => {
      const previewPane = buildPane([]);
      const livePane = buildPane([]);
      const diff = { added: [{ type: 'added', path: '/main[1]/p[99]' }], modified: [], removed: [] };
      expect(() => applyHighlights(previewPane, livePane, diff)).to.not.throw();
    });

    it('handles a diff with no changes', () => {
      const previewPane = buildPane([]);
      const livePane = buildPane([]);
      const diff = { added: [], modified: [], removed: [] };
      expect(() => applyHighlights(previewPane, livePane, diff)).to.not.throw();
    });
  });

  describe('scrollToChange', () => {
    afterEach(() => sinon.restore());

    it('scrolls the pane smoothly to the keyed element', () => {
      const key = '/main[1]/p[1]';
      const pane = buildPane([{ key }]);
      document.body.append(pane);
      const scrollToSpy = sinon.spy(pane, 'scrollTo');

      scrollToChange(pane, { path: key });

      expect(scrollToSpy.calledOnce).to.equal(true);
      const [options] = scrollToSpy.firstCall.args;
      expect(options.behavior).to.equal('smooth');
      expect(options).to.have.property('top');

      pane.remove();
    });

    it('does not scroll when the key has no matching element', () => {
      const pane = buildPane([]);
      document.body.append(pane);
      const scrollToSpy = sinon.spy(pane, 'scrollTo');

      expect(() => scrollToChange(pane, { path: '/main[1]/p[404]' })).to.not.throw();
      expect(scrollToSpy.called).to.equal(false);

      pane.remove();
    });
  });
});
