module.exports = {
  BlockName: 'Media Block',
  features: [
    {
      tcid: '0',
      name: '@Media (small)',
      path: '/drafts/nala/blocks/media/media-small',
      data: {
        detailText: 'Detail M 12/15',
        h2Text: 'Heading XS 18/22 Media (small)',
        bodyText: 'Body S 16/24 Lorem ipsum dolor sit amet',
        blueButtonText: 'Learn More',
        outlineButtonText: 'Watch the Video',
      },
      tags: '@media @media-small @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Media',
      path: '/drafts/nala/blocks/media/media',
      data: {
        detailText: 'Detail M 12/15',
        h2Text: 'Heading M 24/30 Media',
        bodyText: 'Body S 16/24 Lorem ipsum dolor sit amet',
        blueButtonText: 'Learn More',
      },
      tags: '@media @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@media (large, dark)',
      path: '/drafts/nala/blocks/media/media-large-dark',
      data: {
        detailText: 'Detail L 16/20',
        h2Text: 'Heading XL 36/45 Media (large, dark)',
        bodyText: 'Body M 18/27 Lorem ipsum dolor sit amet,',
        blueButtonText: 'Learn More',
      },
      tags: '@media @media-large-dark @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: '@media (large, dark) video, autoplay infinite looping',
      path: '/drafts/nala/blocks/media/media-video-autoplay-infinite-loop',
      data: {
        detailText: 'Detail L 16/20',
        h2Text: 'Heading XL 36/45 Media (large, dark)',
        bodyText: 'Body M 18/27 Lorem ipsum dolor sit amet,',
        blueButtonText: 'Learn More',
      },
      tags: '@media @media-video @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: '@media video, autoplay loop once',
      path: '/drafts/nala/blocks/media/media-video-autoplay-loop-once',
      data: {
        detailText: 'Detail L 16/20',
        h2Text: 'Heading XL 36/45 Media (large, dark)',
        bodyText: 'Body M 18/27 Lorem ipsum dolor sit amet,',
        blueButtonText: 'Learn More',
      },
      tags: '@media @media-video @smoke @regression @milo',
    },
  ],
};
