import { expect } from '@esm-bundle/chai';
import diffContent from '../../../../../libs/blocks/preflight/checks/diff/diffContent.js';

function root(htmlStr) {
  const el = document.createElement('main');
  el.innerHTML = htmlStr;
  return el;
}

describe('preflight diffContent', () => {
  it('reports no changes for identical trees', () => {
    const a = root('<div><p>hello</p></div>');
    const b = root('<div><p>hello</p></div>');
    const r = diffContent(a, b);
    expect(r.added).to.have.length(0);
    expect(r.modified).to.have.length(0);
    expect(r.removed).to.have.length(0);
    expect(r.unchanged).to.equal(1);
  });

  it('detects an added element in preview', () => {
    const preview = root('<div><p>hello</p><p>brand new</p></div>');
    const live = root('<div><p>hello</p></div>');
    const r = diffContent(preview, live);
    expect(r.added).to.have.length(1);
    expect(r.added[0].previewText).to.equal('brand new');
    expect(r.removed).to.have.length(0);
  });

  it('detects a removed element (in live, not preview)', () => {
    const preview = root('<div><p>hello</p></div>');
    const live = root('<div><p>hello</p><p>going away</p></div>');
    const r = diffContent(preview, live);
    expect(r.removed).to.have.length(1);
    expect(r.removed[0].liveText).to.equal('going away');
    expect(r.added).to.have.length(0);
  });

  it('detects a modified element (same slot, text changed)', () => {
    const preview = root('<div><h2>New title</h2></div>');
    const live = root('<div><h2>Old title</h2></div>');
    const r = diffContent(preview, live);
    expect(r.modified).to.have.length(1);
    expect(r.modified[0].previewText).to.equal('New title');
    expect(r.modified[0].liveText).to.equal('Old title');
    expect(r.modified[0].path).to.equal('/div[1]/h2[1]');
  });

  it('treats an added link inside preview as added', () => {
    const preview = root('<div><p>see the</p><a href="/x">report</a></div>');
    const live = root('<div><p>see the</p></div>');
    const r = diffContent(preview, live);
    expect(r.added).to.have.length(1);
    expect(r.added[0].tag).to.equal('A');
  });

  it('marks every change with a kind of "leaf" for default content', () => {
    const preview = root('<div><p>hello</p><p>brand new</p></div>');
    const live = root('<div><p>hello</p><p>going away</p></div>');
    const r = diffContent(preview, live);
    expect(r.added.every((c) => c.kind === 'leaf')).to.equal(true);
    expect(r.removed.every((c) => c.kind === 'leaf')).to.equal(true);
  });

  it('does not emit a phantom empty-text change for a <p> that only wraps an <img>', () => {
    const preview = root('<div><p><img src="/hero.png" alt="A brand new hero image"></p></div>');
    const live = root('<div></div>');
    const r = diffContent(preview, live);
    expect(r.added).to.have.length(1);
    expect(r.added[0].tag).to.equal('IMG');
    expect(r.added[0].previewText).to.equal('A brand new hero image');
  });

  describe('blocks', () => {
    it('treats a new direct-child div[class] of a section as one added block unit, not its inner leaves', () => {
      const preview = root('<div><div class="columns"><div><div><p>Col text</p><img src="/a.png" alt="Col image"></div></div></div></div>');
      const live = root('<div></div>');
      const r = diffContent(preview, live);
      expect(r.added).to.have.length(1);
      expect(r.added[0].kind).to.equal('block');
      expect(r.added[0].blockName).to.equal('columns');
      expect(r.added[0].tag).to.equal('DIV');
    });

    it('treats a block present in live but not preview as one removed block unit', () => {
      const preview = root('<div></div>');
      const live = root('<div><div class="columns"><p>Col text</p></div></div>');
      const r = diffContent(preview, live);
      expect(r.removed).to.have.length(1);
      expect(r.removed[0].kind).to.equal('block');
      expect(r.removed[0].blockName).to.equal('columns');
    });

    it('treats the same block at the same path with changed inner text as one modified block', () => {
      const preview = root('<div><div class="columns"><p>New col text</p></div></div>');
      const live = root('<div><div class="columns"><p>Old col text</p></div></div>');
      const r = diffContent(preview, live);
      expect(r.modified).to.have.length(1);
      expect(r.modified[0].kind).to.equal('block');
      expect(r.modified[0].blockName).to.equal('columns');
      expect(r.added).to.have.length(0);
      expect(r.removed).to.have.length(0);
    });
  });

  describe('similarity gate for same-slot leaf pairs', () => {
    it('classifies a dissimilar same-slot removed+added pair as a separate Add and Remove', () => {
      // Both are the second <p> in their section (same path/tag), but the texts share no words —
      // this must not be misread as one paragraph being edited.
      const preview = root('<div><p>Hello world</p><p>Totally unrelated new content</p></div>');
      const live = root('<div><p>Hello world</p><p>A paragraph that will be removed</p></div>');
      const r = diffContent(preview, live);
      expect(r.modified).to.have.length(0);
      expect(r.removed).to.have.length(1);
      expect(r.removed[0].liveText).to.equal('A paragraph that will be removed');
      expect(r.added).to.have.length(1);
      expect(r.added[0].previewText).to.equal('Totally unrelated new content');
    });

    it('classifies a similar same-slot removed+added pair as one Modified change', () => {
      const preview = root('<div><p>A paragraph that HAS BEEN modified</p></div>');
      const live = root('<div><p>A paragraph that will be modified</p></div>');
      const r = diffContent(preview, live);
      expect(r.modified).to.have.length(1);
      expect(r.removed).to.have.length(0);
      expect(r.added).to.have.length(0);
      expect(r.modified[0].previewText).to.equal('A paragraph that HAS BEEN modified');
      expect(r.modified[0].liveText).to.equal('A paragraph that will be modified');
    });
  });
});
