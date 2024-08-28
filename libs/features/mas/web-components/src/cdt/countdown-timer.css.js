import { css, unsafeCSS } from 'lit';
import {
    DESKTOP_UP,
    LARGE_DESKTOP,
    TABLET_UP,
    MOBILE_LANDSCAPE,
    TABLET_DOWN,
} from '../media.js';

export const styles = css`

    .timer-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .timer-box {
        background-color: white;
        color: black;
        padding: 10px 20px
        border-radius: 8px;
        font-size: 1.5rem;
        min-width: 60px;
        text-align: center;
    }
    
    .timer-label {
        font-size: 0.75rem;
        text-align: center;
    }
`;
