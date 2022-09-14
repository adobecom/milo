import { propertyNameCI, propertyValueCI } from './utils.js';
import { loadStyle, getConfig } from '../../utils/utils.js';

export const listToLowerCase = (list) => (
  list.map((item) => (
    Object.keys(item).reduce((prev, key) => {
      prev[key.toLowerCase()] = item[key];
      return prev;
    }, {})
  ))
);

function listChartData(json) {
  const data = [];

  if (json[':type'] !== 'multi-sheet') {
    console.warn('List chart error: Add table sheet');
    return data;
  }

  const tableKey = propertyNameCI(json, 'table');

  if (tableKey) {
    json[tableKey].data?.forEach((column) => {
      const sheet = propertyValueCI(column, 'sheet');

      data.push({
        title: propertyValueCI(column, 'title'),
        list: listToLowerCase(json[sheet]?.data ?? []),
        type: propertyValueCI(column, 'type'),
      });
    });
  } else {
    json[':names'].forEach((sheet) => {
      data.push({
        title: sheet,
        list: listToLowerCase(json[sheet]?.data),
      });
    });
  }

  return data;
}

const getListHtml = (chart, hexcode) => {
  if (!chart) return '';

  const hasIcon = typeof chart.list?.[0]?.image === 'string';
  const listType = chart.type?.toLowerCase() === 'numbered' ? 'ol' : 'ul';
  const listItems = chart.list.reduce((prev, { name = '', extra, image, alt = '' }) => (
    `${prev}
    <li>
      <div class="list-flex">
        <div class="name">
          ${image ? `<img src="${image}" alt="${alt}" />` : ''}
          ${name}
        </div>
        ${extra ? `<span class="extra">${extra}</span>` : ''}
      </div>
    </li>`
  ), '');

  return `
    <article class="list-wrapper">
      <section class="title" style="${hexcode ? `background-color: ${hexcode};` : ''}">${chart.title}</section>
      <${listType} class="${hasIcon ? 'icon-list' : ''}">${listItems}</${listType}>
    </article>
  `;
};

const getCarouselHtml = (data, hexcode) => {
  const carouselItems = data.reduce((prev, list, idx) => (
    `${prev}
    <div class="carousel-item${idx === 0 ? ' active' : ''}"
      role="group"
      aria-roledescription="slide"
      aria-label="${idx} of ${data.length}">
      ${getListHtml(list, hexcode)}
    </div>
    `
  ), '');

  return `
    <section class="carousel">
      <div class="controls">
        <button type="button"
          class="previous"
          aria-controls="listChartCarousel-items"
          aria-label="Previous Chart"></button>
        <button type="button"
          class="next"
          aria-controls="listChartCarousel-items"
          aria-label="Next Chart"></button>
      </div>
      <div id="listChartCarousel-items" class="carousel-items">
        ${carouselItems}
      </div>
      <div class="carousel-screen-reader" aria-live="polite"></div>
    </section>`;
};

const showCarouselItem = (element, index) => {
  const carouselItems = element.querySelectorAll('.carousel-item');
  const carouselScreenReader = element.querySelector('.carousel-screen-reader');

  carouselItems?.forEach((slide, idx) => {
    if (idx === index) {
      slide.classList.add('active');
      carouselScreenReader.innerText = slide.querySelector('.title')?.innerText;
    } else {
      slide.classList.remove('active');
    }
  });

  setTimeout(() => { carouselScreenReader.innerText = ''; }, 5000);
};

const initList = (element, json, hexcode) => {
  const data = listChartData(json);
  const chartHtml = data.length > 1
    ? getCarouselHtml(data, hexcode)
    : getListHtml(data[0], hexcode);

  if (typeof chartHtml === 'string') element.innerHTML = chartHtml;

  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;

  loadStyle(`${base}/blocks/chart/list.css`);

  if (data.length > 1) {
    let index = 0;

    const previous = element.querySelector('button.previous');
    const next = element.querySelector('button.next');

    previous?.addEventListener('click', () => {
      index = index < 1 ? data.length - 1 : index - 1;
      showCarouselItem(element, index);
    });

    next?.addEventListener('click', () => {
      index = index >= data.length - 1 ? 0 : index + 1;
      showCarouselItem(element, index);
    });
  }

  return element.firstElementChild;
};

export default initList;
