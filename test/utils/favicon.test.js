import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitFor } from '../helpers/waitfor.js';
import { setConfig, createTag, getMetadata } from '../../libs/utils/utils.js';
import loadFavIcons from '../../libs/utils/favicon.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Favicon', () => {
  it('sets all default favicon props', async () => {
    const config = setConfig({});

    const faviconEl = document.head.querySelector('link[rel="icon"]');
    loadFavIcons(createTag, config, getMetadata);
    const expected = 'http://localhost:2000/img/favicons/favicon.ico';
    waitFor(() => faviconEl.href === expected);
    expect(faviconEl.href).to.equal(expected);
  });

  it('sets metadata favicon', async () => {
    const meta = createTag('meta', { name: 'favicon', content: 'otis' });
    document.head.append(meta);
    const config = setConfig({});

    const faviconEl = document.head.querySelector('link[rel="icon"]');
    loadFavIcons(createTag, config, getMetadata);
    const expected = 'http://localhost:2000/img/favicons/otis.ico';
    waitFor(() => faviconEl.href === expected);
    expect(faviconEl.href).to.equal(expected);
  });
});
