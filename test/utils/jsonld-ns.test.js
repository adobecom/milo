import { expect } from '@esm-bundle/chai';
import { jsonLdNs, snapshotHtmlJsonLd, isHtmlJsonLd } from '../../libs/utils/jsonld-ns.js';

function makeScript(payload) {
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(payload);
  return el;
}

describe('jsonld-ns', () => {
  beforeEach(() => {
    delete window.miloJsonLd;
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  });

  it('jsonLdNs() lazily creates the window.miloJsonLd namespace', () => {
    expect(window.miloJsonLd).to.be.undefined;
    const ns = jsonLdNs();
    expect(ns).to.equal(window.miloJsonLd);
    expect(typeof ns).to.equal('object');
    // Subsequent calls return the same object.
    expect(jsonLdNs()).to.equal(ns);
  });

  it('snapshotHtmlJsonLd() captures every JSON-LD script present in <head>', () => {
    const a = makeScript({ '@type': 'Article' });
    const b = makeScript({ '@type': 'BreadcrumbList' });
    document.head.appendChild(a);
    document.head.appendChild(b);

    snapshotHtmlJsonLd();
    expect(isHtmlJsonLd(a)).to.be.true;
    expect(isHtmlJsonLd(b)).to.be.true;
  });

  it('isHtmlJsonLd() returns false for scripts added after the snapshot', () => {
    const authoredScript = makeScript({ '@type': 'Article' });
    document.head.appendChild(authoredScript);

    snapshotHtmlJsonLd();
    // Producer adds a script at "runtime" — after the snapshot has been taken.
    const runtimeScript = makeScript({ '@type': 'BreadcrumbList' });
    document.head.appendChild(runtimeScript);

    expect(isHtmlJsonLd(authoredScript)).to.be.true;
    expect(isHtmlJsonLd(runtimeScript)).to.be.false;
  });

  it('isHtmlJsonLd() returns false when no snapshot has been taken yet', () => {
    const el = makeScript({ '@type': 'Article' });
    document.head.appendChild(el);
    expect(isHtmlJsonLd(el)).to.be.false;
  });

  it('snapshotHtmlJsonLd() is idempotent — repeated calls do not re-snapshot', () => {
    const original = makeScript({ '@type': 'Article' });
    document.head.appendChild(original);

    snapshotHtmlJsonLd();
    const firstSet = window.miloJsonLd.htmlJsonLd;

    // Append a script and call again — the set reference should not change and
    // the new script should NOT be added to the existing snapshot.
    const late = makeScript({ '@type': 'BreadcrumbList' });
    document.head.appendChild(late);
    snapshotHtmlJsonLd();

    expect(window.miloJsonLd.htmlJsonLd).to.equal(firstSet);
    expect(isHtmlJsonLd(late)).to.be.false;
  });

  it('snapshotHtmlJsonLd(root) accepts an explicit root', () => {
    const container = document.createElement('div');
    const inside = makeScript({ '@type': 'Article' });
    container.appendChild(inside);
    document.body.appendChild(container);

    snapshotHtmlJsonLd(container);
    expect(isHtmlJsonLd(inside)).to.be.true;

    container.remove();
  });
});
