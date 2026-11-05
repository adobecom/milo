const SHEET_PATH = '/adobecom/milo/drafts/bmarshal/tags.json';
const SHEET_TAB = 'CaaS tags';
const CHIMERA_URL = 'https://www.adobe.com/chimera-api/tags';
export const SOURCE_URL = `https://admin.da.live/source${SHEET_PATH}`;
export const SHEET_URL = `https://da.live/sheet#${SHEET_PATH.replace(/\.json$/, '')}`;
export const PREVIEW_URL = 'https://admin.hlx.page/preview/adobecom/milo/main/drafts/bmarshal/tags.json';

async function fetchChimera(groupId) {
  const url = new URL(CHIMERA_URL);
  url.searchParams.set('v', '1');
  if (groupId) url.searchParams.set('include', groupId);
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    throw new Error("Could not load Adobe's tag library. Open this tool from a Milo preview or milo.adobe.com and try again.");
  }
}

function getGroups(json) {
  const groups = json?.namespaces?.caas?.tags;
  if (!groups || typeof groups !== 'object' || Array.isArray(groups)) {
    throw new Error("Adobe's tag library did not return CaaS groups. Please try again.");
  }
  return Object.values(groups);
}

export async function fetchGroups() {
  const groups = getGroups(await fetchChimera());
  if (!groups.length || groups.some((group) => typeof group?.tagID !== 'string'
    || !group.tagID.startsWith('caas:')
    || typeof group.title !== 'string' || !group.title.trim())) {
    throw new Error("Adobe's tag library returned an incomplete group list. Please try again.");
  }
  return groups.map(({ tagID, title }) => ({ id: tagID, title }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function fetchGroupTags(groupId) {
  const group = getGroups(await fetchChimera(groupId)).find((item) => item?.tagID === groupId);
  if (!group || !group.tags || typeof group.tags !== 'object' || Array.isArray(group.tags)) {
    throw new Error('This tag group could not be read. Please check for updates again.');
  }
  const tags = new Map();
  const visit = (tag) => {
    if (typeof tag?.tagID !== 'string' || !tag.tagID.startsWith(`${groupId}/`)
      || typeof tag.title !== 'string' || !tag.title.trim()
      || (tag.tags && (typeof tag.tags !== 'object' || Array.isArray(tag.tags)))) {
      throw new Error('This tag group contains incomplete tags. No changes have been saved.');
    }
    if (tags.has(tag.tagID) && tags.get(tag.tagID).title !== tag.title) {
      throw new Error('This tag group contains conflicting titles. No changes have been saved.');
    }
    tags.set(tag.tagID, { name: tag.tagID, title: tag.title });
    Object.values(tag.tags || {}).forEach(visit);
  };
  Object.values(group.tags).forEach(visit);
  return [...tags.values()];
}

function getSheetTab(sheet) {
  const tab = sheet?.[SHEET_TAB];
  if (!Array.isArray(tab?.data) || tab.data.some((row) => typeof row?.name !== 'string'
    || typeof row.title !== 'string')) {
    throw new Error('The CaaS tags sheet needs a name and a title for every row. Please open the sheet to check it.');
  }
  if (Number(tab.offset || 0) !== 0 || tab.total > tab.data.length) {
    throw new Error('Only part of the tag sheet was returned. No changes can be saved safely.');
  }
  return tab;
}

async function requestDa(daFetch, url, options, message) {
  let response;
  try {
    response = await daFetch(url, options);
  } catch {
    throw new Error(message);
  }
  if (response.status === 401) {
    throw new Error('Your sign-in expired. Please reopen this tool from Document Authoring.');
  }
  if (response.status === 403) throw new Error('You do not have access to change this tag sheet.');
  if (!response.ok) throw new Error(message);
  return response;
}

export async function readSheet(daFetch) {
  const response = await requestDa(
    daFetch,
    SOURCE_URL,
    { cache: 'no-store' },
    'Could not load the tag sheet. Please try again.',
  );
  const sheet = await response.json().catch(() => {
    throw new Error('The tag sheet could not be read. Please open the sheet to check it.');
  });
  getSheetTab(sheet);
  return sheet;
}

export function reconcileSheet(sheet, groupId, tags, removeMissing = false) {
  getSheetTab(sheet);
  const incoming = new Map();
  tags.forEach(({ name, title }) => {
    if (typeof name !== 'string' || !name.startsWith(`${groupId}/`)
      || typeof title !== 'string' || !title.trim()) {
      throw new Error('The new tags do not belong to this group. Please check for updates again.');
    }
    incoming.set(name, { name, title });
  });
  const result = JSON.parse(JSON.stringify(sheet));
  const seen = new Set();
  const added = [];
  const updated = [];
  const missing = [];
  const rows = result[SHEET_TAB].data.flatMap((row) => {
    if (!row.name.startsWith(`${groupId}/`)) return [row];
    const tag = incoming.get(row.name);
    if (!tag) {
      missing.push(row);
      return removeMissing ? [] : [row];
    }
    seen.add(row.name);
    if (row.title !== tag.title) updated.push({ ...tag, before: row.title });
    return [{ ...row, title: tag.title }];
  });
  incoming.forEach((tag) => {
    if (seen.has(tag.name)) return;
    added.push(tag);
    rows.push({ ...tag });
  });
  Object.assign(
    result[SHEET_TAB],
    { data: rows, total: rows.length, limit: rows.length, offset: 0 },
  );
  return { sheet: result, added, updated, missing, removed: removeMissing ? missing : [] };
}

export async function refreshPreview(daFetch) {
  try {
    return (await daFetch(PREVIEW_URL, { method: 'POST' })).ok;
  } catch {
    return false;
  }
}

export async function saveSheet(daFetch, baseline, next) {
  getSheetTab(next);
  const latest = await readSheet(daFetch);
  if (JSON.stringify(latest) !== JSON.stringify(baseline)) {
    throw new Error('The sheet changed since your review. Please check for updates again before saving.');
  }
  await requestDa(daFetch, `https://admin.da.live/versionsource${SHEET_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label: 'Before Tag Manager update' }),
  }, 'A backup could not be created. Please check for updates and try again.');
  const body = new FormData();
  body.set('data', new Blob([JSON.stringify(next)], { type: 'application/json' }), 'tags.json');
  await requestDa(
    daFetch,
    SOURCE_URL,
    { method: 'PUT', body },
    'We could not confirm the save. Please check for updates before trying again.',
  );
  try {
    if (JSON.stringify(await readSheet(daFetch)) !== JSON.stringify(next)) throw new Error();
  } catch {
    throw new Error('The sheet was saved, but its contents could not be confirmed. Please open the sheet before trying again.');
  }
  return refreshPreview(daFetch);
}
