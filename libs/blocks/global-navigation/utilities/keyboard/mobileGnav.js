import { isDesktop } from '../utilities.js';

const MobileGnav = {
  init() {
    this.isMobile = !isDesktop.matches;
    this.toggleButton = document.querySelector('.feds-toggle');
    this.menuItemLinks = document.querySelectorAll('.feds-nav-wrapper section.feds-navItem > .feds-navLink');
    this.eventInitialized = false;
    this.addEventListeners();
  },
  addEventListeners() {
    this.toggleButton.addEventListener('keydown', ({ code }) => {
      if (!this.isMobile) return;
      const gnavWrapper = document.querySelector('.feds-nav-wrapper');
      if (code === 'ArrowDown' && gnavWrapper?.classList.contains('feds-nav-wrapper--expanded')) {
        const firstNavLink = gnavWrapper.querySelector('.feds-nav .feds-navLink');
        firstNavLink.focus();
      }
    });
    this.toggleButton.addEventListener('click', () => {
      if (!this.isMobile) return;
      const gnavWrapper = document.querySelector('.feds-nav-wrapper');
      if (gnavWrapper?.classList.contains('feds-nav-wrapper--expanded')) {
        if (!this.eventInitialized) {
          this.eventInitialized = true;
          const popupTabs = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tabs .tab');
          const popupTabContents = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tab-content');
          const popupLinks = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tab-content a.feds-navLink, .feds-promo a');
          popupTabs.forEach((tab) => {
            tab.addEventListener('keydown', ({ code }) => {
              switch (code) {
                case 'ArrowUp': {
                  const prevTab = tab.previousElementSibling;
                  if (prevTab) prevTab.focus();
                  break;
                }
                case 'ArrowDown': {
                  const nextTab = tab.nextElementSibling;
                  if (nextTab) nextTab.focus();
                  break;
                }
                case 'ArrowRight': {
                  const currentTabs = [...popupTabs].filter((currentTab) => currentTab.closest('.feds-dropdown--active'));
                  const activeTab = currentTabs.find((currentTab) => currentTab.getAttribute('aria-selected') === 'true');
                  const activeTabIndex = activeTab.getAttribute('aria-controls');
                  const currentTabContent = [...popupTabContents].find((currentTab) => currentTab.closest('.feds-dropdown--active'));
                  if (currentTabContent && currentTabContent.children[activeTabIndex]) {
                    currentTabContent.children[activeTabIndex].querySelector('a.feds-navLink, .feds-promo a').focus();
                  }
                  break;
                }
                default:
                  break;
              }
            });
          });
          popupLinks.forEach((link) => {
            link.addEventListener('keydown', ({ code }) => {
              switch (code) {
                case 'ArrowUp': {
                  let prevLink = link.previousElementSibling;
                  if (prevLink?.classList.contains('feds-promo-wrapper')) {
                    prevLink = prevLink.querySelector('a.feds-cta');
                  }
                  if (prevLink?.tagName === 'DIV' && prevLink.classList.contains('feds-navLink')) {
                    prevLink = prevLink.previousElementSibling;
                  }
                  if (prevLink) {
                    prevLink.focus();
                  } else if (link.classList.contains('feds-cta')) {
                    link.closest('.feds-promo-content').previousElementSibling.focus();
                  } else {
                    link.closest('.feds-promo-wrapper').previousElementSibling.focus();
                  }
                  break;
                }
                case 'ArrowDown': {
                  let nextLink = link.nextElementSibling;
                  if (nextLink?.classList.contains('feds-promo-content')) {
                    nextLink = nextLink.querySelector('a');
                  }
                  if (nextLink?.classList.contains('feds-promo-wrapper')) {
                    nextLink = nextLink.querySelector('a');
                  }
                  if (nextLink?.tagName === 'DIV' && nextLink.classList.contains('feds-navLink')) {
                    nextLink = nextLink.nextElementSibling;
                  }
                  if (nextLink) {
                    nextLink.focus();
                  } else {
                    link.closest('.feds-promo-wrapper').nextElementSibling.focus();
                  }
                  break;
                }
                case 'ArrowLeft': {
                  const currentTabs = [...popupTabs].filter((currentTab) => currentTab.closest('.feds-dropdown--active'));
                  const activeTab = currentTabs.find((currentTab) => currentTab.getAttribute('aria-selected') === 'true');
                  if (activeTab) activeTab.focus();
                  break;
                }
                default:
                  break;
              }
            });
          });
        }
      }
    });

    this.menuItemLinks.forEach((menulink, index) => {
      menulink.addEventListener('keydown', ({ code }) => {
        if (!this.isMobile) return;
        if (code === 'ArrowUp') {
          const prevLink = this.menuItemLinks[index - 1];
          if (prevLink) prevLink.focus();
          else this.toggleButton.focus();
        } else if (code === 'ArrowDown') {
          const nextLink = this.menuItemLinks[index + 1];
          if (nextLink) nextLink.focus();
        } else if (code === 'Space') {
          const popupTabs = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tabs .tab');
          setTimeout(() => {
            const activeTab = [...popupTabs].find((currentTab) => currentTab.closest('.feds-dropdown--active') && currentTab.getAttribute('aria-selected') === 'true');
            activeTab.focus();
          }, 150);
        }
      });
    });
  },
};

export default MobileGnav;
