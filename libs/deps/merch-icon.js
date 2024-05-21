// branch: develop commit: 369516f3cda51fb1219ad0b3cf2c94c8f094c49b Tue, 21 May 2024 08:39:16 GMT
import{LitElement as r,html as e,css as s}from"/libs/deps/lit-all.min.js";var i=class extends r{static properties={size:{type:String,attribute:!0},src:{type:String,attribute:!0}};constructor(){super(),this.size="m"}render(){let t=this.closest("merch-card")?.querySelector('div[slot="body-xs"]').querySelector('a[href$="#mnemonic-link"]');return t&&(t.href=t.href.replace("#mnemonic-link","")),t?e`<a href="${t.href||"#"}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
                  />
              </a>`:e` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}static styles=s`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--img-width);
            height: var(--img-height);
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `};customElements.define("merch-icon",i);export{i as default};
//# sourceMappingURL=merch-icon.js.map
