module.exports = {
  FeatureName: 'Accordion Block',
  features: [
    {
      tcid: '0',
      name: '@accordion-container',
      path: '/drafts/nala/blocks/accordion/accordion#',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
      },
      tags: '@accordion @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@accordion(seo)',
      path: '/drafts/nala/blocks/accordion/accordion-seo#',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
      },
      tags: '@accordion @accordion-seo @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@accordion (quiet, max-width-12-desktop-large)',
      path: '/drafts/nala/blocks/accordion/accordion-quiet-max-width-12-desktop-large#',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
      },
      tags: '@accordion @accordion-quiet-max @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: '@accordion-seo-editorial',
      path: '/drafts/nala/blocks/accordion/accordion-seo-editorial',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
        outlineButtonText: 'Lorem ipsum',
        blueButtonText: 'Learn more',
      },
      tags: '@accordion @t3 @smoke @regression @milo',
    },

  ],
};
