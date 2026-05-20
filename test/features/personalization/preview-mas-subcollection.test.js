import { expect } from '@esm-bundle/chai';

const {
  extractSubCollections,
  toSubCollectionStudioUrl,
  attachAemLoadListener,
  injectSubCollectionBadge,
  removeSubCollectionBadges,
  mepMasSubCollections,
  SUB_COLLECTION_BADGE_CLASS,
  getSubCollectionsFor,
} = await import('../../../libs/features/personalization/preview-mas-subcollection.js');

const { mepMasStudioUrls } = await import('../../../libs/blocks/merch/mas-mep-utils.js');
const { setConfig } = await import('../../../libs/utils/utils.js');

setConfig({
  miloLibs: 'https://main--milo--adobecom.aem.live/libs',
  codeRoot: 'https://main--cc--adobecom.aem.live/cc-shared',
  locale: { ietf: 'en-US', prefix: '', region: 'us' },
  env: { name: 'stage' },
});

// Mocks the M@S aem:load event detail / aem-fragment.rawData shape. See
// mas/web-components/src/merch-card-collection.js for the canonical layout
// of references + referencesTree.
function buildPayload(entries, { extras = {} } = {}) {
  const references = {};
  const referencesTree = entries.map((e) => {
    references[e.id] = { value: { fields: { label: e.label, queryLabel: e.queryLabel } } };
    const node = {
      identifier: e.id,
      fieldName: e.fieldName ?? 'collection',
    };
    if (e.children?.length) {
      const child = buildPayload(e.children);
      node.referencesTree = child.referencesTree;
      Object.assign(references, child.references);
    }
    return node;
  });
  return { references, referencesTree, ...extras };
}

function buildCollectionContainer({ filter, parentUrl = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=parent-1' } = {}) {
  const container = document.createElement('div');
  container.dataset.masBlock = 'collection';
  const collection = document.createElement('merch-card-collection');
  if (filter !== undefined) collection.setAttribute('filter', filter);
  const aemFragment = document.createElement('aem-fragment');
  aemFragment.setAttribute('fragment', 'parent-1');
  collection.append(aemFragment);
  container.append(collection);
  document.body.append(container);
  if (parentUrl) mepMasStudioUrls.set(container, parentUrl);
  return { container, collection, aemFragment };
}

// Sub-collection badge lives OUTSIDE the container (as its previous sibling)
// so it doesn't get absorbed into the .collection-container CSS grid and
// auto-placed at the bottom. See injectSubCollectionBadge for rationale.
function getBadge(container) {
  const prev = container.previousElementSibling;
  return prev?.classList?.contains(SUB_COLLECTION_BADGE_CLASS) ? prev : null;
}

afterEach(() => {
  document.querySelectorAll('[data-mas-block]').forEach((el) => el.remove());
  removeSubCollectionBadges();
});

describe('extractSubCollections', () => {
  it('returns {id, label, queryLabel} entries for sibling collection refs', () => {
    const payload = buildPayload([
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
      { id: 'sub-video', label: 'Video', queryLabel: 'video' },
    ]);
    expect(extractSubCollections(payload)).to.deep.equal([
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
      { id: 'sub-video', label: 'Video', queryLabel: 'video' },
    ]);
  });

  it('skips entries without "queryLabel" (cards and variations carry only "label")', () => {
    const payload = buildPayload([
      { id: 'card-a', label: 'A', fieldName: 'cards' },
      { id: 'sub-design', label: 'Design', queryLabel: 'design' },
    ]);
    expect(extractSubCollections(payload).map((e) => e.id)).to.deep.equal(['sub-design']);
  });

  it('skips entries without "queryLabel" even when fieldName is set', () => {
    const payload = buildPayload([
      { id: 'var-x', label: 'X', fieldName: 'variations' },
    ]);
    expect(extractSubCollections(payload)).to.deep.equal([]);
  });

  it('walks recursively into nested referencesTree', () => {
    const payload = buildPayload([
      {
        id: 'sub-top',
        label: 'Top',
        queryLabel: 'top',
        children: [
          { id: 'sub-deep', label: 'Deep', queryLabel: 'deep' },
        ],
      },
    ]);
    expect(extractSubCollections(payload).map((e) => e.id))
      .to.deep.equal(['sub-top', 'sub-deep']);
  });

  it('dedupes refs that appear in multiple branches', () => {
    const payload = buildPayload([
      { id: 'sub-a', label: 'A', queryLabel: 'a' },
      { id: 'sub-a', label: 'A', queryLabel: 'a' },
    ]);
    expect(extractSubCollections(payload)).to.have.length(1);
  });

  it('returns [] for missing / malformed payloads', () => {
    expect(extractSubCollections(null)).to.deep.equal([]);
    expect(extractSubCollections({})).to.deep.equal([]);
    expect(extractSubCollections({ referencesTree: null, references: {} })).to.deep.equal([]);
    expect(extractSubCollections({ referencesTree: [], references: null })).to.deep.equal([]);
  });

  it('skips refs whose value.fields are missing', () => {
    const payload = {
      references: { 'sub-x': {} },
      referencesTree: [{ identifier: 'sub-x', fieldName: 'collection' }],
    };
    expect(extractSubCollections(payload)).to.deep.equal([]);
  });
});

describe('toSubCollectionStudioUrl', () => {
  it('replaces query= and forces page=fragment-editor', () => {
    const url = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=parent';
    const out = toSubCollectionStudioUrl(url, 'sub-x');
    const u = new URL(out);
    const hp = new URLSearchParams(u.hash.replace(/^#/, ''));
    expect(hp.get('query')).to.equal('sub-x');
    expect(hp.get('page')).to.equal('fragment-editor');
    expect(hp.get('content-type')).to.equal('merch-card-collection');
    expect(hp.has('fragment')).to.be.false;
    expect(hp.has('fragmentId')).to.be.false;
  });

  it('replaces fragment= when that was the parent\'s id param', () => {
    const url = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&fragment=parent';
    const hp = new URLSearchParams(new URL(toSubCollectionStudioUrl(url, 'sub-x')).hash.replace(/^#/, ''));
    expect(hp.get('fragment')).to.equal('sub-x');
    expect(hp.has('query')).to.be.false;
  });

  it('replaces fragmentId= when that was the parent\'s id param', () => {
    const url = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&fragmentId=parent';
    const hp = new URLSearchParams(new URL(toSubCollectionStudioUrl(url, 'sub-x')).hash.replace(/^#/, ''));
    expect(hp.get('fragmentId')).to.equal('sub-x');
  });

  it('adds fragmentId= and content-type when the parent URL had no id param at all', () => {
    const url = 'https://mas.adobe.com/studio.html#path=acom';
    const hp = new URLSearchParams(new URL(toSubCollectionStudioUrl(url, 'sub-x')).hash.replace(/^#/, ''));
    expect(hp.get('fragmentId')).to.equal('sub-x');
    expect(hp.get('content-type')).to.equal('merch-card-collection');
    expect(hp.get('page')).to.equal('fragment-editor');
  });

  it('returns input unchanged when args are missing', () => {
    expect(toSubCollectionStudioUrl(null, 'sub-x')).to.equal(null);
    expect(toSubCollectionStudioUrl('foo', null)).to.equal('foo');
  });
});

describe('attachAemLoadListener', () => {
  it('populates the WeakMap when aem:load fires on the fragment', () => {
    const { container, aemFragment } = buildCollectionContainer();
    attachAemLoadListener(aemFragment, container);
    const detail = buildPayload([
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
    ]);
    aemFragment.dispatchEvent(new CustomEvent('aem:load', { detail }));
    expect(mepMasSubCollections.get(container)).to.deep.equal([
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
    ]);
  });

  it('does NOT overwrite the WeakMap when payload yields zero sub-collections', () => {
    const { container, aemFragment } = buildCollectionContainer();
    mepMasSubCollections.set(container, [{ id: 'sub-existing', label: 'X', queryLabel: 'x' }]);
    attachAemLoadListener(aemFragment, container);
    aemFragment.dispatchEvent(new CustomEvent('aem:load', { detail: buildPayload([]) }));
    expect(mepMasSubCollections.get(container)).to.deep.equal([
      { id: 'sub-existing', label: 'X', queryLabel: 'x' },
    ]);
  });

  it('is a no-op when called with falsy args', () => {
    expect(() => attachAemLoadListener(null, null)).to.not.throw();
  });
});

describe('getSubCollectionsFor (WeakMap read)', () => {
  it('returns the cached list when present', () => {
    const { container } = buildCollectionContainer();
    mepMasSubCollections.set(container, [{ id: 'sub-cached', label: 'C', queryLabel: 'c' }]);
    expect(getSubCollectionsFor(container)).to.deep.equal([
      { id: 'sub-cached', label: 'C', queryLabel: 'c' },
    ]);
  });

  it('returns [] when nothing has been captured yet', () => {
    const { container } = buildCollectionContainer();
    expect(getSubCollectionsFor(container)).to.deep.equal([]);
  });

  it('returns [] when container is missing', () => {
    expect(getSubCollectionsFor(null)).to.deep.equal([]);
  });

  it('does NOT synthesize from <aem-fragment> in the live DOM (M@S removes it after aem:load)', () => {
    // The capture path (attachAemLoadListener) is the only writer; a stale
    // child aem-fragment must NOT be a fallback source.
    const { container, aemFragment } = buildCollectionContainer();
    Object.defineProperty(aemFragment, 'rawData', {
      configurable: true,
      get: () => buildPayload([{ id: 'sub-bogus', label: 'X', queryLabel: 'x' }]),
    });
    expect(getSubCollectionsFor(container)).to.deep.equal([]);
  });
});

describe('injectSubCollectionBadge', () => {
  it('renders a badge when filter matches a stored sub-collection', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
      { id: 'sub-video', label: 'Video', queryLabel: 'video' },
    ]);
    injectSubCollectionBadge(container, 'us');
    const badge = getBadge(container);
    expect(badge, 'badge missing').to.exist;
    expect(badge.textContent).to.match(/Photo/);
    expect(badge.textContent).to.match(/ \u00b7 US$/);
    expect(badge.dataset.mepMasSubId).to.equal('sub-photo');
    expect(badge.getAttribute('target')).to.equal('_blank');
    const hp = new URLSearchParams(new URL(badge.href).hash.replace(/^#/, ''));
    expect(hp.get('query')).to.equal('sub-photo');
    expect(hp.get('page')).to.equal('fragment-editor');
  });

  it('inserts the badge OUTSIDE the container (as previous sibling) to avoid being trapped in the .collection-container CSS grid', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    // Badge MUST sit before the container in normal flow, NOT inside it.
    // Inside-the-container insertion auto-places at the bottom of the grid.
    expect(container.previousElementSibling?.classList?.contains(SUB_COLLECTION_BADGE_CLASS))
      .to.equal(true);
    expect(container.querySelector(`a.${SUB_COLLECTION_BADGE_CLASS}`))
      .to.equal(null, 'badge must NOT be inside the grid container');
  });

  it('renders nothing when filter is empty', () => {
    const { container } = buildCollectionContainer({ filter: '' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });

  it('renders nothing when filter is "all"', () => {
    const { container } = buildCollectionContainer({ filter: 'all' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });

  it('renders nothing when filter doesn\'t match any captured sub-collection', () => {
    const { container } = buildCollectionContainer({ filter: 'nonexistent' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });

  it('renders nothing when no parent Studio URL was captured', () => {
    const { container } = buildCollectionContainer({ filter: 'photo', parentUrl: null });
    mepMasStudioUrls.delete(container);
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });

  it('removes a stale badge when the filter is cleared', () => {
    const { container, collection } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.exist;
    collection.removeAttribute('filter');
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });

  it('updates an existing badge in-place when the filter changes (no DOM churn for unchanged state)', () => {
    const { container, collection } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
      { id: 'sub-video', label: 'Video', queryLabel: 'video' },
    ]);
    injectSubCollectionBadge(container, 'us');
    const first = getBadge(container);
    expect(first.dataset.mepMasSubId).to.equal('sub-photo');
    collection.setAttribute('filter', 'video');
    injectSubCollectionBadge(container, 'us');
    const second = getBadge(container);
    expect(second).to.equal(first);
    expect(second.dataset.mepMasSubId).to.equal('sub-video');
    expect(second.textContent).to.match(/Video/);
  });

  it('omits the market suffix when pageMarket is missing', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container);
    const badge = getBadge(container);
    expect(badge.textContent).to.not.match(/ \u00b7 /);
  });

  it('finds and reuses an existing sub-collection badge even when a parent collection badge sits between it and the container', () => {
    // Regression: a re-inserted parent badge between the sub badge and the
    // container would orphan the sub badge without findExistingBadge's
    // walk-back. Verify only one sub badge survives.
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    const original = getBadge(container);
    expect(original).to.exist;
    // Wedge a parent collection badge between the sub badge and the container.
    const parentBadge = document.createElement('a');
    parentBadge.classList.add('mep-mas-edit-badge', 'mep-mas-edit-badge-collection');
    parentBadge.dataset.mepMasMarket = 'us';
    container.insertAdjacentElement('beforebegin', parentBadge);
    // Sanity: container.previousElementSibling is now the parent badge.
    expect(container.previousElementSibling).to.equal(parentBadge);
    injectSubCollectionBadge(container, 'us');
    // Still only one sub-collection badge in the document.
    expect(document.querySelectorAll(`a.${SUB_COLLECTION_BADGE_CLASS}`).length).to.equal(1);
    expect(document.querySelector(`a.${SUB_COLLECTION_BADGE_CLASS}`)).to.equal(original);
  });

  it('is idempotent across many consecutive calls (no badge accumulation)', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    for (let i = 0; i < 10; i += 1) injectSubCollectionBadge(container, 'us');
    expect(document.querySelectorAll(`a.${SUB_COLLECTION_BADGE_CLASS}`).length).to.equal(1);
  });

  it('removes any existing badge and skips when the container is hidden (offsetParent === null)', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    // First, render the badge while the container is laid out.
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.exist;
    // Now simulate the hidden-tab case (jsdom always reports offsetParent
    // as null, so we set offsetHeight to 0 to make the guard fire).
    Object.defineProperty(container, 'offsetParent', { configurable: true, get: () => null });
    Object.defineProperty(container, 'offsetHeight', { configurable: true, get: () => 0 });
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });

  it('does NOT render a badge for a hidden container even when filter and subs are valid', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    Object.defineProperty(container, 'offsetParent', { configurable: true, get: () => null });
    Object.defineProperty(container, 'offsetHeight', { configurable: true, get: () => 0 });
    injectSubCollectionBadge(container, 'us');
    expect(getBadge(container)).to.be.null;
  });
});

describe('removeSubCollectionBadges', () => {
  it('strips every sub-collection badge from the document', () => {
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [{ id: 'sub-photo', label: 'Photo', queryLabel: 'photo' }]);
    injectSubCollectionBadge(container, 'us');
    expect(document.querySelectorAll(`a.${SUB_COLLECTION_BADGE_CLASS}`).length).to.equal(1);
    removeSubCollectionBadges();
    expect(document.querySelectorAll(`a.${SUB_COLLECTION_BADGE_CLASS}`).length).to.equal(0);
  });
});

describe('integration: injectMasBadges renders sub-collection badge for active filter', () => {
  it('renders the sub-collection badge between the parent badge and the container (both outside the grid)', async () => {
    // Import lazily so the preview module evaluates against the same DOM
    // we've already prepped via buildCollectionContainer below.
    const preview = await import('../../../libs/features/personalization/preview.js');
    const { container } = buildCollectionContainer({ filter: 'photo' });
    mepMasSubCollections.set(container, [
      { id: 'sub-photo', label: 'Photo', queryLabel: 'photo' },
    ]);
    preview.injectMasBadges();
    // Sibling order in the parent flow: parent badge, sub badge, container.
    const subBadge = container.previousElementSibling;
    expect(subBadge?.classList?.contains(SUB_COLLECTION_BADGE_CLASS))
      .to.equal(true, 'sub-collection badge should be container.previousElementSibling');
    const parentBadge = subBadge.previousElementSibling;
    expect(parentBadge?.classList?.contains('mep-mas-edit-badge-collection'))
      .to.equal(true, 'parent collection badge should sit just before the sub badge');
  });
});
