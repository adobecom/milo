import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/gist/gist.js');

describe('adobetv autoblock', () => {
  it('creates iframe video block', async () => {
    const gistLink = document.body.querySelector('a');
    init(gistLink);
    const div = await waitForElement('div.gist-data');
    expect(div).to.exist;
  });
});
