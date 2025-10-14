import { css } from 'lit';

export const styles = css`
    :host {
        box-sizing: border-box;
        --background-color: var(--qs-background-color, #f6f6f6);
        --text-color: #000;
        --radius: 5px;
        --border-color: var(--qs-border-color, #e8e8e8);
        --border-width: var(--qs-border-width, 1px);
        --label-font-size: var(--qs-label-font-size, 12px);
        --font-size: var(--qs-font-size, 12px);
        --label-color: var(--qs-lable-color, #000);
        --input-height: var(--qs-input-height, 30px);
        --input-width: var(--qs-input-width, 72px);
        --button-width: var(--qs-button-width, 30px);
        --font-size: var(--qs-font-size, 12px);
        --picker-down-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"><path d="M4 7.01a1 1 0 0 1 1.706-.706L8.993 9.59l3.29-3.285A1 1 0 0 1 13.72 7.69l-.024.025L9.7 11.707a1 1 0 0 1-1.413 0L4.293 7.716A.995.995 0 0 1 4 7.01z" fill="%23787878"/></svg>');
        --picker-up-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"><path d="M14 10.99a1 1 0 0 1-1.706.706L9.005 8.41l-3.289 3.286a1 1 0 0 1-1.437-1.387l.025-.024L8.3 6.293a1 1 0 0 1 1.413 0l3.994 3.991a.995.995 0 0 1 .293.706z" fill="%23787878"/></svg>');
        --checkmark-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M8.648 1.613a.922.922 0 0 0-1.294.156L3.794 6.3 2.632 4.906a.922.922 0 0 0-1.416 1.18l1.89 2.269c.02.023.048.032.07.052a.862.862 0 0 0 .07.083.883.883 0 0 0 .128.07.892.892 0 0 0 .095.051.917.917 0 0 0 .345.076h.001a.915.915 0 0 0 .357-.08.897.897 0 0 0 .099-.057.88.88 0 0 0 .134-.077.862.862 0 0 0 .069-.086c.02-.021.047-.03.066-.053l4.264-5.427a.921.921 0 0 0-.156-1.294z" fill="%23787878"/></svg>');
        --qs-transition: var(--transition);

        display: block;
        position: relative;
        color: var(--text-color);
        line-height: var(--qs-line-height, 2);
    }

    .text-field {
        display: flex;
        align-items: center;
        width: var(--input-width);
        position: relative;
        margin-top: 6px;
    }

    .text-field-input {
        font-family: inherit;
        padding: 0;
        font-size: var(--font-size);
        height: var(--input-height);
        width: calc(var(--input-width) - var(--button-width));
        border: var(--border-width) solid var(--border-color);
        border-top-left-radius: var(--radius);
        border-bottom-left-radius: var(--radius);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
        padding-inline-start: 12px;
        box-sizing: border-box;
        -moz-appearance: textfield;
        z-index: 1;
    }

    .text-field-input::-webkit-inner-spin-button,
    .text-field-input::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
    }

    .label {
        font-size: var(--label-font-size);
        color: var(--label-color);
    }

    .picker-button {
        width: var(--button-width);
        height: var(--input-height);
        position: absolute;
        inset-inline-end: 0;
        border: var(--border-width) solid var(--border-color);
        border-top-right-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
        background-color: var(--background-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
    }

    .picker-button-fill {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: var(--picker-down-icon);
        background-position: center;
        background-repeat: no-repeat;
    }
    
    .picker-button-fill.closed {
        background-image: var(--picker-up-icon);
    }

    .popover {
        position: absolute;
        left: 0;
        width: var(--input-width);
        border-radius: var(--radius);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 100;
        transition: var(--qs-transition);
        visibility: hidden;
        box-sizing: border-box;
    }

    .popover[placement="bottom"] {
        top: var(--input-height);
        margin-top: var(--popover-margin-top, 6px);
    }

    .popover[placement="top"] {
        bottom: var(--input-height);
        margin-bottom: var(--popover-margin-bottom, 6px);
    }

    .popover.open {
        visibility: visible;
        background: #ffffff;
        border: var(--border-width) solid var(--border-color);
    }

    .popover.closed {
        visibility: hidden;
        pointer-events: none;
        transition: none;
    }

    ::slotted(p) {
        margin: 0;
    }

    .item {
        display: flex;
        align-items: center;
        color: var(--text-color);
        font-size: var(--font-size);
        padding-inline-start: 12px;
        box-sizing: border-box;
    }

    .item.highlighted {
        background-color: var(--background-color);
    }
    
    .item.selected {
        background-image: var(--checkmark-icon);
        background-position: right 7px center;
        background-repeat: no-repeat;
    }
`;
