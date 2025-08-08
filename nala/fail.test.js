import { expect, test } from '@playwright/test';

test.describe('Fail test suite', () => {
  test('1. Immediate failure test, @fail', async () => {
    console.log('This test will fail immediately');
    expect(true).toBe(false);
  });

});
