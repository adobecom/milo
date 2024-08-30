import { css } from 'lit';

export const styles = css`
    .horizontal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px 0px;
    }
    
    .vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0px;
    }

    .timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        height: 27px;
    }

    .light .timer-label {
        color: #000000;
    }

    .dark .timer-label {
        color: #FFFFFF;
    }

    .horizontal .timer-label {
        align-self: center;
        margin: 0px 2px 27px 2px;
    }

    .vertical .timer-label {
        align-self: flex-start;
    }

    .vertical > div.timer-block {
        display: flex;
        align-self: flex-start;
    }

    .horizontal > div.timer-block {
        display: flex;
        margin-left: 10px;
    }

    .timer-fragment {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .timer-box {
        padding: 0px 9px;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }

    .light .timer-box {
        background-color: #222222;
        color: #FFFFFF;
    }

    .dark .timer-box {
        background-color: #EBEBEB;
        color: #1D1D1D;
    }

    .timer-unit-container {
        display: flex;
        flex-direction: row;
        column-gap: 2px;
        align-items: center;
    }
    
    .timer-unit-label {
        width: 100%;
        font-size: 14px;
        font-weight: regular;
        text-align: left;
    }

    .light .timer-unit-label {
        color: #464646;
    }

    .dark .timer-unit-label {
        color: #D1D1D1;
    }
`;
