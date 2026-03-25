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
 * Maps raw textarea line numbers to invalid paths (matches handleInputChange + validatePaths).
 */
function getInvalidPathLineIndices(rawText, fgCopy, color) {
  const lines = rawText.split(/\r?\n/);
  const pathEntries = [];
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed.length) {
      pathEntries.push({ lineIndex: i, path: lineToPathForValidation(trimmed, fgCopy, color) });
    }
  }
  if (pathEntries.length === 0) return new Set();
  const paths = pathEntries.map((e) => e.path);
  const invalidPathIdx = getInvalidPathIndices(paths);
  const invalidLines = new Set();
  invalidPathIdx.forEach((pi) => invalidLines.add(pathEntries[pi].lineIndex));
  return invalidLines;
}

/** Non-invalid lines only, in order (same normalization as validation). */
function getValidPathsForInput(rawText, fgCopy, color) {
  const invalid = getInvalidPathLineIndices(rawText, fgCopy, color);
  const lines = rawText.split(/\r?\n/);
  const paths = [];
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed.length && !invalid.has(i)) {
      paths.push(lineToPathForValidation(trimmed, fgCopy, color));
    }
  }
  return paths;
}

async function expandWildcardPaths({ paths, accessToken, fgColor, operation }) {
  const wildcards = paths.filter((p) => p.endsWith('*'));
  const regular = paths.filter((p) => !p.endsWith('*'));
  const expanded = [...regular];

  for (const wc of wildcards) {
    const basePath = wc.slice(0, -1).replace(/\/$/, '');
    let crawlPath = basePath;

    if (operation !== 'copy') {
      const parts = basePath.split('/').filter(Boolean);
      const [orgPart, repoPart, ...rest] = parts;
      crawlPath = `/${orgPart}/${repoPart}-fg-${fgColor}${rest.length ? `/${rest.join('/')}` : ''}`;
    }

    // eslint-disable-next-line no-await-in-loop
    const { results } = crawl({ path: crawlPath, accessToken });
    // eslint-disable-next-line no-await-in-loop
    const files = await results;

    for (const file of files) {
      let filePath = operation !== 'copy'
        ? file.path.replace(`-fg-${fgColor}`, '')
        : file.path;
      filePath = filePath.replace(/\.html$/i, '');
      expanded.push(filePath);
    }
  }

  return [...new Set(expanded)];
}

async function getValidFloodgate(sdk = DA_SDK) {
  const { context, token, email } = await sdk;
  const cmp = document.createElement('milo-floodgate');
  if (context?.org) cmp.org = context.org;
  cmp.repo = context.repo;
  cmp.token = token;
  cmp.email = email;
  return cmp;
}

export {
  normalizePaths,
  validatePaths,
  getInvalidPathLineIndices,
  getValidPathsForInput,
  expandWildcardPaths,
  getValidFloodgate,
};
