export const docUrls = [
  {
    actions: {
      edit: {
        url: 'fetchEditUrl',
        status: 200,
      },
      preview: {
        url: 'https://locui--milo--adobecom.hlx.page/drafts/blaishram/document2',
        status: 200,
      },
      live: {
        url: 'https://locui--milo--adobecom.hlx.live/drafts/blaishram/document2',
        status: 200,
      },
    },
    langstore: {
      lang: 'en',
      pathname: '/langstore/en/drafts/blaishram/document2',
      actions: {
        edit: {
          url: 'fetchEditUrl',
          status: 200,
        },
        preview: {
          url: 'https://locui--milo--adobecom.hlx.page/langstore/en/drafts/blaishram/document2',
          status: 200,
        },
        live: {
          url: 'https://locui--milo--adobecom.hlx.live/langstore/en/drafts/blaishram/document2',
          status: 404,
        },
      },
    },
    userInfo: {
      lastModifiedBy: 'Bandana Laishram',
      lastModifiedDateTime: '2023-07-21T06:11:46Z',
    },
    hash: '',
    host: 'main--milo--adobecom.hlx.page',
    hostname: 'main--milo--adobecom.hlx.page',
    href: 'https://main--milo--adobecom.hlx.page/drafts/sharathkannan/docs/discover',
    origin: 'https://main--milo--adobecom.hlx.page',
    password: '',
    pathname: '/drafts/sharathkannan/docs/discover',
    port: '',
    protocol: 'https:',
    search: '',
  },
];

export const mockPayload = {
  preview: {
    url: 'preview-url',
    status: 'success',
    lastModified: Date.now(),
  },
  edit: {
    url: 'edit-url',
    status: 'success',
    lastModified: Date.now(),
  },
  live: {
    url: 'live-url',
    status: 'success',
    lastModified: Date.now(),
  },
};

export const sampleItem = {
  value: {
    path: 'trial path',
    edit: {
      modified: ['Edit Date', 'Edit Time'],
    },
    preview: {
      modified: ['Preview Date', 'Preview Time'],
    },
    live: {
      modified: ['Live Date', 'Live Time'],
    },
  },
};
