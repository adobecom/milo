/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../../helpers/selectors.js';
import init from '../../../../libs/blocks/faas/faas.js';
import { setConfig } from '../../../../libs/utils/utils.js';

const config = {
  imsClientId: 'milo',
  projectRoot: `${window.location.origin}/libs`,
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  },
};
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Faas', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  const a = document.querySelector('a');

  it('FaaS Initiation', async () => {
    await init(a);
    const faas = await waitForElement('.faas-form-wrapper');
    expect(faas).to.exist;
  });
});
