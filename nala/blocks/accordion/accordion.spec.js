module.exports = {
  FeatureName: 'Accordion Block',
  features: [
    {
      tcid: '0',
      name: '@accordion-container',
      path: '/drafts/nala/blocks/accordion/accordion',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
      },
      tags: '@accordion @t1 @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@accordion(seo)',
      path: '/drafts/nala/blocks/accordion/accordion-seo',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
      },
      tags: '@accordion @2 @accordion-seo @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@accordion (quiet, max-width-12-desktop-large)',
      path: '/drafts/nala/blocks/accordion/accordion-quiet-max-width-12-desktop-large',
      data: {
        headers: 3,
        heading0: 'How do I compress a PDF without losing quality?',
        heading1: 'What size PDFs can I compress?',
        heading2: 'How do I check my PDF file size?',
      },
      tags: '@accordion @accordion-quiet-max @smoke @regression @milo',
    },
  ],
};
