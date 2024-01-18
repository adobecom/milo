import { wait } from '../../../libs/blocks/bulk-publish/utils.js';
import { LitElement } from '../../../libs/deps/lit-all.min.js';

class HelixSidekick extends LitElement {
  runMockEvents() {
    this.dispatchEvent(new CustomEvent('sidekick-ready'));
    wait(2000);
    this.dispatchEvent(new CustomEvent('statusfetched', {
      detail: {
        data: {
          profile: { name: 'testing' },
          preview: { permissions: ['delete', 'read', 'write'] },
          live: { permissions: ['delete', 'read', 'write'] },
        },
      },
    }));
  }
}

customElements.define('helix-sidekick', HelixSidekick);
