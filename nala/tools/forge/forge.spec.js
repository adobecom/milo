// Forge E2E — test metadata for the Nala runner.
// Two demo-mode flows (no backend needed): URL source and Figma source.
// The Vite dev server sets DEMO_MODE automatically; the whole pipeline
// runs in ~13s per test via the smoke-and-mirrors fixture engine.

module.exports = {
  name: 'Forge — end-to-end page generation',
  features: [
    {
      tcid: '0',
      name: '@forge-url-flow',
      desc: 'URL → reimagine (Stardust) → send to Authoring — full demo flow via URL source',
      path: '/forge.html',
      data: {
        // Any URL works in demo mode — the fixture engine ignores the actual content.
        url: 'https://business.adobe.com/products/marketo/adobe-marketo.html',
      },
      tags: '@forge @forge-url @smoke',
    },
    {
      tcid: '1',
      name: '@forge-figma-flow',
      desc: 'Figma frame → conformance → send to Authoring — full demo flow via Figma source',
      path: '/forge.html',
      data: {
        // The Figma door pre-fills this URL once the door is open.
        figmaUrl: 'https://www.figma.com/design/lOFnBFhsYyFWPbSdiPa9us/Hub-%E2%80%94-A.com?node-id=1-11',
        // A non-empty figmaToken in localStorage makes the Figma door skip the connect modal.
        figmaToken: 'figd_demo_e2e',
      },
      tags: '@forge @forge-figma @smoke',
    },
  ],
};
