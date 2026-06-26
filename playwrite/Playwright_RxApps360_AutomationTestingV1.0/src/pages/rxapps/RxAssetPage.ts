import { Page } from "@playwright/test";
import { createBasePage } from "../BasePage";

// ─────────────────────────────────────────────────────────────────────────────
// RxAssetPage – the View Assets page inside the RxAsset™ module.
//
// This page object exposes only the actions needed for the search screenshot
// flow in the current test.
// ─────────────────────────────────────────────────────────────────────────────
export function createRxAssetPage(page: Page) {
  const basePage = createBasePage(page);
  const assetNavButton = page.locator('button[aria-label^="Assets"]');
  const viewAssetsButton = page.getByRole("button", { name: "View Assets" });

  async function enterAssetsView(): Promise<void> {
    // Try several locator strategies to find the sidebar "Assets" entry.
    const sidebarToggle = page.locator(
      'button[aria-label="Open menu"], button[aria-label="Collapse sidebar"], button[aria-label="Module Launcher"]'
    );

    const candidates = [
      page.getByRole("button", { name: /^Assets$/i }),
      page.getByRole("link", { name: /^Assets$/i }),
      page.locator('nav').getByText('Assets', { exact: true }),
      page.locator('button', { hasText: 'Assets' }),
      page.locator('[aria-label*="Assets"]'),
      assetNavButton,
    ];

    async function findVisibleCandidate(timeout = 3000) {
      for (const c of candidates) {
        try {
          if (await basePage.isVisible(c, { timeout })) return c;
        } catch {
          // ignore and try next
        }
      }
      return null;
    }

    // 1) quick scan
    let navToUse = await findVisibleCandidate(2000);

    // 2) if not found, try opening the sidebar then scan again
    if (!navToUse) {
      if (await basePage.isVisible(sidebarToggle, { timeout: 2000 })) {
        await basePage.click(sidebarToggle, { description: 'open/expand sidebar' });
        await basePage.waitForNetworkIdle();
      }
      navToUse = await findVisibleCandidate(5000);
    }

    // 3) final attempt: wait for any candidate to become visible (throws if none)
    if (!navToUse) {
      const last = candidates[0];
      await basePage.waitForVisible(last, { description: 'Assets navigation button', timeout: 30_000 });
      navToUse = last;
    }

    await basePage.click(navToUse, { description: 'Assets navigation button' });

    await basePage.waitForVisible(viewAssetsButton, { description: 'View Assets button', timeout: 30_000 });
    await basePage.click(viewAssetsButton, { description: 'View Assets button' });
    await basePage.waitForNetworkIdle();
  }

  return {
    ...basePage,
    enterAssetsView,
  };
}

export type RxAssetPage = ReturnType<typeof createRxAssetPage>;
