import { expect } from '@esm-bundle/chai';
import {
  isFlagDisabled,
  isFlagEnabled,
  isFlagUnrecognized,
  isForcedHtmlIdentityUrl,
  isHtmlIdentityEnabled,
  isIdentityPolicyMiss,
  toIdentityUrl,
  isExtensionlessSection,
} from '../../libs/utils/caasIdentity.js';

describe('caasIdentity', () => {
  describe('isHtmlIdentityEnabled', () => {
    it('is off unless explicitly enabled', () => {
      [undefined, null, false, '', 'false', 'FALSE', 'yes', 'stage,prod', 1].forEach((val) => {
        expect(isHtmlIdentityEnabled(val), String(val)).to.be.false;
      });
    });

    it('is on for the boolean and the authored string forms', () => {
      // Config sheets store strings; 'on' is the house convention for metadata.
      [true, 'true', 'TRUE', ' true ', 'on', 'ON'].forEach((val) => {
        expect(isHtmlIdentityEnabled(val), String(val)).to.be.true;
      });
    });
  });

  describe('isForcedHtmlIdentityUrl', () => {
    it('matches bacom production pages', () => {
      expect(isForcedHtmlIdentityUrl('business.adobe.com/resources/x')).to.be.true;
      expect(isForcedHtmlIdentityUrl('https://business.adobe.com/resources/x')).to.be.true;
    });

    it('carves out no path, so a section that migrates later is covered', () => {
      // The blog is a separate repo serving its own /.milo/caas/config.json, so
      // it is scoped out by not setting the flag there -- not by path. A path
      // exemption here would sit under that boundary and silently neutralize
      // the flag once the section does migrate, orphaning all of its cards.
      [
        '/blog/post', '/blog', '/blog/', '/fr/blog/post', '/mena_ar/blog/post',
        '/resources/blog/x', '/resources/jp/blog-post', '/products/y',
      ].forEach((path) => {
        expect(isForcedHtmlIdentityUrl(`business.adobe.com${path}`), path).to.be.true;
      });
    });

    it('matches the prod host case-insensitively', () => {
      expect(isForcedHtmlIdentityUrl('BUSINESS.Adobe.com/resources/x')).to.be.true;
    });

    it('reproduces the degenerate form getProdUrl emits for a trailing slash', () => {
      // getProdUrl appends `.html` unconditionally, so a card published from
      // `/fr/` hashed `/fr/.html`. Matching that exactly is what preserves it.
      expect(toIdentityUrl('business.adobe.com/fr/', true))
        .to.equal('business.adobe.com/fr/.html');
    });

    it('excludes every other host, including preview hosts', () => {
      expect(isForcedHtmlIdentityUrl('www.adobe.com/resources/x')).to.be.false;
      expect(isForcedHtmlIdentityUrl('main--bacom--adobecom.aem.live/resources/x')).to.be.false;
      expect(isForcedHtmlIdentityUrl('business.stage.adobe.com/resources/x')).to.be.false;
      // A host that merely ends with the prod host must not match.
      expect(isForcedHtmlIdentityUrl('evil-business.adobe.com/resources/x')).to.be.false;
    });

    it('ignores a host-only url', () => {
      expect(isForcedHtmlIdentityUrl('business.adobe.com')).to.be.false;
    });

    it('handles non-string input', () => {
      expect(isForcedHtmlIdentityUrl(undefined)).to.be.false;
      expect(isForcedHtmlIdentityUrl(null)).to.be.false;
    });
  });

  describe('toIdentityUrl: html identity normalization', () => {
    it('returns the url untouched when the flag is off', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x', false))
        .to.equal('business.adobe.com/resources/x');
    });

    it('resolves the flag itself, so the string \'false\' cannot enable it', () => {
      // Flag values arrive from config sheets as strings; a truthy check here
      // would silently rehash every card on the site.
      expect(toIdentityUrl('business.adobe.com/resources/x', 'false'))
        .to.equal('business.adobe.com/resources/x');
      expect(toIdentityUrl('business.adobe.com/resources/x', 'true'))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('adds .html for an in-scope extensionless url', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('is idempotent for a url that already ends in .html', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x.html', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('collapses repeated .html to exactly one', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x.html.html', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('strips the scheme when one is present', () => {
      // This is the whole reason toIdentityUrl is the only exported entry point.
      // Ids are a uuid v5 of the SCHEME-LESS url, and getProdUrl returns a
      // schemed one, so a caller reaching for a raw normalizer and passing
      // prodUrl straight in would hash a schemed string and silently orphan the
      // card. toIdentityUrl strips first, so that mistake is unreachable.
      expect(toIdentityUrl('https://business.adobe.com/resources/x', true))
        .to.equal('business.adobe.com/resources/x.html');
      expect(toIdentityUrl('http://business.adobe.com/resources/x', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('only appends to the pathname, never the query or fragment', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x?a=1', true))
        .to.equal('business.adobe.com/resources/x.html?a=1');
      expect(toIdentityUrl('business.adobe.com/resources/x#frag', true))
        .to.equal('business.adobe.com/resources/x.html#frag');
    });

    it('appends to the pathname even when the query string ends in .html', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x?ref=/y.html', true))
        .to.equal('business.adobe.com/resources/x.html?ref=/y.html');
    });

    it('is case-sensitive, matching the legacy publishers\' .html check', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x.HTML', true))
        .to.equal('business.adobe.com/resources/x.HTML.html');
    });

    it('leaves out-of-scope urls alone even when enabled', () => {
      expect(toIdentityUrl('www.adobe.com/resources/x', true))
        .to.equal('www.adobe.com/resources/x');
      expect(toIdentityUrl('business.adobe.com', true))
        .to.equal('business.adobe.com');
    });

    it('preserves blog identity across the extensionless switch', () => {
      // The blog still serves .html, so its ids were minted with it. Once the
      // flag is on for the blog repo, the extensionless public url must keep
      // hashing the same string the .html url did.
      expect(toIdentityUrl('business.adobe.com/blog/post.html', true))
        .to.equal(toIdentityUrl('business.adobe.com/blog/post', true));
    });
  });

  describe('shared flag parsing', () => {
    it('accepts casing and whitespace a spreadsheet can produce', () => {
      // A sheet cell holding an uppercase literal used to resolve to false,
      // which for an identity flag means orphaning every card on the site
      // rather than a cosmetic miss.
      ['true', 'TRUE', 'True', ' true ', '\ttrue\n', 'on', 'ON'].forEach((val) => {
        expect(isFlagEnabled(val), JSON.stringify(val)).to.be.true;
      });
      expect(isFlagEnabled(true)).to.be.true;
    });

    it('is off for anything that does not clearly mean true', () => {
      [undefined, null, false, '', 'false', 'off', 'yes', '1', 0, 1, {}].forEach((val) => {
        expect(isFlagEnabled(val), JSON.stringify(val)).to.be.false;
      });
    });

    it('detects an explicit opt-out, including the string a sheet produces', () => {
      [false, 'false', 'FALSE', ' false ', 'off', 'OFF'].forEach((val) => {
        expect(isFlagDisabled(val), JSON.stringify(val)).to.be.true;
      });
      // Absent means "use the default", never "disabled".
      [undefined, null, '', true, 'true', 'on', 'yes'].forEach((val) => {
        expect(isFlagDisabled(val), JSON.stringify(val)).to.be.false;
      });
    });

    it('flags an authored value that means neither true nor false', () => {
      ['yes', 'no', '1', '0', 'enabled', 42].forEach((val) => {
        expect(isFlagUnrecognized(val), JSON.stringify(val)).to.be.true;
      });
      // Absent/empty is a legitimate "fall back to the default", not a typo.
      [undefined, null, '', '  ', true, false, 'true', 'false', 'on', 'off'].forEach((val) => {
        expect(isFlagUnrecognized(val), JSON.stringify(val)).to.be.false;
      });
    });

    it('resolves htmlIdentity through the one shared parser', () => {
      // Regression: isHtmlIdentityEnabled and the htmlExt parser used to
      // disagree on 'TRUE' and ' true '.
      ['TRUE', ' true ', 'on'].forEach((val) => {
        expect(isHtmlIdentityEnabled(val), JSON.stringify(val)).to.equal(isFlagEnabled(val));
        expect(isHtmlIdentityEnabled(val), JSON.stringify(val)).to.be.true;
      });
    });
  });

  describe('toIdentityUrl', () => {
    const PATH = '/resources/articles/some-article';
    const BARE = `business.adobe.com${PATH}`;

    it('strips the scheme, because ids are a hash of the scheme-less url', () => {
      // Hashing 'https://host/path' and 'host/path' yields two different ids,
      // so this strip is load-bearing, not cosmetic.
      expect(toIdentityUrl(`https://${BARE}`, 'true')).to.equal(`${BARE}.html`);
    });

    it('strips an http:// scheme too', () => {
      // Regression: the consumer hand-rolled this as `.split('https://')`,
      // which left 'http://' attached and hashed it into the id -- a silent
      // miss on every plain-http authored link.
      expect(toIdentityUrl(`http://${BARE}`, 'true')).to.equal(`${BARE}.html`);
    });

    it('accepts an already scheme-less url unchanged', () => {
      expect(toIdentityUrl(BARE, 'true')).to.equal(`${BARE}.html`);
    });

    it('does not add a second .html', () => {
      expect(toIdentityUrl(`https://${BARE}.html`, 'true')).to.equal(`${BARE}.html`);
    });

    it('strips the scheme but applies no policy when the flag is off', () => {
      // The strip is unconditional; only the `.html` policy is flag-gated.
      expect(toIdentityUrl(`https://${BARE}`, 'false')).to.equal(BARE);
      expect(toIdentityUrl(`https://${BARE}`)).to.equal(BARE);
    });

    it('leaves an out-of-scope host extensionless', () => {
      expect(toIdentityUrl(`https://www.adobe.com${PATH}`, 'true'))
        .to.equal(`www.adobe.com${PATH}`);
    });

    it('preserves query and fragment, appending .html to the path only', () => {
      expect(toIdentityUrl(`https://${BARE}?a=1#frag`, 'true'))
        .to.equal(`${BARE}.html?a=1#frag`);
    });

    it('passes a non-string through rather than throwing', () => {
      // Authored config can hand us anything; a publisher crash is worse than
      // an unchanged value the caller can still reject.
      expect(toIdentityUrl(undefined, 'true')).to.equal(undefined);
      expect(toIdentityUrl(null, 'true')).to.equal(null);
    });

    it('gives a schemed url the same identity as its scheme-less form', () => {
      expect(toIdentityUrl(`https://${BARE}`, 'true'))
        .to.equal(toIdentityUrl(BARE, 'true'));
    });
  });

  describe('toIdentityUrl: extensionless sections', () => {
    it('never forces .html onto a blog url, flag on', () => {
      expect(toIdentityUrl('https://business.adobe.com/blog/x', true))
        .to.equal('business.adobe.com/blog/x');
    });

    it('never forces .html onto a locale-prefixed blog url', () => {
      expect(toIdentityUrl('business.adobe.com/de/blog/x', 'true'))
        .to.equal('business.adobe.com/de/blog/x');
    });

    it('still forces .html outside the carve-out', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('does not exempt a nested blog path', () => {
      expect(toIdentityUrl('business.adobe.com/resources/blog/x', true))
        .to.equal('business.adobe.com/resources/blog/x.html');
    });

    it('does not exempt a section that merely starts with blog', () => {
      expect(toIdentityUrl('business.adobe.com/blogging/x', true))
        .to.equal('business.adobe.com/blogging/x.html');
    });

    it('strips .html so env-split variants of one blog page converge', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x.html', true))
        .to.equal(toIdentityUrl('business.adobe.com/blog/x', true));
      expect(toIdentityUrl('business.adobe.com/blog/x.html', true))
        .to.equal('business.adobe.com/blog/x');
    });

    it('leaves a .html blog url alone when the flag is off', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x.html', false))
        .to.equal('business.adobe.com/blog/x.html');
    });

    it('is an exact no-op when the flag is off', () => {
      expect(toIdentityUrl('https://business.adobe.com/blog/x', false))
        .to.equal('business.adobe.com/blog/x');
      expect(toIdentityUrl('business.adobe.com/resources/x', false))
        .to.equal('business.adobe.com/resources/x');
    });

    it('does not exempt an unlisted locale prefix', () => {
      // The hazard MWPW-213847 names: a locale the blog adds later still gets
      // `.html` forced until it is added to the prefix list.
      expect(toIdentityUrl('business.adobe.com/es/blog/x', true))
        .to.equal('business.adobe.com/es/blog/x.html');
    });

    it('exempts every listed locale prefix', () => {
      ['au', 'de', 'fr', 'jp', 'kr', 'uk'].forEach((prefix) => {
        expect(toIdentityUrl(`business.adobe.com/${prefix}/blog/x`, true), prefix)
          .to.equal(`business.adobe.com/${prefix}/blog/x`);
      });
    });

    it('does not apply the carve-out off the bacom prod host', () => {
      expect(isExtensionlessSection('main--da-bacom--adobecom.aem.page/blog/x')).to.be.false;
      expect(isExtensionlessSection('business.adobe.com/blog/x')).to.be.true;
    });

    it('ignores query and fragment when matching the section', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x?a=1#b', true))
        .to.equal('business.adobe.com/blog/x?a=1#b');
    });
  });

  describe('isIdentityPolicyMiss', () => {
    const IN_SCOPE = 'https://business.adobe.com/resources/articles/x';

    it('does not flag an exempt section, whose ids the policy cannot change', () => {
      // The warning latches after one call, so a false positive here consumes
      // the page's only slot and silences a real miss elsewhere on it.
      expect(isIdentityPolicyMiss('https://business.adobe.com/blog/x', 'false')).to.be.false;
      expect(isIdentityPolicyMiss('https://business.adobe.com/de/blog/x')).to.be.false;
    });

    it('flags an exempt section authored WITH the extension', () => {
      // The carve-out strips `.html` when the flag is on, so for this shape
      // the flag state really does decide the id.
      expect(isIdentityPolicyMiss('https://business.adobe.com/blog/x.html')).to.be.true;
    });

    it('flags an in-scope extensionless link while the policy is off', () => {
      expect(isIdentityPolicyMiss(IN_SCOPE, 'false')).to.be.true;
      expect(isIdentityPolicyMiss(IN_SCOPE)).to.be.true;
    });

    it('stays quiet for an in-scope .html link', () => {
      // Pre-migration authored links still carry .html and resolve correctly
      // with the flag off; warning here would fire on every bacom page today.
      expect(isIdentityPolicyMiss(`${IN_SCOPE}.html`, 'false')).to.be.false;
    });

    it('stays quiet once the policy is enabled', () => {
      expect(isIdentityPolicyMiss(IN_SCOPE, 'true')).to.be.false;
    });

    it('stays quiet for a host outside the policy', () => {
      expect(isIdentityPolicyMiss('https://www.adobe.com/resources/x', 'false')).to.be.false;
    });

    it('ignores a query/fragment when deciding if the path is extensionless', () => {
      expect(isIdentityPolicyMiss(`${IN_SCOPE}.html?a=1`, 'false')).to.be.false;
      expect(isIdentityPolicyMiss(`${IN_SCOPE}?a=1`, 'false')).to.be.true;
    });

    it('does not throw on a non-string', () => {
      expect(isIdentityPolicyMiss(undefined, 'false')).to.be.false;
      expect(isIdentityPolicyMiss(null, 'false')).to.be.false;
    });
  });
});
