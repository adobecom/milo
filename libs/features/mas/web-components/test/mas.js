import '@adobe/mas-commerce';
import '../../src/merch-card.js';
import '../../src/merch-icon.js';
import '../../src/aem-fragment.js';

/** in tests, eagerly initialisation breaks mocks */
export default async () => {
  const el = document.createElement('mas-commerce-service');
  document.head.appendChild(el);
  await el.promise;
  return el;
};
