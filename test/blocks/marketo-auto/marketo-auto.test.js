/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/marketo-auto/marketo-auto.js');

describe('Faas', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  const a = document.querySelector('a');

  it('Marketo auto form initiation', async () => {
    await init(a);
    const marketoForm = await waitForElement('#mktoForm_1761');
    expect(marketoForm).to.exist;
  });
});
