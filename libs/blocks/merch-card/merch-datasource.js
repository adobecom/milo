const ODIN = 'odin';

/**
 * Custom element representing a MerchDatasource.
 *
 * @attr {string} source - Specifies the data source for the component.
 *                         Possible values: "odin".
 */
class MerchDatasource extends HTMLElement {
  #data = {};

  static get observedAttributes() {
    return ['source', 'path'];
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchData() {
    const source = this.getAttribute('source') ?? ODIN;
    const path = this.getAttribute('path');
    if (!path) return;

    const response = await fetch(`https://dev-odin.adobe.com${path}.cfm.gql.json`);
    const data = await response.json();
    this.data = data;
    this.render();
  }

  render() {
    if (!this.isConnected) return;
    this.outerHTML = `
    <merch-icon slot="icons" size="l" src="https://main--cc--adobecom.hlx.page/cc-shared/assets/img/product-icons/svg/creative-cloud.svg" alt="Creative Cloud All Apps"
        href="https://www.adobe.com/creativecloud/all-apps.html"></merch-icon>
    <div slot="action-menu-content">
        <p><strong>Best for</strong>:</p>
        <ul>
            <li>Photo editing</li>
            <li>Compositing</li>
            <li>Drawing and painting</li>
            <li>Graphic design</li>
        </ul>
        <p><strong>Storage</strong>:</p>
        <p>100 GB of cloud storage</p>
        <p><a href="https://adobe.com">See system requirements</a></p>
    </div>
    <h4 slot="heading-xs"><a href="https://www.adobe.com/creativecloud/all-apps.html">Photography</a></h4>
    <h3 slot="heading-m">
        <span is="inline-price" data-display-per-unit="false" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>
    </h3>
    <div slot="body-xs">
        <p>Lightroom, Lightroom Classic, Photoshop on desktop and iPad, and 1TB of cloud storage.</p>
        <p><a href="https://adobe.com">Learn more</a></p>
    </div>
    <div slot="footer">
        <sp-button treatment="outline" variant="primary">Free trial</sp-button>
        <sp-button>Save now</sp-button>
    </div>
    `;
  }
}

customElements.define('merch-datasource', MerchDatasource);
