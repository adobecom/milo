/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import {
  SHEET_URL, fetchGroups, fetchGroupTags, readSheet, reconcileSheet, saveSheet, refreshPreview,
} from './tag-manager-utils.js';

const ui = {
  group: document.querySelector('#tag-group'),
  controls: document.querySelector('#controls'),
  check: document.querySelector('#check-updates'),
  status: document.querySelector('#status'),
  retry: document.querySelector('#retry-connection'),
  review: document.querySelector('#review'),
  summary: document.querySelector('#review-summary'),
  remove: document.querySelector('#remove-missing'),
  missing: document.querySelector('#missing-note'),
  rows: document.querySelector('#change-rows'),
  save: document.querySelector('#save-changes'),
  preview: document.querySelector('#retry-preview'),
};
document.querySelector('#sheet-link').href = SHEET_URL;
let daFetch;
let review;
let plan;
let busy = false;

function setStatus(message, kind = 'info') {
  ui.status.dataset.kind = kind;
  ui.status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  ui.status.textContent = message;
}

function setBusy(value) {
  busy = value;
  ui.group.disabled = value || !daFetch;
  ui.check.disabled = value || !daFetch;
  ui.remove.disabled = value || !plan?.missing.length;
  ui.save.disabled = value || !plan
    || !(plan.added.length + plan.updated.length + plan.removed.length);
  ui.retry.disabled = value;
  ui.preview.disabled = value;
}

function clearReview() {
  review = null;
  plan = null;
  ui.review.hidden = true;
  ui.remove.checked = false;
  ui.save.disabled = true;
}

function appendChange(kind, tag) {
  const row = document.createElement('tr');
  row.dataset.kind = kind;
  const change = document.createElement('td');
  change.textContent = { add: 'Add', update: 'Update title', keep: 'Keep', remove: 'Remove' }[kind];
  const name = document.createElement('td');
  name.textContent = tag.name;
  const title = document.createElement('td');
  if (kind === 'update') {
    const previous = document.createElement('span');
    previous.className = 'previous-title';
    previous.textContent = tag.before;
    title.append(previous);
  }
  title.append(document.createTextNode(tag.title));
  row.append(change, name, title);
  ui.rows.append(row);
}

function renderReview() {
  plan = reconcileSheet(review.sheet, review.groupId, review.tags, ui.remove.checked);
  const count = plan.added.length + plan.updated.length + plan.removed.length;
  ui.summary.textContent = `${plan.added.length} new tags. ${plan.updated.length} title updates. ${plan.removed.length} removals.`;
  ui.missing.textContent = ui.remove.checked
    ? `${plan.removed.length} tags will be removed. This can affect pages that already use them.`
    : `${plan.missing.length} tags were not found in Chimera. They will be kept unless you choose to remove them.`;
  ui.rows.replaceChildren();
  plan.added.forEach((tag) => appendChange('add', tag));
  plan.updated.forEach((tag) => appendChange('update', tag));
  plan.missing.forEach((tag) => appendChange(ui.remove.checked ? 'remove' : 'keep', tag));
  ui.save.textContent = count ? `Save ${count} changes` : 'No changes to save';
  ui.review.hidden = false;
  setBusy(busy);
}

ui.group.addEventListener('change', () => {
  clearReview();
  setStatus('Check for updates to compare this group with your tag sheet.');
});
ui.remove.addEventListener('change', renderReview);
ui.controls.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  clearReview();
  ui.preview.hidden = true;
  setBusy(true);
  setStatus('Checking your sheet and the latest tags...');
  try {
    const groupId = ui.group.value;
    const [sheet, tags] = await Promise.all([readSheet(daFetch), fetchGroupTags(groupId)]);
    review = { sheet, tags, groupId };
    renderReview();
    setStatus('Review the proposed changes below. Nothing has been saved yet.');
  } catch (error) {
    clearReview();
    setStatus(error.message, 'error');
  } finally {
    setBusy(false);
  }
});

ui.save.addEventListener('click', async () => {
  if (busy || !review || ui.save.disabled) return;
  setBusy(true);
  setStatus('Creating a backup, saving the sheet and refreshing the browser preview...');
  try {
    const previewed = await saveSheet(daFetch, review.sheet, plan.sheet);
    ui.preview.hidden = previewed;
    setStatus(
      previewed
        ? 'Tag sheet saved and browser preview refreshed. Nothing was published live.'
        : 'Tag sheet saved. The browser preview could not be refreshed. You can retry it below.',
      previewed ? 'success' : 'warning',
    );
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    clearReview();
    setBusy(false);
  }
});

ui.preview.addEventListener('click', async () => {
  setBusy(true);
  setStatus('Refreshing the browser preview...');
  const previewed = await refreshPreview(daFetch);
  ui.preview.hidden = previewed;
  setStatus(
    previewed ? 'Browser preview refreshed. Nothing was published live.'
      : 'The sheet is saved, but the browser preview could not be refreshed. Please try again.',
    previewed ? 'success' : 'warning',
  );
  setBusy(false);
});

async function init() {
  setBusy(true);
  ui.retry.hidden = true;
  setStatus('Connecting to Document Authoring...');
  let timer;
  try {
    const connection = Promise.race([
      DA_SDK,
      new Promise((resolve) => { timer = setTimeout(() => resolve(null), 10000); }),
    ]);
    const [sdk, groups] = await Promise.all([connection, fetchGroups()]);
    if (!sdk?.context || typeof sdk.actions?.daFetch !== 'function') {
      throw new Error('Open Tag Manager as a Document Authoring app and sign in to access the tag sheet.');
    }
    daFetch = sdk.actions.daFetch;
    ui.group.replaceChildren(...groups.map(({ id, title }) => new Option(title, id)));
    if (groups.some(({ id }) => id === 'caas:blog-author')) ui.group.value = 'caas:blog-author';
    setStatus('Choose a group, then check for updates. Nothing changes until you save.');
  } catch (error) {
    daFetch = null;
    ui.retry.hidden = false;
    setStatus(error.message, 'error');
  } finally {
    clearTimeout(timer);
    setBusy(false);
  }
}

ui.retry.addEventListener('click', init);
init();
