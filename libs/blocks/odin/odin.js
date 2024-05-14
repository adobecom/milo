import { decorateLinks, loadBlock } from '../../utils/utils.js';

const jsonPathMapping = {
  'merch-card': 'merchCardByPath',
  marquee: 'marqueeByPath',
};

export default async function init(el) {
  const root = el.parentElement.parentElement;
  const url = new URL(el.href);
  const params = new URLSearchParams(url.search);
  const fragment = params.get('fragment');
  const [blockName] = el.innerText.split(':');
  const path = `https://author-p22655-e59341.adobeaemcloud.com${fragment}.cfm.gql.json`;
  const res = await fetch(path);
  const { data } = await res.json();
  const { item } = data[jsonPathMapping[blockName]];
  Object.entries(item).forEach(([key, value]) => {
    if (value?.html) {
      item[key] = value.html;
    }
  });
  const { initJSON } = await import(`../${blockName}/${blockName}.js`);
  el.parentElement.outerHTML = await initJSON(item);

  await Promise.all(decorateLinks(root).map(loadBlock));
  return el;
}
