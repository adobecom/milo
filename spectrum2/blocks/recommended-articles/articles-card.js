export const CARD = Object.freeze({
  list: 'recommended-articles-cards',
  card: 'recommended-articles-card',
  fallback: 'recommended-articles-card-fallback',
  media: 'recommended-articles-card-media',
  well: 'recommended-articles-card-well',
  body: 'recommended-articles-card-body',
  category: 'recommended-articles-card-category',
  title: 'recommended-articles-card-title',
  link: 'recommended-articles-card-link',
  description: 'recommended-articles-card-description',
  date: 'recommended-articles-card-date',
  source: 'recommended-articles-card-source',
});

const SRCSET_URL = /^\s*(\S+)(.*)$/;

export const cleanText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

export function absolutizePicture(picture, base) {
  const abs = (u) => {
    try {
      return new URL(u, base).href;
    } catch (e) {
      return u;
    }
  };
  picture.querySelectorAll('source[srcset], img[srcset]').forEach((node) => {
    const next = node.getAttribute('srcset').split(',').map((part) => {
      const m = part.match(SRCSET_URL);
      return m ? `${abs(m[1])}${m[2]}` : part;
    }).join(',');
    node.setAttribute('srcset', next);
  });
  picture.querySelectorAll('img[src]').forEach((img) => img.setAttribute('src', abs(img.getAttribute('src'))));
  return picture;
}

export function indexPicture(make, src, base) {
  let url;
  try {
    url = new URL(src, base);
  } catch (e) {
    return null;
  }
  const { pathname, origin } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
  const at = `${origin}${pathname}`;
  const source = make('source', { type: 'image/webp', srcset: `${at}?width=750&format=webply&optimize=medium` });
  const img = make('img', { src: `${at}?width=750&format=${ext}&optimize=medium`, loading: 'lazy', alt: '' });
  return make('picture', null, [source, img]);
}

function decorative(picture) {
  picture.querySelectorAll('img').forEach((img) => {
    img.setAttribute('alt', '');
    img.setAttribute('loading', 'lazy');
  });
  return picture;
}

export function buildCard(make, d) {
  const card = make('div', { class: d.fallback ? `${CARD.card} ${CARD.fallback}` : CARD.card, role: 'listitem' });
  if (d.picture) {
    card.append(make('div', { class: CARD.media }, decorative(d.picture)));
  } else if (d.well) {
    card.append(make('div', { class: `${CARD.media} ${CARD.well}`, 'aria-hidden': 'true' }));
  }
  const body = make('div', { class: CARD.body });
  const category = d.category ? cleanText(d.category.text) : '';
  if (category) {
    const inner = d.category.href ? make('a', { href: d.category.href }, category) : category;
    body.append(make('p', { class: CARD.category }, inner));
  }
  const link = make('a', { class: CARD.link, href: d.href }, d.title);
  body.append(make('h3', { class: CARD.title }, link));
  if (d.description) body.append(make('p', { class: CARD.description }, d.description));
  if (d.date?.text) {
    body.append(make('p', { class: CARD.date }, make('time', { datetime: d.date.iso || null }, d.date.text)));
  }
  if (d.source && d.source !== d.title) body.append(make('p', { class: CARD.source }, d.source));
  card.append(body);
  return card;
}

export function buildList(make, label) {
  return make('div', { class: CARD.list, role: 'list', 'aria-label': label || null });
}
