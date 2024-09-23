/* eslint-disable import/no-import-module-exports */

export default class FedsFooter {
  constructor(page) {
    this.page = page;

    // Container Selectors:
    this.footerContainer = page.locator('footer.global-footer');
    this.footerSections = page.locator('footer div.feds-menu-section');
    this.footerColumns = page.locator('footer div.feds-menu-column');
    this.footerHeadings = page.locator('footer div.feds-menu-headline');

    // Change Region Selectors:
    this.changeRegionContainer = page.locator('div.feds-regionPicker-wrapper');
    this.changeRegionButton = page.locator('div.feds-regionPicker-wrapper a.feds-regionPicker');
    this.changeRegionModal = page.locator('div#langnav');
    this.changeRegionDropDown = page.locator('div.region-selector');
    this.changeRegionCloseButton = page.locator('button.dialog-close');

    // Legal Selectors:
    this.legalContainer = page.locator('div.feds-footer-legalWrapper');
    this.legalSections = page.locator('p.feds-footer-privacySection');
    this.legalLinks = page.locator('div.feds-footer-legalWrapper a');
    this.legalCopyright = page.locator('span.feds-footer-copyright');
    this.privacyLink = page.locator('a[href*="privacy.html"]');
    this.termsOfUseLink = page.locator('a[href*="terms.html"]');
    this.cookiePreferencesLink = page.locator('a[href*="#openPrivacy"]');
    this.doNotSellInformationLink = page.locator('a[href*="ca-rights.html"]');
    this.adChoicesLink = page.locator('a[href*="opt-out.html"]');
    this.adChoicesLogo = page.locator('svg.feds-adChoices-icon');

    // Adobe Socials Selectors:
    this.twitterIcon = page.locator('ul.feds-social a[aria-label="twitter"]');
    this.linkedInIcon = page.locator('ul.feds-social a[aria-label="linkedin"]');
    this.facebookIcon = page.locator('ul.feds-social a[aria-label="facebook"]');
    this.instagramIcon = page.locator('ul.feds-social a[aria-label="instagram"]');
    this.socialContainer = page.locator('ul.feds-social');
    this.socialIcons = page.locator('ul.feds-social li');

    // Featured Products Selectors:
    this.featuredProductsContainer = page.locator('div.feds-featuredProducts');
    this.featuredProducts = page.locator('div.feds-featuredProducts a');
    this.downloadAdobeExpress = page.locator('footer a[daa-ll="Adobe_Express"]');
    this.downloadAdobePhotoshop = page.locator('footer a[daa-ll="Photoshop"]');
    this.downloadAdobeIllustrator = page.locator('footer a[daa-ll="Illustrator"]');

    // Footer Section Selectors:
    this.footerCreativeCloud = page.locator(".feds-footer-wrapper a[href*='creativecloud.html']");
    this.footerViewAllProducts = page.locator(".feds-navLink[href*='/products/catalog.html?']");
    this.footerCreativeCloudForBusiness = page.locator(".feds-footer-wrapper [href$='cloud/business.html']").nth(0);
    this.footerAcrobatForBusiness = page.locator(".feds-footer-wrapper a[href$='acrobat/business.html']");
    this.footerDiscountsForStudentsAndTeachers = page.locator(".feds-footer-wrapper a[href$='buy/students.html']");
    this.footerDigitalLearningSolutions = page.locator("a[href$='/elearning.html']");
    this.footerAppsforiOS = page.locator("a[href*='id852473028']");
    this.footerAppsforAndroid = page.locator("a[href*='id=com.adobe.cc']");
    this.footerWhatIsExperienceCloud = page.locator('.feds-footer-wrapper a[href*="business"]').nth(4);
    this.footerTermsOfUse = page.locator('a[href*="experiencecloudterms"]');
    this.footerDownloadAndInstall = page.locator('.feds-footer-wrapper a[href*="download-install.html"]');
    this.footerGenuineSoftware = page.locator('a[href*="genuine.html"]');
    this.footerAdobeBlog = page.locator('.feds-navLink[href*="blog"]').nth(1);
    this.footerAdobeDeveloper = page.locator('a[href*="developer"]');
    this.footerLogInToYourAccount = page.locator('.feds-footer-wrapper a[href*="account.adobe"]').nth(0);
    this.footerAbout = page.locator('.feds-footer-wrapper [href*="about-adobe.html"]').nth(0);
    this.footerIntegrity = page.locator('a[href*="integrity.html"]');
    this.footerAdobeBlogSecond = page.locator('.feds-navLink[href*="blog"]').nth(0);
    this.protectMyPersonalData = page.locator('.feds-footer-legalWrapper a:nth-of-type(4)');
    this.termsOfUseLinkTwo = page.locator('a[href*="terms.html"]').nth(1);

    // Featured Product Selectors:
    this.footerAdobeAcrobatReaderlogo = page.locator('a[href$="reader/"]');
    this.footerAdobeExpresslogo = page.locator('a[href$="Z2G1FSYV&mv=other"]:nth-of-type(2)');
    this.footerPhotoshoplogo = page.locator('a[href$="photoshop/free-trial-download.html"]');
    this.footerIllustratorlogo = page.locator('a[href$="illustrator/free-trial-download.html"]');
  }

  // >> FEDS Footer methods declared here <<
}
