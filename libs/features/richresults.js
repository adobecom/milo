// createTag and getMetadata are passed in to avoid circular dependencies
export function addRichResults(type, { createTag, getMetadata }) {
  const addRichResultsForNewsArticle = () => {
    const newsArticle = {
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
    const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(newsArticle));
    document.head.append(script);
  }
  
  switch (type) {
    // add support for new types here, e.g. Product
    case 'NewsArticle':
      addRichResultsForNewsArticle();
  }
}
