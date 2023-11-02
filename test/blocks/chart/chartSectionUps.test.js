import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { MILO_EVENTS, setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/chart/chart.js');

const config = { codeRoot: '/libs' };
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/chart-in-section-two-up.html' });

describe('chart in a section metadata', async () => {
  beforeEach(() => {
    const charts = document.querySelectorAll('.chart');
    charts.forEach((chart) => init(chart));
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  });

  it('section style two-up take priority', async () => {
    const sections = document.querySelectorAll('.section');
    expect(sections[0].classList.contains('three-up')).to.be.false;
    expect(sections[1].classList.contains('container')).to.be.false;
  });
});
