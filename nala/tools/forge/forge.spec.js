// Forge E2E — test metadata for the Nala runner.
//
// tcid 0  @forge-url-flow       URL → reimagine → DA   (demo + real, ~30s / ~25min)
// tcid 1  @forge-figma-full     Figma → conformance → DA (demo fast; real ~1hr)
//           tagged @forge-figma-full so it's excluded from nala:forge:real by default
// tcid 2  @forge-figma-ship     restore fixture → real DA ship (~2min, real only)
//           fast real-mode integration test for the Figma→DA ship path

module.exports = {
  name: 'Forge — end-to-end page generation',
  features: [
    {
      tcid: '0',
      name: '@forge-url-flow',
      desc: 'URL → reimagine (Stardust) → send to Authoring — full flow via URL source',
      path: '/forge.html',
      data: {
        url: 'https://business.adobe.com/products/marketo/adobe-marketo.html',
      },
      tags: '@forge @forge-url @smoke',
    },
    {
      tcid: '1',
      name: '@forge-figma-full',
      desc: 'Figma frame → conformance → send to Authoring — full flow via Figma source (real mode: ~1hr)',
      path: '/forge.html',
      data: {
        figmaUrl: 'https://www.figma.com/design/fMKQndDRSNu4yTjDYyiQoN?node-id=7-7103',
      },
      tags: '@forge @forge-figma @forge-figma-full @smoke',
    },
    {
      tcid: '2',
      name: '@forge-figma-ship',
      desc: 'Restore pre-captured Figma session fixture → real DA ship — fast integration test (~2min, real only)',
      path: '/forge.html',
      data: {
        fixtureFile: 'nala/tools/forge/fixtures/figma-session.json',
      },
      tags: '@forge @forge-figma-ship',
    },
  ],
};
