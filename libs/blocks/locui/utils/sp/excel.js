import { spAccessToken, heading, setStatus } from '../state.js';
import getMSALConfig from './msal.js';

function getReqOptions({ body = null, method = 'GET' } = {}) {
  const bearer = `Bearer ${spAccessToken.value}`;
  const headerOpts = { Authorization: bearer, 'Content-Type': 'application/json' };
  const headers = new Headers(headerOpts);
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}

export default async function updateExcelTable(values) {
  setStatus('sharepoint', 'info', 'Adding URLs to your project.');
  const { baseUri } = await getMSALConfig();

  const excel = `${heading.value.path}.xlsx`;
  const path = `${baseUri}${excel}:/workbook/tables/URL/rows/add`;
  const options = getReqOptions({ body: { values }, method: 'POST' });

  const res = await fetch(path, options);
  if (!res.ok) {
    setStatus('sharepoint', 'error', 'Couldn\'t add URLs to project.');
    return null;
  }
  const json = await res.json();
  setStatus('sharepoint');
  return json;
}
