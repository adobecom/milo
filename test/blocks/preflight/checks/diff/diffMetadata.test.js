import { expect } from '@esm-bundle/chai';
import diffMetadata, { parseMetadata } from '../../../../../libs/blocks/preflight/checks/diff/diffMetadata.js';

function root(rows) {
  const el = document.createElement('main');
  el.innerHTML = `<div class="metadata">${rows}</div>`;
  return el;
}
const row = (k, v) => `<div><div>${k}</div><div>${v}</div></div>`;

describe('preflight diffMetadata', () => {
  it('parses metadata rows into a key/value map (keys lowercased)', () => {
    const meta = parseMetadata(root(`${row('Title', 'Hello')}${row('Description', 'D')}`));
    expect(meta).to.deep.equal({ title: 'Hello', description: 'D' });
  });

  it('classifies added, modified, removed keys', () => {
    const preview = root(`${row('Title', 'New')}${row('Robots', 'noindex')}`);
    const live = root(`${row('Title', 'Old')}${row('Keywords', 'a,b')}`);
    const r = diffMetadata(preview, live);
    expect(r.modified).to.deep.equal([{ key: 'title', previewValue: 'New', liveValue: 'Old' }]);
    expect(r.added).to.deep.equal([{ key: 'robots', previewValue: 'noindex' }]);
    expect(r.removed).to.deep.equal([{ key: 'keywords', liveValue: 'a,b' }]);
  });
});
