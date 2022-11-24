import {
  getConfig,
  getMetadata,
  loadScript,
  makeRelative,
} from '../../utils/utils.js';

import { analyticsGetLabel } from '../../martech/attributes.js';

import { html, render, useState } from '../../deps/htm-preact.js';

export const IS_OPEN = 'is-open';

const SearchIcon = () => html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  focusable="false"
>
  <path
    d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"
  ></path>
</svg> `;

const BrandImg = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 234">
    <defs>
      <style>
        .cls-1 {
          fill: #fa0f00;
        }
        .cls-2 {
          fill: #fff;
        }
      </style>
    </defs>
    <rect class="cls-1" width="240" height="234" rx="42.5" />
    <path
      id="_256"
      data-name="256"
      class="cls-2"
      d="M186.617,175.95037H158.11058a6.24325,6.24325,0,0,1-5.84652-3.76911L121.31715,99.82211a1.36371,1.36371,0,0,0-2.61145-.034l-19.286,45.94252A1.63479,1.63479,0,0,0,100.92626,148h21.1992a3.26957,3.26957,0,0,1,3.01052,1.99409l9.2814,20.65452a3.81249,3.81249,0,0,1-3.5078,5.30176H53.734a3.51828,3.51828,0,0,1-3.2129-4.90437L99.61068,54.14376A6.639,6.639,0,0,1,105.843,50h28.31354a6.6281,6.6281,0,0,1,6.23289,4.14376L189.81885,171.046A3.51717,3.51717,0,0,1,186.617,175.95037Z"
    />
  </svg>
`;

async function fetchGnav(url) {
  const resp = await fetch(`${url}.plain.html`);
  const html = await resp.text();
  return html;
}

const GnavPreact = ({ name, body }) => {
  const [gnavOpen, setGnavOpen] = useState(false);
  // TODO opening the search/menu should not cause the whole gnav re-render
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return html`
    <header
      class="gnav${gnavOpen ? ` ${IS_OPEN}` : ''}"
      daa-im="true"
      daa-lh="gnav${name}"
    >
      <div
        class="gnav-curtain${menuOpen ? ' is-open is-quiet' : ''}${searchOpen
          ? ' is-open'
          : ''}"
      ></div>
      <div class="gnav-wrapper">
        <nav class="gnav" aria-label="Main">
          <button
            class="gnav-toggle"
            aria-label="Navigation menu"
            aria-expanded=${gnavOpen}
            onClick=${() => setGnavOpen(!gnavOpen)}
          ></button>
          <${BrandBlock} body=${body} />
          <${MainNav}
            body=${body}
            menuOpen=${menuOpen}
            setMenuOpen=${setMenuOpen}
            searchOpen=${searchOpen}
            setSearchOpen=${setSearchOpen}
          />
          <${Profile} body=${body} />
          <${Logo} body=${body} />
        </nav>
      </div>
    </header>
  `;
};

// done apart of the todo
const BrandBlock = ({ body }) => {
  const brandBlock = body.querySelector('[class^="gnav-brand"]');
  if (!brandBlock) return null;
  const brandLinks = [...brandBlock.querySelectorAll('a')];
  const brand = brandLinks.pop();
  return html`
    <a
      href=${brand.getAttribute('href')}
      class=${brandBlock.className}
      aria-label=${brand.textContent}
      daa-ll="Brand"
    >
      <${BrandImg} />
      <span class="gnav-brand-title"> ${brand.textContent} </span>
    </a>
  `;
};

const MainNav = ({
  body,
  menuOpen,
  setMenuOpen,
  searchOpen,
  setSearchOpen,
}) => {
  const mainLinks = body.querySelectorAll('h2 > a');
  return html`
    <div class="mainnav-wrapper">
      <div class="gnav-mainnav">
        ${mainLinks &&
        [...mainLinks].map(
          (navLink, index) => html`
            <${NavLink}
              navLink=${navLink}
              index=${index}
              menuOpen=${menuOpen}
              setMenuOpen=${setMenuOpen}
            />
          `
        )}
        <${Cta} body=${body} />
      </div>
      <${Search}
        body=${body}
        searchOpen=${searchOpen}
        setSearchOpen=${setSearchOpen}
      />
    </div>
  `;
};

let NavMenu;
let LargeMenu;
const loadMenu = async () => {
  if (NavMenu) return;
  const menu = await import('./gnav-menu.js');
  NavMenu = menu.NavMenu;
  LargeMenu = menu.LargeMenu;
};

const NavLink = ({ navLink, index, menuOpen, setMenuOpen }) => {
  const navBlock = navLink.closest('.large-menu');
  const menu = navLink.closest('div');

  // Elements with only one entry just have a <h2/> tag
  const hasMenu = menu.childElementCount > 1 || navBlock ? ' has-menu' : '';

  // If an entry does not have a menu - we can just display the link
  if (!hasMenu) {
    return html`
      <div class="gnav-navitem">
        <a href=${makeRelative(navLink.href, true)} role="button"
          >${navLink.textContent}</a
        >
      </div>
    `;
  }

  const largeMenu = navBlock ? ' large-menu' : '';
  const sectionMenu = navBlock?.classList.contains('section')
    ? ' section-menu'
    : '';

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await loadMenu();
    setMenuOpen(menuOpen === index ? false : index);
  };

  return html`
    <div
      class="gnav-navitem${hasMenu}${largeMenu}${sectionMenu}${menuOpen ===
      index
        ? ' is-open'
        : ''}"
    >
      <a
        onClick=${handleClick}
        onKeyDown=${(e) => e.code === 'Space' && handleClick(e)}
        href=${makeRelative(navLink.href, true)}
        role="button"
        aria-expanded=${menuOpen === index}
        aria-controls=${`navmenu-${index}`}
        daa-ll=${navLink.textContent}
        daa-lh="header|${menuOpen === index ? 'Close' : 'Open'}"
      >
        ${navLink.textContent}
      </a>
      ${NavMenu &&
      menuOpen === index &&
      html`<${NavMenu}
        id=${`navmenu-${index}`}
        menu=${menu}
        navLink=${navLink}
      />`}
      ${LargeMenu &&
      menuOpen === index &&
      html`<${LargeMenu} menu=${navBlock} />`}
    </div>
  `;
};

const Cta = ({ body }) => {
  const cta = body.querySelector('strong a');
  const { origin } = new URL(cta.href);
  return html`
    <strong class="gnav-cta">
      <a
        href=${cta.getAttribute('href')}
        class="con-button blue button-M"
        daa-ll=${analyticsGetLabel(cta.textContent)}
        target="${origin === window.location.origin ? '' : '_blank'}"
      >
        ${cta.textContent}
      </a>
    </strong>
  `;
};

let SearchUI;
const loadSearch = async () => {
  if (SearchUI) return;
  const search = await import('./gnav-search.js');
  SearchUI = search.SearchUI;
};

const Search = ({ body, searchOpen, setSearchOpen }) => {
  const searchBlock = body.querySelector('.search');
  if (!searchBlock) return;
  const label = searchBlock.querySelector('p').textContent;

  const openSearch = async () => {
    await loadSearch();
    setSearchOpen(!searchOpen);
  };

  return html`
    <div class="gnav-search${searchOpen ? ' is-open' : ''}">
      <button
        onClick=${openSearch}
        class="gnav-search-button"
        aria-label=${label}
        aria-expanded=${searchOpen}
        aria-controls="gnav-search-bar"
        daa-ll="Search"
        daa-lh="Header|${searchOpen ? 'Close' : 'Open'}"
      >
        <${SearchIcon} />
      </button>
      ${searchOpen &&
      html`<${SearchUI} SearchIcon=${SearchIcon} label=${label} />`}
    </div>
  `;
};

// TODO profile hasn't been implemented yet
// TODO - this causes a minimal layout shift
const Profile = ({ body }) => {
  const blockEl = body.querySelector('.profile');
  if (!blockEl) return null;
  const { locale, imsClientId, env } = getConfig();
  if (!imsClientId) return null;

  const onReady = async () => {};

  window.adobeid = {
    client_id: imsClientId,
    scope: 'AdobeID,openid,gnav',
    locale: locale || 'en-US',
    autoValidateToken: true,
    environment: env.ims,
    useLocalStorage: false,
    onReady,
  };

  loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');

  return html`
    <div class="gnav-profile">
      <button
        class="gnav-profile-button"
        aria-label="Oakan Sahin"
        aria-expanded="false"
        aria-controls="gnav-profile-menu"
      >
        Sign In
      </button>
    </div>
  `;
};

const Logo = ({ body }) => {
  const logo = body.querySelector('.adobe-logo a');

  return html`
    <a
      href="https://www.adobe.com/"
      class="gnav-logo"
      aria-label=${logo.textContent}
      daa-ll="Logo"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.46 118.11">
        <defs>
          <style>
            .cls-1 {
              fill: #fa0f00;
            }
          </style>
        </defs>
        <polygon
          class="cls-1"
          points="84.13 0 133.46 0 133.46 118.11 84.13 0"
        ></polygon>
        <polygon class="cls-1" points="49.37 0 0 0 0 118.11 49.37 0"></polygon>
        <polygon
          class="cls-1"
          points="66.75 43.53 98.18 118.11 77.58 118.11 68.18 94.36 45.18 94.36 66.75 43.53"
        ></polygon>
      </svg>
    </a>
  `;
};

export default async function init(header) {
  const { locale, imsClientId } = getConfig();
  const name = imsClientId ? `|${imsClientId}` : '';
  const url = getMetadata('gnav-source') || `${locale.contentRoot}/gnav`;
  const navMarkup = await fetchGnav(url);
  if (!navMarkup) return null;
  try {
    const parser = new DOMParser();
    const gnavDoc = parser.parseFromString(navMarkup, 'text/html');
    const gnavPreact = html`<${GnavPreact}
      body=${gnavDoc.body}
      name=${name}
    />`;
    render(gnavPreact, header.parentElement, header);
  } catch (e) {
    console.log('Could not create global navigation:', e);
  }
}
