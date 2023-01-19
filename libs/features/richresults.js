function getRichResultsForNewsArticle(getMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headLine: getMetadata('og:title'),
    image: getMetadata('og:image'),
    datePublished: getMetadata('published'),
    dateModified: getMetadata('modified'),
    author: {
      '@type': 'Person',
      name: getMetadata('authorname'),
      url: getMetadata('authorurl'),
    },
  };
}

function getRichResultsForSiteSearchBox(getMetadata) {
  // See specifications at https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
  const SEARCH_TERM_STRING = 'search_term_string';
  const urlTemplate = `${getMetadata('search-url')}?${getMetadata('search-parameter-name')}={${SEARCH_TERM_STRING}}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: getMetadata('url'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: urlTemplate,
      },
      'query-input': `required name=${SEARCH_TERM_STRING}`,
    },
  };
}

function getRichResultsForProduct(getMetadata) {
  // See specifications at https://developers.google.com/search/docs/appearance/structured-data/product
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getMetadata('name'),
    description: getMetadata('description'),
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: getMetadata('review-rating'),
        bestRating: getMetadata('review-best-rating'),
      },
      author: {
        '@type': 'Person',
        name: getMetadata('review-author'),
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: getMetadata('aggregate-rating'),
      reviewCount: getMetadata('aggregate-count'),
    },
  };
}

function getRichResults(type, getMetadata) {
  switch (type) {
    case 'NewsArticle':
      return getRichResultsForNewsArticle(getMetadata);
    case 'SiteSearchBox':
      return getRichResultsForSiteSearchBox(getMetadata);
    case 'Product':
      return getRichResultsForProduct(getMetadata);
    default:
      // eslint-disable-next-line no-console
      console.error(`Type ${type} is not supported`);
      return null;
  }
}

function addToDom(richResults, createTag) {
  if (!richResults) {
    return;
  }
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(richResults));
  document.head.append(script);
}

// createTag and getMetadata are passed in to avoid circular dependencies
export function addRichResults(type, { createTag, getMetadata }) {
  const richResults = getRichResults(type, getMetadata);
  addToDom(richResults, createTag);
}
