import { useEffect, useState, html } from '../../../../deps/htm-preact.js';

import {
  getLocalStorage,
  setLocalStorage,
} from '../../../utils/utils.js';
import sendHelixData from '../../utils/sendHelixData.js';
import setJsonLdProductInfo from '../../utils/setJsonLdProductInfo.js';
import Review from '../review/Review.js';

const HelixReview = ({
  clickTimeout = 5000,
  commentThreshold = 3,
  hideTitleOnReload,
  lang,
  maxRating = 5,
  onRatingHover,
  onRatingSet: onRatingSetCallback,
  onReviewLoad,
  postUrl,
  productJson,
  reviewPath,
  strings,
  tooltipDelay = 300,
  visitorId,
  initialValue,
}) => {
  const [rating, setRating] = useState();
  const [initialRating, setInitialRating] = useState();
  const [avgRating, setAvgRating] = useState(5);
  const [totalReviews, setTotalReviews] = useState(0);
  const [displayRatingSummary, setDisplayRatingSummary] = useState(false);
  const [displayReviewComp, setDisplayReviewComp] = useState(false);

  useEffect(() => {
    // init
    const localData = getLocalStorage(reviewPath);
    let localDataTotalReviews = 0;
    if (localData) {
      setRating(localData.rating);
      setTotalReviews(localData.totalReviews);
      localDataTotalReviews = localData.totalReviews;
    }
    if (onReviewLoad) {
      onReviewLoad({
        hasRated: !!localData,
        rating: localData ? localData.rating : undefined,
      });
    }

    // eslint-disable-next-line no-use-before-define
    getHelixData(localDataTotalReviews, !!localData);
  }, []);

  const getHelixData = (localDataTotalReviews = 0, hasLocalData = false) => {
    try {
      if (!reviewPath || reviewPath === 'no-path') {
        setDisplayReviewComp(true);
        return;
      }

      const resPromise = fetch(`${postUrl}.json`);
      resPromise
        .then((res) => {
          if (res.ok) {
            res.json().then((reviewRes) => {
              if (!reviewRes.data[0]) {
                setDisplayReviewComp(true);
                return;
              }
              const { average, total } = reviewRes.data[0];

              setAvgRating(average);
              if (total > localDataTotalReviews) setTotalReviews(total);
              setDisplayRatingSummary(true);
              setDisplayReviewComp(true);
              if (!hasLocalData) {
                setInitialRating(
                  initialValue !== undefined
                    ? initialValue
                    : Math.round(average),
                );
              }

              if (productJson) {
                setJsonLdProductInfo(productJson, average, total);
              }
            });
          } else {
            setDisplayReviewComp(true);
          }
        })
        .catch(() => setDisplayReviewComp(true));
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.log('The review response was not a proper JSON.');
      setDisplayReviewComp(true);
    }
  };

  const onRatingSet = ({
    rating: newRating,
    comment,
    totalReviews: updatedTotalReviews,
  }) => {
    // When onRatingSet is called, totalReviews hasn't updated yet as it's async
    setLocalStorage(reviewPath, {
      rating: newRating,
      totalReviews: updatedTotalReviews,
    });

    sendHelixData({
      comment,
      lang,
      rating: newRating,
      postUrl,
      reviewPath,
      visitorId,
    });

    if (onRatingSetCallback) {
      onRatingSetCallback({ rating: newRating, comment });
    }
  };

  const reviewComponent = html`
    <${Review}
      averageRating=${avgRating}
      clickTimeout=${clickTimeout}
      commentThreshold=${commentThreshold}
      hideTitleOnReload=${hideTitleOnReload}
      initialRating=${initialRating}
      maxRating=${maxRating}
      onRatingHover=${onRatingHover}
      onRatingSet=${onRatingSet}
      setAverageRating=${setAvgRating}
      setTotalReviews=${setTotalReviews}
      displayRatingSummary=${displayRatingSummary}
      staticRating=${rating}
      strings=${strings}
      tooltipDelay=${tooltipDelay}
      totalReviews=${totalReviews}
      initialValue=${initialValue}
    />
  `;

  return html` ${displayReviewComp && reviewComponent} `;
};

export default HelixReview;
