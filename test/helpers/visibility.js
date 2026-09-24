/**
 * Simulates a frozen/backgrounded page (paid-social in-app webviews, throttled tabs)
 * by stubbing `document.visibilityState` and firing `visibilitychange`.
 *
 * Used to assert that foreground-budget timers (setForegroundTimeout in libs/utils/utils.js) do
 * not spend their deadline while the document is hidden -- the MWPW-207104 false-timeout bug.
 */
export function stubVisibility() {
  let state = 'visible';
  const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  });
  return {
    set(next) {
      state = next;
      document.dispatchEvent(new Event('visibilitychange'));
    },
    hide() { this.set('hidden'); },
    show() { this.set('visible'); },
    restore() {
      delete document.visibilityState;
      if (descriptor) Object.defineProperty(Document.prototype, 'visibilityState', descriptor);
    },
  };
}

export default stubVisibility;
