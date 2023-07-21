import { getMetadata } from '../../../../utils/utils.js';
import { toFragment, lanaLog } from '../../utilities/utilities.js';

const metadata = {
  seo: 'breadcrumbs-seo',
  seoLegacy: 'breadcrumb-seo',
  fromFile: 'breadcrumbs-from-file',
  showCurrent: 'breadcrumbs-show-current-page',
  hiddenEntries: 'breadcrumbs-hidden-entries',
  pageTitle: 'breadcrumbs-page-title',
  base: 'breadcrumbs-base',
  fromUrl: 'breadcrumbs-from-url',
};

const setBreadcrumbSEO = (breadcrumbs) => {
  const seoDisabled = (getMetadata(metadata.seo) || getMetadata(metadata.seoLegacy)) === 'off';
  if (seoDisabled || !breadcrumbs) return;
  const breadcrumbsSEO = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  };
  breadcrumbs.querySelectorAll('ul > li').forEach((item, idx) => {
    const link = item.querySelector('a');
    breadcrumbsSEO.itemListElement.push({
      '@type': 'ListItem',
      position: idx + 1,
      name: link ? link.innerText.trim() : item.innerText.trim(),
      item: link?.href,
    });
  });
  const script = toFragment`<script type="application/ld+json">${JSON.stringify(
    breadcrumbsSEO,
  )}</script>`;
  document.head.append(script);
};

const getHiddenEntries = (str) => str
  ?.toLowerCase()
  .split(',')
  .map((item) => item.trim()) || [];

const removeHiddenEntries = ({ ul }) => {
  const hidden = getHiddenEntries(getMetadata(metadata.hiddenEntries));
  if (!hidden.length) return;
  ul.querySelectorAll('li').forEach(
    (li) => hidden.includes(li.innerText?.toLowerCase().trim()) && li.remove(),
  );
};

const createBreadcrumbs = (element) => {
  if (!element) return null;
  const ul = element.querySelector('ul');

  if (getMetadata(metadata.showCurrent) === 'on') {
    ul.append(toFragment`
      <li>
        ${getMetadata(metadata.pageTitle) || document.title}
      </li>
    `);
  }
  removeHiddenEntries({ ul });
  const breadcrumbs = toFragment`
    <div class="feds-breadcrumbs-wrapper">
      <nav class="feds-breadcrumbs" aria-label="Breadcrumb">${ul}</nav>
    </div>
  `;
  ul.querySelector('li:last-of-type')?.setAttribute('aria-current', 'page');
  return breadcrumbs;
};

const createWithBase = async (element = toFragment`<div><ul></ul></div>`) => {
  const url = getMetadata(metadata.base);
  if (!url) return null;
  try {
    const resp = await fetch(`${url}.plain.html`);
    const text = await resp.text();
    const base = new DOMParser().parseFromString(text, 'text/html').body;
    element.querySelector('ul')?.prepend(...base.querySelectorAll('li'));
    return createBreadcrumbs(element);
  } catch (error) {
    return null;
  }
};

const fromUrl = () => {
  if (getMetadata(metadata.fromUrl) !== 'on') return null;
  const list = toFragment`<ul></ul>`;
  const paths = document.location.pathname.split('/').filter((n) => n);
  for (let i = 0; i < paths.length; i += 1) {
    list.append(toFragment`
      <li>
        <a href="/${paths.slice(0, i + 1).join('/')}">${paths[i].replaceAll('-', ' ')}</a>
      </li>
    `);
  }
  return createBreadcrumbs(toFragment`<div>${list}</div>`);
};

export default async function init(el) {
  try {
    const breadcrumbsEl = (await createWithBase(el)) || createBreadcrumbs(el) || fromUrl();
    setBreadcrumbSEO(breadcrumbsEl);
    return breadcrumbsEl;
  } catch (e) {
    lanaLog({ e, message: 'Breadcrumbs failed rendering' });
    return null;
  }
}
