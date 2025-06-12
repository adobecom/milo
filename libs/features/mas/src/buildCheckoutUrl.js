import { Landscape, CheckoutWorkflowStep, PROVIDER_ENVIRONMENT, MODAL_TYPE_3_IN_1 } from './constants.js';

const AF_DRAFT_LANDSCAPE = 'p_draft_landscape';
const UCV3_PREFIX = '/store/';
const PARAMETERS = new Map([
  ['countrySpecific', 'cs'],
  ['customerSegment', 'cs'],
  ['quantity', 'q'],
  ['authCode', 'code'],
  ['checkoutPromoCode', 'apc'],
  ['rurl', 'rUrl'],
  ['curl', 'cUrl'],
  ['ctxrturl', 'ctxRtUrl'],
  ['country', 'co'],
  ['language', 'lang'],
  ['clientId', 'cli'],
  ['context', 'ctx'],
  ['productArrangementCode', 'pa'],
  ['addonProductArrangementCode', 'ao'],
  ['offerType', 'ot'],
  ['marketSegment', 'ms'],
]);
/*?*
 * List of the keys that can be used to construct Checkout URL.
 * Allow-listing is required because some consumers of the library don't use Typescript so they can pass any object as
 * 'checkoutData'. The library will ignore any unknown key in 'checkoutData'.
 */
const ALLOWED_KEYS = new Set([
  'af',
  'ai',
  'ao',
  'apc',
  'appctxid',
  'cli',
  'co',
  'cs',
  'csm',
  'ctx',
  'ctxRtUrl',
  'DCWATC',
  'dp', // Enable digital payments for iframe context
  'fr', // represents the commerce app redirecting to UC
  'gsp',
  'ijt',
  'lang',
  'lo',
  'mal',
  'ms',
  'mv',
  'mv2',
  'nglwfdata',
  'ot',
  'otac',
  'pa',
  'pcid', // Unified Paywall configuration ID for analytics
  'promoid',
  'q',
  'rf',
  'sc',
  'scl',
  'sdid',
  'sid', // x-adobe-clientsession
  'spint',
  'svar',
  'th',
  'thm',
  'trackingid',
  'usid',
  'workflowid',
  'context.guid',
  'so.ca',
  'so.su',
  'so.tr',
  'so.va',
]);
const REQUIRED_KEYS = ['env', 'workflowStep', 'clientId', 'country'];

/**
 * Maps human-readable parameter name to the name expected by Checkout Page.
 * Map contains values for UC versions, UCv2, UCv3 etc.
 */
export const mapParameterName = (field) => PARAMETERS.get(field) ?? field;

/**
 * For each of the given inputParameters checks if a parameter is allow-listed and adds it to the result with a correct
 * Checkout name (calling mapping in mapParameterName).
 */
export function addParameters( inputParameters, resultParameters, allowedKeys) {
  for (const [key, value] of Object.entries(inputParameters)) {
    const mappedKey = mapParameterName(key);
    if (value != null && allowedKeys.has(mappedKey)) {
      resultParameters.set(mappedKey, value);
    }
  }
}

export function getHostName(env) {
  switch (env) {
    case PROVIDER_ENVIRONMENT.PRODUCTION:
      return 'https://commerce.adobe.com';
    default:
      return 'https://commerce-stg.adobe.com';
  }
}

/**
 * For each Item object iterate over the fields and add as a parameter of Checkout Url.
 * Some fields need a mapping from human-readable name, e.g. countrySpecific -> cs, for this mapParameterName is called.
 * @param items array of offers with their metadata
 * @param parameters result array of Checkout URL parameters
 */
export function setItemsParameter(items, parameters) {
  for (const idx in items) {
    const item = items[idx];
    for (const [key, value] of Object.entries(item)) {
      if (value == null) continue;
      const parameterName = mapParameterName(key);
      parameters.set(`items[${idx}][${parameterName}]`, value);
    }
  }
}

/**
 * Adds 3-in-1 parameters to the URL.
 * @param {URL} url - The URL object to add parameters to
 * @param {string} modal - The type of modal: 'crm', 'twp', or 'd2p'
 * @param {Object} checkoutData - Object containing checkout parameters including:
 *   @param {string} customerSegment - Customer segment value
 *   @param {string} cs - Custom customer segment override
 *   @param {string} ms - Custom market segment override  
 *   @param {string} marketSegment - Market segment value
 *   @param {string} quantity - Quantity value
 *   @param {string} productArrangementCode - Product arrangement code
 *   @param {string} addonProductArrangementCode - Addon product arrangement code
 * @returns URL object
 */
export function add3in1Parameters({ url, modal, is3in1 }) {
  if (!is3in1 || !url?.searchParams) return url;
  url.searchParams.set('rtc', 't');
  url.searchParams.set('lo', 'sl');
  url.searchParams.set('af', 'uc_new_user_iframe,uc_new_system_close');
  if (url.searchParams.get('cli') !== 'doc_cloud') {
    url.searchParams.set('cli', modal === MODAL_TYPE_3_IN_1.CRM ? 'creative' : 'mini_plans');
  }
  // used on catalog page by MEP to preselect plan
  const metaPreselectPlan = document.querySelector('meta[name="preselect-plan"]');
  if (metaPreselectPlan?.content?.toLowerCase() === 'edu') {
    url.searchParams.set('ms', 'EDU');
  } else if (metaPreselectPlan?.content?.toLowerCase() === 'team') {
    url.searchParams.set('cs', 'TEAM');
  }
  return url;
}

/**
 * Builds a UCv3 Checkout URL out of given parameters.
 */
export function buildCheckoutUrl(checkoutData) {
  validateCheckoutData(checkoutData);
  const { env, items, workflowStep, ms, cs, marketSegment, customerSegment, ot, offerType, pa, productArrangementCode, landscape, modal, is3in1, ...rest } =
    checkoutData;
  
  let url = new URL(getHostName(env));
  url.pathname = `${UCV3_PREFIX}${workflowStep}`;
  if (workflowStep !== CheckoutWorkflowStep.SEGMENTATION && workflowStep !== CheckoutWorkflowStep.CHANGE_PLAN_TEAM_PLANS) {
    setItemsParameter(items, url.searchParams);
  }
  addParameters({ ...rest }, url.searchParams, ALLOWED_KEYS);
  if (landscape === Landscape.DRAFT) {
    addParameters({ af: AF_DRAFT_LANDSCAPE }, url.searchParams, ALLOWED_KEYS);
  }
  if (workflowStep === CheckoutWorkflowStep.SEGMENTATION) {
    // ms, ot, cs, pa are params manually set by authors, they should take precedence over 'marketSegment', etc
    const segmentationParameters = {
      marketSegment: ms ?? marketSegment,
      offerType: ot ?? offerType,
      customerSegment: cs ?? customerSegment,
      productArrangementCode: pa ?? productArrangementCode,
      quantity: items?.[0]?.quantity > 1 ? items?.[0]?.quantity : undefined,
      addonProductArrangementCode: productArrangementCode 
        ? items?.find((item) => item.productArrangementCode !== productArrangementCode)?.productArrangementCode 
        : items?.[1]?.productArrangementCode,
    };
    addParameters(segmentationParameters, url.searchParams, ALLOWED_KEYS);
    if (url.searchParams.get('ot') === 'PROMOTION') url.searchParams.delete('ot');
    url = add3in1Parameters({
      url,
      modal,
      is3in1,
    });
  }
  return url.toString();
}



/**
 * Validates 'checkoutData' input in runtime. This is needed to ensure non-typescript consumers won't get false positive
 * checkout URL returned.
 * Iterates over the list of required fields (REQUIRED_KEYS) and checks that each of them is present in 'checkoutData'.
 * If any of required fields is missing - throws and Error with a specified message.
 * For CheckoutWorkflowStep.SEGMENTATION and for CheckoutWorkflowStep.CHANGE_PLAN_TEAM_PLANS 'items' property is not required, for rest of WorkflowStep it is.
 * @param checkoutData object holding the data required to build the checkout URL
 */
function validateCheckoutData(checkoutData) {
  for (const key of REQUIRED_KEYS) {
    if (!checkoutData[key]) {
      throw new Error('Argument "checkoutData" is not valid, missing: ' + key);
    }
  }
  if (
    checkoutData.workflowStep !== CheckoutWorkflowStep.SEGMENTATION &&
    checkoutData.workflowStep !== CheckoutWorkflowStep.CHANGE_PLAN_TEAM_PLANS &&
    !checkoutData.items
  ) {
    throw new Error('Argument "checkoutData" is not valid, missing: items');
  }
  return true;
}
