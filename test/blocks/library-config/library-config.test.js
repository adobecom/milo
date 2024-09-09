import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { getContainers, getSearchTags, isMatching, getHtml } = await import('../../../libs/blocks/library-config/lists/blocks.js');
const BLOCK_PAGE_URL = 'https://main--milo--adobecom.hlx.page/path/to/block/page';

function verifyContainer(container, elementsLength, hasLibraryMetadata) {
  expect(container).to.exist;
  expect(container.elements).to.exist;
  expect(container.elements.length).to.equal(elementsLength);
  if (hasLibraryMetadata) {
    expect(container['library-metadata']).to.exist;
  }
}

describe('Library Config: text', () => {
  let bodyHtml;
  let expectedDocxHtml;

  before(async () => {
    bodyHtml = await readFile({ path: './mocks/blocks/text/body.html' });
    expectedDocxHtml = await readFile({ path: './mocks/blocks/text/docx.html' });
  });

  it('text', async () => {
    document.body.innerHTML = bodyHtml;
    // verify getContainers()
    const containers = getContainers(document);
    expect(containers).to.exist;
    verifyContainer(containers[0], 1, true);
    // verify getHtml()
    const docxHtml = getHtml(containers[0], BLOCK_PAGE_URL);
    expect(docxHtml).to.equal(expectedDocxHtml.trim());
    // verify getSearchTags()
    const searchTags = getSearchTags(containers[0]);
    expect(searchTags).to.equal('tb-2up-gr10 tb-3up-gr12 text');
    // verify isMatching()
    expect(isMatching(containers[0], 'tb-2up-gr10')).to.be.true;
    expect(isMatching(containers[0], 'non-existing')).to.be.false;
  });
});

describe('Library Config: chart', () => {
  let bodyHtml;
  let expectedDocxHtml;

  before(async () => {
    bodyHtml = await readFile({ path: './mocks/blocks/chart/body.html' });
    expectedDocxHtml = await readFile({ path: './mocks/blocks/chart/docx.html' });
  });

  it('chart', async () => {
    document.body.innerHTML = bodyHtml;
    // verify getContainers()
    const containers = getContainers(document);
    expect(containers).to.exist;
    verifyContainer(containers[0], 1, true);
    // verify getHtml()
    const docxHtml = getHtml(containers[0], BLOCK_PAGE_URL);
    expect(docxHtml).to.equal(expectedDocxHtml.trim());
    // verify getSearchTags()
    const searchTags = getSearchTags(containers[0]);
    expect(searchTags).to.equal('chart-0 chart (area, green, border)');
    // verify isMatching()
    expect(isMatching(containers[0], 'chart-0')).to.be.true;
    expect(isMatching(containers[0], 'non-existing')).to.be.false;
  });
});

describe('Library Config: marquee', () => {
  let bodyHtml;
  let expectedDocxHtml;

  before(async () => {
    bodyHtml = await readFile({ path: './mocks/blocks/marquee/body.html' });
    expectedDocxHtml = await readFile({ path: './mocks/blocks/marquee/docx.html' });
  });

  it('marquee', async () => {
    document.body.innerHTML = bodyHtml;
    // verify getContainers()
    const containers = getContainers(document);
    expect(containers).to.exist;
    verifyContainer(containers[0], 1, true);
    // verify getHtml()
    const docxHtml = getHtml(containers[0], BLOCK_PAGE_URL);
    expect(docxHtml).to.equal(expectedDocxHtml.trim());
    // verify getSearchTags()
    const searchTags = getSearchTags(containers[0]);
    expect(searchTags).to.equal('mq-std-md-lt mq-std-md-rt mq-std-md-lt-vid marquee-dark marquee');
    // verify isMatching()
    expect(isMatching(containers[0], 'mq-std-md-lt')).to.be.true;
    expect(isMatching(containers[0], 'non-existing')).to.be.false;
  });
});

describe('Library Config: containers', () => {
  let noBlocksNoContainersHtml;
  let singleBlocksHtml;
  let containersHtml;
  let mixedHtml;
  let expectedSingleBlockHtml;
  let expectedContainerHtml;

  before(async () => {
    noBlocksNoContainersHtml = await readFile({ path: './mocks/blocks/container/body-no-blocks-no-containers.html' });
    singleBlocksHtml = await readFile({ path: './mocks/blocks/container/body-single-blocks.html' });
    containersHtml = await readFile({ path: './mocks/blocks/container/body-containers.html' });
    mixedHtml = await readFile({ path: './mocks/blocks/container/body-mixed.html' });
    expectedSingleBlockHtml = await readFile({ path: './mocks/blocks/container/docx-single-block.html' });
    expectedContainerHtml = await readFile({ path: './mocks/blocks/container/docx-container.html' });
  });

  it('getContainers: page with no blocks, no containers', async () => {
    document.body.innerHTML = noBlocksNoContainersHtml;
    const containers = getContainers(document);
    expect(containers).to.be.empty;
  });

  it('getContainers: page with single blocks', async () => {
    document.body.innerHTML = singleBlocksHtml;
    const containers = getContainers(document);
    expect(containers).to.exist;
    verifyContainer(containers[0], 1, false);
    verifyContainer(containers[1], 1, true);
  });

  it('getContainers: page with containers', async () => {
    document.body.innerHTML = containersHtml;
    const containers = getContainers(document);
    expect(containers).to.exist;
    verifyContainer(containers[0], 8, false);
    verifyContainer(containers[1], 11, true);
  });

  it('getContainers: page with mixed content', async () => {
    document.body.innerHTML = mixedHtml;
    const containers = getContainers(document);
    expect(containers).to.exist;
    verifyContainer(containers[0], 1, false);
    verifyContainer(containers[1], 1, true);
    verifyContainer(containers[2], 8, false);
    verifyContainer(containers[3], 11, true);
  });

  it('getHtml', async () => {
    document.body.innerHTML = mixedHtml;
    const containers = getContainers(document);
    const singleBlockHtml = getHtml(containers[0], BLOCK_PAGE_URL);
    const containerHtml = getHtml(containers[3], BLOCK_PAGE_URL);
    expect(singleBlockHtml).to.equal(expectedSingleBlockHtml.trim());
    expect(containerHtml).to.equal(expectedContainerHtml.trim());
  });

  it('getSearchTags', async () => {
    document.body.innerHTML = mixedHtml;
    const containers = getContainers(document);
    const singleBlockWithoutMetadataSearchTags = getSearchTags(containers[0]);
    const singleBlockWithMetadataSearchTags = getSearchTags(containers[1]);
    const containerWithH2TitleAndSearchTags = getSearchTags(containers[2]);
    const containerWithBlockTitleAndSearchTags = getSearchTags(containers[4]);
    expect(singleBlockWithoutMetadataSearchTags).to.equal('carousel (container0)');
    expect(singleBlockWithMetadataSearchTags).to.equal('tag1 carousel (container1)');
    expect(containerWithH2TitleAndSearchTags).to.equal('tag2 Carousel (container2)');
    expect(containerWithBlockTitleAndSearchTags).to.equal('tag4 carousel (lightbox4)');
  });

  it('isMatching', async () => {
    document.body.innerHTML = mixedHtml;
    const containers = getContainers(document);
    expect(isMatching(containers[0], 'tag1')).to.be.false;
    expect(isMatching(containers[1], 'tag1')).to.be.true;
    expect(isMatching(containers[2], 'tag2')).to.be.true;
    expect(isMatching(containers[3], 'tag3')).to.be.true;
    expect(isMatching(containers[4], 'tag4')).to.be.true;
  });
});
