import { statuses } from './state.js';
import { getItemId } from '../../../tools/sharepoint/shared.js';
import { account } from '../../../tools/sharepoint/state.js';
import updateExcelTable from '../../../tools/sharepoint/excel.js';

export async function setExcelStatus(action) {
  const itemId = getItemId();
  const currTime = new Date().toUTCString();
  const values = [[action, currTime, account.value.username]];
  updateExcelTable({ itemId, tablename: 'FRAGMENT_STATUS', values });
}
export function setStatus(name, type, text, description, timeout) {
  const content = type && text ? { type, text, description } : null;
  statuses.value = { ...statuses.value, [name]: content };
  if (timeout) {
    setTimeout(() => {
      delete statuses.value[name];
      statuses.value = { ...statuses.value };
    }, timeout);
  }
}
