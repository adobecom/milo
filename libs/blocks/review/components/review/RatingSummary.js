/* eslint-disable react-hooks/rules-of-hooks */
import { html, useRef } from '../../../../deps/htm-preact.js';

function RatingSummary({
  averageRating = 0,
  maxRating,
  totalReviews,
  reviewString,
  reviewStringPlural,
}) {
  const averageRatingRounded = Math.round(Number(averageRating) * 10) / 10;

  if (!averageRating) return html`<div></div>`;

  const spanAverage = useRef(html`
    <span className="hlx-ReviewStats-average">${averageRatingRounded}</span>
  `);
  const spanMax = useRef(html`
    <span className="hlx-ReviewStats-outOf">${maxRating}</span>
  `);
  const spanTotalReviews = useRef(html`
    <span className="hlx-ReviewStats-total">${totalReviews}</span>
  `);
  const spanVote = useRef(html`
    <span className="hlx-ReviewStats-vote">
      ${totalReviews === 1 ? reviewString : reviewStringPlural}
    </span>
  `);
  // placeholder
  return html`
    <div className="hlx-ReviewStats is-Visible">
      ${spanAverage.current}
      <span className="hlx-ReviewStats-separator">/</span>
      ${spanMax.current}
      <span className="hlx-ReviewStats-separator">-</span>
      ${spanTotalReviews.current}
      ${spanVote.current}
    </div>
  `;
}

export default RatingSummary;
