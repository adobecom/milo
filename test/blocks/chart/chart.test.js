/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';

const {
  SMALL,
  MEDIUM,
  LARGE,
  DESKTOP_BREAKPOINT,
  TABLET_BREAKPOINT,
  colorPalette,
  getContainerSize,
  getResponsiveSize,
  tooltipFormatter,
  getColors,
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

  it('getColors returns default color list if no color provided', () => {
    const authoredColor = undefined;

    expect(getColors(authoredColor)).to.eql(Object.values(colorPalette));
  });

  it('getColors returns rotated color list if color provided ', () => {
    const authoredColor = 'cyan';
    const colors = [
      '#34C5E8',
      '#3991F3',
      '#686DF4',
      '#8A3CE7',
      '#E054E2',
      '#DE3C82',
      '#EA3829',
      '#F48411',
      '#F5D704',
      '#A9D814',
      '#26BB36',
      '#008F5D',
      '#12B5AE',
    ];

    expect(getColors(authoredColor)).to.eql(colors);
  });
});
