import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const TEXT_CONFIG = { heading: '4', body: 'md' };
let idCount = 0;

const nextId = (prefix) => {
  idCount += 1;
  return `${prefix}-${idCount}`;
};

function decorateHeading(heading, nodesBefore) {
  heading.id = nextId('promo-heading');
  const picture = heading.querySelector('picture')
    ?? nodesBefore.map((node) => (node.matches('picture') ? node : node.querySelector('picture')))
      .find(Boolean);
  if (!picture) return;
  const holder = picture.parentElement;
  // The space keeps the logo alt and heading text as separate words in the accessible name
  heading.prepend(createTag('span', { class: 'promo-logo' }, picture), ' ');
  const isEmpty = !holder.textContent.trim() && !holder.children.length;
  if (isEmpty && !heading.contains(holder)) holder.remove();
}

function decorateCtas(callout, heading) {
  if (!heading) return;
  callout.querySelectorAll('a').forEach((link) => {
    // Label from the visible text span so automated-aria's aria-label can't leak into the name
    const text = createTag('span', { id: nextId('promo-cta') }, [...link.childNodes]);
    link.append(text);
    link.setAttribute('aria-labelledby', `${text.id} ${heading.id}`);
  });
}

function decorateContent(row) {
  decorateBlockText(row, TEXT_CONFIG);
  const nodes = [...row.children].flatMap((cell) => [...cell.children]);
  const headingIndex = nodes.findIndex((node) => /^H[1-6]$/.test(node.nodeName));
  const heading = nodes[headingIndex];
  const content = createTag('div', { class: 'promo-content' });
  const callout = createTag('div', { class: 'promo-callout' });

  if (heading) {
    const nodesBefore = nodes.slice(0, headingIndex);
    decorateHeading(heading, nodesBefore);
    const headingGroup = createTag('div', { class: 'promo-heading-group' });
    headingGroup.append(...nodesBefore.filter((node) => node.isConnected), heading);
    content.append(headingGroup);
  }
  callout.append(...nodes.slice(headingIndex + 1));
  decorateCtas(callout, heading);
  if (callout.children.length) content.append(callout);
  return content;
}

function getActions(content) {
  let callout = content.querySelector('.promo-callout');
  if (!callout) callout = createTag('div', { class: 'promo-callout' }, null, { parent: content });
  let actions = callout.querySelector('.promo-actions');
  if (!actions) {
    const actionArea = [callout.querySelector('.action-area')].filter(Boolean);
    actions = createTag('div', { class: 'promo-actions' }, actionArea, { parent: callout });
  }
  return actions;
}

function decorate(block, state) {
  const [main, live] = [...block.children].map(decorateContent);
  const card = createTag('div', { class: 'promo-card' });
  if (main) card.append(main);
  live?.classList.add('live');
  state.views.push({ card, main, live });
  block.replaceChildren(card);
}

// The C1 countdown timer (same date sources, parsing and placeholders) in its opt-in C2 mode.
// Without dates it reads the MEP promo schedule, then the countdown-timer page metadata.
async function startCountdown(el, state, dates) {
  state.run += 1;
  const { run } = state;
  const views = state.views.filter(({ main }) => main);
  const hasLive = views.some(({ live }) => live);
  const onStatus = (status) => {
    if (run !== state.run) return;
    el.classList.toggle('has-timer', status === 'running');
    el.classList.toggle('is-live', status === 'ended' && hasLive);
  };
  try {
    const { default: initCDT } = await import('../../../features/cdt/cdt.js');
    const options = { c2: true, className: 'promo-timer heading-6', onStatus };
    const timers = await Promise.all(views.map(async ({ main }) => {
      const actions = getActions(main);
      const timer = await initCDT(actions, el.classList, dates, options);
      actions.prepend(timer);
      return timer;
    }));
    // A newer start (e.g. MAS dates) won the race; removing the timers also stops them
    if (run !== state.run) {
      timers.forEach((timer) => timer.remove());
      return;
    }
    state.timers.forEach((timer) => timer.remove());
    state.timers = timers;
    views.forEach(({ card, live }) => live && card.append(live));
  } catch (error) {
    window.lana?.log(`Invalid promo countdown: ${error}`, { tags: 'promo', severity: 'warning' });
  }
}

// On C2 pages merch.js sends a MAS fragment's cdtStart/cdtEnd as `milo:mas-countdown`
// instead of adding the C1 timer; these dates win over page sources.
function watchMasCountdown(el, state) {
  el.addEventListener('milo:mas-countdown', ({ detail: { dates } }) => {
    if (dates === state.masDates) return;
    state.masDates = dates;
    startCountdown(el, state, dates);
  });
}

export default async function init(el) {
  const state = { views: [], timers: [], run: 0, masDates: null };
  decorateViewportContent(el, (block) => decorate(block, state));
  watchMasCountdown(el, state);
  if (el.classList.contains('countdown-timer') && !state.masDates) await startCountdown(el, state);
}
