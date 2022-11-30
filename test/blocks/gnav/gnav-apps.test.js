import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import getApps from '../../../libs/blocks/gnav/gnav-appLauncher.js';

document.body.innerHTML = await readFile({ path: './mocks/applauncher.html' });

// Mock Toggle
function toggle() {
  const appsMenu = document.querySelector('.gnav-navitem.app-launcher');
  appsMenu.classList.toggle('is-open');
}

describe('App Launcher', () => {
  it('Apps menu exsists', async () => {
    const appLauncherBlock = document.body.querySelector('.app-launcher');
    expect(appLauncherBlock).to.exist;
  });

  it('Gnav with apps menu', async () => {
    const nav = document.body.querySelector('nav');
    const profile = document.body.querySelector('.gnav-profile');
    const appLauncherBlock = document.body.querySelector('.app-launcher');

    await getApps(profile, appLauncherBlock, toggle);

    const hasApps = nav.classList.contains('has-apps');
    expect(hasApps).to.be.true;
  });

  it('Apps menu toggle test', async () => {
    const appsMenu = document.querySelector('.gnav-navitem.app-launcher');
    const appsMenuBtn = appsMenu.querySelector(':scope > button');

    appsMenuBtn.click();
    expect(appsMenu.classList.contains('is-open')).to.be.true;
    appsMenuBtn.click();
    expect(appsMenu.classList.contains('is-open')).to.be.false;
  });

  it('Apps dropdown has links', async () => {
    const profile = document.body.querySelector('.gnav-profile');
    const linkBlock = profile.nextElementSibling.querySelector('.link-block');
    expect(linkBlock).to.exist;
  });
});
