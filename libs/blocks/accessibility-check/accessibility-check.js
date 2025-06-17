import { createTag } from '../../utils/utils.js';

async function getJson(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Response status: ${resp.status}`);
    }
    return await resp.json();
  } catch (error) {
    window.lana?.log(error.message);
    return null;
  }
}

export default async function init(el) {
  const divs = el.querySelectorAll(':scope > div');
  divs[0].classList.add('new-class');
  const jsonURL = divs[0].querySelector('a');
  const json = await getJson(jsonURL.href);
  const pageID = createTag('div', { class: 'carousel-button carousel-previous is-delayed' }, window.location.href);
  console.log('accessibility-check', el);
  console.log('json', json);
  console.log('jsonURL', jsonURL.href);
  console.log(window.location.href);
  el.append(pageID);
  // const url = `${base}/consonant-test.json`;
  // const json = await getJson(url);
  // if (!json) return;
}
