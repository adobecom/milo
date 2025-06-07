/**
 * Dispatches a custom event to the `window` object, along with eventual event details
 * @param {String} eventName The event that should be dispatched to the `window` object
 * @param {*} eventDetail The data that should be passed in
 * the `detail` property of the dispatched event
 * @example
 * // will log 'Event has been triggered with detail: {a: 1}' to the console
 * window.addEventListener('feds', (event) => {
 *   console.log('Event has been triggered with detail:', event.detail);
 * });
 * dispatchCustomEvent('feds', { a: 1 });
 */
const dispatchCustomEvent = (eventName, eventDetail) => {
  let evt;

  if ((typeof window.CustomEvent === 'function')) {
    evt = new window.CustomEvent(eventName, { detail: eventDetail });
  } else {
    evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(eventName, false, false, eventDetail);
  }

  window.dispatchEvent(evt);
};

export default dispatchCustomEvent;
