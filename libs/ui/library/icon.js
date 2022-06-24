/*
Fetch Library by path
expects path to '.json' file type ex. '/docs/icon-library.json'
*/

export async function fetchLibrary(path) {
  const library = {};
  const resp = await fetch(path);
  const json = await resp.json();
  if (resp.ok) {
    json.data.forEach((item) => {
      const itemValues = {};
      Object.entries(item).forEach((value) => {
        const itemValue = value[1];
        if (itemValue) {
          itemValues[value[0]] = itemValue;
        }
      });
      library[item.key] = itemValues;
    });
  }
  return library;
}

let iconLibrary;
export async function getIconLibrary() {
  const url = '/docs/icon-library.json';
  iconLibrary = await fetchLibrary(url);
  return iconLibrary;
}

export default async function init() {
  // await getIconLibrary();
}
