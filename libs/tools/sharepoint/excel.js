import { getReqOptions } from './msal.js';

export default async function updateExcelTable({ filename, tablename, values }) {
  console.log(filename);

  // baseUri: driveId ? `${site}/drives/${driveId}/root:${rootFolders}` : `${site}/drive/root:${rootFolders}`,

  // const excel = `${filename}.xlsx`;
  // const path = `${baseUri}${excel}:/workbook/tables/${tablename}/rows/add`;
  // const options = getReqOptions({ body: { values }, method: 'POST' });

  // return fetch(path, options);
}
