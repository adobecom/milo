import { stub } from 'sinon';
import { expect } from '@esm-bundle/chai';

const { default: init, getCookie } = await import('../../../libs/features/georoutingv2/georoutingv2.js');
let { getMetadata } = await import('../../../libs/utils/utils.js');
const { createTag, loadStyle, loadBlock, setConfig } = await import('../../../libs/utils/utils.js');

const mockConfig = {
  locales: {
    '': { ietf: 'us' }, ch_de: {}, ch_fr: {}, ch_it: {}, mena_en: {}, de: {}, africa: {},
  },
  locale: { contentRoot: window.location.href, prefix: '' },
  env: 'test',
  codeRoot: '/libs',
};
setConfig(mockConfig);

const mockGeoroutingJson = {
  georouting: {
    data: [
      {
        prefix: '',
        title: "You're visiting Adobe.com for {{region}}.",
        text: "Based on your location, we think you may prefer the United States website, where you'll get regional content, offerings, and pricing",
        button: 'United States',
        akamaiCodes: 'US',
        language: '',
        languageOrder: '',
        region: 'us',
      },
      {
        prefix: 'de',
        title: 'Sie besuchen Adobe.com für {{region}}.',
        text: 'Aufgrund Ihres Standorts denken wir, dass Sie die deutsche Website bevorzugen könnten, auf der Sie regionale Inhalte, Angebote und Preise finden werden',
        button: 'Deutschland',
        akamaiCodes: 'DE',
        language: '',
        languageOrder: '',
        region: 'de',
      },
      {
        prefix: 'ch_de',
        title: 'Sie besuchen Adobe.com für {{region}}.',
        text: 'Aufgrund Ihres Standorts denken wir, dass Sie die Schweizer Website bevorzugen könnten, auf der Sie regionale Inhalte, Angebote und Preise finden werden',
        button: 'Schweiz',
        akamaiCodes: 'CH',
        language: 'Deutsch',
        languageOrder: '1',
        region: 'ch',
      },
      {
        prefix: 'ch_it',
        title: 'State visitando Adobe.com per {{region}}.',
        text: 'In base alla vostra posizione, pensiamo che possiate preferire il sito web svizzero, dove troverete contenuti, offerte e prezzi regionali.',
        button: 'Svizzera',
        akamaiCodes: 'CH',
        language: 'Italiano',
        languageOrder: '3',
        region: 'ch',
      },
      {
        prefix: 'ch_fr',
        title: 'Vous visitez Adobe.com pour {{region}}.',
        text: 'En fonction de votre situation géographique, nous pensons que vous préférerez le site Web suisse, où vous trouverez un contenu, des offres et des prix régionaux.',
        button: 'Suisse',
        akamaiCodes: 'CH',
        language: 'Français',
        languageOrder: '2',
        region: 'ch',
      },
      {
        prefix: 'mena_en',
        title: "You're visiting Adobe.com for {{region}}.",
        text: "Based on your location, we think you may prefer the Middle Eastern & North African website, where you'll get regional content, offerings, and pricing",
        button: 'Middle East and North Africa',
        akamaiCodes: 'OM, PS, QA',
        language: '',
        languageOrder: '',
        region: 'mena',
      },
      {
        prefix: 'africa',
        title: "You're visiting Adobe.com for {{region}}.",
        text: "Based on your location, we think you may prefer the African website, where you'll get regional content, offerings, and pricing",
        button: 'Africa',
        akamaiCodes: 'NA, BW',
        language: '',
        languageOrder: '',
        region: 'africa',
      },
    ],
  },
  regions: {
    data: [
      {
        prefix: '',
        us: 'the United States',
        de: 'Germany',
        ch: 'Switzerland',
        mena: 'the Middle East & North Africa',
        africa: 'Africa',
      },
      {
        prefix: 'de',
        us: 'die Vereinigten Staaten',
        de: 'Deutschland',
        ch: 'die Schweiz',
        mena: 'den Nahen Osten und Nordafrika',
        africa: 'Afrika',
      },
      {
        prefix: 'ch_de',
        us: 'die Vereinigten Staaten',
        de: 'Deutschland',
        ch: 'die Schweiz',
        mena: 'den Nahen Osten und Nordafrika',
        africa: 'Afrika',
      },
      {
        prefix: 'ch_it',
        us: 'gli Stati Uniti',
        de: 'Germania',
        ch: 'la Svizzera',
        mena: '',
      },
      {
        prefix: 'ch_fr',
        us: 'les Etats-Unis',
        de: 'Allemagne',
        ch: 'la Suisse',
        mena: "le Moyen-Orient et l'Afrique du Nord",
        africa: 'Afrique',
      },
      {
        prefix: 'mena_en',
        us: 'the United States',
        de: 'Germany',
        ch: 'Switzerland',
        mena: 'the Middle East & North Africa',
        africa: 'Africa',
      },
      {
        prefix: 'africa',
        us: 'the United States',
        de: 'Germany',
        ch: 'Switzerland',
        mena: 'the Middle East & North Africa',
        africa: 'Africa',
      },
    ],
  },
};

let stubURLSearchParamsGet = stub(URLSearchParams.prototype, 'get');
const setUserCountryFromIP = (country = 'CH') => {
  stubURLSearchParamsGet = stubURLSearchParamsGet.withArgs('akamaiLocale').returns(country);
};

const ogFetch = window.fetch;
window.fetch = stub();

function stubHeadRequestToReturnVal(prefix, val) {
  window.fetch.withArgs(`${prefix}`, { method: 'HEAD' }).returns(
    new Promise((resolve) => {
      resolve({ ok: val });
    }),
  );
}

const stubFetchForGeorouting = () => {
  window.fetch.withArgs('/georoutingv2.json').returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockGeoroutingJson,
      });
    }),
  );
  mockGeoroutingJson.georouting.data.forEach((d) => {
    const prefix = d.prefix ? `/${d.prefix}` : '';
    stubHeadRequestToReturnVal(prefix, true);
  });
};
const stubFallbackMetadata = (fallbackrouting) => {
  getMetadata = stub();
  getMetadata.withArgs('fallbackrouting').returns(fallbackrouting);
};
const restoreFetch = () => {
  window.fetch = ogFetch;
};
const closeModal = () => {
  document.querySelector('.dialog-modal')?.querySelector('.dialog-close').dispatchEvent(new Event('click'));
};

describe('GeoRouting', () => {
  before(() => {
    setUserCountryFromIP();
    stubFetchForGeorouting();
  });
  after(() => {
    stubURLSearchParamsGet.reset();
    restoreFetch();
  });
  afterEach(() => {
    document.cookie = 'international=; expires= Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('international');
    closeModal();
  });

  it('Will read undefined if attempting to read unset cookie', async () => {
    // prepare
    const cookieName = 'test123';
    const testcookie = getCookie(cookieName);
    // assert
    expect(testcookie).to.be.undefined;
  });

  it('Will read cookie value correctly if set', async () => {
    // prepare
    const cookieName = 'test';
    document.cookie = `${cookieName}=test`;
    const testcookie = getCookie(cookieName);
    // assert
    expect(testcookie).to.be.equal('test');
    // cleanup
    document.cookie = 'test=; expires= Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('Does create a modal if detected country from IP is CH and url prefix is US', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
  });

  it('If session storage is us it is compared correctly', async () => {
    // prepare
    setUserCountryFromIP('US');
    sessionStorage.setItem('international', 'us');
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    // cleanup
    setUserCountryFromIP();
  });

  it('If aiming for CH page and IP in Switzerland no modal is shown', async () => {
    // prepare
    mockConfig.locale.prefix = 'ch_de';
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    // cleanup
    mockConfig.locale.prefix = '';
  });

  it('If aiming for US page but IP in Switzerland shows CH links and US continue', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const tabs = modal.querySelectorAll('.tabpanel');
    expect(tabs.length).to.be.equal(3);
    const germanTab = tabs[0];
    const frenchTab = tabs[1];
    const italianTab = tabs[2];
    const germanData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_de');
    const frenchData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_fr');
    const italianData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_it');
    const usData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === '');
    expect(germanTab.querySelector('h3').textContent).to.be.equal('Sie besuchen Adobe.com für die Vereinigten Staaten.');
    expect(germanTab.querySelector('p').textContent).to.be.equal(germanData.text);
    expect(germanTab.querySelector('.con-button').textContent).to.be.equal(germanData.button);
    expect(germanTab.querySelectorAll('a')[1].textContent).to.be.equal(usData.button);

    expect(frenchTab.querySelector('h3').textContent).to.be.equal('Vous visitez Adobe.com pour les Etats-Unis.');
    expect(frenchTab.querySelector('p').textContent).to.be.equal(frenchData.text);
    expect(frenchTab.querySelector('.con-button').textContent).to.be.equal(frenchData.button);
    expect(frenchTab.querySelectorAll('a')[1].textContent).to.be.equal(usData.button);

    expect(italianTab.querySelector('h3').textContent).to.be.equal('State visitando Adobe.com per gli Stati Uniti.');
    expect(italianTab.querySelector('p').textContent).to.be.equal(italianData.text);
    expect(italianTab.querySelector('.con-button').textContent).to.be.equal(italianData.button);
    expect(italianTab.querySelectorAll('a')[1].textContent).to.be.equal(usData.button);
  });

  it('If aiming for CH page, IP in US, and session storage is DE shows DE links and CH continue', async () => {
    // prepare
    mockConfig.locale.prefix = 'ch_fr';
    setUserCountryFromIP('US');
    sessionStorage.setItem('international', 'de');
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const wrapper = document.querySelector('.georouting-wrapper');
    // assert
    const swissFrenchData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_fr');
    const germanData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'de');
    expect(wrapper.querySelector('h3').textContent).to.be.equal('Sie besuchen Adobe.com für die Schweiz.');
    expect(wrapper.querySelector('p').textContent).to.be.equal(germanData.text);
    expect(wrapper.querySelector('.con-button').textContent).to.be.equal(germanData.button);
    expect(wrapper.querySelectorAll('a')[1].textContent).to.be.equal(swissFrenchData.button);
    // cleanup
    mockConfig.locale.prefix = '';
    setUserCountryFromIP('CH');
  });

  it('If aiming for mena_en page but IP in Botswana shows Botswana links and mena_en continue', async () => {
    // prepare
    mockConfig.locale.prefix = 'mena_en';
    setUserCountryFromIP('BW');
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const wrapper = document.querySelector('.georouting-wrapper');
    // assert
    const tabs = wrapper.querySelectorAll('.tabpanel');
    expect(tabs.length).to.be.equal(0);
    const africanData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'africa');
    const menaData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'mena_en');
    expect(wrapper.querySelector('h3').textContent).to.be.equal('You\'re visiting Adobe.com for the Middle East & North Africa.');
    expect(wrapper.querySelector('p').textContent).to.be.equal(africanData.text);
    expect(wrapper.querySelector('.con-button').textContent).to.be.equal(africanData.button);
    expect(wrapper.querySelectorAll('a')[1].textContent).to.be.equal(menaData.button);
    // cleanup
    mockConfig.locale.prefix = '';
    setUserCountryFromIP('CH');
  });

  it('If aiming for mena_en page, IP in Botswana and cookie is ch_de shows ch_de link and mena_en continue', async () => {
    // prepare
    mockConfig.locale.prefix = 'mena_en';
    setUserCountryFromIP('BW');
    document.cookie = 'international=ch_de;path=/';
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const wrapper = document.querySelector('.georouting-wrapper');
    // assert
    const tabs = wrapper.querySelectorAll('.tabpanel');
    expect(tabs.length).to.be.equal(0);
    const swissGermanData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_de');
    const menaData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'mena_en');
    expect(wrapper.querySelector('h3').textContent).to.be.equal('Sie besuchen Adobe.com für den Nahen Osten und Nordafrika.');
    expect(wrapper.querySelector('p').textContent).to.be.equal(swissGermanData.text);
    expect(wrapper.querySelector('.con-button').textContent).to.be.equal(swissGermanData.button);
    expect(wrapper.querySelectorAll('a')[1].textContent).to.be.equal(menaData.button);
    // cleanup
    mockConfig.locale.prefix = '';
    setUserCountryFromIP('CH');
  });

  it('If aiming for ch_de page and storage is ch_fr no modal is shown', async () => {
    // prepare
    mockConfig.locale.prefix = 'ch_de';
    sessionStorage.setItem('international', 'ch_fr');
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    mockConfig.locale.prefix = '';
    expect(modal).to.be.null;
  });

  it('If IP is from an unknown country no modal is show', async () => {
    // prepare
    setUserCountryFromIP('NOEXIST');
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
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
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    const tabs = modal.querySelectorAll('.tabpanel');
    expect(tabs.length).to.be.equal(2);
    const germanTab = tabs[0];
    const frenchTab = tabs[1];
    const germanData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_de');
    const frenchData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_fr');
    const usData = mockGeoroutingJson.georouting.data.find((d) => d.prefix === '');
    expect(germanTab.querySelector('h3').textContent).to.be.equal('Sie besuchen Adobe.com für die Vereinigten Staaten.');
    expect(germanTab.querySelector('p').textContent).to.be.equal(germanData.text);
    expect(germanTab.querySelector('.con-button').textContent).to.be.equal(germanData.button);
    expect(germanTab.querySelectorAll('a')[1].textContent).to.be.equal(usData.button);

    expect(frenchTab.querySelector('h3').textContent).to.be.equal('Vous visitez Adobe.com pour les Etats-Unis.');
    expect(frenchTab.querySelector('p').textContent).to.be.equal(frenchData.text);
    expect(frenchTab.querySelector('.con-button').textContent).to.be.equal(frenchData.button);
    expect(frenchTab.querySelectorAll('a')[1].textContent).to.be.equal(usData.button);
    // cleanup
    stubFallbackMetadata('on');
    stubHeadRequestToReturnVal('/ch_it', true);
  });

  it('Will show fallback links if fallbackrouting is on and page exist request fails', async () => {
    // prepare
    stubHeadRequestToReturnVal('/ch_it', false);
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.not.be.null;
    const tabs = modal.querySelectorAll('.tabpanel');
    expect(tabs.length).to.be.equal(3);
    // cleanup
    stubHeadRequestToReturnVal('/ch_it', true);
  });

  it('Will not display modal if no single link was found and if fallback routing is off', async () => {
    // prepare
    stubFallbackMetadata('off');
    stubHeadRequestToReturnVal('/ch_de', false);
    stubHeadRequestToReturnVal('/ch_it', false);
    stubHeadRequestToReturnVal('/ch_fr', false);
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    // assert
    expect(modal).to.be.null;
    // cleanup
    stubFallbackMetadata('on');
    stubHeadRequestToReturnVal('/ch_de', true);
    stubHeadRequestToReturnVal('/ch_it', true);
    stubHeadRequestToReturnVal('/ch_fr', true);
  });

  it('Closes picker properly', async () => {
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    const cookie = getCookie('international');
    const storage = sessionStorage.getItem('international');
    // assert
    expect(modal).to.not.be.null;
    expect(cookie).to.be.undefined;
    expect(storage).to.be.null;
    const links = modal.querySelectorAll('a');
    links[0].click();
    const picker = document.querySelector('.locale-modal-v2 .picker');
    expect(picker).to.not.be.null;
    const pickersOptions = picker.querySelectorAll('a');
    expect(pickersOptions.length).to.be.equal(3);
    expect(pickersOptions[0].textContent).to.be.equal('Schweiz - Deutsch');
    expect(pickersOptions[1].textContent).to.be.equal('Schweiz - Français');
    expect(pickersOptions[2].textContent).to.be.equal('Schweiz - Italiano');
    modal.click();
    expect(document.querySelector('.picker')).to.be.null;
  });

  it('Sets international and georouting_presented cookies on link click in modal', async () => {
    // prepare
    await init(mockConfig, createTag, getMetadata, loadBlock, loadStyle);
    const modal = document.querySelector('.dialog-modal');
    const cookie = getCookie('international');
    const storage = sessionStorage.getItem('international');
    // assert
    expect(modal).to.not.be.null;
    expect(cookie).to.be.undefined;
    expect(storage).to.be.null;
    const links = modal.querySelectorAll('a');
    expect(links).to.not.be.null;
    expect(links[0].text).to.be.equal(mockGeoroutingJson.georouting.data.find((d) => d.prefix === 'ch_de').button);
    links[1].click();
    expect(getCookie('international')).to.be.equal('us');
    expect(sessionStorage.getItem('international')).to.be.equal('us');
  });
});
