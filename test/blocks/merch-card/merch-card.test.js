import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/merch-card/merch-card.js');

describe('Merch Card', () => {
  it('Shows segment card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
    await init(document.querySelector('.merch-card'));
    const inner = document.querySelector('.consonant-SegmentBlade-inner');
    const cardFooter = inner.querySelector('.consonant-CardFooter');
    const buttons = cardFooter.querySelectorAll('.con-button');

    expect(document.querySelector('.consonant-ProductCard')).to.be.exist;
    expect(inner.querySelector('.consonant-SegmentBlade-title')).to.be.exist;
    expect(inner.querySelector('.consonant-SegmentBlade-description')).to.be.exist;
    expect(cardFooter.querySelector('.con-button')).to.be.exist;
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  describe('Wrapper', async () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
      const merchCards = document.querySelectorAll('.segment');
      await init(merchCards[0]);
      await init(merchCards[1]);
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
    await init(document.querySelector('.special-offers'));
    const inner = document.querySelector('.consonant-SpecialOffers-inner');
    const cardFooter = inner.querySelector('.consonant-CardFooter');
    const ribbon = document.querySelector('.consonant-SpecialOffers-ribbon');
    const buttons = cardFooter.querySelectorAll('.con-button');

    expect(document.querySelector('.consonant-ProductCard')).to.be.exist;
    expect(inner.querySelector('.consonant-SpecialOffers-title')).to.be.exist;
    expect(inner.querySelector('.consonant-SpecialOffers-description')).to.be.exist;
    expect(document.querySelector('.consonant-SpecialOffers-iconWrapper')).to.be.exist;
    expect(ribbon).to.be.exist;
    expect(ribbon.style.backgroundColor).to.be.equal('rgb(237, 204, 45)');
    expect(ribbon.style.color).to.be.equal('rgb(0, 0, 0)');
    expect(ribbon.textContent).to.be.equal('LOREM IPSUM DOLOR');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports Card as a Fragment', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/special-offers.html' });
    await init(document.querySelector('.special-offers-black-friday'));
    const fragment = document.querySelector('.special-offers-fragment');
    const fragmentSection = fragment.querySelector('.section');
    const card = fragment.querySelector('.merch-card');

    expect(fragment).to.exist;
    expect(fragment.parentElement.childElementCount).to.be.equal(3);
    expect(fragmentSection).to.not.exist;
    expect(card).to.exist;
    expect(card.classList.contains('consonant-Card')).to.be.true;
  });

  describe('Plans Card', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    });

    it('Supports Plans card', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
      await init(document.querySelector('.plans.icons'));
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

      expect(plansCard).to.be.exist;
      expect(plansCard.style.border).to.be.equal('1px solid rgb(237, 204, 45)');
      expect(inner.querySelector('.consonant-PlansCard-title')).to.be.exist;
      expect(inner.querySelector('.consonant-PlansCard-description')).to.be.exist;
      expect(iconsWrapper).to.be.exist;
      expect(icons.length).to.be.equal(2);
      expect(ribbon).to.be.exist;
      expect(ribbon.style.backgroundColor).to.be.equal('rgb(237, 204, 45)');
      expect(ribbon.style.color).to.be.equal('rgb(0, 0, 0)');
      expect(ribbon.textContent).to.be.equal('LOREM IPSUM DOLOR');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
      expect(secureWrapper).to.be.exist;

      expect(checkBoxContainer.querySelector('.checkMark')).to.be.exist;
      expect(checkBoxContainer.querySelector('.checkbox-label').textContent).to.be.equal('Lorem ipsum dolor sit amet');
      expect(secureWrapper.querySelector('.secure-transaction-icon').classList).to.be.exist;
      expect(secureWrapper.querySelector('.secure-transaction-label')).to.be.exist;

      expect(inactiveButton.classList.contains('button--inactive')).to.be.true;
      checkBoxContainer.querySelector('.checkMark').click();
      expect(inactiveButton.classList.contains('button--inactive')).to.be.false;
      checkBoxContainer.querySelector('.checkMark').click();
      expect(inactiveButton.classList.contains('button--inactive')).to.be.true;
    });

    it('should skip ribbon and altCta creation', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
      await init(document.querySelector('.plans.icons.skip-ribbon.skip-altCta'));
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

      expect(plansCard).to.be.exist;
      console.log(plansCard.style.border);
      expect(inner.querySelector('.consonant-PlansCard-title')).to.be.exist;
      expect(inner.querySelector('.consonant-PlansCard-description')).to.be.exist;
      expect(iconsWrapper).to.be.exist;
      expect(icons.length).to.be.equal(2);
      expect(ribbon).to.not.exist;
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
      expect(inactiveButton).to.be.exist;
      expect(secureWrapper).to.not.exist;
      expect(checkBoxContainer).to.not.exist;
    });

    it('does not display undefined if no content', async () => {
      const el = document.querySelector('.merch-card.empty');
      await init(el);
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
        init(card);
      });
      expect(cards[0].classList.contains('has-divider')).to.be.true;
    });
  });
});
