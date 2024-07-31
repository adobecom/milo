import { createTag, getConfig } from '../utils/utils.js';
import { decorateSectionAnalytics } from '../martech/attributes.js';

async function getPromoFromTaxonomy(contentRoot, doc) {
  const NAME_KEY = 'Name';
  const FOOTER_PROMO_LINK_KEY = 'Footer Promo Link';
  const taxonomyUrl = `${contentRoot}/taxonomy.json`;
  const tags = [...doc.head.querySelectorAll('meta[property="article:tag"]')].map((el) => el.content);

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
    window.lana.log(`Footer Promo - Taxonomy error: ${error}`, { tags: 'errorType=info,module=footer-promo' });
  }
  return undefined;
}

export default async function initFooterPromo(footerPromoTag, footerPromoType, doc = document) {
  const config = getConfig();
  const { locale: { contentRoot } } = config;
  let href = footerPromoTag && `${contentRoot}/fragments/footer-promos/${footerPromoTag}`;

  if (footerPromoType === 'taxonomy') {
    const promo = await getPromoFromTaxonomy(contentRoot, doc);
    if (promo) href = promo;
  }

  if (!href) return;

  const { default: loadFragment } = await import('../blocks/fragment/fragment.js');
  const a = createTag('a', { href }, href);
  const div = createTag('div', null, a);
  const section = createTag('div', null, div);
  doc.querySelector('main > div:last-of-type').insertAdjacentElement('afterend', section);
  await loadFragment(a);
  section.classList.add('section');
  const sections = document.querySelectorAll('main > div');
  decorateSectionAnalytics(section, sections.length - 1, config);
}
