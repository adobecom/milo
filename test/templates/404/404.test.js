import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getConfig, setConfig } from '../../../libs/utils/utils.js';

const config = {
  codeRoot: '/libs',
  contentRoot: '/test/templates/404/mocks',
  locale: {
    contentRoot: '/test/templates/404/mocks',
    prefix: '',
    ietf: 'en-US',
    tk: 'hah7vzn.css',
  },
};
setConfig(config);

const { default: init } = await import('../../../libs/templates/404/404.js');

describe('Feds 404', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-feds.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Appends a libs 404 fragment link', () => {
    expect(document.querySelector('a').href.includes('/libs/')).to.be.true;
  });
});

describe('Local 404', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-local.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Appends a local 404 fragment link', () => {
    expect(document.querySelector('a').href.includes(config.contentRoot)).to.be.true;
  });
});

describe('Legacy 404', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-legacy.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Adds legacy 404 from locale contentRoot', () => {
    expect([...document.body.classList].includes('legacy-404')).to.be.true;
  });
});

describe('Legacy 404 Fallback', () => {
  before(async () => {
    const miloConfig = getConfig();
    miloConfig.locale.contentRoot = '';
    document.head.innerHTML = await readFile({ path: './mocks/head-legacy.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Fallback to contentRoot legacy 404', () => {
    expect([...document.body.classList].includes('legacy-404')).to.be.true;
  });
});
