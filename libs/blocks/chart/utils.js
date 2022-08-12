export const throttle = (delay = 250, throttled = () => {}, opts = {}, ...args) => {
  let previousTime = null;
  return () => {
    const time = new Date().getTime();
    let timeout = null;

    if (!previousTime || time - previousTime >= delay) {
      previousTime = time;
      throttled.apply(null, [opts, args]);
      timeout = setTimeout(() => {
        throttled.apply(null, [opts, args]);
        timeout = null;
      }, (delay));
    }
  };
};

export const parseValue = (value) => (
  Number.isInteger(Number(value)) ? parseInt(value, 10) : value
);

export function hasPropertyCI(data, name) {
  return Object.keys(data).some((column) => column.toLowerCase() === name.toLowerCase());
}

export function propertyNameCI(data, name) {
  return Object.keys(data).find((column) => column.toLowerCase() === name.toLowerCase());
}

export function propertyValueCI(data, name) {
  return data[propertyNameCI(data, name)];
}
