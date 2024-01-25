import { LitElement } from '../../../../libs/deps/lit-all.min.js';

class HelixSidekick extends LitElement {
  static properties = {
    opened: { state: true },
    status: { state: true },
  };

  constructor() {
    super();
    this.opened = false;
    this.status = false;
  }

  openMockSidekick() {
    if (!this.opened) {
      this.dispatchEvent(new CustomEvent('sidekick-ready', { bubbles: true }));
      this.opened = true;
    }
  }

  setMockUserStatus() {
    if (!this.status) {
      const permissions = ['delete', 'read', 'write'];
      this.dispatchEvent(new CustomEvent('statusfetched', {
        bubbles: true,
        detail: {
          data: {
            profile: { name: 'testing' },
            preview: { permissions },
            live: { permissions },
          },
        },
      }));
      this.status = true;
    }
  }
}

customElements.define('helix-sidekick', HelixSidekick);
