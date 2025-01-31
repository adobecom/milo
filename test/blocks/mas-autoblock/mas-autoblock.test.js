import { expect } from '@esm-bundle/chai';
import init, { getFragmentId, getTagName, createCard } from '../../../libs/blocks/mas-autoblock/mas-autoblock.js';

describe('mas autoblock', () => {
  before(() => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
    a.textContent = 'merch-card: ACOM / Catalog / Test Card';
    init(a);
  });

  it('get fragment id', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
    expect(getFragmentId(a)).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
  });

  it('no fragment id in URL', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom');
    expect(getFragmentId(a)).to.be.null;
  });

  it('no hash in URL', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html');
    init(a);
    expect(getFragmentId(a)).to.be.null;
  });

  it('get tag name', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
    a.textContent = 'merch-card: ACOM / Catalog / Test Card';
    expect(getTagName(a)).to.equal('merch-card');
  });

  it('get tag name default', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
    a.textContent = '';
    expect(getTagName(a)).to.equal('merch-card');
  });

  it('get tag name collection', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
    a.textContent = 'merch-card-collection: ACOM / Catalog / Test Collection';
    expect(getTagName(a)).to.equal('merch-card-collection');
  });

  it('create card', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=a657fd3d9f67');
    a.textContent = 'merch-card: ACOM / Catalog / Test Card';
    const fragmentId = getFragmentId(a);
    document.body.append(a);
    createCard(a, fragmentId);
    const card = document.body.querySelector('merch-card');
    expect(card.outerHTML).to.equal('<merch-card consonant=""><aem-fragment fragment="a657fd3d9f67"></aem-fragment></merch-card>');
  });

  it('create collection', () => {
    const fragmentId = 'COLL_ID';
    const a = document.createElement('a');
    a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=COLL_ID');
    a.textContent = 'merch-card-collection: ACOM / Catalog / Test Collection';
    document.body.append(a);
    createCard(a, fragmentId);
    const coll = document.body.querySelector('merch-card-collection');
    expect(coll.outerHTML).to.equal('<merch-card-collection consonant=""><aem-fragment fragment="COLL_ID"></aem-fragment></merch-card-collection>');
  });
});
