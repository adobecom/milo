import { expect } from '@esm-bundle/chai';

const { parseUrlInfo } = await import('../../../tools/loc/utils.js');

const REFERRER = encodeURIComponent('https://adobe.sharepoint.com/:x:/r/sites/adobecom/project.xlsx');
const toolUrl = (params) => `https://milo.adobe.com/tools/loc/index.html?${params}`;

describe('tools/loc parseUrlInfo (MWPW-210165)', () => {
  it('resolves a trusted owner/repo/ref to its aem.page origin', () => {
    const info = parseUrlInfo(toolUrl(`referrer=${REFERRER}&owner=adobecom&repo=cc&ref=stage`));
    expect(info.origin).to.equal('https://stage--cc--adobecom.aem.page');
    expect(info.isValid()).to.be.true;
  });

  it('supports the project=<repo>--<owner> shorthand and the adobe owner', () => {
    const info = parseUrlInfo(toolUrl(`referrer=${REFERRER}&project=aem-trials--adobe`));
    expect(info.origin).to.equal('https://main--aem-trials--adobe.aem.page');
    expect(info.isValid()).to.be.true;
  });

  it('rejects config hosted by an untrusted owner', () => {
    const info = parseUrlInfo(toolUrl(`referrer=${REFERRER}&owner=attacker&repo=evil`));
    expect(info.origin).to.be.null;
    expect(info.isValid()).to.be.false;
  });

  it('rejects host-escape payloads in owner/repo/ref', () => {
    const payloads = [
      'owner=adobecom&repo=cc&ref=evil.example%2F',
      'owner=adobecom&repo=cc&ref=evil.example%23',
      'owner=adobecom&repo=evil.example%2F&ref=main',
      'owner=adobecom.evil.example&repo=cc',
    ];
    payloads.forEach((params) => {
      const info = parseUrlInfo(toolUrl(`referrer=${REFERRER}&${params}`));
      expect(info.origin, params).to.be.null;
      expect(info.isValid(), params).to.be.false;
    });
  });

  it('rejects a referrer that is not Adobe SharePoint, or is not a URL', () => {
    ['https%3A%2F%2Fevil.example%2Fproject.xlsx', 'not-a-url'].forEach((referrer) => {
      const info = parseUrlInfo(toolUrl(`referrer=${referrer}&owner=adobecom&repo=cc`));
      expect(info.isValid(), referrer).to.be.false;
    });
  });

  it('is invalid when required params are missing', () => {
    expect(parseUrlInfo(toolUrl('owner=adobecom&repo=cc')).isValid()).to.be.false;
    expect(parseUrlInfo(toolUrl(`referrer=${REFERRER}`)).isValid()).to.be.false;
  });
});
