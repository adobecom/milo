// Decorate utils

export function decorateButtons(el, isLarge) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    const buttonSize = isLarge ? 'button-XL' : 'button-M';
    button.classList.add('con-button', buttonType, buttonSize);
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  const actionArea = buttons[0].closest('p');
  actionArea.classList.add('action-area');
  actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
}

export function decorateIcons(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export function decorateBlockText(el, size = 'small') {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.nextElementSibling.classList.add(`body-${bodySize}`);
    if (headingEl.previousElementSibling) {
      headingEl.previousElementSibling.classList.add(`detail-${detailSize}`);
    }
  };
  if (size === 'medium') {
    decorate(heading, 'M', 'S', 'M');
  } else if (size === 'large') {
    decorate(heading, 'XL', 'M', 'L');
  } else {
    decorate(heading, 'XS', 'S', 'M');
  }
  decorateIcons(el);
  decorateButtons(el);
}

export function decorateBlockBg(block, node) {
  node.classList.add('background');
  if (!node.querySelector(':scope img')) {
    block.style.background = node.textContent;
    node.remove();
  }
}

export function getBlockSize(el) {
  const sizes = ['small', 'medium', 'large'];
  return sizes.find((size) => el.classList.contains(size)) || sizes[1];
}

export function decorateGrid(el, grids = ['two-up', 'three-up', 'four-up']) {
  if (grids.some(className => el.classList.contains(className))) {
    return Array.from(el.classList).filter(className => grids.includes(className))?.[0];
  } else return;
}
