import { css } from 'lit';
import {
    DESKTOP_UP,
    LARGE_DESKTOP,
    TABLET_UP,
    MOBILE_LANDSCAPE,
    TABLET_DOWN,
} from '../media.js';

export const styles = css`
    .countdown-timer.horizontal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
    }
    
    .countdown-timer.vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
    }

    .countdown-timer.horizontal > div.timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-color: #FFFFFF;
        height: 27px;
        align-self: center;
        margin: 0px 2px 27px 2px;
    }

    .countdown-timer.vertical > div.timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-color: #FFFFFF;
        height: 27px;
        align-self: flex-start;
    }

    .countdown-timer.vertical > div.timer-container-parent {
        display: flex;
        align-self: flex-start;
    }

    .countdown-timer.horizontal > div.timer-container-parent {
        display: flex;
        margin-left: 10px;
    }

    .timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .timer-box {
        background-color: #EBEBEB;
        color: #1D1D1D;
        padding: 0px 9px;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
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
        font-color: #D1D1D1;
        text-align: left;
    }
`;
