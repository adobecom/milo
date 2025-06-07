import { getFederatedContentRoot } from '../../utils/utils.js';

// Utilities
let config;
let createTag;
let getMetadata;
let loadBlock;
let loadStyle;

// Helpers to access JSON
const getValue = (arr, key) => arr?.data?.find((row) => row.key === key)?.value || '';

function fragment(children) {
  const frag = document.createDocumentFragment();
  children.forEach(child => frag.appendChild(child));
  return frag;
}

// Accordion
function createAccordion(accordion) {
  const accWrap = createTag('div', { class: 'privacy-modal-accordion' });
  accordion.data.forEach((section) => {
    const item = createTag('div', { class: 'privacy-modal-accordion-item' });
    const header = createTag('button', { class: 'privacy-modal-accordion-header', type: 'button' }, section.heading);
    const body = createTag('div', { class: 'privacy-modal-accordion-body' }, section.description);
    header.onclick = () => item.classList.toggle('open');
    item.append(header, body);
    accWrap.appendChild(item);
  });
  return accWrap;
}

// If enabled/disabled info
function createEnableInfo({ data = [] }) {
  const infoWrap = createTag('div', { class: 'privacy-modal-enableinfo' });
  const ei = data[0];
  if (!ei) return infoWrap;

  const makeList = (bullets) => (bullets ? bullets.split('\n').map((b) => createTag('li', null, b)) : [createTag('li', null, 'No bullets found!')]);

  const enabled = createTag('div', { class: 'privacy-modal-enabled' }, [
    createTag('h4', null, ei.enabled_heading),
    createTag('ul', null, fragment(makeList(ei.enabled_bullets))),
  ]);

  const disabled = createTag('div', { class: 'privacy-modal-disabled' }, [
    createTag('h4', null, ei.disabled_heading),
    createTag('ul', null, fragment(makeList(ei.disabled_bullets))),
  ]);

  infoWrap.append(enabled, disabled);
  return infoWrap;
}

// Cookie groups with toggles
function createCookieGroups(cookiegroups) {
  const groupsWrap = createTag('div', { class: 'privacy-modal-cookiegroups' });
  cookiegroups.data.forEach((group, i) => {
    const groupDiv = createTag('div', { class: 'privacy-modal-cookiegroup' });
    const groupHeader = createTag('div', { class: 'privacy-modal-cookiegroup-header' });
    groupHeader.append(
      createTag('span', { class: 'privacy-modal-cookiegroup-title' }, group.group_heading),
      group.always_active === 'true'
        ? createTag('span', { class: 'privacy-modal-cookiegroup-always' }, 'Always active', createTag('input', { type: 'checkbox', checked: true, disabled: true }))
        : createTag('input', {
          type: 'checkbox',
          checked: group.default_checked === 'true',
          'aria-label': group.group_heading,
        }),
    );
    const desc = createTag('div', { class: 'privacy-modal-cookiegroup-desc' }, group.group_description);
    const link = createTag('a', {
      class: 'privacy-modal-cookiegroup-link',
      href: group.details_link_u,
      target: '_blank',
      rel: 'noopener noreferrer',
    }, group.details_link_text);
    groupDiv.append(groupHeader, desc, link);
    groupsWrap.appendChild(groupDiv);
  });
  return groupsWrap;
}

// Actions (buttons)
function createActions(actions) {
  const actionsDiv = createTag('div', { class: 'privacy-modal-actions' });
  actions.data.forEach((action) => {
    const btn = createTag('button', {
      class: `privacy-modal-action${action.primary === 'true' ? ' primary' : ''}`,
      'data-action': action.action,
      type: 'button',
    }, action.label);
    actionsDiv.appendChild(btn);
  });
  return actionsDiv;
}

// Main content
function buildModalContent(json) {
  const { privacy, enableinfo, accordion, actions, cookiegroups } = json;
  const wrap = createTag('div', { class: 'privacy-modal-content', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'privacy-modal-title' });

  wrap.append(
    createActions(actions),
    createTag('h2', { id: 'privacy-modal-title' }, getValue(privacy, 'modal_title')),
    createTag('h3', null, getValue(privacy, 'main_heading')),
    createAccordion(accordion),
    createEnableInfo(enableinfo),
    createCookieGroups(cookiegroups),
  );
  return wrap;
}

// Fetch JSON, fallback logic
async function fetchPrivacyJson() {
  const root = config.contentRoot ?? getFederatedContentRoot();
  const url1 = `${root}/privacy/privacy.json`;
  const url2 = 'https://stage--federal--adobecom.aem.page/federal/dev/snehal/privacy/privacy-modal.json';
  let resp = await fetch(url1, { cache: 'no-cache' });
  if (resp.ok) return resp.json();
  resp = await fetch(url2, { cache: 'no-cache' });
  if (resp.ok) return resp.json();
  throw new Error('Privacy JSON not found');
}

// Export main function for loading modal
export default async function loadPrivacyModal(
  conf, createTagFunc, getMetadataFunc, loadBlockFunc, loadStyleFunc
) {
  config = conf;
  createTag = createTagFunc;
  getMetadata = getMetadataFunc;
  loadBlock = loadBlockFunc;
  loadStyle = loadStyleFunc;

  if (document.querySelector('.privacy-modal-backdrop')) return;
  loadStyle(`${config.miloLibs || config.codeRoot}/features/privacy-modal/privacy-modal.css`);
  const { getModal } = await import('../../blocks/modal/modal.js');
  let privacyJson;
  try {
    privacyJson = await fetchPrivacyJson();
  } catch (e) { return; }

  const content = buildModalContent(privacyJson);

  getModal(null, {
    class: 'privacy-modal-v2',
    id: 'privacy-modal-v2',
    content,
    closeEvent: 'closePrivacyModal'
  });

  content.querySelectorAll('.privacy-modal-action').forEach((btn) => {
    btn.onclick = () => {
      document.querySelector('#privacy-modal-v2')?.remove();
      document.querySelector('.modal-curtain')?.remove();
      document.body.classList.remove('disable-scroll');
    };
  });
}
