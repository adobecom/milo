# Debugging Three-in-One Modal Test Failures

## Overview

This guide helps debug the "Validate if modal reopens on back navigation" test that passes locally but fails in production.

## Common Production Issues

### 1. **Timing Issues**
- **Problem**: Modal state management has race conditions in production
- **Symptoms**: Modal doesn't reopen after navigation
- **Debug Steps**:
  - Check if `updateModalState()` is called correctly
  - Verify `popstate` event handling
  - Monitor hash changes

### 2. **Environment Differences**
- **Problem**: Different browser versions, network conditions, or CDN caching
- **Symptoms**: Inconsistent behavior between environments
- **Debug Steps**:
  - Compare browser versions
  - Check network latency
  - Verify CDN cache headers

### 3. **Resource Loading Issues**
- **Problem**: Modal dependencies (CSS, JS) fail to load in production
- **Symptoms**: Modal appears but doesn't function correctly
- **Debug Steps**:
  - Check network tab for failed requests
  - Verify iframe loading
  - Monitor console errors

## Debugging Steps

### Step 1: Run Enhanced Debug Test

```bash
# Run the production debug test
npm test -- --grep "@ProductionDebug"
```

### Step 2: Check Generated Artifacts

After a test failure, check for:
- `production-modal-failure.png` - Screenshot of failure state
- `production-modal-failure.html` - HTML at time of failure
- Console logs with `[DEBUG]` or `[PRODUCTION DEBUG]` prefixes

### Step 3: Analyze Modal State

Look for these key indicators in the logs:

```javascript
// Expected state after modal opens
{
  modalCount: 1,
  hash: "#modal-id",
  url: "https://test-page.com#modal-id"
}

// Expected state after navigation back
{
  modalCount: 1,
  hash: "#modal-id", 
  url: "https://test-page.com#modal-id"
}
```

### Step 4: Check Browser Console

Look for these error patterns:
- `TypeError: Cannot read property 'click' of null` - CTA not found
- `Error: Modal not found after X attempts` - Modal reopening failed
- Network errors for iframe content

## Common Fixes

### 1. **Increase Timeouts**

If timing is the issue, increase wait times:

```javascript
// In the test
await page.waitForTimeout(5000); // Increase from 2000
```

### 2. **Add Retry Logic**

For flaky tests, add retry mechanisms:

```javascript
// Use the waitForModalWithRetry method
const modal = await threeInOne.waitForModalWithRetry(15, 1000);
```

### 3. **Check Modal State Management**

Verify the modal state is properly managed:

```javascript
// Check if updateModalState is working
await page.evaluate(() => {
  console.log('Modal state:', window.modalState);
  console.log('Hash:', window.location.hash);
});
```

### 4. **Monitor Event Listeners**

Ensure event listeners are properly attached:

```javascript
// Check if popstate listener is active
await page.evaluate(() => {
  const listeners = getEventListeners(window, 'popstate');
  console.log('Popstate listeners:', listeners);
});
```

## Production-Specific Considerations

### 1. **CDN Caching**
- Production may have different caching behavior
- Check if modal resources are cached differently
- Verify cache headers

### 2. **Network Latency**
- Production environments may have higher latency
- Increase timeouts accordingly
- Add network condition simulation

### 3. **Browser Differences**
- Production may use different browser versions
- Check browser compatibility
- Test with different user agents

### 4. **Load Balancing**
- Production may route requests differently
- Check if requests go to different servers
- Verify session consistency

## Debugging Commands

### Run with Verbose Logging

```bash
# Enable detailed logging
DEBUG=* npm test -- --grep "three-in-one"
```

### Run with Specific Browser

```bash
# Test with specific browser
npx playwright test --project=chromium --grep "three-in-one"
```

### Run with Network Simulation

```bash
# Simulate slow network
npx playwright test --grep "three-in-one" --headed
```

## Monitoring and Alerting

### 1. **Set up Monitoring**
- Monitor test failure rates
- Track modal interaction success rates
- Alert on consistent failures

### 2. **Log Analysis**
- Parse debug logs for patterns
- Track timing distributions
- Identify common failure points

### 3. **Performance Metrics**
- Track modal load times
- Monitor iframe loading performance
- Measure navigation response times

## Next Steps

1. Run the enhanced debug test in production
2. Analyze the generated artifacts
3. Check for patterns in the debug logs
4. Implement fixes based on findings
5. Add monitoring for future issues

## Contact

For additional debugging support, check:
- Test logs in CI/CD pipeline
- Browser console logs
- Network request logs
- Performance monitoring data 
