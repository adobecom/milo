class MockAuth extends HTMLElement {
  constructor() {
    super();
    this.appStore = { status: {} };
  }

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
          profile: { name: 'Unit Test', email: 'tester@adobe.com' },
          preview: { permissions },
          live: { permissions },
        },
      },
    }));
  }
}

customElements.define('helix-sidekick', MockAuth);
