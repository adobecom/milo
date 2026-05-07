module.exports = {
  name: 'Base Card Block',
  features: [
    {
      tcid: '0',
      name: 'Base Card (document, all blocks loaded)',
      path: '/drafts/nala/blocks/base-card/base-card',
      data: { expectedCardCount: 4 },
      tags: '@base-card @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: 'Base Card (full-width)',
      path: '/drafts/nala/blocks/base-card/base-card',
      data: {
        fullWidthTitle: 'Edit images in an instant.',
        fullWidthBody:
          'Fill, remove, expand, or upscale imagery with total control. AI tools in the Firefly image editor make complex adjustments simple.',
        fullWidthCta: 'Standalone Link',
      },
      tags: '@base-card @base-card-full-width @base-card-images @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: 'Base Card (full-width responsive media)',
      path: '/drafts/nala/blocks/base-card/base-card',
      data: {},
      tags: '@base-card @base-card-full-width @base-card-images @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: 'Base Card (three-up)',
      path: '/drafts/nala/blocks/base-card/base-card',
      data: {
        firstCardTitle: 'Unlock insights and next steps with PDF Spaces.',
        firstCardBody:
          'Transform files and links into a conversational knowledge hub. With PDF Spaces, you can chat with your docs for faster insights with citations...',
        firstCardCta: 'Standalone Link1',
        secondCardTitle: 'Generative composition with Harmonize.',
        secondCardBody:
          'Instantly blend people and objects into any background. Harmonize matches the lighting, shadows, colors, and other details for a seamless scene in seconds.',
        secondCardCta: 'Standalone Link2',
        thirdCardTitle: 'Draw with pro precision.',
        thirdCardBody:
          'Unlock total control with the enhanced Pencil tool. Now with live preview, you can draw with smoother strokes and render effects in real time.',
        thirdCardCta: 'Standalone Link3',
        threeUpCardCount: 3,
      },
      tags: '@base-card @base-card-three-up @base-card-images @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: 'Base Card (standalone CTAs)',
      path: '/drafts/nala/blocks/base-card/base-card',
      data: {},
      tags: '@base-card @base-card-cta @smoke @regression @milo',
    },
    {
      tcid: '5',
      name: 'Base Card (section metadata)',
      path: '/drafts/nala/blocks/base-card/base-card',
      data: {
        containerMetadataText: 'container, constrained',
        threeUpMetadataText: 'Three-up, container, constrained',
      },
      tags: '@base-card @base-card-metadata @smoke @regression @milo',
    },
  ],
};
