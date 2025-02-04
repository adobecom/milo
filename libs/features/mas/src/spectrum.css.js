export default `
  :host {
      --spectrum-global-font-family-base: adobe-clean, sans-serif;
      --spectrum-global-color-blue-500: #1473E6;
      --spectrum-global-color-blue-700: #0B66D4;
      --spectrum-global-color-blue-900: #084C9D;
      --spectrum-global-color-gray-200: #EAEAEA;
      --spectrum-global-color-gray-400: #CFCFCF;
      --spectrum-global-color-gray-600: #9E9E9E;
      --spectrum-global-color-gray-800: #4A4A4A;
      --spectrum-global-color-gray-900: #2C2C2C;
      --spectrum-global-color-white: #FFFFFF;
      --spectrum-global-border-radius: 12px;
      --spectrum-button-padding: 8px 16px;
      --spectrum-button-font-size: 14px;
      --spectrum-button-font-weight: 600;
  }

  .spectrum-Button {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--spectrum-global-font-family-base);
      border-radius: var(--spectrum-global-border-radius);
      transition: background 0.2s ease-out, box-shadow 0.2s ease-out;
      padding: var(--spectrum-button-padding);
      font-size: var(--spectrum-button-font-size);
      font-weight: var(--spectrum-button-font-weight);
      border: none;
  }


  .spectrum-Button-label {
      display: inline-block;
  }

  /* === BUTTON SIZES === */
  .spectrum-Button--sizeXL {
      font-size: 18px;
      padding: 16px 32px;
  }

  .spectrum-Button--sizeL {
      font-size: 16px;
      padding: 12px 24px;
  }

  .spectrum-Button--sizeM {
      font-size: 14px;
      padding: 8px 16px;
  }

  .spectrum-Button--sizeS {
      font-size: 12px;
      padding: 6px 12px;
  }

  .spectrum-Button-label {
      display: inline-block;
  }

  /* Accent Button */
  .spectrum-Button--accent {
      background: var(--spectrum-global-color-blue-500);
      color: var(--spectrum-global-color-white);
  }

  .spectrum-Button--accent:hover {
      background: var(--spectrum-global-color-blue-700);
  }

  .spectrum-Button--accent:active {
      background: var(--spectrum-global-color-blue-900);
  }

  /* Primary Outline Button */
  .spectrum-Button--primary-outline {
      background: transparent;
      border: 2px solid var(--spectrum-global-color-blue-500);
      color: var(--spectrum-global-color-blue-500);
  }

  .spectrum-Button--primary-outline:hover {
      background: var(--spectrum-global-color-blue-500);
      color: var(--spectrum-global-color-white);
  }

  .spectrum-Button--primary-outline:active {
      background: var(--spectrum-global-color-blue-700);
      border-color: var(--spectrum-global-color-blue-700);
  }

  /* Secondary Button */
  .spectrum-Button--secondary {
      background: var(--spectrum-global-color-gray-200);
      color: var(--spectrum-global-color-gray-900);
  }

  .spectrum-Button--secondary:hover {
      background: var(--spectrum-global-color-gray-400);
  }

  .spectrum-Button--secondary:active {
      background: var(--spectrum-global-color-gray-600);
  }

  /* Secondary Outline Button */
  .spectrum-Button--secondary-outline {
      background: transparent;
      border: 2px solid var(--spectrum-global-color-gray-600);
      color: var(--spectrum-global-color-gray-800);
  }

  .spectrum-Button--secondary-outline:hover {
      background: var(--spectrum-global-color-gray-400);
      border-color: var(--spectrum-global-color-gray-800);
  }

  .spectrum-Button--secondary-outline:active {
      background: var(--spectrum-global-color-gray-600);
      border-color: var(--spectrum-global-color-gray-900);
  }
`;
