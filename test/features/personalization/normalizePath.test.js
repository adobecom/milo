import { expect } from '@esm-bundle/chai';
import { getConfig } from '../../../libs/utils/utils.js';
import { normalizePath } from '../../../libs/features/personalization/personalization.js';

describe('normalizePath function', () => {
  const config = getConfig();
  config.locale = {
    ietf: 'en-US',
    prefix: '',
  };
  it('add forward slash when needed', async () => {
    const path = await normalizePath('path/fragment.plain.html');
    expect(path).to.equal('/path/fragment.plain.html');
  });

  it('does not localize for US page', async () => {
    const path = await normalizePath('https://main--milo--adobecom.hlx.page/path/to/fragment.plain.html');
    expect(path).to.equal('/path/to/fragment.plain.html');
  });

  it('does not localize for #_dnt', async () => {
    const path = await normalizePath('https://main--milo--adobecom.hlx.page/path/to/fragment.plain.html#_dnt');
    expect(path).to.equal('/path/to/fragment.plain.html');
  });

  it('does not localize if fragment is already localized', async () => {
    const path = await normalizePath('https://main--milo--adobecom.hlx.page/de/path/to/fragment.plain.html#_dnt');
    expect(path).to.equal('/de/path/to/fragment.plain.html');
  });

  it('does not localize json', async () => {
    const path = await normalizePath('https://main--milo--adobecom.hlx.page/path/to/manifest.json');
    expect(path).to.equal('/path/to/manifest.json');
  });

  it('does localize otherwise', async () => {
    config.locales = {
      de: {
        ietf: 'de-DE',
        prefix: '/de',
      },
    };
    config.locale = config.locales.de;
    const path = await normalizePath('https://main--milo--adobecom.hlx.page/path/to/fragment.plain.html');
    expect(path).to.equal('/de/path/to/fragment.plain.html');
  });
});
