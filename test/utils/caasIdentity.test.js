import { expect } from '@esm-bundle/chai';
import {
  getCaasIdentityUrl,
  isFlagDisabled,
  isFlagEnabled,
  isFlagUnrecognized,
  isForcedHtmlIdentityUrl,
  isHtmlIdentityEnabled,
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
      expect(getCaasIdentityUrl('business.adobe.com/fr/', true))
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

  describe('getCaasIdentityUrl', () => {
    it('returns the url untouched when the flag is off', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x', false))
        .to.equal('business.adobe.com/resources/x');
    });

    it('resolves the flag itself, so the string \'false\' cannot enable it', () => {
      // Flag values arrive from config sheets as strings; a truthy check here
      // would silently rehash every card on the site.
      expect(getCaasIdentityUrl('business.adobe.com/resources/x', 'false'))
        .to.equal('business.adobe.com/resources/x');
      expect(getCaasIdentityUrl('business.adobe.com/resources/x', 'true'))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('adds .html for an in-scope extensionless url', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('is idempotent for a url that already ends in .html', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x.html', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('collapses repeated .html to exactly one', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x.html.html', true))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('preserves the scheme when one is present', () => {
      expect(getCaasIdentityUrl('https://business.adobe.com/resources/x', true))
        .to.equal('https://business.adobe.com/resources/x.html');
    });

    it('only appends to the pathname, never the query or fragment', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x?a=1', true))
        .to.equal('business.adobe.com/resources/x.html?a=1');
      expect(getCaasIdentityUrl('business.adobe.com/resources/x#frag', true))
        .to.equal('business.adobe.com/resources/x.html#frag');
    });

    it('appends to the pathname even when the query string ends in .html', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x?ref=/y.html', true))
        .to.equal('business.adobe.com/resources/x.html?ref=/y.html');
    });

    it('is case-sensitive, matching the legacy publishers\' .html check', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x.HTML', true))
        .to.equal('business.adobe.com/resources/x.HTML.html');
    });

    it('leaves out-of-scope urls alone even when enabled', () => {
      expect(getCaasIdentityUrl('www.adobe.com/resources/x', true))
        .to.equal('www.adobe.com/resources/x');
      expect(getCaasIdentityUrl('business.adobe.com', true))
        .to.equal('business.adobe.com');
    });

    it('preserves blog identity across the extensionless switch', () => {
      // The blog still serves .html, so its ids were minted with it. Once the
      // flag is on for the blog repo, the extensionless public url must keep
      // hashing the same string the .html url did.
      expect(getCaasIdentityUrl('business.adobe.com/blog/post.html', true))
        .to.equal(getCaasIdentityUrl('business.adobe.com/blog/post', true));
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
});
