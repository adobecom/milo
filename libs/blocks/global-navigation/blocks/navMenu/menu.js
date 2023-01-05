import {
  analyticsDecorateList,
  analyticsGetLabel,
} from '../../../../martech/attributes.js';
import {
  createTag,
  decorateSVG,
  localizeLink,
} from '../../../../utils/utils.js';

const isHeading = (el) => el?.nodeName.startsWith('H');

const childIndexOf = (el) => [...el.parentElement.children]
  .filter((e) => e.nodeName === 'DIV' || e.nodeName === 'P')
  .indexOf(el);

const decorateButtons = (menu) => {
  const buttons = menu.querySelectorAll('strong a');
  buttons.forEach((btn) => {
    btn.classList.add('con-button', 'filled', 'blue', 'button-M');
  });
};

const decorateLinkGroups = (menu) => {
  const linkGroups = menu.querySelectorAll('.link-group');
  linkGroups.forEach((linkGroup) => {
    const image = linkGroup.querySelector('picture');
    const anchor = linkGroup.querySelector('a');
    const title = anchor?.textContent;
    const subtitle = linkGroup.querySelector('p:last-of-type') || '';
    const titleWrapper = createTag('div');
    titleWrapper.className = 'link-group-title';
    anchor.href = localizeLink(anchor.href);
    const link = createTag('a', { class: 'link-block', href: anchor.href });

    linkGroup.replaceChildren();
    titleWrapper.append(title, subtitle);
    const contents = image ? [image, titleWrapper] : [titleWrapper];
    link.append(...contents);
    linkGroup.appendChild(link);
  });
};

const setMenuAnalytics = (el) => {
  switch (el.nodeName) {
    case 'DIV':
      if (el.classList.contains('link-group')) {
        const title = el.querySelector('.link-group-title')?.childNodes?.[0]?.textContent;
        if (title) {
          el.firstChild.setAttribute(
            'daa-lh',
            `${analyticsGetLabel(title)}-${childIndexOf(el) + 1}`,
          );
        }
      } else {
        [...el.children].forEach((childEl) => setMenuAnalytics(childEl));
      }
      break;
    case 'UL':
      if (isHeading(el.previousElementSibling)) {
        el.setAttribute('daa-lh', el.previousElementSibling.textContent);
      }
      [...el.children].forEach(analyticsDecorateList);
      break;
    default: {
      const a = el.querySelector('a');
      if (a) {
        a.setAttribute(
          'daa-ll',
          `${analyticsGetLabel(a.textContent)}-${childIndexOf(el) + 1}`,
        );
      }
    }
  }
};

const decorateAnalytics = (menu) => [...menu.children].forEach((child) => setMenuAnalytics(child));

const decorateMenu = (navItem, navLink, menu, menuControls) => {
  menu.className = 'gnav-navitem-menu';
  menu.setAttribute('daa-lh', `header|${navLink.textContent}`);
  const childCount = menu.childElementCount;
  if (childCount === 1) {
    menu.classList.add('small-Variant');
  } else if (childCount === 2) {
    menu.classList.add('medium-Variant');
  } else if (childCount >= 3) {
    menu.classList.add('large-Variant');
    const container = createTag('div', { class: 'gnav-menu-container' });
    container.append(...Array.from(menu.children));
    menu.append(container);
  }
  decorateLinkGroups(menu);
  decorateAnalytics(menu);
  navLink.addEventListener('focus', () => {
    window.addEventListener('keydown', menuControls.toggleOnSpace);
  });
  navLink.addEventListener('blur', () => {
    window.removeEventListener('keydown', menuControls.toggleOnSpace);
  });
  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    menuControls.toggleMenu(navItem);
  });
  decorateButtons(menu);
  return menu;
};

const decorateLargeMenu = async (navLink, navItem, menu, menuControls) => {
  let path = navLink.href;
  path = localizeLink(path);
  const res = await fetch(`${path}.plain.html`);
  if (res.status !== 200) return;

  const text = await res.text();
  menu.insertAdjacentHTML('beforeend', text);
  const links = menu.querySelectorAll('a');
  links.forEach((link) => {
    decorateSVG(link);
  });
  const decoratedMenu = decorateMenu(navItem, navLink, menu, menuControls);
  const menuSections = decoratedMenu.querySelectorAll(
    '.gnav-menu-container > div',
  );
  menuSections.forEach((sec) => {
    sec.classList.add('section');
  });
  const sectionMetas = decoratedMenu.querySelectorAll('.section-metadata');
  sectionMetas.forEach(async (meta) => {
    const { default: sectionMetadata } = await import(
      '../../../section-metadata/section-metadata.js'
    );
    sectionMetadata(meta);
  });
  navItem.appendChild(decoratedMenu);
};

export default { decorateMenu, decorateLargeMenu };
