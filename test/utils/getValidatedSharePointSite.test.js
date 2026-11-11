import { expect } from '@esm-bundle/chai';
import { getValidatedSharePointSite } from '../../libs/utils/utils.js';

// Real production shape, confirmed against
// main--milo--adobecom.aem.live/.milo/config.json.
const VALID_SITE = 'https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee,11111111-2222-3333-4444-555555555555';

describe('getValidatedSharePointSite', () => {
  it('returns null when site is missing', () => {
    expect(getValidatedSharePointSite(null)).to.be.null;
    expect(getValidatedSharePointSite(undefined)).to.be.null;
    expect(getValidatedSharePointSite('')).to.be.null;
  });

  it('returns the site verbatim when it matches Adobe\'s Graph/SharePoint host', () => {
    expect(getValidatedSharePointSite(VALID_SITE)).to.equal(VALID_SITE);
  });

  it('rejects a client-fetched config pointing straight at an attacker host (VULN-38270 PoC payload)', () => {
    expect(getValidatedSharePointSite('https://attacker-collector.example')).to.be.null;
    expect(getValidatedSharePointSite('https://webhook.site/00000000-0000-0000-0000-000000000000')).to.be.null;
  });

  it('rejects a Graph-shaped URL served from a non-Microsoft origin', () => {
    expect(getValidatedSharePointSite(
      'https://evil.com/v1.0/sites/adobe.sharepoint.com,aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee,11111111-2222-3333-4444-555555555555',
    )).to.be.null;
  });

  it('rejects a real Graph origin pointed at a non-Adobe SharePoint tenant', () => {
    expect(getValidatedSharePointSite(
      'https://graph.microsoft.com/v1.0/sites/evil.sharepoint.com,aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee,11111111-2222-3333-4444-555555555555',
    )).to.be.null;
  });

  it('rejects a Graph origin used for an unrelated resource path', () => {
    expect(getValidatedSharePointSite('https://graph.microsoft.com/v1.0/me')).to.be.null;
  });

  it('rejects subdomain-spoofing lookalikes', () => {
    const lookalikes = [
      'https://graph.microsoft.com.evil.com/v1.0/sites/adobe.sharepoint.com,a,b',
      'https://notgraph.microsoft.com/v1.0/sites/adobe.sharepoint.com,a,b',
      'https://graph.microsoft.com@evil.com/v1.0/sites/adobe.sharepoint.com,a,b',
    ];
    lookalikes.forEach((site) => {
      expect(getValidatedSharePointSite(site), site).to.be.null;
    });
  });

  it('rejects trailing-path injection after the valid segment', () => {
    expect(getValidatedSharePointSite(`${VALID_SITE}/../../evil`)).to.be.null;
    expect(getValidatedSharePointSite(`${VALID_SITE}?redirect=https://evil.com`)).to.be.null;
  });

  it('rejects the correct origin/tenant with malformed GUID segments', () => {
    const malformed = [
      'https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,a,b',
      'https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee,not-a-guid',
      'https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,,',
    ];
    malformed.forEach((site) => {
      expect(getValidatedSharePointSite(site), site).to.be.null;
    });
  });

  it('rejects scheme downgrade and is case-sensitive on the host', () => {
    expect(getValidatedSharePointSite(VALID_SITE.replace('https://', 'http://'))).to.be.null;
    expect(getValidatedSharePointSite(VALID_SITE.toUpperCase())).to.be.null;
  });

  it('does not throw on malformed/non-URL payloads', () => {
    const payloads = [
      // eslint-disable-next-line no-script-url -- payload must prove script URLs are rejected
      'javascript:alert(1)',
      'not a url',
      42,
      {},
    ];
    payloads.forEach((site) => {
      expect(() => getValidatedSharePointSite(site), JSON.stringify(site)).to.not.throw();
      expect(getValidatedSharePointSite(site), JSON.stringify(site)).to.be.null;
    });
  });
});
