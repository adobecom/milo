import fs from 'node:fs/promises';

const DA_SOURCE_ORIGIN = 'https://admin.da.live/source';
const DA_ORG = 'adobecom';
const DA_EDIT_ORIGIN = 'https://da.live/edit#';

export async function uploadHtmlFile(
  repo: string,
  remoteFile: string,
  localFile: string,
  authHeader: string,
  fetchImpl: typeof fetch,
): Promise<void> {
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

export async function fetchRemoteHtml(
  repo: string,
  remoteFile: string,
  authHeader: string,
  fetchImpl: typeof fetch,
): Promise<{ ok: true; html: string } | { ok: false; status: number }> {
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

export function getDaLiveEditUrl(repo: string, remotePath: string): string {
  const normalizedPath = remotePath.replace(/^\/+/, '');
  return `${DA_EDIT_ORIGIN}/${DA_ORG}/${repo}/${normalizedPath}`;
}
