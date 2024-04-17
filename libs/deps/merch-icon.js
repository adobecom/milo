// branch: MWPW-138927-3 commit: b2d9c1d7faf66c00dd14bcbdc95571c45e1f4d9f Wed, 17 Apr 2024 12:06:48 GMT
import{LitElement as s,html as e,css as r}from"/libs/deps/lit-all.min.js";var i=class extends s{static properties={size:{type:String,attribute:!0},src:{type:String,attribute:!0}};constructor(){super(),this.size="m"}render(){let t=this.closest("merch-card")?.querySelector('div[slot="body-xs"]').querySelector('a[href$="#mnemonic-link"]');return t&&(t.href=t.href.replace("#mnemonic-link","")),t?e`<a href="${t.href||"#"}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
                  />
              </a>`:e` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}static styles=r`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: contents;
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
