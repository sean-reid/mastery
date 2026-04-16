import { test } from '@playwright/test';

test('zellige pattern', async ({ page }) => {
  await page.goto('/mastery', { waitUntil: 'networkidle' });
  await page.locator('#pattern-builder').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/zellige-light.png' });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/zellige-dark.png' });
});
