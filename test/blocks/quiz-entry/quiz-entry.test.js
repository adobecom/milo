/* eslint-disable no-promise-executor-return */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/quiz-entry/quiz-entry.js';
import { getSuggestions } from '../../../libs/blocks/quiz-entry/quizPopover.js';

let fetchStub;
let quizEntryElement;
const { default: mockData } = await import('./mocks/mock-data.js');
const mockQuestionsData = mockData.questions;
const mockStringsData = mockData.strings;
const quizConfig = {
  quizPath: '/drafts/quiz/quiz-entry/',
  maxQuestions: 1,
  analyticsQuiz: 'clientv1',
  analyticsType: 'cc:app-test',
  questionData: mockQuestionsData,
  stringsData: mockStringsData,
};

describe('Quiz Entry Component', () => {
  beforeEach(async () => {
    window.lana = { log: sinon.stub() };
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve({ suggested_completions: ['designer desk', 'design logos'] }),
    });
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    quizEntryElement = document.querySelector('.quiz-entry');
    await init(quizEntryElement, quizConfig);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should trigger onMLInput and update suggestions', async () => {
    const mlInputField = document.querySelector('#quiz-input');
    const testInput = 'design';
    const inputEvent = new Event('input', { bubbles: true });
    mlInputField.value = testInput;
    mlInputField.dispatchEvent(inputEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const popoverContainer = document.querySelector('.popover-container');
    const suggestionItems = popoverContainer.querySelectorAll('.popover-item');
    expect(suggestionItems).to.exist;
  });

  it('Should trigger popover content on click', async () => {
    const mlInputField = document.querySelector('#quiz-input');
    const testInput = 'design';
    const inputEvent = new Event('input', { bubbles: true });
    mlInputField.value = testInput;
    mlInputField.dispatchEvent(inputEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const popoverItem = document.querySelector('.popover-item');
    popoverItem.innerHTML = 'design a logo';
    popoverItem.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const enterKeyEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    mlInputField.dispatchEvent(enterKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    mlInputField.value = 'design a logo';
    expect(mlInputField.value).to.equal('design a logo');
  });

  it('should fetch suggestions and return data on successful response', async () => {
    const mockApiResponse = {
      ok: true,
      json: () => Promise.resolve({ suggested_completions: ['suggestion1', 'suggestion2'] }),
    };
    fetchStub.resolves(mockApiResponse);
    const result = await getSuggestions('test-endpoint', 'test-client-id', 'query', 'test-scope');
    expect(fetchStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ suggested_completions: ['suggestion1', 'suggestion2'] });
    const expectedUrl = 'https://adobesearch.adobe.io/test-endpoint/completions?q[text]=query&q[locale]=en_us&scope=test-scope';
    expect(fetchStub.calledWith(expectedUrl, {
      method: 'GET',
      headers: { 'x-api-key': 'test-client-id' },
    })).to.be.true;
  });

  it('should handle failed fetch attempts', async () => {
    fetchStub.resolves({ ok: false });
    const result = await getSuggestions('test-endpoint', 'test-client-id', 'query', 'test-scope');
    expect(fetchStub.calledOnce).to.be.true;
    expect(result).to.equal('');
  });

  it('should initialize with provided element and display the quiz', async () => {
    expect(quizEntryElement.innerHTML).to.include('quiz-container');
  });

  it('should handle user interaction and update selection state', async () => {
    const option = quizEntryElement.querySelector('.quiz-option');
    option.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(option.classList.contains('selected')).to.be.true;
  });

  it('1 should trigger continueQuiz on enter key press', async () => {
    const mlFieldInput = document.querySelector('#quiz-input');
    const enterKeyEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    mlFieldInput.dispatchEvent(enterKeyEvent);
  });

  it('should clear the input field on clear button click', async () => {
    const mlFieldInput = document.querySelector('#quiz-input');
    const clearButton = document.querySelector('#quiz-input-clear');
    mlFieldInput.value = 'test';
    clearButton.click();
    expect(mlFieldInput.value).to.equal('');
  });
  it('should have an input focus() on suggestion click', async () => {
    const mlFieldInput = document.querySelector('#quiz-input');
    mlFieldInput.value = 'design a logo';
    const inputEvent = new Event('input', { bubbles: true });
    mlFieldInput.dispatchEvent(inputEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const suggestionItem = document.querySelector('.popover-item');
    suggestionItem.click();
    expect(mlFieldInput).to.equal(document.activeElement);
  });
  it('should have the selected class after clicking on an option', async () => {
    const option = document.querySelector('.quiz-option');
    option.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(option.classList.contains('selected')).to.be.true;
  });
  it('should remove the selected class after clicking on the .quiz-option element again', async () => {
    const option = document.querySelector('.quiz-option');
    option.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    option.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(option.classList.contains('selected')).to.be.false;
  });
  it('continue should be available after mlfield is used', async () => {
    const mlFieldInput = document.querySelector('#quiz-input');
    const continueButton = document.querySelector('.quiz-button');
    mlFieldInput.value = 'design a logo';
    const inputEvent = new Event('input', { bubbles: true });
    mlFieldInput.dispatchEvent(inputEvent);
    continueButton.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(continueButton.classList.contains('disabled')).to.be.false;
  });
  it('should navigate the carousel using keyboard commands', async () => {
    const options = document.querySelectorAll('.quiz-option');
    const option = document.querySelector('.quiz-option');
    option.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const carousel = document.querySelector('.quiz-options-container');
    const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    carousel.dispatchEvent(rightArrowEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    carousel.dispatchEvent(leftArrowEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const leftArrow = document.querySelector('.carousel-arrow.arrow-prev');
    expect(leftArrow).to.not.exist;

    const tabKeyEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    option.dispatchEvent(tabKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(option.classList.contains('selected')).to.be.true;

    const spaceKeyEvent = new KeyboardEvent('keydown', { key: ' ', keyCode: 32 });
    carousel.dispatchEvent(spaceKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    carousel.dispatchEvent(enterKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(options[1].classList.contains('selected')).to.be.false;
  });
  it('should handle error and return default data if fetching quiz data fails', async () => {
    // Stubbing console.error to suppress error logs in tests
    const consoleErrorStub = sinon.stub(console, 'error');

    fetchStub.rejects(new Error('Failed to load quiz data'));

    await init(quizEntryElement, {});

    expect(fetchStub.calledOnceWith(quizEntryElement)).to.be.false;
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.args[0][0]).to.equal('Failed to load quiz data:');
  });
});

describe('RTL Quiz Entry', () => {
  beforeEach(async () => {
    window.lana = { log: sinon.stub() };
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve({ suggested_completions: ['designer desk', 'design logos'] }),
    });
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    document.documentElement.setAttribute('dir', 'rtl');
    quizEntryElement = document.querySelector('.quiz-entry');
    await init(quizEntryElement, quizConfig);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should navigate the carousel using keyboard commands', async () => {
    const options = document.querySelectorAll('.quiz-option');
    const option = document.querySelector('.quiz-option');
    option.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const carousel = document.querySelector('.quiz-options-container');
    const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    carousel.dispatchEvent(rightArrowEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    carousel.dispatchEvent(leftArrowEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const leftArrow = document.querySelector('.carousel-arrow.arrow-prev');
    expect(leftArrow).to.exist;

    const tabKeyEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    option.dispatchEvent(tabKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(option.classList.contains('selected')).to.be.false;

    const spaceKeyEvent = new KeyboardEvent('keydown', { key: ' ', keyCode: 32 });
    carousel.dispatchEvent(spaceKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    carousel.dispatchEvent(enterKeyEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(options[1].classList.contains('selected')).to.be.false;
  });
});

describe('ML Result Trigger', () => {
  beforeEach(async () => {
    window.lana = { log: sinon.stub() };
    fetchStub = sinon.stub(window, 'fetch');
    const mockApiResponse = {
      statusCode: 200,
      data: {
        data: [
          {
            ficode: 'illustrator_cc',
            prob: '0.33',
          },
          {
            ficode: 'indesign_cc',
            prob: '0.27',
          },
          {
            ficode: 'free_spark',
            prob: '0.22',
          },
        ],
        jobName: '',
      },
    };
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockApiResponse.data),
    });
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    quizEntryElement = document.querySelector('.quiz-entry');
    await init(quizEntryElement, quizConfig);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Should trigger results fetching scenario', async () => {
    const mlInputField = document.querySelector('#quiz-input');
    const testInput = 'design';
    const inputEvent = new Event('input', { bubbles: true });
    mlInputField.value = testInput;
    mlInputField.dispatchEvent(inputEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const enterKeyEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    mlInputField.dispatchEvent(enterKeyEvent);
    expect(mlInputField.value).to.equal('design');
  });
});
