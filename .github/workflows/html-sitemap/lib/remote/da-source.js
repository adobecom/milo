import fs from 'node:fs/promises';

const DA_SOURCE_ORIGIN = 'https://admin.da.live/source';
const DA_ORG = 'adobecom';
const DA_EDIT_ORIGIN = 'https://da.live/edit#';

/**
 * @param {string} repo
 * @param {string} remoteFile
 * @param {string} localFile
 * @param {string} authHeader
 * @param {typeof fetch} fetchImpl
 * @returns {Promise<void>}
 */
export async function uploadHtmlFile(
  repo,
  remoteFile,
  localFile,
  authHeader,
  fetchImpl,
) {
  const html = await fs.readFile(localFile, 'utf8');
  const form = new FormData();
  form.append('data', new Blob([html], { type: 'text/html' }), 'sitemap.html');

  const response = await fetchImpl(`${DA_SOURCE_ORIGIN}/${DA_ORG}/${repo}/${remoteFile}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload ${remoteFile}: HTTP ${response.status}`);
  }
}

/**
 * @param {string} repo
 * @param {string} remoteFile
 * @param {string} authHeader
 * @param {typeof fetch} fetchImpl
 * @returns {Promise<{ ok: true, html: string } | { ok: false, status: number }>}
 */
export async function fetchRemoteHtml(
  repo,
  remoteFile,
  authHeader,
  fetchImpl,
) {
  const response = await fetchImpl(`${DA_SOURCE_ORIGIN}/${DA_ORG}/${repo}/${remoteFile}`, {
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  return { ok: true, html: await response.text() };
}

/**
 * @param {string} repo
 * @param {string} remotePath
 * @returns {string}
 */
export function getDaLiveEditUrl(repo, remotePath) {
  const normalizedPath = remotePath.replace(/^\/+/, '');
  return `${DA_EDIT_ORIGIN}/${DA_ORG}/${repo}/${normalizedPath}`;
}
