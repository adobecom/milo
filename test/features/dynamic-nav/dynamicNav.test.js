import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadArea, setConfig, getConfig, getMetadata } from '../../../libs/utils/utils.js';
import dynamicNav from '../../../libs/features/dynamic-navigation.js';

describe('Dynamic nav', () => {
  const methods = { getConfig, getMetadata };

  beforeEach(() => {
    const conf = { dynamicNavKey: 'bacom' };
    setConfig(conf);
    window.sessionStorage.setItem('gnavSource', 'some-source-string');
  });

  it('Does not set the gnav source in storage if the meta tag is not present', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/entry-no-gnav.html' });
    window.sessionStorage.removeItem('gnavSource');
    dynamicNav('', methods);
    expect(window.sessionStorage.getItem('gnavSource')).to.be.null;
    expect(document.querySelector('meta[name="gnav-source"')).to.be.null;
  });

  it('Sets the gnav source in session storage on entry pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
    dynamicNav('entry', methods);
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('/gnav/localnav-aem-sites');
    expect(window.localStorage.getItem('gnavSource')).to.be.null;
  });

  it('Modifies the gnav source using session storage', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on.html' });
    dynamicNav('on', methods);
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('some-source-string');
  });

  it('Removes gnavSource in sessionStorage if the dynamic nav meta is not present', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/off.html' });
    loadArea(document);
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('/gnav/localnav-aem-sites');
    expect(window.sessionStorage.getItem('gnavSource')).to.be.null;
  });

  it('Adds a gnav-source if one does not exist, and sets source as expected', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on-no-gnav.html' });
    expect(document.querySelector('meta[name="gnav-source"')).to.be.null;
    dynamicNav('on', methods);
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('some-source-string');
  });
});
