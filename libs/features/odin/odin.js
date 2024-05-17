/* eslint-disable import/prefer-default-export */

const jsonPathMapping = {
  'merch-card': 'merchCardByPath',
  marquee: 'marqueeByPath',
};

const bearerToken = localStorage.getItem('bearerToken');

export async function loadFragment(a, blockName) {
  const url = new URL(a.href);
  const params = new URLSearchParams(url.search);
  const fragment = params.get('fragment');
  const path = `https://author-p22655-e59341.adobeaemcloud.com${fragment}.cfm.gql.json?q=${Math.round(Math.random() * 1000000)}`;
  const res = await fetch(path, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      pragma: 'no-cache',
      'cache-control': 'no-cache',

    },
  });
  const { data } = await res.json();
  const { item } = data[jsonPathMapping[blockName]];
  Object.entries(item).forEach(([key, value]) => {
    if (value?.html) {
      item[key] = value.html;
    }
  });
  return item;
}
