var m=Object.defineProperty;var h=(e,t,o)=>t in e?m(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var s=(e,t,o)=>h(e,typeof t!="symbol"?t+"":t,o);import{LitElement as w,html as l}from"../lit-all.min.js";import{css as x}from"../lit-all.min.js";var d="(max-width: 767px)";var p="(min-width: 1200px)",a="(min-width: 1600px)",u={matchMobile:window.matchMedia(d),matchDesktop:window.matchMedia(`${p} and (not ${a})`),matchDesktopOrUp:window.matchMedia(p),matchLargeDesktop:window.matchMedia(a),get isMobile(){return this.matchMobile.matches},get isDesktop(){return this.matchDesktop.matches},get isDesktopOrUp(){return this.matchDesktopOrUp.matches}};var c=x`
    #label {
        align-items: center;
        cursor: pointer;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxxs);
        white-space: nowrap;
        font-size: 12px;
        line-height: 15px;
    }

    #label.icon::before {
        background-position: center;
        background-size: contain;
        background: var(--secure-icon) no-repeat;
        content: '';
        display: inline-block;
        height: 1em;
        width: 1em;
    }
`;var g="merch-secure-transaction",i=class extends w{constructor(){super(),this.labelText="",this.showIcon=!0,this.tooltipText=""}render(){let{labelText:t,showIcon:o,tooltipText:n}=this,r=l`
            <div class="${o?"icon":""}" id="label" slot="trigger">
                ${t}
            </div>
        `;return n?l`
            <overlay-trigger placement="top-start" offset="4">
                ${r}
                <sp-tooltip id="tooltip" slot="hover-content" delayed
                    >${n}</sp-tooltip
                >
            </overlay-trigger>
        `:r}};s(i,"properties",{labelText:{attribute:"label",type:String},showIcon:{attribute:"icon",type:Boolean},tooltipText:{attribute:"tooltip",type:String}}),s(i,"styles",[c]);window.customElements.define(g,i);export{i as default};
