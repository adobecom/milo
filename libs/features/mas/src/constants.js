export const Commitment = Object.freeze({
    MONTH: 'MONTH',
    YEAR: 'YEAR',
    TWO_YEARS: 'TWO_YEARS',
    THREE_YEARS: 'THREE_YEARS',
    PERPETUAL: 'PERPETUAL',
    TERM_LICENSE: 'TERM_LICENSE',
    ACCESS_PASS: 'ACCESS_PASS',
    THREE_MONTHS: 'THREE_MONTHS',
    SIX_MONTHS: 'SIX_MONTHS',
});

export const Term = Object.freeze({
    ANNUAL: 'ANNUAL',
    MONTHLY: 'MONTHLY',
    TWO_YEARS: 'TWO_YEARS',
    THREE_YEARS: 'THREE_YEARS',
    P1D: 'P1D',
    P1Y: 'P1Y',
    P3Y: 'P3Y',
    P10Y: 'P10Y',
    P15Y: 'P15Y',
    P3D: 'P3D',
    P7D: 'P7D',
    P30D: 'P30D',
    HALF_YEARLY: 'HALF_YEARLY',
    QUARTERLY: 'QUARTERLY',
});

/**
 * Common namespace prefix for CSS classes and DOM event types.
 * @see https://git.corp.adobe.com/wcms/team/discussions/27
 */
export const NAMESPACE = 'merch';
/**
 * This CSS class name is used to:
 * - show only selected offer on a card connected to a subscription panel
 * - TBD
 */
export const CLASS_NAME_HIDDEN = 'hidden';
/**
 * Event type dispatched by the commenrce service whenever it is ready.
 * Should be in sync with `packages/commerce/src/constants.js`.
 */
export const EVENT_TYPE_READY = 'wcms:commerce:ready';
/**
 * Tag name of the commerce service component.
 * Should be in sync with `packages/commerce/src/constants.js`.
 */
export const TAG_NAME_SERVICE = 'mas-commerce-service';

export const SELECTOR_MAS_INLINE_PRICE =
    'span[is="inline-price"][data-wcs-osi]';
export const SELECTOR_MAS_CHECKOUT_LINK =
    'a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';
export const SELECTOR_MAS_SP_BUTTON = 'sp-button[data-wcs-osi]';
export const SELECTOR_MAS_ELEMENT = `${SELECTOR_MAS_INLINE_PRICE},${SELECTOR_MAS_CHECKOUT_LINK}`;

/** Event to dispatch when a merch-offer is ready */
export const EVENT_MERCH_OFFER_READY = 'merch-offer:ready';

/** Event to dispatch when all the offers of a merch-offer-select sont ready */
export const EVENT_MERCH_OFFER_SELECT_READY = 'merch-offer-select:ready';

/** Event to dispatch when a merch-card is ready */
export const EVENT_MERCH_CARD_READY = 'merch-card:ready';

export const EVENT_MERCH_CARD_ACTION_MENU_TOGGLE =
    'merch-card:action-menu-toggle';

export const EVENT_OFFER_SELECTED = 'merch-offer:selected';

export const EVENT_MERCH_STOCK_CHANGE = 'merch-stock:change';

export const EVENT_MERCH_STORAGE_CHANGE = 'merch-storage:change';

export const EVENT_MERCH_QUANTITY_SELECTOR_CHANGE =
    'merch-quantity-selector:change';

export const EVENT_MERCH_CARD_QUANTITY_CHANGE = 'merch-card-quantity:change';

export const EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE = 'merch-modal:addon-and-quantity-update';

export const EVENT_MERCH_SEARCH_CHANGE = 'merch-search:change';

export const EVENT_MERCH_CARD_COLLECTION_SORT = 'merch-card-collection:sort';

export const EVENT_MERCH_CARD_COLLECTION_SHOWMORE =
    'merch-card-collection:showmore';

export const EVENT_MERCH_SIDENAV_SELECT = 'merch-sidenav:select';

export const EVENT_AEM_LOAD = 'aem:load';
export const EVENT_AEM_ERROR = 'aem:error';
export const EVENT_MAS_READY = 'mas:ready';
export const EVENT_MAS_ERROR = 'mas:error';

export const CLASS_NAME_FAILED = 'placeholder-failed';
export const CLASS_NAME_PENDING = 'placeholder-pending';
export const CLASS_NAME_RESOLVED = 'placeholder-resolved';

export const ERROR_MESSAGE_BAD_REQUEST = 'Bad WCS request';
export const ERROR_MESSAGE_OFFER_NOT_FOUND = 'Commerce offer not found';
export const ERROR_MESSAGE_MISSING_LITERALS_URL = 'Literals URL not provided';

export const EVENT_TYPE_FAILED = 'mas:failed';
export const EVENT_TYPE_RESOLVED = 'mas:resolved';

export const LOG_NAMESPACE = 'mas/commerce';

export const PARAM_MAS_PREVIEW = "mas.preview";
export const PARAM_ENV = 'commerce.env';
export const PARAM_LANDSCAPE = 'commerce.landscape';
export const PARAM_AOS_API_KEY = 'commerce.aosKey';
export const PARAM_WCS_API_KEY = 'commerce.wcsKey';

export const WCS_PROD_URL = 'https://www.adobe.com/web_commerce_artifact';
export const WCS_STAGE_URL =
    'https://www.stage.adobe.com/web_commerce_artifact_stage';

export const STATE_FAILED = 'failed';
export const STATE_PENDING = 'pending';
export const STATE_RESOLVED = 'resolved';

export const Landscape = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
};

export const HEADER_X_REQUEST_ID = 'X-Request-Id';

export const CheckoutWorkflowStep = Object.freeze({
    CHECKOUT: 'checkout',
    CHECKOUT_EMAIL: 'checkout/email',
    SEGMENTATION: 'segmentation',
    BUNDLE: 'bundle',
    COMMITMENT: 'commitment',
    RECOMMENDATION: 'recommendation',
    EMAIL: 'email',
    PAYMENT: 'payment',
    CHANGE_PLAN_TEAM_PLANS: 'change-plan/team-upgrade/plans',
    CHANGE_PLAN_TEAM_PAYMENT: 'change-plan/team-upgrade/payment',
});

export const CheckoutWorkflow = Object.freeze({ V2: 'UCv2', V3: 'UCv3' });

export const Env = Object.freeze({
    STAGE: 'STAGE',
    PRODUCTION: 'PRODUCTION',
    LOCAL: 'LOCAL',
});

export const PROVIDER_ENVIRONMENT = {
    PRODUCTION: 'PRODUCTION',
};

export const MODAL_TYPE_3_IN_1 = {
    TWP: 'twp',
    D2P: 'd2p',
    CRM: 'crm',
};

export const MARK_START_SUFFIX = ':start';
export const MARK_DURATION_SUFFIX = ':duration';

export const TEMPLATE_PRICE = 'price';
export const TEMPLATE_PRICE_STRIKETHROUGH = 'price-strikethrough';
export const TEMPLATE_PRICE_ANNUAL = 'annual';
export const TEMPLATE_PRICE_LEGAL = 'legal';
