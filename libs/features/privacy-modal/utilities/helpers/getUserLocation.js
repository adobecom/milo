import config from '../config.js';
import loadResource from '../dom/loadResource.js';
import hasOwnProperty from '../lang/hasOwnProperty.js';
/**
 * Check session storage and return data if it's valid
 * @returns {Object|null} Location data if available
 */
const getLocationFromStorage = () => {
  let location = window.sessionStorage.getItem(config.location);

  // Check if data is already stored and try to parse it
  if (location !== null && location !== '') {
    try {
      location = JSON.parse(location);

      // Check if stored data is correct and country is valid
      if (!hasOwnProperty(location, 'country') || location.country === '') {
        location = null;
      }
    } catch (e) {
      // Not a valid JSON, will need to fetch data
      location = null;
    }
  }

  return location;
};

/**
 * Return formatted location object
 * @param {Object} rawData Raw data object
 * @returns {Object} Formatted location object
 */
const getLocationObject = (rawData) => {
  const locationObject = {};
  const { country, state } = rawData;

  if (country) {
    locationObject.country = country;
  }

  if (state) {
    locationObject.state = state;
  }

  return locationObject;
};

/**
 * Get user country based on IP
 * @returns {Promise} location
 */
const getUserLocation = () => new Promise((resolve) => {
  const existingLocation = getLocationFromStorage();
  if (existingLocation !== null) {
    resolve(existingLocation);
  } else {
    const callback = `privacy_${Date.now()}${Math.round(100000 * Math.random())}`;
    window[callback] = (data) => {
      const locationData = getLocationObject(data);
      window.sessionStorage.setItem(config.location, JSON.stringify(locationData));
      resolve(locationData);

      delete window[callback];
    };

    loadResource({
      path: `${config.locationURL}${callback}`,
      type: 'script',
    }).catch(() => {
      resolve({});
    });
  }
});

export default getUserLocation;
