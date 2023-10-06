import { createTag } from '../utils/utils.js';

async function getFooterPromoByTag(contentRoot) {
  const NAME = 'Name';
  const FOOTER_PROMO_LINK = 'Footer Promo Link';
  const taxonomyUrl = `${contentRoot}/taxonomy.json`;
  const tagsOnPage = [...document.head.querySelectorAll('meta[property="article:tag"]')].map((el) => el.content);

  if (!tagsOnPage.length) return false;

  try {
    const resp = await fetch(taxonomyUrl);
    if (!resp.ok) return false;
    const { data } = await resp.json();
    const primaryTag = data.find((tag) => {
      const name = tag[NAME].split('|').pop().trim();
      return tagsOnPage.includes(name) && tag[FOOTER_PROMO_LINK];
    });
    if (primaryTag) return primaryTag[FOOTER_PROMO_LINK];
  } catch (error) {
    window.lana.log(`Footer Promo - Taxonomy error: ${error}`);
    return false;
  }
  return false;
}

export default async function initFooterPromo(contentRoot, urlBasedPromo, tagBasedPromo) {
  let href;
  if (urlBasedPromo && urlBasedPromo !== 'off') href = `${contentRoot}/fragments/footer-promos/${urlBasedPromo}`;

  if (tagBasedPromo === 'on') {
    const linkFromTag = await getFooterPromoByTag(contentRoot);
    if (linkFromTag) href = linkFromTag;
  }

  if (href) {
    const para = createTag('p', {}, createTag('a', { href }, href));
    const section = createTag('div', null, para);
    document.querySelector('main > div:last-of-type').insertAdjacentElement('afterend', section);
  }
}
