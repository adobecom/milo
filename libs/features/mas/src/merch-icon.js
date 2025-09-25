import { LitElement, html, css } from 'lit';

// Self-contained tooltip detection for MAS
function hasSpectrumTooltip() {
    return customElements.get('sp-tooltip') !== undefined || 
           document.querySelector('sp-theme') !== null;
}

export default class MerchIcon extends LitElement {
    static properties = {
        size: { type: String, attribute: true },
        src: { type: String, attribute: true },
        alt: { type: String, attribute: true },
        href: { type: String, attribute: true },
        loading: { type: String, attribute: true },
    };

    constructor() {
        super();
        this.size = 'm';
        this.alt = '';
        this.loading = 'lazy';
    }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => this.handleTooltips(), 0);
    }

    handleTooltips() {
        if (hasSpectrumTooltip()) return;
        
        const tooltipElements = this.querySelectorAll('sp-tooltip, overlay-trigger');
        
        tooltipElements.forEach(element => {
            let content = '';
            let placement = 'top';
            
            if (element.tagName === 'SP-TOOLTIP') {
                content = element.textContent;
                placement = element.getAttribute('placement') || 'top';
            } else if (element.tagName === 'OVERLAY-TRIGGER') {
                const tooltip = element.querySelector('sp-tooltip');
                if (tooltip) {
                    content = tooltip.textContent;
                    placement = tooltip.getAttribute('placement') || element.getAttribute('placement') || 'top';
                }
            }
            
            if (content) {
                const masMnemonic = document.createElement('mas-mnemonic');
                masMnemonic.setAttribute('content', content);
                masMnemonic.setAttribute('placement', placement);
                
                const img = this.querySelector('img');
                const link = this.querySelector('a');
                
                if (link && link.contains(img)) {
                    masMnemonic.appendChild(link);
                } else if (img) {
                    masMnemonic.appendChild(img);
                }
                
                this.innerHTML = '';
                this.appendChild(masMnemonic);
                
                import('./mas-mnemonic.js');
            }
            
            element.remove();
        });
    }

    render() {
        const { href } = this;
        return href
            ? html`<a href="${href}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`
            : html` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`;
    }

    static styles = css`
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
    `;
}

customElements.define('merch-icon', MerchIcon);
