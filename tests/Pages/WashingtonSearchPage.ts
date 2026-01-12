import { expect, type Locator, type Page } from '@playwright/test';

export class WashingtonSearchPage {
  readonly page: Page;

  // --- Results ---
  readonly resultCards: Locator;
  readonly firstCardTitle: Locator;

  // --- Facet triggers (the clickable "expansible") ---
  readonly priceFacet: Locator;
  readonly bedsBathsFacet: Locator;

  // --- Price inputs ---
   readonly priceMinInput: Locator;
   readonly priceMaxInput: Locator;

  // --- Beds/Baths labels (we'll click labels by text like "2+") ---
  readonly bedroomsFieldset: Locator;
  readonly bathroomsFieldset: Locator;

  // --- Apply/Update ---
  readonly updateButton: Locator;

  // captcha
  readonly captchaModal: Locator;
  readonly captchaButton: Locator;
  readonly pressHoldText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Results
    this.resultCards = page.locator('.result');
    this.firstCardTitle = this.resultCards.first().locator('h3 a');

    // Facets
    // this.priceFacet = page.locator('.expansible', { has: page.locator('.facet__title', { hasText: 'Price' }) });
    this.bedsBathsFacet = page.locator('.expansible', {
      has: page.locator('.facet__title', { hasText: 'Beds & Baths' }),
    });


    // Beds/Baths fieldsets
    this.bedroomsFieldset = page.locator('fieldset', {
      has: page.locator('legend', { hasText: 'Bedrooms' }),
    });
    this.bathroomsFieldset = page.locator('fieldset', {
      has: page.locator('legend', { hasText: 'Bathrooms' }),
    });

    // Update
    this.updateButton = page.locator('button[data-btn-facet="update"]');

    // Price facet (click para expandir)
    this.priceFacet = this.page.locator('.expansible', {
    has: this.page.locator('.facet__title', { hasText: 'Price' }),
    });

    // Inputs
    this.priceMinInput = this.page.locator('#priceMin');
    this.priceMaxInput = this.page.locator('#priceMax');  
    // captcha
    this.captchaModal = page.locator('#px-captcha-modal');
    this.captchaButton = this.captchaModal.getByRole('button', {
      name: /press\s*&?\s*hold/i,
    });
    this.pressHoldText = page.getByText(/press\s*&?\s*hold to confirm you are/i);
  }

  async open() {
    await this.page.goto('/state/washington/active-adult', { waitUntil: 'domcontentloaded' });
    await this.closeGooglePopupIfPresent();
    await this.ensureCaptchaCleared();
    await expect(this.resultCards.first()).toBeVisible({ timeout: 20_000 });
  }

  /** Signature used to verify results changed without relying on exact data */
  async getResultsSignature(): Promise<string> {
    const count = await this.resultCards.count();
    const firstTitle = (await this.firstCardTitle.textContent())?.trim() ?? '';
    return `${count}:${firstTitle}`;
  }

  // ------------------------
  // Filters
  // ------------------------

async applyPriceRange(min: number, max: number): Promise<void> {
  await this.closeGooglePopupIfPresent();
  await this.ensureCaptchaCleared();

  const before = await this.getResultsSignature().catch(() => 'UNKNOWN');

  // 1. Abrir el facet Price desde el summary (No Min)
  await this.page.locator('#nhs_PriceSummaryLow').click();

  const priceFacetBox = this.page.locator('.nhs_FacetBox', {
    has: this.page.locator('legend', { hasText: 'Price' }),
  });
  await priceFacetBox.waitFor({ state: 'visible' });

  const minInput = this.page.locator('#priceMin');
  const maxInput = this.page.locator('#priceMax');

  await minInput.click();
  await minInput.fill(String(min));
  await minInput.press('Enter');

  await maxInput.click();
  await maxInput.fill(String(max));
  await maxInput.press('Enter');

  await this.page.locator('button[data-btn-facet="update"]').click();

  await this.closeGooglePopupIfPresent();
  await this.ensureCaptchaCleared();

  // Esperar que haya resultados y que cambien (si no cambian, reportarlo claro)
  await expect(this.resultCards.first()).toBeVisible({ timeout: 20_000 });

  const after = await this.getResultsSignature().catch(() => 'UNKNOWN');

  if (before === after) {
    throw this.qaError('Filtro de precio aplicado, pero los resultados no cambiaron.', {
      min,
      max,
      beforeSignature: before,
      afterSignature: after,
      hint: 'Puede ser que el sitio ignore el filtro o que los datos no cambien. Revisar si el UI mostró los valores en el facet y si hubo recarga de resultados.',
    });
  }
}

async expectTopResultsWithinPriceRange(
  min: number,
  max: number,
  sampleSize = 5
): Promise<void> {
  // Guards de entorno
  await this.closeGooglePopupIfPresent();
  await this.ensureCaptchaCleared();

  // Asegurar que haya resultados visibles
  await expect(this.resultCards.first()).toBeVisible({ timeout: 20_000 });

  const count = await this.resultCards.count();
  const n = Math.min(sampleSize, count);

  for (let i = 0; i < n; i++) {
    const card = this.resultCards.nth(i);
    const { low, high } = await this.getCardPriceRange(card);

    // Validaciones defensivas (datos presentes)
   expect(low,`Card #${i + 1}: unable to read the minimum price (low/min_price attributes are missing or empty).`).not.toBeNull();

   expect(high,`Card #${i + 1}: unable to read the maximum price (high/max_price attributes are missing or empty).`).not.toBeNull();

    // Validación de rango
    expect(low!,`Card #${i + 1}: the minimum price (${low}) is below the expected minimum (${min}).`).toBeGreaterThanOrEqual(min);

    expect(high!,`Card #${i + 1} high price ${high} > max ${max}`).toBeLessThanOrEqual(max);
  }
}


//-------------------------


async applyBedsBaths(
  beds: 1 | 2 | 3 | 4 | 5,
  baths: 1 | 2 | 3 | 4 | 5
) {
  // guards por overlays/bloqueos
  await this.closeGooglePopupIfPresent();
  await this.ensureCaptchaCleared();

  // Open Beds & Baths facet
  await this.bedsBathsFacet.click();

  // por si el popup/captcha aparece tarde
  await this.closeGooglePopupIfPresent();
  await this.ensureCaptchaCleared();

  // scope a los fieldsets correctos
  const bedrooms = this.page.locator('fieldset', {
    has: this.page.locator('legend', { hasText: 'Bedrooms' }),
  });

  const bathrooms = this.page.locator('fieldset', {
    has: this.page.locator('legend', { hasText: 'Bathrooms' }),
  });

  await expect(bedrooms).toBeVisible({ timeout: 15_000 });
  await expect(bathrooms).toBeVisible({ timeout: 15_000 });

  // click al label asociado al radio (súper estable)
  await bedrooms.locator(`label[for="Beds${beds}"]`).click();
  await bathrooms.locator(`label[for="Baths${baths}"]`).click();

  await this.applyAndWaitForResultsRefresh();
}

private async applyAndWaitForResultsRefresh() {
  await expect(this.updateButton).toBeVisible({ timeout: 10_000 });
  await this.updateButton.click();

  await this.ensureCaptchaCleared();

  //  Assert correcto para UI pública
  await expect(this.resultCards.first()).toBeVisible({ timeout: 20_000 });
}

// --------GOOGLE----------------
  async closeGooglePopupIfPresent() {
    const frame = this.page.frameLocator('iframe');
    const closeBtn = frame.getByRole('button', { name: /close/i });
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
    }
  }

  // captcha
  async ensureCaptchaCleared() {
    const blocked = await this.pressHoldText.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!blocked) return;

    const hasButton = await this.captchaButton.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasButton) {
      throw this.qaError(
        'Anti-bot protection detected (Press & Hold captcha), but the action button was not found.',
        {
          url: this.page.url(),
          hint: 'Run the test in Firefox headed mode or retry later. The site intermittently blocks automation.',
        }
      );
    }


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

  private parseMoneyToNumber(value: string | null | undefined): number | null {
  if (!value) return null;
  // "$469,900" -> "469900"
  const cleaned = value.replace(/[$,\s]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

private async getCardPriceRange(card: import('@playwright/test').Locator): Promise<{ low: number | null; high: number | null }> {
  const lowAttr =
    (await card.getAttribute('data-segment-shared-community_low_price')) ??
    (await card.getAttribute('data-ga4-info-min_price')) ??
    null;

  const highAttr =
    (await card.getAttribute('data-segment-shared-community_high_price')) ??
    (await card.getAttribute('data-ga4-info-max_price')) ??
    null;

  return {
    low: this.parseMoneyToNumber(lowAttr),
    high: this.parseMoneyToNumber(highAttr),
  };
}

  private qaError(title: string, details: Record<string, any> = {}): Error {
    const pretty = Object.entries(details)
      .map(([k, v]) => `- ${k}: ${String(v)}`)
      .join('\n');

    return new Error(`${title}\n${pretty}`.trim());
  }



}