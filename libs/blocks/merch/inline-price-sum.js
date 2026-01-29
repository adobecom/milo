export function computeSummedOffer(offers) {
  if (offers.length === 0) {
    throw new Error('No offers to sum');
  }

  if (offers.length === 1) {
    return offers[0];
  }

  const baseOffer = { ...offers[0] };

  let totalPrice = 0;
  let totalOriginalPrice = 0;
  let totalPriceWithoutDiscount = 0;
  let totalPriceWithoutTax = 0;

  offers.forEach((offer) => {
    const priceDetails = offer.priceDetails || {};
    const offerPrice = parseFloat(priceDetails.price || offer.price || 0);
    const offerOriginalPrice = parseFloat(
      priceDetails.originalPrice || offer.originalPrice || 0,
    );

    totalPrice += offerPrice;
    totalOriginalPrice += offerOriginalPrice;
    totalPriceWithoutDiscount += parseFloat(
      priceDetails.priceWithoutDiscount || offer.priceWithoutDiscount || 0,
    );
    totalPriceWithoutTax += parseFloat(
      priceDetails.priceWithoutTax || offer.priceWithoutTax || 0,
    );
  });

  const summedOffer = {
    ...baseOffer,
    price: totalPrice,
    originalPrice: totalOriginalPrice,
    priceWithoutDiscount: totalPriceWithoutDiscount,
    priceWithoutTax: totalPriceWithoutTax,
    priceDetails: {
      ...baseOffer.priceDetails,
      price: totalPrice,
      originalPrice: totalOriginalPrice,
      priceWithoutDiscount: totalPriceWithoutDiscount,
      priceWithoutTax: totalPriceWithoutTax,
    },
  };

  return summedOffer;
}

export async function createInlinePriceSum(service, context) {
  const osiArray = context.wcsOsi
    .split(',')
    .map((osi) => osi.trim())
    .filter((osi) => osi.length > 0);

  if (osiArray.length === 0) return null;

  const allOffers = [];
  const displayFeatures = {
    recurrence: true,
    unitType: true,
    taxInclusivity: true,
  };
  const recurrenceTexts = [];
  const unitTypeTexts = [];
  const taxInclusivityTexts = [];

  const tempContainer = document.createElement('div');
  tempContainer.style.display = 'none';
  document.body.appendChild(tempContainer);

  for (const osi of osiArray) {
    const osiContext = { ...context, wcsOsi: osi };

    try {
      const priceElement = service.createInlinePrice(osiContext);
      if (!priceElement) {
        // Skip this OSI
      } else {
        tempContainer.appendChild(priceElement);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000);
        });

        await Promise.race([priceElement.onceSettled(), timeoutPromise]);

        if (priceElement.isFailed) {
          // Skip failed element
        } else {
          const offers = priceElement.value;

          if (offers && offers.length > 0) {
            allOffers.push(offers[0]);

            const recurrenceSpan = priceElement.querySelector('.price-recurrence');
            const unitTypeSpan = priceElement.querySelector('.price-unit-type');
            const taxInclusivitySpan = priceElement.querySelector('.price-tax-inclusivity');

            if (!recurrenceSpan || recurrenceSpan.classList.contains('disabled')) {
              displayFeatures.recurrence = false;
            } else {
              recurrenceTexts.push(recurrenceSpan.textContent.trim());
            }

            if (!unitTypeSpan || unitTypeSpan.classList.contains('disabled')) {
              displayFeatures.unitType = false;
            } else {
              unitTypeTexts.push(unitTypeSpan.textContent.trim());
            }

            if (!taxInclusivitySpan || taxInclusivitySpan.classList.contains('disabled')) {
              displayFeatures.taxInclusivity = false;
            } else {
              taxInclusivityTexts.push(taxInclusivitySpan.textContent.trim());
            }
          }
        }
      }
    } catch (error) {
      // Skip failed OSI resolution
    }
  }

  tempContainer.remove();

  if (allOffers.length === 0) return null;

  const summedOffer = computeSummedOffer(allOffers);

  const enhancedContext = {
    ...context,
    displayRecurrence: displayFeatures.recurrence,
    displayPerUnit: displayFeatures.unitType,
    displayTax: displayFeatures.taxInclusivity,
  };

  const priceHTML = service.buildPriceHTML([summedOffer], enhancedContext);

  const span = document.createElement('span');
  span.className = 'price price-summed';
  span.setAttribute('is', 'inline-price');
  span.innerHTML = priceHTML;

  if (displayFeatures.recurrence && recurrenceTexts.length > 0) {
    const recurrenceSpan = span.querySelector('.price-recurrence');
    if (recurrenceSpan) {
      [recurrenceSpan.textContent] = recurrenceTexts;
    }
  }

  if (displayFeatures.unitType && unitTypeTexts.length > 0) {
    const unitTypeSpan = span.querySelector('.price-unit-type');
    if (unitTypeSpan) {
      [unitTypeSpan.textContent] = unitTypeTexts;
    }
  }

  if (displayFeatures.taxInclusivity && taxInclusivityTexts.length > 0) {
    const taxInclusivitySpan = span.querySelector('.price-tax-inclusivity');
    if (taxInclusivitySpan) {
      [taxInclusivitySpan.textContent] = taxInclusivityTexts;
    }
  }

  span.setAttribute('data-display-recurrence', displayFeatures.recurrence.toString());
  span.setAttribute('data-display-per-unit', displayFeatures.unitType.toString());
  span.setAttribute('data-display-tax', displayFeatures.taxInclusivity.toString());

  if (summedOffer.term) {
    span.setAttribute('data-term', summedOffer.term);
  }

  if (summedOffer.commitment) {
    span.setAttribute('data-commitment', summedOffer.commitment);
  }

  if (enhancedContext.forceTaxExclusive !== undefined) {
    span.setAttribute('data-force-tax-exclusive', enhancedContext.forceTaxExclusive);
  }

  return span;
}
