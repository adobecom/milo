import { createTag, getConfig } from '../utils/utils.js';

async function getPromoFromTaxonomy(contentRoot) {
  const NAME_KEY = 'Name';
  const FOOTER_PROMO_LINK_KEY = 'Footer Promo Link';
  const taxonomyUrl = `${contentRoot}/taxonomy.json`;
  const tags = [...document.head.querySelectorAll('meta[property="article:tag"]')].map((el) => el.content);

  if (!tags.length) return undefined;

  try {
    const resp = await fetch(taxonomyUrl);
    if (!resp.ok) return undefined;
    const { data } = await resp.json();
    const primaryTag = data.find((tag) => {
      const name = tag[NAME_KEY].split('|').pop().trim();
      return tags.includes(name) && tag[FOOTER_PROMO_LINK_KEY];
    });
    if (primaryTag) return primaryTag[FOOTER_PROMO_LINK_KEY];
  } catch (error) {
    /* c8 ignore next 2 */
    window.lana.log(`Footer Promo - Taxonomy error: ${error}`);
  }
  return undefined;
}

export default async function initFooterPromo(footerPromoTag, footerPromoType) {
  const { locale: { contentRoot } } = getConfig();
  let href = footerPromoTag && `${contentRoot}/fragments/footer-promos/${footerPromoTag}`;

  if (footerPromoType === 'taxonomy') {
    const promo = await getPromoFromTaxonomy(contentRoot);
    if (promo) href = promo;
  }

  if (!href) return;

  const { default: loadFragment } = await import('../blocks/fragment/fragment.js');
  const a = createTag('a', { href }, href);
  const div = createTag('div', null, a);
  const section = createTag('div', null, div);
  document.querySelector('main > div:last-of-type').insertAdjacentElement('afterend', section);
  await loadFragment(a);
  section.classList.add('section');
}
