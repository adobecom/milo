import { createTag } from '../../../utils/utils.js';

function toScore(value) {
  const num = Number(value);
  return Number.isNaN(num) ? '—' : num.toFixed(1);
}

function pageLabel(url) {
  try {
    return new URL(url).pathname;
  } catch (e) {
    return url;
  }
}

function daHref(url, daContext) {
  if (!daContext || !daContext.org || !daContext.repo) return null;
  let path;
  try {
    path = new URL(url).pathname;
  } catch (e) {
    return null;
  }
  if (path.endsWith('.html')) path = path.slice(0, -'.html'.length);
  return `https://da.live/edit#/${daContext.org}/${daContext.repo}${path}`;
}

export default function renderWorstPages(container, pages, { daContext } = {}) {
  container.replaceChildren();
  const rows = pages || [];

  if (!rows.length) {
    container.append(createTag('div', { class: 'worst-pages-empty' }, 'No failing pages 🎉'));
    return;
  }

  const thead = createTag('thead', null, createTag('tr', null, [
    createTag('th', null, 'Page'),
    createTag('th', null, 'Score'),
    createTag('th', null, 'Actions'),
  ]));

  const bodyRows = rows.map((page) => {
    const pageLink = createTag('a', { href: page.url, target: '_blank', rel: 'noopener' }, pageLabel(page.url) || page.url);

    const actions = createTag('td', null);
    const fixHref = daHref(page.url, daContext);
    if (fixHref) {
      actions.append(createTag('a', { class: 'fix-in-da', href: fixHref }, 'Fix in DA'));
    }

    return createTag('tr', null, [
      createTag('td', null, pageLink),
      createTag('td', null, toScore(page.performance_score)),
      actions,
    ]);
  });

  const tbody = createTag('tbody', null, bodyRows);
  container.append(createTag('table', { class: 'worst-pages' }, [thead, tbody]));
}
