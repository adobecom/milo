import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, loadArea } from '../../libs/utils/utils.js';

describe('Dynamic nav', () => {
  beforeEach(() => {
    window.sessionStorage.setItem('gnavSource', 'some-source-string');
    setConfig({ locale: { contentRoot: '/root' } });
  });

  it('Does not set the gnav source in storage if the meta tag is not present', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/dynamicNav/entry-no-gnav.html' });
    window.sessionStorage.removeItem('gnavSource');
    loadArea(document);
    expect(window.sessionStorage.getItem('gnavSource')).to.be.null;
    expect(document.querySelector('meta[name="gnav-source"')).to.be.null;
  });

  it('Sets the gnav source in session storage on entry pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/dynamicNav/entry.html' });
    loadArea(document);
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('/gnav/localnav-aem-sites');
    expect(window.localStorage.getItem('gnavSource')).to.be.null;
  });

  it('Modifies the gnav source using session storage', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/dynamicNav/on.html' });
    loadArea(document);
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('some-source-string');
  });

  it('Removes gnavSource in sessionStorage if the dynamic nav meta is not present', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/dynamicNav/off.html' });
    loadArea(document);
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('/gnav/localnav-aem-sites');
    expect(window.sessionStorage.getItem('gnavSource')).to.be.null;
  });

  it('Adds a gnav-source if one does not exist, and sets source as expected', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/dynamicNav/on-no-gnav.html' });
    expect(document.querySelector('meta[name="gnav-source"')).to.be.null;
    loadArea(document);
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('some-source-string');
  });
});
