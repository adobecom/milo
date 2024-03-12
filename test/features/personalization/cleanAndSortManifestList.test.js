import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { cleanAndSortManifestList } from '../../../libs/features/personalization/personalization.js';

// Note that the manifestPath doesn't matter as we stub the fetch
describe('Functional test', () => {
  it('Pzn before test, even when test is from Target', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/two-manifests-one-from-target.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first, second] = manifestList;
    expect(first.manifestUrl).to.include('pzn-normal.json');
    expect(second.manifestUrl).to.include('test-normal.json');
  });

  it('Duplicate manifests, Target version is updated', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/two-duplicate-manifests-one-from-target.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first] = manifestList;
    const { name, selectedVariantName, selectedVariant } = first;
    expect(name).to.equal('MILO0013b - use fresh manifest over saved');
    expect(selectedVariantName).to.equal('all');
    expect(selectedVariant.commands[0].target).to.include('fresh-from-json-version');
  });

  it('Duplicate manifests in reverse order, Target version is updated', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/two-duplicate-manifests-other-one-from-target.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first] = manifestList;
    const { name, selectedVariantName, selectedVariant } = first;
    expect(name).to.equal('MILO0013b - use fresh manifest over saved');
    expect(selectedVariantName).to.equal('all');
    expect(selectedVariant.commands[0].target).to.include('fresh-from-json-version');
  });

  it('One of each, all normal', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/three-manifest-types-all-normal.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first, second, third] = manifestList;
    expect(first.manifestUrl).to.include('pzn-normal.json');
    expect(second.manifestUrl).to.include('promo-normal.json');
    expect(third.manifestUrl).to.include('test-normal.json');
  });

  it('One of each, promo is first and rest are normal', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/three-manifest-types-one-first.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first, second, third] = manifestList;
    expect(first.manifestUrl).to.include('promo-first.json');
    expect(second.manifestUrl).to.include('pzn-normal.json');
    expect(third.manifestUrl).to.include('test-normal.json');
  });

  it('One of each, promo is last and rest are normal', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/three-manifest-types-one-last.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first, second, third] = manifestList;
    expect(first.manifestUrl).to.include('pzn-normal.json');
    expect(second.manifestUrl).to.include('test-normal.json');
    expect(third.manifestUrl).to.include('promo-last.json');
  });

  it('One of each, promo is deprecated "Test or Promo" and rest are normal', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/three-manifest-types-one-test-or-promo.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first, second, third] = manifestList;
    expect(first.manifestUrl).to.include('pzn-normal.json');
    expect(second.manifestUrl).to.include('test-or-promo.json');
    expect(third.manifestUrl).to.include('test-normal.json');
  });

  it('One of each, promo has no type and rest are normal', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestLists/three-manifest-types-one-no-type.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    const [first, second, third] = manifestList;
    expect(first.manifestUrl).to.include('pzn-normal.json');
    expect(second.manifestUrl).to.include('none.json');
    expect(third.manifestUrl).to.include('test-normal.json');
  });
});
