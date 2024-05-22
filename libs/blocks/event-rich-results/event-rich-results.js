import { createTag } from '../../utils/utils.js';

function buildData(el) {
  const data = new Map();
  const rows = el.children;
  [...rows].forEach((row) => {
    const key = [...row.children][0]?.innerText?.trim().replaceAll(' ', '-').toLowerCase();
    const value = [...row.children][1]?.innerText;
    data.set(key, value);
  });
  return data;
}

function logNullValues(obj) {
  if (!obj || typeof obj === 'string') return;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (!value || value === '') {
      window.lana.log(`Event property ${key} is not defined`, { tags: 'errorType=warn,module=event-rich-results' });
    }
    logNullValues(value);
  });
}

function getLocation(data) {
  if (data.get('location-type') === 'Place') {
    return {
      '@type': 'Place',
      name: data.get('location-name'),
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.get('location-address-street'),
        addressLocality: data.get('location-address-locality'),
        postalCode: data.get('location-address-postal-code'),
        addressRegion: data.get('location-address-region'),
        addressCountry: data.get('location-address-country'),
      },
    };
  }
  if (data.get('location-type') === 'VirtualLocation') {
    return {
      '@type': 'VirtualLocation',
      url: data.get('location-url'),
    };
  }
  return null;
}

function getEvent(el) {
  const data = buildData(el);
  const location = getLocation(data);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.get('name'),
    startDate: data.get('start-date'),
    endDate: data.get('end-date'),
    previousStartDate: data.get('previous-start-date'),
    eventAttendanceMode: data.get('event-attendance-mode'),
    eventStatus: data.get('event-status'),
    location,
    image: data.get('image'),
    description: data.get('description'),
    offers: {
      '@type': 'Offer',
      url: data.get('offers-url'),
      price: data.get('offers-price'),
      priceCurrency: data.get('offers-price-currency'),
      availability: data.get('offers-availability'),
      validFrom: data.get('offers-valid-from'),
    },
    performer: {
      '@type': data.get('performer-type'),
      name: data.get('performer-name'),
    },
    organizer: {
      '@type': data.get('organizer-type'),
      name: data.get('organizer-name'),
      url: data.get('organizer-url'),
    },
  };
}

export default function init(el) {
  const event = getEvent(el);
  logNullValues(event);
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(event));
  document.head.append(script);
  el.remove();
}
