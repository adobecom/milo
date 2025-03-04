import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('Marquee container', () => {
  before(async () => {
    const module = await import('../../../libs/blocks/marquee-container/marquee-container.js');
    const containers = document.body.querySelectorAll('.marquee-container');
    containers.forEach((container) => {
      module.default(container);
    });
  });
  it('Removes marquee-container block', async () => {
    const container = document.querySelector('.marquee-container');
    expect(container).to.equal(null);
  });
});
