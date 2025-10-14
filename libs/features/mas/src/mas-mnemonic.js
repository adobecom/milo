import { LitElement, html, css } from 'lit';

function hasSpectrumTooltip() {
    // Only use Spectrum if ALL required components are available
    return customElements.get('sp-tooltip') !== undefined && 
           customElements.get('overlay-trigger') !== undefined &&
           document.querySelector('sp-theme') !== null;
}

/**
 * MasMnemonic - A web component that handles mnemonics (icons with optional tooltips) within MAS
 * Automatically detects if Spectrum Web Components are available and renders appropriately
 */
export default class MasMnemonic extends LitElement {
    static properties = {
        content: { type: String },
        placement: { type: String },
        variant: { type: String },
        // Icon-based tooltip properties
        src: { type: String },
        size: { type: String },
        tooltipText: { type: String, attribute: 'tooltip-text' },
        tooltipPlacement: { type: String, attribute: 'tooltip-placement' },
        // Support studio's mnemonic attribute names
        mnemonicText: { type: String, attribute: 'mnemonic-text' },
        mnemonicPlacement: { type: String, attribute: 'mnemonic-placement' },
    };

    static styles = css`
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
    `;

    constructor() {
        super();
        this.content = '';
        this.placement = 'top';
        this.variant = 'info';
        this.size = 'xs';
    }

    get effectiveContent() {
        return this.tooltipText || this.mnemonicText || this.content || '';
    }

    get effectivePlacement() {
        return this.tooltipPlacement || this.mnemonicPlacement || this.placement || 'top';
    }

    renderIcon() {
        if (!this.src) return html`<slot></slot>`;
        return html`<merch-icon 
            src="${this.src}" 
            size="${this.size}"
        ></merch-icon>`;
    }

    render() {
        const content = this.effectiveContent;
        const placement = this.effectivePlacement;
        
        if (!content) {
            return this.renderIcon();
        }

        // Check for Spectrum components at render time for better timing
        const useSpectrum = hasSpectrumTooltip();

        if (useSpectrum) {
            // Use Spectrum tooltip if available
            return html`
                <overlay-trigger placement="${placement}">
                    <span slot="trigger">${this.renderIcon()}</span>
                    <sp-tooltip 
                        placement="${placement}"
                        variant="${this.variant}">
                        ${content}
                    </sp-tooltip>
                </overlay-trigger>
            `;
        } else {
            // Use CSS tooltip
            return html`
                <span 
                    class="css-tooltip ${placement}"
                    data-tooltip="${content}"
                    tabindex="0"
                    role="img"
                    aria-label="${content}">
                    ${this.renderIcon()}
                </span>
            `;
        }
    }
}

customElements.define('mas-mnemonic', MasMnemonic);
