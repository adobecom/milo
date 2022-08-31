import {
  useEffect,
  useState,
  useRef,
  html,
} from '../../../../deps/htm-preact.js';

function Comments({
  label,
  comment,
  handleCommentChange,
  placeholderText,
  sendCtaText,
}) {
  const [hasComment, setHasComment] = useState(false);
  const [displaySend, setDisplaySend] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const textArea = useRef(null);

  useEffect(() => {
    if (textArea && textArea.current) {
      textArea.current.focus();
    }
  }, [textArea]);

  const onCommentChange = (e) => {
    const { value } = e.target;
    setHasComment(!!value);
    if (handleCommentChange) {
      handleCommentChange(value);
    }
  };

  const onBlur = (e) => {
    setDisplaySend(!!e.target.value);
    setHasFocus(false);
  };

  const onFocus = () => {
    setDisplaySend(true);
    setHasFocus(true);
  };

  const onCtaCoverClick = () => textArea.current && textArea.current.focus();

  let commentsClass = 'hlx-Review-commentFields is-Visible';
  if (hasFocus) {
    commentsClass += ' has-focus';
  }

  const disabledElement = html`
    <input disabled=${!hasComment} type="submit" value=${sendCtaText} />
  `;

  return html`
    <fieldset className=${commentsClass}>
      <label htmlFor="rating-comments" />
      <textarea
        id="rating-comments"
        ref=${textArea}
        cols="40"
        maxlength="4000"
        name="rating-comments"
        aria-label=${label}
        placeholder=${placeholderText}
        onInput=${onCommentChange}
        onFocus=${onFocus}
        value=${comment}
        onBlur=${onBlur}
      />
      <div id="ctaCover" onClick=${onCtaCoverClick}></div>
      ${displaySend && disabledElement}
    </fieldset>
  `;
}

export default Comments;
