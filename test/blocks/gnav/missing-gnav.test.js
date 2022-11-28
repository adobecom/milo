import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

window.lana = { log: stub() };

document.body.innerHTML = await readFile({ path: './mocks/missing-gnav.html' });

const mod = await import('../../../libs/blocks/gnav/gnav.js');

const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};
setConfig(config);

describe('Fragments', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('test wrong gnav', async () => {
    const gnav = await mod.default(document.querySelector('header'));
    expect(gnav).to.be.null;
    expect(console.log.args[0][0]).to.equal('Could not create global navigation:');
  });
});
