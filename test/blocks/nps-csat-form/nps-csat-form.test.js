import { expect } from '@esm-bundle/chai';
import { ACK, CANCEL, MSG_TIMEOUT } from '../../../libs/blocks/nps-csat-form/nps-csat-form.js';

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

const recieveMessage = (timeoutMessage) => new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    if (timeoutMessage) reject(new Error(timeoutMessage));
  }, MSG_TIMEOUT);
  const handler = (event) => {
    clearTimeout(timeout);
    const message = (() => {
      try {
        return JSON.parse(event.data);
      } catch (e) {
        reject(new Error(`Failed to parse message: ${e.message}`));
      }
      return '';
    })();
    resolve(message);
  };
  window.addEventListener('message', handler, { once: true });
});
const sendMessageToIframe = (iframe, message) => {
  iframe.contentWindow.postMessage(JSON.stringify(message), '*');
};

// Helper to verify no message is received within a short timeout
const expectNoMessage = (timeoutMs = 300) => new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    resolve(); // No message received - this is what we expect
  }, timeoutMs);

  const handler = (event) => {
    clearTimeout(timeout);
    try {
      const message = JSON.parse(event.data);
      reject(new Error(`Unexpected message received: ${JSON.stringify(message)}`));
    } catch (e) {
      reject(new Error(`Unexpected message received: ${event.data}`));
    }
  };

  window.addEventListener('message', handler, { once: true });
});

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
      expect(errorMessage.errorType).to.equal('timeoutErr');
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

    it('should send Error message for unrecognized message types', async () => {
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
      expect(errorMessage.errorType).to.equal('unrecognizedType');
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

  describe('State Machine Behavior', () => {
    describe('Initial State Transitions', () => {
      it('should start in STATE_BASE and transition to STATE_EXPECT_ACK when sending Ready message', async () => {
        // Initialize form - this sends Ready message and transitions to STATE_EXPECT_ACK
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);

        // At this point, state should be STATE_EXPECT_ACK
        // Any unexpected message should trigger an error
        sendMessageToIframe(iframe, { type: 'Submit', data: {} });

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        expect(errorMessage.errorType).to.equal('unexpectedType');
      });

      it('should transition from STATE_EXPECT_ACK to STATE_BASE when receiving Acknowledged', async () => {
        // Initialize form
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);

        // Send ACK to transition back to STATE_BASE
        sendMessageToIframe(iframe, ACK);

        // Now we should be in STATE_BASE - Ready/Submit messages should be ignored
        // Send a Ready message - it should be ignored (no response)
        sendMessageToIframe(iframe, { type: 'Ready' });

        // Verify no message is received (Ready should be ignored in STATE_BASE)
        await expectNoMessage();
      });
    });

    describe('Cancel Message State Transitions', () => {
      it('should transition to STATE_EXPECT_ACK when sending Cancel message', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Click cancel button - this sends Cancel message and transitions to STATE_EXPECT_ACK
        const cancelButton = block.querySelector('.nps-cancel');
        cancelButton.click();

        const cancelMessage = await recieveMessage();
        expect(cancelMessage.type).to.equal(Cancel);

        // State should now be STATE_EXPECT_ACK
        // Sending unexpected message should trigger error (need to send quickly before timeout)
        sendMessageToIframe(iframe, { type: 'Submit', data: {} });

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        // The error could be either 'unexpectedType'
        // if processed before timeout, or 'timeoutErr' if timeout fires first
        expect(['unexpectedType', 'timeoutErr']).to.include(errorMessage.errorType);
      });

      it('should handle parent Cancel message and transition states correctly', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Send Cancel from parent - should respond with ACK and stay in STATE_BASE
        sendMessageToIframe(iframe, CANCEL);

        const ackMessage = await recieveMessage();
        expect(ackMessage.type).to.equal(Acknowledged);

        // Should still be in STATE_BASE - Ready/Submit messages should be ignored
        sendMessageToIframe(iframe, { type: 'Ready' });

        // Verify no message is received (Ready should be ignored in STATE_BASE)
        await expectNoMessage();
      });
    });

    describe('Timeout State Transitions', () => {
      it('should transition from STATE_EXPECT_ACK to STATE_BASE on timeout', async () => {
        // Initialize form but don't send ACK
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);

        // Wait for timeout error
        const timeoutError = await recieveMessage();
        expect(timeoutError.type).to.equal(ErrorMsg);
        expect(timeoutError.errorType).to.equal('timeoutErr');

        // After timeout, should be back in STATE_BASE
        // Ready/Submit messages should be ignored
        sendMessageToIframe(iframe, { type: 'Ready' });

        // Verify no message is received (Ready should be ignored in STATE_BASE)
        await expectNoMessage();
      });

      it('should clear timeout when receiving Acknowledged in STATE_EXPECT_ACK', async () => {
        // Initialize form
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);

        // Send ACK before timeout
        sendMessageToIframe(iframe, ACK);

        // Wait longer than timeout period to ensure no timeout error occurs
        // Use expectNoMessage to verify no timeout error is sent
        await expectNoMessage(MSG_TIMEOUT + 200);
      });
    });

    describe('Message Validation in Different States', () => {
      it('should handle malformed JSON in any state', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Send malformed JSON
        iframe.contentWindow.postMessage('invalid json{', '*');

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        expect(errorMessage.errorType).to.equal('malformedJSON');
      });

      it('should handle messages with missing type property', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Send message without type
        sendMessageToIframe(iframe, { data: 'some data' });

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        expect(errorMessage.errorType).to.equal('missingType');
      });

      it('should handle unrecognized message types in STATE_BASE', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Send unrecognized message type
        sendMessageToIframe(iframe, { type: 'UnknownType' });

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        expect(errorMessage.errorType).to.equal('unrecognizedType');
      });

      it('should ignore Ready and Submit messages in STATE_BASE', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Send Ready message - should be ignored
        sendMessageToIframe(iframe, { type: 'Ready' });

        // Send Submit message - should be ignored
        sendMessageToIframe(iframe, { type: 'Submit', data: {} });

        // Verify no response is received for ignored messages
        await expectNoMessage();
      });

      it('should send unexpected type error for Ready/Submit messages in STATE_EXPECT_ACK', async () => {
        // Initialize form (now in STATE_EXPECT_ACK)
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);

        // Send Ready message while expecting ACK
        sendMessageToIframe(iframe, { type: 'Ready' });

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        expect(errorMessage.errorType).to.equal('unexpectedType');
      });
    });

    describe('State Persistence During Message Handling', () => {
      it('should maintain STATE_EXPECT_ACK after sending error messages', async () => {
        // Initialize form (now in STATE_EXPECT_ACK)
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);

        // Send unrecognized message - should get error but stay in STATE_EXPECT_ACK
        sendMessageToIframe(iframe, { type: 'UnknownType' });

        const errorMessage = await recieveMessage();
        expect(errorMessage.type).to.equal(ErrorMsg);
        expect(errorMessage.errorType).to.equal('unrecognizedType');

        // Should still be in STATE_EXPECT_ACK - sending Ready should trigger unexpected type error
        sendMessageToIframe(iframe, { type: 'Ready' });

        const unexpectedError = await recieveMessage();
        expect(unexpectedError.type).to.equal(ErrorMsg);
        expect(unexpectedError.errorType).to.equal('unexpectedType');
      });

      it('should handle Error messages without state change', async () => {
        // Initialize and acknowledge
        await iframeWindow.npsCsatForm(block);
        const readyMessage = await recieveMessage();
        expect(readyMessage.type).to.equal(Ready);
        sendMessageToIframe(iframe, ACK);

        // Send Error message - should be handled without state change
        sendMessageToIframe(iframe, { type: 'Error', message: 'Test error' });

        // Should remain in STATE_BASE - Ready/Submit should be ignored
        sendMessageToIframe(iframe, { type: 'Ready' });

        // Verify no response is received for ignored Ready message
        await expectNoMessage();
      });
    });
  });
});
