function setTooltipPosition(tooltips) {
  const positionClasses = ['top', 'bottom', 'right', 'left'];
  const viewportWidth = window.innerWidth;
  const tooltipMargin = 12;
  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height;

  const getTooltipBeforeHeight = (tooltip) => {
    const beforeStyle = window.getComputedStyle(tooltip, '::before');
    return (parseFloat(beforeStyle.getPropertyValue('height')) || 0)
      + (parseFloat(beforeStyle.getPropertyValue('padding-top')) || 0)
      + (parseFloat(beforeStyle.getPropertyValue('padding-bottom')) || 0);
  };

  const getTooltipBeforeWidth = (tooltip) => {
    const beforeStyle = window.getComputedStyle(tooltip, '::before');
    return (parseFloat(beforeStyle.getPropertyValue('width')) || 0)
      + (parseFloat(beforeStyle.getPropertyValue('padding-left')) || 0)
      + (parseFloat(beforeStyle.getPropertyValue('padding-right')) || 0);
  };

  tooltips.forEach((tooltip) => {
    const currentPosition = positionClasses.find((cls) => tooltip.classList.contains(cls));
    if (!tooltip.dataset.originalPosition
      && currentPosition) tooltip.dataset.originalPosition = currentPosition;

    const rect = tooltip.getBoundingClientRect();
    const { originalPosition } = tooltip.dataset;
    const isVerticalPosition = originalPosition === 'top' || originalPosition === 'bottom';
    const tooltipWidth = getTooltipBeforeWidth(tooltip);
    const effectiveMaxWidth = isVerticalPosition ? tooltipWidth / 2 : tooltipWidth;
    const topMargin = originalPosition === 'top' ? tooltipMargin : 0;
    const tooltipHeight = getTooltipBeforeHeight(tooltip);
    const effectiveHeight = originalPosition === 'top' ? tooltipHeight + topMargin : tooltipHeight / 2;
    const willCutoffTop = rect.top - effectiveHeight < headerHeight;
    const willCutoffBottom = rect.bottom + (originalPosition === 'bottom' ? tooltipHeight + tooltipMargin : 0)
    > window.innerHeight;
    const willOverflowRight = rect.right + effectiveMaxWidth + tooltipMargin > viewportWidth;
    const willOverflowLeft = rect.left - effectiveMaxWidth - tooltipMargin < 0;
    const willOverflowRightAtBottom = rect.left + tooltipWidth / 2
     + tooltipMargin > viewportWidth;
    const willOverflowLeftAtBottom = rect.left - tooltipWidth / 2 - tooltipMargin < 0;
    const hasOverflowIssues = willOverflowRight || willOverflowLeft || willCutoffTop
      || willCutoffBottom || willOverflowRightAtBottom || willOverflowLeftAtBottom;

    if ((originalPosition !== currentPosition) && !hasOverflowIssues) {
      tooltip.classList.remove(...positionClasses);
      tooltip.classList.add(originalPosition);
      return;
    }

    let updatedPosition = originalPosition;
    if (willOverflowRight && willOverflowRightAtBottom) {
      updatedPosition = 'left';
    } else if (willOverflowLeft && willOverflowLeftAtBottom) {
      updatedPosition = 'right';
    } else if ((willOverflowRight && willCutoffTop) || (willOverflowLeft && willCutoffTop)) {
      updatedPosition = (willOverflowRightAtBottom && 'left') || (willOverflowLeftAtBottom && 'right') || 'bottom';
    } else if ((willOverflowRight !== willOverflowLeft) && !willCutoffBottom) {
      updatedPosition = willOverflowRight ? 'left' : 'right';
    } else if (willCutoffTop && ['top', 'left', 'right'].includes(originalPosition)) {
      updatedPosition = 'bottom';
    } else if (willCutoffBottom && ['bottom', 'left', 'right'].includes(originalPosition)) {
      updatedPosition = 'top';
    }

    if (currentPosition !== updatedPosition) {
      tooltip.classList.remove(...positionClasses);
      tooltip.classList.add(updatedPosition);
    }
  });
}

export default function addTooltipListeners(ownerElement) {
  ownerElement?.addEventListener('click', () => {
    ownerElement.classList.add('hide-tooltip');
  });
  ['keydown', 'mouseenter', 'focus', 'mouseleave', 'blur'].forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
      if (ownerElement && !ownerElement.classList.contains('hide-tooltip')
        && eventType === 'keydown' && event.key === 'Escape') {
        ownerElement.classList.add('hide-tooltip');
      }

      const isTooltip = event.target?.matches?.('.milo-tooltip');
      if (!isTooltip) return;

      if (['mouseenter', 'focus'].includes(eventType)) {
        event.target.classList.remove('hide-tooltip');
        setTooltipPosition([event.target]);
      } else if (['mouseleave', 'blur'].includes(eventType)) {
        event.target.classList.add('hide-tooltip');
      }
    }, true);
  });
}
