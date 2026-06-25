import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

// Minimal config so fragment.js can import without errors
setConfig({
  codeRoot: '/libs',
  contentRoot: window.location.origin,
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
});

// Import the module under test AFTER config is set
const { default: getFragment, loadedFragments } = await import('../../../libs/blocks/fragment/fragment.js');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal <a> element that fragment.js can process.
 * We point it at a real mock file so the fetch succeeds.
 */
const makeAnchor = (href) => {
  const a = document.createElement('a');
  a.href = href;
  // Wrap in a div so parentElement checks don't throw
  const div = document.createElement('div');
  div.appendChild(a);
  document.body.appendChild(div);
  return a;
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Duplicate fragment detection', () => {
  let warnStub;

  beforeEach(() => {
    // Clear the shared Set before every test so tests are independent
    loadedFragments.clear();
    warnStub = stub(console, 'warn');
  });

  afterEach(() => {
    warnStub.restore();
    document.body.innerHTML = '';
  });

  it('(a) single reference — no warning emitted', async () => {
    const href = `${window.location.origin}/test/blocks/fragment/mocks/fragments/fragment`;
    const a = makeAnchor(href);
    await getFragment(a);

    const dupWarns = warnStub.args.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('[Milo] Duplicate fragment'),
    );
    expect(dupWarns).to.have.length(0);
  });

  it('(b) two references to the same URL — exactly one warning emitted', async () => {
    const href = `${window.location.origin}/test/blocks/fragment/mocks/fragments/fragment`;

    const a1 = makeAnchor(href);
    await getFragment(a1);

    const a2 = makeAnchor(href);
    await getFragment(a2);

    const dupWarns = warnStub.args.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('[Milo] Duplicate fragment'),
    );
    expect(dupWarns).to.have.length(1);
    expect(dupWarns[0][0]).to.include('[Milo] Duplicate fragment reference detected:');
  });

  it('(c) same URL with trailing slash treated as duplicate — one warning', async () => {
    const base = `${window.location.origin}/test/blocks/fragment/mocks/fragments/fragment`;
    const withSlash = `${base}/`;

    const a1 = makeAnchor(base);
    await getFragment(a1);

    const a2 = makeAnchor(withSlash);
    await getFragment(a2);

    const dupWarns = warnStub.args.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('[Milo] Duplicate fragment'),
    );
    expect(dupWarns).to.have.length(1);
  });

  it('(d) two genuinely different URLs — no warning emitted', async () => {
    const href1 = `${window.location.origin}/test/blocks/fragment/mocks/fragments/fragment`;
    const href2 = `${window.location.origin}/test/blocks/fragment/mocks/fragments/frag-cache`;

    const a1 = makeAnchor(href1);
    await getFragment(a1);

    const a2 = makeAnchor(href2);
    await getFragment(a2);

    const dupWarns = warnStub.args.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('[Milo] Duplicate fragment'),
    );
    expect(dupWarns).to.have.length(0);
  });
});
