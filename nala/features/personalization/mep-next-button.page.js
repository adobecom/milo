export default class MepButton {
  constructor(page) {
    this.page = page;

    this.mepButton = page.locator('.mep-fab');
    this.mepButtonExpanded = page.locator('#mep-drawer');
    this.closeButton = page.locator('#mep-drawer .icon-close');

    // fragment paths, badges
    this.fragment1 = page.locator('.fragment').nth(0);
    this.fragment2 = page.locator('.fragment').nth(1);
    this.caasBadge = page.locator('div:has(#content-as-a-service) .mep-caas-edit-badge');
    this.masCopyIDBadge = page.locator('div:has(#merch-card) .mep-mas-card-action-copy');

    // tabs
    this.actionsTab = page.locator('.mep-tab').nth(0);
    this.summaryTab = page.locator('.mep-tab').nth(1);
    this.actionsTabContent = page.locator('.mep-tab-content[data-tab="0"]');
    this.summaryTabContent = page.locator('.mep-tab-content[data-tab="1"]');

    // highlight card + toggles (the checkbox inputs are visually hidden, so
    // click the .mep-switch-track to flip them, matching Test 0's pattern)
    this.highlightCard = page.locator('.mep-card[data-card-key="Highlight"]');
    this.highlightExpandIcon = this.highlightCard.locator('h1 svg');
    this.toggleMep = page.locator('#toggle-mep');
    this.toggleCaas = page.locator('#toggle-caas');
    this.toggleMas = page.locator('#toggle-mas');
    this.toggleOther = page.locator('#toggle-other-fragments');
    this.toggleMepTrack = page.locator('label.mep-switch:has(#toggle-mep) .mep-switch-track');

    // toggle card (Preview Link / Manifest Manager)
    this.toggleCard = page.locator('.mep-card[data-card-key="Toggle"]');
    this.toggleCardExpandIcon = this.toggleCard.locator('h1 svg');
    this.previewLinkTrack = page.locator('label.mep-switch:has(#toggle-preview-link) .mep-switch-track');

    // summary tab cards
    this.summaryCards = this.summaryTabContent.locator('.mep-card');
    this.pageSummaryCard = page.locator('.mep-card[data-card-key="Page"]');

    // footer / load manifest
    this.previewButton = page.locator('#mep-drawer .mep-footer a.con-button');
    this.loadManifestCard = page.locator('.mep-card[data-card-key="Load Manifest"]');
    this.loadManifestExpandIcon = this.loadManifestCard.locator('h1 svg');
    this.loadManifestInput = page.locator('.mep-load-manifest');

    // page content added by a manifest
    this.accordion = page.locator('.accordion-container');

    this.expandIcon1 = page.locator('div.mep-card h1 svg').nth(0);
    this.expandIcon2 = page.locator('div.mep-card h1 svg').nth(1);
    this.expandIcon3 = page.locator('div.mep-card h1 svg').nth(2);
    this.expandIcon4 = page.locator('div.mep-card h1 svg').nth(3);
    this.expandIcon5 = page.locator('div.mep-card h1 svg').nth(4);

    this.card1 = page.locator('div.mep-card').nth(0);
    this.card2 = page.locator('div.mep-card').nth(1);
    this.card3 = page.locator('div.mep-card').nth(2);
    this.card4 = page.locator('div.mep-card').nth(3);
    this.card5 = page.locator('div.mep-card').nth(4);

    this.card2toggle1 = this.card2.locator('span.mep-switch-track').nth(0);
    this.card2toggle2 = this.card2.locator('span.mep-switch-track').nth(1);
    this.card2toggle3 = this.card2.locator('span.mep-switch-track').nth(2);
    this.card2toggle4 = this.card2.locator('span.mep-switch-track').nth(3);
  }
}
