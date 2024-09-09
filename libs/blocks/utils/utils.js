const getLocalStorage = (key) => {
  const data = window.localStorage.getItem(key);
  try {
    // This will return null if the local storage object is empty.
    return JSON.parse(data);
  } catch (e) {
    // Catch in case someone set something weird in our local storage.
    return null;
  }
};

const setLocalStorage = (key, data) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 5000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

export { getLocalStorage, setLocalStorage, fetchWithTimeout };
