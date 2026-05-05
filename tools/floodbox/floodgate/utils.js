/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import crawl from '../crawl-tree.js';

function normalizePaths(paths, color) {
  return paths.map((p) => p.replace(`-fg-${color}`, ''));
}

/**
 * AEM page preview URL → repo path (hostname: main--{repo}--{org}.aem.page).
 * Example: .../main--da-events--adobecom.aem.page/drafts/ccc/test1
 *   → /adobecom/da-events/drafts/ccc/test1
 */
function tryAemPageUrlToPath(trimmed) {
  if (!trimmed.startsWith('http')) return null;
  let u;
  try {
    u = new URL(trimmed);
  } catch {
    return null;
  }
  const host = u.hostname;
  const m = host.match(/^main--(.+?)--(.+)\.aem\.page$/i);
  if (!m) return null;
  const [, repo, org] = m;
  let pathname = u.pathname || '/';
  if (pathname !== '/' && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  const suffix = pathname === '/' ? '' : pathname;
  return `/${org}/${repo}${suffix}`.replace(/\/+/g, '/');
}

/** One input line → path for validation (AEM URLs converted; -fg- strip when not copy). */
function lineToPathForValidation(trimmed, fgCopy, color) {
  const fromUrl = tryAemPageUrlToPath(trimmed);
  if (fromUrl) return fromUrl;
  let path = trimmed;
  if (!fgCopy) {
    path = path.replace(`-fg-${color}`, '');
  }
  return path;
}

function validatePaths(paths) {
  const retData = { valid: false, org: '', repo: '' };
  if (!Array.isArray(paths) || paths.length === 0) return retData;

  let org;
  let repo;
  for (const path of paths) {
    if (!path.startsWith('/')) return retData;

    const isWildcard = path.endsWith('*');
    const cleanPath = isWildcard ? path.slice(0, -1).replace(/\/$/, '') : path;
    const parts = cleanPath.split('/').filter(Boolean);
    const minParts = isWildcard ? 2 : 3;
    if (parts.length < minParts) return retData;

    const [orgPart, repoPart] = parts;
    if (!org && !repo) {
      org = orgPart;
      repo = repoPart;
    }
    if (orgPart !== org || repoPart !== repo || repoPart.includes('-fg-')) {
      return retData;
    }
  }
  return { valid: true, org, repo };
}

/**
 * Which path indices (non-empty lines, in order) fail the same rules as validatePaths.
 * Continues past failures so every problematic line is marked.
 */
function getInvalidPathIndices(paths) {
  const invalid = new Set();
  let org;
  let repo;
  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    if (!path.startsWith('/')) {
      invalid.add(i);
    } else {
      const isWildcard = path.endsWith('*');
      const cleanPath = isWildcard ? path.slice(0, -1).replace(/\/$/, '') : path;
      const parts = cleanPath.split('/').filter(Boolean);
      const minParts = isWildcard ? 2 : 3;
      if (parts.length < minParts) {
        invalid.add(i);
      } else {
        const [orgPart, repoPart] = parts;
        if (repoPart.includes('-fg-')) {
          invalid.add(i);
        } else if (!org && !repo) {
          org = orgPart;
          repo = repoPart;
        } else if (orgPart !== org || repoPart !== repo) {
          invalid.add(i);
        }
      }
    }
  }
  return invalid;
}

/**
 * Single-pass parse of textarea input. Returns both the line indices that fail
 * validation (for the red-line highlight) and the valid paths in order (for
 * downstream operations). Replaces two separate parses that previously ran on
 * every keystroke.
 */
function parsePathInput(rawText, fgCopy, color) {
  const lines = rawText.split(/\r?\n/);
  const entries = [];
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed.length) {
      entries.push({ lineIndex: i, path: lineToPathForValidation(trimmed, fgCopy, color) });
    }
  }
  if (entries.length === 0) {
    return { invalidLines: new Set(), validPaths: [], lines };
  }
  const invalidPathIdx = getInvalidPathIndices(entries.map((e) => e.path));
  const invalidLines = new Set();
  const validPaths = [];
  for (let pi = 0; pi < entries.length; pi += 1) {
    if (invalidPathIdx.has(pi)) {
      invalidLines.add(entries[pi].lineIndex);
    } else {
      validPaths.push(entries[pi].path);
    }
  }
  return { invalidLines, validPaths, lines };
}

/** Non-invalid lines only, in order (same normalization as validation). */
function getValidPathsForInput(rawText, fgCopy, color) {
  return parsePathInput(rawText, fgCopy, color).validPaths;
}

async function expandWildcardPaths({ paths, accessToken, fgColor, operation, signal }) {
  const wildcards = paths.filter((p) => p.endsWith('*'));
  const regular = paths.filter((p) => !p.endsWith('*'));

  const expandedLists = await Promise.all(wildcards.map(async (wc) => {
    if (signal?.aborted) return [];
    const basePath = wc.slice(0, -1).replace(/\/$/, '');
    let crawlPath = basePath;
    if (operation !== 'copy') {
      const parts = basePath.split('/').filter(Boolean);
      const [orgPart, repoPart, ...rest] = parts;
      crawlPath = `/${orgPart}/${repoPart}-fg-${fgColor}${rest.length ? `/${rest.join('/')}` : ''}`;
    }
    const { results } = crawl({ path: crawlPath, accessToken, signal });
    const files = await results;
    return files.map((file) => {
      const filePath = operation !== 'copy'
        ? file.path.replace(`-fg-${fgColor}`, '')
        : file.path;
      return filePath.replace(/\.html$/i, '');
    });
  }));

  return [...new Set([...regular, ...expandedLists.flat()])];
}

async function getValidFloodgate(sdk = DA_SDK) {
  const { context, token, email } = (await sdk) || {};
  const cmp = document.createElement('milo-floodgate');
  if (context?.org) cmp.org = context.org;
  if (context?.repo) cmp.repo = context.repo;
  if (token) cmp.token = token;
  if (email) cmp.email = email;
  return cmp;
}

export {
  normalizePaths,
  validatePaths,
  parsePathInput,
  getValidPathsForInput,
  expandWildcardPaths,
  getValidFloodgate,
};
