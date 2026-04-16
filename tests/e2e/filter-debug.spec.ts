import { test, expect } from '@playwright/test';

test('infinite scroll: initial load shows ~15 cards', async ({ page }) => {
  await page.goto('/mastery', { waitUntil: 'networkidle' });

  const visible = await page.evaluate(() => {
    const cards = document.querySelectorAll('.skill-card');
    let vis = 0, hid = 0;
    cards.forEach(c => {
      if ((c as HTMLElement).style.display === 'none') hid++;
      else vis++;
    });
    return { vis, hid, total: cards.length };
  });

  console.log(`Initial: ${visible.vis} visible, ${visible.hid} hidden, ${visible.total} total`);
  expect(visible.vis).toBe(15);
  expect(visible.hid).toBe(85);
});

test('infinite scroll: scrolling to sentinel reveals more cards', async ({ page }) => {
  await page.goto('/mastery', { waitUntil: 'networkidle' });

  // Scroll the sentinel into view (it's right after the last visible card)
  await page.evaluate(() => {
    const sentinel = document.querySelector('.scroll-sentinel');
    if (sentinel) sentinel.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  const afterScroll = await page.evaluate(() => {
    const cards = document.querySelectorAll('.skill-card');
    let vis = 0;
    cards.forEach(c => {
      if ((c as HTMLElement).style.display !== 'none') vis++;
    });
    return vis;
  });

  console.log(`After scrolling to sentinel: ${afterScroll} visible`);
  expect(afterScroll).toBeGreaterThan(15);
});

test('infinite scroll: category filter bypasses limit', async ({ page }) => {
  await page.goto('/mastery', { waitUntil: 'networkidle' });

  await page.locator('.nav-pill[data-category="game"]').click();
  await page.waitForTimeout(500);

  const gameCards = await page.evaluate(() => {
    let vis = 0;
    document.querySelectorAll('.skill-card').forEach(c => {
      const el = c as HTMLElement;
      if (el.style.display !== 'none' && el.dataset.category === 'game') vis++;
    });
    return vis;
  });

  console.log(`Games visible: ${gameCards}`);
  expect(gameCards).toBe(9);
});
