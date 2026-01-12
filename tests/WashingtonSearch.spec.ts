// TC-08	Combined filters update results

import { test, expect } from '@playwright/test';
import { WashingtonSearchPage } from './pages/WashingtonSearchPage';

test('WA filter: price range + beds/baths updates results', async ({ page }) => {
  const wa = new WashingtonSearchPage(page);

await test.step('Open Washington Active Adult search page', async () => {
  await wa.open();
});

await test.step('Apply Beds & Baths filter (3 beds, 2 baths)', async () => {
  await wa.applyBedsBaths(3, 2);
});

await test.step('Apply Price filter (min 400,000 – max 700,000)', async () => {
  await wa.applyPriceRange(400000, 700000);
});

await test.step('Validate top results are within the selected price range', async () => {
  await wa.expectTopResultsWithinPriceRange(400000, 700000, 2);
});


});