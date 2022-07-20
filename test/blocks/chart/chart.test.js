/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { getChartOptions } = await import('../../../libs/blocks/chart/chart.js');

describe('chart', () => {
  it('get bar chart options', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bar.html' });
    const options = getChartOptions('bar', {}, []);
    expect(options).to.exist;
  });
});

const { default: getTheme, lightLarge } = await import('../../../libs/blocks/chart/chartLightTheme.js');

describe('chartLightTheme', async () => {
  it('returns null if echarts does not exist', () => {
    expect(getTheme()).to.be.null;
  });

  it('registers theme if it does not exist', async () => {
    window.dataViz = { lightLarge: false };
    window.echarts = { registerTheme: sinon.spy() };
    expect(getTheme('large')).to.equal(lightLarge);
    expect(window.echarts.registerTheme.called).to.be.true;
  });

  it('returns name if theme already exists', async () => {
    window.dataViz = { lightLarge: true };
    window.echarts = { registerTheme: sinon.spy() };
    expect(typeof getTheme('large')).to.equal('string');
    expect(window.echarts.registerTheme.called).to.be.false;
  });
});
