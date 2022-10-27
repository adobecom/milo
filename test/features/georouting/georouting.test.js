/* eslint-disable no-unused-expressions */
/* global describe it */
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';

import { expect } from '@esm-bundle/chai';
const { default: init, getMetadata, GeoRoutingMetadata } = await import('../../../libs/features/georouting/georouting.js');
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

const ogFetch = window.fetch;
const stubFetch = (georouting, fallbackrouting) => {
  window.fetch = stub();
  window.fetch.withArgs(`${mockConfig.locale.contentRoot}/georouting-metadata`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        text: () => getMetaHTML(georouting, fallbackrouting),
      });
    }),
  );
  window.fetch.withArgs(`${mockConfig.locale.contentRoot}/georouting.json`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockGeoroutingJson,
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
  it('Does read metadata from html properly', async () => {
    const georoutingMet = getMetadata(GeoRoutingMetadata.georouting, document);
    const fallbackRoutingMet = getMetadata(GeoRoutingMetadata.fallbackrouting, document);
    const noneMet = getMetadata('none', document);
    expect(georoutingMet).to.be.equal('on');
    expect(fallbackRoutingMet).to.be.equal('on');
    expect(noneMet).to.be.null;
  });

  it('Doesnt create a modal if GeoRouting feature is active', async () => {
    stubFetch('off', 'off');
    await init(mockConfig, stub(), stub(), stub());
    const modal = document.querySelector('.dialog-modal');
    expect(modal).to.be.null;
    restoreFetch();
  });

  it('Does create a modal if GeoRouting feature is active', async () => {
    stubFetch('on', 'on');
    await init(mockConfig, stub(), createTag, mockGetConfigRoot);
    const modal = document.querySelector('.dialog-modal');
    expect(modal).to.not.be.null;
    restoreFetch();
  });

  // it('Loads a modal on load with hash and closes when removed from hash', async () => {
  //   window.location.hash = '#milo';
  //   await waitForElement('#milo');
  //   expect(document.getElementById('milo')).to.exist;
  //   window.location.hash = '';
  //   await waitForRemoval('#milo');
  //   expect(document.getElementById('milo')).to.be.null;
  // });
  //
  // it('Closes a modal on button click', async () => {
  //   window.location.hash = '#milo';
  //   await waitForElement('#milo');
  //   const close = document.querySelector('.dialog-modal button');
  //   close.click();
  //   await waitForRemoval('#milo');
  //   expect(window.location.hash).to.be.empty;
  //   expect(document.getElementById('milo')).not.to.exist;
  // });
  //
  // it('Closes a modal on click outside modal', async () => {
  //   window.location.hash = '#milo';
  //   await waitForElement('#milo');
  //   const close = document.querySelector('.modal-curtain');
  //   close.click();
  //   await waitForRemoval('#milo');
  //   expect(window.location.hash).to.be.empty;
  //   expect(document.getElementById('milo')).not.to.exist;
  // });
  //
  // it('Closes a modal on pressing Esc', async () => {
  //   window.location.hash = '#milo';
  //   await waitForElement('#milo');
  //   await sendKeys({ press: 'Escape' });
  //   await waitForRemoval('#milo');
  //   expect(window.location.hash).to.be.empty;
  //   expect(document.getElementById('milo')).not.to.exist;
  // });
  //
  // it('Opens an inherited modal', async () => {
  //   const meta = document.createElement('meta');
  //   meta.name = '-otis';
  //   meta.content = 'https://milo.adobe.com/test/blocks/modals/mocks/otis';
  //   document.head.append(meta);
  //   window.location.hash = '#otis';
  //   await waitForElement('#otis');
  //   expect(document.getElementById('otis')).to.exist;
  //   window.location.hash = '';
  //   await waitForRemoval('#otis');
  // });
  //
  // it('Doesnt open a modal', async () => {
  //   window.location.hash = '#notthere';
  //   await delay(50);
  //   expect(document.querySelector('.dialog-modal')).to.be.null;
  //   window.location.hash = '';
  // });
  //
  // it('Keeps the same modal if already open', async () => {
  //   window.location.hash = '#milo';
  //   await waitForElement('#milo');
  //   getModal(document.getElementById('milo-modal-link'));
  //   expect(document.getElementById('milo')).to.exist;
  //   window.location.hash = '';
  //   await waitForRemoval('#milo');
  // });
  //
  // it('Gets the modal when explicitly init-ed', async () => {
  //   window.location.hash = '#milo';
  //   await waitForElement('#milo');
  //   init(document.getElementById('milo-modal-link'));
  //   expect(document.getElementById('milo')).to.exist;
  //   window.location.hash = '';
  //   await waitForRemoval('#milo');
  // });
});
