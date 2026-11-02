import { createTag, localizeLinkAsync, getConfig } from '../../utils/utils.js';

async function loadTagUrls(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return undefined;
    const { data } = await resp.json();
    if (!Array.isArray(data)) throw new TypeError('Tag mapping data must be an array');
    const validRows = data.filter((tag) => tag && typeof tag.Tag === 'string'
      && (tag.Link == null || typeof tag.Link === 'string'));
    if (validRows.length !== data.length) {
      window.lana?.log(`Invalid tag mapping rows from ${url}`, { tags: 'tag-cta', severity: 'warning' });
    }
    return validRows;
  } catch (error) {
    window.lana?.log(`Failed to load tag mapping from ${url}: ${error.message}`, { tags: 'tag-cta', severity: 'warning' });
  }
  return undefined;
}

function getCardMetadataTags() {
  const row = [...document.querySelectorAll('.card-metadata > div')]
    .find((element) => element.children[0]?.textContent.trim().toLowerCase() === 'tags');
  const ids = [...new Set((row?.children[1]?.textContent || '').split(',')
    .map((id) => id.trim()).filter(Boolean))];
  if (!ids.length) return [];
  return ids;
}

async function getAutomaticTags() {
  const { replaceKey } = await import('../../features/placeholders.js');
  const config = getConfig();
  const tags = getCardMetadataTags();
  const tagUrls = await loadTagUrls(`${config.contentRoot || ''}/tag-cta.json`);

  const pills = await Promise.all(tags.map(async (path) => {
    const tagLink = tagUrls?.find((tag) => tag.Tag?.trim() === path);
    const href = tagLink?.Link?.trim();
    if (!href) return null;
    const name = path.split('/').pop();
    const [title, localized] = await Promise.all([
      replaceKey(name, config),
      localizeLinkAsync(href, window.location.hostname, true),
    ]);
    if (!title) {
      window.lana?.log(`Unknown or untitled tag: ${path}`, { tags: 'tag-cta', severity: 'warning' });
      return null;
    }
    const pill = createTag(localized ? 'a' : 'span', { class: 'tag-cta-tag', 'data-caas-tag': path });
    if (localized) pill.setAttribute('href', localized);
    pill.textContent = title.replace('&amp;', '&');
    return pill;
  }));
  return pills.filter(Boolean);
}

export default async function init(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...block.querySelectorAll('a')]
    .filter((link) => !link.matches('.tag-cta-tag[data-caas-tag]') && !heading?.contains(link));
  const tags = ((heading && !links.length) || block.classList.contains('include-caas'))
    ? await getAutomaticTags() : [];
  const content = heading ? [heading] : [];
  heading?.classList.add('tag-cta-heading');

  if (links.length || tags.length) {
    const list = createTag('ul', { class: 'tag-cta-list', role: 'list' });
    [...links, ...tags].forEach((tag) => list.append(createTag('li', null, tag)));
    content.push(list);
  }

  block.replaceChildren(...content);
}
