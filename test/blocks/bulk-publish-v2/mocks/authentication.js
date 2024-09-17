class MockAuth extends HTMLElement {
  opened() {
    this.dispatchEvent(new CustomEvent('sidekick-ready', { bubbles: true }));
    this.isopen = true;
  }

  status() {
    const permissions = ['delete', 'read', 'write'];
    this.dispatchEvent(new CustomEvent('statusfetched', {
      bubbles: true,
      detail: {
        data: {
          preview: { permissions },
          live: { permissions },
        },
      },
    }));
  }

  loggedin() {
    const permissions = ['delete', 'read', 'write', 'list'];
    this.dispatchEvent(new CustomEvent('statusfetched', {
      bubbles: true,
      detail: {
        data: {
          profile: { name: 'Unit Test' },
          preview: { permissions },
          live: { permissions },
        },
      },
    }));
  }
}

customElements.define('helix-sidekick', MockAuth);
