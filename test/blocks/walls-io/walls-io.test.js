import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { waitForElement } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/walls-io/walls-io.js');

describe('init', () => {
  const blocks = document.body.querySelectorAll('.walls-io');

  it('loads wall.io block', async () => {
    init(blocks[0]);
    const iframe = await waitForElement('iframe');
    expect(iframe).to.exist;
  });

  it('shows error msg for invalid urls', async () => {
    init(blocks[1]);
    const errorMsg = 'The Walls.io block requires a valid Walls.io URL to function.';
    expect(blocks[1].innerHTML).to.eql(errorMsg);
  });
});
