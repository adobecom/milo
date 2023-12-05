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
    const hours = Math.floor((+date % 1) * 24);
    const minutes = Math.floor((((+date % 1) * 24) - hours) * 60);
    const offsetUTC = 24 - (new Date().getTimezoneOffset() / 60);

    newDate = new Date(Date.UTC(0, 0, +date, hours - offsetUTC, minutes));
  } else {
    newDate = new Date(date);
  }

  const localDateFormat = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
  );

  return localDateFormat.toLocaleString([], { dateStyle: 'short' });
}
