export default function returnFocusableElementsString(className) {
  return className ? `${className} button,${className} a[href],${className} [tabindex]:not([tabindex="-1"])`
    : 'button, a[href], [tabindex]:not([tabindex="-1"])';
}
