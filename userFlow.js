const { chromium } = require('playwright');

module.exports = async function userFlow(userId) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const startTime = Date.now();

  const result = {
    userId,
    status: 'unknown',
    durationMs: 0,
    timestamp: new Date().toISOString(),
    error: null,
    actions: [],
    url: 'http://localhost:8080/test-page.html',
  };

  // Simulate a forced error in 10% of the users
  const shouldFail = Math.random() < 0.1;
  const failType = Math.floor(Math.random() * 3); // Choose a failure type

  try {
    console.log(`[User ${userId}] Navigating to test page...`);
    await page.goto(result.url, { waitUntil: 'domcontentloaded' });

    console.log(`[User ${userId}] Typing into search box...`);
    if (shouldFail && failType === 0) {
      await page.fill('#wrongSearchBox', 'Artificial Intelligence'); // Wrong selector
      result.actions.push('❌ Tried typing into #wrongSearchBox (does not exist)');
    } else {
      await page.fill('#searchBox', 'Artificial Intelligence');
      result.actions.push('✔ Filled search box');
    }

    if (!(shouldFail && failType === 1)) {
      await page.click('#searchBtn');
      result.actions.push('✔ Clicked Search button');
      await page.waitForSelector('#results');
      result.actions.push('✔ Verified search results');
    } else {
      result.actions.push('❌ Skipped clicking Search button (intentional)');
    }

    console.log(`[User ${userId}] Clicking Accept Terms checkbox...`);
    await page.check('#termsCheckbox');
    result.actions.push('✔ Checked Accept Terms');

    if (shouldFail && failType === 2) {
      console.log(`[User ${userId}] Selecting a fake topic...`);
      await page.selectOption('#topicSelect', 'fake-option'); // Doesn't exist
      result.actions.push('❌ Selected non-existent topic');
    } else {
      await page.selectOption('#topicSelect', 'ai');
      result.actions.push('✔ Selected topic AI');
    }

    console.log(`[User ${userId}] Opening Help modal...`);
    await page.click('#helpBtn');

    if (!(shouldFail && failType === 3)) {
        // Timeout for modal to appear is set to 3 seconds
      await page.waitForSelector('#modal', { timeout: 3000 });
      result.actions.push('✔ Opened Help modal');
    } else {
      result.actions.push('❌ Skipped waiting for modal (intentional)');
    }

    if (shouldFail) {
      throw new Error('Simulated failure for test coverage');
    }

    result.status = 'success';
    console.log(`[User ${userId}] All steps passed ✅`);
  } catch (e) {
    result.status = 'fail';
    result.error = e.message;
    console.error(`[User ${userId}] Failed ❌ — ${e.message}`);
  } finally {
    result.durationMs = Date.now() - startTime;
    await browser.close();
    return result;
  }
};
