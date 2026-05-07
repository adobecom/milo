import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  caasAutoPublish,
  isDisabledOnPage,
  matchesUrl,
  resolveRule,
  resolveTargets,
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

  it('skips rules without a url field', () => {
    expect(resolveRule([{ enabled: true }, { url: '/foo' }], '/foo').url).to.equal('/foo');
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
});

describe('auto-publish: caasAutoPublish posting', () => {
  // Posts the page through the full pipeline. Verifies the right number of
  // milo-caas calls happen with the right caas-env / draft headers.
  const setupHappyPath = (origin, ruleOverrides = {}) => {
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
        });
        return jsonResponse({ success: true, status: 201 });
      }
      // Tag taxonomy fetch falls through to local import on 404
      if (u.includes('/chimera-api/tags')) {
        return new Response('not found', { status: 404 });
      }
      if (u.startsWith(origin)) {
        return htmlResponse(PAGE_HTML_WITH_METADATA);
      }
      return new Response('not found', { status: 404 });
    });
    return postCalls;
  };

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
});
