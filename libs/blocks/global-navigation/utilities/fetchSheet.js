import { getFedsPlaceholderConfig } from './utilities.js';

async function fetchData(path) {
  const resp = await fetch(path).catch(() => ({}));
  const { data } = resp.ok ? await resp.json() : { data: [] };
  const res = {};
  for (let i = 0; i < data.length; i += 1) {
    res[data[i].key] = data[i];
  }
  return res;
}

let fetchedSheets;
async function fetchSheets() {
  fetchedSheets = fetchedSheets || new Promise((resolve) => {
    fetchData(`${getFedsPlaceholderConfig().locale.contentRoot}/feds-sheet.json`)
      .then((res) => resolve(res));
  });
  return fetchedSheets;
}

let fetchedDefaultSheets;
async function fetchDefaultSheets() {
  fetchedDefaultSheets = fetchedDefaultSheets || new Promise((resolve) => {
    fetchData(`${getFedsPlaceholderConfig().locale.contentRoot}/libs/feds/feds-sheet.json`)
      .then((res) => resolve(res));
  });
  return fetchedDefaultSheets;
}

const keyToStr = (key) => key.replaceAll('-', ' ');

export async function getSheet(key = '') {
  if (typeof key !== 'string') return { value: '' };
  const { locale } = getFedsPlaceholderConfig();
  const defaultLocale = 'en-US';
  const sheets = await fetchSheets();
  if (sheets[key]) return sheets[key];
  let defaultSheets = {};
  if (!fetchedDefaultSheets && locale.ietf !== defaultLocale) {
    defaultSheets = await fetchDefaultSheets();
  }
  if (defaultSheets[key]) return defaultSheets[key];
  return { value: keyToStr(key) }; // turn 'sign-in' into 'sign in'
}

// We want to always map a key to value, even if it's just a transformed key
// that way we can always display something to the user
// example: sign-in becomes {sign-in: {value: "sign in"}}
export async function getSheets(keys = []) {
  if (!Array.isArray(keys)) return [];
  const sheetArray = await Promise.all(keys.map((key) => getSheet(key)));
  const sheets = {};
  for (let i = 0; i < sheetArray.length; i += 1) {
    sheets[keys[i]] = sheetArray[i].key
      ? sheetArray[i]
      : { value: keys[i].replaceAll('-', ' ') };
  }
  return sheets;
}
