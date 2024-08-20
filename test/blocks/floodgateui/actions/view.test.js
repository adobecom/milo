import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import Actions from '../../../../libs/blocks/floodgateui/actions/view.js';
import ConfirmationModal from '../../../../libs/blocks/floodgateui/actions/confirmationModal';
import { updateExcelJson } from '../../../../libs/blocks/floodgateui/actions/index.js';
import { urls, enableActionButton, fragmentStatusCheck } from '../../../../libs/blocks/floodgateui/utils/state.js';

const mockRes = ({ payload, status = 200, ok = true } = {}) => new Promise((resolve) => {
  resolve({
    status,
    ok,
    json: () => payload,
    text: () => payload.body,
    url: 'https://main--milo--adobecom.hlx.page/drafts/Soujanya/pdfviewsdk',
  });
});

const mockFetch = (payload) => sinon.stub().callsFake(() => mockRes(payload));

describe('Update fragment action button', () => {
  before(async () => {
    const payload = {
      body: '<!DOCTYPE html> <html> <head> <title>CC on load pdf load :</title> <meta property="og:title" content="CC on load pdf load :"> <meta property="og:image" content="https://milo.adobe.com/img/open-graph.png"> <meta property="og:image:secure_url" content="https://milo.adobe.com/img/open-graph.png"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title" content="CC on load pdf load :"> <meta name="twitter:image" content="https://milo.adobe.com/img/open-graph.png"> <meta name="google-site-verification" content="221gU8RtSWQt6JEOrXklgArOcUYtyI2syoQVMKv2nxg"> <meta name="robots" content="noindex, nofollow"> <meta name="access-control-allow-origin" content="*"> <meta name="header" content="global-navigation"> <meta name="footer" content="global-footer"> <meta name="nofollow-links" content="on"> <meta name="-chat-tab" content="https://main--milo--adobecom.hlx.page/fragments/cmillar/chat-tab"> <meta name="promocode" content="promobase"> <meta name="breadcrumbs-seo" content="off"> <meta name="viewport" content="width=device-width, initial-scale=1"> <script src="/libs/scripts/scripts.js" type="module" crossorigin="use-credentials"></script> <link rel="stylesheet" href="/libs/styles/styles.css"> <link rel="icon" href="data:," size="any"> </head> <body> <header></header> <main> <div> <p>CC on load pdf load :</p> <p><a href="https://www.adobe.com/content/dam/cc/en/corporate-responsibility/pdfs/#_dnb/Adobe-CSR-Report-2022.pdf">https://www.adobe.com/content/dam/cc/en/corporate-responsibility/pdfs/Adobe-CSR-Report-2022.pdf</a></p> <p>CC on click button in new tab :</p> <p><em><strong><a href="https://www.adobe.com/content/dam/cc/en/corporate-responsibility/#_dnb/pdfs/Adobe-CSR-Report-2022.pdf">Buy now</a></strong></em></p> <p>CC on click button in same tab</p> <p><strong><a href="https://www.adobe.com/content/dam/cc/en/corporate-responsibility/#_dnb/pdfs/Adobe-CSR-Report-2022.pdf">Download</a></strong></p> <p>DX</p> <p><a href="https://www.adobe.com/content/dam/dx/us/en/resources/#_dnb/reports/build-an-irresistible-commerce-experience/Build-an-Irresisitible-Commerce-Experience.pdf">https://www.adobe.com/content/dam/dx/us/en/resources/reports/build-an-irresistible-commerce-experience/Build-an-Irresisitible-Commerce-Experience.pdf</a></p> <p>CC</p> <p><a href="https://www.adobe.com/content/dam/cc/#_dnb/en/corporate-responsibility/pdfs/Adobe-CSR-Report-2022.pdf">https://www.adobe.com/content/dam/cc/en/corporate-responsibility/pdfs/Adobe-CSR-Report-2022.pdf</a></p> <div class="text legal"> <div> <div data-valign="middle"><strong>Terms and conditions text</strong> Lorem ipsum olor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div> </div> </div> <p><strong><a href="/assets/pdf/#_dnb/button-options.pdf">Download Pdf</a></strong></p> </div> </main> <footer></footer> </body> </html>',
    };
    window.fetch = await mockFetch({ payload });
    const objectsList = Array.from({ length: 1 }, (_, index) => ({ pathname: `trial${index + 1}` }));
    urls.value = objectsList;
    enableActionButton.value = true;
    const review = html`<${Actions} />`;
    render(review, document.body);
  });

  it('fragment is added to urls list when <Update Fragments and Assets> button is clicked', async () => {
    expect(urls.value.length).to.equal(1); // Before fragment is added only 1 URL is there
    const container = await waitForElement('.fgui-urls-heading-action');
    container.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(urls.value.length).to.equal(2); // After fragment is added 2 URLs are there
    expect(fragmentStatusCheck.value).to.equal('IN PROGRESS');
  });
});

describe('Other action buttons', () => {
  it('fragment status should be COMPLETED after excel is updated', async () => {
    const payload = {
      urls: {
        data: [
          { url: 'https://example.com/image1.jpg' },
          { url: 'https://example.com/image2.jpg' },
        ],
      },
      preview: { url: 'example.com' },
    };
    window.fetch = await mockFetch({ payload });
    updateExcelJson();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(fragmentStatusCheck.value).to.equal('COMPLETED');
  });

  it('Open confirmation modal on button click for Promote Action', async () => {
    const review = html`<${ConfirmationModal}
    actionName="Promote Files"
    confirmMessage="Promote"
    showRadioButtons=${true}
    />`;
    render(review, document.body);
    const action = document.querySelectorAll('.fgui-urls-heading-action');
    action[0].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('fg-modal');
    expect(modalOverlay).to.exist;
    expect(modalContent).to.exist;
    expect(modalOverlay.style.display).to.not.equal('none');
    const confirmMessageText = modalContent.querySelector('p').innerText;
    expect(confirmMessageText).to.equal('Confirm Promote');
    // Check if the "Promote and Publish Promoted Pages" option is present
    const promotePublishOption = modalContent.querySelector('input[value="promotePublish"]');
    const promotePublishLabel = modalContent.querySelector('label[for="promotePublish"]');
    expect(promotePublishOption).to.exist;
    expect(promotePublishLabel).to.exist;
    expect(promotePublishOption.checked).to.be.false;
  });

  it('Open confirmation modal on button click for Delete Action', async () => {
    const review = html`<${ConfirmationModal}
    actionName="Delete"
    confirmMessage="Delete"
    showRadioButtons=${false}
    />`;
    render(review, document.body);
    const action = document.querySelectorAll('.fgui-urls-heading-action');
    action[0].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('fg-modal');
    expect(modalOverlay).to.exist;
    expect(modalContent).to.exist;
    expect(modalOverlay.style.display).to.not.equal('none');
    const confirmMessageText = modalContent.querySelector('p').innerText;
    expect(confirmMessageText).to.equal('Confirm Delete');
    const promotePublishOption = modalContent.querySelector('input[value="promotePublish"]');
    const promotePublishLabel = modalContent.querySelector('label[for="promotePublish"]');
    expect(promotePublishOption).to.not.exist;
    expect(promotePublishLabel).to.not.exist;
  });
});