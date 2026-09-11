import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import {
  setupSuite,
  loadFixtureIntoHead,
  trackedManager,
  getManagedGraph,
} from './helpers.js';

// One golden case per page archetype. Each fixture under ./mocks is run through
// the manager and the entire emitted @graph is compared against a committed
// expected file under ./expected. These snapshots are the human-reviewable
// contract: a reviewer reads "messy producer input -> canonical managed graph"
// without reading a line of the transformer. A diff on these files is the
// behavioural change.
//
// To refresh after an intentional behaviour change, copy the `actual` printed
// by a failing assertion into the matching ./expected/<name>.graph.json.
const GOLDEN_CASES = [
  { name: 'editorial', primaryType: 'Article' },
  { name: 'product', primaryType: 'SoftwareApplication' },
  { name: 'multi-producer', primaryType: 'Article' },
  { name: 'merch-card', primaryType: 'SoftwareApplication' },
];

describe('golden graph per page type', () => {
  setupSuite();

  GOLDEN_CASES.forEach(({ name, primaryType }) => {
    describe(`${name} (${primaryType})`, () => {
      it('emits the expected canonical @graph', async () => {
        await loadFixtureIntoHead(name);
        const manager = trackedManager();
        manager.init();

        const actual = getManagedGraph();
        const expected = JSON.parse(await readFile({ path: `./expected/${name}.graph.json` }));
        expect(actual).to.deep.equal(expected);
      });
    });
  });
});
