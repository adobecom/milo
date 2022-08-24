import {
  fetchPlaceholders,
  debug,
  createTag,
} from '../../utils/utils.js';

const GLOBE_IMG = '<img class="footer-region-img" loading="lazy" alt="wireframe globe" src="/libs/blocks/footer/globe.svg" height="20" width=20">';
const ADCHOICE_IMG = '<img class="footer-link-img" loading="lazy" alt="AdChoices icon" src="/libs/blocks/footer/adchoices-small.svg" height="9" width="9">';

class Footer {
  constructor(body, el) {
    this.el = el;
    this.body = body;
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  init = async () => {
    const wrapper = createTag('div', { class: 'footer-wrapper' });

    const grid = this.decorateGrid();
    if (grid) {
      wrapper.append(grid);
    }

    const infoRow = createTag('div', { class: 'footer-info' });
    const infoColumnLeft = createTag('div', { class: 'footer-info-column' });
    const infoColumnRight = createTag('div', { class: 'footer-info-column' });

    const region = await this.decorateRegion();
    if (region) {
      infoColumnLeft.append(region);
      infoRow.classList.add('has-region');
    }

    const social = this.decorateSocial();
    if (social) {
      infoColumnLeft.append(social);
      infoRow.classList.add('has-social');
    }

    const privacy = this.decoratePrivacy();
    if (privacy) {
      infoColumnRight.append(privacy);
      infoRow.classList.add('has-privacy');
    }

    if (infoColumnLeft.hasChildNodes()) {
      infoRow.append(infoColumnLeft);
    }
    if (infoColumnRight.hasChildNodes()) {
      infoRow.append(infoColumnRight);
    }
    if (infoRow.hasChildNodes()) {
      wrapper.append(infoRow);
    }

    this.el.append(wrapper);
  };

  decorateGrid = () => {
    const gridBlock = this.body.querySelector('.footer-links > div');
    if (!gridBlock) return null;
    this.desktop.addEventListener('change', this.onMediaChange);
    // build grid container
    const navGrid = createTag('div', { class: 'footer-nav-grid' });
    const columns = gridBlock.querySelectorAll('div');
    columns.forEach((column) => {
      // build grid column
      const navColumn = createTag('div', { class: 'footer-nav-column' });
      const headings = column.querySelectorAll('h2');
      headings.forEach((heading) => {
        // build grid column item
        const navItem = createTag('div', { class: 'footer-nav-item' });
        const titleId = heading.textContent.trim().toLowerCase().replace(/ /g, '-');
        let expanded = false;
        if (this.desktop.matches) { expanded = true; }
        // populate grid column item
        const title = createTag('a', {
          class: 'footer-nav-item-title',
          role: 'button',
          'aria-expanded': expanded,
          'aria-controls': `${titleId}-menu`,
        });
        title.textContent = heading.textContent;
        navItem.append(title);
        const linksContainer = heading.nextElementSibling;
        linksContainer.classList = 'footer-nav-item-links';
        linksContainer.id = `${titleId}-menu`;
        if (!this.desktop.matches) {
          title.setAttribute('tabindex', 0);
          title.addEventListener('click', this.toggleMenu);
          title.addEventListener('focus', () => {
            window.addEventListener('keydown', this.toggleOnKey);
          });
          title.addEventListener('blur', () => {
            window.removeEventListener('keydown', this.toggleOnKey);
          });
        }
        const links = linksContainer.querySelectorAll('li');
        links.forEach((link) => {
          link.classList.add('footer-nav-item-link');
        });
        navItem.append(linksContainer);
        navColumn.append(navItem);
      });
      navGrid.append(navColumn);
    });
    return navGrid;
  };

  decorateRegion = async () => {
    const region = this.body.querySelector('.region-selector > div');
    if (!region) return null;
    const placeholders = await fetchPlaceholders();
    // build region selector container
    const regionContainer = createTag('div', { class: 'footer-region' });
    // build region selector button
    const regionButton = createTag('a', {
      class: 'footer-region-button',
      id: 'region-button',
      'aria-expanded': false,
      'aria-haspopup': true,
      'aria-label': placeholders['change-language'],
      role: 'button',
      tabindex: 0,
    });
    regionButton.addEventListener('click', this.toggleMenu);
    regionButton.addEventListener('focus', () => {
      window.addEventListener('keydown', this.toggleOnKey);
    });
    regionButton.addEventListener('blur', () => {
      window.removeEventListener('keydown', this.toggleOnKey);
    });
    const regionText = createTag('span', { class: 'footer-region-text' });
    regionText.textContent = placeholders['change-language'];
    regionButton.insertAdjacentHTML('afterbegin', GLOBE_IMG);
    regionButton.append(regionText);
    regionContainer.append(regionButton);
    // build region selector options
    const regionOptions = createTag('ul', {
      class: 'footer-region-options',
      'aria-labelledby': 'region-button',
      role: 'menu',
    });
    const regionLinks = region.querySelectorAll('a');
    // populate region selector options
    regionLinks.forEach((link) => {
      const selected = link.parentNode.nodeName === 'STRONG';
      const options = { class: 'footer-region-option' };
      if (selected) {
        options.class += ' footer-region-selected';
        options['aria-current'] = 'page';
      }
      const li = createTag('li', options);
      li.append(link);
      regionOptions.append(li);
    });
    regionContainer.append(regionOptions);
    return regionContainer;
  };

  decorateSocial = () => {
    const socialEl = this.body.querySelector('.social > div');
    if (!socialEl) return null;
    // build social icon wrapper
    const socialWrapper = createTag('div', { class: 'footer-social' });
    // build social icon links
    const socialLinks = createTag('ul', { class: 'footer-social-icons' });
    socialEl.querySelectorAll('a').forEach((a) => {
      const domain = a.host.replace(/www./, '').replace(/.com/, '');
      const supported = ['facebook', 'instagram', 'twitter', 'linkedin'];
      if (supported.includes(domain)) {
        // populate social icon links
        const li = createTag('li', { class: 'footer-social-icon' });
        const socialIcon = createTag('img', {
          class: 'footer-social-img',
          loading: 'lazy',
          src: `/libs/blocks/footer/${domain}-square.svg`,
          alt: `${domain} logo`,
          height: '18',
          width: '18',
        });
        a.setAttribute('aria-label', domain);
        a.textContent = '';
        a.append(socialIcon);
        li.append(a);
        socialLinks.append(li);
      } else { a.remove(); }
      socialWrapper.append(socialLinks);
    });
    return socialWrapper;
  };

  decoratePrivacy = () => {
    const copyrightEl = this.body.querySelector('div em');
    const links = copyrightEl.parentElement.querySelectorAll('a');
    if (!copyrightEl || !links) return null;
    // build privacy wrapper
    const privacyWrapper = createTag('div', { class: 'footer-privacy' });
    // build privacy copyright text
    const copyright = createTag('p', { class: 'footer-privacy-copyright' });
    copyright.textContent = copyrightEl.textContent;
    privacyWrapper.append(copyright);
    // build privacy links
    const infoLinks = createTag('ul', { class: 'footer-privacy-links' });
    // populate privacy links
    links.forEach((link) => {
      const li = createTag('li', { class: 'footer-privacy-link' });
      if (link.hash === '#interest-based-ads') {
        link.insertAdjacentHTML('afterbegin', ADCHOICE_IMG);
      }
      li.append(link);
      infoLinks.append(li);
    });
    privacyWrapper.append(infoLinks);
    return privacyWrapper;
  };

  toggleMenu = (e) => {
    const button = e.target.closest('[role=button]');
    const expanded = button.getAttribute('aria-expanded');
    if (expanded === 'true') {
      this.closeMenu(button);
    } else {
      this.openMenu(button);
    }
  };

  closeMenu = (el) => {
    if (el.id === 'region-button') {
      window.removeEventListener('keydown', this.closeOnEscape);
      window.removeEventListener('click', this.closeOnDocClick);
    }
    el.setAttribute('aria-expanded', false);
  };

  openMenu = (el) => {
    const type = el.classList[0];
    const expandedMenu = document.querySelector(`.${type}[aria-expanded=true]`);
    if (expandedMenu) { this.closeMenu(expandedMenu); }
    if (el.id === 'region-button') {
      window.addEventListener('keydown', this.closeOnEscape);
      window.addEventListener('click', this.closeOnDocClick);
    }
    el.setAttribute('aria-expanded', true);
  };

  toggleOnKey = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      this.toggleMenu(e);
    }
  };

  closeOnEscape = (e) => {
    const button = document.getElementById('region-button');
    if (e.code === 'Escape') {
      this.closeMenu(button);
    }
  };

  closeOnDocClick = (e) => {
    const button = document.getElementById('region-button');
    const a = e.target.closest('a');
    if (a !== button) {
      this.closeMenu(button);
    }
  };

  onMediaChange = (e) => {
    if (e.matches) {
      document.querySelectorAll('.footer-nav-item-title').forEach((button) => {
        button.removeAttribute('tabindex');
        window.removeEventListener('keydown', this.toggleOnKey);
        window.removeEventListener('keydown', this.toggleOnKey);
        button.setAttribute('aria-expanded', true);
        button.removeEventListener('click', this.toggleMenu);
      });
    } else {
      document.querySelectorAll('.footer-nav-item-title').forEach((button) => {
        button.setAttribute('tabindex', 0);
        button.addEventListener('focus', () => {
          window.addEventListener('keydown', this.toggleOnKey);
        });
        button.addEventListener('blur', () => {
          window.removeEventListener('keydown', this.toggleOnKey);
        });
        button.setAttribute('aria-expanded', false);
        button.addEventListener('click', this.toggleMenu);
      });
    }
  };
}

async function fetchFooter(url) {
  const resp = await fetch(`${url}.plain.html`);
  const html = await resp.text();
  return html;
}

export default async function init(block) {
  const url = block.getAttribute('data-footer-source');
  if (url) {
    const html = await fetchFooter(url);
    if (html) {
      try {
        const parser = new DOMParser();
        const footerDoc = parser.parseFromString(html, 'text/html');
        const footer = new Footer(footerDoc.body, block);
        footer.init();
      } catch {
        debug('Could not create footer.');
      }
    }
  }
}
