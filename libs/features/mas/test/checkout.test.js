
// it('should not set quantity parameter when quantity is 1', () => {
//   const checkoutData = {
//     env: PROVIDER_ENVIRONMENT.PRODUCTION,
//     workflowStep: CheckoutWorkflowStep.SEGMENTATION,
//     clientId: 'testClient',
//     country: 'US',
//     items: [{ quantity: 1 }],
//     modal: 'twp',
//     customerSegment: 'INDIVIDUAL',
//     marketSegment: 'EDU',
//     is3in1: true,
//   };
//   const url = buildCheckoutUrl(checkoutData);
//   const parsedUrl = new URL(url);
//   expect(parsedUrl.searchParams.has('q')).to.be.false;
// });

// it('should prioritize manually set cs and ms over marketSegment and customerSegment', () => {
//   const checkoutData = {
//     env: PROVIDER_ENVIRONMENT.PRODUCTION,
//     workflowStep: CheckoutWorkflowStep.SEGMENTATION,
//     clientId: 'testClient',
//     country: 'US',
//     items: [{ quantity: 1 }],
//     modal: 'twp',
//     customerSegment: 'INDIVIDUAL',
//     marketSegment: 'EDU',
//     cs: 'custom_cs',
//     ms: 'custom_ms'
//   };
//   const url = buildCheckoutUrl(checkoutData);
//   const parsedUrl = new URL(url);
//   expect(parsedUrl.searchParams.get('cs')).to.equal('custom_cs');
//   expect(parsedUrl.searchParams.get('ms')).to.equal('custom_ms');
// });