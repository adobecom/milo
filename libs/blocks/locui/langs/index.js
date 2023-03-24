import updateExcelTable from '../utils/sp/excel.js';

export function findFragments() {
  const paths = [['/toot'], ['/boot']];
  updateExcelTable(paths);
}

export function syncToLangstore() {

}
