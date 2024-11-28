import { createTag, customFetch } from '../../utils/utils.js';
import { createPanelContents } from '../../features/personalization/preview.js';
// import mmmGeoDropdownHtml from './geodropdown.js';
const testData = [
  {
    'https://www.adobe.com/': {
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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
      path: '/',
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
      path: '/creativecloud',
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
      path: '/products/illustrator',
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
      path: '/products/photoshop',
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

function handleClick(el, dd) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    if (!dd.classList.contains('placeholder-resolved')) {
      const { page } = dd.dataset;
      dd.innerHTML = createPanelContents(`from ${page}`);
      dd.classList.add('placeholder-resolved');
    }
    dd.removeAttribute('hidden');
  }
}

function createItem(mmm, id, heading, num, geo) {
  const geoOptions = [
    'jp',
    'ca',
    'ca_fr',
    'au',
    'nz',
    'kr',
    'mx',
    'br',
  ];
  const pageUrl = new URL(heading);
  let path = pageUrl.pathname;
  const pathFolders = path.split('/');
  if (geoOptions.includes(pathFolders[1])) {
    pathFolders.splice(1, 1);
    path = pathFolders.join('/');
  }
  const triggerId = `${id}-trigger-${num}`;
  const panelId = `${id}-content-${num}`;
  const icon = createTag('span', { class: 'mmm-icon' });
  const hTag = createTag('h5', false, heading);
  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'mmm-trigger tracking-header',
    'aria-expanded': 'false',
    'aria-controls': panelId,
  }, hTag);
  button.append(icon);

  const panel = heading.nextElementSibling?.firstElementChild;
  const para = panel?.querySelector('p');
  const text = para ? para.textContent : panel?.textContent;
  const dtAttrs = { 'data-page': heading, 'data-geo': geo, 'data-path': path };
  const dtHtml = hTag ? createTag(hTag.tagName, { class: 'mmm-heading' }, button) : button;
  const dt = createTag('dt', dtAttrs, dtHtml);
  const dd = createTag('dd', { id: panelId, hidden: true, 'data-page': heading, 'data-geo': geo, 'data-path': path }, panel);
  button.addEventListener('click', (e) => { handleClick(e.target, dd, num, id); });
  mmm.append(dt, dd);
  return { name: heading.textContent, text };
}

function searchFilterByInput() {
  const searchFieldValue = document.querySelector('#mmm-search-input').value;
  const geoDropDownValue = document.querySelector('#mmm-search-geo').value;
  const pageDropDownValue = document.querySelector('#mmm-search-page').value;
  const mmmEntries = document.querySelectorAll('div.mmm-container > dl > *');
  const selectedGeos = geoDropDownValue.split(',');

  if (!mmmEntries) return;
  mmmEntries.forEach((entry) => {
    const { page, geo, path } = entry.dataset;
    entry.classList.remove('filter-hide');
    if (!page.includes(searchFieldValue)) entry.classList.add('filter-hide');

    if (geoDropDownValue !== 'all' && !selectedGeos.some((item) => geo === item)) {
      entry.classList.add('filter-hide');
    }

    if (pageDropDownValue !== 'all' && path !== pageDropDownValue) {
      entry.classList.add('filter-hide');
    }
  });
}

function getGeoDropDownHtml() {
  const dropDownHtml = `
        <option class="item" value="all" selected>All geos</option>
        <option class="item" value="us,ca,ca_fr"><i class="us flag"></i>NA region: US, CA, CA_FR</option>
        <option class="item" value="au,nz,kr"><i class="au flag"></i>APAC region: AU, NZ, KR</option>
        <option class="item" value="mx,br"><i class="mx flag"></i>LATAM region: MX, BR</option>
        <option class="item" value="jp"><i class="jp flag"></i>Japan 日本 (ja_JP)</option>
        <option class="item" value="us"><i class="us flag"></i>US: United States </option>
        <option class="item" value="ca"><i class="ca flag"></i>CA-EN: Canada - English</option>
        <option class="item" value="ca_fr"><i class="ca flag"></i>CA-FR: Canada - Français</option>
        <option class="item" value="au"><i class="au flag"></i>AU: Australia</option>
        <option class="item" value="nz"><i class="nz flag"></i>NZ: New Zealand</option>
        <option class="item" value="kr"><i class="kr flag"></i>KR: Korea 한국</option>
        <option class="item" value="mx"><i class="mx flag"></i>MX: México</option>
        <option class="item" value="br"><i class="br flag"></i>BR: Brasil</option>
  `;
  return dropDownHtml;
}

function getTopPageDropDownHtml() {
  const dropDownHtml = `
    <option class="item" value="all">All pages</option>
    <option class="item" value="/">Homepage</option>
    <option class="item" value="/creativecloud.html">CCOV</option>
    <option class="item" value="/products/photoshop.html">Photoshop product page</option>
    <option class="item" value="/products/illustrator.html">Illustrator product page</option>
  `;
  return dropDownHtml;
}

async function createForms() {
  const searchPlacement = document.querySelector('.section:has(.marquee)');
  const searchContainer = createTag('div', { class: 'section container mmm-search-container con-block max-width-12-desktop' });
  const searchLabel = createTag('label', { for: 'mmm-search-input' }, '<h3>Search here</h3>');
  const searchForm = createTag('input', { type: 'text', id: 'mmm-search-input', name: 'mmm-search-input', value: 'creativecloud', minlength: '4' });
  const searchGoButton = createTag('input', { type: 'submit', id: 'mmm-search-go' });
  searchGoButton.addEventListener('click', searchFilterByInput);
  searchPlacement.append(searchContainer);
  searchContainer.append(searchLabel, searchForm, searchGoButton);
  // nice to have
  searchForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchGoButton.click();
    }
  });
  const geoDropDownHtml = getGeoDropDownHtml();
  const pageDropDownHtml = getTopPageDropDownHtml();
  const geoDownContainer = createTag('select', { id: 'mmm-search-geo', name: 'mmm-search-geo' }, geoDropDownHtml);
  const pageDownContainer = createTag('select', { id: 'mmm-search-page', name: 'mmm-search-page' }, pageDropDownHtml);
  // const test = mmmGeoDropdownHtml();
  const resp = await customFetch({ resource: '/libs/blocks/mmm/dropdowns.html', withCacheRules: true })
    .catch(() => ({}));
  const html = await resp.text();
  const doc = createTag('div', false, html);
  // const test = customFetch({ resource: './geodropdown.html', withCacheRules: true })
  //   .catch(() => ({}));
  //  searchContainer.append(geoDownContainer, pageDownContainer, doc);
  const dropDownContainer = document.querySelector('#tab-panel-mmm-options-1');
  const searchSectionContainer = document.querySelector('#tab-panel-mmm-options-2');
  dropDownContainer.append(doc);
  searchSectionContainer.append(searchLabel, searchForm);
}

export default async function init(el) {
  createForms();
  const id = 'mmm';
  const mmm = createTag('dl', { class: 'mmm', id: `mmm-${id}`, role: 'presentation' });
  Object.keys(testData[0]).map(
    (heading, idx) => createItem(
      mmm,
      id,
      heading,
      idx + 1,
      testData[0][heading].geo,
    ),
  );

  el.innerHTML = '';
  el.className = `mmm-container ${el.className}`;
  el.classList.remove('mmm');
  const maxWidthClass = Array.from(el.classList).find((style) => style.startsWith('max-width-'));
  el.classList.add('con-block', maxWidthClass || 'max-width-12-desktop');
  mmm.classList.add('foreground');
  el.append(mmm);
}
/*
todo:
createForm(el) - inserts content in front of el
form - type in search first, and go button. hide everything that's not applicable.
text field for form. overcomplicate later.

radio buttosn
filter or search

string search will never be with geo. it will be under 'search' always and but itself
on filter radio button:

decouple string search and geo/page filter.(need radio button).
if value = filter, then do drop down functions.
if search = just do the string pattern match.

no buttons just add to fire when
1. key up on search
2. change on dropdowns
3. radio button change (automatically runs the function to get same results)
*/
