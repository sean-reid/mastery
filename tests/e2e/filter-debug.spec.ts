import { test } from '@playwright/test';

test('polyrhythm tapper initial state', async ({ page }) => {
  await page.goto('/mastery', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.locator('#polyrhythm-tapper').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/poly-initial.png' });
});
