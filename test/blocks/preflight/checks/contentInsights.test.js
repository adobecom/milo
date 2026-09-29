import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { openAllModals } from '../../../../libs/blocks/preflight/checks/contentInsights.js';

describe('preflight checks contentInsights', () => {
  it('registers preflight executors on the window on import', () => {
    expect(window.preflightExecutors).to.be.an('object');
    expect(window.preflightExecutors).to.have.all.keys('general', 'assets', 'accessibility', 'performance', 'seo');
    expect(window.preflightExecutors.seo.checkH1s).to.be.a('function');
    expect(window.preflightExecutors.performance.checkLcpEl).to.be.a('function');
  });

  describe('openAllModals', () => {
    let clock;
    let area;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      area = document.createElement('div');
      area.innerHTML = `
        <main>
          <a data-modal-hash="#m1">one</a>
          <a data-modal-hash="#m2">two</a>
          <a href="/not-a-modal">ignore</a>
        </main>`;
      document.body.append(area);
    });

    afterEach(() => { clock.restore(); area.remove(); });

    it('clicks every modal link, ignores non-modal links, then waits', async () => {
      const clicked = [];
      area.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => clicked.push(e.target)));

      const promise = openAllModals(area);
      // Clicks are dispatched synchronously before the trailing wait.
      expect(clicked).to.have.lengthOf(2);

      let resolved = false;
      promise.then(() => { resolved = true; });
      await clock.tickAsync(4999);
      expect(resolved).to.be.false;
      await clock.tickAsync(1);
      await promise;
      expect(resolved).to.be.true;
    });

    it('swallows errors from individual links', async () => {
      const link = area.querySelector('a[data-modal-hash]');
      sinon.stub(link, 'scrollIntoView').throws(new Error('boom'));
      const promise = openAllModals(area);
      await clock.tickAsync(5000);
      // Should resolve despite the thrown error.
      await promise;
    });
  });
});
