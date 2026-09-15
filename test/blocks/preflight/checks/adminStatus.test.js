import { expect } from '@esm-bundle/chai';
import { getAdminUrl } from '../../../../libs/blocks/preflight/checks/adminStatus.js';

describe('preflight adminStatus getAdminUrl', () => {
  it('resolves localhost to main--milo--adobecom', () => {
    const url = getAdminUrl(new URL('http://localhost:6456/x'), 'status');
    expect(url).to.equal('https://admin.hlx.page/status/adobecom/milo/main/x?editUrl=auto');
  });

  it('resolves a real aem.page URL', () => {
    const url = getAdminUrl(new URL('https://main--milo--adobecom.aem.page/a/b'), 'status');
    expect(url).to.equal('https://admin.hlx.page/status/adobecom/milo/main/a/b?editUrl=auto');
  });

  it('uses the cross-repo owner/repo/branch for /federal/ paths', () => {
    const url = getAdminUrl(new URL('https://main--milo--adobecom.aem.page/federal/x'), 'status');
    expect(url).to.equal('https://admin.hlx.page/status/adobecom/federal/main/federal/x?editUrl=auto');
  });
});
