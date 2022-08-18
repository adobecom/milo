import { propertyNameCI, propertyValueCI } from './utils.js';

export const listToLowerCase = (list) => (
  list.map((item) => (
    Object.keys(item).reduce((prev, key) => {
      prev[key.toLowerCase()] = item[key];
      return prev;
    }, {})
  ))
);

export function listChartData(json) {
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

export const getListHtml = (chart) => {
  const listType = chart.type?.toLowerCase() === 'numbered' ? 'ol' : 'ul';
  const listItems = chart.list.reduce((prev, { name = '', extra, image, alt = '' }) => (
    `${prev}
    <li>
      ${image ? `<img src="${image}" alt="${alt}" />` : ''}
      <span class="name">${name}</span>
      ${extra ? `<span class="extra">${extra}</span>` : ''}
    </li>`
  ), '');

  return `
    <article>
      <section class="title">${chart.title}</section>
      <section class="body">
        <${listType}>${listItems}</${listType}>
      </section>
    </article>
  `;
};

export const getCarouselHtml = (data) => {
  const carouselItems = data.reduce((prev, list, idx) => (
    `${prev}
    <div class="carousel-item${idx === 0 ? ' active' : ''}"
      role="group"
      aria-roledescription="slide"
      aria-label="${idx} of ${data.length}">
      ${getListHtml(list)}
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
      <div id="listChartCarousel-items"
        class="carousel-items"
        aria-live="polite">
        ${carouselItems}
      </div>
    </section>`;
};

const showCarouselItem = (element, index) => {
  const carouselItems = element.querySelectorAll('.carousel-item');

  carouselItems?.forEach((carousel, idx) => {
    if (idx === index) {
      carousel.classList.add('active');
    } else {
      carousel.classList.remove('active');
    }
  });
};

const initList = (element, json) => {
  const data = listChartData(json);
  const chartHtml = data.length === 1 ? getListHtml(data[0]) : getCarouselHtml(data);

  if (typeof chartHtml === 'string') element.innerHTML = chartHtml;

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
};

export default initList;
