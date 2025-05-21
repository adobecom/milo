const MobileGnav = {
  init() {
    this.isMobile = window.matchMedia('(max-width: 899px)').matches;
    this.toggleButton = document.querySelector('.feds-toggle');
    this.menuItemLinks = document.querySelectorAll('.feds-nav-wrapper section.feds-navItem > .feds-navLink');
    this.eventInitialized = false;
    this.addEventListeners();
  },
  addEventListeners() {
    this.toggleButton.addEventListener('click', () => {
      if (this.isMobile) {
        const gnavWrapper = document.querySelector('.feds-nav-wrapper');
        if (gnavWrapper && gnavWrapper.classList.contains('feds-nav-wrapper--expanded')) {
          const firstNavLink = gnavWrapper.querySelector('.feds-nav .feds-navLink');
          firstNavLink.focus();
          if (!this.eventInitialized) {
            this.eventInitialized = true;
            const popupTabs = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tabs .tab');
            const popupTabContents = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tab-content');
            const popupLinks = document.querySelectorAll('.feds-nav-wrapper .feds-popup .tab-content .feds-navLink, .feds-promo a');
            popupTabs.forEach((tab) => {
              tab.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowUp') {
                  const prevTab = tab.previousElementSibling;
                  if (prevTab) {
                    prevTab.focus();
                  }
                } else if (e.code === 'ArrowDown') {
                  const nextTab = tab.nextElementSibling;
                  if (nextTab) {
                    nextTab.focus();
                  }
                } else if (e.code === 'ArrowRight') {
                  const currentTabs = [...popupTabs].filter((currentTab) => currentTab.closest('.feds-dropdown--active'));
                  const activeTab = currentTabs.find((currentTab) => currentTab.getAttribute('aria-selected') === 'true');
                  const activeTabIndex = activeTab.getAttribute('aria-controls');
                  const currentTabContent = [...popupTabContents].find((currentTab) => currentTab.closest('.feds-dropdown--active'));
                  if (currentTabContent && currentTabContent.children[activeTabIndex]) {
                    currentTabContent.children[activeTabIndex].querySelector('.feds-navLink, .feds-promo a').focus();
                  }
                }
              });
            });
            popupLinks.forEach((link) => {
              link.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowUp') {
                  let prevLink = link.previousElementSibling;
                  console.log(prevLink);
                  if (prevLink) {
                    if (prevLink.classList.contains('feds-promo-wrapper')) {
                      prevLink = prevLink.querySelector('a.feds-cta');
                    }
                    prevLink.focus();
                  } else if (link.classList.contains('feds-cta')) {
                    link.closest('.feds-promo-content').previousElementSibling.focus();
                  } else {
                    link.closest('.feds-promo-wrapper').previousElementSibling.focus();
                  }
                } else if (e.code === 'ArrowDown') {
                  let nextLink = link.nextElementSibling;
                  console.log(nextLink);
                  if (nextLink) {
                    if (nextLink.classList.contains('feds-promo-content')) {
                      nextLink = nextLink.querySelector('a');
                    }
                    if (nextLink.classList.contains('feds-promo-wrapper')) {
                      nextLink = nextLink.querySelector('a');
                    }
                    nextLink.focus();
                  } else {
                    link.closest('.feds-promo-wrapper').nextElementSibling.focus();
                  }
                } else if (e.code === 'ArrowLeft') {
                  const currentTabs = [...popupTabs].filter((currentTab) => currentTab.closest('.feds-dropdown--active'));
                  const activeTab = currentTabs.find((currentTab) => currentTab.getAttribute('aria-selected') === 'true');
                  if (activeTab) {
                    activeTab.focus();
                  }
                }
              });
            });
          }
        }
      }
    });

    this.menuItemLinks.forEach((menulink, index) => {
      menulink.addEventListener('keydown', (e) => {
        if (this.isMobile) {
          if (e.code === 'ArrowUp') {
            const prevLink = this.menuItemLinks[index - 1];
            if (prevLink) {
              prevLink.focus();
            }
          } else if (e.code === 'ArrowDown') {
            const nextLink = this.menuItemLinks[index + 1];
            if (nextLink) {
              nextLink.focus();
            }
          }
        }
      });
    });
  },
};

export default MobileGnav;
