import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import * as core from '../../../tools/send-to-caas/caas-payload-core.js';

// `tools/send-to-caas/caas-payload-builder.js` is a COMMITTED build artifact.
// The milo-caas scheduled service fetches it from milo.adobe.com and runs it in
// a vm, so it -- not the source sitting next to it -- decides card identity for
// every scheduled publish and removal.
//
// Rebuilding is a manual `npm run build:caas-payload-builder`, so the bundle can
// silently fall behind its source. That is not cosmetic drift: contentId and
// entityId are a hash of the production url, so a source change the bundle has
// not picked up makes the two publishers mint DIFFERENT ids for the same page --
// a duplicate card that nothing can delete, because removal looks up the id it
// would itself have minted.
//
// A byte-comparison against a fresh build cannot guard this: the minifier
// assigns mangled identifiers non-deterministically, so two builds of identical
// source differ. This asserts the property that actually matters instead --
// that the artifact and the source agree on every identity-critical input.
describe('caas-payload-builder bundle is not stale', () => {
  let bundle;

  // Shared by both getCaasIds matrices below. The `/blog` fixtures are what
  // make the parity guard see the extensionless-section carve-out at all:
  // every other url is outside it, so a bundle built before the carve-out
  // existed would still agree on all of them. `/blogging/post` pins the
  // segment match specifically -- a bundle that matched on substring would
  // disagree there and nowhere else.
  const IDENTITY_URLS = [
    'https://business.adobe.com/resources/x',
    'https://business.adobe.com/resources/x.html',
    'https://www.adobe.com/resources/x',
    'https://business.adobe.com/blog/post',
    'https://business.adobe.com/blog/post.html',
    'https://business.adobe.com/de/blog/post',
    'https://business.adobe.com/resources/blog/post',
    'https://business.adobe.com/blogging/post',
  ];
  const SECTION_LISTS = ['', 'blog', ['blog'], 'blog,news'];

  before(async () => {
    const res = await fetch('/tools/send-to-caas/caas-payload-builder.js');
    expect(res.ok, 'bundle is not fetchable').to.be.true;
    const code = await res.text();
    // The UMD wrapper assigns to `self.milo`; give it an isolated target rather
    // than letting it land on the test page's real window.
    const scope = { milo: undefined };
    // The UMD wrapper resolves its target as `(this || self).milo`, so `this`
    // has to be the isolated scope too -- otherwise it lands on the real window.
    // eslint-disable-next-line no-new-func
    new Function('self', code).call(scope, scope);
    bundle = scope.milo;
  });

  it('exposes the API the poller depends on', () => {
    ['buildCaasXdmPayload', 'getCaasIds', 'getProdUrl', 'hasCardMetadata', 'setConfig']
      .forEach((fn) => expect(bundle?.[fn], `bundle is missing ${fn}`).to.be.a('function'));
  });

  it('agrees with the source on getProdUrl for every authored htmlExt form', () => {
    // The source parses htmlExt through the shared flag parser, which accepts
    // 'TRUE'/' true '/'on'. A bundle built before that change required exactly
    // 'true', so these cells produced a different PUBLIC url -- and therefore a
    // different id -- in the poller than in auto-publish.
    [true, false, 'true', 'false', 'TRUE', ' true ', 'on', 'off', '', undefined]
      .forEach((htmlExt) => {
        const args = { host: 'business.adobe.com', path: '/resources/x', htmlExt };
        expect(bundle.getProdUrl(args), `htmlExt: ${JSON.stringify(htmlExt)}`)
          .to.equal(core.getProdUrl(args));
      });
  });

  it('agrees with the source on getCaasIds across the htmlIdentity matrix', async () => {
    // The section list has to vary alongside the flag. Held constant -- and
    // especially held empty -- the carve-out never runs, so every fixture
    // would agree on both sides no matter what the bundle does with it.
    const flags = [true, false, 'true', 'false', 'TRUE', 'on'];
    await Promise.all(IDENTITY_URLS.flatMap((url) => flags.flatMap((flag) => SECTION_LISTS
      .map(async (sections) => {
        const [fromBundle, fromCore] = await Promise.all([
          bundle.getCaasIds(url, 'default', flag, sections),
          core.getCaasIds(url, 'default', flag, sections),
        ]);
        const label = `${url} / ${JSON.stringify(flag)} / ${JSON.stringify(sections)}`;
        expect(fromBundle, label).to.eql(fromCore);
      }))));
  });

  it('agrees with the source on getCaasIds when htmlIdentity is OMITTED', async () => {
    // The poller's actual call shape today: it passes no third argument at all.
    // That is a distinct code path from an explicit `false` -- an internal
    // sentinel distinguishes them to drive a warning -- so the matrix above
    // does not cover the one form production currently uses.
    //
    // The section list is varied for the same reason the flag forms are, but
    // it CANNOT change the ids here: an omitted flag resolves to off, and with
    // the policy off there is nothing to carve out. What this does pin is that
    // the bundle agrees on that, rather than letting the qualifier leak into
    // the omitted path -- which is exactly how a half-applied policy would
    // first show up.
    await Promise.all(IDENTITY_URLS.flatMap((url) => SECTION_LISTS.map(async (sections) => {
      const [fromBundle, fromCore] = await Promise.all([
        bundle.getCaasIds(url, 'default', undefined, sections),
        core.getCaasIds(url, 'default', undefined, sections),
      ]);
      expect(fromBundle, `${url} / ${JSON.stringify(sections)}`).to.eql(fromCore);
    })));
  });

  it('agrees with the source on the whole payload for a fixed page', async () => {
    // Widens the guard to every prop the fixture can resolve offline, so a
    // future source change to one of those -- not just the identity inputs --
    // is caught. buildCaasXdmPayload is the largest surface and the one that in
    // fact drifted while the bundle sat stale.
    //
    // Honest limit, verified by running this against the stale bundle: the two
    // props that actually drifted (the `ara`->`ar` base-site language alias and
    // cta2url locale injection) do NOT differ here, because both need the tag
    // taxonomy / lingo mapping and those fetches are stubbed. This test does not
    // cover them; the getProdUrl and getCaasIds assertions above are what
    // currently catch a stale bundle.
    //
    // Stub the tag-taxonomy fetch so this never depends on live network, and
    // run the two builders SEQUENTIALLY -- buildCaasXdmPayload is documented
    // non-reentrant (it threads module-global config/tag state).
    const fetchStub = stub(window, 'fetch').rejects(new Error('network disabled in test'));
    try {
      const rows = [
        ['CardTitle', 'Bundle parity'],
        ['CardDescription', 'Body copy for the parity fixture.'],
        ['CardImage', 'https://example.com/img.jpg'],
        ['primaryTag', 'caas:content-type/article'],
        ['CTA2Text', 'Learn more'],
        ['CTA2Url', 'https://business.adobe.com/resources/y'],
      ];
      const mkDom = () => {
        const html = `<!DOCTYPE html><html><head></head><body><div class="card-metadata">${
          rows.map(([k, v]) => `<div><div>${k}</div><div>${v}</div></div>`).join('')
        }</div></body></html>`;
        return new DOMParser().parseFromString(html, 'text/html');
      };
      const host = 'main--bacom--adobecom.aem.live';
      const args = { host, repo: 'bacom', pageUrl: core.getProdUrl({ host, path: '/ara/resources/x' }) };

      const fromBundle = await bundle.buildCaasXdmPayload({ ...args, dom: mkDom() });
      const fromCore = await core.buildCaasXdmPayload({ ...args, dom: mkDom() });
      expect(fromBundle.caasProps).to.eql(fromCore.caasProps);
      expect(fromBundle.caasMetadata).to.eql(fromCore.caasMetadata);
    } finally {
      fetchStub.restore();
    }
  });

  it('applies the forced-.html identity policy, proving the flag reached the artifact', async () => {
    // Guards the specific regression this ticket exists to prevent: a bundle
    // that simply ignores htmlIdentity would still agree with itself, so assert
    // the policy is observable rather than only self-consistent.
    const extensionless = await bundle.getCaasIds('https://business.adobe.com/resources/x', 'default', true);
    const explicitHtml = await bundle.getCaasIds('https://business.adobe.com/resources/x.html', 'default', true);
    const policyOff = await bundle.getCaasIds('https://business.adobe.com/resources/x', 'default', false);
    expect(extensionless.contentId).to.equal(explicitHtml.contentId);
    expect(extensionless.contentId).to.not.equal(policyOff.contentId);
  });
});
