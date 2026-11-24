const ENDPOINT = 'https://14257-merchatscale-aupmock.adobeioruntime.net/api/v1/web/MerchAtScale/fragment?locale=en_US&api_key=unified_checkout_server_v3&template=headless&offer=';

const DEFAULT_PLANS = [
  ['ABM', 'Annual, billed monthly', `${ENDPOINT}632B3ADD940A7FBB7864AA5AD19B8D28&mask=best-value`],
  ['PUF', 'Annual, prepaid', `${ENDPOINT}9E618D5A589EF8D6364DFBE02FC2C264`],
  ['M2M', 'Monthly', `${ENDPOINT}257E1D82082387D152029F93C1030624`],
];

const TAGS = {
  paragraph: 'p',
  link: 'a',
  bold: 'strong',
  italic: 'em',
  'unordered-list': 'ul',
  'ordered-list': 'ol',
  'list-item': 'li',
};

// text-safe createTag: children are appended as nodes or text, never parsed as HTML
const tag = (name, attributes = {}, children = []) => {
  const el = document.createElement(name);
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== false) {
      el.setAttribute(key, value === true ? '' : value);
    }
  }
  el.append(...[children].flat().filter((child) => child != null && child !== false));
  return el;
};

const richText = (nodes = []) => {
  const fragment = document.createDocumentFragment();
  for (const node of [nodes ?? []].flat()) {
    if (typeof node === 'string') {
      fragment.append(node);
    } else if (node.nodeType === 'text') {
      fragment.append(node.value);
    } else {
      const { data = {} } = node;
      const el = tag(TAGS[node.nodeType] ?? 'span', {
        class: data.class,
        'data-template': data.template,
        href: data.href,
        target: data.target,
      }, [node.value ?? '', richText(node.content)]);
      fragment.append(el);
    }
  }
  return fragment;
};

const SOURCES = {
  product: 'Product baseline',
  template: 'Template baseline',
  segment: 'Segment baseline',
  plan: 'Plan baseline',
  fragment: 'Fragment',
  mask: 'Mask',
};

// one translucent band per layer an area comes from, shown when that layer's box is checked
const sourced = (el, sources = []) => {
  if (!el) return el;
  el.classList.add('aup-sourced');
  el.append(...sources.map((source, index) => tag('span', {
    class: 'aup-overlay',
    'data-source': source,
    title: SOURCES[source] ?? source,
    style: `left:${(100 * index) / sources.length}%;width:${100 / sources.length}%`,
  })));
  return el;
};

const badge = (b) => b?.text && tag('span', {
  class: 'aup-badge',
  style: `color:${b.color ?? 'inherit'};background:${b.backgroundColor ?? 'transparent'};border-color:${b.borderColor ?? 'transparent'}`,
}, b.text);

const header = (card) => sourced(tag('div', {
  class: 'aup-header',
  style: card.backgroundImage?.src && `background-image:url(${card.backgroundImage.src})`,
}, (card.mnemonics ?? []).map(({ icon, alt, link }) => sourced(
  tag(link ? 'a' : 'span', { href: link, class: 'aup-mnemonic' }, tag('img', { src: icon, alt })),
  card.sources?.mnemonics,
))), card.sources?.backgroundImage);

const iconItem = ({ icon, alt, name, description, tooltip }) => tag('li', { title: tooltip }, [
  icon && tag('img', { src: icon, alt, loading: 'lazy' }),
  tag('span', {}, name || richText(description ?? alt)),
]);

// a `whatsIncluded` section (e.g. the shared {{extras}} placeholder): title + rich text bullet list
const section = ({ icon, title, items }) => tag('div', { class: 'aup-section' }, [
  tag('h4', {}, [icon && tag('img', { src: icon, alt: '' }), richText(title)]),
  tag('ul', {}, items.map((item) => tag('li', {}, richText(item)))),
]);

const featureColumns = ({ id, header: title, items }) => {
  if (id === 'includedApps') {
    return tag('div', { class: 'aup-included', 'data-feature': id }, [
      title && tag('h4', {}, richText(title)),
      tag('ul', { class: 'aup-apps' }, items.map(iconItem)),
    ]);
  }
  const plain = items.filter(({ items: sub }) => !sub);
  return [
    ...items.filter(({ items: sub }) => sub).map(section),
    plain.length > 0 && tag('ul', { class: 'aup-section', 'data-feature': id }, plain.map(iconItem)),
  ];
};

const features = (card) => card.features?.length > 0
  && sourced(tag('div', { class: 'aup-features' }, card.features.flatMap(featureColumns)), card.sources?.features);

const details = (card) => {
  const { sources = {} } = card;
  return tag('div', { class: 'aup-details' }, [
    header(card),
    tag('div', { class: 'aup-body' }, [
      sourced(badge(card.badge), sources.badge),
      sourced(tag('h2', { class: 'aup-title' }, richText(card.title)), sources.title),
      card.subtitle && sourced(tag('p', { class: 'aup-subtitle' }, card.subtitle), sources.subtitle),
      sourced(tag('div', { class: 'aup-description' }, richText(card.description)), sources.description),
      sourced(tag('div', { class: 'aup-short-description' }, richText(card.shortDescription)), sources.shortDescription),
      card.callout && sourced(tag('div', { class: 'aup-callout' }, richText(card.callout)), sources.callout),
      features(card),
    ]),
  ]);
};

const planOption = ({ code, label, card }, selected) => tag('label', { class: `aup-plan${selected ? ' selected' : ''}` }, [
  tag('input', { type: 'radio', name: 'aup-plan', value: code, checked: selected }),
  tag('div', { class: 'aup-plan-info' }, [
    tag('div', { class: 'aup-plan-label' }, [tag('span', {}, label), sourced(badge(card.badge), card.sources?.badge)]),
    sourced(tag('div', { class: 'aup-price' }, richText(card.price)), card.sources?.price),
    card.promoText?.length > 0 && sourced(tag('div', { class: 'aup-promo' }, richText(card.promoText)), card.sources?.promoText),
  ]),
]);

const addon = (card, code) => {
  if (!card.addon) return null;
  const offer = card.addon.offers?.find(({ planType }) => planType === code);
  return sourced(tag('label', { class: 'aup-addon' }, [
    tag('input', { type: 'checkbox' }),
    tag('span', {}, `${card.addon.label}${offer?.price ? ` (${offer.price})` : ''}`),
  ]), card.sources?.addon);
};

const checkout = (card, code) => tag('div', { class: 'aup-checkout' }, [
  addon(card, code),
  sourced(tag('div', { class: 'aup-ctas' }, (card.ctas ?? []).map(({ text, url, variant, style }) => tag(
    'a',
    { href: url, class: `con-button${variant === 'accent' ? ' blue' : ''}${style === 'outline' ? ' outline' : ''}` },
    text,
  ))), card.sources?.ctas),
  card.secureTransaction?.enabled && tag('p', { class: 'aup-secure' }, card.secureTransaction.label),
  ...(card.customFields ?? []).map(({ label, value }) => sourced(tag(
    'div',
    { class: 'aup-custom', 'data-label': label },
    richText(value),
  ), card.sources?.customFields)),
]);

const authoredPlans = (el) => [...el.querySelectorAll(':scope > div')]
  .map((row) => [...row.children].map((cell) => cell.querySelector('a')?.href ?? cell.textContent.trim()))
  .filter((cells) => cells.length >= 3);

export default async function init(el) {
  const rows = authoredPlans(el);
  const sources = rows.length ? rows : DEFAULT_PLANS;
  const plans = await Promise.all(sources.map(async ([code, label, url]) => {
    const response = await fetch(url);
    const json = await response.json();
    const card = json.cards?.[0] ?? json;
    return { code: code.toUpperCase(), label, url, card, status: response.status };
  }));
  const available = plans.filter(({ status }) => status === 200);
  if (!available.length) {
    el.replaceChildren(tag('p', { class: 'aup-error' }, 'No plan could be loaded.'));
    return el;
  }
  let selected = available[0].code;
  const areaSources = available.flatMap(({ card }) => Object.values(card.sources ?? {}));
  const present = new Set(areaSources.flat());
  const legend = () => tag('fieldset', { class: 'aup-legend' }, [
    tag('legend', {}, 'Show where content comes from'),
    ...Object.entries(SOURCES).filter(([key]) => present.has(key)).map(([source, label]) => tag(
      'label',
      { 'data-source': source },
      [tag('input', {
        type: 'checkbox',
        name: 'aup-source',
        value: source,
        checked: el.classList.contains(`aup-show-${source}`),
      }), tag('span', {}, label)],
    )),
  ]);
  const render = () => {
    const current = available.find(({ code }) => code === selected);
    el.replaceChildren(legend(), tag('div', { class: 'aup-modal' }, [
      details(current.card),
      tag('div', { class: 'aup-plans' }, [
        tag('h3', {}, 'Choose a plan'),
        ...available.map((plan) => planOption(plan, plan.code === selected)),
        checkout(current.card, selected),
        tag('a', { class: 'aup-source', href: current.url, target: '_blank' }, `${current.code} source call`),
      ]),
    ]));
  };
  el.addEventListener('change', ({ target }) => {
    if (target.name === 'aup-source') {
      el.classList.toggle(`aup-show-${target.value}`, target.checked);
      return;
    }
    if (target.name !== 'aup-plan') return;
    selected = target.value;
    render();
  });
  render();
  return el;
}
