import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, loadArea } from '../../libs/utils/utils.js';

describe('Dynamic nav', () => {
  beforeEach(() => {
    window.sessionStorage.setItem('gnavSource', 'some-source-string');
  });

  it('Sets the gnav source in session storage on entry pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/dynamicNav/entry.html' });
    loadArea(document);
    expect(window.sessionStorage.getItem('gnavSource')).to.equal('https://main--bacom--adobecom.hlx.page/gnav/localnav-aem-sites');
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
    expect(document.querySelector('meta[name="gnav-source"').content).to.equal('https://main--bacom--adobecom.hlx.page/gnav/localnav-aem-sites');
    expect(window.sessionStorage.getItem('gnavSource')).to.be.null;
  });
});
