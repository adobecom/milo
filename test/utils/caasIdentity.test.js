import { expect } from '@esm-bundle/chai';
import {
  getCaasIdentityUrl,
  isForcedHtmlIdentityUrl,
  isHtmlIdentityEnabled,
} from '../../libs/utils/caasIdentity.js';
import { LOCALES } from '../../tools/send-to-caas/caas-payload-core.js';

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
    it('matches bacom production pages outside /blog/', () => {
      expect(isForcedHtmlIdentityUrl('business.adobe.com/resources/x')).to.be.true;
      expect(isForcedHtmlIdentityUrl('https://business.adobe.com/resources/x')).to.be.true;
    });

    it('excludes blog pages, including locale prefixes and landing pages', () => {
      [
        '/blog/post', '/blog', '/blog/',
        '/fr/blog/post', '/fr/blog', '/ch_fr/blog/post', '/mena_ar/blog/post',
        '/africa/blog/x', '/ph_fil/blog/x',
        '/FR/Blog/post',
      ].forEach((path) => {
        expect(isForcedHtmlIdentityUrl(`business.adobe.com${path}`), path).to.be.false;
      });
    });

    it('does not exempt a blog segment under a non-locale section', () => {
      expect(isForcedHtmlIdentityUrl('business.adobe.com/resources/blog/x')).to.be.true;
      expect(isForcedHtmlIdentityUrl('business.adobe.com/resources/a/b/blog/x')).to.be.true;
      // `blog` must be a whole segment.
      expect(isForcedHtmlIdentityUrl('business.adobe.com/resources/jp/blog-post')).to.be.true;
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

    it('decides the blog exception on the pathname, not the query string', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x?ref=/blog/y', true))
        .to.equal('business.adobe.com/resources/x.html?ref=/blog/y');
      expect(getCaasIdentityUrl('business.adobe.com/blog/y?ref=/resources/x', true))
        .to.equal('business.adobe.com/blog/y?ref=/resources/x');
    });

    it('is case-sensitive, matching the legacy publishers\' .html check', () => {
      expect(getCaasIdentityUrl('business.adobe.com/resources/x.HTML', true))
        .to.equal('business.adobe.com/resources/x.HTML.html');
    });

    it('leaves out-of-scope urls alone even when enabled', () => {
      expect(getCaasIdentityUrl('www.adobe.com/resources/x', true))
        .to.equal('www.adobe.com/resources/x');
      expect(getCaasIdentityUrl('business.adobe.com/blog/post', true))
        .to.equal('business.adobe.com/blog/post');
    });
  });

  // BLOG_PATH bounds its locale segment by length to tell a locale apart from a
  // content section, and `africa` (6) / `ph_fil` (_fil, 3) sit exactly on both
  // bounds. A longer locale added later would silently stop exempting that
  // locale's blog subtree and orphan its cards, with no error anywhere. Fail
  // the build instead.
  describe('BLOG_PATH vs the locale table', () => {
    it('exempts the blog under every published locale prefix', () => {
      Object.keys(LOCALES)
        // An authoring prefix, never a published business.adobe.com path.
        .filter((key) => key && key !== 'langstore')
        .forEach((key) => {
          expect(
            isForcedHtmlIdentityUrl(`business.adobe.com/${key}/blog/post`),
            `locale "${key}" is no longer exempt -- widen BLOG_PATH's locale bound`,
          ).to.be.false;
        });
    });
  });
});
