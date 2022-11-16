import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: getTheme, LIGHT_LARGE } = await import('../../../libs/blocks/chart/chartLightTheme.js');
const { LARGE } = await import('../../../libs/blocks/chart/chart.js');

describe('chartLightTheme', async () => {
  it('returns null if echarts does not exist', () => {
    expect(getTheme()).to.be.null;
  });

  it('registers theme if it does not exist', async () => {
    window.dataViz = { lightLarge: false };
    window.echarts = { registerTheme: sinon.spy() };
    expect(getTheme(LARGE)).to.equal(LIGHT_LARGE);
    expect(window.echarts.registerTheme.called).to.be.true;
  });

  it('returns name if theme already exists', async () => {
    window.dataViz = { lightLarge: true };
    window.echarts = { registerTheme: sinon.spy() };
    expect(typeof getTheme(LARGE)).to.equal('string');
    expect(window.echarts.registerTheme.called).to.be.false;
  });

  it('theme tooltip position', () => {
    window.dataViz = { lightLarge: false };
    window.echarts = { registerTheme: sinon.spy() };
    getTheme(LARGE);
    const options = window.echarts.registerTheme.firstCall.args[1];
    expect(Array.isArray(options.tooltip.position([0, 0], null, document.body))).to.be.true;
  });
});
