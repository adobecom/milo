/* eslint import/no-relative-packages: 0 */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub, restore } from 'sinon';
import loadBlock from '../../libs/navigation/navigation.js';
import { setConfig } from '../../libs/utils/utils.js';
import { mockRes } from '../blocks/global-navigation/test-utilities.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const miloLibs = 'http://localhost:2000/libs';

describe('Navigation component', async () => {
  beforeEach(async () => {
    stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('/footer.plain.html')) return mockRes({ payload: await readFile({ path: '../blocks/region-nav/mocks/regions.html' }) });
      if (url.includes('/federal/dev/gnav.plain.html')) return mockRes({ payload: await readFile({ path: './mocks/gnav.html' }) });
      if (url.includes('/federal/error/gnav.plain.html')) return mockRes({ payload: {}, status: 404 });

      return null;
    });
    setConfig({ miloLibs });
  });

  afterEach(() => {
    restore();
  });

  it('Renders the footer block', async () => {
    await loadBlock({ authoringPath: '/federal/dev', footer: { privacyId: '12343', onReady: 'dede' }, env: 'qa' }, 'http://localhost:2000');
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });

  it('Renders the header block', async () => {
    const onReady = stub();
    await loadBlock({ authoringPath: '/federal/dev', header: { imsClientId: 'fedsmilo', onReady, layout: 'fullWidth', noBorder: 'true' }, env: 'prod', theme: 'dark' }, 'http://localhost:2000');
    const el = document.getElementsByTagName('header');
    expect(el).to.exist;
    expect(onReady.called).to.be.true;
  });

  it('Renders the localnav if isLocalNav key is passed', async () => {
    const onReady = stub();
    await loadBlock({ authoringPath: '/federal/dev', header: { imsClientId: 'fedsmilo', onReady, isLocalNav: true, jarvis: { id: '1.1' } }, env: 'prod', theme: 'dark' }, 'http://localhost:2000');
    const el = document.querySelector('.feds-localnav');
    expect(el).to.exist;
  });

  it('Should not render the footer block when config is not passed', async () => {
    try {
      await loadBlock({ env: 'qa', authoringPath: '/federal/dev', footer: {} }, 'http://localhost:2000');
      const el = document.getElementsByTagName('footer');
      expect(el).to.not.exist;
    } catch (e) {
      // handle error
    }
  });

  it('Should not render the header block when config is not passed', async () => {
    try {
      await loadBlock({ env: 'qa', footer: { privacyId: '12343' } }, 'http://localhost:2000');
      const el = document.getElementsByTagName('header');
      expect(el).to.not.exist;
    } catch (e) {
      // handle error
    }
  });

  it('Does not render either header or footer if not found in configs', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadBlock({ authoringPath: '/federal/dev', env: 'qa' }, 'http://localhost:2000');
    const header = document.getElementsByTagName('header');
    const footer = document.getElementsByTagName('footer');
    expect(header).to.be.empty;
    expect(footer).to.be.empty;
  });

  it('Renders the footer block with authoringpath passed in footer', async () => {
    await loadBlock({ footer: { privacyId: '12343', authoringPath: '/federal/dev' }, env: 'qa' }, 'http://localhost:2000');
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });
});
