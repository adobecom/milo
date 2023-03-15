import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

const config = {
  codeRoot: '/libs',
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
