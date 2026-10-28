import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getLocale, loadArea, setConfig } from '../../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
setConfig({
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
});
window.lana = { log: sinon.stub() };

const { default: init, parseTime, readSchedule, getActiveEntry } = await import('../../../../libs/c2/blocks/scheduled-content/scheduled-content.js');

const MOCKS = '/test/c2/blocks/scheduled-content/mocks/fragments';
const HOUR = 3600000;
const iso = (ms) => new Date(ms).toISOString();

function makeBlock(rows) {
  const el = document.createElement('div');
  el.className = 'scheduled-content';
  el.innerHTML = rows.map(([time, content]) => `<div><div>${time}</div><div>${content}</div></div>`).join('');
  document.body.append(el);
  return el;
}

const link = (name) => `<a href="${MOCKS}/${name}#_inline">${MOCKS}/${name}</a>`;

describe('scheduled-content', () => {
  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('.scheduled-content').forEach((el) => el.remove());
  });

  it('parses ISO times and common authoring variants', () => {
    expect(parseTime('2026-11-01T09:00:00-07:00')).to.equal(Date.UTC(2026, 10, 1, 16));
    expect(parseTime('2026-11-01 16:00 UTC')).to.equal(Date.UTC(2026, 10, 1, 16));
    expect(parseTime('2026-11-01T16:00:00Z')).to.equal(Date.UTC(2026, 10, 1, 16));
    expect(Number.isNaN(parseTime('next tuesday'))).to.be.true;
    expect(Number.isNaN(parseTime(''))).to.be.true;
  });

  it('reads and sorts the schedule, skipping invalid times', () => {
    const el = makeBlock([
      ['2026-11-02T00:00:00Z', link('after')],
      ['default', link('before')],
      ['soon-ish', link('live')],
      ['2026-11-01T00:00:00Z', `${MOCKS}/live`],
      ['2026-11-03T00:00:00Z', 'Not a path'],
    ]);
    const entries = readSchedule(el);
    expect(entries.map((e) => e.label)).to.deep.equal([
      'default', '2026-11-01T00:00:00Z', '2026-11-02T00:00:00Z', '2026-11-03T00:00:00Z',
    ]);
    expect(entries[0].href).to.equal(`${window.location.origin}${MOCKS}/before`);
    expect(entries[1].href).to.equal(`${window.location.origin}${MOCKS}/live`);
    expect(entries[3].href).to.be.null;
    expect(window.lana.log.calledWithMatch('invalid time "soon-ish"')).to.be.true;
  });

  it('picks the latest entry that has started', () => {
    const entries = [{ start: -Infinity, label: 'a' }, { start: 100, label: 'b' }, { start: 200, label: 'c' }];
    expect(getActiveEntry(entries, 50).label).to.equal('a');
    expect(getActiveEntry(entries, 100).label).to.equal('b');
    expect(getActiveEntry(entries, 500).label).to.equal('c');
    expect(getActiveEntry(entries.slice(1), 50)).to.be.null;
  });

  it('loads the fragment for the current time slot', async () => {
    const now = Date.now();
    const el = makeBlock([
      ['default', link('before')],
      [iso(now - HOUR), link('live')],
      [iso(now + HOUR), link('after')],
    ]);
    await init(el);
    expect(el.dataset.activeSlot).to.equal(iso(now - HOUR));
    expect(el.querySelector('#live-content')).to.exist;
    expect(el.querySelector('#before-content')).to.be.null;
  });

  it('switches to the next fragment when its time arrives', async () => {
    const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const start = Date.now() + 1000;
    const el = makeBlock([['default', link('before')], [iso(start), link('live')]]);
    await init(el);
    expect(el.querySelector('#before-content')).to.exist;
    clock.tick(1001);
    clock.restore();
    await new Promise((r) => { setTimeout(r, 300); });
    expect(el.dataset.activeSlot).to.equal(iso(start));
    expect(el.querySelector('#live-content')).to.exist;
    expect(el.querySelector('#before-content')).to.be.null;
  });

  it('steps through every slot in order without a reload', async () => {
    const now = Date.now();
    const live = iso(now + 300);
    const after = iso(now + 700);
    const el = makeBlock([['default', link('before')], [live, link('live')], [after, link('after')]]);
    const slots = [];
    new MutationObserver(() => slots.push(el.dataset.activeSlot))
      .observe(el, { attributes: true, attributeFilter: ['data-active-slot'] });

    await init(el);
    expect(el.querySelector('#before-content')).to.exist;
    await new Promise((r) => { setTimeout(r, 1200); });

    expect(slots).to.deep.equal(['default', live, after]);
    expect(el.querySelector('#after-content')).to.exist;
    expect(el.querySelector('#before-content, #live-content')).to.be.null;
  });

  it('renders nothing before the first slot and removes empty blocks', async () => {
    const el = makeBlock([[iso(Date.now() + HOUR), link('live')]]);
    await init(el);
    expect(el.isConnected).to.be.true;
    expect(el.dataset.activeSlot).to.equal('none');
    expect(el.children.length).to.equal(0);

    const empty = makeBlock([['not a time', link('live')]]);
    await init(empty);
    expect(empty.isConnected).to.be.false;
  });

  it('only loads the active fragment on a C2 page', async () => {
    const meta = document.createElement('meta');
    meta.name = 'foundation';
    meta.content = 'c2';
    document.head.append(meta);
    const area = document.createElement('div');
    area.innerHTML = `<div><div class="scheduled-content">
      <div><div>default</div><div><p><a href="${MOCKS}/before">${MOCKS}/before</a></p></div></div>
      <div><div>${iso(Date.now() + HOUR)}</div><div><p><a href="${MOCKS}/live">${MOCKS}/live</a></p></div></div>
    </div></div>`;
    document.body.append(area);
    try {
      await loadArea(area);
      const el = area.querySelector('.scheduled-content');
      expect(el.dataset.activeSlot).to.equal('default');
      expect(el.querySelector('#before-content')).to.exist;
      expect(area.querySelector('#live-content')).to.be.null;
    } finally {
      meta.remove();
      area.remove();
    }
  });
});
