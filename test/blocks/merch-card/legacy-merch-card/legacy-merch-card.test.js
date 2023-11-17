import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: initLegacyMerchCard } = await import('../../../../libs/blocks/merch-card/legacy-merch-card.js');

describe('Merch Card', () => {
  it('Shows segment card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
    await initLegacyMerchCard(document.querySelector('.merch-card'));
    const inner = document.querySelector('.consonant-SegmentBlade-inner');
    const cardFooter = inner.querySelector('.consonant-CardFooter');
    const buttons = cardFooter.querySelectorAll('.con-button');

    expect(document.querySelector('.consonant-ProductCard')).to.exist;
    expect(inner.querySelector('.consonant-SegmentBlade-title')).to.exist;
    expect(inner.querySelector('.consonant-SegmentBlade-description')).to.exist;
    expect(cardFooter.querySelector('.con-button')).to.exist;
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  describe('Wrapper', async () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
      const merchCards = document.querySelectorAll('.segment');
      await initLegacyMerchCard(merchCards[0]);
      await initLegacyMerchCard(merchCards[1]);
    });

    it('Has one per section', () => {
      expect(document.querySelectorAll('.consonant-Wrapper').length).to.equal(1);
    });

    it('Is in correct position', async () => {
      const wrapper = document.querySelector('.consonant-Wrapper');
      expect(wrapper.previousElementSibling).to.equal(document.querySelector('.before'));
      expect(wrapper.nextElementSibling).to.equal(document.querySelector('.after'));
    });
  });

  it('Supports Special Offers card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/special-offers.html' });
    await initLegacyMerchCard(document.querySelector('.special-offers'));
    const inner = document.querySelector('.consonant-SpecialOffers-inner');
    const cardFooter = inner.querySelector('.consonant-CardFooter');
    const ribbon = document.querySelector('.consonant-SpecialOffers-ribbon');
    const buttons = cardFooter.querySelectorAll('.con-button');

    expect(document.querySelector('.consonant-ProductCard')).to.exist;
    expect(inner.querySelector('.consonant-SpecialOffers-title')).to.exist;
    expect(inner.querySelector('.consonant-SpecialOffers-description')).to.exist;
    expect(document.querySelector('.consonant-SpecialOffers-iconWrapper')).to.exist;
    expect(ribbon).to.exist;
    expect(ribbon.style.backgroundColor).to.be.equal('');
    expect(ribbon.style.color).to.be.equal('rgb(0, 0, 0)');
    expect(ribbon.textContent).to.be.equal('LOREM IPSUM DOLOR');
    expect(ribbon.style.borderLeft).to.be.equal('1px solid rgb(237, 204, 45)');
    expect(ribbon.style.borderRight).to.be.equal('none');
    expect(ribbon.style.borderTop).to.be.equal('1px solid rgb(237, 204, 45)');
    expect(ribbon.style.borderBottom).to.be.equal('1px solid rgb(237, 204, 45)');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  describe('Plans Card', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    });

    it('Supports Plans card', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
      await initLegacyMerchCard(document.querySelector('.plans.icons'));
      const inner = document.querySelector('.consonant-PlansCard-inner');
      const cardFooter = inner.querySelector('.consonant-CardFooter');
      const ribbon = document.querySelector('.consonant-PlansCard-ribbon');
      const buttons = cardFooter.querySelectorAll('.con-button');
      const inactiveButton = cardFooter.querySelector('.button--inactive');
      const secureWrapper = cardFooter.querySelector('.secure-transaction-wrapper');
      const checkBoxContainer = cardFooter.querySelector('.checkbox-container');
      const plansCard = document.querySelector('.consonant-ProductCard');
      const iconsWrapper = document.querySelector('.consonant-PlansCard-iconWrapper');
      const icons = iconsWrapper.querySelectorAll('.consonant-MerchCard-ProductIcon');
      const list = document.querySelector('.consonant-PlansCard-list');
      const listItems = list.querySelectorAll('li');

      expect(plansCard).to.exist;
      expect(plansCard.style.border).to.be.equal('1px solid rgb(237, 204, 45)');
      expect(inner.querySelector('.consonant-PlansCard-title')).to.exist;
      expect(inner.querySelector('.consonant-PlansCard-description')).to.exist;
      expect(iconsWrapper).to.exist;
      expect(icons.length).to.be.equal(2);
      expect(ribbon).to.exist;
      expect(ribbon.style.backgroundColor).to.be.equal('rgb(237, 204, 45)');
      expect(ribbon.style.color).to.be.equal('rgb(0, 0, 0)');
      expect(ribbon.textContent).to.be.equal('LOREM IPSUM DOLOR');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
      expect(secureWrapper).to.exist;
      expect(list).to.exist;
      expect(list.classList.contains('consonant-PlansCard-list')).to.be.true;
      expect(listItems.length).to.be.equal(2);
      expect(listItems[0].textContent).to.be.equal('Maecenas porttitor congue massa');
      expect(listItems[1].textContent).to.be.equal('Nunc viverra imperdiet enim.');

      expect(checkBoxContainer.querySelector('.checkMark')).to.exist;
      expect(checkBoxContainer.querySelector('.checkbox-label').textContent).to.be.equal('Lorem ipsum dolor sit amet');
      expect(secureWrapper.querySelector('.secure-transaction-icon').classList).to.exist;
      expect(secureWrapper.querySelector('.secure-transaction-label')).to.exist;

      expect(inactiveButton.classList.contains('button--inactive')).to.be.true;
      checkBoxContainer.querySelector('.checkMark').click();
      expect(inactiveButton.classList.contains('button--inactive')).to.be.false;
      checkBoxContainer.querySelector('.checkMark').click();
      expect(inactiveButton.classList.contains('button--inactive')).to.be.true;
    });

    it('should skip ribbon and altCta creation', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
      await initLegacyMerchCard(document.querySelector('.plans.icons.skip-ribbon.skip-altCta'));
      const inner = document.querySelector('.consonant-PlansCard-inner');
      const cardFooter = inner.querySelector('.consonant-CardFooter');
      const ribbon = document.querySelector('.consonant-PlansCard-ribbon');
      const buttons = cardFooter.querySelectorAll('.con-button');
      const inactiveButton = cardFooter.querySelectorAll('.button--inactiive');
      const secureWrapper = cardFooter.querySelector('.secure-transaction-wrapper');
      const checkBoxContainer = cardFooter.querySelector('.checkbox-container');
      const plansCard = document.querySelector('.consonant-ProductCard');
      const iconsWrapper = document.querySelector('.consonant-PlansCard-iconWrapper');
      const icons = iconsWrapper.querySelectorAll('.consonant-MerchCard-ProductIcon');

      expect(plansCard).to.exist;
      console.log(plansCard.style.border);
      expect(inner.querySelector('.consonant-PlansCard-title')).to.exist;
      expect(inner.querySelector('.consonant-PlansCard-description')).to.exist;
      expect(iconsWrapper).to.exist;
      expect(icons.length).to.be.equal(2);
      expect(ribbon).to.not.exist;
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
      expect(inactiveButton).to.exist;
      expect(secureWrapper).to.not.exist;
      expect(checkBoxContainer).to.not.exist;
    });

    it('does not display undefined if no content', async () => {
      const el = document.querySelector('.merch-card.empty');
      await initLegacyMerchCard(el);
      expect(el.outerHTML.includes('undefined')).to.be.false;
    });
  });

  describe('UAR Card', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/uar-card.html' });
    });
    it('handles decorated <hr>', async () => {
      const cards = document.querySelectorAll('.merch-card');
      cards.forEach((card) => {
        initLegacyMerchCard(card);
      });
      expect(cards[0].classList.contains('has-divider')).to.be.true;
    });
  });
});
