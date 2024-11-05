// ../utils/action.js
function debounce(callback, time = 300) {
  if (typeof callback !== "function") return void 0;
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), time);
  };
}

export {
  debounce
};
//# sourceMappingURL=chunk-B2JWVRT6.js.map
