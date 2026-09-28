import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { JsonLdGraphManager } from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';

window.lana = { log: stub() };

const { default: init } = await import('../../../libs/blocks/event-rich-results/event-rich-results.js');

describe('SEO Event', () => {
  it('add the Event rich results', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const seoEventElt = document.querySelector('.event-rich-results');
    init(seoEventElt);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'The Adventures of Kira and Morrison',
      startDate: '2015-02-05',
      endDate: '2016-02-05',
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
    document.head.innerHTML = '';
    document.body.innerHTML = await readFile({ path: './mocks/body-virtual-event.html' });
    const seoEventElt = document.querySelector('.event-rich-results');
    init(seoEventElt);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'The Adventures of Kira and Morrison',
      startDate: '2015-02-05',
      endDate: '2016-02-05',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'VirtualLocation',
        url: 'https://www.example.com/event_location/1234',
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

  it('add the Event rich results: undefined properties', async () => {
    window.lana = { log: stub() };
    document.head.innerHTML = '';
    document.body.innerHTML = await readFile({ path: './mocks/body-undefined-properties.html' });
    const seoEventElt = document.querySelector('.event-rich-results');
    init(seoEventElt);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      endDate: '',
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
    console.log(window.lana.log.args);
    expect(window.lana.log.args.length).to.equal(4);
    expect(window.lana.log.args[0][0]).to.equal('Event property name is not defined');
    expect(window.lana.log.args[1][0]).to.equal('Event property startDate is not defined');
    expect(window.lana.log.args[2][0]).to.equal('Event property endDate is not defined');
    expect(window.lana.log.args[3][0]).to.equal('Event property previousStartDate is not defined');
  });

  it('preserves two producer Events as distinct graph nodes', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const first = document.querySelector('.event-rich-results');
    const second = first.cloneNode(true);
    const setField = (block, field, value) => {
      const row = [...block.children]
        .find((candidate) => candidate.children[0]?.textContent.trim() === field);
      row.children[1].textContent = value;
    };
    setField(second, 'Name', 'A Second Event');
    setField(second, 'Start-Date', '2017-03-06');
    setField(second, 'Offers-Url', 'https://www.example.com/event_offer/second');
    document.body.appendChild(second);
    init(first);
    init(second);

    const manager = new JsonLdGraphManager();
    try {
      manager.init();
      const graph = JSON.parse(
        document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
      )['@graph'];
      const events = graph.filter((node) => node['@type'] === 'Event');
      expect(events).to.have.length(2);
      expect(new Set(events.map((node) => node['@id'])).size).to.equal(2);
    } finally {
      manager.destroy();
    }
  });
});
