/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/selectors.js';
import { setConfig } from '../../../libs/utils/utils.js';

const config = {
  projectRoot: `${window.location.origin}/libs`,
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/modal.html' });
const { default: init } = await import('../../../libs/blocks/faas/faas.js');

describe('Faas', () => {
  it('FaaS Modal Initiation', async () => {
    const a = document.querySelector('a');
    await init(a);
    const faasWrapper = await waitForElement('.faas-form-wrapper');
    const faas = faasWrapper.closest('.faas');
    expect(faas.classList.contains('column2')).to.equal(true);
  });
});
