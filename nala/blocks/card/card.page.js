export default class Card {
  constructor(page, nth = 0) {
    this.page = page;
    // card locators
    this.card = this.page.locator('.card').nth(nth);

    // One half card locators
    this.oneHalfCard = this.page.locator('.consonant-OneHalfCard').nth(nth);
    this.oneHalfCardImage = this.oneHalfCard.locator('.consonant-OneHalfCard-img');
    this.oneHalfCardInner = this.oneHalfCard.locator('.consonant-OneHalfCard-inner');
    this.oneHalfCardTitleH3 = this.oneHalfCard.locator('h3.consonant-OneHalfCard-title');
    this.oneHalfCardText = this.oneHalfCard.locator('.consonant-OneHalfCard-text');
    // Double width card locators
    this.doubleWidthCard = this.page.locator('.double-width-card').nth(nth);
    this.doubleWidthCardImage = this.doubleWidthCard.locator('.consonant-DoubleWideCard-img');
    this.doubleWidthCardInner = this.doubleWidthCard.locator('.consonant-DoubleWideCard-inner');
    this.doubleWidthCardTitleH3 = this.doubleWidthCard.locator('h3.consonant-DoubleWideCard-title');
    this.doubleWidthCardText = this.doubleWidthCard.locator('.consonant-DoubleWideCard-text');
    // Product card locators
    this.productCard = this.page.locator('.product-card').nth(nth);
    this.productCardImage = this.productCard.locator('.consonant-ProductCard-img');
    this.productCardInner = this.productCard.locator('.consonant-ProductCard-inner');
    this.productCardTitleH3 = this.productCard.locator('h3.consonant-ProductCard-title');
    this.productCardText = this.productCard.locator('.consonant-ProductCard-text');
    // Half height card locators
    this.halfHeightCard = this.page.locator('.half-height-card').nth(nth);
    this.halfHeightCardImage = this.halfHeightCard.locator('.consonant-HalfHeightCard-img');
    this.halfHeightCardLink = this.halfHeightCard.locator('a.consonant-HalfHeightCard');
    this.halfHeightCardInner = this.halfHeightCard.locator('.consonant-HalfHeightCard-inner');
    this.halfHeightCardTitleH3 = this.halfHeightCard.locator('h3.consonant-HalfHeightCard-title');
    this.halfHeightCardText = this.halfHeightCard.locator('.consonant-HalfHeightCard-text');
    // Horizontal card locators
    this.horizontalCard = this.page.locator('.card-horizontal').nth(nth);
    this.horizontalCardImage = this.horizontalCard.locator('.card-image');
    this.horizontalCardImg = this.horizontalCard.locator('img');
    this.horizontalCardContent = this.horizontalCard.locator('card-content');
    this.horizontalCardBodyXS = this.horizontalCard.locator('.body-xs');
    this.horizontalCardHeadingXS = this.horizontalCard.locator('h2.heading-xs');
    this.horizontalCardHeadingXSLink = this.horizontalCardHeadingXS.locator('a');

    // card footer sections
    this.footer = this.card.locator('.consonant-CardFooter');
    this.footerOutlineButton = this.card.locator('a.con-button.outline').nth(0);
    this.footerOutlineButton2 = this.card.locator('a.con-button.outline').nth(1);
    this.footerBlueButton = this.card.locator('a.con-button.blue').nth(0);
    this.footerBlueButton2 = this.card.locator('a.con-button.blue').nth(1);

    // card attributes
    this.attributes = {
      oneHalfCardImage: { style: 'background-image: url' },
      'card-image': {
        loading: 'eager',
        fetchpriority: 'hight',
      },
    };
  }
}
