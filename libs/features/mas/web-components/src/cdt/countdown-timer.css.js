import { css, unsafeCSS } from 'lit';
import {
    DESKTOP_UP,
    LARGE_DESKTOP,
    TABLET_UP,
    MOBILE_LANDSCAPE,
    TABLET_DOWN,
} from '../media.js';

export const styles = css`
    .countdown-timer {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
    }

    .timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-color: #FFFFFF
    }

    .timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    } 
    
    .timer-box {
        background-color: #EBEBEB;
        color: #1D1D1D;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: regular;
        text-align: center;
    }
    
    .timer-label {
        font-size: 14px;
        font-weight: regular;
        font-color: #D1D1D1;
        text-align: center;
    }
`;
