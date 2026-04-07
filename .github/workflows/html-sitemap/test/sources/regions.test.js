import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRegionLabels } from '../../lib/sources/regions.js';

test('parseRegionLabels maps region-nav links by geo prefix', () => {
  const labels = parseRegionLabels(`
    <html><body>
      <div class="region-nav">
        <a href="/#_dnt">United States</a>
        <a href="/ca/">Canada - English</a>
        <a href="/ca_fr/">Canada - Français</a>
        <a href="/be_fr/">Belgique - Français</a>
        <a href="/be_nl/">België - Nederlands</a>
      </div>
    </body></html>
  `);

  assert.deepEqual(labels, {
    '': 'United States',
    ca: 'Canada - English',
    ca_fr: 'Canada - Français',
    be_fr: 'Belgique - Français',
    be_nl: 'België - Nederlands',
  });
});
