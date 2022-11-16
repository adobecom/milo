import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import initList, { listToLowerCase } from '../../../libs/blocks/chart/list.js';

describe('list', () => {
  it('Single list chart without table should be empty', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/list.html' });

    const chartWrapper = document.querySelector('.chart_wrapper');
    const chartData = await readFile({ path: './mocks/listChartSingle.json' });
    const fetchedData = JSON.parse(chartData);
    const chart = initList(chartWrapper, fetchedData);

    expect(chart).to.not.exist;
  });

  it('Single list chart with table should be an article', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/list.html' });

    const chartWrapper = document.querySelector('.chart_wrapper');
    const chartData = await readFile({ path: './mocks/listChartSingleTable.json' });
    const fetchedData = JSON.parse(chartData);
    const chart = initList(chartWrapper, fetchedData);

    expect(chart.nodeName).to.eql('ARTICLE');
    expect(chart.querySelector('img').src).to.eql('http://localhost:2000/image.png');
  });

  it('Multi list chart without table should be a carousel', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/list.html' });

    const chartWrapper = document.querySelector('.chart_wrapper');
    const chartData = await readFile({ path: './mocks/listChartMulti.json' });
    const fetchedData = JSON.parse(chartData);
    const chart = initList(chartWrapper, fetchedData);

    expect(chart.classList.contains('carousel')).to.be.true;
  });

  it('Multi list chart with table should be named', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/list.html' });

    const chartWrapper = document.querySelector('.chart_wrapper');
    const chartData = await readFile({ path: './mocks/listChartMultiTable.json' });
    const fetchedData = JSON.parse(chartData);
    const chart = initList(chartWrapper, fetchedData);

    const carouselItems = chart.querySelector('.carousel-items').children;
    const carouselTitle = carouselItems[0].querySelector('.title');

    expect(carouselTitle.textContent).to.eql('Black Friday Numbers Ordered');
  });

  it('Multi list chart navigation should loop', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/list.html' });

    const chartWrapper = document.querySelector('.chart_wrapper');
    const chartData = await readFile({ path: './mocks/listChartMultiTable.json' });
    const fetchedData = JSON.parse(chartData);
    const chart = initList(chartWrapper, fetchedData);

    const previous = chart.querySelector('button.previous');
    const next = chart.querySelector('button.next');
    const firstCarousel = chart.querySelector('.carousel-item');

    previous.click();
    expect(firstCarousel.classList.contains('active')).to.be.false;

    previous.click();
    expect(firstCarousel.classList.contains('active')).to.be.true;

    next.click();
    expect(firstCarousel.classList.contains('active')).to.be.false;

    next.click();
    expect(firstCarousel.classList.contains('active')).to.be.true;
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
