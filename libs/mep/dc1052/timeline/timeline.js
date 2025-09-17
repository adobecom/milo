import { createTag } from '../../../utils/utils.js';

function isMobile() {
  return window.innerWidth <= 1000;
}

function isColor(str) {
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
  return hexRegex.test(str) || rgbRegex.test(str);
}

function isGradient(str) {
  return str.startsWith('linear-gradient');
}

function isColorOrGradient(str) {
  return isColor(str) || isGradient(str);
}

function hasSegmentClass(el) {
  const segmentClassRegex = /^segment-timeline-(3-9|4-8|5-7|6-6|7-5|8-4|9-3)$/;
  const startsWithSegmentTimelineRegex = /^segment-timeline-/;
  let hasValidSegmentClass = Array.from(el.classList).some((cls) => segmentClassRegex.test(cls));
  if (!hasValidSegmentClass
    && Array.from(el.classList).some((cls) => startsWithSegmentTimelineRegex.test(cls))) {
    el.classList.add('segment-timeline-6-6');
    hasValidSegmentClass = true;
  }
  return hasValidSegmentClass;
}

function getColWidth(text, colWidths, hasSegment) {
  if (hasSegment || colWidths.length === 2) return;
  const numRegex = /\b\d{1,3}\b/;
  colWidths.push((text.match(numRegex) || [])[0]);
}
function createRow() {
  return [createTag('div', { class: 'row' }),
    createTag('div', { class: 'left' }),
    createTag('div', { class: 'right' }),
  ];
}
function createBars(index) {
  return index === 0
    ? [createTag('div', { class: 'bar' })] : [createTag('div', { class: 'bar' }), createTag('div', { class: 'bar' })];
}
function addBarRow() {
  const [barRow, left, right] = createRow();
  const sides = [left, right];
  sides.forEach((text, index) => {
    sides[index].append(...createBars(index));
    barRow.append(sides[index]);
  });
  return barRow;
}
function addBottomRow(periodText, dcVarientText) {
  const [periodRow, left, right] = createRow();
  const sides = [left, right];
  periodText.forEach((text, index) => {
    sides[index].append(createTag('p', { class: 'body-s' }, text));
    if (dcVarientText.length && dcVarientText[index]) {
      sides[index].append(createTag('p', { class: 'body-s' }, dcVarientText[index].textContent));
      if (index === 1 && dcVarientText[2]) {
        sides[index].append(createTag('p', { class: 'body-s' }, dcVarientText[2].textContent));
      }
    }

    periodRow.append(sides[index]);
  });
  return periodRow;
}

function createMobileTimeline(timelineData) {
  const mobileContainer = createTag('div', { class: 'mobile-timeline-container' });
  timelineData.forEach((item, index) => {
    const timelineItem = createTag('div', { class: 'timeline-item' });
    const content = createTag('div', { class: 'timeline-content' });
    content.append(item.content);
    timelineItem.append(content);
    if (index < timelineData.length - 1) {
      if (index === 0) {
        timelineItem.classList.add('solid-line');
      } else {
        timelineItem.classList.add('dashed-line');
      }
    }

    mobileContainer.append(timelineItem);
  });
  return mobileContainer;
}

function extractTimelineData(rows, periodText, subtext) {
  const timelineData = [];
  rows.forEach((row, index) => {
    const content = row.cloneNode(true);
    const timeLineSection = createTag('div', { class: 'timeline-section' });
    if (periodText?.[index]) {
      const periodP = createTag('p', { class: 'body-s' });
      periodP.textContent = periodText[index];
      timeLineSection.append(periodP);
    }
    if (subtext?.[index]) {
      timeLineSection.append(subtext[index]);
    }
    content.append(timeLineSection);
    timelineData.push({
      content,
      periodText: null,
      colorIndex: index,
    });
  });
  return timelineData;
}

function setEqualHeadingWidths(mobileContainer, retryCount = 0) {
  const headingElements = mobileContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headingElements.length === 0) return;
  headingElements.forEach((heading) => {
    heading.style.width = 'max-content';
  });

  // Force reflow to ensure styles are applied
  if (mobileContainer.offsetHeight) {
    // Heights measured, continue
  }

  let maxWidth = 0;
  headingElements.forEach((heading) => {
    const { width } = heading.getBoundingClientRect();
    maxWidth = Math.max(maxWidth, width);
  });

  if (maxWidth > 0 && headingElements.length > 0) {
    const computedStyle = getComputedStyle(headingElements[0]);
    const rightPadding = parseFloat(computedStyle.paddingRight);
    const adjustedWidth = maxWidth - rightPadding;
    mobileContainer.style.setProperty('--h3-width', `${adjustedWidth}px`);
  } else if (retryCount < 3 && mobileContainer.isConnected) {
    const delay = (retryCount + 1) * 100;
    setTimeout(() => {
      setEqualHeadingWidths(mobileContainer, retryCount + 1);
    }, delay);
  }
}

function setMobileColors(mobileContainer, colors) {
  const headingElements = mobileContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const timelineItems = mobileContainer.querySelectorAll('.timeline-item');
  const leftColor = colors?.[0];
  const rightColor = colors?.[1];
  if (!leftColor && !rightColor) return;

  let firstBar = leftColor;
  let secondBar = leftColor;
  let thirdBar = rightColor;

  if (isGradient(leftColor)) {
    let foundFirst = false;
    leftColor.split(' ').forEach((color) => {
      if (isColor(color) && !foundFirst) {
        firstBar = color;
        foundFirst = true;
      } else if (isColor(color)) {
        secondBar = color;
      }
    });
  }

  if (isGradient(rightColor)) {
    rightColor.split(' ').forEach((color) => {
      if (isColor(color)) {
        thirdBar = color;
      }
    });
  }

  const colorMap = {
    0: firstBar,
    1: secondBar,
    2: thirdBar,
  };

  // Apply dot colors to heading elements (for ::before pseudo-elements)
  headingElements.forEach((heading, index) => {
    heading.style.setProperty('--dot-color', colorMap[index]);
  });

  timelineItems.forEach((item) => {
    if (item.classList.contains('solid-line')) {
      const leftGradient = isGradient(leftColor)
        ? leftColor.replace('to right', 'to bottom')
        : `linear-gradient(to bottom, ${leftColor}, ${leftColor})`;
      item.style.borderImage = `${leftGradient} 0 0 0 2`;
    } else if (item.classList.contains('dashed-line')) {
      const rightGradient = isGradient(rightColor)
        ? rightColor.replace('to right', 'to bottom')
        : `linear-gradient(to bottom, ${rightColor}, ${rightColor})`;
      item.style.borderImage = `${rightGradient} 0 0 0 2`;
      item.classList.add('dashed-border');
    }
  });
}

function setBG(el, color, isDc1052 = false) {
  if (isDc1052) {
    el.style.setProperty('--dot-color', color);
    el.classList.add('timeline-dot');
  } else {
    el.style.background = color;
  }
}

function updateForRTL(lgStr, el) {
  if (el.closest('[dir="rtl"]')) {
    return lgStr.replace(/to right|to left|90deg|180deg|turn 0.25|turn 0.75/g, (match) => {
      const converter = {
        'turn 0.25': 'turn 0.75',
        'turn 0.75': 'turn 0.25',
        '90deg': '180deg',
        '180deg': '90deg',
        'to right': 'to left',
        'to left': 'to right',
      };

      return converter[match];
    });
  }
  return lgStr;
}
function setColors(colors, fragment, el, isDc1052) {
  const barEls = fragment.querySelectorAll('.bar');
  const periodEls = fragment.querySelectorAll('.period');
  if (colors?.length === 2 && isColorOrGradient(colors[0]) && isColorOrGradient(colors[1])) {
    if (barEls.length === 3 || periodEls.length === 2) {
      const leftColor = colors[0];
      const rightColor = colors[1];
      let firstBar; let secondBar; let thirdBar;

      const barRowBars = isDc1052 ? fragment.querySelectorAll('.row:nth-of-type(2) .bar') : barEls;

      if (isGradient(leftColor)) {
        leftColor.split(' ').forEach((color) => {
          if (isColor(color) && !firstBar) {
            firstBar = color;
            setBG(isDc1052 ? barRowBars[0] : barEls[0], firstBar, isDc1052);
          } else if (isColor(color)) {
            secondBar = color;
            setBG(isDc1052 ? barRowBars[1] : barEls[1], secondBar, isDc1052);
          }
        });
      } else {
        setBG(isDc1052 ? barRowBars[0] : barEls[0], leftColor, isDc1052);
        setBG(isDc1052 ? barRowBars[1] : barEls[1], leftColor, isDc1052);
      }
      if (isDc1052) {
        const leftElement = fragment.querySelector('.row:nth-of-type(1) .left');
        if (leftElement) {
          leftElement.style.borderBottom = '2px solid transparent';
          leftElement.style.borderImage = `${updateForRTL(leftColor, el)} 0 0 2 0`;
        }

        const rightElement = fragment.querySelector('.row:nth-of-type(1) .right');
        if (rightElement) {
          rightElement.style.setProperty('--right-gradient', updateForRTL(rightColor, el));
          rightElement.classList.add('dashed-border');
        }
      }
      if (isGradient(rightColor)) {
        rightColor.split(' ').forEach((color) => {
          if (isColor(color)) {
            thirdBar = color;
            setBG(isDc1052 ? barRowBars[2] : barEls[2], thirdBar, isDc1052);
          }
        });
      } else {
        setBG(isDc1052 ? barRowBars[2] : barEls[2], rightColor, isDc1052);
      }
      if (!isDc1052) {
        setBG(periodEls[0], updateForRTL(leftColor, el), false);
        setBG(periodEls[1], updateForRTL(rightColor, el), false);
      }
    }
  }
}

function colWidthsNotValid(colWidths) {
  return (colWidths.length !== 2 || colWidths.some((value) => Number.isNaN(value)));
}
function updateColWidths(colWidths, fragment, hasSegment) {
  if (colWidthsNotValid(colWidths) || hasSegment) return;
  const total = Number(colWidths[0]) + Number(colWidths[1]);
  const right = Math.floor((Number(colWidths[1]) / total) * 10000) / 100;
  const colString = `1fr minmax(${String(right)}%, 150px)`;
  fragment.querySelectorAll('.row').forEach((row) => {
    row.style.gridTemplateColumns = colString;
  });
}
export default function init(el) {
  const rows = el.querySelectorAll(':scope > div > div');
  const colors = []; const periodText = []; const colWidths = [];
  const hasSegment = hasSegmentClass(el);
  const isDc1052 = el.classList.contains('dc1052');
  const subtext = [];
  const textContent = [];
  const cleanup = [];

  rows.forEach((row) => {
    const color = row.firstElementChild?.textContent?.trim();
    const p = row.querySelector(':scope > p:last-child');

    if (p) {
      const [text, period] = p.textContent.trim().split('|');
      if (period) {
        periodText.push(period.trim());
        getColWidth(period, colWidths, hasSegment);
      }
      if (text) {
        textContent.push(text.trim());
        p.textContent = text.trim();
        if (isDc1052) {
          subtext.push(p.cloneNode(true));
          p.remove();
        }
      }
    }

    if (isColorOrGradient(color)) {
      colors.push(color);
      row.firstElementChild.remove();
    }
  });

  const rowsData = Array.from(rows).map((row) => row.cloneNode(true));
  rows.forEach((row) => row.parentElement.remove());
  function renderTimeline() {
    el.innerHTML = '';
    if (isDc1052 && isMobile()) {
      const timelineData = extractTimelineData(rowsData, periodText, subtext, textContent);
      const mobileTimeline = createMobileTimeline(timelineData);
      setMobileColors(mobileTimeline, colors);
      el.append(mobileTimeline);
      requestAnimationFrame(() => {
        if (mobileTimeline.isConnected) {
          setEqualHeadingWidths(mobileTimeline);
        }
      });
      return;
    }

    const fragment = document.createDocumentFragment();
    const [textRow, left, right] = createRow();

    rowsData.forEach((row, index) => {
      const rowClone = row.cloneNode(true);
      const side = index === 0 ? left : right;
      if (index === 1 && hasSegment) {
        const mobileCenterLeft = rowClone.cloneNode(true);
        mobileCenterLeft.classList.add('left-center');
        left.append(mobileCenterLeft);
      }
      side.append(rowClone);
    });

    textRow.append(left, right);
    [textRow, addBarRow(), addBottomRow(periodText, subtext)]
      .forEach((row) => fragment.append(row));
    updateColWidths(colWidths, fragment, hasSegment);
    setColors(colors, fragment, el, isDc1052);
    el.append(fragment);
  }

  renderTimeline();

  if (isDc1052) {
    let resizeTimeout;
    let isResizing = false;
    let cachedIsMobile = isMobile();
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - lastWidth) < 10) return;
      const currentIsMobile = currentWidth <= 1000;
      const crossingBreakpoint = cachedIsMobile !== currentIsMobile;

      // Immediately hide timeline when crossing breakpoint to prevent broken layout flash
      if (crossingBreakpoint && !isResizing) {
        el.style.transition = 'none';
        el.style.opacity = '0';
        isResizing = true;
      }
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderTimeline();
        if (crossingBreakpoint) {
          requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.2s ease';
            el.style.opacity = '1';
          });
        }
        cachedIsMobile = currentIsMobile;
        lastWidth = currentWidth;
        isResizing = false;
      }, crossingBreakpoint ? 100 : 300);
    };

    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(document.documentElement);
      cleanup.push(() => resizeObserver.disconnect());
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
      cleanup.push(() => window.removeEventListener('resize', handleResize));
    }

    cleanup.push(() => clearTimeout(resizeTimeout));
  }

  el.timelineCleanup = () => {
    cleanup.forEach((fn) => fn());
  };
}
