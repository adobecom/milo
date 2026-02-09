import { createTag, getFederatedUrl } from '../../utils/utils.js';

const getCardsData = (el) => {
  const cleanText = (node) => (node?.textContent || '').trim().replace(/\s+/g, ' ');

  const getImgUrl = (img) => {
    if (!img) return '';
    return img.currentSrc || img.src || img.getAttribute('src') || '';
  };

  const rows = Array.from(el?.children || []);

  return rows
    .map((row) => {
      const cols = Array.from(row?.children || []);
      if (cols.length < 2) return null;

      const imageCol = cols[0];
      const contentCol = cols[1];

      const cardImage = getImgUrl(imageCol?.querySelector('picture img, img'));
      if (!cardImage) return null;

      const iconImg = contentCol?.querySelector('p picture img, picture img, img');
      const icon = getFederatedUrl(getImgUrl(iconImg));

      const h5 = contentCol?.querySelector('h5');
      const h3s = Array.from(contentCol?.querySelectorAll('h3') || []);

      let iconLabel = cleanText(h5);
      let cardTitle = '';

      if (iconLabel) {
        cardTitle = cleanText(h3s[0]);
      } else if (h3s.length >= 2) {
        // Some variants omit <h5> and instead use two <h3>s:
        // first behaves like a kicker (iconLabel), second like the title.
        iconLabel = cleanText(h3s[0]);
        cardTitle = cleanText(h3s[1]);
      } else {
        cardTitle = cleanText(h3s[0]);
      }

      // Prefer <h4> as description; fall back to the first non-empty text <p>.
      let cardDescription = cleanText(contentCol?.querySelector('h4'));
      if (!cardDescription) {
        const ps = Array.from(contentCol?.querySelectorAll('p') || []);
        const firstTextP = ps.find((p) => cleanText(p) && !p.querySelector('picture, img'));
        cardDescription = cleanText(firstTextP);
      }

      if (!iconLabel) iconLabel = (iconImg?.getAttribute('alt') || '').trim();

      return {
        icon,
        iconLabel,
        cardImage,
        cardTitle,
        cardDescription,
      };
    })
    .filter(Boolean);
};

const getIntroData = (el) => {
  const cleanText = (node) => (node?.textContent || '').trim().replace(/\s+/g, ' ');
  const introRow = el?.querySelector(':scope > div:first-child > div');

  return {
    smallPrint: cleanText(introRow?.querySelector('h4')),
    title: cleanText(introRow?.querySelector('h1')),
    description: cleanText(introRow?.querySelector('h3')),
  };
};

export default function init(el) {
  const cardsData = getCardsData(el);
  const introData = getIntroData(el);

  if (!cardsData.length && !introData) return;

  el.classList.add('elastic-cards');

  const intro = createTag('div', { class: 'ec-intro' }, [
    createTag('p', { class: 'ec-smallprint' }, introData.smallPrint || ''),
    createTag('h2', { class: 'ec-title' }, introData.title || ''),
    createTag('p', { class: 'ec-description' }, introData.description || ''),
  ]);

  const cardEls = cardsData.slice(0, 4).map((card) => {
    const iconRow = createTag('div', { class: 'ec-card-icon' }, [
      createTag('img', {
        class: 'ec-card-icon-img',
        src: card.icon || '',
        alt: card.iconLabel || '',
        loading: 'lazy',
      }),
      createTag('span', { class: 'ec-card-icon-label' }, card.iconLabel || ''),
    ]);

    const image = createTag('img', {
      class: 'ec-card-image',
      src: card.cardImage || '',
      alt: card.cardTitle || '',
      loading: 'lazy',
    });
    const imageWrap = createTag('div', { class: 'ec-card-image-wrap' }, image);

    const title = createTag('h3', { class: 'ec-card-title' }, card.cardTitle || '');
    const description = createTag('p', { class: 'ec-card-description' }, card.cardDescription || '');
    const info = createTag('div', { class: 'ec-card-info' }, [title, description]);

    return createTag('div', { class: 'ec-card' }, [
      iconRow,
      imageWrap,
      info,
    ]);
  });

  const cards = createTag('div', { class: 'ec-cards' }, cardEls);
  const cardsWrap = createTag('div', { class: 'ec-cards-wrap' }, cards);

  el.replaceChildren(intro, cardsWrap);
}
