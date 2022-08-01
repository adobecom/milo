/* eslint-disable no-param-reassign */
const setJsonLdProductInfo = (productJson, average, total) => {
  if (typeof average !== 'string') average = average.toString();
  if (typeof total !== 'string') total = total.toString();

  productJson.aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: average,
    ratingCount: total,
  };
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  const structuredDataText = JSON.stringify(productJson);
  script.textContent = structuredDataText;
  document.head.appendChild(script);
};

export default setJsonLdProductInfo;
