export function debounce(callback, time = 300) {
  if (typeof callback !== 'function') return undefined;

  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), time);
  };
}

export default { debounce };
