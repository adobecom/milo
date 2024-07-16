// branch: MWPW-142267 commit: 77b7e5b35a2706362b75f387151b077615df049b Mon, 15 Jul 2024 21:03:03 GMT
import{html as e,css as i,LitElement as s}from"/libs/deps/lit-all.min.js";var t=class extends s{static styles=i`
        :host {
            display: flex;
            flex-direction: row;
            gap: 5px;
            margin-bottom: 5px;
            margin-right: 10px;
            align-items: flex-end;
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
