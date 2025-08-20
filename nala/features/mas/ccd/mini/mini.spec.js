const { CCD_BASE_PATH } = require('../../../../libs/commerce.js');

module.exports = {
  FeatureName: 'CCD Mini Cards',
  features: [
    {
      tcid: '1',
      name: '@MAS-CCD-mini-card',
      path: CCD_BASE_PATH.MINI_US,
      data: {
        fragment: '03a36f0f-3e5d-4881-ae6b-273c517c9d38',
        title: 'CCD Apps: Photography',
        regularPrice: 'US$59.99/mo',
        promoPrice: undefined,
        promotionCode: undefined,
        planTypeText: 'Annual, billed monthly',
        recurrenceText: '/mo',
        renewalText: undefined,
        promoDurationText: undefined,
        seeTerms: {
          text: 'See terms',
          analyticsId: 'see-terms',
          href: 'https://www.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623',
        },
        primaryCta: {
          text: 'Buy now',
          analyticsId: 'buy-now',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
        secondaryCta: {
          text: 'Free trial',
          analyticsId: 'free-trial',
          href: 'https://www.adobe.com/products/catalog.html',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
    {
      tcid: '2',
      name: '@MAS-CCD-mini-card-promo',
      path: CCD_BASE_PATH.MINI_US,
      data: {
        fragment: 'df357350-95b2-47f2-844f-df2e491eecef',
        title: 'CCD Apps: Premiere Pro plan',
        regularPrice: 'US$34.49/mo',
        promoPrice: 'US$17.24/mo',
        promotionCode: 'UMRM2MUSPr501YOC',
        recurrenceText: '/mo',
        renewalText:
          'Renews automatically until cancelled. Renews at US$34.49/mo after 12 months.',
        promoDurationText: 'First year only, Ends Mar 3.',
        seeTerms: {
          text: 'See terms',
          analyticsId: 'see-terms',
          href: 'https://www.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=BD42B3D5BE2D389B3E6E7E4F30F65DE0&promotion_code=UMRM2MUSPr501YOC',
        },
        primaryCta: {
          text: 'Buy now',
          analyticsId: 'buy-now',
          href: 'https://commerce.adobe.com/store/segmentation?apc=UMRM2MUSPr501YOC&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ppro_direct_individual',
        },
        secondaryCta: {
          text: 'Free trial',
          analyticsId: 'free-trial',
          href: 'https://commerce.adobe.com/store/segmentation?apc=UMRM2MUSPr501YOC&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ppro_direct_individual',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
    {
      tcid: '3',
      name: '@MAS-CCD-mini-card-fr',
      path: CCD_BASE_PATH.MINI_FR,
      data: {
        fragment: '03a36f0f-3e5d-4881-ae6b-273c517c9d38',
        title: 'CCD Apps: Photography',
        regularPrice: '71,99 €/mois',
        promoPrice: undefined,
        promotionCode: undefined,
        planTypeText: 'Annuel, facturé mensuellement',
        recurrenceText: '/mois',
        renewalText: undefined,
        promoDurationText: undefined,
        seeTerms: {
          text: 'Voir les conditions',
          analyticsId: 'see-terms',
          href: 'https://www.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=DDDCDEBA96799A274FA982669CA74623',
        },
        primaryCta: {
          text: 'S\'abonner',
          analyticsId: 'buy-now',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
        secondaryCta: {
          text: 'Essai gratuit',
          analyticsId: 'free-trial',
          href: 'https://www.adobe.com/products/catalog.html',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
    {
      tcid: '4',
      name: '@MAS-CCD-mini-card-fr_promo',
      path: CCD_BASE_PATH.MINI_FR,
      data: {
        fragment: 'df357350-95b2-47f2-844f-df2e491eecef',
        title: 'CCD Apps: Photography Promo',
        regularPrice: '71,99 €/mois',
        promoPrice: undefined,
        promotionCode: 'UMRM2MUSPr501YOC',
        planTypeText: 'Annuel, facturé mensuellement',
        recurrenceText: '/mois',
        renewalText:
          "Renouvellement automatique jusqu'à annulation. Renouvellement à 71,99 €/mois TVA comprise après 12 mois.",
        promoDurationText: 'Première année seulement, se termine le 3 mars.',
        seeTerms: {
          text: 'Voir les conditions',
          analyticsId: 'see-terms',
          href: 'https://www.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=BD42B3D5BE2D389B3E6E7E4F30F65DE0',
        },
        primaryCta: {
          text: 'S\'abonner',
          analyticsId: 'buy-now',
          href: 'https://commerce.adobe.com/store/segmentation?apc=UMRM2MUSPr501YOC&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ppro_direct_individual',
        },
        secondaryCta: {
          text: 'Essai gratuit',
          analyticsId: 'free-trial',
          href: 'https://commerce.adobe.com/store/segmentation?apc=UMRM2MUSPr501YOC&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ppro_direct_individual',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
  ],
};
