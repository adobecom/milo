import '@spectrum-web-components/overlay/sp-overlay.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import { Overlay } from '@spectrum-web-components/overlay/src/Overlay.js';
export { SlottableRequestEvent } from '@spectrum-web-components/overlay/src/slottable-request-event.js';


// temporary workaround for dynamic imports
// eslint-disable-next-line no-underscore-dangle
window.__merch__spectrum_Overlay = Overlay;
