import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const testCases = [
  {
    name: 'with section metadata',
    mockPath: './mocks/with-section-metadata.html',
    hasSectionMetadata: true,
  },
  {
    name: 'without section metadata',
    mockPath: './mocks/without-section-metadata.html',
    hasSectionMetadata: false,
  },
];

describe('Featured Story Template', () => {
  testCases.forEach((testCase) => {
    describe(testCase.name, () => {
      let featuredStoryWrapper;
      let section1;
      let section2;

      before(async () => {
        document.body.innerHTML = await readFile({ path: testCase.mockPath });
        const moduleUrl = `../../../libs/templates/featured-story/featured-story.js?t=${Date.now()}`;
        await import(moduleUrl);

        featuredStoryWrapper = document.querySelector('.featured-story-wrapper');
        section1 = document.querySelector('.section-1');
        section2 = document.querySelector('.section-2');
      });

      it('creates a featured-story-wrapper with correct classes', () => {
        expect(featuredStoryWrapper).to.exist;
        expect(featuredStoryWrapper.classList.contains('featured-story-wrapper')).to.be.true;
        expect(featuredStoryWrapper.classList.contains('has-section-metadata')).to.equal(testCase.hasSectionMetadata);
      });

      it('wraps sections[1] and sections[2]', () => {
        expect(section1).to.exist;
        expect(section2).to.exist;
        expect(section1.parentElement).to.equal(featuredStoryWrapper);
        expect(section2.parentElement).to.equal(featuredStoryWrapper);
        expect(section1.classList.contains('section')).to.be.false;
        expect(section2.classList.contains('section')).to.be.false;
      });
    });
  });
});
