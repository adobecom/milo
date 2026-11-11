import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../../libs/utils/utils.js';

const {
  TAXONOMY_IDS,
  toSegments,
  slugify,
  getSegmentIssues,
  checkNaming,
  checkTemporaryFolders,
  checkFragmentPlacement,
  runChecks,
} = await import('../../../../libs/blocks/preflight/checks/taxonomy.js');

describe('preflight taxonomy checks', () => {
  describe('toSegments', () => {
    it('strips locale prefix, extension, query, hash and trailing index', () => {
      expect(toSegments('/de/products/photoshop.html?x=1#y', '/de')).to.deep.equal(['products', 'photoshop']);
      expect(toSegments('/products/index')).to.deep.equal(['products']);
      expect(toSegments('/fragments/a.plain.html')).to.deep.equal(['fragments', 'a']);
    });

    it('only strips the locale prefix as a whole segment', () => {
      expect(toSegments('/devices/x', '/de')).to.deep.equal(['devices', 'x']);
      expect(toSegments('/de', '/de')).to.deep.equal([]);
    });

    it('decodes encoded characters and survives malformed encoding', () => {
      expect(toSegments('/My%20Page')).to.deep.equal(['My Page']);
      expect(toSegments('/bad%E0%A4%A')).to.deep.equal(['bad%E0%A4%A']);
    });

    it('returns an empty list for the root', () => {
      expect(toSegments('/')).to.deep.equal([]);
      expect(toSegments()).to.deep.equal([]);
    });
  });

  describe('naming', () => {
    it('accepts lowercase words, digits and single hyphens', () => {
      ['photoshop', 'apsb26-15', '2027-01-01', 'acrobat-pro'].forEach((segment) => {
        expect(getSegmentIssues(segment), segment).to.deep.equal([]);
      });
    });

    it('reports each broken rule', () => {
      expect(getSegmentIssues('After_Effects')).to.deep.equal(['uppercase', 'underscores']);
      expect(getSegmentIssues('my page')).to.deep.equal(['spaces']);
      expect(getSegmentIssues('caf\u00e9!')).to.deep.equal(['special-characters']);
      expect(getSegmentIssues('double--hyphen')).to.deep.equal(['hyphens']);
      expect(getSegmentIssues('-leading')).to.deep.equal(['hyphens']);
      expect(getSegmentIssues('trailing-')).to.deep.equal(['hyphens']);
    });

    it('suggests a valid slug', () => {
      expect(slugify('After_Effects Page!')).to.equal('after-effects-page');
      expect(slugify('Caf\u00e9 Cr\u00e8me')).to.equal('cafe-creme');
      expect(slugify()).to.equal('');
    });

    it('passes a clean path', () => {
      const res = checkNaming(['products', 'photoshop']);
      expect(res).to.include({ id: TAXONOMY_IDS.naming, status: 'pass', severity: 'warning' });
      expect(res.details.items).to.deep.equal([]);
    });

    it('fails a path with a bad segment and lists the fix', () => {
      const res = checkNaming(['trust', 'after_effects']);
      expect(res).to.include({ status: 'fail', severity: 'warning' });
      expect(res.description).to.equal('1 path segment not following the naming rules.');
      expect(res.details.items).to.deep.equal([
        { segment: 'after_effects', issues: ['underscores'], suggestion: 'after-effects' },
      ]);
    });

    it('pluralises the description', () => {
      expect(checkNaming(['A_b', 'C d']).description).to.equal('2 path segments not following the naming rules.');
    });
  });

  describe('test and temporary folders', () => {
    it('flags test and temp pages found on live sites', () => {
      [
        'test-page',
        'tmp',
        'temp',
        'test',
        'qa-bacom-roadshow-testing',
        'test2-roadshow',
        'form-test-3-prod',
        'fred-test',
        'thank-you-test-page',
        'test-dx-in-person-0513',
      ].forEach((segment) => {
        const res = checkTemporaryFolders([segment]);
        expect(res.status, segment).to.equal('fail');
        expect(res.details.items, segment).to.deep.equal([segment]);
      });
    });

    it('does not flag real content that mentions testing', () => {
      [
        'contest',
        'latest',
        'attestation',
        'template',
        'temperature',
        'security-testing-report-for-adobe-acrobat',
        'ab-test-segmentation',
        'what-to-test-with-your-digital-ads-checklist',
        'project-test-kitchen',
      ].forEach((segment) => {
        expect(checkTemporaryFolders([segment]).status, segment).to.equal('pass');
      });
    });

    it('is case-insensitive and reports the matching segment only', () => {
      const res = checkTemporaryFolders(['products', 'Test-Page']);
      expect(res).to.include({ id: TAXONOMY_IDS.temporary, status: 'fail', severity: 'warning' });
      expect(res.details.items).to.deep.equal(['Test-Page']);
    });
  });

  describe('fragment placement', () => {
    it('passes when there are no fragments', () => {
      const res = checkFragmentPlacement([]);
      expect(res).to.include({ id: TAXONOMY_IDS.fragments, status: 'pass', severity: 'warning' });
      expect(res.description).to.equal('No fragments on this page.');
    });

    it('passes fragments inside any fragments folder', () => {
      const res = checkFragmentPlacement([
        '/fragments/products/acrobat/cta-banner',
        '/cc-shared/fragments/promos/black-friday',
        '/de/fragments/products/cards/learning-manager',
      ]);
      expect(res.status).to.equal('pass');
      expect(res.description).to.equal('Fragments are stored in a fragments folder.');
    });

    it('accepts { path, pathname } entries and reports the display path', () => {
      const res = checkFragmentPlacement([{ path: 'https://other.site/misc/a', pathname: '/misc/a' }]);
      expect(res.details.items).to.deep.equal([
        { path: 'https://other.site/misc/a', reasons: ['outside-fragments-folder'] },
      ]);
    });

    it('flags fragments outside a fragments folder and badly named fragments', () => {
      const res = checkFragmentPlacement(['/misc/cta-banner', '/fragments/CTA_Banner', '/fragments']);
      expect(res.status).to.equal('fail');
      expect(res.details.items).to.deep.equal([
        { path: '/misc/cta-banner', reasons: ['outside-fragments-folder'] },
        { path: '/fragments/CTA_Banner', reasons: ['naming'] },
        { path: '/fragments', reasons: ['outside-fragments-folder'] },
      ]);
      expect(res.description).to.equal('3 fragments outside a fragments folder or not following the naming rules.');
    });
  });

  describe('runChecks', () => {
    let area;

    beforeEach(() => {
      area = document.createElement('div');
      area.innerHTML = '<main></main>';
    });

    it('returns the three checks in order, all as warnings', () => {
      setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
      const res = runChecks({ area, pathname: '/products/test-page' });
      expect(res.map(({ id }) => id)).to.deep.equal([
        TAXONOMY_IDS.naming, TAXONOMY_IDS.temporary, TAXONOMY_IDS.fragments,
      ]);
      expect(res.every(({ severity }) => severity === 'warning')).to.be.true;
      expect(res.map(({ status }) => status)).to.deep.equal(['pass', 'fail', 'pass']);
    });

    it('skips draft pages, including nested drafts folders', () => {
      setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
      ['/drafts/sino/My_Page', '/express/drafts/axel/test-page'].forEach((pathname) => {
        const res = runChecks({ area, pathname });
        expect(res.every(({ status }) => status === 'empty'), pathname).to.be.true;
      });
    });

    it('ignores the locale prefix of the current page', () => {
      setConfig({
        pathname: '/de/products/photoshop',
        locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' }, de: { ietf: 'de-DE', tk: 'hah7vzn.css' } },
      });
      const [naming] = runChecks({ area, pathname: '/de/products/photoshop' });
      expect(naming.status).to.equal('pass');
    });

    it('reads fragment paths from the page, including other origins', () => {
      setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
      area.querySelector('main').innerHTML = `
        <div data-path="/misc/cta-banner"></div>
        <div data-path="https://main--federal--adobecom.aem.page/federal/fragments/promo"></div>
        <a class="fragment" href="/fragments/Not_Loaded">link</a>`;
      const [, , fragments] = runChecks({ area, pathname: '/products/photoshop' });
      expect(fragments.details.items).to.deep.equal([
        { path: '/misc/cta-banner', reasons: ['outside-fragments-folder'] },
        { path: '/fragments/Not_Loaded', reasons: ['naming'] },
      ]);
    });

    it('ignores locale keys on fragments, including other locales and underscore keys', () => {
      setConfig({
        pathname: '/ae_ar/products/photoshop',
        locales: {
          '': { ietf: 'en-US', tk: 'hah7vzn.css' },
          ae_ar: { ietf: 'ar-AE', tk: 'hah7vzn.css' },
          be_fr: { ietf: 'fr-BE', tk: 'hah7vzn.css' },
        },
      });
      area.querySelector('main').innerHTML = `
        <div data-path="/ae_ar/fragments/promo"></div>
        <div data-path="/be_fr/fragments/products/card"></div>
        <div data-path="/ae_ar/misc/banner"></div>`;
      const [naming, , fragments] = runChecks({ area, pathname: '/ae_ar/products/photoshop' });
      expect(naming.status).to.equal('pass');
      expect(fragments.details.items).to.deep.equal([
        { path: '/ae_ar/misc/banner', reasons: ['outside-fragments-folder'] },
      ]);
    });

    it('keeps the origin of fragments from another site for display', () => {
      setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
      const federal = 'https://main--federal--adobecom.aem.page/federal/promo';
      area.querySelector('main').innerHTML = `<div data-path="${federal}"></div>`;
      const [, , fragments] = runChecks({ area, pathname: '/products/photoshop' });
      expect(fragments.details.items).to.deep.equal([
        { path: federal, reasons: ['outside-fragments-folder'] },
      ]);
    });
  });
});
