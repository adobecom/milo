class MasSidenav extends HTMLElement {
  constructor() {
    super();
    this.classList.add('sidenav');
    
    this.innerHTML = `
      <a href="/libs/features/mas/docs/mas.html">Home</a>
      <a href="/libs/features/mas/docs/mas.js.html">mas.js</a>
      <a href="/libs/features/mas/docs/checkout-link.html">Checkout Link</a>
      <a href="/libs/features/mas/docs/checkout-button.html">Checkout Button</a>
      <a href="/libs/features/mas/docs/inline-price.html">Inline Price</a>
      <a href="/libs/features/mas/docs/merch-card.html">Merch Card</a>
      <a href="/libs/features/mas/docs/ccd.html">CCD Gallery</a>
      <a href="/libs/features/mas/docs/adobe-home.html">Adobe Home Gallery</a>
      <a href="/libs/features/mas/docs/plans.html">Plans Gallery</a>
      <a href="/libs/features/mas/docs/benchmarks.html">Benchmarks</a>
    `;
  }
}

customElements.define('mas-sidenav', MasSidenav, { extends: 'aside' });
