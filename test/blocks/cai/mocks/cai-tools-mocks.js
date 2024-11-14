import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';

const manifest = JSON.parse(await readFile({ path: './mocks/CAIManifest.json' }));

export const createC2pa = stub()
  .returns({ read: () => new Promise((resolve) => { resolve(manifest); }) });

export const selectFormattedGenerator = stub().returns('TestApp');

export const selectGenerativeInfo = stub().returns([
  {
    softwareAgent: 'Adobe Firefly',
    type: 'compositeWithTrainedAlgorithmicMedia',
  },
  {
    softwareAgent: 'Adobe Photoshop',
    type: 'compositeWithTrainedAlgorithmicMedia',
  },
  {
    softwareAgent: 'Some other third thing',
    type: 'unknown type',
  },
]);
