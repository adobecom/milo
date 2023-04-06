# Checkout CTA
## Checkout parameters

### clientId 
code config (scripts.js) -> default (adobe_com)
### checkoutType 
merch link -> metadata -> default (UCv3)
Metadata key: 'checkout-type'.
### workflowStep 
merch link -> default (email)

### marketSegment 
merch link -> default (COM)

All default values provided by tacocat library, not stored in milo.

### Overwriting default Commerce Checkout values:
in scripts.js
add this to the config object:

const config = {
  ....
  commerce: {
      checkoutClientId: 'creative'
    }
}
