import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import loadBlock from '../../libs/navigation/bootstrapper.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const blockConfig = {
  name: 'global-footer',
  targetEl: 'footer',
  appendType: 'appendChild',
  footer: { authoringPath: '/federal/home', privacyLoadDelay: 0 },
};

const miloConfigs = {
  origin: 'https://feds--milo--adobecom.hlx.page',
  miloLibs: 'https://feds--milo--adobecom.hlx.page/libs',
  pathname: '/',
};

describe('Bootstrapper', async () => {
  it('Renders the footer block', async () => {
    await loadBlock(miloConfigs, blockConfig);
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });
    clock.tick(3000);
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });
});
