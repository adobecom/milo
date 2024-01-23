// Add a single value to an average and return the new average
const addToAverage = (val, currentAvg, totalCount) => (val - currentAvg) / totalCount + currentAvg;

// Differentiate between a mouse click on a radio button vs a keyboard navigation
const isKeyboardNavigation = (ev) => (ev.clientX === 0 && ev.clientY === 0)
  // Safari populatex clientX/Y even with keyboard nav,
  // so using the non-standard webkitForce to differentiate
  || (ev.nativeEvent
    && ev.nativeEvent.webkitForce !== undefined
    && ev.nativeEvent.webkitForce === 0);

const checkPostUrl = (postUrl, env) => {
  try {
    const url = new URL(postUrl);
    const adobeUrlPattern = /adobe\.com$/;
    return (env?.name !== 'prod' && url.origin.match(adobeUrlPattern))
      ? url.origin.replace(adobeUrlPattern, 'stage.adobe.com') + url.pathname + url.search + url.hash
      : postUrl;
  } catch (err) {
    throw new Error(`Invalid URL format: ${err.message}`);
  }
};

export { addToAverage, isKeyboardNavigation, checkPostUrl };
