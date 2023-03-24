import { updateExcelTable } from '../utils/sp.js';

export function findFragments() {
  const paths = [['/foo'], ['/bar']];
  updateExcelTable(paths);
}

export function syncToLangstore() {

}


// https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,d21b93ad-c3bc-4896-b58e-fd76f04c2834,563e43e2-09db-47a2-8d99-92b6161a051b/drive/root:/milo/drafts/localization/projects/2023/03/locui.xlsx:/workbook/tables/URL/rows/add
// https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,d21b93ad-c3bc-4896-b58e-fd76f04c2834,563e43e2-09db-47a2-8d99-92b6161a051b/drive/root:/milo/drafts/localization/projects/2023/03/locui.xlsx:/workbook/tables/URL/rows/add
