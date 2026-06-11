import { expect } from '@esm-bundle/chai';

const { computeRollup } = await import('../../../libs/blocks/project-tracking/rollup.js');

const row = (lastPreview, lastPublish) => ({ lastPreview, lastPublish });

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
