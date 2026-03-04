import { createTag, getFederatedUrl } from '../../../utils/utils.js';

const CHEVRON_SVG = '<svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const getSlidesData = (el) => {
  const data = {};
  let breakpoint = null;

  const parseSlide = (textCol, imageCol) => {
    const heading = textCol?.querySelector('h1, h2');
    const plainPs = [...(textCol?.querySelectorAll('p') || [])]
      .filter((p) => !p.querySelector('a'));
    const cta1 = textCol?.querySelector('em strong a');
    const cta2 = textCol?.querySelector('em > a');
    const cardLink = [...(textCol?.querySelectorAll('a') || [])]
      .find((a) => /\.svg/i.test(a.getAttribute('href') || ''));

    return {
      backgroundImage: imageCol?.querySelector('img')?.src || '',
      smallPrint: plainPs[0]?.textContent?.trim() || '',
      title: heading?.textContent?.trim() || '',
      description: plainPs.slice(1).map((p) => p.textContent?.trim()).filter(Boolean),
      cta1Label: cta1?.textContent?.trim() || '',
      cta1Link: cta1?.getAttribute('href') || '',
      productLink: cta1?.getAttribute('href') || '',
      ...(cta2 ? {
        cta2Label: cta2.textContent?.trim() || '',
        cta2Link: cta2.getAttribute('href') || '',
      } : {}),
      cardLabel: cardLink?.textContent?.trim() || '',
      cardIcon: getFederatedUrl(cardLink?.getAttribute('href') || ''),
    };
  };

  [...el.children].forEach((row) => {
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length === 1 && cols[0].querySelector('strong')) {
      breakpoint = cols[0].textContent.trim().toLowerCase();
      data[breakpoint] = [];
    } else if (breakpoint) {
      data[breakpoint].push(parseSlide(cols[0], cols[1]));
    }
  });

  return data;
};

const buildContent = (slide) => {
  const content = createTag('div', { class: 'rm-content' });

  content.append(createTag('p', { class: 'rm-eyebrow' }, slide.smallPrint));
  content.append(createTag('h1', { class: 'rm-title' }, slide.title));

  const body = createTag('div', { class: 'rm-body' });
  slide.description.forEach((text) => body.append(createTag('p', null, text)));
  content.append(body);

  const ctas = createTag('div', { class: 'rm-ctas' });
  if (slide.cta1Label) {
    ctas.append(createTag('a', {
      class: 'con-button rm-cta-primary',
      href: slide.cta1Link,
    }, slide.cta1Label));
  }
  if (slide.cta2Label) {
    ctas.append(createTag('a', {
      class: 'con-button',
      href: slide.cta2Link,
    }, slide.cta2Label));
  }
  content.append(ctas);

  return content;
};

const buildCard = (slide) => {
  const card = createTag('div', { class: 'rm-card' });

  card.append(createTag('img', { class: 'rm-card-icon', src: slide.cardIcon }));

  const content = createTag('div', { class: 'rm-card-content' });
  content.append(createTag('span', { class: 'rm-card-label' }, slide.cardLabel));
  content.append(createTag('span', { class: 'rm-card-chevron', 'aria-hidden': 'true' }, CHEVRON_SVG));
  card.append(content);

  return card;
};

export default function init(el) {
  const slidesData = getSlidesData(el);
  const slides = slidesData.desktop;
  if (!slides?.length) return;

  const activeSlide = slides[0];

  const bg = createTag('div', { class: 'rm-background' });
  bg.append(createTag('img', { src: activeSlide.backgroundImage, loading: 'eager' }));

  const overlay = createTag('div', { class: 'rm-overlay' });

  const fg = createTag('div', { class: 'rm-foreground' });
  fg.append(buildContent(activeSlide));

  const cards = createTag('div', { class: 'rm-cards' });
  slides.forEach((slide) => cards.append(buildCard(slide)));
  fg.append(cards);

  el.replaceChildren(bg, overlay, fg);
}
