import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import getPromoManifests, { isDisabled } from '../../../libs/features/personalization/promo-utils.js';

describe('isDisabled', () => {
  it('should be enabled if current time is within range', () => {
    const event = {
      start: new Date('2000-11-01T00:00:00'),
      end: new Date('2300-11-01T00:00:00'),
    };
    expect(isDisabled(event)).to.be.false;
  });

  it('should be enabled if no event exist', () => {
    expect(isDisabled(null)).to.be.false;
  });

  it('should be enabled if event has no dates', () => {
    expect(isDisabled({})).to.be.false;
  });

  it('should be disabled if current time is outside range', () => {
    const event = {
      start: new Date('2300-11-01T00:00:00'),
      end: new Date('2301-11-01T00:00:00'),
    };
    expect(isDisabled(event)).to.be.true;
  });

  it('should be disabled if no start time defined', () => {
    const event = { end: new Date('2300-11-01T00:00:00') };
    expect(isDisabled(event)).to.be.true;
  });

  it('should be disabled if no end time defined', () => {
    const event = { start: new Date('2000-11-01T00:00:00') };
    expect(isDisabled(event)).to.be.true;
  });
});

describe('getPromoManifests', () => {
  const expectedManifests = [
    {
      manifestPath: 'https://main--milo--adobecom.hlx.page/promos/2023/black-friday/pre-black-friday/manifest-global.json',
      disabled: false,
      event: {
        name: 'pre-black-friday-global',
        start: new Date('2000-11-01T00:00:00.000Z'),
        end: new Date('2300-12-15T00:00:00.000Z'),
      },
    },
    {
      manifestPath: 'https://main--milo--adobecom.hlx.page/promos/2023/black-friday/black-friday/manifest-global.json',
      disabled: true,
      event: {
        name: 'black-friday-global',
        start: new Date('2000-12-15T00:00:00.000Z'),
        end: new Date('2000-12-31T00:00:00.000Z'),
      },
    },
  ];

  it('should return an array of promo manifests', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-schedule.html' });
    const manifestNames = 'pre-black-friday-global,black-friday-global,cyber-monday';
    expect(getPromoManifests(manifestNames)).to.deep.eq(expectedManifests);
  });

  it('should return an empty array if no schedule', async () => {
    document.head.innerHTML = '';
    const manifestNames = 'pre-black-friday-global,black-friday-global,cyber-monday';
    expect(getPromoManifests(manifestNames).length).to.be.equal(0);
  });

  it('should return an empty array if no manifestnames', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-schedule.html' });
    const manifestNames = '';
    expect(getPromoManifests(manifestNames).length).to.be.equal(0);
  });
});
