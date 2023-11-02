import { createTag } from '../../utils/utils.js';

function getPicture(row, idx) {
  return row.nextElementSibling.children[idx].querySelector('picture');
}

export default async function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const imgs = [...rows].reduce((acc, row) => {
    const trimmed = row.innerText.trim();
    if (trimmed === 'background') {
      acc.background = {
        mobile: getPicture(row, 0),
        tablet: getPicture(row, 1),
        desktop: getPicture(row, 2),
      };
    }
    if (trimmed === 'foreground') {
      acc.foreground = {
        mobile: getPicture(row, 0),
        tablet: getPicture(row, 1),
        desktop: getPicture(row, 2),
      };
    }
    if (trimmed === 'text') {
      acc.text = {
        mobile: getPicture(row, 0),
        tablet: getPicture(row, 1),
        desktop: getPicture(row, 2),
      };
    }
    row.className = 'hide-block';
    return acc;
  }, {});

  const mobileComposite = createTag('div', { class: 'imarquee-composite' }, [imgs.background.mobile, imgs.foreground.mobile]);
  const mobileContainer = createTag('div', { class: 'imarquee-mobile' }, [imgs.text.mobile, mobileComposite]);

  const tabletComposite = createTag('div', { class: 'imarquee-composite' }, [imgs.background.tablet, imgs.foreground.tablet, imgs.text.tablet]);
  const tabletContainer = createTag('div', { class: 'imarquee-tablet' }, tabletComposite);

  const desktopComposite = createTag('div', { class: 'imarquee-composite' }, [imgs.background.desktop, imgs.foreground.desktop, imgs.text.desktop]);
  const desktopContainer = createTag('div', { class: 'imarquee-desktop' }, desktopComposite);

  el.append(mobileContainer, tabletContainer, desktopContainer);
}
