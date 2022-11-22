import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const config = { codeRoot: '/libs' };
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { getSVGsfromFile } = await import('../../../libs/blocks/share/share.js');

describe('Get SVGs from a file', () => {
  it('Dies gracefully when no path is given', async () => {
    const val = await getSVGsfromFile();
    expect(val).to.be.null;
  });

  it('Dies gracefully when a bad path is given', async () => {
    const val = await getSVGsfromFile('/my/awesome/icon.svg');
    expect(val).to.be.null;
  });

  it('Dies gracefully when a bad path is given', async () => {
    const val = await getSVGsfromFile('/img/ui/chevron.svg');
    expect(val.length).to.equal(1);
  });
});
