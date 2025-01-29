class MasSidenav extends HTMLElement {
  constructor() {
    super();
    this.classList.add('sidenav');

    const homeLink = document.createElement('a');
    homeLink.href = '/libs/features/mas/docs/mas.html';
    homeLink.text = 'Home';
    this.appendChild(homeLink);

    const masJsLink = document.createElement('a');
    masJsLink.href = '/libs/features/mas/docs/mas.js.html';
    masJsLink.text = 'mas.js';
    this.appendChild(masJsLink);

    const checkoutLink = document.createElement('a');
    checkoutLink.href = '/libs/features/mas/docs/checkout-link.html';
    checkoutLink.text = 'Checkout Link'
    this.appendChild(checkoutLink);

    const inlinePriceLink = document.createElement('a');
    inlinePriceLink.href = '/libs/features/mas/docs/inline-price.html';
    inlinePriceLink.text = 'Inline Price';
    this.appendChild(inlinePriceLink);

    const merchCardLink = document.createElement('a');
    merchCardLink.href = '/libs/features/mas/docs/merch-card.html';
    merchCardLink.text = 'Merch Card';
    this.appendChild(merchCardLink);

    const ccdGalleryLink = document.createElement('a');
    ccdGalleryLink.href = '/libs/features/mas/docs/ccd.html';
    ccdGalleryLink.text = 'CCD Gallery';
    this.appendChild(ccdGalleryLink);

    const ahGalleryLink = document.createElement('a');
    ahGalleryLink.href = '/libs/features/mas/docs/adobe-home.html';
    ahGalleryLink.text = 'AH Gallery';
    this.appendChild(ahGalleryLink);

    const benchmarksLink = document.createElement('a');
    benchmarksLink.href = '/libs/features/mas/docs/benchmarks.html';
    benchmarksLink.text = 'Benchmarks';
    this.appendChild(benchmarksLink);
  }
}

customElements.define('mas-sidenav', MasSidenav, { extends: 'aside' });