// @ts-nocheck
import Sinon from 'sinon';

const ogLana = window.lana;

export function mockLana() {
  window.lana = {
    log: Sinon.spy(),
  }
}

export function unmockLana() {
  window.lana = ogLana;
}
