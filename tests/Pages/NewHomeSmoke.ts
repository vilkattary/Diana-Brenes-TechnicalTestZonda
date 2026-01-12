import { expect, type Locator, type Page } from '@playwright/test';

export class NewHomeSmoke {
  readonly page: Page;

  // --- Anti-bot (PerimeterX) ---
  readonly captchaModal: Locator;
  readonly captchaButton: Locator;
  readonly pressHoldText: Locator;

  // --- Home search ---
  readonly searchInputDesktop: Locator;
  readonly resultsList: Locator;
  readonly firstResultItem: Locator;

  // --- WA landing ---
  readonly fiftyFivePlusLink: Locator;

  // --- Active adult results "proof loaded" ---
  readonly activeAdultTab: Locator;

  // --- Results cards (ANY type) ---
  readonly resultCards: Locator;
  readonly firstResultCard: Locator;

  // --- Mandatory-ish fields inside the first card ---
  readonly cardTitleLink: Locator;
  readonly cardAddress: Locator;
  readonly cardPrice: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Anti-bot (PerimeterX) ---
    this.captchaModal = page.locator('#px-captcha-modal');
    this.captchaButton = this.captchaModal.getByRole('button', {
      name: /press\s*&?\s*hold/i,
    });
    this.pressHoldText = page.getByText(/press\s*&?\s*hold to confirm you are/i);

    // --- Home search ---
    this.searchInputDesktop = page
      .getByRole('search', { name: /search text/i })
      .getByRole('textbox', { name: 'Search location or community' });

    this.resultsList = page.locator('[data-search-results-list]').first();
    this.firstResultItem = this.resultsList.locator('[data-search-bar-result-item]').first();

    // --- WA landing (55 Plus Communities) ---
    this.fiftyFivePlusLink = page.getByRole('link', { name: /55\s*plus/i });

    // --- Active adult results "proof loaded" ---
    this.activeAdultTab = page.locator('#nhs_ResTabBar #nhs_SearchTab.nhs_Active');

    // --- Results cards (ANY type) ---
    this.resultCards = page.locator('.result');
    this.firstResultCard = this.resultCards.first();

    // --- Mandatory-ish fields inside the first card ---
    this.cardTitleLink = this.firstResultCard.locator('h3.info__name a.info__link');
    this.cardAddress = this.firstResultCard.locator('.info__address');
    this.cardPrice = this.firstResultCard.locator('.info__price');
  }

  // -----------------------------
  // Shared: run on each new URL
  // -----------------------------
  async ensureCaptchaCleared() {
    const blocked = await this.pressHoldText.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!blocked) return;

    const hasButton = await this.captchaButton.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasButton) throw new Error('ANTI_BOT: Press & Hold visible but button not found.');

    await this.captchaButton.scrollIntoViewIfNeeded();
    await this.captchaButton.hover();

    await this.captchaButton.dispatchEvent('pointerdown', { pointerId: 1, buttons: 1 });
    await this.page.waitForTimeout(2500);
    await this.captchaButton.dispatchEvent('pointerup', { pointerId: 1, buttons: 0 });

    const stillBlocked = await this.pressHoldText.isVisible({ timeout: 2_000 }).catch(() => false);
    if (stillBlocked) {
      throw new Error('ANTI_BOT: Press & Hold still blocks the page after interaction.');
    }
  }

  async gotoAndGuard(urlOrPath: string) {
    await this.page.goto(urlOrPath, { waitUntil: 'domcontentloaded' });
    await this.ensureCaptchaCleared();
  }

  async waitForNavigationAndGuard() {
    await this.page.waitForLoadState('domcontentloaded');

    // Re-check captcha for a short window because it can appear after domcontentloaded
    const deadline = Date.now() + 12_000;

    while (Date.now() < deadline) {
      const blocked = await this.pressHoldText.isVisible({ timeout: 500 }).catch(() => false);
      if (!blocked) return;

      await this.ensureCaptchaCleared();

      // after interaction, give the page a moment to swap back
      await this.page.waitForLoadState('domcontentloaded');
    }

    // If we reach here, captcha kept reappearing or never cleared
    throw new Error('ANTI_BOT: Challenge kept blocking the page after repeated attempts.');
  }

  /**
   * Gate for the results page:
   * - If captcha appears late, it tries to clear it.
   * - Waits until either the "active tab" OR at least one result card is visible.
   */
  private async waitForResultsPageReady() {
    const deadline = Date.now() + 30_000;

    while (Date.now() < deadline) {
      const blocked = await this.pressHoldText.isVisible({ timeout: 500 }).catch(() => false);
      if (blocked) {
        await this.ensureCaptchaCleared();
        await this.page.waitForLoadState('domcontentloaded');
        continue;
      }

      const tabReady = await this.activeAdultTab.isVisible({ timeout: 500 }).catch(() => false);
      const cardReady = await this.resultCards.first().isVisible({ timeout: 500 }).catch(() => false);

      if (tabReady || cardReady) return;

      await this.page.waitForTimeout(250);
    }

    throw new Error(
      `ANTI_BOT: Results page never became ready (captcha or content not loaded). URL: ${this.page.url()}`
    );
  }

  // -----------------------------
  // Part 1: open home and find search box
  // -----------------------------
  async openHome() {
    await this.gotoAndGuard('/'); // baseURL should be https://www.newhomesource.com
    await expect(this.searchInputDesktop).toBeVisible({ timeout: 15_000 });
  }

  // -----------------------------
  // Part 2: type “Washington” and click the first result
  // -----------------------------
  async searchWashingtonAndSelectResult() {
    await this.searchInputDesktop.click();
    await this.searchInputDesktop.fill('washington');

    await expect(this.resultsList).toBeVisible({ timeout: 10_000 });
    await expect(this.firstResultItem).toBeVisible({ timeout: 10_000 });

    await this.firstResultItem.click();
    await this.waitForNavigationAndGuard();
  }

  // -----------------------------
  // Part 3: click “55 Plus Communities” and validate at least 1 result card
  // -----------------------------
  async open55PlusAndValidateResults() {
    const isWaState = /\/state\/washington/i.test(this.page.url());
    if (!isWaState) {
      throw new Error(
        `FLOW: First search result did not navigate to /state/washington. Current URL: ${this.page.url()}`
      );
    }

    await expect(this.fiftyFivePlusLink).toBeVisible({ timeout: 15_000 });
    await this.fiftyFivePlusLink.click();

    await this.waitForNavigationAndGuard();

    await expect(this.page).toHaveURL(/\/state\/washington\/active-adult/i, { timeout: 15_000 });

    // ✅ Gate: clears late captcha + waits for page to be "ready"
    await this.waitForResultsPageReady();

    // ✅ Proof loaded: first result card is visible
    await expect(this.resultCards.first()).toBeVisible({ timeout: 20_000 });


    // ✅ Anchor: wait for first card, then count
    await expect(this.resultCards.first()).toBeVisible({ timeout: 20_000 });

    const count = await this.resultCards.count();
    if (count === 0) {
      throw new Error('SMOKE: Results page loaded but no result cards were found');
    }

    await this.validateFirstResultCard();
  }

  // -----------------------------
  // Controlled validation helpers
  // -----------------------------
  private async assertVisibleOrFail(locator: Locator, message: string) {
    const visible = await locator.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!visible) throw new Error(`SMOKE CARD VALIDATION FAILED: ${message}`);
  }

  async validateFirstResultCard() {
    const cardVisible = await this.firstResultCard.isVisible({ timeout: 10_000 }).catch(() => false);
    if (!cardVisible) {
      throw new Error('SMOKE: No result card found on Active Adult results page');
    }

    // Title link
    await this.assertVisibleOrFail(this.cardTitleLink, 'Result card is missing TITLE link');

    const href = await this.cardTitleLink.getAttribute('href');
    if (!href || !/\/(community|plan|spec)\//i.test(href)) {
      throw new Error(
        `SMOKE CARD VALIDATION FAILED: Title link has invalid or missing href (${href ?? 'null'})`
      );
    }

    // Address
    await this.assertVisibleOrFail(this.cardAddress, 'Result card is missing ADDRESS');

    // Price
    await this.assertVisibleOrFail(this.cardPrice, 'Result card is missing PRICE');

    const priceText = (await this.cardPrice.textContent())?.trim() ?? '';
    if (!/\$/.test(priceText)) {
      throw new Error(
        `SMOKE CARD VALIDATION FAILED: Price field exists but does not contain "$" ("${priceText}")`
      );
    }
  }

  // (Optional) if you still want the scroll helper later
  async scrollToBottom() {
    await this.page.waitForLoadState('domcontentloaded');

    await this.page.evaluate(async () => {
      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

      let lastHeight = 0;
      for (let i = 0; i < 20; i++) {
        window.scrollBy(0, Math.max(300, Math.floor(window.innerHeight * 0.8)));
        await delay(200);

        const newHeight = document.documentElement.scrollHeight;
        if (newHeight === lastHeight) break;
        lastHeight = newHeight;
      }

      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  }
}
