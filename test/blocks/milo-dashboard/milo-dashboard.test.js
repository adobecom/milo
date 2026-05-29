import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/milo-dashboard/milo-dashboard.js');

describe('milo-dashboard', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  it('renders a dashboard shell with header and panel grid', async () => {
    const block = document.querySelector('.milo-dashboard');
    await init(block);
    expect(block.querySelector('.dashboard-header')).to.exist;
    expect(block.querySelector('.dashboard-grid')).to.exist;
  });
});
