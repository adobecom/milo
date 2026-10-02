import { expect } from '@esm-bundle/chai';
import { getMediaUrl, loadArea, setConfig } from '../../libs/utils/utils.js';

describe('Page media registration', () => {
  it('registers page media before page mods run', async () => {
    setConfig({});
    document.head.insertAdjacentHTML('beforeend', '<meta name="martech" content="off">');
    const query = '?width=750&format=webply&optimize=medium';
    document.body.innerHTML = `<main><div><picture>
      <source srcset="./media_20page.png${query}">
      <img src="./media_21page.png${query}" loading="lazy">
    </picture></div></main>`;
    await loadArea(document);
    const base = `${window.location.origin}/cc-shared/fragments/frag`;
    expect(getMediaUrl(`./media_20page.png${query}`, base)).to.equal(new URL(`./media_20page.png${query}`, window.location).href);
    expect(getMediaUrl(`./media_21page.png${query}`, base)).to.equal(new URL(`./media_21page.png${query}`, window.location).href);
    expect(getMediaUrl('./media_21page.png?width=2000', base)).to.be.undefined;
  });
});
