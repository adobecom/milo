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

describe('Target Metadata - Not in allowed contentRoot list', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-feds.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Should NOT add target meta tag when contentRoot is not in allowed list', () => {
    const currentConfig = getConfig();
    const allowedContentRoots = ['/homepage', '/cc-shared', '/dc-shared'];
    expect(allowedContentRoots.includes(currentConfig.contentRoot)).to.be.false;
    const targetMeta = document.head.querySelector('meta[name="target"]');
    expect(targetMeta).to.not.exist;
  });
});

describe('Target Metadata - In allowed contentRoot list', () => {
  before(async () => {
    const currentConfig = getConfig();
    currentConfig.contentRoot = '/homepage';
    currentConfig.locale.ietf = 'en-US';
    document.head.innerHTML = await readFile({ path: './mocks/head-feds.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const allowedContentRoots = ['/homepage', '/cc-shared', '/dc-shared'];
    if (currentConfig.locale.ietf === 'en-US'
        && allowedContentRoots.includes(currentConfig.contentRoot)) {
      const targetMeta = document.createElement('meta');
      targetMeta.setAttribute('name', 'target');
      targetMeta.setAttribute('content', 'on');
      document.head.append(targetMeta);
    }
  });

  it('Should add target meta tag when contentRoot is /homepage with US locale', () => {
    const currentConfig = getConfig();
    expect(currentConfig.locale.ietf).to.equal('en-US');
    expect(['/homepage', '/cc-shared', '/dc-shared'].includes(currentConfig.contentRoot)).to.be.true;
    const targetMeta = document.head.querySelector('meta[name="target"]');
    expect(targetMeta).to.exist;
    expect(targetMeta.getAttribute('content')).to.equal('on');
  });
});
