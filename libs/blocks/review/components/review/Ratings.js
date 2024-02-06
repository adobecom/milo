import { useEffect, useState, html } from '../../../../deps/htm-preact.js';

import RatingInput from './RatingInput.js';
import useHover from '../../../../hooks/useHover.js';
import { isKeyboardNavigation } from '../../utils/utils.js';

const Ratings = ({
  count,
  isInteractive,
  onClick,
  onRatingHover,
  rating,
  starsLegend,
  starString,
  starStringPlural,
  tooltips,
  tooltipDelay,
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [fieldSetRef, fieldSetMouseOut] = useHover();
  const [, fieldSetMouseLeave] = useHover({
    refToAttachTo: fieldSetRef,
    useMouseLeave: true,
  });

  useEffect(() => {
    if (!isInteractive) return;

    if (fieldSetMouseOut.hovering) {
      // only the inputs have value
      if (fieldSetMouseOut.event.target.value) {
        setKeyboardFocusIndex(null);
        const hoveredRating = parseInt(fieldSetMouseOut.event.target.value, 10);
        setCurrentRating(hoveredRating);
        if (onRatingHover) onRatingHover({ rating: hoveredRating });

        // Delay display of tooltips unless one is currently showing
        if (hoverIndex) {
          clearTimeout(timeoutId);
          setTimeoutId(null);
          setHoverIndex(hoveredRating);
        } else {
          setTimeoutId(
            setTimeout(() => {
              setHoverIndex(hoveredRating);
            }, tooltipDelay),
          );
        }
      }
    }

    if (!fieldSetMouseLeave.hovering) {
      setHoverIndex(null);
      setKeyboardFocusIndex(null);
    }

    if (!fieldSetMouseLeave.hovering && rating !== currentRating) {
      setCurrentRating(rating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldSetMouseOut, fieldSetMouseLeave, hoverIndex]);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleClick = (index, ev) => {
    if (isKeyboardNavigation(ev)) {
      setCurrentRating(index);
      ev.target.checked = index === rating;
      return;
    }
    setKeyboardFocusIndex(null);
    onClick(index, ev, { isKeyboardSelection: ev.type === 'keypress' });
  };

  const onFocus = (ev) => {
    // Chrome fires onFocus event right after mouseDown.  In that case do not set focus ring.
    if (mouseDown) {
      setMouseDown(false);
      return;
    }

    setCurrentRating(ev.target.value);
    setKeyboardFocusIndex(parseInt(ev.target.value, 10));
  };

  const onBlur = (ev) => {
    if (ev?.relatedTarget?.nodeName !== 'INPUT') {
      // Focus has left the rating fields
      setCurrentRating(rating);
      setKeyboardFocusIndex(null);
    }
  };

  const onMouseDown = () => {
    setMouseDown(true);
  };

  const ratings = [];
  for (let i = 1; i < parseInt(count, 10) + 1; i += 1) {
    const tooltip = tooltips && tooltips[i - 1];
    ratings.push(
      html`<${RatingInput}
        key=${`rating-${i}`}
        isActive=${i <= currentRating}
        isHovering=${hoverIndex === i}
        isInteractive=${isInteractive}
        index=${i}
        onClick=${handleClick}
        hasKeyboardFocus=${keyboardFocusIndex === i}
        starString=${starString}
        starStringPlural=${starStringPlural}
        tooltip=${tooltip}
        onBlur=${onBlur}
        onFocus=${onFocus}
        isChecked=${i === currentRating}
      />`,
    );
  }

  const legentElement = html` <legend>${starsLegend}</legend> `;

  return html`
    <fieldset
      ref=${fieldSetRef}
      className="hlx-Review-ratingFields"
      onMouseDown=${onMouseDown}
      disabled=${!isInteractive}
    >
      ${starsLegend && legentElement} ${ratings.map((rate) => html`${rate}`)}
    </fieldset>
  `;
};

export default Ratings;
