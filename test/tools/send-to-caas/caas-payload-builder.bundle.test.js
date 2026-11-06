import { expect } from '@esm-bundle/chai';
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
    const urls = [
      'https://business.adobe.com/resources/x',
      'https://business.adobe.com/resources/x.html',
      'https://www.adobe.com/resources/x',
    ];
    const flags = [true, false, 'true', 'false', 'TRUE', 'on'];
    await Promise.all(urls.flatMap((url) => flags.map(async (flag) => {
      const [fromBundle, fromCore] = await Promise.all([
        bundle.getCaasIds(url, 'default', flag),
        core.getCaasIds(url, 'default', flag),
      ]);
      expect(fromBundle, `${url} / ${JSON.stringify(flag)}`).to.eql(fromCore);
    })));
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
