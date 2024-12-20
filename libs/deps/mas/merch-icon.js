var g=Object.defineProperty;var a=(i,t,s)=>t in i?g(i,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[t]=s;var h=(i,t,s)=>a(i,typeof t!="symbol"?t+"":t,s);import{LitElement as m,html as r,css as l}from"../lit-all.min.js";var e=class extends m{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?r`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:r` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};h(e,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),h(e,"styles",l`
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

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `);customElements.define("merch-icon",e);export{e as default};
