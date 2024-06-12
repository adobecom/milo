export const throttle = (delay = 250, throttled = () => {}, opts = {}, ...args) => {
  let previousTime = null;
  return () => {
    const time = new Date().getTime();
    let timeout = null;

    if (!previousTime || time - previousTime >= delay) {
      previousTime = time;
      throttled.apply(null, [opts, args]);
      // eslint-disable-next-line no-unused-vars
      timeout = setTimeout(() => {
        throttled.apply(null, [opts, args]);
        timeout = null;
      }, (delay));
    }
  };
};

export const parseValue = (value) => parseFloat(value) || value;

export function hasPropertyCI(data, name) {
  return Object.keys(data).some((column) => column.toLowerCase() === name.toLowerCase());
}

export function propertyNameCI(data, name) {
  return Object.keys(data).find((column) => column.toLowerCase() === name.toLowerCase());
}

export function propertyValueCI(data, name) {
  return data[propertyNameCI(data, name)];
}

export function formatExcelDate(date) {
  let newDate;

  if (!Number.isNaN(+date)) {
    newDate = +date > 99999
      ? new Date(+date * 1000)
      : new Date(Math.round((+date - (1 + 25567 + 1)) * 86400 * 1000));
  } else {
    newDate = new Date(date);
  }

  return newDate.toLocaleString([], { dateStyle: 'short', timeZone: 'GMT' });
}
