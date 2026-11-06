import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import getUuid from '../../../libs/utils/getUuid.js';
import {
  caasAutoPublish,
  isDisabledOnPage,
  matchesUrl,
  resolveHtmlExt,
  resolveHtmlIdentity,
  resolveRule,
  resolveTargets,
  resetIdentityNoticesForTesting,
} from '../../../tools/send-to-caas/auto-publish.js';

const POST_XDM_URL = 'https://14257-milocaasproxy.adobeio-static.net/api/v1/web/milocaas/postXDM';

const PAGE_HTML_WITH_METADATA = `
  <!DOCTYPE html><html lang="en"><head>
    <title>Test article</title>
    <meta name="og:title" content="Test article">
    <meta name="og:description" content="A test article description">
    <meta property="og:image" content="https://example.com/img/card.jpg">
    <meta name="publication-date" content="2024-01-15T00:00:00Z">
  </head><body>
    <main>
      <img src="https://example.com/img/card.jpg" alt="card alt">
      <div>
        <div class="card-metadata">
          <div><div>title</div><div>Test article</div></div>
          <div><div>cardtitle</div><div>Test article card</div></div>
          <div><div>carddescription</div><div>A test article description</div></div>
          <div><div>cardimagealttext</div><div>A descriptive alt</div></div>
          <div><div>country</div><div>us</div></div>
          <div><div>lang</div><div>en</div></div>
          <div><div>tags</div><div>caas:content-type/article</div></div>
          <div><div>primaryTag</div><div>caas:content-type/article</div></div>
        </div>
      </div>
    </main>
  </body></html>`;

// Like PAGE_HTML_WITH_METADATA but omits explicit country/lang card-metadata
// fields, so the country/lang props actually exercise getCountryAndLang()
// instead of short-circuiting on the page's own hardcoded values.
const PAGE_HTML_NO_LOCALE_METADATA = `
  <!DOCTYPE html><html lang="en"><head>
    <title>Test article</title>
    <meta name="og:title" content="Test article">
    <meta name="og:description" content="A test article description">
    <meta property="og:image" content="https://example.com/img/card.jpg">
    <meta name="publication-date" content="2024-01-15T00:00:00Z">
  </head><body>
    <main>
      <img src="https://example.com/img/card.jpg" alt="card alt">
      <div>
        <div class="card-metadata">
          <div><div>title</div><div>Test article</div></div>
          <div><div>cardtitle</div><div>Test article card</div></div>
          <div><div>carddescription</div><div>A test article description</div></div>
          <div><div>cardimagealttext</div><div>A descriptive alt</div></div>
          <div><div>tags</div><div>caas:content-type/article</div></div>
          <div><div>primaryTag</div><div>caas:content-type/article</div></div>
        </div>
      </div>
    </main>
  </body></html>`;

const PAGE_HTML_NO_METADATA = `
  <!DOCTYPE html><html lang="en"><head><title>Empty</title></head>
  <body><main><div><p>no card metadata</p></div></main></body></html>`;

const PAGE_HTML_DISABLED = `
  <!DOCTYPE html><html lang="en"><head><title>Disabled</title></head>
  <body><main><div>
    <div class="card-metadata">
      <div><div>title</div><div>Test</div></div>
      <div><div>auto-publish</div><div>false</div></div>
      <div><div>tags</div><div>caas:content-type/article</div></div>
    </div>
  </div></main></body></html>`;

const jsonResponse = (body, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: { 'Content-Type': 'application/json' } },
);

const htmlResponse = (body) => new Response(
  body,
  { status: 200, headers: { 'Content-Type': 'text/html', 'Last-Modified': 'Mon, 15 Jan 2024 00:00:00 GMT' } },
);

let fetchStub;
let originCounter = 0;
const uniqueOrigin = () => {
  originCounter += 1;
  return `https://test-${originCounter}.adobe.com`;
};

afterEach(() => {
  if (fetchStub) {
    fetchStub.restore();
    fetchStub = null;
  }
  // Tests that capture identity diagnostics install a fake lana; leaving it in
  // place would silently redirect every later test's logging.
  delete window.lana;
});

describe('auto-publish: matchesUrl', () => {
  it('returns false for non-string inputs', () => {
    expect(matchesUrl(undefined, '/foo')).to.be.false;
    expect(matchesUrl('/foo', undefined)).to.be.false;
    expect(matchesUrl(null, null)).to.be.false;
  });

  it('exact-matches when no wildcard', () => {
    expect(matchesUrl('/foo/bar', '/foo/bar')).to.be.true;
    expect(matchesUrl('/foo/bar', '/foo/baz')).to.be.false;
    expect(matchesUrl('/foo/bar', '/foo/bar/child')).to.be.false;
  });

  it('matches descendants with ** suffix', () => {
    expect(matchesUrl('/foo/**', '/foo/')).to.be.true;
    expect(matchesUrl('/foo/**', '/foo/bar')).to.be.true;
    expect(matchesUrl('/foo/**', '/foo/bar/baz')).to.be.true;
    expect(matchesUrl('/foo/**', '/bar/foo')).to.be.false;
  });

  it('matches the bare directory itself (without trailing slash)', () => {
    expect(matchesUrl('/foo/**', '/foo')).to.be.true;
    expect(matchesUrl('/foo/**', '/foobar')).to.be.false;
  });
});

describe('auto-publish: resolveRule', () => {
  it('returns null for invalid input', () => {
    expect(resolveRule(null, '/foo')).to.be.null;
    expect(resolveRule([], '/foo')).to.be.null;
    expect(resolveRule([{ url: '/x' }], '')).to.be.null;
  });

  it('returns the most specific (longest pattern) match', () => {
    const rules = [
      { url: '/products/**', enabled: true },
      { url: '/products/legacy/**', enabled: false },
    ];
    expect(resolveRule(rules, '/products/x').url).to.equal('/products/**');
    expect(resolveRule(rules, '/products/legacy/x').url).to.equal('/products/legacy/**');
  });

  it('prefers exact match over wildcard when path is equal length', () => {
    const rules = [
      { url: '/legal/**', enabled: true },
      { url: '/legal/policy', enabled: false },
    ];
    expect(resolveRule(rules, '/legal/policy').url).to.equal('/legal/policy');
    expect(resolveRule(rules, '/legal/other').url).to.equal('/legal/**');
  });

  it('returns null when no rule matches', () => {
    expect(resolveRule([{ url: '/blog/**' }], '/products/x')).to.be.null;
  });

  it('prefers an exact match over a wildcard rule with the same raw pattern length', () => {
    // '/a/**' (5 chars) and '/a/bc' (5 chars) tie on raw string length, but
    // the wildcard's effective specificity (dir length, 3) is lower than the
    // exact match's (5) — the exact rule must win regardless of array order.
    const rules = [{ url: '/a/**' }, { url: '/a/bc' }];
    expect(resolveRule(rules, '/a/bc').url).to.equal('/a/bc');
    expect(resolveRule([...rules].reverse(), '/a/bc').url).to.equal('/a/bc');
  });

  it('skips rules without a url field', () => {
    expect(resolveRule([{ enabled: true }, { url: '/foo' }], '/foo').url).to.equal('/foo');
  });
});

describe('auto-publish: resolveHtmlIdentity', () => {
  // Card identity is a site-level scheme. resolveRule returns only the single
  // most-specific match, so reading the flag off that rule alone let a narrow
  // rule that merely OMITS the column silently revert the policy for its whole
  // subtree -- orphaning that section's cards with no error anywhere.
  it('applies a site-wide opt-in to a matched rule that omits the column', () => {
    const rules = [
      { url: '/**', htmlIdentity: 'true' },
      { url: '/products/**' },
    ];
    expect(resolveHtmlIdentity(rules, rules[1])).to.be.true;
  });

  it('logs the site-wide notice once, then suppresses it', () => {
    // The notice is informational: a broad opt-in plus narrower rules that omit
    // the column is the documented-correct shape, so firing per url turned a
    // 5,000-url bulk job into 5,000 lana warnings at sampleRate 100 and buried
    // the genuinely actionable messages (the disagreement warning and the
    // env-split refusal, neither of which is suppressed).
    //
    // Reset first so this asserts from a known state. Without the reset an
    // earlier test in this file has already tripped the module-level flag, so
    // `logged` would be empty and the test would pass even if the notice could
    // never fire at all.
    resetIdentityNoticesForTesting();
    const rules = [
      { url: '/**', htmlIdentity: 'true' },
      { url: '/products/**' },
    ];
    const logged = [];
    window.lana = { log: (msg) => logged.push(msg) };
    expect(resolveHtmlIdentity(rules, rules[1])).to.be.true;
    expect(logged.filter((m) => m.includes('applying it site-wide'))).to.have.lengthOf(1);
    expect(resolveHtmlIdentity(rules, rules[1])).to.be.true;
    expect(logged.filter((m) => m.includes('applying it site-wide'))).to.have.lengthOf(1);
  });

  it('does not let one site suppress another site\'s notice', () => {
    // One bulk submission spans one job per origin and this module reads a
    // different config.json per origin, so a single module-level flag let the
    // first site's notice through and silenced every other site's.
    //
    // Both sites deliberately use IDENTICAL rule patterns: rule urls are PATHS,
    // not origins, and the live main-- and stage-- da-bacom configs carry
    // byte-identical patterns. An earlier key omitted the origin and passed
    // this test only because the two sites had been given different patterns,
    // which proved the key was not a single global flag but not that it was
    // per-site.
    resetIdentityNoticesForTesting();
    const siteA = [{ url: '/**', htmlIdentity: 'true' }, { url: '/products/**' }];
    const siteB = [{ url: '/**', htmlIdentity: 'true' }, { url: '/products/**' }];
    const logged = [];
    window.lana = { log: (msg) => logged.push(msg) };
    expect(resolveHtmlIdentity(siteA, siteA[1], 'https://main--da-bacom--adobecom.aem.live')).to.be.true;
    expect(resolveHtmlIdentity(siteB, siteB[1], 'https://stage--da-bacom--adobecom.aem.live')).to.be.true;
    expect(logged.filter((m) => m.includes('applying it site-wide'))).to.have.lengthOf(2);
    // Same origin twice is still deduped.
    expect(resolveHtmlIdentity(siteA, siteA[1], 'https://main--da-bacom--adobecom.aem.live')).to.be.true;
    expect(logged.filter((m) => m.includes('applying it site-wide'))).to.have.lengthOf(2);
  });

  it('resolves to the matched rule when no rule opts in', () => {
    const rules = [{ url: '/**' }, { url: '/products/**' }];
    expect(resolveHtmlIdentity(rules, rules[1])).to.be.false;
  });

  it('resolves ON when rules disagree, because losing an id is unrecoverable', () => {
    // A card that keeps its established `.html` id stays findable; one that
    // loses it is orphaned with no way back, so ON is the safe direction.
    const rules = [
      { url: '/**', htmlIdentity: 'true' },
      { url: '/products/**', htmlIdentity: 'false' },
    ];
    expect(resolveHtmlIdentity(rules, rules[1])).to.be.true;
  });

  it('warns when it has to override a rule that disagrees', () => {
    const logged = [];
    window.lana = { log: (msg) => logged.push(msg) };
    const rules = [
      { url: '/**', htmlIdentity: 'true' },
      { url: '/products/**', htmlIdentity: 'false' },
    ];
    resolveHtmlIdentity(rules, rules[1]);
    expect(logged.some((m) => m.includes('disagrees across rules'))).to.be.true;
  });

  it('tolerates a missing or non-array rule list', () => {
    expect(resolveHtmlIdentity(undefined, { htmlIdentity: 'true' })).to.be.true;
    expect(resolveHtmlIdentity(null, undefined)).to.be.false;
  });
});

describe('auto-publish: resolveTargets', () => {
  it('returns default targets when rule has no targets', () => {
    expect(resolveTargets({}, 'publish')).to.deep.equal(
      [{ caasEnv: 'prod', draftOnly: false }],
    );
    expect(resolveTargets({ targets: [] }, 'preview')).to.deep.equal([
      { caasEnv: 'prod', draftOnly: true },
      { caasEnv: 'stage', draftOnly: false },
    ]);
  });

  it('uses rule.targets when provided', () => {
    const rule = { targets: [{ caasEnv: 'stage', draftOnly: true }] };
    expect(resolveTargets(rule, 'publish')).to.deep.equal(rule.targets);
  });

  it('returns undefined for unknown action when no rule.targets', () => {
    expect(resolveTargets({}, 'wat')).to.be.undefined;
  });
});

describe('auto-publish: isDisabledOnPage', () => {
  const parse = (html) => new DOMParser().parseFromString(html, 'text/html');

  it('returns false when no DOM provided', () => {
    expect(isDisabledOnPage(null)).to.be.false;
    expect(isDisabledOnPage(undefined)).to.be.false;
  });

  it('returns false when no .card-metadata block', () => {
    expect(isDisabledOnPage(parse('<html><body><p>x</p></body></html>'))).to.be.false;
  });

  it('returns false when card-metadata has no auto-publish row', () => {
    expect(isDisabledOnPage(parse(PAGE_HTML_WITH_METADATA))).to.be.false;
  });

  it('returns true when auto-publish: false is present', () => {
    expect(isDisabledOnPage(parse(PAGE_HTML_DISABLED))).to.be.true;
  });

  it('is case-insensitive on key and value', () => {
    const html = `<div class="card-metadata"><div>
      <div>Auto-Publish</div><div>FALSE</div>
    </div></div>`;
    expect(isDisabledOnPage(parse(html))).to.be.true;
  });

  it('does not match auto-publish: true', () => {
    const html = `<div class="card-metadata"><div>
      <div>auto-publish</div><div>true</div>
    </div></div>`;
    expect(isDisabledOnPage(parse(html))).to.be.false;
  });
});

describe('auto-publish: caasAutoPublish gating', () => {
  it('skips when action is unsupported', async () => {
    const result = await caasAutoPublish({ action: 'delete' });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('unsupported-action');
  });

  it('skips when action is missing', async () => {
    const result = await caasAutoPublish({});
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('unsupported-action');
  });

  it('skips when required args are missing', async () => {
    const result = await caasAutoPublish({ action: 'publish' });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('missing-required-args');
  });

  it('skips when getAuthToken is not a function', async () => {
    const result = await caasAutoPublish({
      action: 'publish',
      url: 'https://x',
      path: '/x',
      origin: 'https://x',
      getAuthToken: 'not-a-function',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('missing-required-args');
  });

  it('skips with no-config when /.milo/caas/config.json is 404', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves(new Response('not found', { status: 404 }));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('no-config');
  });

  it('skips with no-config when rules array is empty', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({ autoPublish: { data: [] } }));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('no-config');
  });

  it('skips with no-matching-rule when path matches nothing', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({ autoPublish: { data: [{ url: '/blog/**', enabled: true }] } }));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/x`,
      path: '/products/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('no-matching-rule');
  });

  it('skips with rule-disabled when matched rule is enabled:false', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({
      autoPublish: {
        data: [
          { url: '/products/**', enabled: true },
          { url: '/products/legacy/**', enabled: false },
        ],
      },
    }));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/legacy/old`,
      path: '/products/legacy/old',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('rule-disabled');
  });

  it('honors enabled:"false", the only form a config sheet can author', async () => {
    // The check was a strict `=== false`, but this config is spreadsheet-backed
    // and every cell is a string. A site that had explicitly turned autopublish
    // off therefore kept publishing, with no error anywhere to say so.
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({ autoPublish: { data: [{ url: '/products/**', enabled: 'false' }] } }));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/old`,
      path: '/products/old',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('rule-disabled');
  });

  it('tags the kill-switch diagnostic outside the htmlIdentity tag', async () => {
    // This message says a site has STOPPED publishing. It is not an identity
    // diagnostic, so it must not ship under the htmlIdentity tag -- otherwise
    // muting or retiring that tag once the rollout finishes silently takes this
    // with it. Nothing else asserts lana's tag argument, so a refactor dropping
    // the second argument to createIdentityLogger would be invisible.
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({ autoPublish: { data: [{ url: '/products/**', enabled: 'false' }] } }));
    const calls = [];
    window.lana = { log: (msg, opts) => calls.push({ msg, opts }) };
    await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/x`,
      path: '/products/x',
      origin,
      getAuthToken: async () => 'tok',
    });
    const killSwitch = calls.find((c) => c.msg.includes('is disabled by its enabled column'));
    expect(killSwitch, 'kill-switch diagnostic was not logged').to.exist;
    expect(killSwitch.opts.tags).to.equal('caas,autoPublish');
  });

  it('warns when enabled holds a value that means neither true nor false', async () => {
    // 'yes' is not a recognized flag, so it falls through to ENABLED -- the
    // opposite of what an author typing it almost certainly intended. Silence
    // here is how a typo becomes a site that keeps publishing forever.
    const logged = [];
    const origin = uniqueOrigin();
    window.lana = { log: (msg) => logged.push(msg) };
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({ autoPublish: { data: [{ url: '/products/**', enabled: 'yes' }] } }));
    await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/old`,
      path: '/products/old',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(logged.some((m) => m.includes("unrecognized enabled value 'yes'"))).to.be.true;
  });

  it('treats a non-false enabled value as enabled', async () => {
    // Absent/true/empty must keep publishing; only an explicit opt-out stops it.
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => jsonResponse({ autoPublish: { data: [{ url: '/products/**', enabled: 'true' }] } }));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/old`,
      path: '/products/old',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.reason).to.not.equal('rule-disabled');
  });

  it('returns fetch error when page fetch fails', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/x', enabled: true }] } });
      }
      return new Response('boom', { status: 500, statusText: 'Internal Error' });
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.false;
    expect(result.error).to.match(/fetch-failed/);
  });

  it('skips with no-card-metadata when page has no .card-metadata block', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/x', enabled: true }] } });
      }
      return htmlResponse(PAGE_HTML_NO_METADATA);
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('no-card-metadata');
  });

  it('skips with page-override-disabled when auto-publish:false in card-metadata', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/x', enabled: true }] } });
      }
      return htmlResponse(PAGE_HTML_DISABLED);
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('page-override-disabled');
  });

  it('skips with no-content-type-tag when the card has no caas:content-type tag', async () => {
    const origin = uniqueOrigin();
    // Same shape as a valid card (so no metadata errors) but without any tags —
    // i.e. a core page (product/solution/index) that should not auto-publish.
    const htmlNoContentType = `
      <!DOCTYPE html><html lang="en"><head><title>Core page</title></head>
      <body><main>
        <img src="https://example.com/img/card.jpg" alt="card alt">
        <div><div class="card-metadata">
          <div><div>title</div><div>A product page</div></div>
          <div><div>cardtitle</div><div>Product</div></div>
          <div><div>carddescription</div><div>A product page description</div></div>
          <div><div>cardimagealttext</div><div>A descriptive alt</div></div>
          <div><div>country</div><div>us</div></div>
          <div><div>lang</div><div>en</div></div>
        </div></div>
      </main></body></html>`;
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/x', enabled: true }] } });
      }
      return htmlResponse(htmlNoContentType);
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'x.adobe.com',
      repo: 'x',
    });
    expect(result.skipped).to.be.true;
    expect(result.reason).to.equal('no-content-type-tag');
  });
});

describe('auto-publish: caasAutoPublish posting', () => {
  // Posts the page through the full pipeline. Verifies the right number of
  // milo-caas calls happen with the right caas-env / draft headers.
  const setupHappyPath = (origin, ruleOverrides = {}, pageHtml = PAGE_HTML_WITH_METADATA) => {
    const postCalls = [];
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input, init) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/x', enabled: true, ...ruleOverrides }] } });
      }
      if (u.startsWith(POST_XDM_URL)) {
        postCalls.push({
          caasEnv: init?.headers?.['caas-env'],
          draft: init?.headers?.draft,
          authorization: init?.headers?.Authorization,
          body: init?.body ? JSON.parse(init.body) : undefined,
        });
        return jsonResponse({ success: true, status: 201 });
      }
      // Tag taxonomy fetch falls through to local import on 404
      if (u.includes('/chimera-api/tags')) {
        return new Response('not found', { status: 404 });
      }
      if (u.startsWith(origin)) {
        return htmlResponse(pageHtml);
      }
      return new Response('not found', { status: 404 });
    });
    return postCalls;
  };

  it('warns when htmlIdentity holds an unrecognized value', async () => {
    // 'yes' is not a recognized flag so it falls through to OFF, meaning ids
    // are NOT normalized -- the silent card-orphaning this feature prevents.
    const logged = [];
    window.lana = { log: (msg) => logged.push(msg) };
    const origin = uniqueOrigin();
    setupHappyPath(origin, { htmlIdentity: 'yes' });
    await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(logged.some((m) => m.includes("unrecognized htmlIdentity value 'yes'"))).to.be.true;
  });

  it('posts once with prod/live headers on publish action', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupHappyPath(origin);
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok-publish',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(result.results).to.have.lengthOf(1);
    expect(postCalls).to.have.lengthOf(1);
    expect(postCalls[0].caasEnv).to.equal('prod');
    expect(postCalls[0].draft).to.equal(false);
    expect(postCalls[0].authorization).to.equal('Bearer tok-publish');
  });

  it('builds card identity from config host + .html, not the aem url', async () => {
    // Regression for the two-path divergence: the card url/identity must be the
    // production url the config declares, so this path matches the milo-caas
    // poller for the same page.
    const origin = uniqueOrigin();
    let postedProps;
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input, init) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        const rule = { url: '/x', enabled: true, host: 'business.adobe.com', repo: 'bacom', htmlExt: true };
        return jsonResponse({ autoPublish: { data: [rule] } });
      }
      if (u.startsWith(POST_XDM_URL)) {
        postedProps = JSON.parse(init.body);
        return jsonResponse({ success: true, status: 201 });
      }
      if (u.includes('/chimera-api/tags')) return new Response('not found', { status: 404 });
      if (u.startsWith(origin)) return htmlResponse(PAGE_HTML_WITH_METADATA);
      return new Response('not found', { status: 404 });
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
    });
    expect(result.skipped).to.be.false;
    expect(postedProps.url).to.equal('https://business.adobe.com/x.html');
    // contentId is hashed from a scheme-less prodUrl, matching the legacy
    // bulk-publish-to-caas.js tool's own (untouched) hash input exactly, so
    // this path and the legacy tool never produce two different card
    // identities for the same page.
    expect(postedProps.contentId).to.equal(await getUuid('business.adobe.com/x.html'));
  });

  it('posts twice in parallel on preview action (prod-draft + stage-live)', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupHappyPath(origin);
    const result = await caasAutoPublish({
      action: 'preview',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok-preview',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(result.results).to.have.lengthOf(2);
    expect(postCalls).to.have.lengthOf(2);
    const envs = postCalls.map((c) => `${c.caasEnv}:${c.draft}`).sort();
    expect(envs).to.deep.equal(['prod:true', 'stage:false']);
  });

  it('uses rule.targets to override default targets', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupHappyPath(origin, { targets: [{ caasEnv: 'stage', draftOnly: true }] });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(postCalls).to.have.lengthOf(1);
    expect(postCalls[0].caasEnv).to.equal('stage');
    expect(postCalls[0].draft).to.equal(true);
  });

  it('returns no-auth-token error when getAuthToken returns falsy', async () => {
    const origin = uniqueOrigin();
    setupHappyPath(origin);
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => null,
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(result.error).to.equal('no-auth-token');
  });

  it('isolates per-target failure: one target fails, others still report', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    let postCount = 0;
    fetchStub.callsFake(async (input) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/x', enabled: true }] } });
      }
      if (u.startsWith(POST_XDM_URL)) {
        postCount += 1;
        if (postCount === 1) throw new Error('network down');
        return jsonResponse({ success: true });
      }
      if (u.includes('/chimera-api/tags')) return new Response('', { status: 404 });
      if (u.startsWith(origin)) return htmlResponse(PAGE_HTML_WITH_METADATA);
      return new Response('', { status: 404 });
    });
    const result = await caasAutoPublish({
      action: 'preview',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(result.results).to.have.lengthOf(2);
    const oks = result.results.filter((r) => r.ok);
    const fails = result.results.filter((r) => !r.ok);
    expect(oks).to.have.lengthOf(1);
    expect(fails).to.have.lengthOf(1);
    expect(fails[0].error).to.match(/network down/);
  });

  it('never throws — getCustomConfig fetch rejection becomes a structured error', async () => {
    const origin = uniqueOrigin();
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.rejects(new Error('network kaput'));
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(result.error).to.match(/network kaput/);
  });

  it('never throws — getAuthToken throwing becomes a structured error', async () => {
    const origin = uniqueOrigin();
    setupHappyPath(origin);
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => { throw new Error('ims down'); },
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(result.error).to.match(/ims down/);
  });

  // Regression coverage for the bug where every page auto-published through
  // bulk-publish-v2 got the SAME country/lang, derived from the tool's own
  // window.location instead of each job resource's own path. `repo: 'news'`
  // exercises the news-origin shortcut in getLanguageFirstCountryAndLang so
  // the test doesn't need to mock lingo-site-mapping.json.
  it('resolves distinct country/lang per page when rule.languageFirst is set', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupHappyPath(origin, { url: '/**', languageFirst: true }, PAGE_HTML_NO_LOCALE_METADATA);

    const esResult = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/es/mx/article-one`,
      path: '/es/mx/article-one',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'news',
    });
    const frResult = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/fr/be/article-two`,
      path: '/fr/be/article-two',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'news',
    });

    expect(esResult.skipped).to.be.false;
    expect(frResult.skipped).to.be.false;
    expect(postCalls).to.have.lengthOf(2);
    // Spanish page: lang from path segment 1, country resolved via LOCALES['mx'].
    expect(postCalls[0].body.language).to.equal('es');
    expect(postCalls[0].body.country).to.equal('mx');
    // French page (different page, same batch): its own path, not the first page's.
    expect(postCalls[1].body.language).to.equal('fr');
    expect(postCalls[1].body.country).to.equal('be');
  });

  it('uses plain path-prefix locale (not the news lang/country segments) when languageFirst is unset', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupHappyPath(origin, { url: '/**' }, PAGE_HTML_NO_LOCALE_METADATA);

    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/es/mx/article`,
      path: '/es/mx/article',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'news',
    });

    expect(result.skipped).to.be.false;
    // getLocale(LOCALES, path) reads only the top-level "/es" prefix, so country
    // comes from LOCALES.es ('es'), not the news-style "mx" segment.
    expect(postCalls[0].body.language).to.equal('es');
    expect(postCalls[0].body.country).to.equal('es');
  });
});

describe('auto-publish: caasAutoPublish — autoDetectLingo (fully Lingo-enabled site)', () => {
  // Mirrors the shape of the real lingo-site-mapping.json for bacom: "/fr" is a
  // genuine LFL locale, "/" is the root family (with "gb"/"au" as English-regional
  // satellites that are NOT themselves LFL). "uk" appears nowhere in this mapping,
  // so — per resolveSiteLocaleStr/isLingoLangFirstPath — it must fall through to
  // the classic non-LFL locale lookup rather than being swept into the root family.
  const BACOM_LINGO_MAPPING = {
    'site-query-index-map': { data: [{ uniqueSiteId: 'bacom-site', caasOrigin: 'bacom' }] },
    'site-locales': {
      data: [
        { uniqueSiteId: 'bacom-site', baseSite: '/fr', regionalSites: '/be_fr, /ca_fr' },
        { uniqueSiteId: 'bacom-site', baseSite: '/', regionalSites: '/gb, /au' },
      ],
    },
  };

  // Like setupHappyPath, but also serves lingo-site-mapping.json so
  // isLingoLangFirstPath/getLingoSiteLocale can resolve per-page LFL-ness —
  // the mechanism autoDetectLingo actually exercises.
  const setupLingoSite = (origin, ruleOverrides, pageHtml = PAGE_HTML_NO_LOCALE_METADATA) => {
    const postCalls = [];
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async (input, init) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: '/**', enabled: true, ...ruleOverrides }] } });
      }
      if (u.includes('lingo-site-mapping.json')) {
        return jsonResponse(BACOM_LINGO_MAPPING);
      }
      if (u.startsWith(POST_XDM_URL)) {
        postCalls.push({ body: init?.body ? JSON.parse(init.body) : undefined });
        return jsonResponse({ success: true, status: 201 });
      }
      if (u.includes('/chimera-api/tags')) return new Response('not found', { status: 404 });
      if (u.startsWith(origin)) return htmlResponse(pageHtml);
      return new Response('not found', { status: 404 });
    });
    return postCalls;
  };

  it('resolves a /fr/ page as Language-First (lang: fr, country: xx) from rule.autoDetectLingo alone — no manual languageFirst flag set', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupLingoSite(origin, { autoDetectLingo: true, repo: 'bacom' });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/fr/products/acrobat-business`,
      path: '/fr/products/acrobat-business',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(postCalls[0].body.language).to.equal('fr');
    expect(postCalls[0].body.country).to.equal('xx');
  });

  it('resolves an unprefixed root page as the base Language-First locale (lang: en, country: xx) — not the classic en-US default', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupLingoSite(origin, { autoDetectLingo: true, repo: 'bacom' });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/products/brand-concierge`,
      path: '/products/brand-concierge',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(postCalls[0].body.language).to.equal('en');
    expect(postCalls[0].body.country).to.equal('xx');
  });

  it('resolves a /uk/ page as non-LFL (lang: en, country: gb) because "uk" is absent from bacom\'s own mapping', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupLingoSite(origin, { autoDetectLingo: true, repo: 'bacom' });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/uk/products/brand-concierge`,
      path: '/uk/products/brand-concierge',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'bacom',
    });
    expect(result.skipped).to.be.false;
    expect(postCalls[0].body.language).to.equal('en');
    expect(postCalls[0].body.country).to.equal('gb');
  });

  it('falls back to non-LFL when an origin is absent from the mapping entirely (isLingoLangFirstPath returns null)', async () => {
    const origin = uniqueOrigin();
    // 'other' has no entry in site-query-index-map at all.
    const postCalls = setupLingoSite(origin, { autoDetectLingo: true, repo: 'other' });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/de/products/x`,
      path: '/de/products/x',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'other',
    });
    expect(result.skipped).to.be.false;
    // getLocale(LOCALES, path) fallback: 'de' -> de-DE.
    expect(postCalls[0].body.language).to.equal('de');
    expect(postCalls[0].body.country).to.equal('de');
  });

  // A page is language-first only if (a) lingo-site-mapping says so, or (b) it's
  // a news-origin page — and (b) is carved out of auto-detect entirely: news
  // always defers to the manual languageFirst checkbox, regardless of
  // autoDetectLingo. This guards against silently changing that behavior while
  // adding autoDetectLingo support for auto-publish.
  it('autoDetectLingo has no effect on news — languageFirst must still be set manually for LFL', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupLingoSite(
      origin,
      { autoDetectLingo: true, repo: 'news' }, // no languageFirst set
      PAGE_HTML_NO_LOCALE_METADATA,
    );
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/es/mx/article`,
      path: '/es/mx/article',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'news',
    });
    expect(result.skipped).to.be.false;
    // Non-LFL classic lookup (same as the existing "languageFirst is unset" test):
    // reads only the top-level "/es" prefix via LOCALES, not the news lang/country segments.
    expect(postCalls[0].body.language).to.equal('es');
    expect(postCalls[0].body.country).to.equal('es');
  });

  it('news with languageFirst: true is still Language-First even when autoDetectLingo is also set', async () => {
    const origin = uniqueOrigin();
    const postCalls = setupLingoSite(
      origin,
      { autoDetectLingo: true, languageFirst: true, repo: 'news' },
      PAGE_HTML_NO_LOCALE_METADATA,
    );
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/es/mx/article`,
      path: '/es/mx/article',
      origin,
      getAuthToken: async () => 'tok',
      host: 'business.adobe.com',
      repo: 'news',
    });
    expect(result.skipped).to.be.false;
    // News-specific LFL branch: lang/country come from the URL's own segments,
    // not lingo-site-mapping (news is excluded from the mapping index entirely).
    expect(postCalls[0].body.language).to.equal('es');
    expect(postCalls[0].body.country).to.equal('mx');
  });
});

describe('auto-publish: resolveHtmlExt', () => {
  it('falls back to the rule-wide value when no env override is authored', () => {
    expect(resolveHtmlExt({ htmlExt: 'true' }, 'prod')).to.be.true;
    expect(resolveHtmlExt({ htmlExt: 'false' }, 'stage')).to.be.false;
    expect(resolveHtmlExt({}, 'prod')).to.be.false;
    expect(resolveHtmlExt(undefined, 'prod')).to.be.false;
  });

  it('lets an env override win over the rule-wide value', () => {
    const rule = { htmlExt: 'true', htmlExtStage: 'false' };
    expect(resolveHtmlExt(rule, 'stage')).to.be.false;
    expect(resolveHtmlExt(rule, 'prod')).to.be.true;
  });

  it('treats an empty override cell as unauthored', () => {
    // A spreadsheet emits '' for a column the row leaves blank; that must not
    // read as `false` and silently strip .html from that environment.
    expect(resolveHtmlExt({ htmlExt: 'true', htmlExtStage: '' }, 'stage')).to.be.true;
  });

  it('accepts booleans as well as sheet strings', () => {
    expect(resolveHtmlExt({ htmlExt: true, htmlExtStage: false }, 'stage')).to.be.false;
    expect(resolveHtmlExt({ htmlExt: true, htmlExtStage: false }, 'prod')).to.be.true;
  });

  it('pins every htmlExt column to its legacy strict reading', () => {
    // htmlExt is a PRE-EXISTING live config column previously parsed as
    // `=== true || === 'true'`. Honouring the canonical parser's wider set
    // would flip those sites' public urls -- and prodUrl is the uuid hash
    // input, so it would silently rehash every card they publish, at merge,
    // with no rollback.
    expect(resolveHtmlExt({ htmlExt: 'TRUE' }, 'prod')).to.be.false;
    expect(resolveHtmlExt({ htmlExt: ' true ' }, 'prod')).to.be.false;
    expect(resolveHtmlExt({ htmlExt: 'on' }, 'prod')).to.be.false;
    // The exact lowercase value is unaffected, in both directions.
    expect(resolveHtmlExt({ htmlExt: 'true' }, 'prod')).to.be.true;
    expect(resolveHtmlExt({ htmlExt: true }, 'prod')).to.be.true;
    expect(resolveHtmlExt({ htmlExt: 'true', htmlExtStage: 'FALSE' }, 'stage')).to.be.false;
  });

  it('pins the per-environment columns identically, so a uniform config cannot split', () => {
    // Pinning the rule-wide column but not its siblings made these resolve to
    // DIFFERENT values, so a config the author believes is uniform produced two
    // htmlExt variants, two prodUrls, and tripped the env-split refusal -- which
    // then blamed htmlIdentity, a cell that is not the cause.
    expect(resolveHtmlExt({ htmlExt: 'on', htmlExtStage: 'on' }, 'prod')).to.be.false;
    expect(resolveHtmlExt({ htmlExt: 'on', htmlExtStage: 'on' }, 'stage')).to.be.false;
    expect(resolveHtmlExt({ htmlExt: 'TRUE', htmlExtProd: 'TRUE' }, 'prod')).to.be.false;
    expect(resolveHtmlExt({ htmlExt: 'TRUE', htmlExtProd: 'TRUE' }, 'stage')).to.be.false;
  });

  it('reports a pinned htmlExt cell once, not once per resolve', () => {
    // resolveHtmlExt runs once per target AND again per ruleEnvs entry, so an
    // undeduped error-severity message fired 3-4x per url.
    resetIdentityNoticesForTesting();
    const logged = [];
    window.lana = { log: (msg) => logged.push(msg) };
    const rule = { url: '/**', htmlExt: 'On' };
    expect(resolveHtmlExt(rule, 'prod')).to.be.false;
    expect(resolveHtmlExt(rule, 'prod')).to.be.false;
    expect(resolveHtmlExt(rule, 'stage')).to.be.false;
    const pins = logged.filter((m) => m.includes('was read as false before the parser was widened'));
    expect(pins).to.have.lengthOf(1);
  });

  it('ignores an unknown env rather than reading an arbitrary rule property', () => {
    // caasEnv is interpolated into the lookup key, so an unvalidated value
    // would let a typo (or a caller-injected string) pull an unrelated field
    // in as if it were a .html policy.
    const rule = { htmlExt: 'true', htmlExtHost: 'false', host: 'false' };
    expect(resolveHtmlExt(rule, 'host')).to.be.true;
    expect(resolveHtmlExt(rule, 'Prod')).to.be.true;
    expect(resolveHtmlExt({ htmlExt: 'false', htmlExtBogus: 'true' }, 'bogus')).to.be.false;
  });
});

describe('auto-publish: resolveHtmlExt blank override cells', () => {
  it('treats a whitespace-only override cell as unauthored', () => {
    // An author clearing a cell by typing a space produces '  ', which is not
    // '' and so was taken as a real override -- resolving to false WITHOUT
    // tripping the unrecognized-value warning, silently flipping that
    // environment's public urls with no diagnostic at all.
    const rule = { url: '/**', htmlExt: 'true', htmlExtProd: '  ' };
    expect(resolveHtmlExt(rule, 'prod')).to.be.true;
  });

  it('still honors a genuinely authored override', () => {
    expect(resolveHtmlExt({ url: '/**', htmlExt: 'true', htmlExtProd: 'false' }, 'prod')).to.be.false;
  });
});

describe('auto-publish: per-environment htmlExt', () => {
  let envFetchStub;
  afterEach(() => envFetchStub?.restore());

  const setup = (origin, rule, rulePath = '/x') => {
    const posts = [];
    envFetchStub = sinon.stub(window, 'fetch');
    envFetchStub.callsFake(async (input, init) => {
      const u = typeof input === 'string' ? input : input.url;
      if (u.includes('/.milo/caas/config.json')) {
        return jsonResponse({ autoPublish: { data: [{ url: rulePath, enabled: true, ...rule }] } });
      }
      if (u.startsWith(POST_XDM_URL)) {
        posts.push({ caasEnv: init?.headers?.['caas-env'], body: JSON.parse(init.body) });
        return jsonResponse({ success: true, status: 201 });
      }
      if (u.includes('/chimera-api/tags')) return new Response('not found', { status: 404 });
      if (u.startsWith(origin)) return htmlResponse(PAGE_HTML_WITH_METADATA);
      return new Response('not found', { status: 404 });
    });
    return posts;
  };

  const setupPath = (origin, rulePath, rule) => setup(origin, rule, rulePath);

  const run = (origin) => caasAutoPublish({
    action: 'preview',
    url: `${origin}/x`,
    path: '/x',
    origin,
    getAuthToken: async () => 'tok',
  });

  it('serves an extensionless url to stage and .html to prod, with ONE identity', async () => {
    // bacom's migration window: stage is extensionless before prod is. The
    // public url must differ per environment, but contentId must NOT -- a DA
    // collection holds one id and is promoted unchanged, so an id that varied
    // per environment would resolve in only one of them.
    const origin = uniqueOrigin();
    const posts = setup(origin, {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtStage: 'false',
      htmlIdentity: 'true',
    });
    const result = await run(origin);

    expect(result.skipped).to.be.false;
    expect(posts).to.have.lengthOf(2);
    const stage = posts.find((post) => post.caasEnv === 'stage');
    const prod = posts.find((post) => post.caasEnv === 'prod');

    expect(stage.body.url).to.equal('https://business.adobe.com/x');
    expect(prod.body.url).to.equal('https://business.adobe.com/x.html');

    const expectedId = await getUuid('business.adobe.com/x.html');
    expect(stage.body.contentId).to.equal(expectedId);
    expect(prod.body.contentId).to.equal(expectedId);
  });

  it('refuses an env split without htmlIdentity, which would fork the card id', async () => {
    const origin = uniqueOrigin();
    const posts = setup(origin, { host: 'business.adobe.com', repo: 'bacom', htmlExt: 'true', htmlExtStage: 'false' });
    const result = await run(origin);
    expect(result).to.deep.equal({ skipped: false, error: 'env-split-requires-html-identity' });
    expect(posts).to.have.lengthOf(0);
  });

  it('refuses the same env split on publish, not just preview', async () => {
    // The invariant ("one page, one id") is a property of the RULE, but the two
    // actions target different env sets: publish hits prod alone while preview
    // hits prod and stage. Scoped to the action's own targets, this identical
    // misconfiguration was refused on every preview and waved through on every
    // publish -- minting prod cards and no stage ones, with no rule-level signal.
    const origin = uniqueOrigin();
    const posts = setup(origin, { host: 'business.adobe.com', repo: 'bacom', htmlExt: 'true', htmlExtStage: 'false' });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
    });
    expect(result).to.deep.equal({ skipped: false, error: 'env-split-requires-html-identity' });
    expect(posts).to.have.lengthOf(0);
  });

  it('refuses a fork contributed by a target whose caasEnv is missing', async () => {
    // A target with an absent or non-string caasEnv is filtered out of the
    // guard's declared-env set, but the BUILD path does no such filtering:
    // resolveHtmlExt falls back to the rule-wide htmlExt for it, so it still
    // contributes a second variant, a second prodUrl and a second contentId.
    // Narrowing the guard to the rule's well-formed envs therefore traded a
    // false refusal for a false ACCEPTANCE -- two live cards for one page,
    // which is the unrecoverable outcome this guard exists to prevent.
    const origin = uniqueOrigin();
    const posts = setup(origin, {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtProd: 'false',
      targets: [{ caasEnv: 'prod', draftOnly: false }, { draftOnly: false }],
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
    });
    expect(result).to.deep.equal({ skipped: false, error: 'env-split-requires-html-identity' });
    expect(posts).to.have.lengthOf(0);
  });

  it('does NOT refuse a rule whose declared targets cannot reach the split environment', async () => {
    // The guard asks which environments the RULE can reach. `resolveTargets`
    // returns `rule.targets` verbatim when the rule declares them, so a rule
    // targeting prod alone never touches stage -- a leftover `htmlExtStage`
    // cell on it describes no reachable fork and must not stop publishing.
    // Deriving the guard set from `allowedHtmlExtEnvs` was wrong here: that is
    // an allowlist for override COLUMN NAMES and is always a superset of
    // {prod, stage} by construction, so it refused this normal rollout shape.
    const origin = uniqueOrigin();
    const posts = setup(origin, {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtStage: 'false',
      targets: [{ caasEnv: 'prod', draftOnly: false }],
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
    });
    expect(result.error).to.equal(undefined);
    expect(posts).to.have.lengthOf(1);
  });

  it('still refuses when the rule declares targets that DO span the split', async () => {
    // Converse of the above: narrowing the guard to the rule's declared targets
    // must not let a genuine fork through.
    const origin = uniqueOrigin();
    const posts = setup(origin, {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtStage: 'false',
      targets: [{ caasEnv: 'prod', draftOnly: false }, { caasEnv: 'stage', draftOnly: false }],
    });
    const result = await caasAutoPublish({
      action: 'publish',
      url: `${origin}/x`,
      path: '/x',
      origin,
      getAuthToken: async () => 'tok',
    });
    expect(result).to.deep.equal({ skipped: false, error: 'env-split-requires-html-identity' });
    expect(posts).to.have.lengthOf(0);
  });

  it('refuses an env split the htmlIdentity policy does not actually cover', async () => {
    // htmlIdentity only normalizes in-scope urls (the bacom prod host). On another
    // host the policy is inert, so the flag being on does not prove the ids
    // converge -- stage would hash `/x` and prod `/x.html`. Guarding on the
    // flag instead of the real hash input would wave this through.
    const origin = uniqueOrigin();
    const posts = setup(origin, {
      host: 'www.adobe.com',
      repo: 'milo',
      htmlExt: 'true',
      htmlExtStage: 'false',
      htmlIdentity: 'true',
    });
    const result = await run(origin);
    expect(result).to.deep.equal({ skipped: false, error: 'env-split-requires-html-identity' });
    expect(posts).to.have.lengthOf(0);
  });

  it('names the real cause when htmlIdentity is set but the host is out of scope', async () => {
    // The refusal fires for two different causes needing two different fixes.
    // Telling an operator who already set htmlIdentity to "set htmlIdentity"
    // sends them to re-check a correct cell, with nothing pointing at the
    // hardcoded host scope that is the actual blocker.
    const logs = [];
    window.lana = { log: (msg) => logs.push(msg) };
    const origin = uniqueOrigin();
    setup(origin, {
      host: 'www.adobe.com',
      repo: 'milo',
      htmlExt: 'true',
      htmlExtStage: 'false',
      htmlIdentity: 'true',
    });
    await run(origin);
    const refusal = logs.find((m) => m.includes('refusing to publish'));
    expect(refusal, 'no refusal was logged').to.exist;
    expect(refusal).to.include('www.adobe.com');
    expect(refusal).to.not.include('Set htmlIdentity on the rule');
  });

  it('still says to set htmlIdentity when the flag is genuinely absent', async () => {
    const logs = [];
    window.lana = { log: (msg) => logs.push(msg) };
    const origin = uniqueOrigin();
    setup(origin, {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtStage: 'false',
    });
    await run(origin);
    const refusal = logs.find((m) => m.includes('refusing to publish'));
    expect(refusal, 'no refusal was logged').to.exist;
    expect(refusal).to.include('Set htmlIdentity on the rule');
  });

  it('covers a blog path rather than exempting it, so its ids survive', async () => {
    // The blog is scoped out by its own repo's config, never by path here. If
    // the blog repo turns the flag on, an env split must behave like any other
    // section: both environments keep hashing the .html url the ids were
    // minted from.
    const origin = uniqueOrigin();
    const posts = setupPath(origin, '/blog/post', {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtStage: 'false',
      htmlIdentity: 'true',
    });
    const result = await caasAutoPublish({
      action: 'preview',
      url: `${origin}/blog/post`,
      path: '/blog/post',
      origin,
      getAuthToken: async () => 'tok',
    });
    expect(result.skipped).to.be.false;
    expect(posts).to.have.lengthOf(2);
    const stage = posts.find((post) => post.caasEnv === 'stage');
    const prod = posts.find((post) => post.caasEnv === 'prod');

    // The public urls still differ per environment; only identity converges.
    expect(stage.body.url).to.equal('https://business.adobe.com/blog/post');
    expect(prod.body.url).to.equal('https://business.adobe.com/blog/post.html');

    const expectedId = await getUuid('business.adobe.com/blog/post.html');
    expect(stage.body.contentId).to.equal(expectedId);
    expect(prod.body.contentId).to.equal(expectedId);
  });

  it('reports the resolved htmlExt per target', async () => {
    const origin = uniqueOrigin();
    setup(origin, {
      host: 'business.adobe.com',
      repo: 'bacom',
      htmlExt: 'true',
      htmlExtStage: 'false',
      htmlIdentity: 'true',
    });
    const result = await run(origin);
    const byEnv = Object.fromEntries(result.results.map((r) => [r.caasEnv, r.htmlExt]));
    expect(byEnv).to.deep.equal({ stage: false, prod: true });
  });

  it('sends one identical payload to every target when no override is authored', async () => {
    // The pre-existing path for every other tenant: targets agree, so they
    // collapse to a single build and byte-identical posts.
    const origin = uniqueOrigin();
    const posts = setup(origin, { host: 'business.adobe.com', repo: 'bacom', htmlExt: 'true' });
    const result = await run(origin);

    expect(result.skipped).to.be.false;
    expect(posts).to.have.lengthOf(2);
    expect(posts[0].body).to.deep.equal(posts[1].body);
    expect(posts[0].body.url).to.equal('https://business.adobe.com/x.html');
    expect(result.results.every((r) => r.htmlExt === true)).to.be.true;
  });
});
