import { html } from '../../deps/htm-preact.js';
import { makeRelative } from '../../utils/utils.js';
import { analyticsGetLabel } from '../../martech/attributes.js';
import css from './gnav-menu.css' assert {type: 'css'}
document.adoptedStyleSheets = [...document.adoptedStyleSheets, css]

const childIndexOf = (el) =>
  [...el.parentElement.children]
    .filter((e) => e.nodeName === 'DIV' || e.nodeName === 'P')
    .indexOf(el);


const ConditionalWrapper = ({ condition, wrapper, children }) => 
condition ? wrapper(children) : children;

const NavMenu = ({ navLink, id, menu }) => {
  if(menu.childElementCount <= 1) return null
  const small = menu.childElementCount === 2 ? ' small-Variant' : '';
  const medium = menu.childElementCount === 3 ? ' medium-Variant' : '';
  const large = menu.childElementCount >= 4 ? ' large-Variant' : '';

  return html`
    <div
      id=${id}
      class="gnav-navitem-menu${small || medium || large}"
      daa-lh=${`header|${navLink.textContent}`}
    > 
      <${ConditionalWrapper} 
        condition=${menu.childElementCount >= 4} 
        wrapper=${children => html`<div class="gnav-menu-container">${children}</div>`}>
          ${Array.from(menu.children).map((child) => {
          if (child.nodeName === 'UL') {
            return html`<ul>
              ${Array.from(child.children).map((li, i) => MenuItem({ li, i }))}
            </ul>`;
          }
          if (child.nodeName === 'DIV') {
            return GnavPromo({ div: child });
          }
        })}
      <//>
    </div>
  `;
};

const MenuItem = ({ li, i }) =>
  html`<li>
    <a
      href=${makeRelative(li.firstChild.href, true)}
      daa-ll=${`${analyticsGetLabel(li.textContent)}-${i + 1}`}
      >${li.textContent}</a
    >
  </li>`;

const GnavPromo = ({ div }) => {
  const anchorTags = div.querySelectorAll('a');
  for (const anchorTag of anchorTags) {
    anchorTag.setAttribute(
      'daa-ll',
      `${analyticsGetLabel(anchorTag.textContent)}-${
        childIndexOf(anchorTag.parentElement) + 1
      }`
    );
  }
  // TODO dangerouslySetInnerHTML? Alternative? Sanitize?
  return html`<div
    class=${Array.from(div.classList).join(' ')}
    dangerouslySetInnerHTML=${{ __html: div.innerHTML }}
  ></div>`;
};

const LargeMenu = ({navBlock}) => {
  if(!navBlock) return null
  return html``;
};

export { NavMenu, LargeMenu };
