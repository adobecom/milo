const ENDPOINT = 'https://14257-merchatscale-aupmock.adobeioruntime.net/api/v1/web/MerchAtScale/fragment?locale=en_US&api_key=unified_checkout_server_v3&template=headless&offer=';

const DEFAULT_PLANS = [
  ['M2M', 'Monthly', `${ENDPOINT}257E1D82082387D152029F93C1030624`],
  ['ABM', 'Annual, billed monthly', `${ENDPOINT}632B3ADD940A7FBB7864AA5AD19B8D28&mask=best-value`],
  ['PUF', 'Annual, prepaid', `${ENDPOINT}9E618D5A589EF8D6364DFBE02FC2C264`],
];

const DEFAULT_PLAN = 'ABM';
const VISIBLE_APPS = 5;

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

// elements priced with the card's own offer: inline prices and checkout CTAs
const OFFER_BOUND = '[data-template], .aup-checkout-cta';

const labelOf = (source) => SOURCES[source] ?? source;

// one labelled box per layer; `outline` (no fill) keeps colored elements (badge, CTA) readable
const overlays = (el, sources, { field, outline } = {}) => {
  el.classList.add('aup-sourced');
  if (field && !el.title) el.title = `${field}: ${sources.map(labelOf).join(' + ')}`;
  el.append(...sources.map((source, index) => tag('span', {
    class: `aup-overlay${outline ? ' aup-outline' : ''}`,
    'data-source': source,
    'data-label': labelOf(source).replace(' baseline', ''),
    style: `--aup-chip:${index}`,
  })));
};

// a baseline area priced with the fragment's offer gets nested fragment boxes on prices & CTAs
const sourced = (el, sources = [], options = {}) => {
  if (!el || !sources.length) return el;
  const mixed = sources.length > 1 && sources.includes('fragment');
  const bound = mixed ? [...el.querySelectorAll(OFFER_BOUND)] : [];
  overlays(el, bound.length ? sources.filter((source) => source !== 'fragment') : sources, options);
  for (const element of bound) overlays(element, ['fragment'], { field: 'price', outline: true });
  return el;
};

const badge = (b) => b?.text && tag('span', {
  class: 'aup-badge',
  style: `color:${b.color ?? 'inherit'};background:${b.backgroundColor ?? 'transparent'};border-color:${b.borderColor ?? 'transparent'}`,
}, b.text);

const header = (card) => tag('div', { class: 'aup-header' }, [
  ...(card.mnemonics ?? []).map(({ icon, alt, link }) => sourced(
    tag(link ? 'a' : 'span', { href: link, class: 'aup-mnemonic' }, tag('img', { src: icon, alt })),
    card.sources?.mnemonics,
    { field: 'mnemonics' },
  )),
  sourced(tag('h2', { class: 'aup-title' }, richText(card.title)), card.sources?.title, { field: 'title' }),
  sourced(badge(card.badge), card.sources?.badge, { field: 'badge', outline: true }),
]);

const iconItem = ({ icon, alt, name, description, tooltip }) => tag('li', { title: tooltip }, [
  icon && tag('img', { src: icon, alt, loading: 'lazy' }),
  tag('span', {}, name || richText(description ?? alt)),
]);

// a `whatsIncluded` section (e.g. the shared {{extras}} placeholder): title + rich text bullet list
const section = ({ icon, title, items }) => tag('div', { class: 'aup-section' }, [
  tag('h4', {}, [icon && tag('img', { src: icon, alt: '' }), richText(title)]),
  tag('ul', {}, items.map((item) => tag('li', {}, richText(item)))),
]);

// features are sourced per header & item: `includedApps.header`, `includedApps[2]`…
const featureColumns = (sources) => ({ id, header: title, items }) => {
  const item = (render) => (entry, index) => sourced(render(entry), sources[`${id}[${index}]`], { field: `${id}[${index}]` });
  if (id === 'includedApps') {
    const apps = items.map(item(iconItem));
    const more = apps.slice(VISIBLE_APPS);
    return tag('div', { class: 'aup-included', 'data-feature': id }, [
      sourced(
        tag('h4', {}, title ? richText(title) : 'Includes'),
        sources[`${id}.header`],
        { field: `${id}.header` },
      ),
      tag('ul', { class: 'aup-apps' }, apps.slice(0, VISIBLE_APPS)),
      more.length > 0 && tag('details', { class: 'aup-more-apps' }, [
        tag('summary', {}, `Show all ${items.length} apps`),
        tag('ul', { class: 'aup-apps' }, more),
      ]),
    ]);
  }
  const rendered = items.map((entry, i) => item(entry.items ? section : iconItem)(entry, i));
  const plain = rendered.filter((el, index) => !items[index].items);
  return [
    ...rendered.filter((el, index) => items[index].items),
    plain.length > 0 && tag('ul', { class: 'aup-section', 'data-feature': id }, plain),
  ];
};

const features = (card) => card.features?.length > 0
  && tag('div', { class: 'aup-features' }, card.features.flatMap(featureColumns(card.sources ?? {})));

// AUP layout: no banner, subtitle, short description nor callout on the product side
const details = (card) => tag('div', { class: 'aup-details' }, [
  header(card),
  sourced(
    tag('div', { class: 'aup-description' }, richText(card.description)),
    card.sources?.description,
    { field: 'description' },
  ),
  features(card),
]);

// the plan note (e.g. cancellation terms) is the card's promoText
const planOption = ({ code, label, card }, selected) => tag('label', { class: `aup-plan${selected ? ' selected' : ''}` }, [
  tag('input', { type: 'radio', name: 'aup-plan', value: code, checked: selected }),
  tag('div', { class: 'aup-plan-label' }, [tag('span', {}, label),
    sourced(badge(card.badge), card.sources?.badge, { field: 'badge', outline: true })]),
  sourced(tag('div', { class: 'aup-price' }, richText(card.price)), card.sources?.price, { field: 'price' }),
  card.promoText?.length > 0 && sourced(
    tag('div', { class: 'aup-plan-note' }, [richText(card.promoText), tag('span', { class: 'aup-info' }, 'i')]),
    card.sources?.promoText,
    { field: 'promoText' },
  ),
]);

const addon = (card, code) => {
  if (!card.addon) return null;
  const offer = card.addon.offers?.find(({ planType }) => planType === code);
  return sourced(tag('label', { class: 'aup-addon' }, [
    tag('input', { type: 'checkbox' }),
    tag('span', {}, `${card.addon.label}${offer?.price ? ` (${offer.price})` : ''}`),
  ]), card.sources?.addon, { field: 'addon' });
};

const checkout = (card, code) => tag('div', { class: 'aup-checkout' }, [
  addon(card, code),
  // AUP only shows the checkout CTA
  sourced(tag('div', { class: 'aup-ctas' }, (card.ctas ?? []).filter(({ isCheckout }) => isCheckout)
    .map(({ text, url }) => tag('a', { href: url, class: 'con-button blue aup-checkout-cta' }, text))), card.sources?.ctas, {
    field: 'ctas',
    outline: true,
  }),
  card.secureTransaction?.enabled && tag('p', { class: 'aup-secure' }, [
    tag('span', { class: 'aup-lock' }),
    card.secureTransaction.label,
  ]),
]);

const STUDIO = 'https://mas.adobe.com/studio.html#path=sandbox&';

// M@S Studio links to each piece of content the selected plan is built from
const studioLinks = ({ code, url, card }) => {
  const mask = new URL(url).searchParams.get('mask');
  const editor = (id) => id && `${STUDIO}page=fragment-editor&fragmentId=${id}`;
  const links = [
    [`${code} fragment`, editor(card.sourceIds.fragment)],
    ['Template baseline', editor(card.sourceIds.template)],
    ['Segment baseline', editor(card.sourceIds.segment)],
    ['Plan baseline', editor(card.sourceIds.plan)],
    ['Product', card.productArrangementCode
      && `${STUDIO}page=product-detail&arrangementCode=${card.productArrangementCode}`],
    [`${mask} mask`, mask && `${STUDIO}page=masks-editor&maskName=${mask}`],
    ['extras placeholder', `${STUDIO}page=placeholders&locale=en_US&search=extras`],
  ].filter(([, href]) => href);
  return tag('nav', { class: 'aup-studio' }, [
    tag('span', {}, 'Edit in M@S Studio:'),
    ...links.map(([label, href]) => tag('a', { href, target: '_blank' }, label)),
  ]);
};

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
    card.sourceIds = Object.fromEntries((card.sources ?? []).map(({ source, id }) => [source, id]));
    // sources lists the fields per layer: index it per field for the overlays
    card.sources = (card.sources ?? []).reduce((byField, { source, fields }) => {
      for (const field of fields) (byField[field] ??= []).push(source);
      return byField;
    }, {});
    return { code: code.toUpperCase(), label, url, card, status: response.status };
  }));
  const available = plans.filter(({ status }) => status === 200);
  if (!available.length) {
    el.replaceChildren(tag('p', { class: 'aup-error' }, 'No plan could be loaded.'));
    return el;
  }
  let selected = available.find(({ code }) => code === DEFAULT_PLAN)?.code ?? available[0].code;
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
    el.replaceChildren(legend(), studioLinks(current), tag('div', { class: 'aup-modal' }, [
      details(current.card),
      tag('div', { class: 'aup-plans' }, [
        tag('button', { type: 'button', class: 'aup-close', 'aria-label': 'Close' }, '✕'),
        tag('h3', {}, 'Choose a subscription'),
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
