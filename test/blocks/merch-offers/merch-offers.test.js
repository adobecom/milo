import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../libs/blocks/merch-offers/merch-offers.js';

describe('init', async () => {
  it('should parse add stock label, and plan types', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/merch-offers.html' });
    const el = await init(document.querySelector('div.merch-offers'));
    expect(el.children.length).to.equal(4);
  });

  it('should parse add stock label, and edu plan types', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/merch-offers.html' });
    const el = await init(document.querySelector('div.merch-offers.edu'));
    expect(el.children.length).to.equal(3);
  });
});
