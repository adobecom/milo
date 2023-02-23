import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const config = { codeRoot: '/libs' };
setConfig(config);

let merch;

describe('Decorating merch links', () => {
  before(async () => {
    const mod = await import('../../../libs/features/merch.js');
    merch = mod;
  });

  it('Does not decorate links that do not have an osi', async () => {
    const el = document.querySelector('.merch.no-osi');
    const links = el.querySelectorAll('a');
    merch.decorateCommerce(links);
    expect(links[0].parentElement.querySelector('span')).to.be.null;
    expect(links[1].href).to.not.be.equal('#');
  });

  it('Does decorate links with an osi', async () => {
    const el = document.querySelector('.merch.price');
    const links = el.querySelectorAll('a');
    const parent = links[0].parentElement;
    merch.decorateCommerce(links);
    const price = parent.querySelector('span');
    expect(price).to.not.be.null;
    expect(price.getAttribute('data-wcs-osi')).to.be.equal('A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M');
    expect(price.classList.contains('price')).to.be.true;
    expect(links[1].textContent).to.be.equal('buy-now');
  });

  it('Does decorate strikethrough price correctly', async () => {
    const el = document.querySelector('.merch.strikethrough');
    const links = el.querySelectorAll('a');
    const parent = links[0].parentElement;
    merch.decorateCommerce(links);
    const price = parent.querySelector('span');
    expect(price).to.not.be.null;
    expect(price.getAttribute('data-wcs-osi')).to.be.equal('A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M');
    expect(price.classList.contains('priceStrikethrough')).to.be.true;
  });

  it('Does decorate optical price correctly', async () => {
    const el = document.querySelector('.merch.optical');
    const links = el.querySelectorAll('a');
    const parent = links[0].parentElement;
    merch.decorateCommerce(links);
    const price = parent.querySelector('span');
    expect(price).to.not.be.null;
    expect(price.getAttribute('data-wcs-osi')).to.be.equal('A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M');
    expect(price.classList.contains('priceOptical')).to.be.true;
  });
});
