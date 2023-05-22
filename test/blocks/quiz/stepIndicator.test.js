import { expect } from '@esm-bundle/chai';
import objectToHTML from '../../helpers/createHTML.js';

async function initStepIndicator(currentStep, totalSteps, prevStepIndicator) {
  const { default: init } = await import('../../../libs/blocks/quiz/stepIndicator.js');
  const indicatorObj = init({ currentStep, totalSteps, prevStepIndicator });
  const indicatorHTML = objectToHTML(indicatorObj);
  document.body.innerHTML = indicatorHTML;
}

describe('StepIndicator', () => {
  before(async () => {
    await initStepIndicator(1, 3, [0]);
  });

  it('Renders the step indicator component', async () => {
    await initStepIndicator(1, 3, [0]);
    expect(document.querySelector('.dot-indicators')).to.exist;
  });

  it('Renders the correct number of dots (between both initial indicators)', async () => {
    await initStepIndicator(1, 3, [0]);
    expect(document.querySelectorAll('.dot').length).to.equal(3);
  });

  it('Sets the first dot as current in the initial state', async () => {
    await initStepIndicator(1, 3, [0]);
    expect(document.querySelector('.dot.current')).to.exist;
  });

  it('Updates the current dot when currentStep changes', async () => {
    await initStepIndicator(1, 3, [0]);
    expect(document.querySelectorAll('.dot')[1].classList.contains('current')).to.be.true;
  });

  it('Updates the previous dots when currentStep changes', async () => {
    expect(document.querySelectorAll('.dot')[0].classList.contains('prev')).to.be.true;
  });
});
