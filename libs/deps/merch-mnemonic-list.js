// branch: MWPW-142267 commit: 08563c8c5ba2d0f1e7a6213cffe42c399af21bfc Fri, 26 Apr 2024 23:47:31 GMT
import{html as e,css as s,LitElement as i}from"/libs/deps/lit-all.min.js";var t=class extends i{static styles=s`
        :host {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-bottom: 10px;
        }

        ::slotted([slot='icon']) {
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
        }

        ::slotted([slot='description']) {
            font-size: 14px;
            line-height: 21px;
            margin: 0;
        }

        :host .hidden {
            display: none;
        }
    `;static properties={description:{type:String,attribute:!0}};constructor(){super()}render(){return e`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};customElements.define("merch-mnemonic-list",t);export{t as MerchMnemonicList};
//# sourceMappingURL=merch-mnemonic-list.js.map
