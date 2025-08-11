import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';
import { restoreFetch, mockFetch } from './mocks/fetchMock.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};

setConfig(config);

const emailCollectionModule = await import('../../../libs/blocks/email-collection/email-collection.js');
const { default: init } = emailCollectionModule;

function setIms(signedIn = true) {
  window.adobeIMS = { isSignedInUser: () => signedIn };
}

describe('Email collection', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    setIms();
    mockFetch();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    restoreFetch();
  });

  it('Should populate email collection metadata object', async () => {
    const metadataObject = {
      fields: { email: 'Email address' },
      config: {
        campaignId: '1111',
        mpsSname: '1111',
        subscriptionName: 'Adobe Photoshop',
      },
    };
    const block = document.querySelector('#metadata');
    const { setMetadata, getMetadata } = emailCollectionModule;
    setMetadata(block);
    expect(getMetadata()).to.deep.equal(metadataObject);
  });

  it('Should return error message if section metadata is missing', async () => {
    const block = document.querySelector('#metadata-missing-email');
    block.nextElementSibling.remove();
    const { setMetadata } = emailCollectionModule;
    const errorMessage = setMetadata(block);
    expect(errorMessage).to.be.equal('Section metadata is missing');
  });

  it('Should return error message if email field is missing', async () => {
    const block = document.querySelector('#metadata-missing-email');
    const { setMetadata } = emailCollectionModule;
    const errorMessage = setMetadata(block);
    expect(errorMessage).to.be.equal('Section metadata is missing email/campaing-id/mps-sname/subscription-name field');
  });

  it('Should render subscription email collection block', async () => {
    const block = document.querySelector('#subscription');
    await init(block);
    const foreground = block.children[0];
    const [image, text, success, error] = foreground.children;
    const ariaLive = block.querySelector('.aria-live-container');
    const form = text.querySelector('form');

    expect(block.classList.contains('mailing-list')).to.be.true;
    expect(foreground.classList.contains('foreground')).to.be.true;
    expect(image.classList.contains('image')).to.be.true;
    expect(text.classList.contains('text')).to.be.true;
    expect(success.classList.contains('hidden')).to.be.true;
    expect(error.classList.contains('hidden')).to.be.true;
    expect(ariaLive).to.exist;
    expect(form).to.exist;
  });

  // it('Should render email only form', async () => {
  //   const block = document.querySelector('#subscription');
  //   await init(block);
  //   const foreground = block.children[0];
  //   const [image, text, success, error] = foreground.children;
  //   const ariaLive = block.querySelector('.aria-live-container');
  //   const form = text.querySelector('form');

  //   expect(foreground.classList.contains('foreground')).to.be.true;
  //   expect(image.classList.contains('image')).to.be.true;
  //   expect(text.classList.contains('text')).to.be.true;
  //   expect(success.classList.contains('hidden')).to.be.true;
  //   expect(error.classList.contains('hidden')).to.be.true;
  //   expect(ariaLive).to.exist;
  //   expect(form).to.exist;
  // });
});
