import { expect } from '@esm-bundle/chai';
import {
  findUnrecognizedSections,
  isFlagDisabled,
  isFlagEnabled,
  isFlagUnrecognized,
  isForcedHtmlIdentityUrl,
  isHtmlIdentityEnabled,
  isIdentityPolicyMiss,
  normalizeSections,
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

    it('carves out no path on the publish path, so a section that migrates later is covered', () => {
      // Scope here is host plus flag only. The blog is a separate repo serving
      // its own /.milo/caas/config.json, so for a PUBLISHER it is scoped out by
      // not setting the flag there -- not by path. A path exemption at this
      // level would sit under that boundary and silently neutralize the flag
      // once the section does migrate, orphaning all of its cards.
      // Every runtime carries the same exemption, because each is GIVEN the
      // same configured list; nothing here exempts a path on its own.
      // MWPW-213847 wires the rendering side to the companion metadata.
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
    const SECTIONS = ['blog'];

    it('never forces .html onto a configured section, flag on', () => {
      expect(toIdentityUrl('https://business.adobe.com/blog/x', true, SECTIONS))
        .to.equal('business.adobe.com/blog/x');
    });

    it('matches the section anywhere in the path, so no locale table is needed', () => {
      ['de', 'es', 'ch_de', 'africa', 'langstore/en'].forEach((prefix) => {
        expect(toIdentityUrl(`business.adobe.com/${prefix}/blog/x`, 'true', SECTIONS), prefix)
          .to.equal(`business.adobe.com/${prefix}/blog/x`);
      });
      expect(toIdentityUrl('business.adobe.com/products/blog/x', true, SECTIONS))
        .to.equal('business.adobe.com/products/blog/x');
    });

    it('still forces .html outside the configured sections', () => {
      expect(toIdentityUrl('business.adobe.com/resources/x', true, SECTIONS))
        .to.equal('business.adobe.com/resources/x.html');
    });

    it('matches whole segments only, so a longer word is not exempt', () => {
      expect(toIdentityUrl('business.adobe.com/blogging/x', true, SECTIONS))
        .to.equal('business.adobe.com/blogging/x.html');
      expect(toIdentityUrl('business.adobe.com/products/blogging-tool', true, SECTIONS))
        .to.equal('business.adobe.com/products/blogging-tool.html');
    });

    it('has no carve-out at all for a site that configures none', () => {
      [[], '', undefined].forEach((sections) => {
        expect(toIdentityUrl('business.adobe.com/blog/x', true, sections), String(sections))
          .to.equal('business.adobe.com/blog/x.html');
      });
    });

    it('accepts the comma string the config sheet and metadata carry', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x', true, ' Blog , news '))
        .to.equal('business.adobe.com/blog/x');
      expect(toIdentityUrl('business.adobe.com/news/x', true, ' Blog , news '))
        .to.equal('business.adobe.com/news/x');
    });

    it('strips .html so env-split variants of one page converge', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x.html', true, SECTIONS))
        .to.equal(toIdentityUrl('business.adobe.com/blog/x', true, SECTIONS));
      expect(toIdentityUrl('business.adobe.com/blog/x.html', true, SECTIONS))
        .to.equal('business.adobe.com/blog/x');
    });

    it('leaves a .html url alone when the flag is off', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x.html', false, SECTIONS))
        .to.equal('business.adobe.com/blog/x.html');
    });

    it('is an exact no-op when the flag is off', () => {
      expect(toIdentityUrl('https://business.adobe.com/blog/x', false, SECTIONS))
        .to.equal('business.adobe.com/blog/x');
      expect(toIdentityUrl('business.adobe.com/resources/x', false, SECTIONS))
        .to.equal('business.adobe.com/resources/x');
    });

    it('does not apply the carve-out off the bacom prod host', () => {
      expect(isExtensionlessSection('main--da-bacom--adobecom.aem.page/blog/x', SECTIONS)).to.be.false;
      expect(isExtensionlessSection('business.adobe.com/blog/x', SECTIONS)).to.be.true;
    });

    it('ignores query and fragment when matching the section', () => {
      expect(toIdentityUrl('business.adobe.com/blog/x?a=1#b', true, SECTIONS))
        .to.equal('business.adobe.com/blog/x?a=1#b');
    });

    it('matches a page named for the section, not just a directory', () => {
      // Unanchored segment matching has this consequence, and it is documented
      // rather than special-cased: a page literally named `blog` is treated as
      // part of the section. Pinned so the behaviour cannot drift away from
      // what the authoring docs promise.
      expect(toIdentityUrl('business.adobe.com/products/blog.html', true, SECTIONS))
        .to.equal('business.adobe.com/products/blog');
    });

    it('accepts a section authored with the slashes authors reach for', () => {
      // `/blog` is the form this module's own prose uses throughout, so it is
      // the likeliest authoring mistake -- and it fails in the catastrophic
      // direction, forcing `.html` across the whole section it was meant to
      // exempt. Normalizing is the difference between a typo and an outage.
      ['/blog', 'blog/', '/blog/', '  /Blog/  '].forEach((authored) => {
        expect(toIdentityUrl('business.adobe.com/blog/x', true, authored))
          .to.equal('business.adobe.com/blog/x');
      });
    });
  });

  describe('normalizeSections', () => {
    it('trims, lowercases, strips slashes and dedupes', () => {
      expect(normalizeSections(' /Blog/ , news ,, blog')).to.deep.equal(['blog', 'news']);
      expect(normalizeSections(['BLOG', '/blog/'])).to.deep.equal(['blog']);
    });

    it('treats every absent or malformed shape as no carve-out', () => {
      // Coercing to "no sections" is the orphaning direction, so this is the
      // one place the leaf must not quietly invent a carve-out either.
      [undefined, null, '', '   ', ',,', [], {}, 0].forEach((value) => {
        expect(normalizeSections(value)).to.deep.equal([]);
      });
    });
  });

  describe('findUnrecognizedSections', () => {
    it('reports entries that cannot name a path segment', () => {
      // A path, glob or host matches nothing, which is indistinguishable at
      // match time from a site that configured no carve-out at all -- so the
      // channels surface it rather than letting the section orphan silently.
      expect(findUnrecognizedSections('blog/*, business.adobe.com/blog, news'))
        .to.deep.equal(['blog/*', 'business.adobe.com/blog']);
    });

    it('accepts bare segments and the slash forms normalization repairs', () => {
      expect(findUnrecognizedSections('blog, /news/, resources')).to.deep.equal([]);
    });
  });

  describe('isIdentityPolicyMiss', () => {
    const IN_SCOPE = 'https://business.adobe.com/resources/articles/x';

    it('does not flag an exempt section, whose ids the policy cannot change', () => {
      // The warning latches after one call, so a false positive here consumes
      // the page's only slot and silences a real miss elsewhere on it.
      expect(isIdentityPolicyMiss('https://business.adobe.com/blog/x', 'false', ['blog'])).to.be.false;
      expect(isIdentityPolicyMiss('https://business.adobe.com/de/blog/x', false, 'blog')).to.be.false;
    });

    it('flags an exempt section authored WITH the extension', () => {
      // The carve-out strips `.html` when the flag is on, so for this shape
      // the flag state really does decide the id.
      expect(isIdentityPolicyMiss('https://business.adobe.com/blog/x.html', false, ['blog'])).to.be.true;
    });

    it('flags a blog link on a site that configured no sections', () => {
      // Without the configuration the policy really would change this id, so
      // the miss is reported rather than assumed away.
      expect(isIdentityPolicyMiss('https://business.adobe.com/blog/x', 'false')).to.be.true;
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
