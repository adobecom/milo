import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub, useFakeTimers, restore } from 'sinon';
import loadBlock from '../../libs/navigation/bootstrapper.js';
import fetchedFooter from '../blocks/global-footer/mocks/fetched-footer.js';
import placeholders from '../blocks/global-navigation/mocks/placeholders.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const blockConfig = {
  name: 'global-footer',
  targetEl: 'footer',
  appendType: 'append',
  footer: { authoringPath: '/federal/home', privacyLoadDelay: 0 },
};

const miloConfigs = {
  origin: 'https://feds--milo--adobecom.hlx.page',
  miloLibs: 'http://localhost:2000/libs',
  pathname: '/',
};

const mockRes = ({ payload, status = 200, ok = true } = {}) => new Promise((resolve) => {
  resolve({
    status,
    ok,
    json: () => payload,
    text: () => payload,
  });
});

describe('Bootstrapper', async () => {
  beforeEach(async () => {
    stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('/footer')) {
        return mockRes({
          payload: fetchedFooter(
            { regionPickerHash: '/fragments/regions#langnav' },
          ),
        });
      }
      if (url.includes('/placeholders')) return mockRes({ payload: placeholders });
      if (url.includes('/footer.plain.html')) return mockRes({ payload: await readFile({ path: '../blocks/region-nav/mocks/regions.html' }) });
      return null;
    });
  });

  afterEach(() => {
    restore();
  });

  it('Renders the footer block', async () => {
    await loadBlock(miloConfigs, blockConfig);
    const clock = useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });
    clock.tick(3000);
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });
});
