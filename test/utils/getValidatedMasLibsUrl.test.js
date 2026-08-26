import { expect } from '@esm-bundle/chai';
import { getValidatedMasLibsUrl } from '../../libs/utils/utils.js';

describe('getValidatedMasLibsUrl', () => {
  it('returns null when maslibs is missing or empty', () => {
    expect(getValidatedMasLibsUrl(null)).to.be.null;
    expect(getValidatedMasLibsUrl('')).to.be.null;
    expect(getValidatedMasLibsUrl('   ')).to.be.null;
  });

  it('resolves the local and main shortcuts', () => {
    expect(getValidatedMasLibsUrl('local')).to.equal('http://localhost:3000');
    expect(getValidatedMasLibsUrl('main')).to.equal('https://main--mas--adobecom.aem.live');
    expect(getValidatedMasLibsUrl(' MAIN ')).to.equal('https://main--mas--adobecom.aem.live');
  });

  it('resolves a simple branch against mas--adobecom', () => {
    expect(getValidatedMasLibsUrl('mwpw-202151')).to.equal('https://mwpw-202151--mas--adobecom.aem.live');
  });

  it('resolves a full branch--repo--owner triple', () => {
    expect(getValidatedMasLibsUrl('feature--other--repo')).to.equal('https://feature--other--repo.aem.live');
  });

  it('rejects host-escape payloads (VULN-36379)', () => {
    const hostile = [
      'evil.com',
      'cdn.jsdelivr.net/gh/u/r@main--mas--aem',
      'evil.com#',
      'a--b@evil.com',
      'evil.com:8080/x--y',
      // eslint-disable-next-line no-script-url -- payload must prove script URLs are rejected
      'javascript:alert(1)',
    ];
    hostile.forEach((payload) => {
      expect(getValidatedMasLibsUrl(payload), payload).to.be.null;
    });
  });

  it('rejects malformed branch shapes', () => {
    const malformed = ['a----b', '-a', 'a-', 'a--', 'a--b--c--d', 'a_b'];
    malformed.forEach((payload) => {
      expect(getValidatedMasLibsUrl(payload), payload).to.be.null;
    });
  });

  it('does not throw on invalid punycode labels', () => {
    const payloads = ['xn--abc', 'xn--a', 'xn--0', 'xn--b--c', 'xn--aa--bb'];
    payloads.forEach((payload) => {
      expect(() => getValidatedMasLibsUrl(payload), payload).to.not.throw();
    });
  });

  it('rejects overlong values', () => {
    expect(getValidatedMasLibsUrl('a'.repeat(200))).to.be.null;
  });
});
