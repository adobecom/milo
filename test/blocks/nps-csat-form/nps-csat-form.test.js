import { expect } from '@esm-bundle/chai';
import { waitForElement, delay } from '../../helpers/waitfor.js';
import { ACK, CANCEL, ERROR, READY, recieveMessage, SUBMIT } from '../../../libs/blocks/nps-csat-form/nps-csat-form.js';

// Message constants for testing
const Ready = 'Ready';
const Acknowledged = 'Acknowledged';
const Cancel = 'Cancel';
const Submit = 'Submit';
const ErrorMsg = 'Error';

// Helper function to create an iframe with the NPS form
const createIframeWithForm = () => new Promise((resolve, reject) => {
  const iframe = document.createElement('iframe');
  iframe.style.width = '400px';
  iframe.style.height = '600px';
  iframe.style.border = '1px solid #ccc';

  iframe.onload = async () => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeWindow = iframe.contentWindow;

      // Create the block element inside iframe
      const block = iframeDoc.createElement('div');
      block.className = 'nps-csat-form';
      iframeDoc.body.appendChild(block);

      // Import and initialize the form inside iframe
      const moduleScript = iframeDoc.createElement('script');
      moduleScript.type = 'module';
      moduleScript.textContent = `
        import npsCsatForm from '/libs/blocks/nps-csat-form/nps-csat-form.js';
        window.npsCsatForm = npsCsatForm;
        window.formInitialized = true;
      `;
      iframeDoc.head.appendChild(moduleScript);

      // Wait for module to load
      const checkModule = () => {
        if (iframeWindow.formInitialized) {
          resolve({ iframe, iframeWindow, iframeDoc, block });
        } else {
          setTimeout(checkModule, 10);
        }
      };
      checkModule();
    } catch (error) {
      reject(error);
    }
  };
  iframe.onerror = reject;
  document.body.appendChild(iframe);
});

// Helper to send message to iframe
const sendMessageToIframe = (iframe, message) => {
  iframe.contentWindow.postMessage(JSON.stringify(message), '*');
};

describe('NPS CSAT Form - Message Handling', () => {
  let iframe;
  let iframeWindow;
  let block;

  before(async () => {
  });

  beforeEach(async () => {
    const iframeSetup = await createIframeWithForm();
    iframe = iframeSetup.iframe;
    iframeWindow = iframeSetup.iframeWindow;
    block = iframeSetup.block;
  });

  afterEach(() => {
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  });

  describe('Initial Ready Message and Acknowledgment Flow', () => {
    it('should send Ready message on initialization and wait for Ack', async () => {
      // Initialize the form in iframe
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      // Form should be fully initialized
      const form = block.querySelector('#nps');
      expect(form).to.exist;
    });

    it('should timeout and send Error message if no Ack received within timeout', async () => {
      // Initialize the form but don't send Ack
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);

      // Don't send Ack - wait for timeout
      const errorMessage = await recieveMessage();
      expect(errorMessage.type).to.equal(ErrorMsg);
      expect(errorMessage.message).to.include('Timeout waiting for ACK');
    });
  });

  describe('Parent Cancel Message Handling', () => {
    it('should respond with Ack when parent sends Cancel message', async () => {
      // Initialize form with proper Ack
      await iframeWindow.npsCsatForm(block);

      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      // Send Cancel message to iframe
      sendMessageToIframe(iframe, CANCEL);

      // Wait for Ack response
      const ackMessage = await recieveMessage();
      expect(ackMessage.type).to.equal(Acknowledged);
    });
  });

  describe('Form Submission Handling', () => {
    it('should send Submit message with form data when form is submitted', async () => {
      // Initialize form
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      const form = block.querySelector('#nps');
      const radioButton = form.querySelector('input[type="radio"]');
      const textarea = form.querySelector('#explanation-input');
      const checkbox = form.querySelector('#contact-me');

      // Fill out form
      radioButton.checked = true;
      textarea.value = 'Test feedback explanation';
      checkbox.checked = true;

      // Submit form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for Submit message
      const submitMessage = await recieveMessage();
      expect(submitMessage.type).to.equal(Submit);
      expect(submitMessage.data).to.deep.include({
        feedback: radioButton.value,
        explanation: 'Test feedback explanation',
        contactMe: true,
      });
    });

    it('should not submit and show error if no radio button is selected', async () => {
      // Initialize form
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      const form = block.querySelector('#nps');
      const radioGroup = block.querySelector('.nps-radio-group');

      // Try to submit without selecting radio
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Should show error state
      expect(radioGroup.classList.contains('show-error')).to.be.true;
      expect(block.classList.contains('submit-clicked')).to.be.true;
    });
  });

  describe('Cancel Button Handling', () => {
    it('should send Cancel message when cancel button is clicked', async () => {
      // Initialize form
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      const cancelButton = block.querySelector('.nps-cancel');

      // Click cancel button
      cancelButton.click();

      // Wait for Cancel message
      const cancelMessage = await recieveMessage();
      expect(cancelMessage.type).to.equal(Cancel);
    });
  });

  describe('Error Handling', () => {
    it('should send Error message for invalid JSON in parent messages', async () => {
      // Initialize form
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      // Send invalid JSON
      iframe.contentWindow.postMessage('invalid json{', '*');

      // Wait for Error message
      const errorMessage = await recieveMessage();
      expect(errorMessage.type).to.equal(ErrorMsg);
    });

    it('should send Error message for unexpected message types', async () => {
      // Initialize form
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      // Send unexpected message type
      sendMessageToIframe(iframe, { type: 'UnexpectedType' });

      // Wait for Error message
      const errorMessage = await recieveMessage();
      expect(errorMessage.type).to.equal(ErrorMsg);
      expect(errorMessage.message).to.include('Unexpected Message');
    });
  });

  describe('Radio Button Error State Management', () => {
    it('should remove error state when radio button is selected after submission attempt', async () => {
      // Initialize form
      await iframeWindow.npsCsatForm(block);
      const readyMessage = await recieveMessage();
      expect(readyMessage.type).to.equal(Ready);
      sendMessageToIframe(iframe, ACK);

      const form = block.querySelector('#nps');
      const radioGroup = block.querySelector('.nps-radio-group');
      const radioButton = form.querySelector('input[type="radio"]');

      // Try to submit without selecting radio (to trigger error)
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(radioGroup.classList.contains('show-error')).to.be.true;

      // Now select a radio button
      radioButton.checked = true;
      const changeEvent = new Event('change', { bubbles: true });
      radioButton.dispatchEvent(changeEvent);

      // Error should be removed after radio button selection
      expect(radioGroup.classList.contains('show-error')).to.be.false;
    });
  });
});
