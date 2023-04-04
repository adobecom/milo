const DEFAULT_WORKFLOW_STEP = 'email';
const DEFAULT_CLIENT_ID = 'adobe_com';

function getWorkflowStep(searchParams, checkoutContext) {
  const workflowStep = searchParams?.get('workflowStep') ?? checkoutContext?.workflowStep ?? DEFAULT_WORKFLOW_STEP;
  return workflowStep?.replace('_', '/');
}

/**
 * Checkout Type, Workflow Step and Market Segment can be set in the OST link.
 * If there is no value in search params, value is taken from global config.
 * If there is no value defined in global config, default value is used.
 * @param {*} searchParams link level overrides for checkout parameters
 * @returns checkout context object required to build a checkout url
 */
export default function getCheckoutContext(searchParams, config) {
  const { commerce } = config;
  const checkoutContext = commerce?.checkoutContext;
  const checkoutClientId = checkoutContext?.clientId ?? DEFAULT_CLIENT_ID;
  const checkoutWorkflow = searchParams.get('checkoutType') ?? checkoutContext?.checkoutType;
  const checkoutWorkflowStep = getWorkflowStep(searchParams, checkoutContext);
  const checkoutMarketSegment = searchParams.get('marketSegment');

  return {
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    checkoutMarketSegment,
  };
}
