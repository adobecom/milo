import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

import init from '../../../libs/blocks/region-nav/region-nav.js';

document.body.innerHTML = await readFile({ path: './mocks/regions.html' });

setConfig({ });
describe('Region Nav Block', () => {
  it('sets links correctly', async () => {
    const block = document.body.querySelector('.region-nav');
    init(block);
    const links = document.body.querySelectorAll('a');
    const { contentRoot } = getConfig().locale;
    window.location.hash = 'langnav';
    const path = window.location.href.replace(`${contentRoot}`, '').replace('#langnav', '');
    expect(links[0].href).to.be.equal(`${origin}/ar${path}`);
    expect(links[links.length - 1].href).to.be.equal(`${origin}/kr${path}`);
    window.location.hash = '';
  });
});
