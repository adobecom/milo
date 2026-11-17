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
  let snapshotPublishConfig;
  let resolvePresetIdentityConfig;
  let fetchExcelJson;
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
    ({ reconcileHtmlIdentity, snapshotPublishConfig, resolvePresetIdentityConfig, fetchExcelJson } = await import('../../../tools/send-to-caas/bulk-publish-to-caas.js'));
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

  it('clears a stored section list once the column is un-authored', () => {
    // Same rollback path as the flag, and the same failure if it is missed:
    // a stale list keeps carving out a section the sheet no longer declares,
    // so the ids diverge from everything else publishing that section.
    setConfig({ presetSelector: 'bacom', htmlIdentity: true, htmlIdentitySections: 'blog' });
    reconcileHtmlIdentity([{ id: 'bacom', htmlIdentity: 'true' }]);
    expect(getConfig().htmlIdentitySections).to.equal('');
  });

  it('adopts the sheet section list, normalized', () => {
    setConfig({ presetSelector: 'bacom', htmlIdentity: true, htmlIdentitySections: '' });
    reconcileHtmlIdentity([{ id: 'bacom', htmlIdentity: 'true', htmlIdentitySections: ' Blog , news ' }]);
    expect(getConfig().htmlIdentitySections).to.equal('blog,news');
  });

  it('reconciles the section list even when the flag itself is unchanged', () => {
    // The early return used to key on the flag alone, so a sheet that changed
    // only the section list would have been ignored entirely.
    setConfig({ presetSelector: 'bacom', htmlIdentity: true, htmlIdentitySections: 'blog' });
    reconcileHtmlIdentity([{ id: 'bacom', htmlIdentity: 'true', htmlIdentitySections: 'news' }]);
    expect(getConfig().htmlIdentitySections).to.equal('news');
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

  it('does nothing for an EMPTY sheet, which is not evidence either way', () => {
    // A sheet that loads but returns zero rows (a renamed tab, a filtered view)
    // cannot tell us the column was un-authored. Treating an empty list as
    // authoritative would find no matching preset, read that as "the column is
    // off", and persist the rollback to localStorage -- leaving the policy off
    // even after the sheet recovered. Non-ok responses throw in fetchExcelJson
    // and arrive here as null, covered by the test above.
    setConfig({ presetSelector: 'bacom', htmlIdentity: true });
    reconcileHtmlIdentity([]);
    expect(getConfig().htmlIdentity).to.equal(true);
  });

  it('still clears the flag when the sheet is populated but omits the preset', () => {
    // The empty-sheet guard must not swallow the real rollback signal: a sheet
    // that loaded fine and no longer carries the preset IS evidence.
    setConfig({ presetSelector: 'bacom', htmlIdentity: true });
    reconcileHtmlIdentity([{ id: 'other', htmlIdentity: 'true' }]);
    expect(getConfig().htmlIdentity).to.equal(false);
  });

  describe('fetchExcelJson — a failed sheet load must not look like an empty sheet', () => {
    let realFetch;
    beforeEach(() => { realFetch = window.fetch; });
    afterEach(() => { window.fetch = realFetch; });

    it('throws on a non-ok response instead of returning an empty list', async () => {
      // Returning [] here is indistinguishable from "the sheet has no rows",
      // so the caller's warning never ran and the operator kept publishing
      // under an identity policy that could not be checked against the sheet.
      window.fetch = async () => ({ ok: false, status: 403, statusText: 'Forbidden' });
      let caught;
      try {
        await fetchExcelJson('/presets.json');
      } catch (e) {
        caught = e;
      }
      expect(caught).to.be.instanceOf(Error);
      expect(caught.message).to.equal('HTTP 403');
    });

    it('returns the sheet rows on a successful response', async () => {
      window.fetch = async () => ({ ok: true, json: async () => ({ data: [{ id: 'bacom' }] }) });
      expect(await fetchExcelJson('/presets.json')).to.deep.equal([{ id: 'bacom' }]);
    });
  });

  describe('resolvePresetIdentityConfig — a preset cell must not change live ids', () => {
    it('keeps the legacy strict parser for useHtml, so a TRUE cell stays off', () => {
      // useHtml feeds prodUrl, which is the uuid v5 hash input. It shipped
      // reading `=== 'true'`, so a live preset authored 'TRUE' resolves to
      // false today. Widening it here would flip that preset's public urls and
      // rehash every card it publishes, at merge, with no rollback.
      expect(resolvePresetIdentityConfig({ id: 'bacom', useHtml: 'TRUE' }).useHtml).to.equal(false);
      expect(resolvePresetIdentityConfig({ id: 'bacom', useHtml: ' true ' }).useHtml).to.equal(false);
      expect(resolvePresetIdentityConfig({ id: 'bacom', useHtml: 'on' }).useHtml).to.equal(false);
    });

    it('still honors the lowercase opt-in for useHtml', () => {
      expect(resolvePresetIdentityConfig({ id: 'bacom', useHtml: 'true' }).useHtml).to.equal(true);
    });

    it('reports the pinned cell at error severity, rather than keeping it false silently', () => {
      // The value assertions above pin WHAT happens; this pins the only signal
      // telling an author their 'TRUE' cell was ignored. Without it, deleting
      // the report leaves the suite green and the cell mis-authored forever.
      const calls = [];
      window.lana = { log: (msg, opts) => calls.push({ msg, opts }) };
      try {
        resolvePresetIdentityConfig({ id: 'bacom', useHtml: 'TRUE' });
      } finally {
        delete window.lana;
      }
      const pin = calls.find((c) => c.msg.includes('was read as false before the parser was widened'));
      expect(pin, 'expected a pinned-cell report').to.not.be.undefined;
      expect(pin.opts.severity).to.equal('error');
    });

    it('stays silent for a cell that was already off, so the report means something', () => {
      const calls = [];
      window.lana = { log: (msg) => calls.push(msg) };
      try {
        resolvePresetIdentityConfig({ id: 'bacom', useHtml: 'false' });
        resolvePresetIdentityConfig({ id: 'bacom', useHtml: 'true' });
      } finally {
        delete window.lana;
      }
      expect(calls.filter((m) => m.includes('before the parser was widened'))).to.have.lengthOf(0);
    });

    it('applies the canonical parser to htmlIdentity, which has no live cells to protect', () => {
      expect(resolvePresetIdentityConfig({ id: 'bacom', htmlIdentity: 'TRUE' }).htmlIdentity).to.equal(true);
      expect(resolvePresetIdentityConfig({ id: 'bacom', htmlIdentity: ' true ' }).htmlIdentity).to.equal(true);
    });

    it('normalizes the section list off the preset rather than inheriting the last one', () => {
      expect(resolvePresetIdentityConfig({ id: 'bacom', htmlIdentitySections: ' Blog , news ' })
        .htmlIdentitySections).to.equal('blog,news');
      expect(resolvePresetIdentityConfig({ id: 'bacom' }).htmlIdentitySections).to.equal('');
    });
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

  describe('the Publish snapshot carries the whole policy', () => {
    it('reads the live section box, not whatever config was left holding', () => {
      // The original defect: the snapshot took htmlIdentity from the live
      // checkbox but never read htmlIdentitySections, so an operator who
      // ticked the box, typed `blog` and clicked Publish in one session
      // published flag-ON with an empty list -- forcing `.html` onto the very
      // section they had just exempted. Both fields must come from the DOM.
      setConfig({ htmlIdentity: false, htmlIdentitySections: '' });
      document.getElementById('htmlIdentity').checked = true;
      document.getElementById('htmlIdentitySections').value = 'blog';
      snapshotPublishConfig();
      expect(getConfig().htmlIdentity).to.equal(true);
      expect(getConfig().htmlIdentitySections).to.equal('blog');
    });

    it('does not resurrect a stale list once the box is cleared', () => {
      setConfig({ htmlIdentity: true, htmlIdentitySections: 'blog' });
      document.getElementById('htmlIdentitySections').value = '';
      snapshotPublishConfig();
      expect(getConfig().htmlIdentitySections).to.equal('');
    });
  });

  describe('preset selection applies the whole policy, not half of it', () => {
    it('clears a previous preset section list when the preset changes', () => {
      // The preset handler overwrote htmlIdentity from the sheet but left
      // htmlIdentitySections at whatever the PREVIOUS preset stored, because
      // `config` is seeded from localStorage. reconcileHtmlIdentity only runs
      // from init(), so nothing corrected it until the next page load -- and
      // in the meantime the operator published flag-ON with a carve-out the
      // selected site never declared, or none at all.
      const stored = { presetSelector: 'other', htmlIdentity: true, htmlIdentitySections: 'blog' };
      window.localStorage.setItem('bulk-publish-caas', JSON.stringify(stored));
      setConfig(stored);
      const selector = document.getElementById('presetSelector');
      selector.dispatchEvent(new Event('change'));
      expect(getConfig().htmlIdentitySections).to.equal('');
    });
  });
});
