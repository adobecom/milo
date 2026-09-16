import FormData from 'form-data';
import { DA_ORIGIN, createAxiosWithRetry } from './utils.js';
import { getImsToken } from './ims-client.js';

const axiosWithRetry = createAxiosWithRetry();

export const daFetch = async (url, opts = {}, { on404 } = {}) => {
  opts.headers ||= {};
  opts.headers.Authorization = `Bearer ${await getImsToken()}`;
  opts.url = url;
  opts.method = opts.method || 'GET';
  try {
    const response = await axiosWithRetry(opts);
    console.log(`DA fetch ${url} ${opts.method} ${response.status}`);
    const ok = response.status >= 200 && response.status < 300;
    return { ok, status: response.status, ...response.data };
  } catch (err) {
    if (err.response?.status === 404 && typeof on404 === 'function') {
      return on404(err);
    }
    throw new Error(`DA import failed ${err.response?.status} ${err.response?.statusText}`);
  }
};

export async function saveJsonToDa(org, repo, pathname, data) {
  if (!org || !repo || !pathname || !data || pathname.length < 2) {
    throw new Error('Invalid arguments');
  }

  const daPath = `/${org}/${repo}${pathname}`;
  const href = `https://da.live/edit#${daPath}`;

  const body = JSON.stringify(data);
  const formData = new FormData();
  formData.append('data', Buffer.from(body), {
    filename: 'data.json',
    contentType: 'application/json',
  });

  const opts = {
    method: 'PUT',
    data: formData,
    headers: formData.getHeaders(),
  };
  try {
    const url = `${DA_ORIGIN}/source${daPath}.json`;
    console.debug(`Saving to ${url}`);
    console.debug(`PUT request with FormData to ${url}`);
    const daResp = await daFetch(`${url}`, opts);
    return { href, status: daResp.status, response: daResp, ok: daResp.ok };
  } catch (e) {
    console.log(`Couldn't save to ${daPath}`, e);
    throw e;
  }
}

export async function getJsonFromDa(org, repo, pathname) {
  if (!org || !repo || !pathname || pathname.length < 2) {
    throw new Error('Invalid arguments');
  }
  const daPath = `/${org}/${repo}${pathname}`;
  const opts = { method: 'GET' };
  const url = `${DA_ORIGIN}/source${daPath}.json`;
  const daResp = await daFetch(`${url}`, opts, { on404: () => ({ ok: true, status: 204, data: {} }) });
  return daResp.ok ? daResp : { data: [] };
}
