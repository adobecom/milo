import {
  html,
  useEffect,
  useRef,
  useState,
} from '../../../../deps/htm-preact.js';

import { addToAverage } from '../../utils/utils.js';
import sanitizeComment from '../../../../utils/sanitizeComment.js';
import Comments from './Comments.js';
import Ratings from './Ratings.js';
import RatingSummary from './RatingSummary.js';

const BEFORE_UNLOAD_EVENT = 'beforeunload';

const noop = () => {};

const defaultStrings = {
  commentLabel: 'Review Feedback',
  placeholder: 'Please give us your feedback',
  review: 'vote',
  reviewPlural: 'votes',
  reviewTitle: 'Rate Your Experience',
  sendCta: 'Send',
  star: 'star',
  starPlural: 'stars',
  starsLegend: 'Choose a star rating',
  tooltips: ['This sucks', 'Meh', "It's OK", 'I like it', 'Best thing ever'],
  thankYou: 'Thank you for your feedback!',
};

function Review({
  averageRating,
  clickTimeout = 5000,
  commentThreshold = 3,
  displayRatingSummary = true,
  hideTitleOnReload,
  tooltipDelay = 300,
  initialRating,
  maxRating = 5,
  onRatingSet = noop,
  onRatingHover = noop,
  setAverageRating = noop,
  setTotalReviews = noop,
  strings = defaultStrings,
  staticRating,
  totalReviews,
}) {
  const [comment, setComment] = useState('');
  const [displayComments, setDisplayComments] = useState(false);
  const [displayThankYou, setDisplayThankYou] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(true);
  const [totalHasBeenUpdated, setTotalHasBeenUpdated] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const [rating, setRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  const beforeUnloadCallback = useRef(null);
  const titleComponent = useRef(
    html`
      <h3 className="hlx-reviewTitle">${strings.reviewTitle}</h3>
    `,
  );

  useEffect(() => {
    if (staticRating) {
      setRating(staticRating);
      setIsInteractive(false);
      if (hideTitleOnReload !== 'false') setDisplayTitle(false);
    }
  }, [staticRating, hideTitleOnReload]);

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  const handleCommentChange = (commentText) => {
    setComment(commentText);
  };

  const handleClickAboveCommentThreshold = (newRating, updatedTotalReviews) => {
    setRating(newRating);

    const sendSetRating = () => {
      onRatingSet({
        rating: newRating,
        comment,
        totalReviews: updatedTotalReviews,
      });
      setDisplayThankYou(true);
    };

    beforeUnloadCallback.current = sendSetRating;
    window.addEventListener(BEFORE_UNLOAD_EVENT, sendSetRating);

    // wait 5 seconds before submitting in case user changes their mind
    setTimeoutId(
      window.setTimeout(() => {
        window.removeEventListener(
          BEFORE_UNLOAD_EVENT,
          beforeUnloadCallback.current,
        );
        beforeUnloadCallback.current = null;
        sendSetRating();
      }, parseInt(clickTimeout, 10)),
    );
  };

  const clearCallbacks = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    if (beforeUnloadCallback.current !== null) {
      window.removeEventListener(
        BEFORE_UNLOAD_EVENT,
        beforeUnloadCallback.current,
      );
      beforeUnloadCallback.current = null;
    }
  };

  const handleRatingClick = (
    newRating,
    ev,
    { isKeyboardSelection = false } = {},
  ) => {
    if (!isInteractive) return;

    clearCallbacks();

    let updatedTotalReviews = Number(totalReviews);

    if (!totalHasBeenUpdated) {
      setTotalHasBeenUpdated(true);
      updatedTotalReviews += 1;
      setTotalReviews(updatedTotalReviews);
    }

    setAverageRating(
      addToAverage(newRating, Number(averageRating), updatedTotalReviews),
    );

    if (
      !isKeyboardSelection
      && newRating > commentThreshold
      && !displayComments
    ) {
      handleClickAboveCommentThreshold(newRating, updatedTotalReviews);
      return;
    }

    // No star has been selected yet
    if (selectedRating === 0) setDisplayComments(newRating <= commentThreshold);

    setSelectedRating(newRating);
    setRating(newRating);

    if (
      isKeyboardSelection
      && newRating > commentThreshold
      && !displayComments
    ) {
      onRatingSet({
        rating: newRating,
        comment,
        totalReviews: updatedTotalReviews,
      });
      setDisplayThankYou(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRatingSet({ rating, comment: sanitizeComment(comment), totalReviews });
    setDisplayThankYou(true);
  };

  const thankYouComponent = html`
    <div className="hlx-submitResponse">${strings.thankYou}</div>
  `;

  const ratingComponent = html`
    <${Ratings}
      count="5"
      isInteractive=${isInteractive}
      onClick=${handleRatingClick}
      onRatingHover=${onRatingHover}
      rating=${rating}
      starsLegend=${strings.starsLegend || strings.reviewTitle}
      starString=${strings.star}
      starStringPlural=${strings.starPlural}
      tooltips=${strings.tooltips}
      tooltipDelay=${tooltipDelay}
    />
  `;

  const commentsComponent = html`
    <${Comments}
      label=${strings.commentLabel}
      feedback=${comment}
      handleCommentChange=${handleCommentChange}
      placeholderText=${strings.placeholder}
      sendCtaText=${strings.sendCta}
    />
  `;

  const ratingsSummaryComponent = html`
    <${RatingSummary}
      averageRating=${averageRating}
      maxRating=${maxRating}
      totalReviews=${totalReviews}
      reviewString=${strings.review}
      reviewStringPlural=${strings.reviewPlural}
    />
  `;

  const ratings = html`
    ${displayTitle && titleComponent.current}

    <form className="hlx-Review" onSubmit=${handleSubmit}>
      ${ratingComponent} ${displayComments && commentsComponent}
    </form>

    ${displayRatingSummary && ratingsSummaryComponent}
  `;

  return html`
    <div className="hlx-ReviewWrapper">
      ${!displayThankYou && ratings} ${displayThankYou && thankYouComponent}
    </div>
  `;
}

export default Review;
