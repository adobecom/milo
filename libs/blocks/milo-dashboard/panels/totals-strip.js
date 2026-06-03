import { createTag } from '../../../utils/utils.js';

// Per-consumer breakdown of live page counts. The all-time grand total is
// intentionally not shown — it isn't period-scoped and added noise to the header.
export default function renderTotals(container, totals) {
  container.replaceChildren();

  if (!totals || !totals.perSite) {
    container.append(createTag('div', { class: 'totals-empty' }, 'No totals'));
    return;
  }

  const list = createTag('div', { class: 'totals-list' });
  totals.perSite.forEach(({ site, pages }) => {
    list.append(createTag('div', { class: 'totals-item' }, [
      createTag('span', { class: 'totals-site' }, site),
      createTag('span', { class: 'totals-count' }, Number(pages).toLocaleString()),
    ]));
  });
  container.append(list);
}
