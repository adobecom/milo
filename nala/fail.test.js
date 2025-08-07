import { expect, test } from '@playwright/test';

test('Fail test suite. @fail @nopr', () => {
  test('1. This one passes', async () => {
    console.log('This test will pass');
    expect(true).toBe(true);
  });

  test('2. Immediate failure test', async () => {
    console.log('This test will fail immediately');
    expect(true).toBe(false);
  });

  test('3. Timeout failure test', async ({ page }) => {
    console.log('This test will timeout');
    await page.goto('https://www.adobe.com');
    
    // This will timeout after 5 seconds
    await page.waitForSelector('.non-existent-element', { timeout: 5000 });
  });

  test('4. Assertion failure test', async () => {
    console.log('This test will fail on assertion');
    const result = 2 + 2;
    expect(result).toBe(5);
  });

  test('5. Error thrown test', async () => {
    console.log('This test will throw an error');
    throw new Error('Intentional test failure for debugging');
  });
});
