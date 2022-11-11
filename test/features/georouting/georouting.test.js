import { stub } from 'sinon';
import { expect } from '@esm-bundle/chai';
const { default: init, getCookie } = await import('../../../libs/features/georouting/georouting.js');
let { createTag, getMetadata } = await import('../../../libs/utils/utils.js');

const mockConfig = { locales: {ar: {}, ca: {}, '': {}, africa: {}, ch_de: {}, ch_fr: {}, ch_it: {}, au: {} }, locale: { contentRoot: window.location.href, prefix: '' } };

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

let stubURLSearchParamsGet = stub(URLSearchParams.prototype, 'get');
const setUserCountryFromIP = (country = 'CH') => {
  stubURLSearchParamsGet = stubURLSearchParamsGet.withArgs('akamaiLocale').returns(country)
}

const ogFetch = window.fetch;
window.fetch = stub();
const stubFetchForGeorouting = () => {
  window.fetch.withArgs(`${origin}/georouting.json`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockGeoroutingJson,
      });
    }),
  );
  mockGeoroutingJson.data.forEach((d) => {
    const prefix = d.prefix ? `/${d.prefix}` : '';
    window.fetch.withArgs(`${prefix}`, { method: 'HEAD' }).returns(
      new Promise((resolve) => {
        resolve({
          ok: true
        });
      }),
    );
  })

};
const stubFallbackMetadata = (fallbackrouting) => {
  getMetadata = stub();
  getMetadata.withArgs('fallbackrouting').returns(fallbackrouting)
};
const restoreFetch = () => {
  window.fetch = ogFetch;
};
const closeModal = () => {
  document.querySelector('.dialog-modal')?.querySelector('.dialog-close').dispatchEvent(new Event('click'));
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
    closeModal();
  })

  it('Will read undefined if attempting to read unset cookie', async () => {
    // prepare
    const cookieName = 'test123';
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
    // cleanup
    document.cookie = `test=; expires= Thu, 01 Jan 1970 00:00:00 GMT`
  });

  it('Does create a modal if detected country from IP is CH and url prefix is US', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
  });

  it('If international cookie is us it is compared correctly', async () => {
    // prepare
    setUserCountryFromIP('US');
    document.cookie = `international=us;path=/`;
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    //cleanup
    setUserCountryFromIP();
  });

  it('Maps international cookie and locale from URL to countries correctly', async () => {
    // prepare

  });

  it('If aiming for US page but IP in Switzerland shows CH links and US continue', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    closeModal();
    expect(modal).to.not.be.null;
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(4);
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
