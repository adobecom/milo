import { html, render } from '../../deps/htm-preact.js';

import { getMetadata, loadStyle, getConfig } from '../../utils/utils.js';
import HelixReview from './components/helixReview/HelixReview.js';
import { checkPostUrl } from './utils/utils.js';

const getCommentThreshold = (defaultThreshold = 3) => {
  const threshold = parseInt(getMetadata('comment-threshold'), 10);
  return (Number.isInteger(threshold) && threshold > 0) ? threshold : defaultThreshold;
};

const getReviewPath = (url) => {
  try {
    return new URL(url).pathname;
  } catch (err) {
    return 'no-path';
  }
};

const getPageLocale = () => {
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (!ogLocale) {
    return 'no-loc';
  }
  return ogLocale.getAttribute('content');
};

const getVisitorId = () => {
  if (window.s_adobe && window.s_adobe.visitor) {
    return window.s_adobe.visitor.getMarketingCloudVisitorID();
  }
  return null;
};

const getProductJson = () => {
  const name = getMetadata('product-name');
  const description = getMetadata('product-description');
  if (!name) return null;
  return {
    name,
    description,
    '@type': 'Product',
    '@context': 'http://schema.org',
  };
};

const App = ({ strings }) => html`
    <${HelixReview}
      clickTimeout="5000"
      commentThreshold=${getCommentThreshold()}
      hideTitleOnReload=${strings.hideTitleOnReload}
      lang=${getPageLocale()}
      reviewTitle=${strings.reviewTitle}
      productJson=${getProductJson()}
      strings=${strings}
      tooltipDelay=${strings.tooltipdelay}
      postUrl=${strings.postUrl}
      visitorId=${getVisitorId()}
      reviewPath=${getReviewPath(strings.postUrl)}
      initialValue=${strings.initialValue}
    />
  `;

const sanitizedKeyDiv = (text) => text.toLowerCase().replace(/ /g, '');

const getStrings = (metaData) => {
  const {
    commentfieldlabel,
    commentplaceholder,
    ratingLegend,
    ratingverb = 'star',
    ratingnoun = 'vote',
    submittext,
    thankyoutext,
    title,
    tooltips,
    hidetitle,
    reviewurl,
    initialvalue,
  } = metaData;

  return {
    commentLabel: commentfieldlabel,
    sendCta: submittext,
    star: ratingnoun.split(',')[0],
    starPlural: ratingnoun.split(',')[0],
    starsLegend: ratingLegend,
    placeholder: commentplaceholder,
    review: ratingverb.split(',')[0],
    reviewPlural: ratingverb.split(',')[1],
    reviewTitle: title,
    thankYou: thankyoutext,
    hideTitleOnReload: hidetitle,
    tooltips: tooltips && tooltips.split(',').map((t) => t.trim()),
    postUrl: reviewurl,
    initialValue: initialvalue,
  };
};

const getMetaData = (el) => {
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const metaData = {};
  keyDivs.forEach((div) => {
    const valueDivText = div.nextElementSibling.textContent;
    const keyValueText = sanitizedKeyDiv(div.textContent);
    metaData[keyValueText] = valueDivText;
  });
  return metaData;
};

const removeMetaDataElements = (el) => {
  const children = el.querySelectorAll(':scope > div');
  children.forEach((child) => {
    child.remove();
  });
};

export default async function init(el) {
  const { miloLibs, codeRoot, env } = getConfig();
  const base = miloLibs || codeRoot;

  loadStyle(`${base}/ui/page/page.css`);
  const metaData = getMetaData(el);
  const strings = getStrings(metaData);

  if (strings.postUrl) {
    strings.postUrl = checkPostUrl(strings.postUrl, env);
    removeMetaDataElements(el);

    const app = html` <${App} strings="${strings}" /> `;

    render(app, el);
  } else {
    throw new Error('Invalid postUrl. Initialization aborted.');
  }
}
