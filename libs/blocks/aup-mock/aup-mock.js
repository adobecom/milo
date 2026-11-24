const ENDPOINT = 'https://14257-merchatscale-aupmock.adobeioruntime.net/api/v1/web/MerchAtScale/fragment?locale=en_US&api_key=unified_checkout_server_v3&template=headless&offer=';

const DEFAULT_PLANS = [
  ['ABM', 'Annual, billed monthly', `${ENDPOINT}632B3ADD940A7FBB7864AA5AD19B8D28`],
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

const badge = (b, className = 'aup-badge') => b?.text && tag('span', {
  class: className,
  style: `color:${b.color ?? 'inherit'};background:${b.backgroundColor ?? 'transparent'};border-color:${b.borderColor ?? 'transparent'}`,
}, b.text);

const header = (card) => tag('div', {
  class: 'aup-header',
  style: card.backgroundImage?.src && `background-image:url(${card.backgroundImage.src})`,
}, (card.mnemonics ?? []).map(({ icon, alt, link }) => {
  const img = tag('img', { src: icon, alt, class: 'aup-mnemonic' });
  return link ? tag('a', { href: link }, img) : img;
}));

const features = (card) => (card.features ?? []).map(({ id, items }) => tag(
  'ul',
  { class: 'aup-features', 'data-feature': id },
  items.map(({ icon, alt, name, tooltip }) => tag('li', { title: tooltip }, [
    tag('img', { src: icon, alt, loading: 'lazy' }),
    tag('span', {}, name || alt),
  ])),
));

const details = (card) => tag('div', { class: 'aup-details' }, [
  header(card),
  tag('div', { class: 'aup-body' }, [
    tag('div', { class: 'aup-badges' }, [badge(card.badge), badge(card.trialBadge, 'aup-trial-badge')]),
    tag('h2', { class: 'aup-title' }, richText(card.title)),
    card.subtitle && tag('p', { class: 'aup-subtitle' }, card.subtitle),
    tag('div', { class: 'aup-description' }, richText(card.description)),
    tag('div', { class: 'aup-short-description' }, richText(card.shortDescription)),
    card.callout && tag('div', { class: 'aup-callout' }, richText(card.callout)),
    ...features(card),
  ]),
]);

const planOption = ({ code, label, card }, selected) => tag('label', { class: `aup-plan${selected ? ' selected' : ''}` }, [
  tag('input', { type: 'radio', name: 'aup-plan', value: code, checked: selected }),
  tag('div', { class: 'aup-plan-info' }, [
    tag('div', { class: 'aup-plan-label' }, [tag('span', {}, label), badge(card.badge)]),
    tag('div', { class: 'aup-price' }, richText(card.price)),
    tag('div', { class: 'aup-promo' }, richText(card.promoText)),
  ]),
]);

const addon = (card, code) => {
  if (!card.addon) return null;
  const offer = card.addon.offers?.find(({ planType }) => planType === code);
  return tag('label', { class: 'aup-addon' }, [
    tag('input', { type: 'checkbox' }),
    tag('span', {}, `${card.addon.label}${offer?.price ? ` (${offer.price})` : ''}`),
  ]);
};

const quantity = ({ quantitySelect: q }) => q && tag('label', { class: 'aup-quantity' }, [
  q.title,
  tag('select', {}, Array.from({ length: Math.floor((q.max - q.min) / q.step) + 1 }, (_, i) => {
    const value = q.min + i * q.step;
    return tag('option', { selected: value === q.default }, `${value}`);
  })),
]);

const checkout = (card, code) => tag('div', { class: 'aup-checkout' }, [
  addon(card, code),
  quantity(card),
  tag('div', { class: 'aup-ctas' }, (card.ctas ?? []).map(({ text, url, variant, style }) => tag(
    'a',
    { href: url, class: `con-button${variant === 'accent' ? ' blue' : ''}${style === 'outline' ? ' outline' : ''}` },
    text,
  ))),
  card.secureTransaction?.enabled && tag('p', { class: 'aup-secure' }, card.secureTransaction.label),
  ...(card.customFields ?? []).map(({ label, value }) => tag(
    'div',
    { class: 'aup-custom', 'data-label': label },
    richText(value),
  )),
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
  const render = () => {
    const current = available.find(({ code }) => code === selected);
    el.replaceChildren(tag('div', { class: 'aup-modal' }, [
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
    if (target.name !== 'aup-plan') return;
    selected = target.value;
    render();
  });
  render();
  return el;
}
