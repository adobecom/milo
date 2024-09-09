import { html } from '../../../../deps/htm-preact.js';

const KEY_ENTER = 13;
const KEY_SPACE = 32;

const RatingInput = ({
  index,
  hasKeyboardFocus,
  isActive,
  isHovering,
  isInteractive,
  onClick,
  starString,
  starStringPlural,
  tooltip,
  isChecked,
  onBlur,
  onFocus,
}) => {
  const handleClick = (ev, isKeyboardSelection = false) => {
    if (onClick) onClick(index, ev, { isKeyboardSelection });
  };

  const handleKeyPress = (ev) => {
    if (ev.which === KEY_ENTER || ev.which === KEY_SPACE) {
      ev.preventDefault();
      handleClick(ev, { isKeyboardSelection: true });
    }
  };

  // eslint-disable-next-line operator-linebreak
  const label =
    index === 1 ? `1 ${starString}` : `${index} ${starStringPlural}`;

  let ratingsInputClassNames = '';

  if (isInteractive && tooltip) {
    ratingsInputClassNames += 'tooltip';
  }

  if (isHovering) {
    ratingsInputClassNames += ' is-hovering';
  }

  if (isActive) {
    ratingsInputClassNames += ' is-Active';
  }

  if (hasKeyboardFocus) {
    ratingsInputClassNames += ' has-keyboard-focus';
  }

  return html`
    <input
      data-tooltip=${tooltip}
      name="rating"
      aria-label="${tooltip} ${label}"
      type="radio"
      className=${ratingsInputClassNames}
      onClick=${handleClick}
      onKeyPress=${handleKeyPress}
      value=${index}
      aria-checked=${isChecked ? 'true' : 'false'}
      onBlur=${onBlur}
      onFocus=${onFocus}
    />
  `;
};

export default RatingInput;
