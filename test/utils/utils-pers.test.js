import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../helpers/waitfor.js';

const utils = {};

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

describe('Utils - Personalization', () => {
  before(async () => {
    const module = await import('../../libs/utils/utils.js');
    module.setConfig(config);
    Object.keys(module).forEach((func) => {
      utils[func] = module[func];
    });
  });

  it('Load Martech - with persEnabled', async () => {
    await utils.loadMartech({ persEnabled: true });
    const el = await waitForElement(
      'link[href*="/features/personalization/personalization.js"]',
      { rootEl: document.head },
    );
    expect(el).to.exist;
  });
});
