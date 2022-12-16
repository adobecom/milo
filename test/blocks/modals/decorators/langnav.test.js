import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement, waitForRemoval } from '../../../helpers/waitfor.js';
import { setConfig, getConfig } from '../../../../libs/utils/utils.js';

await import('../../../../libs/blocks/modal/modal.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

setConfig({ });
describe('Langnav Modal', () => {
  it('Loads a modal on load with hash and closes when removed from hash', async () => {
    window.location.hash = '#langnav';
    await waitForElement('#langnav');
    expect(document.getElementById('langnav')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#langnav');
    expect(document.getElementById('langnav')).to.be.null;
  });

  it('sets links correctly', async () => {
    window.location.hash = '#langnav';
    await waitForElement('#langnav');
    const modal = document.getElementById('langnav');
    const links = modal.querySelector('.region-selector').querySelectorAll('a');
    const { contentRoot } = getConfig().locale;
    const path = window.location.href.replace(`${contentRoot}`, '').replace('#langnav', '');
    expect(links[0].href).to.be.equal(`${origin}/ar${path}`);
    expect(links[links.length - 1].href).to.be.equal(`${origin}/kr${path}`);
    window.location.hash = '';
    await waitForRemoval('#langnav');
  });
});
