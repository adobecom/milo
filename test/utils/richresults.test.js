import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadArea } from '../../libs/utils/utils.js';

describe('Rich Results', () => {
  it('add the NewsArticle rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headLine: 'The war is over',
      image: 'https://example.com/photos/1x1/photo.jpg',
      datePublished: '2022-12-24',
      dateModified: '2022-12-25',
      author: {
        '@type': 'Person',
        name: 'Emile Zola',
        url: 'https://example.com/zola',
      },
    };
    expect(actual).to.deep.equal(expected);
  });
  
  it('undefined rich results type', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results.html' });
    // remove the richresults meta tag
    document.querySelector('meta[name="richresults"]').remove();
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
  });
  
  it('unsupported rich results type', async () => {
    sinon.stub(console, 'error');
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-unsupported-type.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
    expect( console.error.calledWith('Type Unsupported is not supported') ).to.be.true;
  });
  
  it('add the Event rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-event.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'The Adventures of Kira and Morrison',
      startDate: '2015-02-05',
      endDate: '2016-02-05',
      previousStartDate: null,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'Snickerpark Stadium',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '100 West Snickerpark Dr',
          addressLocality: 'Snickertown',
          postalCode: '19019',
          addressRegion: 'PA',
          addressCountry: 'US',
        },
      },
      image: 'https://example.com/photos/1x1/photo.jpg',
      description: 'The Adventures of Kira and Morrison is coming to Snickertown in a can\'t miss performance.',
      offers: {
        '@type': 'Offer',
        url: 'https://www.example.com/event_offer/12345_201803180430',
        price: '38',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2024-05-21T12:00',
      },
      performer: {
        '@type': 'PerformingGroup',
        name: 'Kira and Morrison',
      },
      organizer: {
        '@type': 'Organization',
        name: 'Kira and Morrison Music',
        url: 'https://kiraandmorrisonmusic.com',
      },
    };
    expect(actual).to.deep.equal(expected);
  });
  
  it('add the Event rich results: virtual', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-event-virtual.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'The Adventures of Kira and Morrison',
      startDate: '2015-02-05',
      endDate: '2016-02-05',
      previousStartDate: null,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'VirtualLocation',
        url: 'https://operaonline.stream5.com/',
      },
      image: 'https://example.com/photos/1x1/photo.jpg',
      description: 'The Adventures of Kira and Morrison is coming to Snickertown in a can\'t miss performance.',
      offers: {
        '@type': 'Offer',
        url: 'https://www.example.com/event_offer/12345_201803180430',
        price: '38',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2024-05-21T12:00',
      },
      performer: {
        '@type': 'PerformingGroup',
        name: 'Kira and Morrison',
      },
      organizer: {
        '@type': 'Organization',
        name: 'Kira and Morrison Music',
        url: 'https://kiraandmorrisonmusic.com',
      },
    };
    expect(actual).to.deep.equal(expected);
  });
});
