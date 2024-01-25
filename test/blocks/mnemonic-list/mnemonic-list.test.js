import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/mnemonic-list/mnemonic-list.js');

describe('Mnemonic List', () => {
  let mnemonicList;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/mnemonic-list.html' });
    await init(document.body.querySelector('.mnemonic-list'));
    mnemonicList = document.body.querySelector('.mnemonic-list');
  });

  afterEach(() => {
    mnemonicList = null;
    document.body.innerHTML = '';
  });

  it('should have a product list', () => {
    expect(mnemonicList.querySelector('.product-list')).to.exist;
  });

  it('should have a product item', () => {
    expect(mnemonicList.querySelector('.product-item')).to.exist;
  });

  it('should have a product item with a title', () => {
    const productItem = mnemonicList.querySelector('.product-item');
    const title = productItem.querySelector('strong');
    expect(title).to.exist;
  });
});
