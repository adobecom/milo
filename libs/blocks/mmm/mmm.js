import { createTag } from '../../utils/utils.js';
// import { decorateButtons } from '../../utils/decorate.js';
// import { processTrackingLabels } from '../../martech/attributes.js';
import { createPanelContents } from '../../features/personalization/preview.js';

// const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };
// const mediaCollection = {};

const testData = [
  {
    'https://www.adobe.com/': {
      page: '/',
      region: 'na',
      geo: 'us',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | US | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/creativecloud.html': {
      page: '/creativecloud',
      region: 'na',
      geo: 'us',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | US | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'na',
      geo: 'us',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | US | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'na',
      geo: 'us',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | US | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/ca/': {
      page: '/',
      region: 'na',
      geo: 'ca',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | CA | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/ca/creativecloud.html': {
      page: '/creativecloud',
      region: 'na',
      geo: 'ca',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | CA | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/ca/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'na',
      geo: 'ca',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | CA | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/ca/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/ca/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'na',
      geo: 'ca',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | CA | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/ca_fr/': {
      page: '/',
      region: 'na',
      geo: 'ca_fr',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | CA_FR | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/ca_fr/creativecloud.html': {
      page: '/creativecloud',
      region: 'na',
      geo: 'ca_fr',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | CA_FR | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/ca_fr/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'na',
      geo: 'ca_fr',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | CA_FR | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/ca_fr/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/ca_fr/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'na',
      geo: 'ca_fr',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | CA_FR | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/au/': {
      page: '/',
      region: 'apac',
      geo: 'au',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | AU | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/au/creativecloud.html': {
      page: '/creativecloud',
      region: 'apac',
      geo: 'au',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | AU | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/au/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'apac',
      geo: 'au',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | AU | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/au/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/au/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'apac',
      geo: 'au',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | AU | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/nz/': {
      page: '/',
      region: 'apac',
      geo: 'nz',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | AU | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/nz/creativecloud.html': {
      page: '/creativecloud',
      region: 'apac',
      geo: 'nz',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | AU | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/nz/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'apac',
      geo: 'nz',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | AU | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/nz/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/nz/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'apac',
      geo: 'nz',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | AU | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/kr/': {
      page: '/',
      region: 'apac',
      geo: 'kr',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | AU | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/kr/creativecloud.html': {
      page: '/creativecloud',
      region: 'apac',
      geo: 'kr',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | AU | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/kr/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'apac',
      geo: 'kr',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | AU | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/kr/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/kr/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'apac',
      geo: 'kr',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | AU | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/mx/': {
      page: '/',
      region: 'latam',
      geo: 'mx',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | AU | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/mx/creativecloud.html': {
      page: '/creativecloud',
      region: 'latam',
      geo: 'mx',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | AU | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/mx/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'latam',
      geo: 'mx',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | AU | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/mx/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/mx/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'latam',
      geo: 'mx',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | AU | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/br/': {
      page: '/',
      region: 'latam',
      geo: 'br',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | AU | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/br/creativecloud.html': {
      page: '/creativecloud',
      region: 'latam',
      geo: 'br',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | AU | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/br/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'latam',
      geo: 'br',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | AU | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/br/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/br/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'latam',
      geo: 'br',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | AU | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
    'https://www.adobe.com/jp/': {
      page: '/',
      region: 'jp',
      geo: 'jp',
      manifests: {
        'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/hp-8-19-bts-promo.json': {
          targetActivity: 'PZN | AU | Homepage',
          lastSeen: '2024-08-21',
          variants: [
            'target-apro-twp-abdn',
            'target-cc-lapsed',
            'target-smb',
            'target-edu',
            'target-cpro_pzn',
            'target-dc',
            'target-return',
            'phone',
          ],
        },
      },
    },
    'https://www.adobe.com/jp/creativecloud.html': {
      page: '/creativecloud',
      region: 'jp',
      geo: 'jp',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/creativecloud.json': {
          targetActivity: 'PZN | AU | CCOV',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-retrn_pzn',
            'target-cpro_pzn',
            'cc-all-apps-any',
            'any-cc-product-no-stock',
            'any-cc-product-with-stock',
          ],
        },
      },
    },
    'https://www.adobe.com/jp/products/illustrator.html': {
      page: '/products/illustrator',
      region: 'jp',
      geo: 'jp',
      manifests: {
        'https://main--cc--adobecom.hlx.live/products/illustrator.json': {
          targetActivity: 'PZN | AU | Illustrator',
          lastSeen: '2024-08-21',
          variants: [
            'target-edu_pzn',
            'target-b2b_pzn',
            'target-cpro_pzn',
            'phone & cc-all-apps-any',
            'cc-all-apps-any',
            'illustrator-any',
          ],
        },
        'https://main--cc--adobecom.hlx.page/cc-shared/fragments/promos/2024/americas/ste-back-to-school-q3/ste-back-to-school-q3.json': {
          on: '8/16/2024, 8:00:00 AM',
          off: '9/3/2024, 8:00:00 AM',
          lastSeen: '2024-08-21',
          variants: [
            'all',
          ],
        },
        'https://www.adobe.com/jp/cc-shared/fragments/tests/2024/q2/ace0875/ace0875.json': {
          lastSeen: '2024-08-21',
          variants: [
            ' target-var-marqueelink',
          ],
        },
      },
    },
    'https://www.adobe.com/jp/products/photoshop.html': {
      page: '/products/photoshop',
      region: 'jp',
      geo: 'jp',
      manifests: {
        'https://main--cc--adobecom.hlx.page/products/photoshop.json': {
          targetActivity: 'PZN | AU | Photoshop',
          lastSeen: '2024-08-21',
          variants: [
            'target-pzn_b2b',
          ],
        },
      },
    },
  },
];

// function setSEO(questions) {
//   faq.mainEntity.push(questions.map(({ name, text }) => (
//     { '@type': 'Question', name, acceptedAnswer: { text, '@type': 'Answer' } })));
//   const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(faq));
//   document.head.append(script);
// }

// function toggleMedia(con, trig, status) {
//   if (status === 'open') {
//     trig.setAttribute('hidden', '');
//     trig.setAttribute('aria-expanded', 'false');
//     con.setAttribute('hidden', '');
//     con.setAttribute('aria-expanded', 'false');
//   } else {
//     trig.setAttribute('aria-expanded', 'true');
//     trig.removeAttribute('hidden');
//     con.setAttribute('aria-expanded', 'true');
//     con.removeAttribute('hidden');
//   }
// }

// function displayMedia(displayArea, el, dd, i, expanded) {
//   const id = el.getAttribute('aria-controls').split('-')[1];
//   [...mediaCollection[id]].forEach(
//     (mediaCollectionItem, idx, total) => {
//       mediaCollectionItem.classList.remove('expanded');

//       total.forEach((element, index) => {
//         const trigger = document.querySelector(`#mmm-${id}-trigger-${index + 1}`);
//         const content = document.querySelector(`#mmm-${id}-content-${index + 1}`);
//         toggleMedia(content, trigger, 'open');
//       });
//       toggleMedia(dd, el);
//       displayArea.childNodes[i - 1].classList.add('expanded');

//       if (expanded) {
//         toggleMedia(dd, el, 'open');
//         displayArea.childNodes[i - 1]?.classList.remove('expanded');
//       }
//     },
//   );
// }

function handleClick(el, dd) { // removed num from args
  const expanded = el.getAttribute('aria-expanded') === 'true';
  // const analyticsValue = el.getAttribute('daa-ll');
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    // el.setAttribute('daa-ll', analyticsValue.replace(/close-/, 'open-'));
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    // el.setAttribute('daa-ll', analyticsValue.replace(/open-/, 'close-'));
    if (!dd.classList.contains('placeholder-resolved')) {
      const { page } = dd.dataset;
      dd.innerHTML = createPanelContents(`from ${page}`);
      dd.classList.add('placeholder-resolved');
    }
    dd.removeAttribute('hidden');
  }

  // const closestEditorial = el.closest('.editorial');
  // eslint-disable-next-line max-len
  // if (closestEditorial) displayMedia(closestEditorial.querySelector('.mmm-media'), el, dd, num, expanded);
}

// function defalutOpen(mmm) {
//   handleClick(mmm.querySelector('.mmm-trigger'), mmm.querySelector('dd'), 1, 0);
// }

function createItem(mmm, id, heading, num) {
  const triggerId = `mmm-${id}-trigger-${num}`;
  const panelId = `mmm-${id}-content-${num}`;
  const icon = createTag('span', { class: 'mmm-icon' });
  // const hTag = heading.querySelector('h1, h2, h3, h4, h5, h6');
  const hTag = createTag('h3', false, heading);
  // const analyticsString = `open-${num}--${processTrackingLabels(heading.textContent)}`;
  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'mmm-trigger tracking-header',
    'aria-expanded': 'false',
    'aria-controls': panelId,
    // 'daa-ll': analyticsString,
    // 'data-page': heading,
  }, hTag);
  button.append(icon);

  const panel = heading.nextElementSibling?.firstElementChild;

  const para = panel?.querySelector('p');
  const text = para ? para.textContent : panel?.textContent;
  const dtAttrs = { 'data-page': heading };
  const dtHtml = hTag ? createTag(hTag.tagName, { class: 'mmm-heading' }, button) : button;
  const dt = createTag('dt', dtAttrs, dtHtml);
  const dd = createTag('dd', { id: panelId, hidden: true, 'data-page': heading }, panel);
  // const dm = createTag('div', { class: 'media-p' });

  // if (edit) {
  //   const ogMedia = mediaCollection[id][num - 1];
  //   const mediaCopy = ogMedia.cloneNode(true);
  //   dm.append(mediaCopy);
  //   dd.prepend(dm);
  // }

  button.addEventListener('click', (e) => { handleClick(e.target, dd, num, id); });
  mmm.append(dt, dd);

  return { name: heading.textContent, text };
}

// function getUniqueId(el) {
//   const mmms = document.querySelectorAll('.mmm');
//   return [...mmms].indexOf(el) + 1;
// }

// function populateMedia(mmm, id, num, collection) {
//   mediaCollection[id] = collection;
//   mmm.append(mediaCollection[id][num]);
// }

export default function init(el) {
  const id = 'mmm';
  const mmm = createTag('dl', { class: 'mmm', id: `mmm-${id}`, role: 'presentation' });
  // eslint-disable-next-line max-len
  // const mmmMedia = createTag('div', { class: 'mmm-media', id: `mmm-media-${id}` });
  // const isSeo = el.classList.contains('seo');
  // const isEditorial = el.classList.contains('editorial');
  // decorateButtons(el);

  // if (isEditorial) {
  //   const editorialMedia = el.querySelectorAll(':scope > div:nth-child(3n)');
  //   [...editorialMedia].map(
  //     (media, idx, collection) => populateMedia(mmmMedia, id, idx, collection),
  //   );
  // }

  // const headings = Object.keys(testData[0]);
  Object.keys(testData[0]).map(
    (heading, idx) => createItem(
      mmm,
      id,
      heading,
      idx + 1,
      // isEditorial,
      // mmmMedia,
    ),
  );

  // if (isSeo) { setSEO(items); }
  el.innerHTML = '';
  el.className = `mmm-container ${el.className}`;
  el.classList.remove('mmm');
  const maxWidthClass = Array.from(el.classList).find((style) => style.startsWith('max-width-'));
  el.classList.add('con-block', maxWidthClass || 'max-width-10-desktop');
  mmm.classList.add('foreground');
  el.append(mmm);
  // if (isEditorial) {
  //   el.append(mmmMedia);
  //   defalutOpen(el);
  // }
}
/*
todo:
createForm(el) - inserts content in front of el
form - type in search first, and go button. hide everything that's not applicable.
text field for form. overcomplicate later.
*/
