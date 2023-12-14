import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
const { default: decoratePreviewMode } = await import('../../../libs/features/personalization/preview.js');
const { setConfig, MILO_EVENTS } = await import('../../../libs/utils/utils.js');

const config = {
  miloLibs: 'https://main--milo--adobecom.hlx.live/libs',
  codeRoot: 'https://main--homepage--adobecom.hlx.live/homepage',
  mep: {
    preview: true,
    override: '',
    highlight: true,
  },
};
describe('preview feature', () => {
  it('builds with 0 manifests', () => {
    setConfig(config);
    decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
    expect(document.querySelector('.mep-popup-header h4').textContent).to.equal('0 Manifest(s) served');
  });
  it('builds with 1 manifest and no chosen variant', () => {
    document.querySelector('.mep-preview-overlay')?.remove();
    config.experiments = [
      {
        variants: {
          'target-apro-twp-abdn': {
            commands: [
              {
                action: 'replacecontent',
                selector: 'main>div:nth-of-type(3)',
                pageFilter: '',
                target: 'https://main--homepage--adobecom.hlx.page/homepage/fragments/loggedout/personalization/pods/section-personalization-pods',
              },
              {
                action: 'replacecontent',
                selector: 'main>div:nth-of-type(1)',
                pageFilter: '',
                target: 'https://main--homepage--adobecom.hlx.page/homepage/fragments/loggedout/personalization/marquees/apro-twp-abandon',
              },
            ],
          },
        },
        variantNames: [
          'target-apro-twp-abdn',
        ],
        manifestType: 'test or promo',
        manifestOverrideName: 'hp',
        selectedVariantName: 'default',
        selectedVariant: 'default',
        manifest: '/homepage/fragments/mep/hp.json',
        manifestUrl: 'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp.json',
      },
    ];
    setConfig(config);
    decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
    expect(document.querySelector('.mep-popup-header h4').textContent).to.equal('1 Manifest(s) served');
  });
  it('builds with 1 manifest and a chosen variant', () => {
    document.querySelector('.mep-preview-overlay')?.remove();
    config.experiments = [
      {
        variants: {
          'target-apro-twp-abdn': {
            commands: [
              {
                action: 'replacecontent',
                selector: 'main>div:nth-of-type(3)',
                pageFilter: '',
                target: 'https://main--homepage--adobecom.hlx.page/homepage/fragments/loggedout/personalization/pods/section-personalization-pods',
              },
              {
                action: 'replacecontent',
                selector: 'main>div:nth-of-type(1)',
                pageFilter: '',
                target: 'https://main--homepage--adobecom.hlx.page/homepage/fragments/loggedout/personalization/marquees/apro-twp-abandon',
              },
            ],
          },
        },
        variantNames: [
          'target-apro-twp-abdn',
        ],
        manifestType: 'personalization',
        manifestOverrideName: 'hp',
        selectedVariantName: 'target-apro-twp-abdn',
        selectedVariant: 'target-apro-twp-abdn',
        manifest: '/homepage/fragments/mep/hp.json',
        manifestUrl: 'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp.json',
      },
    ];
    setConfig(config);
    decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
    expect(document.querySelector('.mep-popup-header h4').textContent).to.equal('1 Manifest(s) served');
  });
  it('updates preview button', () => {
    document.querySelector('.mep-preview-overlay')?.remove();
    config.experiments = [
      {
        variants: {
          'target-apro-twp-abdn': {
            commands: [
              {
                action: 'replacecontent',
                selector: 'main>div:nth-of-type(3)',
                pageFilter: '',
                target: 'https://main--homepage--adobecom.hlx.page/homepage/fragments/loggedout/personalization/pods/section-personalization-pods',
              },
              {
                action: 'replacecontent',
                selector: 'main>div:nth-of-type(1)',
                pageFilter: '',
                target: 'https://main--homepage--adobecom.hlx.page/homepage/fragments/loggedout/personalization/marquees/apro-twp-abandon',
              },
            ],
          },
        },
        variantNames: [
          'target-apro-twp-abdn',
        ],
        manifestType: 'personalization',
        manifestOverrideName: 'hp',
        selectedVariantName: 'target-apro-twp-abdn',
        selectedVariant: 'target-apro-twp-abdn',
        manifest: '/homepage/fragments/mep/hp.json',
        manifestUrl: 'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp.json',
      },
    ];
    setConfig(config);
    decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
    expect(document.querySelector('.mep-popup-header h4').textContent).to.equal('1 Manifest(s) served');
  });
  it('updates preview button');
});
