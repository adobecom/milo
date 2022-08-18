/* eslint-disable no-unused-expressions */
/* global describe it */
import { expect } from '@esm-bundle/chai';

const { listChartData, getListHtml, getCarouselHtml, listToLowerCase } = await import('../../../libs/blocks/chart/list.js');

describe('list', () => {
  it('fetch list data', () => {
    const fetchedData = {
      table: {
        total: 2,
        offset: 0,
        limit: 2,
        data: [
          { Title: 'Black Friday Numbers Ordered', Sheet: 'Black Friday', Type: 'numbered' },
          { Title: 'Cyber Monday', Sheet: 'N/A' },
        ],
      },
      'Black Friday': {
        total: 5,
        offset: 0,
        limit: 5,
        data: [
          { Name: 'XBOX One S', Extra: '1.54' },
          { Name: 'Swiffer Xtreme', Extra: '1.27' },
          { Name: 'Teddy Ruxpin', Extra: '1.15' },
          { Name: 'Airpods', Extra: '1.03' },
          { Name: 'Tickle me Elmo', Extra: '1.01' }],
      },
      ':version': 3,
      ':names': ['table', 'Black Friday'],
      ':type': 'multi-sheet',
    };

    const processedData = [{
      title: 'Black Friday Numbers Ordered',
      list: [
        { name: 'XBOX One S', extra: '1.54' },
        { name: 'Swiffer Xtreme', extra: '1.27' },
        { name: 'Teddy Ruxpin', extra: '1.15' },
        { name: 'Airpods', extra: '1.03' },
        { name: 'Tickle me Elmo', extra: '1.01' },
      ],
      type: 'numbered',
    }, {
      list: [],
      title: 'Cyber Monday',
      type: undefined,
    }];

    expect(listChartData(fetchedData)).to.eql(processedData);
  });

  it('fetch list data multi without table', () => {
    const fetchedData = {
      'Black Friday': {
        total: 5,
        offset: 0,
        limit: 5,
        data: [
          { name: 'XBOX One S', extra: '1.54' },
          { name: 'Swiffer Xtreme', extra: '1.27' },
          { name: 'Teddy Ruxpin', extra: '1.15' },
          { name: 'Airpods', extra: '1.03' },
          { name: 'Tickle me Elmo', extra: '1.01' }],
      },
      'Cyber Monday': {
        total: 5,
        offset: 0,
        limit: 5,
        data: [
          { name: 'XBOX One S' },
          { name: 'Swiffer Xtreme' },
          { name: 'Teddy Ruxpin' },
          { name: 'Airpods' },
          { name: 'Tickle me Elmo' }],
      },
      ':version': 3,
      ':names': ['Cyber Monday', 'Black Friday'],
      ':type': 'multi-sheet',
    };

    const processedData = [{
      title: 'Cyber Monday',
      list: [
        { name: 'XBOX One S' },
        { name: 'Swiffer Xtreme' },
        { name: 'Teddy Ruxpin' },
        { name: 'Airpods' },
        { name: 'Tickle me Elmo' },
      ],
    },
    {
      title: 'Black Friday',
      list: [
        { name: 'XBOX One S', extra: '1.54' },
        { name: 'Swiffer Xtreme', extra: '1.27' },
        { name: 'Teddy Ruxpin', extra: '1.15' },
        { name: 'Airpods', extra: '1.03' },
        { name: 'Tickle me Elmo', extra: '1.01' },
      ],
    }];

    expect(listChartData(fetchedData)).to.eql(processedData);
  });

  it('fetchedData should return empty array if no table', () => {
    const fetchedData = {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        { name: 'XBOX One S', extra: '1.54' },
        { name: 'Swiffer Xtreme', extra: '1.27' },
        { name: 'Teddy Ruxpin', extra: '1.15' },
        { name: 'Airpods', extra: '1.03' },
        { name: 'Tickle me Elmo', extra: '1.01' }],
      ':type': 'sheet',
    };

    expect(listChartData(fetchedData)).to.eql([]);
  });

  it('getListHtml should output correct html', () => {
    const data = {
      title: 'Black Friday',
      list: [
        {
          name: 'XBOX One S',
          extra: '1.54',
          image: 'image.png',
          alt: 'Image 1',
        },
        {
          name: 'Swiffer Xtreme',
          extra: '1.27',
          image: 'image.png',
          alt: 'Image 2',
        },
      ],
      type: 'numbered',
    };
    const html = '<article><section class="title">Black Friday</section><section class="body"><ol><li><img src="image.png" alt="Image 1" /><span class="name">XBOX One S</span><span class="extra">1.54</span></li><li><img src="image.png" alt="Image 2" /><span class="name">Swiffer Xtreme</span><span class="extra">1.27</span></li></ol></section></article>';

    expect(getListHtml(data).replace(/\s{2,}|[\n]/g, '')).to.equal(html);
  });

  it('multi-item carousel should output correct html', () => {
    const data = [{
      title: 'Black Friday',
      list: [
        {
          name: 'XBOX One S',
          extra: '1.54',
          image: 'image.png',
          alt: 'Image 1',
        },
        {
          name: 'Swiffer Xtreme',
          extra: '1.27',
          image: 'image.png',
          alt: 'Image 2',
        },
      ],
      type: 'numbered',
    }, {
      title: 'Cyber Monday',
      list: [
        { name: 'XBOX One S' },
        { name: 'Swiffer Xtreme' },
        { name: 'Teddy Ruxpin' },
        { name: 'Airpods' },
        { name: 'Tickle me Elmo' },
      ],
    }];
    const html = '<section class="carousel"><div class="controls"><button type="button"class="previous"aria-controls="listChartCarousel-items"aria-label="Previous Chart"></button><button type="button"class="next"aria-controls="listChartCarousel-items"aria-label="Next Chart"></button></div><div id="listChartCarousel-items"class="carousel-items"aria-live="polite"><div class="carousel-item active"role="group"aria-roledescription="slide"aria-label="0 of 2"><article><section class="title">Black Friday</section><section class="body"><ol><li><img src="image.png" alt="Image 1" /><span class="name">XBOX One S</span><span class="extra">1.54</span></li><li><img src="image.png" alt="Image 2" /><span class="name">Swiffer Xtreme</span><span class="extra">1.27</span></li></ol></section></article></div><div class="carousel-item"role="group"aria-roledescription="slide"aria-label="1 of 2"><article><section class="title">Cyber Monday</section><section class="body"><ul><li><span class="name">XBOX One S</span></li><li><span class="name">Swiffer Xtreme</span></li><li><span class="name">Teddy Ruxpin</span></li><li><span class="name">Airpods</span></li><li><span class="name">Tickle me Elmo</span></li></ul></section></article></div></div></section>';

    expect(getCarouselHtml(data).replace(/\s{2,}|[\n]/g, '')).to.equal(html);
  });

  it('listToLowerCase', () => {
    const input = [{
      Name: 'XBOX One S',
      Extra: '1.54',
    },
    {
      Name: 'Swiffer Xtreme',
      Extra: '1.27',
    }];

    const output = [{
      name: 'XBOX One S',
      extra: '1.54',
    },
    {
      name: 'Swiffer Xtreme',
      extra: '1.27',
    }];

    expect(listToLowerCase(input)).to.eql(output);
  });
});
