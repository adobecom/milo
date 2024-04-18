// branch: MWPW-138927-3 commit: b2d9c1d7faf66c00dd14bcbdc95571c45e1f4d9f Wed, 17 Apr 2024 12:06:48 GMT
import{LitElement as s,css as r,html as n}from"/libs/deps/lit-all.min.js";var c="merch-stock:change";var t=class extends s{static styles=[r`
            ::slotted(div) {
                display: none;
            }

            :host(:not([plan-type])) {
                display: none;
            }

            :host([plan-type='ABM']) ::slotted([data-plan-type='ABM']),
            :host([plan-type='M2M']) ::slotted([data-plan-type='M2M']),
            :host([plan-type='PUF']) ::slotted([data-plan-type='PUF']) {
                display: block;
            }

            sp-checkbox {
                margin: 0;
                font-size: 12px;
                line-height: 15px;
            }
        `];static properties={checked:{type:Boolean,attribute:"checked",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0}};checked=!1;constructor(){super()}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent(c,{detail:{checked:e.target.checked,planType:this.planType},bubbles:!0}))}connectedCallback(){this.style.setProperty("--mod-checkbox-font-size","12px"),super.connectedCallback(),this.updateComplete.then(()=>{this.querySelectorAll('[is="inline-price"]').forEach(async e=>{await e.onceSettled(),e.parentElement.setAttribute("data-plan-type",e.value[0].planType)})})}render(){if(this.planType)return n`
            <sp-checkbox
                size="s"
                @change=${this.handleChange}
                ?checked=${this.checked}
            >
                <slot></slot>
            </sp-checkbox>
        `}get osi(){if(this.checked)return this.querySelector(`div[data-plan-type="${this.planType}"] [is="inline-price"]`)?.value?.[0].offerSelectorIds[0]}};window.customElements.define("merch-stock",t);export{t as MerchStock};
//# sourceMappingURL=merch-stock.js.map
