class MockAuth extends HTMLElement {
  opened() {
    this.dispatchEvent(new CustomEvent('sidekick-ready', { bubbles: true }));
    this.isopen = true;
  }

  status() {
    const permissions = ['delete', 'read', 'write', 'list'];
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
  }
}

customElements.define('helix-sidekick', MockAuth);
