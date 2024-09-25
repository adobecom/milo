module.exports = {
  name: 'Marquee Anchors Block',
  features: [
    {
      tcid: '0',
      name: 'Marquee Anchors',
      path: '/drafts/nala/blocks/marquee/marquee-anchors',
      data: {
        detailText: 'Heading M Bold 24/30',
        h2Text: 'Heading XL Bold (36/45) Lorem ipsum (Image Background)',
        bodyText: 'Lorem ipsum dolor sit amet,.',
        outlineButtonText: 'Lorem ipsum',
        blueButtonText: 'Call to action',
        anchors: {
          linkCount: 4,
          headerText: 'Anchors header (optional)',
          footerText: 'Anchors footer What we offer (optional)',
          howTo: {
            h4Text: 'How to',
            linkText: 'Link to a section with header “How To”',
            href: 'http://how-to-block/',
          },
          text: {
            h4Text: 'Text',
            linkText: 'Link to a section with header “Text”',
            href: 'http://text-block/',
          },
          media: {
            h4Text: 'Media',
            linkText: 'Link to a section with header “Media”',
            href: 'http://media-block/',
          },
          linkToAdobe: {
            h4Text: 'Link to Adobe',
            linkText: 'Link to a new page',
            href: 'https://adobe.com/',
          },
        },
      },
      tags: '@marquee @marquee-anchors @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: 'Marquee Anchors (Transparent)',
      path: '/drafts/nala/blocks/marquee/marquee-anchors-transparent',
      data: {
        detailText: 'Heading M Bold 24/30',
        h2Text: 'Heading XL Bold (36/45) Lorem ipsum (Image Background)',
        bodyText: 'Lorem ipsum dolor sit amet.',
        outlineButtonText: 'Lorem ipsum',
        blueButtonText: 'Call to action',
        anchors: {
          linkCount: 4,
          headerText: 'Anchors header (optional)',
          footerText: 'Anchors footer What we offer (optional)',
          howTo: {
            h4Text: 'How to',
            linkText: 'Link to a section with header “How To”',
            href: 'http://how-to-block/',
          },
          text: {
            h4Text: 'Text',
            linkText: 'Link to a section with header “Text”',
            href: 'http://text-block/',
          },
          media: {
            h4Text: 'Media',
            linkText: 'Link to a section with header “Media”',
            href: 'http://media-block/',
          },
          linkToAdobe: {
            h4Text: 'Link to Adobe',
            linkText: 'Link to a new page',
            href: 'https://adobe.com/',
          },
        },
      },
      tags: '@marquee @marquee-anchors @smoke @regression @milo',
    },
  ],
};
