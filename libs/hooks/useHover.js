import { useEffect, useState, useRef } from '../deps/htm-preact.js';
/**
 * React hook to track if the mouse is hovering over a DOM ref
 * Returns a hover state object with two properties:
 *   {
 *     hovering: Boolean - is the mouse hovering over
 *     event: - the native mouse event
 *   }
 * @param {object} optionalParams
 * @param {object} optionalParams.refToAttachTo - attach hover handler to an existing ref
 * @param {boolean} optionalParams.useMouseLeave - use `mouseleave` instead of `mouseout`
 * @returns {array} A ref to use (or the passed in ref), the hover state object
 */
const useHover = ({ refToAttachTo = null, useMouseLeave = false } = {}) => {
  const [hoverState, setHoverState] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = refToAttachTo || useRef(null);

  const handleMouseOver = (ev) => setHoverState({ hovering: true, event: ev });
  const handleMouseOut = (ev) => setHoverState({ hovering: false, event: ev });

  const mouseOutType = useMouseLeave ? 'mouseleave' : 'mouseout';

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener(mouseOutType, handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener(mouseOutType, handleMouseOut);
        };
      }
      return undefined;
    },
    [ref.current], // Recall only if ref changes
  );

  return [ref, hoverState];
};

export default useHover;
