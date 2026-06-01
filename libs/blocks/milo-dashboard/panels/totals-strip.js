import { createTag } from '../../../utils/utils.js';

export default function renderTotals(container, totals) {
  container.replaceChildren();

  if (!totals || !totals.perSite) {
    container.append(createTag('div', { class: 'totals-empty' }, 'No totals'));
    return;
  }

  const total = Number(totals.total);
  container.append(createTag('div', { class: 'totals-total' }, [
    createTag('span', { class: 'totals-number' }, total.toLocaleString()),
    createTag('span', { class: 'totals-caption' }, 'pages stored'),
  ]));

  const list = createTag('div', { class: 'totals-list' });
  totals.perSite.forEach(({ site, pages }) => {
    list.append(createTag('div', { class: 'totals-item' }, [
      createTag('span', { class: 'totals-site' }, site),
      createTag('span', { class: 'totals-count' }, Number(pages).toLocaleString()),
    ]));
  });
  container.append(list);
}
