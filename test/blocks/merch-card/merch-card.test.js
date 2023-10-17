import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/merch-card/merch-card.js');

describe('Merch Card', () => {
  it('Shows segment card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
    await init(document.querySelector('.segment'));
    const merchCard = document.querySelector('merch-card');
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');
    expect(merchCard).to.exist;
    expect(body).to.exist;
    expect(heading).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('segment');
    expect(heading.textContent).to.be.equal('Lorem ipsum dolor sit amet');
    expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.See what\'s included | Learn more');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports Special Offers card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/special-offers.html' });
    await init(document.querySelector('.special-offers'));
    const merchCard = document.querySelector('merch-card');
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const list = merchCard.querySelector('div[slot="list"]');
    const buttons = footer.querySelectorAll('.con-button');
    const expectedList = `
        <p><strong>Best for</strong>:</p>
        <ul>
            <li>Photo editing</li>
            <li>Compositing</li>
            <li>Drawing and painting</li>
            <li>Graphic design</li>
        </ul>
    `;

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(list).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('special-offers');
    expect(merchCard.getAttribute('badge')).to.be.equal('{"style":"#EDCC2D, #000000","value":"LOREM IPSUM DOLOR"}');
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
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
      await init(document.querySelector('.merch-card.plans.icons.secure'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot="heading-m"]');
      const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
      const body = merchCard.querySelector('div[slot="body-xs"]');
      const detail = merchCard.querySelector('h5[slot="detail-m"]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingOne).to.exist;
      expect(body).to.exist;
      expect(detail).to.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('plans');
      expect(merchCard.getAttribute('badge')).to.be.equal('{"style":"#EDCC2D, #000000","value":"LOREM IPSUM DOLOR"}');
      expect(JSON.parse(merchCard.getAttribute('icons'))).to.have.lengthOf(2);
      expect(merchCard.getAttribute('checkbox-label')).to.be.equal('Lorem ipsum dolor sit amet');
      expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.MaecenasSee terms about lorem ipsum');
      expect(detail.textContent).to.be.equal('Maecenas porttitor enim.');
      expect(buttons.length).to.be.equal(3);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
      expect(buttons[2].textContent).to.be.equal('free-trial');
    });

    it('should skip ribbon and altCta creation', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
      await init(document.querySelector('.plans.icons.skip-ribbon.skip-altCta'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot=heading-m]');
      const headingXs = merchCard.querySelector('h3[slot=heading-xs]');
      const body = merchCard.querySelector('div[slot=body-xs]');
      const detail = merchCard.querySelector('h5[slot=detail-m]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingXs).to.exist;
      expect(body).to.exist;
      expect(detail).to.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('plans');
      expect(merchCard.getAttribute('badge')).to.not.exist;
      expect(JSON.parse(merchCard.getAttribute('icons'))).to.have.lengthOf(2);
      expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.See terms about lorem ipsum');
      expect(detail.textContent).to.be.equal('Maecenas porttitor enim.');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
    });

    it('does not display undefined if no content', async () => {
      const el = document.querySelector('.merch-card.empty');
      await init(el);
      expect(el.outerHTML.includes('undefined')).to.be.false;
    });
  });

  describe('Catalog Card', () => {
    it('Supports Catalog card', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
      await init(document.querySelector('.merch-card.ribbon'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot="heading-m"]');
      const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
      const body = merchCard.querySelector('div[slot="body-xs"]');
      const actionMenu = merchCard.querySelector('div[slot="action-menu-content"]');
      const detail = merchCard.querySelector('h5[slot="detail-m"]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingOne).to.exist;
      expect(body).to.exist;
      expect(detail).to.exist;
      expect(actionMenu).to.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
      expect(merchCard.getAttribute('badge')).to.be.equal('{"style":"#EDCC2D, #000000","value":"LOREM IPSUM DOLOR"}');
      expect(merchCard.getAttribute('action-menu')).to.be.equal('true');
      expect(merchCard.getAttribute('image')).to.exist;
      expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
      expect(detail.textContent).to.be.equal('Desktop + Mobile');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
    });

    it('Supports Catalog card without badge', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
      await init(document.querySelector('.merch-card.catalog.empty-badge'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot="heading-m"]');
      const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
      const body = merchCard.querySelector('div[slot="body-xs"]');
      const actionMenu = merchCard.querySelector('div[slot="action-menu-content"]');
      const detail = merchCard.querySelector('h5[slot="detail-m"]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingOne).to.exist;
      expect(body).to.exist;
      expect(detail).to.exist;
      expect(actionMenu).to.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
      expect(merchCard.getAttribute('badge')).to.not.exist;
      expect(merchCard.getAttribute('action-menu')).to.be.equal('true');
      expect(merchCard.getAttribute('image')).to.exist;
      expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
      expect(detail.textContent).to.be.equal('Desktop + Mobile');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
    });

    it('Supports Catalog card without badge and action-menu', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
      await init(document.querySelector('.merch-card.catalog.empty-action-menu'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot="heading-m"]');
      const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
      const body = merchCard.querySelector('div[slot="body-xs"]');
      const actionMenu = merchCard.querySelector('div[slot="actionMenuContent"]');
      const detail = merchCard.querySelector('h5[slot="detail-m"]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingOne).to.exist;
      expect(body).to.exist;
      expect(detail).to.exist;
      expect(actionMenu).to.not.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
      expect(merchCard.getAttribute('badge')).to.not.exist;
      expect(merchCard.getAttribute('action-menu')).to.not.exist;
      expect(merchCard.getAttribute('image')).to.exist;
      expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
      expect(detail.textContent).to.be.equal('Desktop + Mobile');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
    });

    it('Supports Catalog card with badge without action-menu', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
      await init(document.querySelector('.merch-card.catalog.empty-badge.action-menu-exist'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot="heading-m"]');
      const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
      const body = merchCard.querySelector('div[slot="body-xs"]');
      const actionMenu = merchCard.querySelector('div[slot="actionMenuContent"]');
      const detail = merchCard.querySelector('h5[slot="detail-m"]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingOne).to.exist;
      expect(body).to.exist;
      expect(detail).to.exist;
      expect(actionMenu).to.not.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
      expect(merchCard.getAttribute('badge')).to.be.equal('{"style":"#EDCC2D, #000000","value":"LOREM IPSUM DOLOR"}');
      expect(merchCard.getAttribute('action-menu')).to.not.exist;
      expect(merchCard.getAttribute('image')).to.exist;
      expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
      expect(detail.textContent).to.be.equal('Desktop + Mobile');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
    });
  });

  describe('Evergreen', () => {
    it('Supports Evergreen card', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/evergreen.html' });
      await init(document.querySelector('.evergreen'));
      const merchCard = document.querySelector('merch-card');
      const heading = merchCard.querySelector('h2[slot="heading-m"]');
      const headingXs = merchCard.querySelector('h3[slot="heading-xs"]');
      const body = merchCard.querySelector('div[slot="body-xs"]');
      const detailBg = merchCard.querySelector('h4[slot="body-xxs"]');
      const footer = merchCard.querySelector('div[slot="footer"]');
      const buttons = footer.querySelectorAll('.con-button');

      expect(merchCard).to.exist;
      expect(heading).to.exist;
      expect(headingXs).to.exist;
      expect(body).to.exist;
      expect(detailBg).to.exist;
      expect(merchCard.getAttribute('variant')).to.be.equal('evergreen');
      expect(merchCard.getAttribute('badge')).to.be.equal('{"style":"#EDCC2D, #000000","value":"LOREM IPSUM DOLOR"}');
      expect(merchCard.getAttribute('evergreen')).to.be.equal('true');
      expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
      expect(buttons.length).to.be.equal(2);
      expect(buttons[0].textContent).to.be.equal('Learn More');
      expect(buttons[1].textContent).to.be.equal('Save now');
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
