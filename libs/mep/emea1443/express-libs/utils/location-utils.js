function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function normCountry(country) {
  return (country.toLowerCase() === 'uk' ? 'gb' : country.toLowerCase()).split('_')[0];
}

export async function getCountry(ignoreCookie = false) {
  const { getConfig } = await import('../../../..//utils/utils.js');

  const urlParams = new URLSearchParams(window.location.search);
  let countryCode = urlParams.get('country') || (!ignoreCookie && getCookie('international'));
  if (countryCode) {
    return normCountry(countryCode);
  }
  countryCode = sessionStorage.getItem('visitorCountry');
  if (countryCode) return countryCode;

  try {
    const resp = await fetch('https://geo2.adobe.com/json/');
    if (resp.ok) {
      const { country } = await resp.json();
      const normalized = normCountry(country);
      sessionStorage.setItem('visitorCountry', normalized);
      return normalized;
    }
  } catch (e) {
    window.lana.log('could not fet geo2 data from geo2 service', e);
  }

  const configCountry = getConfig().locale.region;
  return normCountry(configCountry);
}

export const formatSalesPhoneNumber = (() => {
  let numbersMap;
  return async (tags, placeholder = '') => {
    if (tags.length <= 0) return;

    if (!numbersMap) {
      numbersMap = await fetch('/express/system/business-sales-numbers.json').then((r) => r.json());
    }

    if (!numbersMap?.data) return;
    const country = await getCountry(true) || 'us';
    tags.forEach((a) => {
      const r = numbersMap.data.find((d) => d.country === country);

      const decodedNum = r ? decodeURI(r.number.trim()) : decodeURI(a.href.replace('tel:', '').trim());

      a.textContent = placeholder ? a.textContent.replace(placeholder, decodedNum) : decodedNum;
      a.setAttribute('title', placeholder ? a.getAttribute('title').replace(placeholder, decodedNum) : decodedNum);
      a.href = `tel:${decodedNum}`;
    });
  };
})();

/**
 * Calculate a relatively more accurate "character count" for mixed Japanese
 * + English texts, for the purpose of heading auto font sizing.
 *
 * The rationale is that English characters are usually narrower than Japanese
 * ones. Hence each English character (and space character) is multiplied by an
 * coefficient before being added to the total character count. The current
 * coefficient value, 0.57, is an empirical value from some tests.
 */
function getJapaneseTextCharacterCount(text) {
  const headingEngCharsRegEx = /[a-zA-Z0-9 ]+/gm;
  const matches = text.matchAll(headingEngCharsRegEx);
  const eCnt = [...matches].map((m) => m[0]).reduce((cnt, m) => cnt + m.length, 0);
  const jtext = text.replaceAll(headingEngCharsRegEx, '');
  const jCnt = jtext.length;
  return eCnt * 0.57 + jCnt;
}

/**
 * Add dynamic font sizing CSS class names to headings
 *
 * The CSS class names are determined by character counts.
 * @param {Element} $block The container element
 * @param {string} classPrefix Prefix in CSS class names before "-long", "-very-long", "-x-long".
 * Default is "heading".
 * @param {string} selector CSS selector to select the target heading tags. Default is "h1, h2".
 */
export function addHeaderSizing($block, getConfig, classPrefix = 'heading', selector = 'h1, h2') {
  const headings = $block.querySelectorAll(selector);
  // Each threshold of JP should be smaller than other languages
  // because JP characters are larger and JP sentences are longer
  const sizes = getConfig().locale.region === 'jp'
    ? [
      { name: 'long', threshold: 8 },
      { name: 'very-long', threshold: 11 },
      { name: 'x-long', threshold: 15 },
    ]
    : [
      { name: 'long', threshold: 30 },
      { name: 'very-long', threshold: 40 },
      { name: 'x-long', threshold: 50 },
    ];
  headings.forEach((h) => {
    const length = getConfig().locale.region === 'jp'
      ? getJapaneseTextCharacterCount(h.textContent.trim())
      : h.textContent.trim().length;
    sizes.forEach((size) => {
      if (length >= size.threshold) h.classList.add(`${classPrefix}-${size.name}`);
    });
  });
}
