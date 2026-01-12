// TC-01	Basic search returns results with mandatory fields

import { test } from '@playwright/test';
import { NewHomeSmoke } from './pages/NewHomeSmoke';

test('NHS flow: Home search -> WA -> 55 Plus -> results', async ({ page, browserName }) => {
  const nhs = new NewHomeSmoke(page);

  try {
    await nhs.openHome();                         // Part 1
    await nhs.searchWashingtonAndSelectResult();  // Part 2 (+ guard)
    await nhs.open55PlusAndValidateResults();     // Part 3 (+ guard)
    await nhs.scrollToBottom()
    
    
  } catch (e: any) {
    const msg = String(e?.message || e);

    // Same idea you had: chromium can be blocked more often by anti-bot on public sites
    if (browserName === 'chromium' && msg.includes('ANTI_BOT')) {
      test.skip(true, msg);
    }
    throw e;
  }
});
