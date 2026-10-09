import { expect } from '@esm-bundle/chai';

const { computeRollup, preflightTier, computePreflightRollup, deriveStatus, computeStatusCounts } = await import('../../../libs/blocks/project-tracking/rollup.js');

const row = (lastPreview, lastPublish) => ({ lastPreview, lastPublish });
const pfRow = (score) => ({ preflight: score == null ? null : { score } });

describe('project-tracking rollup', () => {
  it('empty input → zeroed rollup, no divide-by-zero', () => {
    const r = computeRollup([]);
    expect(r.total).to.equal(0);
    expect(r.previewed).to.equal(0);
    expect(r.published).to.equal(0);
    expect(r.previewedPct).to.equal(0);
    expect(r.publishedPct).to.equal(0);
  });

  it('counts over all pasted links (denominator = total)', () => {
    const rows = [
      row('2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z'),
      row('2024-01-01T00:00:00Z', null),
      row('2024-01-01T00:00:00Z', '2024-01-03T00:00:00Z'),
      row(null, null),
    ];
    const r = computeRollup(rows);
    expect(r.total).to.equal(4);
    expect(r.previewed).to.equal(3);
    expect(r.published).to.equal(2);
    expect(r.previewedPct).to.equal(75);
    expect(r.publishedPct).to.equal(50);
  });

  it('percentages round to whole numbers', () => {
    const rows = [row('2024-01-01T00:00:00Z', null), row(null, null), row(null, null)];
    const r = computeRollup(rows);
    expect(r.previewedPct).to.equal(33);
    expect(r.publishedPct).to.equal(0);
  });

  it('since filter: only events on/after the date count', () => {
    const rows = [
      row('2024-01-10T00:00:00Z', '2024-01-10T00:00:00Z'),
      row('2023-12-01T00:00:00Z', '2023-12-01T00:00:00Z'),
    ];
    const r = computeRollup(rows, { since: '2024-01-01' });
    expect(r.previewed).to.equal(1);
    expect(r.published).to.equal(1);
    expect(r.total).to.equal(2);
  });

  it('invalid since is ignored (treated as no filter)', () => {
    const rows = [row('2020-01-01T00:00:00Z', null)];
    expect(computeRollup(rows, { since: 'not-a-date' }).previewed).to.equal(1);
  });
});

describe('project-tracking preflight', () => {
  it('preflightTier: 3-tier boundaries at 90 and 70, null passes through', () => {
    expect(preflightTier(null)).to.equal(null);
    expect(preflightTier(90)).to.equal('pass');
    expect(preflightTier(89)).to.equal('warn');
    expect(preflightTier(70)).to.equal('warn');
    expect(preflightTier(69)).to.equal('fail');
    expect(preflightTier(0)).to.equal('fail');
  });

  it('rollup: passing = score >= 90 (pass tier), denominator = pages with a run', () => {
    const rows = [pfRow(95), pfRow(72), pfRow(40), pfRow(null)];
    const r = computePreflightRollup(rows);
    expect(r.checked).to.equal(3);
    expect(r.passing).to.equal(1);
    expect(r.passingPct).to.equal(33);
  });

  it('rollup: no preflight data → zeroed, no divide-by-zero', () => {
    const r = computePreflightRollup([pfRow(null), pfRow(null)]);
    expect(r.checked).to.equal(0);
    expect(r.passing).to.equal(0);
    expect(r.passingPct).to.equal(0);
  });
});

describe('project-tracking status', () => {
  it('distinguishes unsupported URLs from pages with no history', () => {
    expect(deriveStatus({ site: null, status: 'Draft' })).to.equal('Unsupported');
    expect(deriveStatus({ site: 'da-bacom', status: 'Draft' })).to.equal('No history found');
    expect(deriveStatus({ site: 'da-bacom', lastPreview: null, lastPublish: null })).to.equal('No history found');
    expect(deriveStatus({ lastPreview: '2026-01-01' })).to.equal('Previewed');
    expect(deriveStatus({ lastPublish: '2026-01-01' })).to.equal('Live');
  });

  it('counts Unsupported separately from pages with no history', () => {
    const c = computeStatusCounts([{ site: null }, { site: 'da-bacom' }, { site: 'da-bacom', status: 'Live' }]);
    expect(c).to.deep.equal({ total: 3, noHistory: 1, previewed: 0, live: 1, unsupported: 1 });
  });
});
