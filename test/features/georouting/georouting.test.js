import { stub } from 'sinon';
import { expect } from '@esm-bundle/chai';
const { default: init, getCookie } = await import('../../../libs/features/georouting/georouting.js');
let { createTag, getMetadata } = await import('../../../libs/utils/utils.js');

const mockConfig = { locales: { '': {}, africa: {}, ch_de: {}, ch_fr: {}, ch_it: {}, mena_en: {}, de: {} }, locale: { contentRoot: window.location.href, prefix: '' } };

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
      "prefix": "de",
      "text": "Sie befinden sich außerhalb der USA? Auf der Adobe-Website für Ihre Region finden Sie Informationen zu den für Sie relevanten Preisen, Angeboten und Veranstaltungen.",
      "button": "Zur Website für Deutschland",
      "akamaiCodes": "DE"
    },
    {
      "prefix": "africa",
      "text": "africa blah",
      "button": "To the African Page",
      "akamaiCodes": "ZA, BW"
    },
    {
      "prefix": "mena_en",
      "text": "mena blah",
      "button": "To the Mena Page",
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

function stubHeadRequestToReturnVal(prefix, val) {
  window.fetch.withArgs(`${prefix}`, {method: 'HEAD'}).returns(
    new Promise((resolve) => {
      resolve({
        ok: val
      });
    }),
  );
}

const stubFetchForGeorouting = () => {
  window.fetch.withArgs(`/georouting.json`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockGeoroutingJson,
      });
    }),
  );
  mockGeoroutingJson.data.forEach((d) => {
    const prefix = d.prefix ? `/${d.prefix}` : '';
    stubHeadRequestToReturnVal(prefix, true);
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

  it('If session storage is us it is compared correctly', async () => {
    // prepare
    setUserCountryFromIP('US');
    sessionStorage.setItem('international', 'us');
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    //cleanup
    setUserCountryFromIP();
  });

  it('If aiming for CH page and IP in Switzerland no modal is shown', async () => {
    // prepare
    mockConfig.locale.prefix = 'ch_de'
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null
    // cleanup
    mockConfig.locale.prefix = ''
  });

  it('If aiming for US page but IP in Switzerland shows CH links and US continue', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const text = modal.querySelectorAll('.locale-text');
    expect(text).to.not.be.null;
    expect(text.length).to.be.equal(4);
    expect(text[0].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').text)
    expect(text[1].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_it').text)
    expect(text[2].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_fr').text)
    expect(text[3].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === '').text)
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(4);
    expect(links[0].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').button)
    expect(links[1].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_it').button)
    expect(links[2].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_fr').button)
    expect(links[3].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === '').button)
  });

  it('If aiming for CH page, IP in US, and session storage is DE shows DE links and CH continue', async () => {
    // prepare
    mockConfig.locale.prefix = 'ch_fr';
    setUserCountryFromIP('US');
    sessionStorage.setItem('international', 'de');
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const text = modal.querySelectorAll('.locale-text');
    expect(text).to.not.be.null;
    expect(text.length).to.be.equal(2);
    expect(text[0].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'de').text)
    expect(text[1].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_fr').text)
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(2);
    expect(links[0].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'de').button)
    expect(links[1].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_fr').button)
    // cleanup
    mockConfig.locale.prefix = '';
    setUserCountryFromIP('CH');
  });


  it('If aiming for mena_en page but IP in Botswana shows Botswana links and mena_en continue', async () => {
    // prepare
    mockConfig.locale.prefix = 'mena_en';
    setUserCountryFromIP('BW');
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const text = modal.querySelectorAll('.locale-text');
    expect(text).to.not.be.null;
    expect(text.length).to.be.equal(2);
    expect(text[0].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'africa').text)
    expect(text[1].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'mena_en').text)
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(2);
    expect(links[0].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'africa').button)
    expect(links[1].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'mena_en').button)
    // cleanup
    mockConfig.locale.prefix = '';
    setUserCountryFromIP('CH');
  });

  it('If aiming for mena_en page, IP in Botswana and cookie is ch_de shows ch_de link and mena_en continue', async () => {
    // prepare
    mockConfig.locale.prefix = 'mena_en';
    setUserCountryFromIP('BW');
    document.cookie = `international=ch_de;path=/`;
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const text = modal.querySelectorAll('.locale-text');
    expect(text).to.not.be.null;
    expect(text.length).to.be.equal(2);
    expect(text[0].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').text)
    expect(text[1].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'mena_en').text)
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(2);
    expect(links[0].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').button)
    expect(links[1].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'mena_en').button)
    // cleanup
    mockConfig.locale.prefix = '';
    setUserCountryFromIP('CH');
  });

  it('If aiming for ch_de page and storage is ch_fr no modal is shown', async () => {
    // prepare
    mockConfig.locale.prefix = 'ch_de';
    sessionStorage.setItem('international', 'ch_fr');
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    mockConfig.locale.prefix = '';
    expect(modal).to.be.null;
  });

  it('If IP is from an unknown country no modal is show', async () => {
    // prepare
    setUserCountryFromIP('NOEXIST');
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    // cleanup
    setUserCountryFromIP('CH');
  });

  it('Will not display non found link if fallback routing is off', async () => {
    // prepare
    stubFallbackMetadata('off');
    stubHeadRequestToReturnVal('/ch_it', false);
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const text = modal.querySelectorAll('.locale-text');
    expect(text).to.not.be.null;
    expect(text.length).to.be.equal(3);
    expect(text[0].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').text)
    expect(text[1].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_fr').text)
    expect(text[2].textContent).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === '').text)
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(3);
    expect(links[0].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').button)
    expect(links[1].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_fr').button)
    expect(links[2].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === '').button)
    // cleanup
    stubFallbackMetadata('on');
    stubHeadRequestToReturnVal('/ch_it', true);
  });

  it('Will show fallback links if fallbackrouting is on and page exist request fails', async () => {
    // prepare
    stubHeadRequestToReturnVal('/ch_it', false);
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const text = modal.querySelectorAll('.locale-text');
    expect(text).to.not.be.null;
    expect(text.length).to.be.equal(4);
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links.length).to.be.equal(4);
    // cleanup
    stubHeadRequestToReturnVal('/ch_it', true);
  });

  it('Will not display modal if no single link was found and if fallback routing is off', async () => {
    // prepare
    stubFallbackMetadata('off');
    stubHeadRequestToReturnVal('/ch_de', false);
    stubHeadRequestToReturnVal('/ch_it', false);
    stubHeadRequestToReturnVal('/ch_fr', false);
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    // cleanup
    stubFallbackMetadata('on');
    stubHeadRequestToReturnVal('/ch_de', true);
    stubHeadRequestToReturnVal('/ch_it', true);
    stubHeadRequestToReturnVal('/ch_fr', true);
  });

  it('Sets international and georouting_presented cookies on link click in modal', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata);
    const modal = document.querySelector('.dialog-modal');
    let cookie = getCookie('international');
    let storage = sessionStorage.getItem('international');
    // assert
    expect(modal).to.not.be.null;
    expect(cookie).to.be.undefined;
    expect(storage).to.be.null;
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links[0].text).to.be.equal( mockGeoroutingJson.data.find(d => d.prefix === 'ch_de').button);
    links[3].click();
    expect(getCookie('international')).to.be.equal('us');
    expect(sessionStorage.getItem('international')).to.be.equal('us');
  });
});
