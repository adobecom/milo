module.exports = {
  FeatureName: 'Modal Block',
  features: [
    {
      tcid: '0',
      name: '@Modal Text',
      path: '/drafts/nala/blocks/modal/modal-text-intro',
      data: {
        modalId: 'modal-text-intro',
        fragment: 'text',
        contentType: 'text (intro)',
        h2Text: 'Text (intro)',
        bodyText: 'Body M Regular Lorem ipsum dolor sit amet',
      },
      tags: '@modal @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Modal Media',
      path: '/drafts/nala/blocks/modal/modal-media',
      data: {
        modalId: 'modal-media',
        detailText: 'Detail M 12/15',
        fragment: 'media',
        contentType: 'media',
        h2Text: 'Heading M 24/30 Media',
        bodyText: 'Body S 16/24 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
      },
      tags: '@modal @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@Modal Autoplay Video',
      path: '/drafts/nala/blocks/modal/modal-autoplay-video',
      data: {
        modalId: 'modal-video-autoplay',
        detailText: 'Detail M 12/15',
        fragment: 'media',
        contentType: 'media',
        h2Text: 'Heading M 24/30 Media',
        bodyText: 'Body S 16/24 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
      },
      tags: '@modal @smoke @regression @milo',
    },
  ],
};
