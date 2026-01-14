module.exports = {
  BlockName: 'Carousel Block',
  features: [
    {
      tcid: '0',
      name: '@Carousel(container)',
      path: '/drafts/nala/blocks/carousel/lightbox',
      tags: '@carousel @carousel-container @smoke @regression @milo',
      envs: '@milo-live @milo-prod',
    },
    {
      tcid: '1',
      name: '@Carousel(lightbox)',
      path: '/drafts/nala/blocks/carousel/fullpage-carousel',
      tags: '@carousel @carousel-container @smoke @regression @milo',
      envs: '@milo-live milo-prod',
    },
    {
      tcid: '2',
      name: '@Carousel Multi slide(show-2)',
      path: '/drafts/nala/blocks/carousel/carousel-show-2',
      tags: '@carousel @carousel-container @regression @milo',
      envs: '@milo-live milo-prod',
    },
    {
      tcid: '3',
      name: '@Carousel(jump-to)',
      path: '/drafts/nala/blocks/carousel/carousel-jumpto',
      tags: '@carousel @carousel-container @smoke @regression @milo',
      envs: '@milo-live milo-prod',
    },
    {
      tcid: '4',
      name: '@Carousel A11Y - WCAG 2.1 A/AA Compliance',
      path: '/drafts/nala/blocks/carousel/lightbox',
      tags: '@carousel @a11y @wcag @smoke @regression @milo',
      envs: '@milo-live @milo-prod',
    },
  ],
};
