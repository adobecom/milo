import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../../libs/utils/utils.js';

const { toSegments, checkNaming, checkTemporaryFolders, checkFragmentPlacement, runChecks } = await import('../../../../libs/blocks/preflight/checks/taxonomy.js');

const frags = (...paths) => paths.map((path) => ({ path, pathname: path }));
const namingIssue = (segment) => checkNaming([segment]).details.items[0];
const locales = (...keys) => Object.fromEntries(['', ...keys].map((key) => [key, { ietf: 'en-US', tk: 'hah7vzn.css' }]));

describe('preflight taxonomy checks', () => {
  describe('toSegments', () => {
    it('drops a leading locale key, the extension and a trailing index', () => {
      expect(toSegments('/de/products/photoshop.html', ['de'])).to.deep.equal(['products', 'photoshop']);
      expect(toSegments('/ae_ar/fragments/a.plain.html', ['ae_ar'])).to.deep.equal(['fragments', 'a']);
      expect(toSegments('/products/index')).to.deep.equal(['products']);
      expect(toSegments('/devices/x', ['de'])).to.deep.equal(['devices', 'x']);
    });

    it('decodes encoded characters, survives malformed encoding and handles the root', () => {
      expect(toSegments('/My%20Page')).to.deep.equal(['My Page']);
      expect(toSegments('/bad%E0%A4%A')).to.deep.equal(['bad%E0%A4%A']);
      expect(toSegments('/')).to.deep.equal([]);
      expect(toSegments()).to.deep.equal([]);
    });
  });

  describe('naming', () => {
    it('accepts lowercase words, digits and single hyphens', () => {
      const res = checkNaming(['products', 'apsb26-15', '2027-01-01', 'acrobat-pro']);
      expect(res).to.include({ id: 'taxonomy-naming', status: 'pass', severity: 'warning' });
    });

    it('reports each broken rule with a suggested name', () => {
      expect(namingIssue('After_Effects')).to.deep.equal({ segment: 'After_Effects', reasons: ['uppercase letters', 'underscores'], suggestion: 'after-effects' });
      expect(namingIssue('my page').reasons).to.deep.equal(['spaces']);
      expect(namingIssue('Caf\u00e9!')).to.include({ suggestion: 'cafe' });
      expect(namingIssue('caf\u00e9!').reasons).to.deep.equal(['special characters']);
      ['double--hyphen', '-leading', 'trailing-'].forEach((segment) => {
        expect(namingIssue(segment).reasons, segment).to.deep.equal(['extra hyphens']);
      });
      expect(namingIssue('!!!').suggestion).to.equal('');
    });

    it('counts failing segments in the description', () => {
      expect(checkNaming(['ok', 'A_b']).description).to.equal('1 path segment not following the naming rules.');
      expect(checkNaming(['A_b', 'C d']).description).to.equal('2 path segments not following the naming rules.');
    });
  });

  describe('test and temporary folders', () => {
    it('flags test and temp pages found on live sites', () => {
      ['test-page', 'tmp', 'temp', 'test', 'test2-roadshow', 'form-test-3-prod', 'fred-test',
        'thank-you-test-page', 'test-dx-in-person-0513', 'Test-Page'].forEach((segment) => {
        const res = checkTemporaryFolders(['products', segment]);
        expect(res, segment).to.include({ id: 'taxonomy-temporary-folder', status: 'fail', severity: 'warning' });
        expect(res.details.items, segment).to.deep.equal([segment]);
      });
    });

    it('does not flag real content that mentions testing', () => {
      ['contest', 'latest', 'attestation', 'template', 'temperature',
        'security-testing-report-for-adobe-acrobat', 'ab-test-segmentation',
        'what-to-test-with-your-digital-ads-checklist', 'project-test-kitchen',
        'the-power-of-ab-testing', 'multivariate-testing', 'usability-tests'].forEach((segment) => {
        expect(checkTemporaryFolders([segment]).status, segment).to.equal('pass');
      });
    });
  });

  describe('fragment placement', () => {
    it('passes with no fragments or fragments in any fragments folder', () => {
      expect(checkFragmentPlacement([])).to.include({ id: 'taxonomy-fragment-placement', status: 'pass', severity: 'warning', description: 'No fragments on this page.' });
      const res = checkFragmentPlacement(frags(
        '/fragments/products/acrobat/cta-banner',
        '/cc-shared/fragments/promos/black-friday',
        '/foo/fragments/',
      ));
      expect(res).to.include({ status: 'pass', description: 'Fragments are stored in a fragments folder.' });
    });

    it('flags misplaced and badly named fragments, showing the display path', () => {
      const res = checkFragmentPlacement([
        ...frags('/misc/cta-banner', '/fragments/CTA_Banner', '/fragments'),
        { path: 'https://other.site/misc/a', pathname: '/misc/a' },
      ]);
      expect(res.status).to.equal('fail');
      expect(res.details.items).to.deep.equal([
        { path: '/misc/cta-banner', reasons: ['not in a fragments folder'] },
        { path: '/fragments/CTA_Banner', reasons: ['naming'] },
        { path: '/fragments', reasons: ['not in a fragments folder'] },
        { path: 'https://other.site/misc/a', reasons: ['not in a fragments folder'] },
      ]);
      expect(res.description).to.equal('4 fragments outside a fragments folder or not following the naming rules.');
    });
  });

  describe('runChecks', () => {
    let area;

    beforeEach(() => {
      setConfig({ locales: locales('de', 'ae_ar', 'be_fr') });
      area = document.createElement('div');
      area.innerHTML = '<main></main>';
    });

    it('returns the three checks in order, all as warnings', () => {
      const res = runChecks({ area, pathname: '/products/test-page' });
      expect(res.map(({ id, status, severity }) => [id, status, severity])).to.deep.equal([
        ['taxonomy-naming', 'pass', 'warning'],
        ['taxonomy-temporary-folder', 'fail', 'warning'],
        ['taxonomy-fragment-placement', 'pass', 'warning'],
      ]);
    });

    it('skips draft pages, including nested drafts folders', () => {
      ['/drafts/sino/My_Page', '/express/drafts/axel/test-page'].forEach((pathname) => {
        expect(runChecks({ area, pathname }).every(({ status }) => status === 'empty'), pathname).to.be.true;
      });
    });

    it('ignores locale keys on the page and on fragments, and keeps other origins', () => {
      area.querySelector('main').innerHTML = `
        <div data-path="/ae_ar/fragments/promo"></div>
        <div data-path="/be_fr/fragments/products/card"></div>
        <div data-path="/ae_ar/misc/banner"></div>
        <div data-path="https://main--federal--adobecom.aem.page/federal/promo"></div>
        <a class="fragment" href="/fragments/Not_Loaded">link</a>`;
      const [naming, , fragments] = runChecks({ area, pathname: '/ae_ar/products/photoshop' });
      expect(naming.status).to.equal('pass');
      expect(fragments.details.items).to.deep.equal([
        { path: '/ae_ar/misc/banner', reasons: ['not in a fragments folder'] },
        { path: 'https://main--federal--adobecom.aem.page/federal/promo', reasons: ['not in a fragments folder'] },
        { path: '/fragments/Not_Loaded', reasons: ['naming'] },
      ]);
    });
  });
});
