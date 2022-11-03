import { createTag, makeRelative } from '../../utils/utils.js';

const WAFFLE_ICON = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img" class="spectrum-Icon spectrum-Icon--sizeS"><path d="M10 10H2V3a1 1 0 0 1 1-1h7zm4-8h8v8h-8zm20 8h-8V2h7a1 1 0 0 1 1 1zM2 14h8v8H2zm12 0h8v8h-8zm12 0h8v8h-8zM10 34H3a1 1 0 0 1-1-1v-7h8zm4-8h8v8h-8zm19 8h-7v-8h8v7a1 1 0 0 1-1 1z"></path></svg>';

function decorateAppLauncher(profileEl, appLauncherBlock, appsDropdown, appsList, toggle) {
  // console.log('app launcher.js', profileEl, appLauncherBlock);
  console.log('list', appsList[0]);

  const gnav = profileEl.parentElement;
  gnav.classList.add('has-apps');
  const appsEl = createTag('div', { class: 'gnav-navitem app-launcher has-menu', 'da-ll': 'App Launcher' });
  const appsListContainer = createTag('ul', { class: 'apps' });
  const appsMenuContainer = createTag('div', { class: 'app-menu gnav-navitem-menu' }, appsListContainer);
  // cta.setAttribute('daa-ll', analyticsGetLabel(cta.textContent));
  const appButton = createTag(
    'button',
    {
      class: 'gnav-applications-button',
      'aria-label': 'Applications',
      'aria-expanded': false,
      'aria-controls': 'gnav-applications',
    },
    WAFFLE_ICON,
  );

  appsEl.append(appButton);
  profileEl.insertAdjacentElement('afterend', appsEl);

  appsList.forEach((li) => {
    const image = li.querySelector('picture');
    const anchor = li.querySelector('a');
    const title = anchor?.textContent;
    const link = createTag('a', {
      class: 'link-block',
      href: anchor.href,
      role: 'link',
      'aria-label': title,
      rel: 'noopener',
      target: '_blank',
    });

    anchor.href = makeRelative(anchor.href, true);
    li.replaceChildren();
    link.append(image, title);
    li.appendChild(link);
    appsListContainer.append(li);
  });
  appsMenuContainer.append(appsListContainer);
  appsEl.append(appsMenuContainer);
  appButton.addEventListener('click', () => { toggle(appsEl); });
  // appsEl.insertAdjacentHTML('beforeend', appsDropdown);
  // return appsEl;
}

export default async function getAppLauncher(profileEl, appLauncherBlock, appsDropdown, appsList, toggle) {
  const profiles = {};
  profiles.ims = await window.adobeIMS.getProfile();
  decorateAppLauncher(profileEl, appLauncherBlock, appsDropdown, appsList, toggle);
}
