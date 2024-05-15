/* eslint-disable import/prefer-default-export */

const jsonPathMapping = {
  'merch-card': 'merchCardByPath',
  marquee: 'marqueeByPath',
};

export async function loadFragment(a, blockName) {
  const url = new URL(a.href);
  const params = new URLSearchParams(url.search);
  const fragment = params.get('fragment');
  const path = `https://author-p22655-e59341.adobeaemcloud.com${fragment}.cfm.gql.json`;
  const res = await fetch(path);
  const { data } = await res.json();
  const { item } = data[jsonPathMapping[blockName]];
  Object.entries(item).forEach(([key, value]) => {
    if (value?.html) {
      item[key] = value.html;
    }
  });
  return item;
}
