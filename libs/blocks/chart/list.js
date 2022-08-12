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
      data.push({
        title: propertyValueCI(column, 'title'),
        list: listToLowerCase(json[propertyValueCI(column, 'sheet')]?.data),
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

export const getListHtml = (data) => {
  // ToDo: Replace firstList with carousel iterator MWPW-114550
  const firstList = data[0];
  const listType = firstList.type?.toLowerCase() === 'numbered' ? 'ol' : 'ul';

  const listItems = firstList.list.reduce((prev, { name = '', extra, image, alt = '' }) => (
    `${prev}
    <li>
      ${image ? `<img src="${image}" alt="${alt}" />` : ''}
      <span class="name">${name}</span>
      ${extra ? `<span class="extra">${extra}</span>` : ''}
    </li>`
  ), '');

  return `
    <article>
      <section class="title">${firstList.title}</section>
      <section class="body">
        <${listType}>${listItems}</${listType}>
      </section>
    </article>
  `;
};

const initList = (element, json) => {
  const data = listChartData(json);
  const listHtml = getListHtml(data);

  if (typeof listHtml === 'string') element.innerHTML = listHtml;
};

export default initList;
