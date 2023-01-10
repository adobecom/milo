import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const { default: decorateButtons } = await import('../../../libs/features/buttons.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Buttons', () => {
  it.only('sets buttons', async () => {
    const blocks = document.querySelectorAll('p');
    if (blocks.length === 0) return;
    debugger;
    blocks.forEach((b) => {
      decorateButtons(b);
    });
    expect(1).to.equal(2);
  });
});
