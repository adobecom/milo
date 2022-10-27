/* eslint-disable no-unused-expressions */
/* global describe it */
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';

import { expect } from '@esm-bundle/chai';
const { default: init, getMetadata, getCookieValueByName, GeoRoutingMetadata, GeoRoutingCookies } = await import('../../../libs/features/georouting/georouting.js');
const { locales } = await import('../../../libs/scripts/locales.js');
const { createTag } = await import('../../../libs/utils/utils.js');

const getMetaHTML = (georouting, fallbackrouting) => {
  return `<meta name="georouting" content="${georouting}">
<meta name="fallbackrouting" content="${fallbackrouting}">`
}

document.head.innerHTML = await readFile({ path: './mocks/head.html' });

const mockConfig = { locales: locales, locale: { contentRoot: window.location.href, prefix: '' } };

const mockGeoroutingJson = {
  data: [
    {
      "prefix": "",
      "text": "Are you visiting Adobe.com from outside the US? Visit your regional site for more relevant pricing, promotions and events.",
      "button": "Continue to United States",
      "akamaiCodes": "US"
    },
    {
      "prefix": "ch_de",
      "text": "Sie befinden sich außerhalb der USA? Auf der Adobe-Website für Ihre Region finden Sie Informationen zu den für Sie relevanten Preisen, Angeboten und Veranstaltungen.",
      "button": "Zur Website für die Schweiz",
      "akamaiCodes": "CH"
    },
    {
      "prefix": "ch_it",
      "text": "",
      "button": "",
      "akamaiCodes": "CH"
    },
    {
      "prefix": "ch_fr",
      "text": "Consultez-vous le site Adobe.com depuis un autre pays que les États-Unis ? Visitez votre site régional pour découvrir les tarifs appropriés, les promotions et les événements.",
      "button": "Aller sur le site suisse",
      "akamaiCodes": "CH"
    },
    {
      "prefix": "mena_en",
      "text": "blah blah blah",
      "button": "Blah",
      "akamaiCodes": "OM, PS, QA"
    }
  ]
}

const ogURLSearchParamGet = URLSearchParams.get;
const mockUserIP = (country = 'US') => {
  URLSearchParams.get = stub().withArgs('akamaiLocale').returns(country)
}
const restoreURLSearchParamGet = () => {
  URLSearchParams.get = ogURLSearchParamGet;
};

const ogFetch = window.fetch;
window.fetch = stub();
const stubFetchForGeorouting = () => {
  window.fetch.withArgs(`${mockConfig.locale.contentRoot}/georouting.json`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockGeoroutingJson,
      });
    }),
  );
};
const stubFetchForMetadata = (georouting, fallbackrouting) => {
  window.fetch.withArgs(`${mockConfig.locale.contentRoot}/georouting-metadata`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        text: () => getMetaHTML(georouting, fallbackrouting),
      });
    }),
  );
};
const restoreFetch = () => {
  window.fetch = ogFetch;
};

const mockGetConfigRoot = (config, prefix) => {
  return `${config.locale.contentRoot}/${prefix}`;
}

describe('GeoRouting', () => {
  before(() => {
    mockUserIP();
    stubFetchForGeorouting();
  });
  after(() => {
    restoreURLSearchParamGet();
    restoreFetch()
  });
  it('Does read metadata from html properly', async () => {
    // prepare
    const georoutingMet = getMetadata(GeoRoutingMetadata.georouting, document);
    const fallbackRoutingMet = getMetadata(GeoRoutingMetadata.fallbackrouting, document);
    const noneMet = getMetadata('none', document);
    // assert
    expect(georoutingMet).to.be.equal('on');
    expect(fallbackRoutingMet).to.be.equal('on');
    expect(noneMet).to.be.null;
  });

  it('Will read undefined if attempting to read unset cookie', async () => {
    // prepare
    const cookieName = 'test';
    const testcookie = getCookieValueByName(cookieName);
    // assert
    expect(testcookie).to.be.undefined
  });

  it('Will read cookie value correctly if set', async () => {
    // prepare
    const cookieName = 'test';
    document.cookie = `${cookieName}=test`
    const testcookie = getCookieValueByName(cookieName);
    // assert
    expect(testcookie).to.be.equal('test')
    // cleanup
    document.cookie = `${cookieName}=; expires= Thu, 01 Jan 1970 00:00:00 GMT`
  });

  it('Does not create a modal if GeoRouting feature is off', async () => {
    // prepare
    stubFetchForMetadata('off', 'off');
    await init(mockConfig, stub(), stub(), stub());
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
  });

  it('Does create a modal if GeoRouting feature is on', async () => {
    // prepare
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    // cleanup
    modal.dispatchEvent(new Event('close'));
  });

  it('Does not create a modal if georouting_presented cookie is set', async () => {
    // prepare
    document.cookie = `${GeoRoutingCookies.georouting_presented}=test`
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    // cleanup
    document.cookie = `${GeoRoutingCookies.georouting_presented}=; expires= Thu, 01 Jan 1970 00:00:00 GMT`
  });

  it('Does create a modal if georouting_presented cookie is set', async () => {
    // prepare
    document.cookie = `${GeoRoutingCookies.georouting_presented}=; expires= Thu, 01 Jan 1970 00:00:00 GMT`
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    // cleanup
    modal.dispatchEvent(new Event('close'));
  });
});
