import { createTag } from '../../../utils/utils.js';

// Renders the per-site breakdown into `container` (a grid panel body) and the
// all-time grand total into `headerStat` (a header element above the timeframe
// toggle). The total is NOT period-scoped — keeping it in the header avoids the
// impression that the Day/Week/Month toggle affects it.
export default function renderTotals(container, totals, headerStat) {
  container.replaceChildren();
  if (headerStat) headerStat.replaceChildren();

  const hasData = totals && totals.perSite;

  if (headerStat) {
    const number = hasData ? Number(totals.total).toLocaleString() : '—';
    headerStat.append(
      createTag('span', { class: 'allstat-number' }, number),
      createTag('span', { class: 'allstat-caption' }, 'live pages · all-time'),
    );
  }

  if (!hasData) {
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
