// branch: MWPW-142267 commit: 08563c8c5ba2d0f1e7a6213cffe42c399af21bfc Fri, 26 Apr 2024 23:47:31 GMT
import{html as e,css as o,LitElement as l}from"/libs/deps/lit-all.min.js";var t=class extends l{static styles=o`
        :host {
            display: grid;
            justify-items: start;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            grid-auto-flow: row;
            width: auto;
            overflow: hidden;
            align-content: stretch;
            box-sizing: border-box;
            justify-content: start;
            align-items: end;
            align-self: baseline;
        }

        ::slotted([slot='heading']) {
            font-size: 18px;
            margin: 0;
            margin-bottom: 16px;
        }

        ::slotted([slot='content']) {
            display: contents;
        }

        .hidden {
            display: none;
        }

        .see-more {
            font-size: 14px;
            text-decoration: underline;
            color: var(--link-color-dark);
        }
    `;static properties={heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}};updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((s,i)=>{i>=5&&(s.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return e`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?e`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:e``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};customElements.define("merch-whats-included",t);export{t as MerchWhatsIncluded};
//# sourceMappingURL=merch-whats-included.js.map
