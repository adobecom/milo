import { getConfig } from '../../utils/utils.js';

export default async function init(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const res = await fetch(`${base}/blocks/community-faq/community-faq.json`);
  const js = await res.json();
  js.data.items.forEach(e => {
    const x = `<div class="card product-card border">
    <div>
      <div>
        <h3 id="lorem-ipsum-dolor-sit-amet-3">${e.subject.substring(0, 30) + ' ...'}</h3>
        <p>${e.body.substring(0, 100) + ' ...'}</p>
        <p><em><a href=${e.view_href}>Learn more</a></em></p>
      </div>
    </div>
    </div>`;
    el.innerHTML += x;
  });
  console.log(js);
}
