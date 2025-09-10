var h=Object.defineProperty;var f=(i,t,e)=>t in i?h(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var x=(i,t)=>()=>(i&&(t=i(i=0)),t);var b=(i,t)=>{for(var e in t)h(i,e,{get:t[e],enumerable:!0})};var s=(i,t,e)=>f(i,typeof t!="symbol"?t+"":t,e);var g={};b(g,{default:()=>r});import{LitElement as y,html as l,css as v}from"../lit-all.min.js";function S(){return customElements.get("sp-tooltip")!==void 0&&customElements.get("overlay-trigger")!==void 0&&document.querySelector("sp-theme")!==null}var r,d=x(()=>{r=class extends y{constructor(){super(),this.content="",this.placement="top",this.variant="info",this.size="xs"}get effectiveContent(){return this.tooltipText||this.mnemonicText||this.content||""}get effectivePlacement(){return this.tooltipPlacement||this.mnemonicPlacement||this.placement||"top"}renderIcon(){return this.src?l`<merch-icon 
            src="${this.src}" 
            size="${this.size}"
        ></merch-icon>`:l`<slot></slot>`}render(){let t=this.effectiveContent,e=this.effectivePlacement;return t?S()?l`
                <overlay-trigger placement="${e}">
                    <span slot="trigger">${this.renderIcon()}</span>
                    <sp-tooltip 
                        placement="${e}"
                        variant="${this.variant}">
                        ${t}
                    </sp-tooltip>
                </overlay-trigger>
            `:l`
                <span 
                    class="css-tooltip ${e}"
                    data-tooltip="${t}"
                    tabindex="0"
                    role="img"
                    aria-label="${t}">
                    ${this.renderIcon()}
                </span>
            `:this.renderIcon()}};s(r,"properties",{content:{type:String},placement:{type:String},variant:{type:String},src:{type:String},size:{type:String},tooltipText:{type:String,attribute:"tooltip-text"},tooltipPlacement:{type:String,attribute:"tooltip-placement"},mnemonicText:{type:String,attribute:"mnemonic-text"},mnemonicPlacement:{type:String,attribute:"mnemonic-placement"}}),s(r,"styles",v`
        :host {
            display: contents;
            overflow: visible;
        }
        
        /* CSS tooltip styles - these are local fallbacks, main styles in global.css.js */
        .css-tooltip {
            position: relative;
            display: inline-block;
            cursor: pointer;
        }
        
        .css-tooltip[data-tooltip]::before {
            content: attr(data-tooltip);
            position: absolute;
            z-index: 999;
            background: var(--spectrum-gray-800, #323232);
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            white-space: normal;
            width: max-content;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            font-size: 12px;
            line-height: 1.4;
            text-align: center;
        }
        
        .css-tooltip[data-tooltip]::after {
            content: '';
            position: absolute;
            z-index: 999;
            width: 0;
            height: 0;
            border: 6px solid transparent;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        
        .css-tooltip:hover[data-tooltip]::before,
        .css-tooltip:hover[data-tooltip]::after,
        .css-tooltip:focus[data-tooltip]::before,
        .css-tooltip:focus[data-tooltip]::after {
            opacity: 1;
        }
        
        /* Position variants */
        .css-tooltip.top[data-tooltip]::before {
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 16px;
        }
        
        .css-tooltip.top[data-tooltip]::after {
            top: -80%;
            left: 50%;
            transform: translateX(-50%);
            border-color: var(--spectrum-gray-800, #323232) transparent transparent transparent;
        }
        
        .css-tooltip.bottom[data-tooltip]::before {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 10px;
        }
        
        .css-tooltip.bottom[data-tooltip]::after {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 5px;
            border-bottom-color: var(--spectrum-gray-800, #323232);
        }
        
        .css-tooltip.left[data-tooltip]::before {
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-right: 10px;
        }
        
        .css-tooltip.left[data-tooltip]::after {
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-right: 5px;
            border-left-color: var(--spectrum-gray-800, #323232);
        }
        
        .css-tooltip.right[data-tooltip]::before {
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 10px;
        }
        
        .css-tooltip.right[data-tooltip]::after {
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 5px;
            border-right-color: var(--spectrum-gray-800, #323232);
        }
    `);customElements.define("mas-mnemonic",r)});import{LitElement as $,html as u,css as w}from"../lit-all.min.js";function z(){return customElements.get("sp-tooltip")!==void 0||document.querySelector("sp-theme")!==null}var n=class extends ${constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}connectedCallback(){super.connectedCallback(),setTimeout(()=>this.handleTooltips(),0)}handleTooltips(){if(z())return;this.querySelectorAll("sp-tooltip, overlay-trigger").forEach(e=>{let a="",p="top";if(e.tagName==="SP-TOOLTIP")a=e.textContent,p=e.getAttribute("placement")||"top";else if(e.tagName==="OVERLAY-TRIGGER"){let o=e.querySelector("sp-tooltip");o&&(a=o.textContent,p=o.getAttribute("placement")||e.getAttribute("placement")||"top")}if(a){let o=document.createElement("mas-mnemonic");o.setAttribute("content",a),o.setAttribute("placement",p);let c=this.querySelector("img"),m=this.querySelector("a");m&&m.contains(c)?o.appendChild(m):c&&o.appendChild(c),this.innerHTML="",this.appendChild(o),Promise.resolve().then(()=>d())}e.remove()})}render(){let{href:t}=this;return t?u`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:u` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};s(n,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),s(n,"styles",w`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }

        :host([size='xxs']) {
            --img-width: 13px;
            --img-height: 13px;
        }

        :host([size='xs']) {
            --img-width: 20px;
            --img-height: 20px;
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }
    `);customElements.define("merch-icon",n);export{n as default};
