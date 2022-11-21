import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const config = { codeRoot: '/libs' };
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/share/share.js');

describe('Share', () => {
  it('All share buttons exist when block is empty', async () => {
    const shareEl = document.querySelector('.share');
    await init(shareEl);
    const fb = shareEl.querySelector('a[title*="Facebook"');
    const tw = shareEl.querySelector('a[title*="Twitter"');
    const li = shareEl.querySelector('a[title*="LinkedIn"');
    const pin = shareEl.querySelector('a[title*="Pinterest"');
    expect(fb).to.exist;
    expect(tw).to.exist;
    expect(li).to.exist;
    expect(pin).to.exist;
  });
  it('Only facebook exists', async () => {
    const shareEl = document.querySelector('.share.facebook');
    await init(shareEl);
    const fb = shareEl.querySelector('a[title*="Facebook"');
    const tw = shareEl.querySelector('a[title*="Twitter"');
    expect(fb).to.exist;
    expect(tw).to.not.exist;
  });
  it('Only twitter exists', async () => {
    const shareEl = document.querySelector('.share.twitter');
    await init(shareEl);
    const fb = shareEl.querySelector('a[title*="Facebook"');
    const tw = shareEl.querySelector('a[title*="Twitter"');
    expect(tw).to.exist;
    expect(fb).to.not.exist;
  });
  it('Only linkedin exists', async () => {
    const shareEl = document.querySelector('.share.linkedin');
    await init(shareEl);
    const li = shareEl.querySelector('a[title*="LinkedIn"');
    const tw = shareEl.querySelector('a[title*="Twitter"');
    expect(li).to.exist;
    expect(tw).to.not.exist;
  });
  it('Only pinterest exists', async () => {
    const shareEl = document.querySelector('.share.pinterest');
    await init(shareEl);
    const pi = shareEl.querySelector('a[title*="Pinterest"');
    const tw = shareEl.querySelector('a[title*="Twitter"');
    expect(pi).to.exist;
    expect(tw).to.not.exist;
  });
});
