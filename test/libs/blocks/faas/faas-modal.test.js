/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../../helpers/selectors.js';
import init from '../../../../libs/blocks/faas/faas.js';

document.body.innerHTML = await readFile({ path: './mocks/modal.html' });

describe('Faas', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  const a = document.querySelector('a');

  it('FaaS Modal Initiation', async () => {
    await init(a);
    const faasWrapper = await waitForElement('.faas-form-wrapper');
    const faas = faasWrapper.closest('.faas');
    expect(faas.classList.contains('column2')).to.equal(true);
  });
});
