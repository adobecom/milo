import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { getGrayboxExperienceId } from '../../../libs/blocks/caas/utils.js';
import { getBulkPublishLangAttr, initBulkPublisherLingoMapping } from '../../../tools/send-to-caas/send-utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Bulk Publish to CaaS - Graybox Experience ID Integration', () => {
  describe('getGrayboxExperienceId from host parameter', () => {
    it('should extract experience ID from .graybox domain', () => {
      const host = 'test-exp.graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.equal('test-exp');
    });

    it('should extract experience ID from .**-graybox domain', () => {
      const host = 'test-exp.bacom-graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.equal('test-exp');
    });

    it('should extract experience ID from complex graybox patterns', () => {
      const host = 'qa-demo.enterprise-stage-graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.equal('qa-demo');
    });

    it('should return null for non-graybox domains', () => {
      const host = 'business.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.be.null;
    });

    it('should return null for malformed graybox hosts', () => {
      const host = 'graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.be.null;
    });

    it('should handle empty host parameter', () => {
      const result = getGrayboxExperienceId('', '');
      expect(result).to.be.null;
    });

    it('should handle null/undefined host parameter', () => {
      const result1 = getGrayboxExperienceId('', '');
      const result2 = getGrayboxExperienceId('', '');
      expect(result1).to.be.null;
      expect(result2).to.be.null;
    });
  });

  describe('Graybox Experience ID in CaaS Payload', () => {
    it('should add gbExperienceID to caasProps when graybox host is detected', () => {
      const host = 'test-exp.graybox.adobe.com';
      const grayboxExperienceId = getGrayboxExperienceId(host, '');
      const caasProps = { entityId: 'test-entity-id', title: 'Test Title' };
      if (grayboxExperienceId) caasProps.gbExperienceID = grayboxExperienceId;
      expect(caasProps.gbExperienceID).to.equal('test-exp');
    });

    it('should not add gbExperienceID when no graybox pattern is found', () => {
      const host = 'business.adobe.com';
      const grayboxExperienceId = getGrayboxExperienceId(host, '');
      const caasProps = { entityId: 'test-entity-id', title: 'Test Title' };
      if (grayboxExperienceId) caasProps.gbExperienceID = grayboxExperienceId;
      expect(caasProps.gbExperienceID).to.be.undefined;
    });

    it('should handle various graybox host patterns correctly', () => {
      const testCases = [
        { host: 'demo.graybox.adobe.com', expected: 'demo' },
        { host: 'stage-test.bacom-graybox.adobe.com', expected: 'stage-test' },
        { host: 'prod-demo.enterprise-prod-graybox.adobe.com', expected: 'prod-demo' },
        { host: 'qa.bacom-stage-graybox.adobe.com', expected: 'qa' },
      ];
      testCases.forEach(({ host, expected }) => {
        const result = getGrayboxExperienceId(host, '');
        expect(result).to.equal(expected, `Failed for host: ${host}`);
      });
    });
  });
});

// Shared mock mapping: bacom in index; /de/ is LFL baseSite; /at/ is regional of /de/
// /gb/ and /au/ are English regionals
const LINGO_MOCK_MAPPING = {
  'site-query-index-map': { data: [{ uniqueSiteId: 'bacom-site', caasOrigin: 'bacom' }] },
  'site-locales': {
    data: [
      { uniqueSiteId: 'bacom-site', baseSite: '/de', regionalSites: '/at' },
      { uniqueSiteId: 'bacom-site', baseSite: '/', regionalSites: '/gb, /au' },
    ],
  },
};

describe('getBulkPublishLangAttr — auto-detect Lingo matrix', () => {
  let ogFetch;

  beforeEach(() => {
    ogFetch = window.fetch;
    window.fetch = stub().resolves({ ok: true, json: () => Promise.resolve(LINGO_MOCK_MAPPING) });
    initBulkPublisherLingoMapping();
  });

  afterEach(() => {
    window.fetch = ogFetch;
  });

  const BASE = { prodUrl: '/de/article', host: 'bulkpublisher' };

  it('auto-detect off: respects manual languageFirst=false → non-LFL output', async () => {
    const result = await getBulkPublishLangAttr({ ...BASE, repo: 'bacom', autoDetectLingo: false, languageFirst: false });
    expect(result).to.equal('de-DE');
  });

  it('auto-detect off: respects manual languageFirst=true → LFL output', async () => {
    const result = await getBulkPublishLangAttr({ ...BASE, repo: 'bacom', autoDetectLingo: false, languageFirst: true });
    expect(result).to.equal('de-xx');
  });

  it('auto-detect on, news: always uses manual languageFirst regardless of mapping', async () => {
    const nonLfl = await getBulkPublishLangAttr({ ...BASE, repo: 'news', autoDetectLingo: true, languageFirst: false });
    expect(nonLfl).to.equal('de-DE');

    const lfl = await getBulkPublishLangAttr({ ...BASE, repo: 'news', autoDetectLingo: true, languageFirst: true });
    expect(lfl).to.equal('de-xx');
  });

  it('auto-detect on, origin in mapping with LFL locale: mapping overrides languageFirst=false', async () => {
    // bacom + /de/ is in the mapping as a LFL locale → must produce LFL output
    // even with languageFirst=false
    const result = await getBulkPublishLangAttr({ ...BASE, repo: 'bacom', autoDetectLingo: true, languageFirst: false });
    expect(result).to.equal('de-xx');
  });

  it('auto-detect on, origin not in mapping: non-LFL even when languageFirst=true', async () => {
    // 'other' is absent from the mock mapping → null → false → non-LFL
    const result = await getBulkPublishLangAttr({ ...BASE, repo: 'other', autoDetectLingo: true, languageFirst: true });
    expect(result).to.equal('de-DE');
  });

  it('auto-detect on, mapping fetch fails: throws so the row surfaces in the error report', async () => {
    // A 404 or network error must not silently flip LFL to non-LFL; it should throw
    // so bulk-publish-to-caas.js catches it and records the row as a failure.
    window.fetch = stub().rejects(new Error('HTTP 404'));
    initBulkPublisherLingoMapping();
    let caught;
    try {
      await getBulkPublishLangAttr({ ...BASE, repo: 'bacom', autoDetectLingo: true, languageFirst: true });
    } catch (e) {
      caught = e;
    }
    expect(caught).to.be.instanceOf(Error);
    expect(caught.message).to.equal('HTTP 404');
  });
});

describe('reconcileHtmlIdentity — the live sheet is authoritative', () => {
  let reconcileHtmlIdentity;
  let getConfig;
  let setConfig;

  before(async () => {
    // Use the real bulkpublisher markup as the fixture: the module binds
    // handlers to a dozen elements at import time, so a hand-rolled fixture
    // would drift the moment the page changes. Scripts parsed via DOMParser
    // are inert, so nothing self-initializes.
    const pageHtml = await readFile({ path: '../../../tools/send-to-caas/bulkpublisher.html' });
    const parsed = new DOMParser().parseFromString(pageHtml, 'text/html');
    document.body.append(...parsed.body.children);
    ({ reconcileHtmlIdentity } = await import('../../../tools/send-to-caas/bulk-publish-to-caas.js'));
    ({ getConfig, setConfig } = await import('../../../tools/send-to-caas/send-utils.js'));
  });

  const sheet = (htmlIdentity) => [{ id: 'bacom', htmlIdentity }];

  it('clears a stored flag once the column is un-authored (the rollback path)', () => {
    setConfig({ presetSelector: 'bacom', htmlIdentity: true });
    reconcileHtmlIdentity(sheet(undefined));
    expect(getConfig().htmlIdentity).to.equal(false);
  });

  it('adopts the sheet when it turns the flag on', () => {
    setConfig({ presetSelector: 'bacom', htmlIdentity: false });
    reconcileHtmlIdentity(sheet('true'));
    expect(getConfig().htmlIdentity).to.equal(true);
  });

  it('treats a non-lowercase sheet value as on, so casing cannot cause a false rollback', () => {
    setConfig({ presetSelector: 'bacom', htmlIdentity: true });
    reconcileHtmlIdentity(sheet(' TRUE '));
    expect(getConfig().htmlIdentity).to.equal(true);
  });

  it('clears the flag when the preset no longer exists in the sheet', () => {
    setConfig({ presetSelector: 'bacom', htmlIdentity: true });
    reconcileHtmlIdentity([{ id: 'other', htmlIdentity: 'true' }]);
    expect(getConfig().htmlIdentity).to.equal(false);
  });

  it('leaves advanced mode alone, since the operator sets the checkbox directly', () => {
    setConfig({ presetSelector: 'advanced', htmlIdentity: true });
    reconcileHtmlIdentity(sheet(undefined));
    expect(getConfig().htmlIdentity).to.equal(true);
  });

  it('does nothing when the presets fetch failed, rather than reading a failure as "off"', () => {
    setConfig({ presetSelector: 'bacom', htmlIdentity: true });
    reconcileHtmlIdentity(null);
    expect(getConfig().htmlIdentity).to.equal(true);
  });

  describe('htmlIdentity advanced option', () => {
    it('exposes the checkbox inside the advanced options panel', () => {
      // The flag used to be reachable only by authoring a preset column, so an
      // operator could not test or roll it back without a sheet edit. It also
      // has to sit INSIDE .advanced-options or it inherits none of the panel's
      // show/hide behaviour and leaks into the simple view.
      const cb = document.getElementById('htmlIdentity');
      expect(cb, 'htmlIdentity checkbox is missing from bulkpublisher.html').to.exist;
      expect(cb.type).to.equal('checkbox');
      expect(cb.closest('.advanced-options'), 'checkbox escaped the advanced panel').to.exist;
    });

    it('syncs the checkbox to the reconciled value', () => {
      setConfig({ presetSelector: 'bacom', htmlIdentity: 'false' });
      document.getElementById('htmlIdentity').checked = false;
      reconcileHtmlIdentity([{ id: 'bacom', htmlIdentity: 'true' }]);
      expect(document.getElementById('htmlIdentity').checked).to.be.true;
    });
  });
});
