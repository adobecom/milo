import '../../../utils/lana.js';
import './commerce.js';
import './merch-card.js';
import './merch-icon.js';
import './merch-mnemonic-list.js';
import './merch-offer-select.js';
import './merch-offer.js';
import './merch-quantity-select.js';
import './merch-whats-included.js';

import { registerVariant } from './variants/variants.js';
import { updateConfig } from './lana.js';

updateConfig({ sampleRate: 1 });

// Import ccd variants
import {
    CCD_SUGGESTED_AEM_FRAGMENT_MAPPING,
    CCDSuggested,
} from './variants/ccd-suggested.js';
import {
    CCD_SLICE_AEM_FRAGMENT_MAPPING,
    CCDSlice,
} from './variants/ccd-slice.js';

// import ah-try-buy-widget variant
import {
    AH_TRY_BUY_WIDGET_AEM_FRAGMENT_MAPPING,
    AHTryBuyWidget,
} from './variants/ah-try-buy-widget.js';

// Register dynamic variants
registerVariant(
    'ccd-suggested',
    CCDSuggested,
    CCD_SUGGESTED_AEM_FRAGMENT_MAPPING,
    CCDSuggested.variantStyle,
);
registerVariant(
    'ccd-slice',
    CCDSlice,
    CCD_SLICE_AEM_FRAGMENT_MAPPING,
    CCDSlice.variantStyle,
);
registerVariant(
    'ah-try-buy-widget',
    AHTryBuyWidget,
    AH_TRY_BUY_WIDGET_AEM_FRAGMENT_MAPPING,
    AHTryBuyWidget.variantStyle,
);
