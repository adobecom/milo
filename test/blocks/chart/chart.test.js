/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { getChartOptions } = await import('../../../libs/blocks/chart/chart.js');

describe('chart', () => {
  it('get bar chart options', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bar.html' });
    const options = getChartOptions('bar', {}, []);
    expect(options).to.exist;
  });
});
