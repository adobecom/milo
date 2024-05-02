import { getSharePointDetails, getSiteOrigin } from './shared.js';
import { getReqOptions } from './msal.js';

export default async function updateExcelTable({ itemId, tablename, values }) {
  try {
    const origin = getSiteOrigin();
    const { site, driveId } = await getSharePointDetails(origin);
    const options = getReqOptions({ body: { values }, method: 'POST' });
    const url = `${site}/${driveId}/items/${itemId}/workbook/tables/${tablename}/rows/add`;
    return fetch(url, options);
  } catch (error) {
    return error;
  }
}
