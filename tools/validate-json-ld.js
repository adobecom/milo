#!/usr/bin/env node
/**
 * JSON-LD schema validation script for merch card pages.
 * Fetches pages for Phase 1 markets and validates schema.org Product JSON-LD output.
 *
 * Usage:
 *   node tools/validate-json-ld.js [base-url]
 *   node tools/validate-json-ld.js https://main--milo--adobecom.aem.live
 *
 * Exits non-zero if any market fails validation.
 */

const BASE_URL = process.argv[2] || 'https://main--milo--adobecom.aem.live';

const MARKETS = [
  { locale: 'us', path: '/drafts/nala/blocks/merch/json-ld-us' },
  { locale: 'fr', path: '/fr/drafts/nala/blocks/merch/json-ld-fr' },
  { locale: 'de', path: '/de/drafts/nala/blocks/merch/json-ld-de' },
  { locale: 'jp', path: '/jp/drafts/nala/blocks/merch/json-ld-jp' },
  { locale: 'gb', path: '/gb/drafts/nala/blocks/merch/json-ld-gb' },
  { locale: 'au', path: '/au/drafts/nala/blocks/merch/json-ld-au' },
  { locale: 'ca', path: '/ca/drafts/nala/blocks/merch/json-ld-ca' },
  { locale: 'br', path: '/br/drafts/nala/blocks/merch/json-ld-br' },
];

const HTML_TAG_PATTERN = /<[^>]+>/;
const PRICE_PATTERN = /^\d+(\.\d+)?$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

function extractJsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function validateJsonLd(data, locale) {
  const errors = [];

  if (!data) {
    errors.push('No JSON-LD script found in page');
    return errors;
  }

  if (data['@context'] !== 'https://schema.org/') {
    errors.push(`Invalid @context: ${data['@context']}`);
  }
  if (data['@type'] !== 'Product') {
    errors.push(`Invalid @type: ${data['@type']}`);
  }
  if (!data.name) {
    errors.push('Missing required field: name');
  }
  if (!Array.isArray(data.offers) || data.offers.length === 0) {
    errors.push('No offers found');
    return errors;
  }

  const upperLocale = locale.toUpperCase();
  const localeOffer = data.offers.find((o) => o.eligibleRegion === upperLocale);
  if (!localeOffer) {
    errors.push(`No offer found for eligibleRegion: ${upperLocale}`);
    return errors;
  }

  const { price, priceCurrency } = localeOffer;
  if (price === undefined || price === null) {
    errors.push('Offer missing price');
  } else if (!PRICE_PATTERN.test(String(price))) {
    errors.push(`Invalid price format: ${price}`);
  }
  if (!priceCurrency) {
    errors.push('Offer missing priceCurrency');
  } else if (!CURRENCY_PATTERN.test(priceCurrency)) {
    errors.push(`Invalid priceCurrency format: ${priceCurrency}`);
  }

  if (data.description && HTML_TAG_PATTERN.test(data.description)) {
    errors.push('description contains HTML tags');
  }

  return errors;
}

async function validateMarket({ locale, path }) {
  const url = `${BASE_URL}${path}`;
  let html;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
    if (!res.ok) {
      return { locale, url, errors: [`HTTP ${res.status} fetching page`] };
    }
    html = await res.text();
  } catch (err) {
    return { locale, url, errors: [`Fetch failed: ${err.message}`] };
  }

  const jsonLd = extractJsonLd(html);
  const errors = validateJsonLd(jsonLd, locale);
  return { locale, url, errors };
}

/* eslint-disable no-console */
async function main() {
  console.log(`Validating JSON-LD for ${MARKETS.length} markets against ${BASE_URL}\n`);

  const results = await Promise.all(MARKETS.map(validateMarket));
  let failed = 0;

  for (const { locale, url, errors } of results) {
    if (errors.length === 0) {
      console.log(`  ✓ ${locale.toUpperCase()} — ${url}`);
    } else {
      failed += 1;
      console.error(`  ✗ ${locale.toUpperCase()} — ${url}`);
      for (const err of errors) {
        console.error(`      ${err}`);
      }
    }
  }

  console.log(`\n${MARKETS.length - failed}/${MARKETS.length} markets passed.`);

  if (failed > 0) {
    console.error(`\n${failed} market(s) failed JSON-LD validation.`);
    process.exit(1);
  }
}
/* eslint-enable no-console */

main();
