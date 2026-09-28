import { expect } from '@esm-bundle/chai';
import { getValidatedRepoOwnerOrigin } from '../../libs/utils/utils.js';

describe('getValidatedRepoOwnerOrigin', () => {
  it('returns null when repo or owner is missing', () => {
    expect(getValidatedRepoOwnerOrigin(null, 'adobecom')).to.be.null;
    expect(getValidatedRepoOwnerOrigin('milo', null)).to.be.null;
    expect(getValidatedRepoOwnerOrigin('', '')).to.be.null;
  });

  it('resolves a valid repo/owner pair to the matching aem.live origin', () => {
    expect(getValidatedRepoOwnerOrigin('milo', 'adobecom'))
      .to.equal('https://main--milo--adobecom.aem.live');
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(getValidatedRepoOwnerOrigin(' MILO ', ' AdobeCom '))
      .to.equal('https://main--milo--adobecom.aem.live');
  });

  it('rejects host-escape payloads (VULN-38270)', () => {
    const hostile = [
      ['evil.com', 'adobecom'],
      ['milo', 'evil.com'],
      ['milo@evil.com', 'adobecom'],
      ['milo', 'adobecom#evil.com'],
      ['milo', 'adobecom:evil.com'],
      ['milo/evil', 'adobecom'],
      // eslint-disable-next-line no-script-url -- payload must prove script URLs are rejected
      ['javascript:alert(1)', 'adobecom'],
    ];
    hostile.forEach(([repo, owner]) => {
      expect(getValidatedRepoOwnerOrigin(repo, owner), `${repo} / ${owner}`).to.be.null;
    });
  });

  it('rejects malformed repo/owner shapes', () => {
    const malformed = [
      ['-milo', 'adobecom'],
      ['milo-', 'adobecom'],
      ['milo', '-adobecom'],
      ['mi--lo', 'adobecom'],
      ['milo_test', 'adobecom'],
      ['milo.test', 'adobecom'],
    ];
    malformed.forEach(([repo, owner]) => {
      expect(getValidatedRepoOwnerOrigin(repo, owner), `${repo} / ${owner}`).to.be.null;
    });
  });

  it('rejects overlong values', () => {
    expect(getValidatedRepoOwnerOrigin('a'.repeat(100), 'adobecom')).to.be.null;
    expect(getValidatedRepoOwnerOrigin('milo', 'a'.repeat(100))).to.be.null;
  });

  it('does not throw on invalid punycode-like labels', () => {
    const payloads = [['xn--abc', 'adobecom'], ['milo', 'xn--a']];
    payloads.forEach(([repo, owner]) => {
      expect(() => getValidatedRepoOwnerOrigin(repo, owner), `${repo} / ${owner}`).to.not.throw();
    });
  });
});
