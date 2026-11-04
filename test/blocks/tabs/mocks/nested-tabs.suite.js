import { expect } from 'chai';

// Stand-in for merch-card: counts lifecycle callbacks to detect re-attached cards.
class ReconnectProbe extends HTMLElement {
  connects = 0;

  disconnects = 0;

  connectedCallback() { this.connects += 1; }

  disconnectedCallback() { this.disconnects += 1; }
}
if (!customElements.get('reconnect-probe')) customElements.define('reconnect-probe', ReconnectProbe);

const GROUPS = ['individual', 'business', 'students'];
const LABELS = ['Annual', 'Monthly'];

const probes = (group) => Array.from({ length: 3 }, () => `<reconnect-probe data-group="${group}"></reconnect-probe>`).join('');

const tabsBlock = (id, labels, variant) => `
  <div class="tabs ${variant}">
    <div><div><ol>${labels.map((label) => `<li>${label}</li>`).join('')}</ol></div></div>
    <div><div>id</div><div>${id}</div></div>
  </div>`;

const metadata = (tab) => `
  <div class="section-metadata"><div><div>tab</div><div>${tab}</div></div></div>`;

const cardSection = (sectionId, group, tab) => `
  <div class="section" id="${sectionId}">${probes(group)}${metadata(tab)}</div>`;

// Mirrors /acrobat/plans: a top tabs block whose panels hold radio tabs blocks, which hold cards.
const buildPage = () => `
  <div class="section" id="main-tabs">
    ${tabsBlock('compare-plans', ['Individuals', 'Business', 'Students'], 'quiet')}
  </div>
  ${GROUPS.map((group, i) => `
  <div class="section" id="${group}-tabs">
    ${tabsBlock(group, LABELS, 'radio')}
    ${metadata(`compare-plans, ${i + 1}`)}
  </div>`).join('')}
  ${GROUPS.map((group) => `
  ${cardSection(`${group}-1`, group, `${group}, 1`)}
  ${cardSection(`${group}-1b`, group, `${group}, 1`)}
  ${cardSection(`${group}-2`, group, `${group}, 2`)}`).join('')}`;

const probesOf = (group) => [...document.querySelectorAll(`reconnect-probe[data-group="${group}"]`)];
const connectCounts = (group) => probesOf(group).map((probe) => probe.connects);
const sectionIds = (panelId) => [...document.getElementById(panelId).children]
  .filter((el) => el.classList.contains('section')).map((el) => el.id);
const isHidden = (id) => document.getElementById(id).hasAttribute('hidden');

export default function nestedTabsSuite(loadInit) {
  describe('nested tabs blocks with already hydrated cards', () => {
    const originalUrl = window.location.href;
    let init;
    let tabs;

    const initAll = async (upTo = tabs.length) => {
      for (let i = 0; i < upTo; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await init(tabs[i]);
      }
    };

    before(async () => { init = await loadInit(); });

    beforeEach(() => {
      sessionStorage.clear();
      document.body.innerHTML = buildPage();
      tabs = [...document.querySelectorAll('.tabs')];
    });

    afterEach(() => {
      window.history.replaceState({}, '', originalUrl);
      document.body.innerHTML = '';
    });

    it('re-attaches a card only when its own tabs block moves it into a panel', async () => {
      await initAll(2);
      const individualAfterOwner = connectCounts('individual');
      expect(individualAfterOwner).to.have.length(9);
      expect(individualAfterOwner.every((count) => count === 2)).to.be.true;

      await init(tabs[2]);
      const businessAfterOwner = connectCounts('business');
      expect(businessAfterOwner.every((count) => count === 2)).to.be.true;

      await init(tabs[3]);
      expect(connectCounts('individual')).to.deep.equal(individualAfterOwner);
      expect(connectCounts('business')).to.deep.equal(businessAfterOwner);
      expect(connectCounts('students').every((count) => count === 2)).to.be.true;
      probesOf('individual').forEach((probe) => {
        expect(probe.disconnects).to.equal(1);
        expect(probe.isConnected).to.be.true;
      });
    });

    it('keeps sections in their panels in document order', async () => {
      await initAll();
      expect(sectionIds('tab-panel-compare-plans-1')).to.deep.equal(['individual-tabs']);
      expect(sectionIds('tab-panel-compare-plans-2')).to.deep.equal(['business-tabs']);
      expect(sectionIds('tab-panel-compare-plans-3')).to.deep.equal(['students-tabs']);
      GROUPS.forEach((group) => {
        expect(sectionIds(`tab-panel-${group}-1`)).to.deep.equal([`${group}-1`, `${group}-1b`]);
        expect(sectionIds(`tab-panel-${group}-2`)).to.deep.equal([`${group}-2`]);
      });
    });

    it('keeps tracking labels and button attributes', async () => {
      await initAll();
      GROUPS.forEach((group) => {
        expect(document.getElementById(`tab-panel-${group}-1`).getAttribute('data-nested-lh')).to.equal('t1Ann');
        expect(document.getElementById(`tab-panel-${group}-2`).getAttribute('data-nested-lh')).to.equal('t2Mon');
        expect(document.getElementById(`tab-${group}-1`).getAttribute('daa-ll')).to.equal(`tab-${group}-1`);
      });
      expect(document.getElementById('tab-compare-plans-2').getAttribute('daa-ll')).to.equal('tab-compare-plans-2');
    });

    it('switches tabs at every level without re-attaching cards', async () => {
      await initAll();
      const before = GROUPS.map(connectCounts);

      document.getElementById('tab-compare-plans-2').click();
      expect(isHidden('tab-panel-compare-plans-1')).to.be.true;
      expect(isHidden('tab-panel-compare-plans-2')).to.be.false;

      document.getElementById('tab-business-2').click();
      expect(isHidden('tab-panel-business-1')).to.be.true;
      expect(isHidden('tab-panel-business-2')).to.be.false;

      document.getElementById('tab-compare-plans-1').click();
      expect(isHidden('tab-panel-compare-plans-1')).to.be.false;
      expect(isHidden('tab-panel-compare-plans-2')).to.be.true;
      expect(GROUPS.map(connectCounts)).to.deep.equal(before);
    });

    it('opens a deep-linked nested tab and keeps cards attached once', async () => {
      const url = new URL(originalUrl);
      url.searchParams.set('tab', 'individual-2');
      window.history.replaceState({}, '', url);
      await initAll();
      expect(isHidden('tab-panel-individual-1')).to.be.true;
      expect(isHidden('tab-panel-individual-2')).to.be.false;
      expect(connectCounts('individual').every((count) => count === 2)).to.be.true;
    });

    it('still places a section that arrives after its own tabs block initialized', async () => {
      await initAll(2);
      const individualAfterOwner = connectCounts('individual');
      tabs[1].closest('.section').insertAdjacentHTML('afterend', cardSection('late', 'late', 'individual, 2'));

      await init(tabs[2]);
      expect(sectionIds('tab-panel-individual-2')).to.deep.equal(['individual-2', 'late']);
      expect(document.querySelector('reconnect-probe[data-group="late"]').connects).to.equal(2);
      expect(connectCounts('individual')).to.deep.equal(individualAfterOwner);
    });
  });
}
