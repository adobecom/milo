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
    expect(singleBlockHtml).to.equal(expectedSingleBlockHtml);
    expect(containerHtml).to.equal(expectedContainerHtml);
  });

  it('getSearchTags', async () => {
    document.body.innerHTML = mixedHtml;
    const containers = getContainers(document);
    const singleBlockWithoutMetadataSearchTags = getSearchTags(containers[0]);
    const singleBlockWithMetadataSearchTags = getSearchTags(containers[1]);
    const containerWithoutMetadataSearchTags = getSearchTags(containers[2]);
    const containerWithMetadataSearchTags = getSearchTags(containers[3]);
    expect(singleBlockWithoutMetadataSearchTags).to.equal('carousel (container1)');
    expect(singleBlockWithMetadataSearchTags).to.equal('test1 carousel (container2)');
    expect(containerWithoutMetadataSearchTags).to.equal('carousel (container)');
    expect(containerWithMetadataSearchTags).to.equal('test3 carousel (lightbox)');
  });

  it('isMatching', async () => {
    document.body.innerHTML = mixedHtml;
    const containers = getContainers(document);
    expect(isMatching(containers[0], 'test1')).to.be.false;
    expect(isMatching(containers[1], 'test1')).to.be.true;
    expect(isMatching(containers[2], 'test3')).to.be.false;
    expect(isMatching(containers[3], 'test3')).to.be.true;
  });
});
