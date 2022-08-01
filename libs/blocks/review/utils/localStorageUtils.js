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

export { getLocalStorage, setLocalStorage };
