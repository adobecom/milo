import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { debounce } from '../../libs/utils/action.js';

describe('Action', () => {
  it('Debounces callback correctly', async () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });

    const header = document.createElement('h2');
    header.setAttribute('id', 'debounce');
    const setValue = () => {
      header.textContent = 'debounced!';
    };

    debounce(setValue, 300)();

    expect(header.textContent).to.equal('');
    clock.tick(100);
    expect(header.textContent).to.equal('');
    clock.tick(300);
    expect(header.textContent).to.equal('debounced!');
    header.remove();
    clock.restore();
  });
});
