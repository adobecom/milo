import { fetchWithRetry } from '../../loc/sharepoint.js';

export function getFloodgateUrl(url, fgColor) {
  if (!url) {
    return undefined;
  }
  const urlArr = url.split('--');
  urlArr[1] += `-${fgColor}`;
  return urlArr.join('--');
}

export function createColumn(innerHtml, classValue) {
  const tag = classValue === 'header' ? 'th' : 'td';
  const element = document.createElement(tag);
  if (innerHtml) {
    element.innerHTML = innerHtml;
  }
  return element;
}

export function handleExtension(path) {
  if (path.endsWith('.xlsx')) {
    return path.replace('.xlsx', '.json');
  }
  return path.substring(0, path.lastIndexOf('.'));
}

export async function getFile(downloadUrl) {
  const response = await fetchWithRetry(downloadUrl);
  if (response) {
    return response.blob();
  }
  return undefined;
}

export function getPathFromUrl(url) {
  return new URL(url).pathname;
}

export function getDocPathFromUrl(url) {
  let path = getPathFromUrl(url);
  if (!path) {
    return undefined;
  }
  if (path.endsWith('.json')) {
    path = path.slice(0, -5);
    return `${path}.xlsx`;
  }
  if (path.endsWith('.svg') || path.endsWith('.pdf')) {
    return path;
  }
  if (path.endsWith('/')) {
    path += 'index';
  } else if (path.endsWith('.html')) {
    path = path.slice(0, -5);
  }

  return `${path}.docx`;
}

export async function delay(milliseconds = 100) {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export function getParams(project, config) {
  return {
    adminPageUri: window.location.href,
    projectExcelPath: project.excelPath,
    shareUrl: config.sp.shareUrl,
    fgShareUrl: config.sp.fgShareUrl,
    rootFolder: config.sp.rootFolders,
    fgRootFolder: config.sp.fgRootFolder,
    promoteIgnorePaths: config.promoteIgnorePaths || [],
    driveId: config.sp.driveId || '',
    fgColor: project.fgColor,
  };
}
