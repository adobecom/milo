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
    potentialAction: [{
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate,
      },
      'query-input': `required name=${SEARCH_TERM_STRING}`,
    }],
  };
}

function getRichResultsForOrgLogo(getMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: getMetadata('orgurl'),
    logo: getMetadata('orglogo'),
  };
}

function getRichResults(type, getMetadata) {
  switch (type) {
    case 'NewsArticle':
      return getRichResultsForNewsArticle(getMetadata);
    case 'SiteSearchBox':
      return getRichResultsForSiteSearchBox(getMetadata);
    case 'Organization':
      return getRichResultsForOrgLogo(getMetadata);
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
export default function addRichResults(type, { createTag, getMetadata }) {
  const richResults = getRichResults(type, getMetadata);
  addToDom(richResults, createTag);
}
