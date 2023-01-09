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
  };

  const addRichResultsForEvent = () => {
    const location = () => {
      if (getMetadata('location-type') === 'Place') {
        return {
          '@type': 'Place',
          name: getMetadata('location-name'),
          address: {
            '@type': 'PostalAddress',
            streetAddress: getMetadata('location-address-street'),
            addressLocality: getMetadata('location-address-locality'),
            postalCode: getMetadata('location-address-postal-code'),
            addressRegion: getMetadata('location-address-region'),
            addressCountry: getMetadata('location-address-country'),
          },
        };
      }
      if (getMetadata('location-type') === 'VirtualLocation') {
        return {
          '@type': 'VirtualLocation',
          url: getMetadata('location-url'),
        };
      }
      return null;
    };
    const event = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: getMetadata('name'),
      startDate: getMetadata('start-date'),
      endDate: getMetadata('end-date'),
      previousStartDate: getMetadata('previous-start-date'),
      eventAttendanceMode: getMetadata('event-attendance-mode'),
      eventStatus: getMetadata('event-status'),
      location: location(),
      image: getMetadata('og:image'),
      description: getMetadata('description'),
      offers: {
        '@type': 'Offer',
        url: getMetadata('offers-url'),
        price: getMetadata('offers-price'),
        priceCurrency: getMetadata('offers-price-currency'),
        availability: getMetadata('offers-availability'),
        validFrom: getMetadata('offers-valid-from'),
      },
      performer: {
        '@type': getMetadata('performer-type'),
        name: getMetadata('performer-name'),
      },
      organizer: {
        '@type': getMetadata('organizer-type'),
        name: getMetadata('organizer-name'),
        url: getMetadata('organizer-url'),
      },
    };
    const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(event));
    document.head.append(script);
  };

  switch (type) {
    // add support for new types here, e.g. NewsArticle, Event, Product
    case 'NewsArticle':
      addRichResultsForNewsArticle();
      break;
    case 'Event':
      addRichResultsForEvent();
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`Type ${type} is not supported`);
  }
}
