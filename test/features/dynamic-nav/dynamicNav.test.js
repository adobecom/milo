import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import dynamicNav from '../../../libs/features/dynamic-navigation.js';

describe('Dynamic nav', () => {
  beforeEach(() => {
    const conf = { dynamicNavKey: 'bacom' };
    setConfig(conf);
    window.sessionStorage.setItem('gnavSource', 'some-source-string');
  });

  it('Saves the gnavSource and dynamicNavKey to session storage', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
    window.sessionStorage.removeItem('gnavSource');
    dynamicNav('gnav/aem-sites', 'bacom');
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('gnav/aem-sites');
    expect(window.sessionStorage.getItem('dynamicNavKey')).to.equal('bacom');
  });

  it('Returns the provided url when the dynamic nav metadata is not present', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/off.html' });
    const url = dynamicNav('gnav/aem-sites', 'nocom');
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('some-source-string');
    expect(url).to.equal('gnav/aem-sites');
  });

  it('Returns the provided url with when the wrong dynamicNavKey is passed', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on.html' });
    const url = dynamicNav('gnav/aem-sites', 'nocom');
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('some-source-string');
    expect(url).to.equal('gnav/aem-sites');
  });

  it('Returns the sessionStorage url if the item exists, the keys match, and dynamic nav is on', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on.html' });
    const url = dynamicNav('gnav/aem-sites', 'bacom');
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('some-source-string');
    expect(url).to.equal('some-source-string');
  });

  it('Returns the pprovided url if it does not find an item in sessionStorage and dynamic nav is on', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on.html' });
    window.sessionStorage.removeItem('gnavSource');
    const url = dynamicNav('gnav/aem-sites', 'bacom');
    expect(url).to.equal('gnav/aem-sites');
  });
});
