/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';

const {
  SMALL,
  MEDIUM,
  LARGE,
  DESKTOP_BREAKPOINT,
  TABLET_BREAKPOINT,
  getContainerSize,
  getResponsiveSize,
  tooltipFormatter,
} = await import('../../../libs/blocks/chart/chart.js');

describe('chart utils', () => {
  it('getContainerSize provides default height and width', () => {
    expect(getContainerSize(LARGE, 'bar')).to.be.an('object')
      .that.has.all.keys('height', 'width');
  });

  it('getContainerSize provides custom area height and width', () => {
    expect(getContainerSize(LARGE, 'bar')).to.be.an('object')
      .that.has.all.keys('height', 'width');
  });

  it('getResponsiveSize returns same sizes on desktop', () => {
    window.innerWidth = DESKTOP_BREAKPOINT;
    expect(getResponsiveSize(LARGE)).to.equal(LARGE);
    expect(getResponsiveSize(MEDIUM)).to.equal(MEDIUM);
    expect(getResponsiveSize(SMALL)).to.equal(SMALL);
  });

  it('getResponsiveSize returns correct sizes on tablet', () => {
    window.innerWidth = TABLET_BREAKPOINT;
    expect(getResponsiveSize(LARGE)).to.equal(MEDIUM);
    expect(getResponsiveSize(MEDIUM)).to.equal(MEDIUM);
    expect(getResponsiveSize(SMALL)).to.equal(SMALL);
  });

  it('getResponsiveSize always returns small on phone', () => {
    window.innerWidth = TABLET_BREAKPOINT - 1;
    expect(getResponsiveSize(LARGE)).to.equal(SMALL);
    expect(getResponsiveSize(MEDIUM)).to.equal(SMALL);
    expect(getResponsiveSize(SMALL)).to.equal(SMALL);
  });

  it('tooltipFormatter outputs tooltip in correct format', () => {
    const params = [
      {
        seriesName: 'Chrome with a Really Really Long Name',
        name: 'Sunday',
        value: ['Sunday', '140', '180'],
        encode: {
          x: [0],
          y: [1],
        },
        marker: '<span>x</span>',
      },
      {
        seriesName: 'Firefox Lorem Ipsum Dolor Sit Amet',
        name: 'Sunday',
        value: ['Sunday', '140', '180'],
        encode: {
          x: [0],
          y: [2],
        },
        marker: '<span>x</span>',
      },
    ];
    const tooltip = 'Sunday<br /><span>x</span> 140k Chrome with a Really Really Long Name<br /><span>x</span> 180k Firefox Lorem Ipsum Dolor Sit Amet<i class="tooltip-icon"></i>';

    expect(tooltipFormatter(params, 'k')).to.equal(tooltip);
  });
});
