import { html } from '../../../../../deps/htm-preact.js';
import { EXPECTED } from '../../constants.js';

export default function DetailRow({ data }) {
  const { file, projectName, status, title, tags, results } = data;
  let errMsg = '';
  if (status !== EXPECTED) {
    errMsg = results[0].error.message;
  }
  return html`<tr class="detail-rows-row">
    <td class="detail-rows-cell">${file}</td>
    <td class="detail-rows-cell">${projectName}</td>
    <td class="detail-rows-cell">${status}</td>
    <td class="detail-rows-cell">${title}</td>
    <td class="detail-rows-cell">${JSON.stringify(tags)}</td>
    <td class="detail-rows-cell">${errMsg}</td>
  </tr>`;
}
