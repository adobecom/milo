import { html } from '../../../../../deps/htm-preact.js';
import DetailRow from './DetailRow.js';

export default function DetailRows({ data }) {
  if (data.length === 0) {
    return 'No data for this status';
  }
  const rows = data.map((d) => html`<${DetailRow} data=${d} />`);
  return html`<table class="detail-rows-table">
    <tr class="detail-rows-row">
      <th>File</th>
      <th>Project Name</th>
      <th>Status</th>
      <th>Title</th>
      <th>Tags</th>
      <th>Error Msg</th>
    </tr>
    ${rows}
  </table>`;
}
