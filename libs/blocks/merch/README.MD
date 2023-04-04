# Overwriting default Commerce Checkout values:
in scripts.js
add this to the config object:

const config = {
  ....
  commerce: {
      checkoutContext: {
        checkoutType: 'UCv2',
        clientId: 'creative',
        workflowStep: 'email/checkout',
      }
    }
}
