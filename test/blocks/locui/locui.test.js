import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import { getUrlDetails } from '../../../libs/blocks/locui/utils/utils.js';
import { delay } from '../../helpers/waitfor.js';

const config = {
  codeRoot: '/libs',
  locales: {
    de: { ietf: 'de-de' },
    '': { ietf: 'en-US' },
  },
};
setConfig(config);

describe('Format URLs', () => {
  it('Gets pathname', async () => {
    const urls = [new URL('https://main--milo--adobecom.hlx.page/drafts/cmillar/test')];
    const urlDetails = await getUrlDetails(urls);
    expect(urlDetails[0].langstore.pathname).to.equal('/langstore/en/drafts/cmillar/test');
  });
});

describe('Format URLs', () => {
  it('Gets pathname', async () => {
    const urls = [new URL('https://main--milo--adobecom.hlx.page/de/drafts/cmillar/test')];
    const urlDetails = await getUrlDetails(urls);
    expect(urlDetails[0].langstore.pathname).to.equal('/langstore/de/drafts/cmillar/test');
  });
});

const configContentRoot = {
  codeRoot: '/libs',
  contentRoot: '/acrobat',
  locales: {
    de: { ietf: 'de-de' },
    '': { ietf: 'en-US' },
  },
};
setConfig(configContentRoot);
describe('Format URLs', () => {
  it('Gets pathname', async () => {
    const urls = [new URL('https://main--milo--adobecom.hlx.page/acrobat/drafts/cmillar/test')];
    const urlDetails = await getUrlDetails(urls);
    expect(urlDetails[0].langstore.pathname).to.equal('/langstore/en/acrobat/drafts/cmillar/test');
  });
});
describe('Format URLs', () => {
  it('Gets pathname', async () => {
    const urls = [new URL('https://main--milo--adobecom.hlx.page/de/acrobat/drafts/cmillar/test')];
    const urlDetails = await getUrlDetails(urls);
    expect(urlDetails[0].langstore.pathname).to.equal('/langstore/de/acrobat/drafts/cmillar/test');
  });
});
