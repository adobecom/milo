// TEMP: `mepnext=on` is required only while the mep-next overlay is gated behind
// it (utils.js — "Require ?mepnext=on to enable mep-next preview"). Remove it
// from these paths once that gate is dropped and mep-next is the default preview.
//
// Host note: these paths are pinned to the `.aem.page` preview host (not the
// suite's default `.aem.live` baseURL) because the overlay now requires Sidekick
// auth on the public `.aem.live` edge; `.aem.page` is a preview surface where it
// runs ungated. Branch code still loads via the `milolibs` param (MILO_LIBS).
module.exports = {
  name: 'check mep-next button',
  features: [
    {
      tcid: '0',
      name: '@open_mep_button',
      desc: 'the mep button should open',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext0 @mep @smoke @regression @milo ',
    },
    {
      tcid: '1',
      name: '@mep_button_requires_param',
      desc: 'the mep button should only appear with the mep URL parameter',
      fullURL: 'https://milo.adobe.com/drafts/nala/features/personalization/mep-next-button/test-page-1',
      data: {},
      tags: '@mepnext1 @mep @smoke @regression @milo ',
    },
    {
      tcid: '2',
      name: '@mep_button_close',
      desc: 'the close button should hide the mep drawer',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext2 @mep @smoke @regression @milo ',
    },
    {
      tcid: '3',
      name: '@mep_button_tabs',
      desc: 'the Actions and Summary tabs should switch content',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext3 @mep @smoke @regression @milo ',
    },
    {
      tcid: '4',
      name: '@mep_button_highlight_toggle',
      desc: 'toggling MEP highlight should set the highlight data attribute on the body',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext4 @mep @smoke @regression @milo ',
    },
    {
      tcid: '5',
      name: '@mep_button_card_expand',
      desc: 'clicking a card header should expand and collapse the card',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext5 @mep @smoke @regression @milo ',
    },
    {
      tcid: '6',
      name: '@mep_button_preview_highlight_param',
      desc: 'enabling MEP highlight should add the mepHighlight param to the Preview button',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext6 @mep @smoke @regression @milo ',
    },
    {
      tcid: '7',
      name: '@mep_button_preview_link_toggle',
      desc: 'enabling the Preview Link toggle should add mepButton=off to the Preview button',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext7 @mep @smoke @regression @milo ',
    },
    {
      tcid: '8',
      name: '@mep_button_summary_tab',
      desc: 'the Summary tab should render the summary cards',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: {},
      tags: '@mepnext8 @mep @smoke @regression @milo ',
    },
    {
      tcid: '9',
      name: '@mep_button_load_manifest',
      desc: 'loading a manifest via the Load Manifest field should apply it to the previewed page',
      path: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/test-page-1?mep&mepnext=on',
      data: { pathToManifest: 'https://main--milo--adobecom.aem.page/drafts/nala/features/personalization/mep-next-button/manifests/manifest-added.json' },
      tags: '@mepnext9 @mep @smoke @regression @milo ',
    },
  ],
};
