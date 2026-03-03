module.exports = {
  name: 'CaaS Bulk Publisher',
  features: [
    {
      tcid: '0',
      name: '@CaaS-BulkPublisher-LanguageFirst',
      path: '/tools/send-to-caas/bulkpublisher.html',
      data: {
        presetId: 'bacom',
        expectedHost: 'business.adobe.com',
        expectedRepo: 'bacom',
        expectedOwner: 'adobecom',
        publishUrl: 'https://business.adobe.com/products/firefly-business.html',
        expectedStatus: 'OK',
        expectedCountry: 'xx',
        expectedLang: 'en',
        expectedOrigin: 'bacom',
      },
      tags: '@caas @bulkpublisher @regression',
    },
  ],
};
