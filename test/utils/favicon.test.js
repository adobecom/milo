import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitFor } from '../helpers/waitfor.js';

import { getConfig, setConfig } from '../../libs/utils/utils.js';
import loadFavIcons from '../../libs/utils/favicon.js';

describe('Favicon', () => {
  beforeEach(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    setConfig({});
  });

  it('sets all default favicon props', async () => {
    const getMetadata = stub().withArgs('favicon').returns(null);
    const faviconEl = document.head.querySelector('link[rel="icon"]');
    loadFavIcons({ getConfig, getMetadata });
    const expected = 'http://localhost:2000/img/favicons/favicon.ico';
    waitFor(() => faviconEl.href === expected);
    expect(faviconEl.href).to.equal(expected);
  });

  it('sets metadata favicon', async () => {
    const getMetadata = stub().withArgs('favicon').returns('otis');
    const faviconEl = document.head.querySelector('link[rel="icon"]');
    loadFavIcons({ getConfig, getMetadata });
    const expected = 'http://localhost:2000/img/favicons/otis.ico';
    waitFor(() => faviconEl.href === expected);
    expect(faviconEl.href).to.equal(expected);
  });
});
