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
});
