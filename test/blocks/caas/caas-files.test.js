import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getCaasFileUrls } from '../../../libs/blocks/caas/utils.js';

const urlsFor = (query) => getCaasFileUrls(new URLSearchParams(query));
const hostsOf = (urls) => Object.values(urls).map((url) => new URL(url).hostname);
const STABLE = 'https://www.adobe.com/special/chimera/caas-libs/stable';

describe('getCaasFileUrls (MWPW-210164)', () => {
  beforeEach(() => {
    window.lana = { log: sinon.stub() };
  });

  afterEach(() => {
    delete window.lana;
  });

  it('defaults to the stable CaaS libs', () => {
    expect(urlsFor('')).to.deep.equal({
      cssFile: `${STABLE}/app.css`,
      jsFile: `${STABLE}/main.min.js`,
      reactFile: `${STABLE}/react.umd.js`,
      reactDomFile: `${STABLE}/react.dom.umd.js`,
    });
    expect(window.lana.log.called).to.be.false;
  });

  it('honours legitimate caasver values', () => {
    ['beta', '0.51.5', '0.51.5-rc_1'].forEach((version) => {
      expect(urlsFor(`caasver=${version}`).jsFile, version)
        .to.equal(`https://www.adobe.com/special/chimera/caas-libs/${version}/main.min.js`);
    });
  });

  it('keeps caasver=alpha on the github pages build', () => {
    const { cssFile, jsFile } = urlsFor('caasver=alpha');
    expect(cssFile).to.equal('https://adobecom.github.io/caas/dist/app.css');
    expect(jsFile).to.equal('https://adobecom.github.io/caas/dist/main.source.js');
  });

  it('falls back to stable for caasver path-traversal payloads', () => {
    ['../../evil', '..', 'a/b', 'stable?x=1', 'stable#x', '.hidden', 'x..y'].forEach((version) => {
      const { jsFile } = urlsFor(`caasver=${encodeURIComponent(version)}`);
      expect(jsFile, version).to.equal(`${STABLE}/main.min.js`);
    });
    expect(window.lana.log.callCount).to.equal(7);
  });

  it('loads a local caashost build from the corp network', () => {
    ['mymachine', 'my-box.ams'].forEach((host) => {
      const { cssFile, jsFile } = urlsFor(`caashost=${host}`);
      expect(jsFile, host).to.equal(`http://${host}.corp.adobe.com:5000/dist/main.js`);
      expect(cssFile, host).to.equal(`http://${host}.corp.adobe.com:5000/dist/app.css`);
    });
  });

  it('ignores caashost payloads that escape the corp host and logs them', () => {
    const hostile = [
      'evil.example/x?',
      'evil.example/x#',
      'evil.example:80/x?',
      'user@evil.example/x?',
      'evil.example\\x?',
      '-evil',
      'evil..example',
    ];
    hostile.forEach((host) => {
      const urls = urlsFor(`caashost=${encodeURIComponent(host)}`);
      expect(urls.jsFile, host).to.equal(`${STABLE}/main.min.js`);
      hostsOf(urls).forEach((hostname) => expect(hostname, host).to.equal('www.adobe.com'));
    });
    expect(window.lana.log.callCount).to.equal(hostile.length);
    expect(window.lana.log.firstCall.args[0]).to.include('caashost');
  });
});
