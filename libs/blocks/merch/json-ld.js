const COUNTRY_CURRENCY = {
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  AU: 'AUD',
  FR: 'EUR',
  DE: 'EUR',
  NL: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  JP: 'JPY',
  BR: 'BRL',
  MX: 'MXN',
  IN: 'INR',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  SG: 'SGD',
  HK: 'HKD',
  KR: 'KRW',
  TW: 'TWD',
  ZA: 'ZAR',
  AE: 'AED',
  SA: 'SAR',
};

function stripHtml(html) {
  let result = html;
  let previous;
  do {
    previous = result;
    result = result.replace(/<[^>]*>/g, '');
  } while (result !== previous);
  return result;
}

function getPageUrl(pageUrl) {
  return pageUrl.split('?')[0];
}

function getBillingDuration(commitment, term) {
  if (term === 'ANNUAL') return 'P1Y';
  if (commitment === 'PERPETUAL') return 'P1Y';
  return 'P1M';
}

function buildImage(mnemonicIcon) {
  if (!Array.isArray(mnemonicIcon) || mnemonicIcon.length === 0) return undefined;
  const suffix = '?format=png&width=800&height=800';
  if (mnemonicIcon.length === 1) return `${mnemonicIcon[0]}${suffix}`;
  return mnemonicIcon.map((icon) => `${icon}${suffix}`);
}

// eslint-disable-next-line import/prefer-default-export
export function injectJsonLd(fields, offer, regularOffer, country, pageUrl) {
  if (!fields?.cardTitle || !offer || !country) return null;

  const upperCountry = country.toUpperCase();
  const currency = COUNTRY_CURRENCY[upperCountry];
  if (!currency) return null;

  const { price } = offer?.priceDetails ?? {};
  if (price == null) return null;

  const url = getPageUrl(pageUrl);

  const dedupId = `json-ld-product-${url}`;
  if (document.head.querySelector(`script[data-id="${dedupId}"]`)) return null;

  const priceStr = String(price);
  const offerId = `${url}#offer-${country.toLowerCase()}`;

  const priceSpecification = {
    '@type': 'UnitPriceSpecification',
    price: priceStr,
    priceCurrency: currency,
    billingDuration: getBillingDuration(offer.commitment, offer.term),
    billingIncrement: 1,
  };

  const regularPrice = offer?.priceDetails?.priceWithoutDiscount
    ?? regularOffer?.priceDetails?.price;
  if (regularPrice != null && regularPrice !== price) {
    priceSpecification.priceWithoutDiscount = String(regularPrice);
  }

  const schemaOffer = {
    '@type': 'Offer',
    '@id': offerId,
    url,
    priceCurrency: currency,
    price: priceStr,
    availability: 'https://schema.org/InStock',
    category: 'Subscription',
    seller: { '@id': 'https://www.adobe.com/#org' },
    itemOffered: { '@id': `${url}#product` },
    eligibleRegion: upperCountry,
    priceSpecification,
  };

  const image = buildImage(fields.mnemonicIcon);
  const description = fields.description?.value ? stripHtml(fields.description.value) : undefined;

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: fields.cardTitle,
    brand: { '@type': 'Brand', name: 'Adobe' },
    offers: [schemaOffer],
  };

  if (description) jsonLd.description = description;
  if (image) jsonLd.image = image;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.id = dedupId;
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
  return script;
}
