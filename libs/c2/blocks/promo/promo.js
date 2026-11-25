import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';
import createCountdown, { parseRange } from '../../utils/countdown.js';

const TEXT_CONFIG = { heading: '4', body: 'md' };
const COUNTDOWN_KEY = 'countdown';
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

function addTimer(content, state) {
  let callout = content.querySelector('.promo-callout');
  if (!callout) callout = createTag('div', { class: 'promo-callout' }, null, { parent: content });
  state.countdown ??= createCountdown(state.range);
  const timer = state.countdown.createTimer('promo-timer heading-6');
  const actions = [timer, callout.querySelector('.action-area')].filter(Boolean);
  createTag('div', { class: 'promo-actions' }, actions, { parent: callout });
}

function decorate(block, state) {
  const contentRows = [...block.children].filter((row) => {
    const [key, value] = row.children;
    if (!value || key.textContent.trim().toLowerCase() !== COUNTDOWN_KEY) return true;
    state.range ??= parseRange(value.textContent);
    if (!state.range) {
      window.lana?.log(`Invalid promo countdown: ${value.textContent.trim()}`, { tags: 'promo', severity: 'warning' });
    }
    return false;
  });

  const [main, live] = contentRows.map(decorateContent);
  const card = createTag('div', { class: 'promo-card' });
  if (main) card.append(main);
  if (main && state.range) addTimer(main, state);
  if (live && state.range) {
    live.classList.add('live');
    card.append(live);
    state.hasLive = true;
  }
  block.replaceChildren(card);
}

export default function init(el) {
  const state = { range: null, countdown: null, hasLive: false };
  decorateViewportContent(el, (block) => decorate(block, state));
  state.countdown?.start((status) => {
    el.classList.toggle('has-timer', status === 'running');
    el.classList.toggle('is-live', status === 'ended' && state.hasLive);
  });
}
