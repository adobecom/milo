export const spectrumCSS = `
/* Example Spectrum CSS */
.spectrum-Button {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--spectrum-global-font-family-base);
  border-radius: var(--spectrum-global-border-radius);
  transition: background 0.2s ease-out;
}
.spectrum-Button--primary {
  background: var(--spectrum-global-color-blue-500);
  color: white;
}
.spectrum-Button--secondary {
  background: var(--spectrum-global-color-gray-200);
  color: var(--spectrum-global-color-gray-800);
}
`;
