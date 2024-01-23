import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/postPersonalization.html' });
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
setConfig(config);

describe('preview feature', () => {
  it('builds with 0 manifests', () => {
    decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
    expect(document.querySelector('.mep-popup-header h4').textContent).to.equal('0 Manifest(s) served');
  });
  it('expand and close panel, expand and close advance, remove button', () => {
    expect(document.querySelector('.mep-preview-overlay > div').className).to.equal('mep-hidden');
    document.querySelector('.mep-badge').click();
    expect(document.querySelector('.mep-preview-overlay > div').className).to.equal('');
    document.querySelector('.mep-badge').click();
    expect(document.querySelector('.mep-preview-overlay > div').className).to.equal('mep-hidden');
    document.querySelector('.mep-toggle-advanced').click();
    expect(document.querySelector('.mep-advanced-container').classList.contains('mep-advanced-open')).to.be.true;
    document.querySelector('.mep-toggle-advanced').click();
    expect(document.querySelector('.mep-advanced-container').classList.contains('mep-advanced-open')).to.be.false;
    document.querySelector('.mep-close').click();
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(0);
  });
  it('builds with multiple manifests', () => {
    config.experiments = [
      {
        variants: {
          'target-smb': {
            commands: [
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
          'target-smb',
        ],
        manifestType: 'test or promo',
        manifestOverrideName: '',
        selectedVariantName: 'target-smb',
        selectedVariant: {
          commands: [
            {
              action: 'replacecontent',
              selector: '.marquee',
              pageFilter: '',
              target: '/mep/ace0763/marquee',
            },
          ],
          replacefragment: [
            {
              selector: '/drafts/vgoodrich/fragments/highlight-replace-fragment/original-fragment',
              val: '/fragments/fragmentreplaced',
            },
          ],
          useblockcode: [
            {
              selector: 'marquee',
              val: '/mep/ace0763/marquee',
            },
          ],
          updatemetadata: [
            {
              selector: 'gnav-source',
              val: '/mep/ace0763/gnav',
            },
          ],
        },
        manifest: '/homepage/fragments/mep/selected-example.json',
        manifestUrl: 'https://main--milo--adobecom.hlx.page/drafts/vgoodrich/fragments/unit-tests/manifest.json',
      },
      {
        variants: {
          'target-smb': {
            commands: [
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
          'target-smb',
        ],
        manifestType: 'personalization',
        manifestOverrideName: 'hp',
        selectedVariantName: 'default',
        selectedVariant: 'default',
        manifest: '/homepage/fragments/mep/default-selected.json',
        manifestUrl: 'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/default-selected.json',
      },
      {
        variants: {
          all: {
            commands: [],
            replacefragment: [
              {
                selector: '/cc-shared/fragments/merch/products/photoshop/segment-blade/business/default',
                val: '/promos/2023/global/black-friday/fragments/products/photoshop/segment-card-business',
              },
            ],
          },
        },
        variantNames: [
          'all',
        ],
        manifestType: 'test or promo',
        manifestOverrideName: '2023-black-friday-global',
        run: true,
        selectedVariantName: 'all',
        selectedVariant: {
          commands: [],
          replacefragment: [
            {
              selector: '/cc-shared/fragments/merch/products/photoshop/segment-blade/business/default',
              val: '/promos/2023/global/black-friday/fragments/products/photoshop/segment-card-business',
            },
          ],
        },
        manifest: '/promos/2023/global/black-friday/black-friday-global.json',
        manifestUrl: 'https://main--cc--adobecom.hlx.page/promos/2023/global/black-friday/black-friday-global.json',
        disabled: false,
        event: {
          name: 'black-friday-global',
          start: '2023-11-10T00:00:00.000Z',
          end: '2024-11-24T00:00:00.000Z',
        },
      },
      {
        disabled: true,
        event: {
          name: 'cyber-monday-emea',
          start: '2024-11-24T00:00:00.000Z',
          end: '2024-11-24T00:00:00.000Z',
        },
        manifest: '/promos/2023/emea/cyber-monday/cyber-monday-emea.json',
        variantNames: [
          'all',
        ],
        selectedVariantName: 'default',
        selectedVariant: { commands: [] },
      },
    ];
    setConfig(config);
    decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
    expect(document.querySelector('.mep-popup-header h4').textContent).to.equal(`${config.experiments.length} Manifest(s) served`);
  });
  it('adds highlights', () => {
    expect(document.querySelector('[data-path="/fragments/fragmentreplaced"]').getAttribute('data-manifest-id')).to.equal('selected-example.json');
    expect(document.querySelector('.marquee').getAttribute('data-code-manifest-id')).to.equal('selected-example.json');
    expect(document.querySelector('header').getAttribute('data-manifest-id')).to.equal('selected-example.json');
  });
  it('adjusts highlights for merch cards', () => {
    expect(document.querySelector('merch-card').getAttribute('data-manifest-id')).to.equal('selected-example.json');
  });
  it('preselects form inputs', () => {
    expect(document.querySelector('input[name="/homepage/fragments/mep/selected-example.json"][value="target-smb"]').getAttribute('checked')).to.equal('checked');
    expect(document.querySelector('input[name="/homepage/fragments/mep/default-selected.json"][value="default"]').getAttribute('checked')).to.equal('checked');
    expect(document.querySelector('input#mepHighlightCheckbox').getAttribute('checked')).to.equal('checked');
  });
  it('updates preview button', () => {
    document.querySelector('#new-manifest').value = 'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/new-manifest.json';
    document.querySelector('input[name="/homepage/fragments/mep/selected-example.json"][value="default"]').click();
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('new-manifest.json');
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('%2Fhomepage%2Ffragments%2Fmep%2Fselected-example.json--default');
    document.querySelector('input#mepHighlightCheckbox').click();
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.not.contain('mepHighlight');
    document.querySelector('input#mepPreviewButtonCheckbox').click();
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('mepButton=off');
  });
  it('opens manifest', () => {
    document.querySelector('a.mep-edit-manifest').click();
  });
});
