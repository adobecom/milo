const profile = {
  user: {
    avatar: 'http://localhost:2000/test/blocks/global-navigation/mocks/profile-pic.png',
    name: { notTruncated: 'Milo', trunctated25: 'Milo', trunctated10: 'Milo' },
  },
  sections: {
    ccmfree: {
      id: '30',
      items: {
        intro: { id: '31' },
        cta: { id: '32' },
        manageAccount: { id: '33' },
      },
    },
    signout: { id: '34', items: { signout: { id: '35' } } },
    manage: { id: '1', items: { account: { id: '2' } } },
    creativeCloud: {
      id: '5',
      items: { desktop: { id: '6' }, mobile: { id: '7' }, addons: { id: '8' } },
    },
    assets: {
      id: '16',
      items: {
        creativeCloudLibraries: { id: '17' },
        creativeCloudFiles: { id: '19' },
        lightroom: { id: '22' },
        typeKit: { id: '23' },
        kuler: { id: '24' },
      },
    },
    stock: { id: '25', items: { stock: { id: '26' } } },
    community: {
      id: '27',
      items: { behance: { id: '28' }, prosite: { id: '29' } },
    },
    support: {
      id: '36',
      items: {
        learnAndSupport: { id: '1002' },
        contactUs: { id: '1004' },
        communityForums: { id: '1003' },
      },
    },
  },
};

export default profile;
