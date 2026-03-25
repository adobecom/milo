/* eslint-disable no-underscore-dangle */
import { SUCCESS_CODES, DA_ORIGIN } from '../constants.js';
import previewOrPublishPaths from '../bulk-action.js';
import copyFiles from './fg-copy.js';
import promoteFiles from '../promote.js';
import findFragmentsAndAssets from '../references.js';
import RequestHandler from '../request-handler.js';
import { expandWildcardPaths, getValidPathsForInput } from './utils.js';
import { getFileExtension, getFileName } from '../utils.js';

const EXISTENCE_CHECK_BATCH = 10;

/**
 * Expand wildcards, validate path existence, and discover fragments/assets.
 * Mutates component state (_filesToProcess, _notFoundPaths, _fragmentsAssets).
 */
export async function runFindStep(cmp) {
  const textarea = cmp.shadowRoot.querySelector('textarea[name="paths"]');
  const paths = getValidPathsForInput(
    textarea.value,
    cmp._selectedOption === 'fgCopy',
    cmp._selectedColor,
  );

  const opMap = { fgCopy: 'copy', fgPromote: 'promote', fgDelete: 'delete' };
  const operation = opMap[cmp._selectedOption];
  const { _org: org, _sourceRepo: repo } = cmp;

  cmp._findingStatus = 'Expanding wildcard paths...';
  cmp.requestUpdate();

  cmp._filesToProcess = await expandWildcardPaths({
    paths,
    accessToken: cmp.token,
    fgColor: cmp._selectedColor,
    operation,
  });

  const regularPaths = paths.filter((p) => !p.endsWith('*'));
  if (regularPaths.length > 0) {
    cmp._findingStatus = 'Checking path existence...';
    cmp.requestUpdate();
    cmp._notFoundPaths = await validatePathsExist(cmp, regularPaths, org, repo, operation);
    const notFoundSet = new Set(cmp._notFoundPaths.map((p) => p.href));
    cmp._filesToProcess = cmp._filesToProcess.filter((p) => !notFoundSet.has(p));
  }

  if (cmp._selectedOption !== 'fgDelete') {
    cmp._findingStatus = 'Finding referenced fragments and assets...';
    cmp.requestUpdate();
    await findFragments(cmp, org, repo, operation);
  }
}

async function validatePathsExist(cmp, userPaths, org, repo, operation) {
  const reqHandler = new RequestHandler(cmp.token);
  const notFound = [];

  for (let i = 0; i < userPaths.length; i += EXISTENCE_CHECK_BATCH) {
    const batch = userPaths.slice(i, i + EXISTENCE_CHECK_BATCH);
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(batch.map(async (path) => {
      let checkPath = path;
      if (operation !== 'copy') {
        const fgRepo = `${repo}-fg-${cmp._selectedColor}`;
        checkPath = path.replace(`/${org}/${repo}`, `/${org}/${fgRepo}`);
      }
      const ext = getFileExtension(checkPath);
      const fullPath = ext ? checkPath : `${checkPath}.html`;

      const resp = await reqHandler.daFetch(`${DA_ORIGIN}/source${fullPath}`, { method: 'HEAD' });
      const status = typeof resp === 'number' ? resp : resp.status;
      if (status === 404) {
        notFound.push({ href: path, status: 'Not Found' });
      }
    }));
  }

  return notFound;
}

async function findFragments(cmp, org, repo, operation) {
  if (operation === 'copy') {
    const htmlPaths = cmp._filesToProcess
      .filter((p) => !p.endsWith('/') && !p.includes('.'));
    cmp._fragmentsAssets = await findFragmentsAndAssets({
      accessToken: cmp.token,
      htmlPaths,
      org,
      repo,
    });
    cmp._filesToProcess.push(...cmp._fragmentsAssets);
  } else {
    const fgRepo = `${repo}-fg-${cmp._selectedColor}`;
    const fgPaths = cmp._filesToProcess.map((p) => p.replace(`/${org}/${repo}`, `/${org}/${fgRepo}`));
    const fgFragments = await findFragmentsAndAssets({
      accessToken: cmp.token,
      htmlPaths: fgPaths.filter((p) => !p.endsWith('/') && !p.includes('.')),
      org,
      repo: fgRepo,
    });
    cmp._fragmentsAssets = new Set(
      [...fgFragments].map((p) => p.replace(`-fg-${cmp._selectedColor}`, '')),
    );
    cmp._filesToProcess.push(...cmp._fragmentsAssets);
  }
  cmp._filesToProcess = [...new Set(cmp._filesToProcess)];
}

// --- Copy ---

export async function executeCopy(cmp) {
  const startTime = Date.now();
  await copyFiles({
    accessToken: cmp.token,
    org: cmp._org,
    repo: cmp._sourceRepo,
    paths: cmp._filesToProcess,
    fgColor: cmp._selectedColor,
    callback: (status) => {
      // eslint-disable-next-line no-console
      console.log(`${status.statusCode} :: ${status.filePath}`);
      if (SUCCESS_CODES.includes(status.statusCode)) {
        cmp._copiedFiles.push(status.filePath);
        cmp._copiedFilesCount += 1;
      } else {
        cmp._copiedErrorList.push({ href: status.filePath, status: status.statusCode });
      }
      cmp.requestUpdate();
    },
  });
  cmp._copyDuration = Math.round((Date.now() - startTime) / 1000);
  cmp.requestUpdate();
}

// --- Promote ---

export function readPromoteIgnorePaths(cmp) {
  cmp._promoteIgnorePaths = [...(cmp._floodgateConfig.getPromoteIgnorePaths?.() || [])];

  if (cmp._promoteIgnore) {
    const textarea = cmp.shadowRoot.querySelector('textarea[name="promote-ignore-paths"]');
    if (textarea) {
      const userPaths = textarea.value.split('\n')
        .map((p) => p.trim()).filter((p) => p.length > 0);
      cmp._promoteIgnorePaths.push(...userPaths);
    }
  }

  cmp._promoteIgnorePaths = cmp._promoteIgnorePaths.map((path) => {
    if (path.endsWith('/') || path.includes('.')) return path;
    return `${path}.html`;
  });
}

export function applyPromoteIgnore(cmp) {
  const ignored = [];
  const filtered = cmp._filesToProcess.filter((file) => {
    const isIgnored = cmp._promoteIgnorePaths.some((ip) => {
      if (ip.endsWith('/')) return file.includes(ip);
      return file.endsWith(ip);
    });
    if (isIgnored) ignored.push({ href: file, status: 'Ignored' });
    return !isIgnored;
  });
  cmp._promoteIgnoreList = ignored;
  cmp._filesToProcess = filtered;
}

export function prepareFilesForPromote(cmp) {
  const fgRepo = `${cmp._sourceRepo}-fg-${cmp._selectedColor}`;
  return cmp._filesToProcess.map((path) => {
    const fgPath = path.replace(`/${cmp._org}/${cmp._sourceRepo}`, `/${cmp._org}/${fgRepo}`);
    const ext = getFileExtension(fgPath);
    if (ext) {
      return { path: fgPath, ext, name: fgPath.split('/').pop() };
    }
    return { path: `${fgPath}.html`, ext: 'html', name: getFileName(fgPath) };
  });
}

export async function executePromote(cmp) {
  const startTime = Date.now();
  const filesToPromote = prepareFilesForPromote(cmp);
  const fgRepo = `${cmp._sourceRepo}-fg-${cmp._selectedColor}`;

  await promoteFiles({
    accessToken: cmp.token,
    org: cmp._org,
    repo: fgRepo,
    promoteType: 'floodgate',
    files: filesToPromote,
    callback: (status) => {
      // eslint-disable-next-line no-console
      console.log(`${status.statusCode} :: ${status.filePath}`);
      if (SUCCESS_CODES.includes(status.statusCode)) {
        cmp._promotedFiles.push(status.filePath);
        cmp._promotedFilesCount += 1;
      } else {
        cmp._promoteErrorList.push({ href: status.filePath, status: status.statusCode });
      }
      cmp.requestUpdate();
    },
    color: cmp._selectedColor,
  });

  cmp._promoteDuration = Math.round((Date.now() - startTime) / 1000);
  cmp.requestUpdate();
}

// --- Preview / Publish ---

export async function executePreview(cmp, org, repo, paths) {
  const startTime = Date.now();
  await previewOrPublishPaths({
    org,
    repo,
    paths,
    action: 'preview',
    accessToken: cmp.token,
    callback: (status) => {
      // eslint-disable-next-line no-console
      console.log(`${status.statusCode} :: ${status.aemUrl}`);
      if (SUCCESS_CODES.includes(status.statusCode)) {
        cmp._previewedFilesCount += 1;
        cmp._previewedUrls.push(status.aemUrl);
      } else {
        cmp._previewErrorList.push({ href: status.aemUrl, status: status.statusCode, path: status.path });
      }
      cmp.requestUpdate();
    },
  });
  cmp._previewDuration = Math.round((Date.now() - startTime) / 1000);
  cmp.requestUpdate();
}

export async function executePublish(cmp, org, repo, paths) {
  const startTime = Date.now();
  await previewOrPublishPaths({
    org,
    repo,
    paths,
    action: 'live',
    accessToken: cmp.token,
    callback: (status) => {
      // eslint-disable-next-line no-console
      console.log(`${status.statusCode} :: ${status.aemUrl}`);
      if (SUCCESS_CODES.includes(status.statusCode)) {
        cmp._publishedFilesCount += 1;
        cmp._publishedUrls.push(status.aemUrl);
      } else {
        cmp._publishErrorList.push({ href: status.aemUrl, status: status.statusCode, path: status.path });
      }
      cmp.requestUpdate();
    },
  });
  cmp._publishDuration = Math.round((Date.now() - startTime) / 1000);
  cmp.requestUpdate();
}

// --- Delete ---

export function preparePathsForDelete(cmp) {
  const fgRepo = `${cmp._sourceRepo}-fg-${cmp._selectedColor}`;
  return cmp._filesToProcess.map((path) => {
    const fgPath = path.replace(`/${cmp._org}/${cmp._sourceRepo}`, `/${cmp._org}/${fgRepo}`);
    const ext = getFileExtension(fgPath);
    return ext ? fgPath : `${fgPath}.html`;
  });
}

export async function executeUnpublish(cmp, fgPaths) {
  const fgRepo = `${cmp._sourceRepo}-fg-${cmp._selectedColor}`;
  const startTime = Date.now();
  await previewOrPublishPaths({
    org: cmp._org,
    repo: fgRepo,
    paths: fgPaths,
    action: 'live',
    accessToken: cmp.token,
    isDelete: true,
    callback: (status) => {
      // eslint-disable-next-line no-console
      console.log(`${status.statusCode} :: ${status.aemUrl}`);
      if (SUCCESS_CODES.includes(status.statusCode)) {
        cmp._unpublishFilesCount += 1;
      } else {
        cmp._unpublishErrorList.push({ href: status.aemUrl, status: status.statusCode });
      }
      cmp.requestUpdate();
    },
  });
  cmp._unpublishDuration = Math.round((Date.now() - startTime) / 1000);
  cmp.requestUpdate();
}

export async function executeDelete(cmp, fgPaths) {
  const startTime = Date.now();
  const reqHandler = new RequestHandler(cmp.token);
  for (const path of fgPaths) {
    if (cmp._cancelled) break;
    // eslint-disable-next-line no-await-in-loop
    const resp = await reqHandler.deleteContent(path);
    // eslint-disable-next-line no-console
    console.log(`${resp.statusCode} :: ${resp.filePath}`);
    if (SUCCESS_CODES.includes(resp.statusCode)) {
      cmp._deletedFilesCount += 1;
    } else {
      cmp._deleteErrorList.push({ href: resp.filePath, status: resp.statusCode });
    }
    cmp.requestUpdate();
  }
  cmp._deleteDuration = Math.round((Date.now() - startTime) / 1000);
  cmp.requestUpdate();
}
