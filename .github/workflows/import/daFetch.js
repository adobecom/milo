import { DA_ORIGIN } from './constants.js';

let token;
export async function getImsToken() {
  console.log('Fetching IMS token');
  const params = new URLSearchParams();
  params.append('client_id', process.env.ROLLING_IMPORT_CLIENT_ID);
  params.append('client_secret', process.env.ROLLING_IMPORT_CLIENT_SECRET);
  params.append('code', process.env.ROLLING_IMPORT_CODE);
  params.append('grant_type', process.env.ROLLING_IMPORT_GRANT_TYPE);

  const response = await fetch(process.env.ROLLING_IMPORT_IMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve IMS token');
  }

  const data = await response.json();
  token = data.access_token;
  console.log('Fetched IMS token');
}

export const daFetch = async (url, opts = {}) => {
  opts.headers ||= {};
  opts.headers.Authorization = `Bearer ${token}`;
  const resp = await fetch(url, opts);
  if (!resp.ok) throw new Error('DA import failed');
  return resp;
};

export function replaceHtml(text, fromOrg, fromRepo) {
  let inner = text;
  if (fromOrg && fromRepo) {
    const fromOrigin = `https://main--${fromRepo}--${fromOrg}.aem.live`;
    inner = text
      .replaceAll('./media', `${fromOrigin}/media`)
      .replaceAll('href="/', `href="${fromOrigin}/`);
  }

  return `
    <body>
      <header></header>
      <main>${inner}</main>
      <footer></footer>
    </body>
  `;
}

export async function saveToDa(text, url) {
  const daPath = `/${url.org}/${url.repo}${url.pathname}`;
  const daHref = `https://da.live/edit#${daPath}`;
  const { org, repo } = url;

  const body = replaceHtml(text, org, repo);

  const blob = new Blob([body], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob);
  const opts = { method: 'PUT', body: formData };
  try {
    const daResp = await daFetch(`${DA_ORIGIN}/source${daPath}.html`, opts);
    return { daHref, daStatus: daResp.status, daResp, ok: daResp.ok };
  } catch (e) {
    console.log(`Couldn't save ${url.daUrl} `);
    throw e;
  }
}

function getBlob(url, content) {
  const body =
    url.type === 'json'
      ? content
      : replaceHtml(content, url.fromOrg, url.fromRepo);

  const type = url.type === 'json' ? 'application/json' : 'text/html';

  return new Blob([body], { type });
}

export async function saveAllToDa(url, content) {
  const { toOrg, toRepo, destPath, editPath, type } = url;

  const route = type === 'json' ? '/sheet' : '/edit';
  url.daHref = `https://da.live${route}#/${toOrg}/${toRepo}${editPath}`;

  const blob = getBlob(url, content);
  const body = new FormData();
  body.append('data', blob);
  const opts = { method: 'PUT', body };

  try {
    const resp = await daFetch(
      `${DA_ORIGIN}/source/${toOrg}/${toRepo}${destPath}`,
      opts
    );
    return resp.status;
  } catch {
    console.log(`Couldn't save ${destPath}`);
    return 500;
  }
}
