module.exports = {
  FeatureName: 'CCD Mini Cards',
  features: [
    {
      tcid: '1',
      name: '@MAS-CCD-mini-card',
      path: '/libs/features/mas/docs/ccd-mini.html',
      data: {
        fragment: '03a36f0f-3e5d-4881-ae6b-273c517c9d38',
        regularPrice: 'US$59.99/mo',
        promoPrice: undefined,
        planTypeText: 'Annual, paid monthly.',
        recurrenceText: '/mo',
        renewalText: undefined,
        promoDurationText: undefined,
        seeTerms: {
          text: 'See terms',
          href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623',
        },
        primaryCta: {
          text: 'Buy now',
          href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
        secondaryCta: {
          text: 'Free trial',
          href: 'https://www.adobe.com/products/catalog.html',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
    {
      tcid: '2',
      name: '@MAS-CCD-mini-card-promo',
      path: '/libs/features/mas/docs/ccd-mini.html',
      data: {
        fragment: 'df357350-95b2-47f2-844f-df2e491eecef',
        regularPrice: 'US$59.99/mo',
        promoPrice: 'US$49.99/mo',
        planTypeText: 'Annual, paid monthly.',
        recurrenceText: '/mo',
        renewalText:
          'Renews automatically until cancelled. Renews at US$59.99/mo after 12 months.',
        promoDurationText: 'First year only, Ends Mar 3.',
        seeTerms: {
          text: 'See terms',
          href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623&promotion_code=L_PROMO_10F',
        },
        primaryCta: {
          text: 'Buy now',
          href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
        secondaryCta: {
          text: 'Free trial',
          href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
    {
      tcid: '3',
      name: '@MAS-CCD-mini-card-fr',
      path: '/libs/features/mas/docs/ccd-mini.html?country=FR&language=fr',
      data: {
        fragment: '03a36f0f-3e5d-4881-ae6b-273c517c9d38',
        regularPrice: '71,99 €/mois',
        promoPrice: undefined,
        planTypeText: 'Annual, paid monthly.',
        recurrenceText: '/mois',
        renewalText: undefined,
        promoDurationText: undefined,
        seeTerms: {
          text: 'Voir les conditions',
          href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=DDDCDEBA96799A274FA982669CA74623',
        },
        primaryCta: {
          text: 'S\'abonner',
          href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
        secondaryCta: {
          text: 'Essai gratuit',
          href: 'https://www.adobe.com/products/catalog.html',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
    {
      tcid: '4',
      name: '@MAS-CCD-mini-card-fr_promo',
      path: '/libs/features/mas/docs/ccd-mini.html?country=FR&language=fr',
      data: {
        fragment: 'df357350-95b2-47f2-844f-df2e491eecef',
        regularPrice: '71,99 €/mois',
        promoPrice: '59,99 €/mois',
        planTypeText: 'Annual, paid monthly.', // TODO update once priceLiterals override is implemented
        recurrenceText: '/mois',
        renewalText:
          "Renouvellement automatique jusqu'à annulation. Renouvellement à 71,99 €/mois TVA comprise après 12 mois.",
        promoDurationText: 'Première année seulement, se termine le 3 mars.',
        seeTerms: {
          text: 'Voir les conditions',
          href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=DDDCDEBA96799A274FA982669CA74623&promotion_code=L_PROMO_10F',
        },
        primaryCta: {
          text: 'S\'abonner',
          href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
        secondaryCta: {
          text: 'Essai gratuit',
          href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
        },
      },
      tags: '@mas @ccd-mini @smoke',
    },
  ],
};
