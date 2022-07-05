import {
  html,
  render,
} from '../../deps/htm-preact.js';

import { loadStyle } from '../../utils/utils.js';
import HelixReview from './components/helixReview/HelixReview.js';

const COMMENT_THRESHOLD = 3;

const App = ({ rootEl, strings }) => {
    console.log(strings);
    return html`
        <${HelixReview}
            clickTimeout="5000"
            commentThreshold=${COMMENT_THRESHOLD}
            hideTitleOnReload=${strings.hideTitleOnReload}
            lang=${getPageLocale()}
            reviewTitle=${strings.reviewTitle}
            strings=${strings}
            tooltipDelay=${strings.tooltipdelay}
            postUrl=${strings.postUrl}
            visitorId=${getVisitorId()}
            reviewPath=${getReviewPath(strings.postUrl)}
            onRatingSet=${({ rating, comment }) => {}}
            onRatingHover=${({ rating }) => {}}
            onReviewLoad=${({ hasRated, rating }) => {}}
        />
    `;
}

const getReviewPath = (url) => {
    if (!url) return 'no-path';
    const urlParams = url.split('/');
    return urlParams[urlParams.length - 1];
}

const getPageLocale = () => {
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
        return 'no-loc';
    }
    return ogLocale.getAttribute('content');
}

const getVisitorId = () => {
    if (window.s_adobe && window.s_adobe.visitor) {
        return window.s_adobe.visitor.getMarketingCloudVisitorID();
    }
    return null;
}

const sanitizedKeyDiv = (text) => {
    return text.toLowerCase().replace(/ /g, "").trim();
}

const constructString = (key, value) => {
    switch (key) {
        case 'reviewurl':
            strings.postUrl = value;
            return;
        case 'title':
            strings.reviewTitle = value;
            return;
        case 'hidetitle':
            strings.hideTitleOnReload = value;
            return;
        case 'ratingverb':
            strings.review = value.split(',')[0];
            strings.reviewPlural = value.split(',')[1].trim();
            return;
        case 'ratingnoun':
            strings.star = value.split(',')[0];
            strings.starPlural = value.split(',')[1].trim();
            return;
        case 'commentplaceholder':
            strings.placeholder = value;
            return;
        case 'tooltips':
            strings.tooltips = value.split(',');
            return;
        case 'thankyoutext':
            strings.thankYou = value;
            return;
        case 'submittext':
            strings.sendCta = value;
            return;
        case 'tooltipdelay':
            strings.tooltipDelay = value;
            return;
        case 'commentfieldlabel':
            strings.commentLabel = value;
            return;
        default:
            strings[key] = value;
            return;
    }
}

const getStrings = (metaData) => {
    console.log(metaData);
    const {
        commentfieldlabel,
        commentplaceholder,
        ratingLegend,
        ratingNounSingular,
        ratingNounPlural,
        ratingVerbSingular,
        ratingVerbPlural,
        submittext,
        thankyoutext,
        title,
        tooltips,
        hidetitle,
    } = metaData;

    return {
        commentLabel: commentfieldlabel,
        sendCta: submittext,
        star: ratingNounSingular,
        starPlural: ratingNounPlural,
        starsLegend: ratingLegend,
        placeholder: commentplaceholder,
        review: ratingVerbSingular,
        reviewPlural: ratingVerbPlural,
        reviewTitle: title,
        thankYou: thankyoutext,
        hideTitleOnReload: hidetitle,
        tooltips: tooltips && tooltips.split(',').map(t => t.trim()),
    };
}

const getMetaData = (el) => {
    const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
    const metaData = {};
    keyDivs.forEach((div) => {
        const valueDiv = div.nextElementSibling;
        const valueDivText = div.nextElementSibling.textContent;
        const keyValueText = sanitizedKeyDiv(div.textContent);
        metaData[keyValueText] = valueDivText;
    })
    return metaData;
}

const hideMetaDataElements = (el) => {
    const children = el.querySelectorAll(':scope > div');
    children.forEach((child) => {
        child.classList.add('hide');
    });
}

export default async function init(el) {
  loadStyle('/libs/ui/page/page.css');
  const metaData = getMetaData(el);
  const strings = getStrings(metaData);
  console.log('strings', strings);
  hideMetaDataElements(el);

  const app = html` <${App} rootEl=${el} strings="${strings}" /> `;

  render(app, el);
}
