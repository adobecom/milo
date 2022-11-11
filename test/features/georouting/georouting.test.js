import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';

import { expect } from '@esm-bundle/chai';
const { default: init, getCookie, GeoRoutingCookies } = await import('../../../libs/features/georouting/georouting.js');
const { locales } = await import('../../../libs/scripts/locales.js');
const { createTag, getMetadata } = await import('../../../libs/utils/utils.js');

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
      "text": "Se stai visitando Adobe.com da un’area geografica diversa dagli Stati Uniti, accedi al sito del tuo paese per informazioni più pertinenti su prezzi, promozioni ed eventi in corso.",
      "button": "Continua in Svizzera",
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
const getMetaHTML = (georouting, fallbackrouting) => {
  return `<meta name="georouting" content="${georouting}">
<meta name="fallbackrouting" content="${fallbackrouting}">`
}

let stubURLSearchParamsGet = stub(URLSearchParams.prototype, 'get');
const setUserCountryFromIP = (country = 'CH') => {
  stubURLSearchParamsGet = stubURLSearchParamsGet.withArgs('akamaiLocale').returns(country)
}

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
    setUserCountryFromIP();
    stubFetchForGeorouting();
  });
  after(() => {
    stubURLSearchParamsGet.reset()
    restoreFetch()
  });
  afterEach(() => {
    document.cookie = `international=; expires= Thu, 01 Jan 1970 00:00:00 GMT`
    sessionStorage.removeItem('international')
  })

  it('Will read undefined if attempting to read unset cookie', async () => {
    // prepare
    const cookieName = 'test';
    const testcookie = getCookie(cookieName);
    // assert
    expect(testcookie).to.be.undefined
  });

  it('Will read cookie value correctly if set', async () => {
    // prepare
    const cookieName = 'test';
    document.cookie = `${cookieName}=test`
    const testcookie = getCookie(cookieName);
    // assert
    expect(testcookie).to.be.equal('test')
  });

  it('Does not create a modal if GeoRouting feature is off', async () => {
    // prepare
    stubFetchForMetadata('off', 'off');
    await init(config, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
  });

  it.only('Does create a modal if GeoRouting feature is on', async () => {
    // prepare
    stubFetchForMetadata('on', 'off');
    await init(config, createTag, getMetadata);
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

  it('Does create a modal if georouting_presented cookie is not set', async () => {
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

  it('Does create a modal if detected country from IP is CH and url prefix is US', async () => {
    // prepare
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    // cleanup
    modal.dispatchEvent(new Event('close'));
  });

  it('Will set international cookie if no discrepancy detected', async () => {
    // prepare
    setUserCountryFromIP('US');
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    // assert
    const internationalCookie = getCookie(GeoRoutingCookies.international)
    expect(internationalCookie).to.equal('us');
  });

  it('If international cookie is us it is compared correctly', async () => {
    // prepare
    setUserCountryFromIP('US');
    document.cookie = `international=us;path=/`;
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    //cleanup
    setUserCountryFromIP();
  });

  it('Maps international cookie and locale from URL to countries correctly', async () => {
    // prepare

  });

  it.only('If aiming for US page but IP in Switzerland shows CH links and US continue', async () => {
    // prepare
    stubFetchForMetadata('on', 'off');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const links = modal.querySelectorAll('.georouting-link');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(4);
    // cleanup
    modal.dispatchEvent(new Event('close'));
  });

  it('If aiming for PA page but IP in Switzerland shows CH links and Palestine continue', async () => {
    // prepare

  });

  it('If aiming for US page but IP is from an unknown country only show US continue', async () => {
    // prepare

  });

  it('Sets international and georouting_presented cookies on link click in modal', async () => {
    // prepare

  });
});
